"use client";

import { useUser } from "@clerk/nextjs";
import { Headphones, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { isLoaded, user } = useUser();

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Nice to see you</p>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight relative h-[40px]">
          <span
            className={`absolute left-0 whitespace-nowrap transition-all duration-300 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"
            }`}
          >
            {user?.fullName ?? user?.firstName ?? "there"}
          </span>

          <span
            className={`absolute left-0  mt-2 flex items-center gap-1 transition-all duration-300 ease-out ${
              isLoaded ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[oklch(0.72_0.13_25)] animate-bounce [animation-delay:-0.2s]" />
            <span className="w-4 h-4 rounded-full bg-[oklch(0.75_0.15_300)] animate-bounce [animation-delay:-0.1s]" />
            <span className="w-4 h-4 rounded-full bg-[oklch(0.72_0.13_25)] animate-bounce" />
          </span>
        </h1>
      </div>

      <div className="lg:flex items-center gap-3 hidden">
        <Button variant="accentFill" size="sm" asChild>
          <Link href="https://github.com/verkiya">
            <ThumbsUp />
            <span className="hidden lg:block">Feedback</span>
          </Link>
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="https://github.com/verkiya">
            <Headphones />
            <span className="hidden lg:block">Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
