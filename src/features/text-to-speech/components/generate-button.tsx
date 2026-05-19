"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

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
  return (
    <Button
      type="button"
      size={size}
      className={`min-w-[160px] cursor-pointer ${className ?? ""}`}
      onClick={onSubmit}
      disabled={disabled}
    >
      {isSubmitting ? (
        <>
          <Spinner className="size-4" />
          Synthesizing...
        </>
      ) : (
        "Generate speech"
      )}
    </Button>
  );
}
