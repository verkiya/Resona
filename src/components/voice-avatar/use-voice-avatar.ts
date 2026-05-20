import { useMemo } from "react";
import { micah } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export function useVoiceAvatar(seed: string) {
  return useMemo(() => {
    return createAvatar(micah, {
      seed,
      size: 128,
      backgroundColor: ["fde2e4", "fbcfe8", "f5d0fe", "ede9fe", "ffedd5"],
    }).toDataUri();
  }, [seed]);
}
