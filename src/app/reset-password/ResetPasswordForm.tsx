"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { resetPasswordAction } from "../(auth)/actions";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ role: "customer" | "provider" } | null>(null);

  const mismatch = confirm.length > 0 && password !== confirm;
  const disabled = !(token && password.length >= 6 && password === confirm);

  async function submit() {
    if (disabled || submitting) return;
    setSubmitting(true);
    setError(null);
    const res = await resetPasswordAction(token, password);
    setSubmitting(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setResult({ role: res.role });
  }

  if (!token) {
    return (
      <Card elevation="md" className="w-full max-w-[420px] p-9 gap-4">
        <h2 className="text-xl font-medium">Invalid link</h2>
        <p className="text-[13px] text-neutral-400">
          This password reset link is missing its token. Request a new one from the login page.
        </p>
      </Card>
    );
  }

  if (result) {
    const loginHref = result.role === "provider" ? "/pro/login" : "/login";
    return (
      <Card elevation="md" className="w-full max-w-[420px] p-9 gap-4">
        <Tag variant="accent" className="w-fit">
          Password updated
        </Tag>
        <h2 className="text-xl font-medium">You&apos;re all set</h2>
        <Link href={loginHref}>
          <Button variant="primary" block>
            Log in
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card elevation="md" className="w-full max-w-[420px] p-9 gap-5">
      <h2 className="text-xl font-medium">Set a new password</h2>
      <Field label="New password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="Confirm new password">
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Field>
      {mismatch && <span className="text-xs text-accent-300">Passwords don&apos;t match.</span>}
      {error && <span className="text-xs text-accent-300">{error}</span>}
      <Button variant="primary" block disabled={disabled || submitting} onClick={submit}>
        Reset password
      </Button>
    </Card>
  );
}
