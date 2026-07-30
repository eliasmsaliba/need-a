import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

export function Customers({ flow }: { flow: AdminConsoleFlow }) {
  const { state, toggleCustomerSuspend } = flow;

  return (
    <>
      <h2 className="text-[22px] font-medium">Customers</h2>
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
                <Button variant="ghost" onClick={() => toggleCustomerSuspend(c.id)}>
                  {c.status === "Suspended" ? "Reinstate" : "Suspend"}
                </Button>
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
    </>
  );
}
