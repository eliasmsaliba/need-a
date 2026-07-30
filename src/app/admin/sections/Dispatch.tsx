import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { BOOKING_STATUSES, statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Dispatch({ flow }: { flow: AdminConsoleFlow }) {
  const { state, activeMockProviders, assignProvider, advanceBookingStatus } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Dispatch queue</h2>
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
            const providerName = state.mockProviders.find((p) => p.id === bk.providerId)?.name;
            const needsAssign = !bk.providerId && bk.status !== "Cancelled";
            const canAdvance = bk.providerId && !["Done", "Cancelled"].includes(bk.status);
            const nextIdx = Math.min(4, BOOKING_STATUSES.indexOf(bk.status as (typeof BOOKING_STATUSES)[number]) + 1);
            return (
              <TR key={bk.id}>
                <TD>{bk.id}</TD>
                <TD>{bk.customer}</TD>
                <TD>{bk.category}</TD>
                <TD>{bk.type}</TD>
                <TD>
                  <Tag variant={statusVariant(bk.status)}>{bk.status}</Tag>
                </TD>
                <TD>
                  {needsAssign ? (
                    <select
                      className="min-h-9 py-1.5 px-2.5 text-xs text-text bg-surface border border-divider rounded-md"
                      defaultValue=""
                      onChange={(e) => assignProvider(bk.id, e.target.value)}
                    >
                      <option value="">Assign pro…</option>
                      {activeMockProviders.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{providerName}</span>
                  )}
                </TD>
                <TD className="text-right">R{bk.amount}</TD>
                <TD>
                  {canAdvance && (
                    <Button variant="secondary" onClick={() => advanceBookingStatus(bk.id)}>
                      Mark {BOOKING_STATUSES[nextIdx]}
                    </Button>
                  )}
                </TD>
              </TR>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
