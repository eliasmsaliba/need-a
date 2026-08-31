import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gradient";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: boolean;
  block?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 border-accent-600 text-neutral-100 shadow-[var(--shadow-glow-sm)] hover:bg-accent hover:shadow-[var(--shadow-glow-md)] active:bg-accent-700",
  secondary:
    "border-divider hover:bg-text/7 active:bg-text/14",
  ghost:
    "text-accent border-transparent px-(--space-1) hover:bg-accent/10 active:bg-accent/18",
  gradient:
    "border-transparent text-white bg-[image:var(--gradient-hero)] shadow-[var(--shadow-glow-md)] hover:brightness-110 active:brightness-95",
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
          "transition-all duration-200 ease-out",
          "disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none",
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
