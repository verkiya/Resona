import { useMemo } from "react";
import { micah } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export function useVoiceAvatar(seed: string) {
  return useMemo(() => {
    return createAvatar(micah, {
      seed,
      size: 128,

      backgroundColor: [
        "fde2e4",
        "fbcfe8",
        "f5d0fe",
        "ede9fe",
        "ffedd5",
      ],

      baseColor: [
        "f8d5c2",
        "f5c7a9",
        "f2d3b1",
        "f6d7c3",
        "edd0b6",
      ],

      eyes: [
        "smiling",
        "round",
      ],

      mouth: [
        "smile",
        "laughing",
      ],

      eyebrows: [
        "up",
        "eyelashesUp",
      ],
      hair: [
        "dannyPhantom","fonze","full","mrT","pixie"
      ]

    }).toDataUri();
  }, [seed]);
}
