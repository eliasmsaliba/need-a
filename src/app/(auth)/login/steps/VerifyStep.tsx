import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CustomerAuthFlow } from "../useCustomerAuthFlow";

export function VerifyStep({ flow }: { flow: CustomerAuthFlow }) {
  const { state, patch, otpDisabled, submitOtp, resendOtp } = flow;

  return (
    <>
      <h2 className="text-xl font-medium">Verify your email</h2>
      <p className="text-sm text-neutral-400">
        Enter the 6-digit code sent to {state.accEmail}.
      </p>
      <Field label="Verification code">
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
      <Button variant="primary" block disabled={otpDisabled || state.submitting} onClick={submitOtp}>
        Verify
      </Button>
      <Button variant="ghost" className="w-fit" onClick={resendOtp}>
        Resend code
      </Button>
    </>
  );
}
