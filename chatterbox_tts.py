"""Chatterbox TTS API on Modal.

Uses the same AWS-style storage configuration as the app:
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_BUCKET_NAME

Optional for S3-compatible providers (for example, Cloudflare R2):
- AWS_S3_ENDPOINT_URL

Create the storage secret on Modal (name defaults to aws-storage):
    modal secret create aws-storage \
        AWS_ACCESS_KEY_ID=<access-key-id> \
        AWS_SECRET_ACCESS_KEY=<secret-access-key> \
        AWS_BUCKET_NAME=<bucket-name> \
        AWS_REGION=<region>

Create API key secret:
    modal secret create chatterbox-api-key \
        CHATTERBOX_API_KEY=<your-api-key>

Example local test:
  modal run chatterbox_tts.py \
    --prompt "Hello from Chatterbox [chuckle]." \
    --voice-key "voices/system/<voice-id>.wav"
"""

# AI explanation: Modal-deployed TTS service (/generate) — clones voice from S3 voice_key; consumed by src/lib/chatterbox-client.ts.

from __future__ import annotations

import os
from pathlib import Path
import importlib

import modal

load_dotenv = None
try:
    # Local convenience: load .env before resolving bucket mount at import time.
    load_dotenv = getattr(importlib.import_module("dotenv"), "load_dotenv", None)
except Exception:  # pragma: no cover
    pass

if load_dotenv is not None:
    env_file = Path(__file__).with_name(".env")
    if env_file.exists():
        load_dotenv(dotenv_path=env_file)


# -----------------------------------------------------------------------------
# Operations Runbook (comments only)
# -----------------------------------------------------------------------------
# This section captures the exact workflow used to get this app deployed.
# Safe to keep for future debugging/redeploys.
#
# FRESH START
# -----------------------------------------------------------------------------
# 0) Generate fresh credentials:
#    - New Hugging Face token
#    - New CHATTERBOX_API_KEY
#
# 1) Install/auth Modal CLI:
#    pip install modal
#    python -m modal setup
#
# 2) Create secrets:
#    python -m modal secret create hf-token HF_TOKEN=<NEW_HF_TOKEN>
#
#    python -m modal secret create chatterbox-api-key \
#      CHATTERBOX_API_KEY=<NEW_API_KEY>
#
#    python -m modal secret create aws-storage \
#      AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> \
#      AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> \
#      AWS_BUCKET_NAME=<BUCKET_NAME> \
#      AWS_REGION=<REGION>
#
#    Optional:
#      AWS_S3_ENDPOINT_URL=https://<accountid>.r2.cloudflarestorage.com
#
# 3) Local deploy-time env vars (PowerShell):
#    $env:AWS_BUCKET_NAME = "<BUCKET_NAME>"
#    $env:AWS_REGION = "<REGION>"
#
#    Optional:
#    $env:AWS_MODAL_SECRET_NAME = "aws-storage"
#    $env:AWS_S3_ENDPOINT_URL = "https://<accountid>.r2.cloudflarestorage.com"
#
# 4) Deploy:
#    python -m modal deploy chatterbox_tts.py
#
# 5) Smoke test:
#    curl -X POST "https://<your-modal-endpoint>/generate" \
#      -H "Content-Type: application/json" \
#      -H "x-api-key: <API_KEY>" \
#      -d '{"prompt":"Hello","voice_key":"voices/system/default.wav"}' \
#      --output output.wav
#
# 6) Common failures:
#    - "modal not recognized" -> use python -m modal
#    - AWS_BUCKET_NAME missing -> set env var / secret
#    - 403 -> wrong x-api-key
#    - voice missing -> bad storage key
#
# SECURITY NOTES
# -----------------------------------------------------------------------------
# - Storage mount is read-only.
# - API is protected via x-api-key.
# - Voice paths are sanitized to prevent traversal.
# - Internal exceptions are not leaked to clients.
#
# PET PROJECT NOTES
# -----------------------------------------------------------------------------
# Current tradeoffs intentionally accepted:
# - wildcard CORS
# - shared API key auth
# - no rate limiting
#
# Fine for hobby/internal use. Revisit for production SaaS.


# -----------------------------------------------------------------------------
# Storage configuration
# -----------------------------------------------------------------------------
AWS_BUCKET_NAME = os.environ.get("AWS_BUCKET_NAME", "")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL", "")
BUCKET_MOUNT_PATH = "/storage"
STORAGE_SECRET_NAME = os.environ.get("AWS_MODAL_SECRET_NAME", "aws-storage")

# Non-secret fallback to avoid import-time crash loops.
DEFAULT_AWS_BUCKET_NAME = "resona-507673060976-us-east-1-an"


def _resolve_bucket_name() -> str:
    # Read env at call time, not just import time.
    bucket = os.environ.get("AWS_BUCKET_NAME", "").strip() or AWS_BUCKET_NAME.strip()

    if not bucket:
        bucket = DEFAULT_AWS_BUCKET_NAME

    if bucket:
        return bucket

    raise ValueError(
        "AWS_BUCKET_NAME is required. Set it in your environment or Modal secrets."
    )


