export type ProviderStepKey =
  | "account"
  | "verify"
  | "business"
  | "availability"
  | "verification"
  | "payout"
  | "done";

export interface ProviderAuthState {
  mode: "signup" | "login";
  stepIndex: number;

  userId: string | null;
  accEmail: string;
  accPhone: string;
  accPassword: string;
  accConfirm: string;

  otp: string;
  otpError: boolean;

  bizName: string;
  bizPhone: string;
  bizTradingName: string;
  selectedCategories: string[];
  serviceRadius: number;

  selectedDays: string[];
  startTime: string;
  endTime: string;
  hourlyRate: number;
  calloutFee: number;

  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;

  loginEmail: string;
  loginPassword: string;
  loginSubmitted: boolean;
  loginError: string | null;

  forgotMode: boolean;
  forgotEmail: string;
  forgotSent: boolean;

  submitting: boolean;
  formError: string | null;
}
