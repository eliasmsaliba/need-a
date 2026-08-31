"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Providers({ flow }: { flow: AdminConsoleFlow }) {
  const { state, verifyProvider, toggleProviderSuspend } = flow;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmProvider = state.providers.find((p) => p.id === confirmId);

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Providers</h2>
      <Table>
        <thead>
          <TR>
            <TH>Name</TH>
            <TH>Badge</TH>
            <TH>Rating</TH>
            <TH>Jobs</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {state.providers.map((p) => {
            const showVerify = p.status === "Pending verification";
            return (
              <TR key={p.id}>
                <TD>{p.name}</TD>
                <TD>
                  <Tag variant="accent">{p.badge}</Tag>
                </TD>
                <TD>{p.rating}</TD>
                <TD>{p.jobs}</TD>
                <TD>
                  <Tag variant={statusVariant(p.status)}>{p.status}</Tag>
                </TD>
                <TD>
                  <div className="flex gap-2">
                    {showVerify && p.idDocumentUrl && (
                      <a href={p.idDocumentUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost">View ID</Button>
                      </a>
                    )}
                    {showVerify && (
                      <Button variant="secondary" onClick={() => verifyProvider(p.id)}>
                        Verify
                      </Button>
                    )}
                    {!showVerify && p.status === "Suspended" && (
                      <Button variant="ghost" onClick={() => toggleProviderSuspend(p.id)}>
                        Reinstate
                      </Button>
                    )}
                    {!showVerify && p.status !== "Suspended" && (
                      <Button variant="ghost" onClick={() => setConfirmId(p.id)}>
                        Suspend
                      </Button>
                    )}
                  </div>
                </TD>
              </TR>
            );
          })}
          {state.providers.length === 0 && (
            <TR>
              <TD colSpan={6} className="text-neutral-400">
                No providers have signed up yet.
              </TD>
            </TR>
          )}
        </tbody>
      </Table>

      <ConfirmDialog
        open={!!confirmProvider}
        title="Suspend provider?"
        body={`${confirmProvider?.name ?? "This provider"} will lose access and stop appearing in matches until reinstated.`}
        confirmLabel="Suspend"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) toggleProviderSuspend(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
