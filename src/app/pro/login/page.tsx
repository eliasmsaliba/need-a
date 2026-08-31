"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StepRail } from "@/components/ui/StepRail";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { PROVIDER_STEPS, PROVIDER_STEP_LABELS } from "./data";
import { useProviderAuthFlow } from "./useProviderAuthFlow";
import { AccountStep } from "./steps/AccountStep";
import { VerifyStep } from "./steps/VerifyStep";
import { BusinessStep } from "./steps/BusinessStep";
import { AvailabilityStep } from "./steps/AvailabilityStep";
import { VerificationStep } from "./steps/VerificationStep";
import { PayoutStep } from "./steps/PayoutStep";
import { DoneStep } from "./steps/DoneStep";

export default function ProviderAuthPage() {
  const flow = useProviderAuthFlow();
  const { state, patch, currentStep, stepIdx } = flow;

  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex items-center justify-between py-3 px-10">
        <span className="text-lg font-medium">Need-A Pro</span>
        <SegmentedControl
          name="mode"
          value={state.mode}
          onChange={(v) => patch({ mode: v })}
          options={[
            { value: "signup", label: "Sign up" },
            { value: "login", label: "Log in" },
          ]}
        />
      </nav>

      {state.mode === "signup" ? (
        <div className="flex flex-col md:flex-row gap-8 max-w-[1280px] mx-auto w-full pt-8 px-4 md:px-6 pb-20">
          <aside className="w-full md:w-[240px] shrink-0">
            <StepRail
              steps={PROVIDER_STEPS.map((key) => ({ key, label: PROVIDER_STEP_LABELS[key] }))}
              activeIndex={stepIdx}
            />
          </aside>

          <Card elevation="md" className="flex-1 p-5 md:p-9 gap-[22px] min-h-[600px]">
            {currentStep === "account" && <AccountStep flow={flow} />}
            {currentStep === "verify" && <VerifyStep flow={flow} />}
            {currentStep === "business" && <BusinessStep flow={flow} />}
            {currentStep === "availability" && <AvailabilityStep flow={flow} />}
            {currentStep === "verification" && <VerificationStep flow={flow} />}
            {currentStep === "payout" && <PayoutStep flow={flow} />}
            {currentStep === "done" && <DoneStep flow={flow} />}

            <div className="flex justify-between mt-auto pt-5 border-t border-neutral-800">
              {flow.showBack ? (
                <Button variant="ghost" onClick={flow.back}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {flow.showVerifyBtn && (
                <Button
                  variant="primary"
                  disabled={flow.otpDisabled || state.submitting}
                  onClick={flow.submitOtp}
                  className="ml-auto"
                >
                  Verify
                </Button>
              )}
              {flow.showContinueBtn && (
                <Button
                  variant="primary"
                  disabled={flow.continueDisabled || state.submitting}
                  onClick={flow.continueStep}
                  className="ml-auto"
                >
                  Continue
                </Button>
              )}
              {flow.showSubmitBtn && (
                <Button
                  variant="primary"
                  disabled={state.submitting}
                  onClick={flow.submitPayout}
                  className="ml-auto"
                >
                  Submit application
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center py-14 px-6">
          <Card elevation="md" className="w-full max-w-[420px] p-9 gap-5">
            <LoginPanel flow={flow} appLabel="dashboard" />
          </Card>
        </div>
      )}
    </div>
  );
}
