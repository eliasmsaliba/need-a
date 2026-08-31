export type SignupStepKey = "account" | "verify" | "profile" | "done";

export interface AddressEntry {
  label: string;
  text: string;
}

export interface CustomerAuthState {
  mode: "signup" | "login";
  signupStep: number;

  userId: string | null;
  accEmail: string;
  accPhone: string;
  accPassword: string;
  accConfirm: string;

  otp: string;
  otpError: boolean;

  profName: string;
  profPhone: string;
  avatarUrl: string | null;
  addresses: AddressEntry[];
  newAddrLabel: string;
  newAddrText: string;
  payment: "card" | "eft";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  notif: { sms: boolean; email: boolean; push: boolean };

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
