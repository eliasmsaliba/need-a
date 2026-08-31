"use client";

import { ClipboardText, CurrencyCircleDollar } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ADMIN_STATUS_LABELS, TRACK_STATUS_ORDER, trackIndexOf } from "@/lib/booking-status";
import { advanceMyJobStatusAction } from "../actions";
import type { RealJob } from "../types";

export function Jobs({
  jobs,
  onStatusChange,
}: {
  jobs: RealJob[];
  onStatusChange: (id: string, status: RealJob["status"]) => void;
}) {
  const active = jobs.filter((j) => !["done", "cancelled"].includes(j.status));
  const completed = jobs.filter((j) => j.status === "done");
  const totalBilled = completed.reduce((sum, j) => sum + j.amount, 0);

  async function advance(id: string) {
    const result = await advanceMyJobStatusAction(id);
    if ("success" in result) onStatusChange(id, result.status);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card elevation="glow" className="p-4 gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wide uppercase text-accent-300">Completed jobs</span>
            <ClipboardText weight="duotone" className="text-lg text-accent-400" />
          </div>
          <span className="text-3xl font-semibold tracking-tight">{completed.length}</span>
        </Card>
        <Card elevation="glow" className="p-4 gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wide uppercase text-accent-300">Total billed</span>
            <CurrencyCircleDollar weight="duotone" className="text-lg text-accent-400" />
          </div>
          <span className="text-3xl font-semibold tracking-tight">R{totalBilled}</span>
        </Card>
      </div>

      <h2 className="text-xl font-semibold tracking-tight">Active jobs</h2>
      {active.length === 0 && <p className="text-sm text-neutral-400">No active jobs right now.</p>}
      <div className="flex flex-col gap-3">
        {active.map((j) => {
          const nextIdx = trackIndexOf(j.status) + 1;
          const nextStatus = TRACK_STATUS_ORDER[Math.min(TRACK_STATUS_ORDER.length - 1, nextIdx)];
          return (
            <Card key={j.id} className="p-4 gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">
                  {j.ref} · {j.category} · {j.bookingTypeLabel}
                </span>
                <Tag variant="outline">{ADMIN_STATUS_LABELS[j.status]}</Tag>
              </div>
              <div className="text-[13px] text-neutral-300">
                {j.customerName} · {j.customerPhone}
              </div>
              <div className="text-[13px] text-neutral-400">
                {j.address} — {j.location}
              </div>
              {j.notes && <div className="text-[13px] text-neutral-400">Notes: {j.notes}</div>}
              {j.schedDate && (
                <div className="text-[13px] text-neutral-400">
                  Scheduled: {j.schedDate} {j.schedTime}
                </div>
              )}
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-medium">R{j.amount}</span>
                <Button variant="secondary" onClick={() => advance(j.id)}>
                  Mark {ADMIN_STATUS_LABELS[nextStatus]}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="text-xl font-semibold tracking-tight">Completed jobs</h2>
          <div className="flex flex-col gap-3">
            {completed.map((j) => (
              <Card key={j.id} className="p-4 gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">
                    {j.ref} · {j.category}
                  </span>
                  <Tag variant="accent">Done</Tag>
                </div>
                <div className="text-[13px] text-neutral-400">
                  {j.customerName} · R{j.amount}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
