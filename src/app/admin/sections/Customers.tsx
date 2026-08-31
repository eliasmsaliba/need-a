"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Customers({ flow }: { flow: AdminConsoleFlow }) {
  const { state, toggleCustomerSuspend } = flow;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmCustomer = state.customers.find((c) => c.id === confirmId);

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Customers</h2>
      <Table>
        <thead>
          <TR>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Jobs</TH>
            <TH>Total spend</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {state.customers.map((c) => (
            <TR key={c.id}>
              <TD>{c.name}</TD>
              <TD>{c.email}</TD>
              <TD>{c.jobs}</TD>
              <TD>R{c.spend}</TD>
              <TD>
                <Tag variant={statusVariant(c.status)}>{c.status}</Tag>
              </TD>
              <TD>
                {c.status === "Suspended" ? (
                  <Button variant="ghost" onClick={() => toggleCustomerSuspend(c.id)}>
                    Reinstate
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => setConfirmId(c.id)}>
                    Suspend
                  </Button>
                )}
              </TD>
            </TR>
          ))}
          {state.customers.length === 0 && (
            <TR>
              <TD colSpan={6} className="text-neutral-400">
                No customers have signed up yet.
              </TD>
            </TR>
          )}
        </tbody>
      </Table>

      <ConfirmDialog
        open={!!confirmCustomer}
        title="Suspend customer?"
        body={`${confirmCustomer?.name ?? "This customer"} won't be able to book new services until reinstated.`}
        confirmLabel="Suspend"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) toggleCustomerSuspend(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
