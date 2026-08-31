import type { ProviderStepKey } from "./types";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const PROVIDER_STEPS: ProviderStepKey[] = [
  "account",
  "verify",
  "business",
  "availability",
  "verification",
  "payout",
  "done",
];

export const PROVIDER_STEP_LABELS: Record<ProviderStepKey, string> = {
  account: "Account",
  verify: "Verify",
  business: "Business info",
  availability: "Availability & rates",
  verification: "Verification",
  payout: "Payout details",
  done: "Done",
};
