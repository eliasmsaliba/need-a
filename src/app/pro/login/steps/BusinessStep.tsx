import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { PROVIDER_CATEGORY_NAMES } from "../data";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function BusinessStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch, dispatch } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Business details</h2>
      <div className="flex gap-5">
        <Field label="Your name" className="flex-1">
          <Input value={state.bizName} onChange={(e) => patch({ bizName: e.target.value })} />
        </Field>
        <Field label="Contact phone" className="flex-1">
          <Input value={state.bizPhone} onChange={(e) => patch({ bizPhone: e.target.value })} />
        </Field>
      </div>
      <Field label="Business / trading name (optional)">
        <Input
          value={state.bizTradingName}
          onChange={(e) => patch({ bizTradingName: e.target.value })}
        />
      </Field>
      <Field label="Categories you service" className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {PROVIDER_CATEGORY_NAMES.map((name) => (
            <ChipToggle
              key={name}
              label={name}
              active={state.selectedCategories.includes(name)}
              onToggle={() => dispatch({ type: "TOGGLE_CATEGORY", name })}
            />
          ))}
        </div>
      </Field>
      <Field label="Service area radius (km)" className="max-w-[220px]">
        <Input
          type="number"
          value={state.serviceRadius}
          onChange={(e) => patch({ serviceRadius: Number(e.target.value) })}
        />
      </Field>
    </>
  );
}
