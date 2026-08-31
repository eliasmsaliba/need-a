import { CATEGORIES } from "../data";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import type { BookingFlow } from "../useBookingFlow";

export function DescribeProblem({ flow }: { flow: BookingFlow }) {
  const categoryName =
    CATEGORIES.find((c) => c.id === flow.state.category)?.name ?? "Select a service";

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Tell us what&apos;s going on</h2>
        <p className="text-neutral-400 text-[13px]">{categoryName}</p>
      </div>

      <Field label="Service address">
        <Input
          value={flow.state.address}
          onChange={(e) => flow.patch({ address: e.target.value })}
        />
      </Field>

      <Field label="Where's the issue?">
        <Input
          value={flow.state.location}
          onChange={(e) => flow.patch({ location: e.target.value })}
        />
      </Field>

      <div className="flex gap-8 flex-wrap">
        <Field label="Is water/power currently active?" className="flex flex-col gap-1.5">
          <SegmentedControl
            name="running"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            value={flow.state.running ? "yes" : "no"}
            onChange={(v) => flow.patch({ running: v === "yes" })}
          />
        </Field>
        <Field label="Is this an emergency?" className="flex flex-col gap-1.5">
          <SegmentedControl
            name="emergency"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            value={flow.state.emergency ? "yes" : "no"}
            onChange={(v) => flow.patch({ emergency: v === "yes" })}
          />
        </Field>
      </div>

      <Field label="Additional notes (optional)">
        <Textarea
          rows={3}
          value={flow.state.notes}
          onChange={(e) => flow.patch({ notes: e.target.value })}
        />
      </Field>

      <Button variant="secondary" className="w-fit">
        Add photo/video
      </Button>
    </>
  );
}
