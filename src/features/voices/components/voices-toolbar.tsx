// Search and filters for the voices page (synced to URL via nuqs).
import { useState } from "react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { voicesSearchParams } from "@/features/voices/lib/params";
import { VoiceCreateDialog } from "./voice-create-dialog";

interface VoicesToolbarProps {
  totalVoices?: number;
}

export function VoicesToolbar({ totalVoices }: VoicesToolbarProps) {
  const [query, setQuery] = useQueryState("query", voicesSearchParams.query);
  const [localQuery, setLocalQuery] = useState(query);

  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value),
    200,
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
            Voice Library
          </h2>

          {typeof totalVoices === "number" && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {totalVoices} voice{totalVoices !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Browse built-in voices or create your own custom clone.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup
          className="
            lg:max-w-md
            rounded-2xl
            border border-border/40
            bg-card/30
            shadow-sm
            backdrop-blur-xl
            transition-all
            focus-within:border-primary/30
            focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]
          "
        >
          <InputGroupAddon className="border-0">
            <Search className="size-4 text-muted-foreground/70" />
          </InputGroupAddon>

          <InputGroupInput
            placeholder="Search voices..."
            value={localQuery}
            className="
              border-0
             
              shadow-none
              focus-visible:ring-0
              focus-visible:border-0
              focus:outline-none
            "
            onChange={(e) => {
              setLocalQuery(e.target.value);
              debouncedSetQuery(e.target.value);
            }}
          />
        </InputGroup>

        <VoiceCreateDialog>
          <Button
            size="sm"
            variant="pillGradient"
            className="w-full cursor-pointer rounded-xl px-4 shadow-sm lg:ml-auto lg:w-auto"
          >
            <Sparkles className="size-4" />
            Custom voice
          </Button>
        </VoiceCreateDialog>
      </div>
    </div>
  );
}
