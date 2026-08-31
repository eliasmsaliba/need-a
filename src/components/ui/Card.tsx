import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: "sm" | "md" | "lg" | "glow";
}

const elevationClasses = {
  sm: "shadow-[var(--shadow-sm)]",
  md: "shadow-[var(--shadow-md)]",
  lg: "shadow-[var(--shadow-lg)]",
  glow: "shadow-[var(--shadow-glow-md)] transition-shadow duration-200 hover:shadow-[var(--shadow-glow-lg)]",
};

export function Card({ elevation, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-(--space-3) rounded-md bg-surface",
        elevation && elevationClasses[elevation],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
