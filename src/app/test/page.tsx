"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Sonner Toast Test
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() =>
            toast("Default toast", {
              description: "This is the default Resona notification.",
            })
          }
        >
          Default
        </Button>

        <Button
          onClick={() =>
            toast.success("Voice generated successfully", {
              description: "Your studio-quality speech is ready.",
            })
          }
        >
          Success
        </Button>

        <Button
          onClick={() =>
            toast.error("Generation failed", {
              description: "Something went wrong while synthesizing audio.",
            })
          }
        >
          Error
        </Button>

        <Button
          onClick={() =>
            toast.warning("Credits running low", {
              description: "Top up soon to keep generating.",
            })
          }
        >
          Warning
        </Button>

        <Button
          onClick={() =>
            toast.info("New voice pack available", {
              description: "Fresh premium voices have been added.",
            })
          }
        >
          Info
        </Button>

        <Button
          onClick={() =>
            toast.loading("Synthesizing voice...", {
              description: "This may take a few seconds.",
            })
          }
        >
          Loading
        </Button>

        <Button
          onClick={() => toast.dismiss()}
          variant="outline"
          className="col-span-2"
        >
          Dismiss All
        </Button>
      </div>
    </div>
  );
}
