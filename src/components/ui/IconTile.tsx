import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

interface IconTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  label: string;
  selected?: boolean;
  badge?: ReactNode;
  href?: string;
}

export function IconTile({ icon: IconCmp, label, selected, badge, href, className, ...props }: IconTileProps) {
  const tileClass = cn(
    "group flex flex-col items-center gap-2.5 p-(--space-4) rounded-lg border cursor-pointer text-center",
    "transition-all duration-200 ease-out bg-surface",
    selected
      ? "border-accent shadow-[var(--shadow-glow-md)]"
      : "border-divider hover:border-accent-600 hover:shadow-[var(--shadow-glow-sm)]",
    className,
  );

  const iconWrap = (
    <span
      className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg text-2xl",
        selected
          ? "bg-[image:var(--gradient-hero)] text-white"
          : "bg-accent-900 text-accent-300 group-hover:bg-[image:var(--gradient-hero)] group-hover:text-white",
      )}
    >
      <IconCmp weight={selected ? "fill" : "duotone"} />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={tileClass}>
        {iconWrap}
        <span className="text-sm font-medium">{label}</span>
        {badge}
      </Link>
    );
  }

  return (
    <button type="button" className={tileClass} {...props}>
      {iconWrap}
      <span className="text-sm font-medium">{label}</span>
      {badge}
    </button>
  );
}