def _build_bucket_mount() -> modal.CloudBucketMount:
    endpoint = AWS_S3_ENDPOINT_URL.strip() or None

    return modal.CloudBucketMount(
        _resolve_bucket_name(),
        bucket_endpoint_url=endpoint,
        secret=modal.Secret.from_name(STORAGE_SECRET_NAME),
        read_only=True,
    )


# -----------------------------------------------------------------------------
# Modal setup
# -----------------------------------------------------------------------------
image = modal.Image.debian_slim(python_version="3.10").uv_pip_install(
    "chatterbox-tts==0.1.6",
    "fastapi[standard]==0.124.4",
    "peft==0.18.0",
)

app = modal.App("chatterbox-tts", image=image)


with image.imports():
    import io
    import os
    from pathlib import Path

    import torchaudio as ta
    from chatterbox.tts_turbo import ChatterboxTurboTTS
    from fastapi import Depends, FastAPI, HTTPException, Security
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
    from fastapi.security import APIKeyHeader
    from pydantic import BaseModel, Field

    api_key_scheme = APIKeyHeader(
        name="x-api-key",
        scheme_name="ApiKeyAuth",
        auto_error=False,
    )

    def verify_api_key(x_api_key: str | None = Security(api_key_scheme)):
        expected = os.environ.get("CHATTERBOX_API_KEY", "")

        if not expected or x_api_key != expected:
            raise HTTPException(status_code=403, detail="Invalid API key")

        return x_api_key

    class TTSRequest(BaseModel):
        """Request model for text-to-speech generation."""

        prompt: str = Field(..., min_length=1, max_length=5000)
        voice_key: str = Field(..., min_length=1, max_length=300)
        temperature: float = Field(default=0.8, ge=0.0, le=2.0)
        top_p: float = Field(default=0.95, ge=0.0, le=1.0)
        top_k: int = Field(default=1000, ge=1, le=10000)
        repetition_penalty: float = Field(default=1.2, ge=1.0, le=2.0)
        norm_loudness: bool = Field(default=True)


@app.cls(
    gpu="a10g",
    scaledown_window=60 * 5,
    secrets=[
        modal.Secret.from_name("hf-token"),
        modal.Secret.from_name("chatterbox-api-key"),
        modal.Secret.from_name(STORAGE_SECRET_NAME),
    ],
    volumes={BUCKET_MOUNT_PATH: _build_bucket_mount()},
)
@modal.concurrent(max_inputs=3)
class Chatterbox:
    @modal.enter()
    def load_model(self):
        self.model = ChatterboxTurboTTS.from_pretrained(device="cuda")

    @modal.asgi_app()
    def serve(self):
        web_app = FastAPI(
            title="Chatterbox TTS API",
            description="Text-to-speech with voice cloning",
            docs_url="/docs",
            dependencies=[Depends(verify_api_key)],
        )

        web_app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        @web_app.post("/generate", responses={200: {"content": {"audio/wav": {}}}})
        def generate_speech(request: TTSRequest):
            voice_key = Path(request.voice_key)

            if voice_key.is_absolute() or ".." in voice_key.parts:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid voice path",
                )

            voice_path = Path(BUCKET_MOUNT_PATH) / voice_key

            if not voice_path.exists():
                raise HTTPException(
                    status_code=400,
                    detail=f"Voice not found at '{request.voice_key}'",
                )

            try:
                audio_bytes = self.generate.local(
                    request.prompt,
                    str(voice_path),
                    request.temperature,
                    request.top_p,
                    request.top_k,
                    request.repetition_penalty,
                    request.norm_loudness,
                )

                return StreamingResponse(
                    io.BytesIO(audio_bytes),
                    media_type="audio/wav",
                )

            except Exception:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to generate audio",
                )

        return web_app

    @modal.method()
    def generate(
        self,
        prompt: str,
        audio_prompt_path: str,
        temperature: float = 0.8,
        top_p: float = 0.95,
        top_k: int = 1000,
        repetition_penalty: float = 1.2,
        norm_loudness: bool = True,
    ):
        wav = self.model.generate(
            prompt,
            audio_prompt_path=audio_prompt_path,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
            repetition_penalty=repetition_penalty,
            norm_loudness=norm_loudness,
        )

        buffer = io.BytesIO()
        ta.save(buffer, wav, self.model.sr, format="wav")
        buffer.seek(0)
        return buffer.read()


@app.local_entrypoint()
def test(
    prompt: str = "Chatterbox running on Modal [chuckle].",
    voice_key: str = "voices/system/default.wav",
    output_path: str = "/tmp/chatterbox-tts/output.wav",
    temperature: float = 0.8,
    top_p: float = 0.95,
    top_k: int = 1000,
    repetition_penalty: float = 1.2,
    norm_loudness: bool = True,
):
    import pathlib

    chatterbox = Chatterbox()

    audio_prompt_path = f"{BUCKET_MOUNT_PATH}/{voice_key}"

    audio_bytes = chatterbox.generate.remote(
        prompt=prompt,
        audio_prompt_path=audio_prompt_path,
        temperature=temperature,
        top_p=top_p,
        top_k=top_k,
        repetition_penalty=repetition_penalty,
        norm_loudness=norm_loudness,
    )

    output_file = pathlib.Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_bytes(audio_bytes)

    print(f"Audio saved to {output_file}")
