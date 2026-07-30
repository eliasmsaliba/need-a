"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction, requestPasswordResetAction } from "../../(auth)/actions";
import type { LoginPatch } from "@/components/auth/LoginPanel";

interface AdminLoginState {
  loginEmail: string;
  loginPassword: string;
  loginSubmitted: boolean;
  loginError: string | null;
  forgotMode: boolean;
  forgotEmail: string;
  forgotSent: boolean;
  submitting: boolean;
}

function initialState(): AdminLoginState {
  return {
    loginEmail: "",
    loginPassword: "",
    loginSubmitted: false,
    loginError: null,
    forgotMode: false,
    forgotEmail: "",
    forgotSent: false,
    submitting: false,
  };
}

type Action = { type: "PATCH"; patch: Partial<AdminLoginState> };

function reducer(state: AdminLoginState, action: Action): AdminLoginState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}

export function useAdminLoginFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const router = useRouter();

  const patch = (p: LoginPatch) => dispatch({ type: "PATCH", patch: p });

  const loginDisabled = !(state.loginEmail && state.loginPassword);
  const forgotDisabled = !state.forgotEmail;

  async function submitLogin() {
    if (loginDisabled || state.submitting) return;
    dispatch({ type: "PATCH", patch: { submitting: true, loginError: null } });
    const result = await loginAction(state.loginEmail, state.loginPassword);
    if ("error" in result) {
      dispatch({ type: "PATCH", patch: { submitting: false, loginError: result.error } });
      return;
    }
    if (result.role !== "admin") {
      await logoutAction();
      dispatch({
        type: "PATCH",
        patch: { submitting: false, loginError: "This account isn't an admin account." },
      });
      return;
    }
    dispatch({ type: "PATCH", patch: { submitting: false, loginSubmitted: true } });
  }

  async function sendReset() {
    if (forgotDisabled || state.submitting) return;
    dispatch({ type: "PATCH", patch: { submitting: true } });
    await requestPasswordResetAction(state.forgotEmail);
    dispatch({ type: "PATCH", patch: { submitting: false, forgotSent: true } });
  }

  function goToApp() {
    router.push("/admin");
  }

  return { state, patch, loginDisabled, forgotDisabled, submitLogin, sendReset, goToApp };
}
