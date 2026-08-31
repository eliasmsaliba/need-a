import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Categories({ flow }: { flow: AdminConsoleFlow }) {
  const { state, updateCategory } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Categories &amp; pricing</h2>
      <div className="flex flex-col gap-3">
        {state.categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-6 py-4 px-5 rounded-md bg-surface">
            <span className="flex-1 text-sm font-medium">{cat.name}</span>
            <Field label="Call-out fee (R)" className="w-40">
              <Input
                type="number"
                value={cat.calloutFee}
                onChange={(e) => updateCategory(cat.id, "calloutFee", e.target.value)}
              />
            </Field>
            <Field label="Base hourly rate (R)" className="w-40">
              <Input
                type="number"
                value={cat.baseRate}
                onChange={(e) => updateCategory(cat.id, "baseRate", e.target.value)}
              />
            </Field>
          </div>
        ))}
      </div>
    </>
  );
}
