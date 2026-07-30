import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { ProviderAuthFlow } from "../useProviderAuthFlow";

export function VerifyStep({ flow }: { flow: ProviderAuthFlow }) {
  const { state, patch } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Verify your email</h2>
      <p className="text-[13px] text-neutral-400">
        Enter the 6-digit code sent to {state.accEmail}.
      </p>
      <Field label="Verification code" className="max-w-[220px]">
        <Input
          value={state.otp}
          maxLength={6}
          onChange={(e) =>
            patch({ otp: e.target.value.replace(/\D/g, "").slice(0, 6), otpError: false })
          }
        />
      </Field>
      {state.otpError && (
        <span className="text-xs text-accent-300">That code isn&apos;t right or has expired.</span>
      )}
    </>
  );
}
