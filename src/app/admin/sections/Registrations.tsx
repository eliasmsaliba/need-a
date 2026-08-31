import { UserPlus } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { statusVariant } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";

const ROLE_TAG_VARIANT = { customer: "accent-2", provider: "accent" } as const;

export function Registrations({ flow }: { flow: AdminConsoleFlow }) {
  const { state } = flow;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Registrations</h2>
      <Card elevation="glow" className="p-6 gap-3">
        <div className="flex items-center gap-2">
          <UserPlus weight="duotone" className="text-lg text-accent-400" />
          <span className="text-[15px] font-medium">Recent sign-ups</span>
        </div>
        <Table>
          <thead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Registered</TH>
              <TH>Status</TH>
            </TR>
          </thead>
          <tbody>
            {state.registrations.map((r) => (
              <TR key={r.id}>
                <TD>{r.name}</TD>
                <TD>{r.email}</TD>
                <TD>
                  <Tag variant={ROLE_TAG_VARIANT[r.role as "customer" | "provider"] ?? "neutral"}>
                    {r.role}
                  </Tag>
                </TD>
                <TD>{new Date(r.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <Tag variant={statusVariant(r.status)}>{r.status}</Tag>
                </TD>
              </TR>
            ))}
            {state.registrations.length === 0 && (
              <TR>
                <TD colSpan={5} className="text-neutral-400">
                  No registrations yet.
                </TD>
              </TR>
            )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
