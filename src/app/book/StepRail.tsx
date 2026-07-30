import { STEP_LABELS } from "./data";
import type { StepKey } from "./types";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { StepRail as BaseStepRail } from "@/components/ui/StepRail";

interface StepRailProps {
  seq: StepKey[];
  stepIdx: number;
}

export function StepRail({ seq, stepIdx }: StepRailProps) {
  return (
    <aside className="w-full md:w-[260px] shrink-0 flex flex-col gap-1">
      <BaseStepRail
        steps={seq.map((key) => ({ key, label: STEP_LABELS[key] }))}
        activeIndex={stepIdx}
      />

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
