"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import type { CustomerAuthState } from "./types";
import {
  createAccount,
  loginAction,
  requestPasswordResetAction,
  resendOtpAction,
  verifyOtpAction,
} from "../actions";
import { completeCustomerProfile } from "./customer-actions";

const SIGNUP_STEPS = ["account", "verify", "profile", "done"] as const;

function initialState(): CustomerAuthState {
  return {
    mode: "signup",
    signupStep: 0,
    userId: null,
    accEmail: "",
    accPhone: "",
    accPassword: "",
    accConfirm: "",
    otp: "",
    otpError: false,
    profName: "",
    profPhone: "",
    avatarUrl: null,
    addresses: [],
    newAddrLabel: "",
    newAddrText: "",
    payment: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    notif: { sms: true, email: true, push: false },
    loginEmail: "",
    loginPassword: "",
    loginSubmitted: false,
    loginError: null,
    forgotMode: false,
    forgotEmail: "",
    forgotSent: false,
    submitting: false,
    formError: null,
  };
}

type Action =
  | { type: "PATCH"; patch: Partial<CustomerAuthState> }
  | { type: "ADD_ADDRESS" }
  | { type: "REMOVE_ADDRESS"; index: number }
  | { type: "TOGGLE_NOTIF"; channel: "sms" | "email" | "push"; value: boolean };

function reducer(state: CustomerAuthState, action: Action): CustomerAuthState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    case "ADD_ADDRESS": {
      if (!state.newAddrText) return state;
      return {
        ...state,
        addresses: [
          ...state.addresses,
          { label: state.newAddrLabel || "Address", text: state.newAddrText },
        ],
        newAddrLabel: "",
        newAddrText: "",
      };
    }
    case "REMOVE_ADDRESS":
      return { ...state, addresses: state.addresses.filter((_, i) => i !== action.index) };
    case "TOGGLE_NOTIF":
      return { ...state, notif: { ...state.notif, [action.channel]: action.value } };
    default:
      return state;
  }
}

export function useCustomerAuthFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const router = useRouter();

  const patch = (p: Partial<CustomerAuthState>) => dispatch({ type: "PATCH", patch: p });

  const accMismatch = state.accConfirm.length > 0 && state.accPassword !== state.accConfirm;
  const accountDisabled = !(
    state.accEmail &&
    state.accPassword.length >= 6 &&
    state.accPassword === state.accConfirm
  );
  const otpDisabled = state.otp.length !== 6;
  const profileDisabled = !state.profName;
  const loginDisabled = !(state.loginEmail && state.loginPassword);
  const forgotDisabled = !state.forgotEmail;
  const profFirstName = state.profName.split(" ")[0] || "there";

  async function submitAccountStep() {
    if (accountDisabled || state.submitting) return;
    patch({ submitting: true, formError: null });
    const result = await createAccount("customer", state.accEmail, state.accPhone, state.accPassword);
    if ("error" in result) {
      patch({ submitting: false, formError: result.error });
      return;
    }
    patch({ submitting: false, userId: result.userId, signupStep: 1 });
  }

  async function submitOtp() {
    if (otpDisabled || !state.userId || state.submitting) return;
    patch({ submitting: true });
    const result = await verifyOtpAction(state.userId, state.otp);
    if ("error" in result) {
      patch({ submitting: false, otpError: true });
      return;
    }
    patch({ submitting: false, otpError: false, signupStep: 2 });
  }

  async function resendOtp() {
    if (!state.userId) return;
    await resendOtpAction(state.userId);
  }

  async function submitProfile() {
    if (profileDisabled || !state.userId || state.submitting) return;
    patch({ submitting: true });
    await completeCustomerProfile(state.userId, {
      fullName: state.profName,
      phone: state.profPhone,
      avatarUrl: state.avatarUrl,
      addresses: state.addresses,
      payment: state.payment,
      cardNumber: state.cardNumber,
      notif: state.notif,
    });
    patch({ submitting: false, signupStep: 3 });
  }

  async function submitLogin() {
    if (loginDisabled || state.submitting) return;
    patch({ submitting: true, loginError: null });
    const result = await loginAction(state.loginEmail, state.loginPassword);
    if ("error" in result) {
      patch({ submitting: false, loginError: result.error });
      return;
    }
    patch({ submitting: false, loginSubmitted: true });
  }

  async function sendReset() {
    if (forgotDisabled || state.submitting) return;
    patch({ submitting: true });
    await requestPasswordResetAction(state.forgotEmail);
    patch({ submitting: false, forgotSent: true });
  }

  function goToApp() {
    router.push("/book");
  }

  return {
    state,
    patch,
    dispatch,
    signupSteps: SIGNUP_STEPS,
    accMismatch,
    accountDisabled,
    otpDisabled,
    profileDisabled,
    loginDisabled,
    forgotDisabled,
    profFirstName,
    submitAccountStep,
    submitOtp,
    resendOtp,
    submitProfile,
    submitLogin,
    sendReset,
    goToApp,
  };
}

export type CustomerAuthFlow = ReturnType<typeof useCustomerAuthFlow>;
