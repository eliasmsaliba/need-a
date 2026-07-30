import { cn } from "@/lib/cn";

export interface StepRailItem {
  key: string;
  label: string;
}

interface StepRailProps {
  steps: StepRailItem[];
  activeIndex: number;
  className?: string;
}

export function StepRail({ steps, activeIndex, className }: StepRailProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {steps.map((step, i) => {
        const active = i === activeIndex;
        const completed = i < activeIndex;
        return (
          <div
            key={step.key}
            className={cn(
              "flex items-center gap-2.5 py-2.5 px-3 rounded-md",
              active && "bg-neutral-800",
            )}
          >
            <div
              className={cn(
                "w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center text-[10px] font-semibold",
                completed || active
                  ? "bg-accent-500 text-bg"
                  : "bg-neutral-800 text-neutral-500",
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-[13px]",
                active
                  ? "text-text"
                  : completed
                    ? "text-neutral-300"
                    : "text-neutral-500",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
