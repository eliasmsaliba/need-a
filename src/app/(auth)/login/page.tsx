"use client";

import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { useCustomerAuthFlow } from "./useCustomerAuthFlow";
import { AccountStep } from "./steps/AccountStep";
import { VerifyStep } from "./steps/VerifyStep";
import { ProfileStep } from "./steps/ProfileStep";
import { DoneStep } from "./steps/DoneStep";
import { LoginPanel } from "@/components/auth/LoginPanel";

const STEP_LABELS = ["Account", "Verify", "Profile", "Done"];

export default function CustomerAuthPage() {
  const flow = useCustomerAuthFlow();
  const { state, patch } = flow;

  return (
    <div className="flex-1 flex flex-col items-center py-14 px-6">
      <div className="text-center mb-6">
        <div className="text-2xl font-semibold tracking-tight">
          Need<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">-A</span>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Verified pros · Money-back guarantee · Secure payment
        </p>
      </div>

      <SegmentedControl
        name="mode"
        className="mb-6"
        value={state.mode}
        onChange={(v) => patch({ mode: v })}
        options={[
          { value: "signup", label: "Sign up" },
          { value: "login", label: "Log in" },
        ]}
      />

      {state.mode === "signup" ? (
        <Card elevation="glow" className="w-full max-w-[520px] p-9 gap-6">
          <div className="flex justify-between">
            {STEP_LABELS.map((label, i) => {
              const active = i === state.signupStep;
              const completed = i < state.signupStep;
              return (
                <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={cn(
                      "w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors duration-200",
                      completed || active
                        ? "bg-[image:var(--gradient-hero)] text-white shadow-[var(--shadow-glow-sm)]"
                        : "bg-neutral-800 text-neutral-500",
                    )}
                  >
                    {i + 1}
                  </div>
                  <span className={cn("text-[11px]", active ? "text-text" : "text-neutral-500")}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {state.signupStep === 0 && <AccountStep flow={flow} />}
          {state.signupStep === 1 && <VerifyStep flow={flow} />}
          {state.signupStep === 2 && <ProfileStep flow={flow} />}
          {state.signupStep === 3 && <DoneStep flow={flow} />}
        </Card>
      ) : (
        <Card elevation="glow" className="w-full max-w-[420px] p-9 gap-5">
          <LoginPanel flow={flow} />
        </Card>
      )}
    </div>
  );
}
