import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { DAYS } from "../data";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function AvailabilityStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch, dispatch } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Availability &amp; rates</h2>
      <Field label="Working days" className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day) => (
            <ChipToggle
              key={day}
              label={day}
              active={state.selectedDays.includes(day)}
              onToggle={() => dispatch({ type: "TOGGLE_DAY", day })}
            />
          ))}
        </div>
      </Field>
      <div className="flex gap-5 max-w-[420px]">
        <Field label="Start time" className="flex-1">
          <Input
            type="time"
            value={state.startTime}
            onChange={(e) => patch({ startTime: e.target.value })}
          />
        </Field>
        <Field label="End time" className="flex-1">
          <Input
            type="time"
            value={state.endTime}
            onChange={(e) => patch({ endTime: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex gap-5 max-w-[420px]">
        <Field label="Hourly rate (R)" className="flex-1">
          <Input
            type="number"
            value={state.hourlyRate}
            onChange={(e) => patch({ hourlyRate: Number(e.target.value) })}
          />
        </Field>
        <Field label="Call-out fee (R)" className="flex-1">
          <Input
            type="number"
            value={state.calloutFee}
            onChange={(e) => patch({ calloutFee: Number(e.target.value) })}
          />
        </Field>
      </div>
    </>
  );
}
