"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";
import type { RealCustomer } from "../types";

function EditCustomerDialog({
  customer,
  onClose,
  onSave,
}: {
  customer: RealCustomer;
  onClose: () => void;
  onSave: (fields: { fullName: string; phone: string }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({ fullName, phone });
    setSaving(false);
  }

  return (
    <Modal open title="Edit customer" onClose={onClose}>
      <Field label="Full name">
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </Field>
      <Field label="Phone">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" disabled={saving} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </Modal>
  );
}

export function Customers({ flow }: { flow: AdminConsoleFlow }) {
  const { state, toggleCustomerSuspend, updateCustomer } = flow;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const confirmCustomer = state.customers.find((c) => c.id === confirmId);
  const editCustomer = state.customers.find((c) => c.id === editId);

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
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditId(c.id)}>
                    Edit
                  </Button>
                  {c.status === "Suspended" ? (
                    <Button variant="ghost" onClick={() => toggleCustomerSuspend(c.id)}>
                      Reinstate
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => setConfirmId(c.id)}>
                      Suspend
                    </Button>
                  )}
                </div>
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

      {editCustomer && (
        <EditCustomerDialog
          customer={editCustomer}
          onClose={() => setEditId(null)}
          onSave={async (fields) => {
            await updateCustomer(editCustomer.id, fields);
            setEditId(null);
          }}
        />
      )}
    </>
  );
}
