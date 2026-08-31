import type { AdminSubRole, MockDispute, MockPayout, SectionKey } from "./types";

export const ROLE_LABELS: Record<AdminSubRole, string> = {
  ops: "Ops Admin",
  support: "Support Agent",
  finance: "Finance",
};

export const NAV: { key: SectionKey; label: string; roles: AdminSubRole[] }[] = [
  { key: "dashboard", label: "Dashboard", roles: ["ops", "support", "finance"] },
  { key: "dispatch", label: "Dispatch queue", roles: ["ops", "support"] },
  { key: "providers", label: "Providers", roles: ["ops", "support"] },
  { key: "customers", label: "Customers", roles: ["ops", "support"] },
  { key: "payments", label: "Payments & payouts", roles: ["ops", "finance"] },
  { key: "categories", label: "Categories & pricing", roles: ["ops", "finance"] },
  { key: "registrations", label: "Registrations", roles: ["ops", "support"] },
  { key: "reviews", label: "Reviews & disputes", roles: ["ops", "support"] },
];

export function seedPayouts(): MockPayout[] {
  return [
    { id: "PO-501", provider: "Thabo M.", amount: 7820, status: "Pending" },
    { id: "PO-500", provider: "Sarah K.", amount: 5140, status: "Pending" },
    { id: "PO-499", provider: "Given P.", amount: 9960, status: "Paid" },
    { id: "PO-498", provider: "Kabelo R.", amount: 1200, status: "Paid" },
  ];
}

export function seedDisputes(): MockDispute[] {
  return [
    { id: "D-12", customer: "Craig D.", provider: "Kabelo R.", reason: "No-show, then rude on call.", status: "Open" },
    { id: "D-11", customer: "Amahle N.", provider: "Given P.", reason: "Overcharged for materials vs. quote.", status: "Open" },
    { id: "D-9", customer: "Johan V.", provider: "Sarah K.", reason: "Damaged property claim.", status: "Resolved" },
  ];
}

export function statusVariant(status: string): "accent" | "neutral" | "outline" {
  if (["Active", "Done", "Paid", "Resolved"].includes(status)) return "accent";
  if (["Suspended", "Cancelled", "Dismissed"].includes(status)) return "neutral";
  return "outline";
}
