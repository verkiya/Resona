// Shared page title/subtitle header used by dashboard feature views.
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export function PageHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">

        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
       <Link
          href="https://github.com/verkiya/Resona"
          target="_blank"
          rel="noopener noreferrer"
          className="group elevated flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-4 py-2 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg  cursor-[url('/resona.png')_0_0,pointer]"
        >
          <FaGithub className="h-5 w-5 transition-all duration-500 ease-out group-hover:rotate-18 group-hover:scale-110 group-hover:text-primary" />

          <span className=" text-sm font-medium sm:block">
            Source Code
          </span>
        </Link>
      </div>
    </div>
  );
}
