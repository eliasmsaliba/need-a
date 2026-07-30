import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CustomerAuthFlow } from "../useCustomerAuthFlow";

export function AccountStep({ flow }: { flow: CustomerAuthFlow }) {
  const { state, patch, accMismatch, accountDisabled, submitAccountStep } = flow;

  return (
    <>
      <h2 className="text-xl font-medium">Create your account</h2>
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
      <Field label="Password">
        <Input
          type="password"
          value={state.accPassword}
          onChange={(e) => patch({ accPassword: e.target.value })}
        />
      </Field>
      <Field label="Confirm password">
        <Input
          type="password"
          value={state.accConfirm}
          onChange={(e) => patch({ accConfirm: e.target.value })}
        />
      </Field>
      {accMismatch && <span className="text-xs text-accent-300">Passwords don&apos;t match.</span>}
      {state.formError && <span className="text-xs text-accent-300">{state.formError}</span>}
      <Button
        variant="primary"
        block
        disabled={accountDisabled || state.submitting}
        onClick={submitAccountStep}
      >
        Continue
      </Button>
    </>
  );
}
