"use client";

import { Card } from "@/components/ui/Card";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { useAdminLoginFlow } from "./useAdminLoginFlow";

export default function AdminLoginPage() {
  const flow = useAdminLoginFlow();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-14 px-6">
      <div className="text-center mb-6">
        <div className="text-2xl font-semibold tracking-tight">
          Need<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">-A</span> Admin
        </div>
      </div>
      <Card elevation="glow" className="w-full max-w-[420px] p-9 gap-5">
        <LoginPanel flow={flow} appLabel="console" />
      </Card>
    </div>
  );
}
