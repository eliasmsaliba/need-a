"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import type { ProviderAuthState } from "./types";
import { PROVIDER_STEPS } from "./data";
import {
  createAccount,
  loginAction,
  requestPasswordResetAction,
  resendOtpAction,
  verifyOtpAction,
} from "../../(auth)/actions";
import { saveProviderStep } from "./provider-actions";

function initialState(): ProviderAuthState {
  return {
    mode: "signup",
    stepIndex: 0,
    userId: null,
    accEmail: "",
    accPhone: "",
    accPassword: "",
    accConfirm: "",
    otp: "",
    otpError: false,
    bizName: "",
    bizPhone: "",
    bizTradingName: "",
    selectedCategories: [],
    serviceRadius: 15,
    selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "08:00",
    endTime: "17:00",
    hourlyRate: 350,
    calloutFee: 150,
    idDocumentUrl: null,
    certificationUrl: null,
    portfolioUrls: [],
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branchCode: "",
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
  | { type: "PATCH"; patch: Partial<ProviderAuthState> }
  | { type: "TOGGLE_CATEGORY"; name: string }
  | { type: "TOGGLE_DAY"; day: string };

function reducer(state: ProviderAuthState, action: Action): ProviderAuthState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    case "TOGGLE_CATEGORY":
      return {
        ...state,
        selectedCategories: state.selectedCategories.includes(action.name)
          ? state.selectedCategories.filter((c) => c !== action.name)
          : [...state.selectedCategories, action.name],
      };
    case "TOGGLE_DAY":
      return {
        ...state,
        selectedDays: state.selectedDays.includes(action.day)
          ? state.selectedDays.filter((d) => d !== action.day)
          : [...state.selectedDays, action.day],
      };
    default:
      return state;
  }
}

export function useProviderAuthFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const router = useRouter();

  const patch = (p: Partial<ProviderAuthState>) => dispatch({ type: "PATCH", patch: p });

  const stepIdx = state.stepIndex;
  const currentStep = PROVIDER_STEPS[stepIdx];

  const accMismatch = state.accConfirm.length > 0 && state.accPassword !== state.accConfirm;
  const accountDisabled = !(
    state.accEmail &&
    state.accPassword.length >= 6 &&
    state.accPassword === state.accConfirm
  );
  const otpDisabled = state.otp.length !== 6;
  const businessDisabled = !(state.bizName && state.selectedCategories.length > 0);
  const loginDisabled = !(state.loginEmail && state.loginPassword);
  const forgotDisabled = !state.forgotEmail;
  const bizFirstName = state.bizName.split(" ")[0] || "there";

  const showBack = stepIdx > 0 && currentStep !== "done";
  const showVerifyBtn = currentStep === "verify";
  const showSubmitBtn = currentStep === "payout";
  const showContinueBtn = !showVerifyBtn && !showSubmitBtn && currentStep !== "done";
  const continueDisabled = currentStep === "business" ? businessDisabled : false;

  function back() {
    patch({ stepIndex: Math.max(0, stepIdx - 1) });
  }

  async function submitAccountStep() {
    if (accountDisabled || state.submitting) return;
    patch({ submitting: true, formError: null });
    const result = await createAccount("provider", state.accEmail, state.accPhone, state.accPassword);
    if ("error" in result) {
      patch({ submitting: false, formError: result.error });
      return;
    }
    patch({ submitting: false, userId: result.userId, stepIndex: stepIdx + 1 });
  }

  async function submitOtp() {
    if (otpDisabled || !state.userId || state.submitting) return;
    patch({ submitting: true });
    const result = await verifyOtpAction(state.userId, state.otp);
    if ("error" in result) {
      patch({ submitting: false, otpError: true });
      return;
    }
    patch({ submitting: false, otpError: false, stepIndex: stepIdx + 1 });
  }

  async function resendOtp() {
    if (!state.userId) return;
    await resendOtpAction(state.userId);
  }

  async function continueStep() {
    if (state.submitting) return;

    if (currentStep === "account") return submitAccountStep();

    if (currentStep === "business") {
      if (businessDisabled || !state.userId) return;
      patch({ submitting: true });
      await saveProviderStep(state.userId, {
        step: "business",
        bizName: state.bizName,
        bizPhone: state.bizPhone,
        bizTradingName: state.bizTradingName,
        selectedCategories: state.selectedCategories,
        serviceRadius: Number(state.serviceRadius),
      });
      patch({ submitting: false, stepIndex: stepIdx + 1 });
      return;
    }

    if (currentStep === "availability") {
      if (!state.userId) return;
      patch({ submitting: true });
      await saveProviderStep(state.userId, {
        step: "availability",
        selectedDays: state.selectedDays,
        startTime: state.startTime,
        endTime: state.endTime,
        hourlyRate: Number(state.hourlyRate),
        calloutFee: Number(state.calloutFee),
      });
      patch({ submitting: false, stepIndex: stepIdx + 1 });
      return;
    }

    if (currentStep === "verification") {
      if (!state.userId) return;
      patch({ submitting: true });
      await saveProviderStep(state.userId, {
        step: "verification",
        idDocumentUrl: state.idDocumentUrl,
        certificationUrl: state.certificationUrl,
        portfolioUrls: state.portfolioUrls,
      });
      patch({ submitting: false, stepIndex: stepIdx + 1 });
      return;
    }

    patch({ stepIndex: stepIdx + 1 });
  }

  async function submitPayout() {
    if (!state.userId || state.submitting) return;
    patch({ submitting: true });
    await saveProviderStep(state.userId, {
      step: "payout",
      bankName: state.bankName,
      accountHolder: state.accountHolder,
      accountNumber: state.accountNumber,
      branchCode: state.branchCode,
    });
    patch({ submitting: false, stepIndex: stepIdx + 1 });
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
    router.push("/pro");
  }

  return {
    state,
    patch,
    dispatch,
    stepIdx,
    currentStep,
    accMismatch,
    accountDisabled,
    otpDisabled,
    businessDisabled,
    loginDisabled,
    forgotDisabled,
    bizFirstName,
    showBack,
    showVerifyBtn,
    showSubmitBtn,
    showContinueBtn,
    continueDisabled,
    back,
    continueStep,
    submitOtp,
    resendOtp,
    submitPayout,
    submitLogin,
    sendReset,
    goToApp,
  };
}

export type ProviderAuthFlow = ReturnType<typeof useProviderAuthFlow>;
