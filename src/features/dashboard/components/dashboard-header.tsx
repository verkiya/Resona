"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { FaGithub } from "react-icons/fa";

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
        </h1>{" "}
        <p className="text-sm text-muted-foreground">
          Ready to generate something new?
        </p>
      </div>

      <div className="lg:flex items-center gap-3 hidden">
        <Link
          href="https://github.com/verkiya/Resona"
          target="_blank"
          rel="noopener noreferrer"
          className="group elevated flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-4 py-2 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg  cursor-[url('/resona.png')_0_0,pointer]"
        >
          <FaGithub className="h-5 w-5 transition-all duration-500 ease-out group-hover:rotate-[18deg] group-hover:scale-110 group-hover:text-primary" />

          <span className=" text-sm font-medium sm:block">
            Source Code
          </span>
        </Link>
      </div>
    </div>
  );
}
