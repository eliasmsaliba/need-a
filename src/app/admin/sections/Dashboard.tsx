import { Briefcase, CurrencyCircleDollar, Star, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

interface StatCard {
  label: string;
  value: string | number;
  icon: typeof Briefcase;
}

function buildStats(flow: {
  activeJobsCount: number;
  gmvToday: number;
  avgRating: string;
  openDisputesCount: number;
}): StatCard[] {
  return [
    { label: "Active jobs", value: flow.activeJobsCount, icon: Briefcase },
    { label: "GMV today", value: `R${flow.gmvToday}`, icon: CurrencyCircleDollar },
    { label: "Avg pro rating", value: flow.avgRating, icon: Star },
    { label: "Open disputes", value: flow.openDisputesCount, icon: WarningCircle },
  ];
}

export function Dashboard({ flow }: { flow: AdminConsoleFlow }) {
  const { activeJobsCount, gmvToday, avgRating, openDisputesCount, chartBars, recentBookings, statusLabel } =
    flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buildStats({ activeJobsCount, gmvToday, avgRating, openDisputesCount }).map((s) => (
          <Card key={s.label} elevation="glow" className="p-[18px] gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wide uppercase text-accent-300">{s.label}</span>
              <s.icon weight="duotone" className="text-lg text-accent-400" />
            </div>
            <span className="text-3xl font-semibold tracking-tight">{s.value}</span>
          </Card>
        ))}
      </div>

      <Card className="p-6 gap-4">
        <span className="text-[15px] font-medium">Bookings by category</span>
        <div className="flex items-end gap-5 h-[140px] pt-2.5">
          {chartBars.map((bar) => (
            <div key={bar.name} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-9 rounded-t bg-[image:var(--gradient-hero)]"
                style={{ height: `${bar.heightPx}px` }}
              />
              <span className="text-[11px] text-neutral-400 text-center">{bar.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 gap-3">
        <span className="text-[15px] font-medium">Recent bookings</span>
        <Table>
          <thead>
            <TR>
              <TH>ID</TH>
              <TH>Customer</TH>
              <TH>Category</TH>
              <TH>Status</TH>
              <TH className="text-right">Amount</TH>
            </TR>
          </thead>
          <tbody>
            {recentBookings.map((rb) => (
              <TR key={rb.id}>
                <TD>{rb.ref}</TD>
                <TD>{rb.customerName}</TD>
                <TD>{rb.category}</TD>
                <TD>
                  <Tag variant={statusVariant(statusLabel[rb.status])}>{statusLabel[rb.status]}</Tag>
                </TD>
                <TD className="text-right">R{rb.amount}</TD>
              </TR>
            ))}
            {recentBookings.length === 0 && (
              <TR>
                <TD colSpan={5} className="text-neutral-400">
                  No bookings yet.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
