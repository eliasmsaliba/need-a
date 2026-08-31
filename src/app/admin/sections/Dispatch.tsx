import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { TRACK_STATUS_ORDER, trackIndexOf } from "@/lib/booking-status";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Dispatch({ flow }: { flow: AdminConsoleFlow }) {
  const { state, activeProviders, assignProvider, advanceBookingStatus, statusLabel } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Dispatch queue</h2>
      <Table>
        <thead>
          <TR>
            <TH>ID</TH>
            <TH>Customer</TH>
            <TH>Category</TH>
            <TH>Type</TH>
            <TH>Status</TH>
            <TH>Provider</TH>
            <TH className="text-right">Amount</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {state.bookings.map((bk) => {
            const needsAssign = !bk.finalProviderId && bk.status !== "cancelled";
            const canAdvance = bk.finalProviderId && !["done", "cancelled"].includes(bk.status);
            const trackIdx = trackIndexOf(bk.status);
            const nextStatus =
              trackIdx >= 0 ? TRACK_STATUS_ORDER[Math.min(TRACK_STATUS_ORDER.length - 1, trackIdx + 1)] : null;
            return (
              <TR key={bk.id}>
                <TD>{bk.ref}</TD>
                <TD>{bk.customerName}</TD>
                <TD>{bk.category}</TD>
                <TD>{bk.bookingTypeLabel}</TD>
                <TD>
                  <Tag variant={statusVariant(statusLabel[bk.status])}>{statusLabel[bk.status]}</Tag>
                </TD>
                <TD>
                  {needsAssign ? (
                    <select
                      className="min-h-9 py-1.5 px-2.5 text-xs text-text bg-surface border border-divider rounded-md"
                      defaultValue=""
                      onChange={(e) => assignProvider(bk.id, e.target.value)}
                    >
                      <option value="">Assign pro…</option>
                      {activeProviders.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{bk.providerName}</span>
                  )}
                </TD>
                <TD className="text-right">R{bk.amount}</TD>
                <TD>
                  {canAdvance && nextStatus && (
                    <Button variant="secondary" onClick={() => advanceBookingStatus(bk.id)}>
                      Mark {statusLabel[nextStatus]}
                    </Button>
                  )}
                </TD>
              </TR>
            );
          })}
          {state.bookings.length === 0 && (
            <TR>
              <TD colSpan={8} className="text-neutral-400">
                No bookings yet.
              </TD>
            </TR>
          )}
        </tbody>
      </Table>
    </>
  );
}
