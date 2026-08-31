import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TagVariant = "accent" | "accent-2" | "accent-3" | "neutral" | "outline";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variantClasses: Record<TagVariant, string> = {
  accent: "bg-accent-800 text-accent-100",
  "accent-2": "bg-accent-2-800 text-accent-2-100",
  "accent-3": "bg-accent-3-800 text-accent-3-100",
  neutral: "bg-neutral-800 text-neutral-100",
  outline: "border border-accent text-accent",
};

export function Tag({ variant = "neutral", className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] tracking-wide py-[3px] px-2.5 rounded-[6px]",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
