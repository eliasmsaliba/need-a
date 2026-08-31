"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";
import type { RealProvider } from "../types";

function EditProviderDialog({
  provider,
  categoryNames,
  onClose,
  onSave,
}: {
  provider: RealProvider;
  categoryNames: string[];
  onClose: () => void;
  onSave: (fields: {
    bizName: string;
    bizPhone: string;
    bizTradingName: string;
    selectedCategories: string[];
    serviceRadius: number;
    hourlyRate: number;
    calloutFee: number;
    guaranteeDays: number;
  }) => Promise<void>;
}) {
  const [bizName, setBizName] = useState(provider.name);
  const [bizPhone, setBizPhone] = useState(provider.bizPhone);
  const [bizTradingName, setBizTradingName] = useState(provider.bizTradingName);
  const [selectedCategories, setSelectedCategories] = useState(provider.selectedCategories);
  const [serviceRadius, setServiceRadius] = useState(provider.serviceRadius);
  const [hourlyRate, setHourlyRate] = useState(provider.hourlyRate);
  const [calloutFee, setCalloutFee] = useState(provider.calloutFee);
  const [guaranteeDays, setGuaranteeDays] = useState(provider.guaranteeDays);
  const [saving, setSaving] = useState(false);

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }

  async function handleSave() {
    setSaving(true);
    await onSave({
      bizName,
      bizPhone,
      bizTradingName,
      selectedCategories,
      serviceRadius,
      hourlyRate,
      calloutFee,
      guaranteeDays,
    });
    setSaving(false);
  }

  return (
    <Modal open title="Edit provider" onClose={onClose}>
      <div className="flex gap-4">
        <Field label="Business name" className="flex-1">
          <Input value={bizName} onChange={(e) => setBizName(e.target.value)} />
        </Field>
        <Field label="Contact phone" className="flex-1">
          <Input value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} />
        </Field>
      </div>
      <Field label="Trading name (optional)">
        <Input value={bizTradingName} onChange={(e) => setBizTradingName(e.target.value)} />
      </Field>
      <Field label="Categories" className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          {categoryNames.map((name) => (
            <ChipToggle
              key={name}
              label={name}
              active={selectedCategories.includes(name)}
              onToggle={() => toggleCategory(name)}
            />
          ))}
        </div>
      </Field>
      <div className="flex gap-4 flex-wrap">
        <Field label="Service radius (km)" className="w-32">
          <Input
            type="number"
            value={serviceRadius}
            onChange={(e) => setServiceRadius(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Hourly rate (R)" className="w-32">
          <Input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Call-out fee (R)" className="w-32">
          <Input
            type="number"
            value={calloutFee}
            onChange={(e) => setCalloutFee(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Guarantee (days)" className="w-32">
          <Input
            type="number"
            value={guaranteeDays}
            onChange={(e) => setGuaranteeDays(Number(e.target.value) || 0)}
          />
        </Field>
      </div>
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

export function Providers({ flow }: { flow: AdminConsoleFlow }) {
  const { state, verifyProvider, toggleProviderSuspend, updateProvider } = flow;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const confirmProvider = state.providers.find((p) => p.id === confirmId);
  const editProvider = state.providers.find((p) => p.id === editId);
  const categoryNames = state.categories.map((c) => c.name);

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
                    <Button variant="ghost" onClick={() => setEditId(p.id)}>
                      Edit
                    </Button>
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

      {editProvider && (
        <EditProviderDialog
          provider={editProvider}
          categoryNames={categoryNames}
          onClose={() => setEditId(null)}
          onSave={async (fields) => {
            await updateProvider(editProvider.id, fields);
            setEditId(null);
          }}
        />
      )}
    </>
  );
}
