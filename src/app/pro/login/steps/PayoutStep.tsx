import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function PayoutStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Payout details</h2>
      <div className="flex gap-5">
        <Field label="Bank name" className="flex-1">
          <Input value={state.bankName} onChange={(e) => patch({ bankName: e.target.value })} />
        </Field>
        <Field label="Account holder" className="flex-1">
          <Input
            value={state.accountHolder}
            onChange={(e) => patch({ accountHolder: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex gap-5">
        <Field label="Account number" className="flex-1">
          <Input
            value={state.accountNumber}
            onChange={(e) => patch({ accountNumber: e.target.value })}
          />
        </Field>
        <Field label="Branch code" className="flex-1">
          <Input value={state.branchCode} onChange={(e) => patch({ branchCode: e.target.value })} />
        </Field>
      </div>
    </>
  );
}
