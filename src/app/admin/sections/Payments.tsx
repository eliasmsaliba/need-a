import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Payments({ flow }: { flow: AdminConsoleFlow }) {
  const { state, markPayoutPaid } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Payments &amp; payouts</h2>
      <Table>
        <thead>
          <TR>
            <TH>ID</TH>
            <TH>Provider</TH>
            <TH className="text-right">Amount</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {state.payouts.map((po) => (
            <TR key={po.id}>
              <TD>{po.id}</TD>
              <TD>{po.provider}</TD>
              <TD className="text-right">R{po.amount}</TD>
              <TD>
                <Tag variant={statusVariant(po.status)}>{po.status}</Tag>
              </TD>
              <TD>
                {po.status === "Pending" && (
                  <Button variant="secondary" onClick={() => markPayoutPaid(po.id)}>
                    Mark as paid
                  </Button>
                )}
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </>
  );
}
