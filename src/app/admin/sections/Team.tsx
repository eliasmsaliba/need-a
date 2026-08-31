"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Table, TD, TH, TR } from "@/components/ui/Table";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ROLE_LABELS } from "../data";
import type { AdminConsoleFlow } from "../useAdminConsole";
import type { AdminSubRole } from "../types";

const ROLE_OPTIONS: { value: AdminSubRole; label: string }[] = [
  { value: "ops", label: "Ops" },
  { value: "support", label: "Support" },
  { value: "finance", label: "Finance" },
];

export function Team({ flow, adminEmail }: { flow: AdminConsoleFlow; adminEmail: string }) {
  const { state, inviteTeamMember, updateTeamMemberRole, toggleTeamMemberActive } = flow;
  const [email, setEmail] = useState("");
  const [subRole, setSubRole] = useState<AdminSubRole>("support");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmMember = state.team.find((t) => t.id === confirmId);

  async function handleInvite() {
    if (!email.trim()) return;
    setInviting(true);
    setError(null);
    const result = await inviteTeamMember(email, subRole);
    setInviting(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setEmail("");
    setSubRole("support");
  }

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Team</h2>

      <Card elevation="glow" className="p-5 gap-3">
        <span className="text-sm font-medium">Invite team member</span>
        <div className="flex gap-4 items-end flex-wrap">
          <Field label="Email" className="flex-1 min-w-[220px]">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@need-a.co.za"
            />
          </Field>
          <SegmentedControl
            name="invite-role"
            value={subRole}
            onChange={setSubRole}
            options={ROLE_OPTIONS}
          />
          <Button variant="primary" disabled={!email.trim() || inviting} onClick={handleInvite}>
            Send invite
          </Button>
        </div>
        {error && <span className="text-xs text-accent-3-400">{error}</span>}
      </Card>

      <Table>
        <thead>
          <TR>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {state.team.map((member) => {
            const isSelf = member.email.toLowerCase() === adminEmail.toLowerCase();
            return (
              <TR key={member.id}>
                <TD>{member.email}</TD>
                <TD>
                  {isSelf ? (
                    <Tag variant="neutral">{ROLE_LABELS[member.subRole]}</Tag>
                  ) : (
                    <SegmentedControl
                      name={`role-${member.id}`}
                      value={member.subRole}
                      onChange={(next) => updateTeamMemberRole(member.id, next)}
                      options={ROLE_OPTIONS}
                    />
                  )}
                </TD>
                <TD>
                  <Tag variant={member.active ? "accent" : "neutral"}>
                    {member.active ? "Active" : "Suspended"}
                  </Tag>
                </TD>
                <TD>
                  {isSelf ? (
                    <span className="text-xs text-neutral-500">You</span>
                  ) : member.active ? (
                    <Button variant="ghost" onClick={() => setConfirmId(member.id)}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => toggleTeamMemberActive(member.id)}>
                      Reactivate
                    </Button>
                  )}
                </TD>
              </TR>
            );
          })}
          {state.team.length === 0 && (
            <TR>
              <TD colSpan={4} className="text-neutral-400">
                No team members yet.
              </TD>
            </TR>
          )}
        </tbody>
      </Table>

      <ConfirmDialog
        open={!!confirmMember}
        title="Deactivate team member?"
        body={`${confirmMember?.email ?? "This person"} will lose access to the admin console until reactivated.`}
        confirmLabel="Deactivate"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) toggleTeamMemberActive(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
}
