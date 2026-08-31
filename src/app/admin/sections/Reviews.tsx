"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Reviews({ flow }: { flow: AdminConsoleFlow }) {
  const { state, resolveDispute, dismissDispute } = flow;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmDispute = state.disputes.find((d) => d.id === confirmId);

  return (
    <>
      <h2 className="text-[22px] font-medium">Reviews &amp; disputes</h2>
      <div className="flex flex-col gap-3">
        {state.disputes.map((d) => (
          <Card key={d.id} className="p-[18px] gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {d.id} · {d.customer} vs {d.provider}
              </span>
              <Tag variant={statusVariant(d.status)}>{d.status}</Tag>
            </div>
            <p className="text-[13px] text-neutral-300">{d.reason}</p>
            {d.status === "Open" && (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => resolveDispute(d.id)}>
                  Resolve
                </Button>
                <Button variant="ghost" onClick={() => setConfirmId(d.id)}>
                  Dismiss
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmDispute}
        title="Dismiss dispute?"
        body={`This closes ${confirmDispute?.id ?? "the dispute"} with no action taken against either party. This can't be undone from here.`}
        confirmLabel="Dismiss"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) dismissDispute(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
