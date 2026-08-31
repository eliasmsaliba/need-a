import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function AccountStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch, accMismatch } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Create your pro account</h2>
      <Field label="Email">
        <Input
          type="email"
          value={state.accEmail}
          onChange={(e) => patch({ accEmail: e.target.value })}
        />
      </Field>
      <Field label="Phone">
        <Input
          type="tel"
          value={state.accPhone}
          onChange={(e) => patch({ accPhone: e.target.value })}
        />
      </Field>
      <div className="flex gap-5">
        <Field label="Password" className="flex-1">
          <Input
            type="password"
            value={state.accPassword}
            onChange={(e) => patch({ accPassword: e.target.value })}
          />
        </Field>
        <Field label="Confirm password" className="flex-1">
          <Input
            type="password"
            value={state.accConfirm}
            onChange={(e) => patch({ accConfirm: e.target.value })}
          />
        </Field>
      </div>
      {accMismatch && <span className="text-xs text-accent-300">Passwords don&apos;t match.</span>}
      {state.formError && <span className="text-xs text-accent-300">{state.formError}</span>}
    </>
  );
}
