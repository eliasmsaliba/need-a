import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: boolean;
  block?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "text-accent border-accent hover:bg-accent/12 active:bg-accent/22",
  secondary:
    "border-divider hover:bg-text/7 active:bg-text/14",
  ghost:
    "text-accent border-transparent px-(--space-1) hover:bg-accent/10 active:bg-accent/18",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "secondary", icon, block, className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 cursor-pointer",
          "font-medium text-sm leading-tight rounded-md border",
          "disabled:opacity-45 disabled:cursor-not-allowed",
          icon
            ? "w-9 h-9 p-0"
            : "py-(--space-2) px-[10px]",
          block && "w-full mt-(--space-2)",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
