import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "ok" | "warn" | "hot" | "pri" | "selv";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs tracking-wide",
        tone === "neutral" && "bg-raised text-muted",
        tone === "ok" && "bg-ok/15 text-ok",
        tone === "warn" && "bg-warn/15 text-warn",
        tone === "hot" && "bg-hot/15 text-hot",
        tone === "pri" && "bg-pri/15 text-pri",
        tone === "selv" && "bg-selv/15 text-selv",
        className,
      )}
    >
      {children}
    </span>
  );
}
