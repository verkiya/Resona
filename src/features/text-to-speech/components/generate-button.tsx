/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const loadingMessages = [
  "Synthesizing voice...",
  "Warming up the vocal cords...",
  "Teaching electrons to speak...",
  "Breathing life into text...",
  "Rendering your narrator...",
  "Tuning resonance...",
  "Giving your words a voice...",
];

export function GenerateButton({
  size,
  disabled,
  isSubmitting,
  onSubmit,
  className,
}: {
  size?: "default" | "sm";
  disabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  className?: string;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  return (
    <Button
      type="button"
      size={size}
      className={`min-w-[260px] cursor-pointer ${className ?? ""}`}
      onClick={onSubmit}
      disabled={disabled}
    >
      {isSubmitting ? (
        <div className="flex items-center gap-2">
          <Spinner className="size-4 shrink-0" />

          <span
            key={messageIndex}
            className="inline-block animate-in fade-in slide-in-from-right-1 duration-700"
          >
            {loadingMessages[messageIndex]}
          </span>
        </div>
      ) : (
        "Generate speech"
      )}
    </Button>
  );
}
