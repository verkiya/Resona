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
        AWS_SECRET_ACCESS_KEY=<secret-access-key>

Create API key secret:
    modal secret create chatterbox-api-key \
        CHATTERBOX_API_KEY=<your-api-key>

Example local test:
  modal run chatterbox_tts.py \
    --prompt "Hello from Chatterbox [chuckle]." \
    --voice-key "voices/system/<voice-id>.wav"
"""

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
# It is safe to keep in source for future debugging and redeploys.
#
# FRESH START (delete old Modal secrets/tokens and start over)
# -----------------------------------------------------------------------------
# 0) Generate fresh credentials first:
#    - New Hugging Face token.
#    - New API key for CHATTERBOX_API_KEY.
#
# 1) Install and authenticate Modal CLI:
#    pip install modal
#    python -m modal setup
#
# 2) Create required Modal secrets (exact names used by this script):
#    python -m modal secret create hf-token HF_TOKEN=<NEW_HF_TOKEN>
#    python -m modal secret create chatterbox-api-key \
#      CHATTERBOX_API_KEY=<NEW_API_KEY>
#
#    # Storage secret used by CloudBucketMount and runtime env:
#    python -m modal secret create aws-storage \
#      AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> \
#      AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> \
#      AWS_BUCKET_NAME=resona-507673060976-us-east-1-an \
#      AWS_REGION=us-east-1
#
#    # Optional for R2/custom endpoint mode:
#    # AWS_S3_ENDPOINT_URL=https://<accountid>.r2.cloudflarestorage.com
#
# 3) Set local deploy-time env vars in PowerShell (same terminal session):
#    $env:AWS_BUCKET_NAME = "resona-507673060976-us-east-1-an"
#    $env:AWS_REGION = "us-east-1"
#
#    # Optional if using non-default secret name:
#    # $env:AWS_MODAL_SECRET_NAME = "aws-storage"
#
#    # Optional for custom endpoint:
#    # $env:AWS_S3_ENDPOINT_URL = "https://<accountid>.r2.cloudflarestorage.com"
#
# 4) Deploy:
#    python -m modal deploy chatterbox_tts.py
#
# 5) Smoke test endpoint:
#    curl -X POST "https://<your-modal-endpoint>/generate" \
#      -H "Content-Type: application/json" \
#      -H "x-api-key: <NEW_API_KEY>" \
#      -d '{"prompt":"Hello from Chatterbox [chuckle].","voice_key":"voices/system/<voice-id>.wav"}' \
#      --output output.wav
#
# 6) If it fails with "AWS_BUCKET_NAME is required":
#    - Local deploy failure: set $env:AWS_BUCKET_NAME in your shell.
#    - Runtime crash-loop: ensure aws-storage secret includes AWS_BUCKET_NAME.
#
# ORIGINAL R2 / TESTING NOTES
# -----------------------------------------------------------------------------
# Use this to add R2 tokens:
#   modal secret create cloudflare-r2 \
#     AWS_ACCESS_KEY_ID=<r2-access-key-id> \
#     AWS_SECRET_ACCESS_KEY=<r2-secret-access-key>
#
# R2 cloud bucket mount (read-only, replaces Modal Volume):
#   R2_BUCKET_NAME = "resonance-app"
#   R2_ACCOUNT_ID = "ea63931e6e8ff54c5be60feacd3026d6"
#   R2_MOUNT_PATH = "/r2"
#   r2_bucket = modal.CloudBucketMount(
#       R2_BUCKET_NAME,
#       bucket_endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
#       secret=modal.Secret.from_name("cloudflare-r2"),
#       read_only=True,
#   )
#
# Use this to test locally:
#   modal run chatterbox_tts.py \
#     --prompt "Hello from Chatterbox [chuckle]." \
#     --voice-key "voices/system/<voice-id>.wav"
#
# Use this to test CURL:
#   curl -X POST "https://<your-modal-endpoint>/generate" \
#     -H "Content-Type: application/json" \
#     -H "X-Api-Key: <your-api-key>" \
#     -d '{"prompt": "Hello from Chatterbox [chuckle].", "voice_key": "voices/system/<voice-id>.wav"}' \
#     --output output.wav
# -----------------------------------------------------------------------------
#
# 1) Why we use "python -m modal" on Windows:
#    - If "modal" is not on PATH, "modal ..." fails with "not recognized".
#    - "python -m modal ..." runs Modal's CLI module from the active Python.
#
# 2) One-time Modal auth:
#    python -m modal setup
#
# 3) Create required secrets:
#    python -m modal secret create hf-token HF_TOKEN=<your-hf-token>
#    python -m modal secret create chatterbox-api-key CHATTERBOX_API_KEY=<api-key>
#
#    Storage/runtime secret (name must match STORAGE_SECRET_NAME).
#    Include AWS_BUCKET_NAME so container imports can resolve bucket config:
#    python -m modal secret create aws-storage \
#        AWS_ACCESS_KEY_ID=<access-key-id> \
#        AWS_SECRET_ACCESS_KEY=<secret-access-key> \
#        AWS_BUCKET_NAME=resona-507673060976-us-east-1-an \
#        AWS_REGION=us-east-1
#
#    Optional for R2/custom endpoint mode:
#        AWS_S3_ENDPOINT_URL=https://<accountid>.r2.cloudflarestorage.com
#
# 4) Set deploy-time environment variables in PowerShell (same shell session).
#    These are required because _build_bucket_mount() executes at import time locally:
#    $env:AWS_BUCKET_NAME = "resona-507673060976-us-east-1-an"
#    $env:AWS_REGION = "us-east-1"
#
#    Alternative: put these keys in a local .env file in this repo root.
#    The script auto-loads .env for local deploy/run:
#      AWS_BUCKET_NAME=resona-507673060976-us-east-1-an
#      AWS_REGION=us-east-1
#      AWS_MODAL_SECRET_NAME=aws-storage
#
#    Script fallback behavior:
#    - If AWS_BUCKET_NAME is missing, code falls back to
#      DEFAULT_AWS_BUCKET_NAME in this file.
#    - Override by setting AWS_BUCKET_NAME in local shell or Modal secret.
#
#    Optional for R2/custom S3 endpoint:
#    $env:AWS_S3_ENDPOINT_URL = "https://<accountid>.r2.cloudflarestorage.com"
#
#    Optional if using a non-default storage secret name:
#    $env:AWS_MODAL_SECRET_NAME = "aws-storage"
#
# 5) Deploy:
#    python -m modal deploy chatterbox_tts.py
#
# 6) Local function test (writes a wav file):
#    python -m modal run chatterbox_tts.py \
#        --prompt "Hello from Chatterbox [chuckle]." \
#        --voice-key "voices/system/<voice-id>.wav"
#
# 7) Endpoint test with curl:
#    curl -X POST "https://<your-modal-endpoint>/generate" \
#      -H "Content-Type: application/json" \
#      -H "x-api-key: <your-api-key>" \
#      -d '{"prompt":"Hello from Chatterbox [chuckle].","voice_key":"voices/system/<voice-id>.wav"}' \
#      --output output.wav
#
# 8) Common failures and fixes:
#    - "modal: not recognized": use "python -m modal ...".
#    - "AWS_BUCKET_NAME is required" during deploy: set $env:AWS_BUCKET_NAME.
#    - "AWS_BUCKET_NAME is required" in Modal logs/crash-looping: add
#      AWS_BUCKET_NAME to the aws-storage secret and redeploy.
#    - 403 Invalid API key: verify x-api-key header matches CHATTERBOX_API_KEY.
#    - Voice not found: verify object key exists under /storage/<voice_key>.
#
# 9) Rotate credentials if leaked in logs/chat history:
#    - Regenerate HF token and API key.
#    - Recreate corresponding Modal secrets with new values.
# -----------------------------------------------------------------------------


# Storage configuration (aligned with the existing app env contract)
AWS_BUCKET_NAME = os.environ.get("AWS_BUCKET_NAME", "")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL", "")
R2_MOUNT_PATH = "/storage"
STORAGE_SECRET_NAME = os.environ.get("AWS_MODAL_SECRET_NAME", "aws-storage")
# Non-secret fallback used to avoid container import crash loops.
DEFAULT_AWS_BUCKET_NAME = "resona-507673060976-us-east-1-an"


def _resolve_bucket_name() -> str:
    # Read env at call time (not only at module import), then fall back.
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


# Modal setup
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
    volumes={R2_MOUNT_PATH: _build_bucket_mount()},
)
@modal.concurrent(max_inputs=10)
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
            voice_path = Path(R2_MOUNT_PATH) / request.voice_key
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
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate audio: {e}",
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
    audio_prompt_path = f"{R2_MOUNT_PATH}/{voice_key}"
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
