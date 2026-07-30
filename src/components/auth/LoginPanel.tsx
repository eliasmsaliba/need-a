import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export interface LoginPatch {
  loginEmail?: string;
  loginPassword?: string;
  forgotMode?: boolean;
  forgotEmail?: string;
  forgotSent?: boolean;
}

export interface AuthLoginFlow {
  state: {
    loginEmail: string;
    loginPassword: string;
    loginSubmitted: boolean;
    loginError: string | null;
    forgotMode: boolean;
    forgotEmail: string;
    forgotSent: boolean;
    submitting: boolean;
  };
  patch: (p: LoginPatch) => void;
  loginDisabled: boolean;
  forgotDisabled: boolean;
  submitLogin: () => void | Promise<void>;
  sendReset: () => void | Promise<void>;
  goToApp: () => void;
}

export function LoginPanel({ flow, appLabel = "app" }: { flow: AuthLoginFlow; appLabel?: string }) {
  const { state, patch, loginDisabled, forgotDisabled, submitLogin, sendReset, goToApp } = flow;

  if (state.loginSubmitted) {
    return (
      <>
        <Tag variant="accent" className="w-fit">
          Logged in
        </Tag>
        <h2 className="text-xl font-medium">Welcome back</h2>
        <Button variant="primary" block onClick={goToApp}>
          Continue to {appLabel}
        </Button>
      </>
    );
  }

  if (state.forgotSent) {
    return (
      <>
        <Tag variant="accent" className="w-fit">
          Reset link sent
        </Tag>
        <p className="text-[13px] text-neutral-400">
          Check {state.forgotEmail} for a link to reset your password.
        </p>
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => patch({ forgotMode: false, forgotSent: false })}
        >
          Back to log in
        </Button>
      </>
    );
  }

  if (state.forgotMode) {
    return (
      <>
        <h2 className="text-xl font-medium">Reset your password</h2>
        <Field label="Email">
          <Input
            type="email"
            value={state.forgotEmail}
            onChange={(e) => patch({ forgotEmail: e.target.value })}
          />
        </Field>
        <Button variant="primary" block disabled={forgotDisabled || state.submitting} onClick={sendReset}>
          Send reset link
        </Button>
        <Button variant="ghost" className="w-fit" onClick={() => patch({ forgotMode: false })}>
          Back to log in
        </Button>
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl font-medium">Log in</h2>
      <Field label="Email">
        <Input
          type="email"
          value={state.loginEmail}
          onChange={(e) => patch({ loginEmail: e.target.value })}
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          value={state.loginPassword}
          onChange={(e) => patch({ loginPassword: e.target.value })}
        />
      </Field>
      {state.loginError && <span className="text-xs text-accent-300">{state.loginError}</span>}
      <Button variant="primary" block disabled={loginDisabled || state.submitting} onClick={submitLogin}>
        Log in
      </Button>
      <Button variant="ghost" className="w-fit" onClick={() => patch({ forgotMode: true, forgotSent: false })}>
        Forgot password?
      </Button>
    </>
  );
}
