import { STEP_LABELS } from "./data";
import type { StepKey } from "./types";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

interface StepRailProps {
  seq: StepKey[];
  stepIdx: number;
}

export function StepRail({ seq, stepIdx }: StepRailProps) {
  return (
    <aside className="w-full md:w-[260px] shrink-0 flex flex-col gap-1">
      {seq.map((key, i) => {
        const active = i === stepIdx;
        const completed = i < stepIdx;
        return (
          <div
            key={key}
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
              {STEP_LABELS[key]}
            </span>
          </div>
        );
      })}

      <Card className="mt-6 p-4 gap-2.5">
        <span className="text-[13px] font-medium">Why customers trust Need-A</span>
        <div className="flex flex-col gap-1.5">
          <Tag variant="outline" className="w-fit">
            ID-verified pros
          </Tag>
          <Tag variant="outline" className="w-fit">
            30–90 day guarantee
          </Tag>
          <Tag variant="outline" className="w-fit">
            Upfront pricing
          </Tag>
        </div>
      </Card>
    </aside>
  );
}
