import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function DoneStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, bizFirstName } = flow;

  return (
    <div className="flex flex-col gap-3.5 items-start">
      <Tag variant="accent">Application submitted</Tag>
      <h2 className="text-[22px] font-medium">Thanks, {bizFirstName} — you&apos;re under review</h2>
      <p className="text-[13px] text-neutral-400 max-w-[60ch]">
        Verification typically takes 24–48 hours. We&apos;ll email you at {state.accEmail}{" "}
        once you&apos;re approved to start accepting jobs.
      </p>
      <Card className="p-4 gap-1.5 max-w-[420px]">
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Categories</span>
          <span>{state.selectedCategories.join(", ") || "—"}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Service radius</span>
          <span>{state.serviceRadius} km</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Rate</span>
          <span>
            R{state.hourlyRate}/h + R{state.calloutFee} call-out
          </span>
        </div>
      </Card>
    </div>
  );
}
