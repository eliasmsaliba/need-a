import type {
  AdminSubRole,
  MockBooking,
  MockCategory,
  MockDispute,
  MockPayout,
  MockProvider,
  SectionKey,
} from "./types";

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
  { key: "reviews", label: "Reviews & disputes", roles: ["ops", "support"] },
];

export const BOOKING_STATUSES: MockBooking["status"][] = [
  "Pending",
  "Assigned",
  "En route",
  "Working",
  "Done",
];

// Mock provider roster for the Dispatch/Dashboard demo data only — kept separate
// from the real Providers tab, matching the prototype's self-contained seed world.
export function seedMockProviders(): MockProvider[] {
  return [
    { id: "thabo", name: "Thabo M.", badge: "Verified", rating: 4.9, jobs: 128, status: "Active" },
    { id: "sarah", name: "Sarah K.", badge: "Verified", rating: 4.8, jobs: 86, status: "Active" },
    { id: "given", name: "Given P.", badge: "Elite", rating: 5.0, jobs: 240, status: "Active" },
    { id: "nomvula", name: "Nomvula T.", badge: "New", rating: 0, jobs: 0, status: "Pending verification" },
    { id: "kabelo", name: "Kabelo R.", badge: "Verified", rating: 4.1, jobs: 52, status: "Suspended" },
  ];
}

export function seedBookings(): MockBooking[] {
  return [
    { id: "BK-1042", customer: "Naledi K.", category: "Plumbing", type: "Fix Now", status: "Pending", providerId: null, amount: 620 },
    { id: "BK-1041", customer: "Johan V.", category: "Electrical", type: "Schedule It", status: "Assigned", providerId: "sarah", amount: 780 },
    { id: "BK-1039", customer: "Amahle N.", category: "Home cleaning", type: "Fix Now", status: "En route", providerId: "given", amount: 450 },
    { id: "BK-1037", customer: "Peter S.", category: "Handyman", type: "Get Quotes", status: "Working", providerId: "thabo", amount: 990 },
    { id: "BK-1035", customer: "Zanele M.", category: "Appliance repair", type: "Fix Now", status: "Done", providerId: "thabo", amount: 540 },
    { id: "BK-1033", customer: "Riaan B.", category: "Gardening", type: "Schedule It", status: "Done", providerId: "sarah", amount: 380 },
    { id: "BK-1030", customer: "Lindiwe P.", category: "Plumbing", type: "Get Quotes", status: "Pending", providerId: null, amount: 710 },
    { id: "BK-1028", customer: "Craig D.", category: "Electrical", type: "Fix Now", status: "Cancelled", providerId: null, amount: 0 },
  ];
}

export function seedCategories(): MockCategory[] {
  return [
    { id: "plumbing", name: "Plumbing", calloutFee: 150, baseRate: 350 },
    { id: "electrical", name: "Electrical", calloutFee: 150, baseRate: 380 },
    { id: "handyman", name: "Handyman", calloutFee: 120, baseRate: 300 },
    { id: "cleaning", name: "Home cleaning", calloutFee: 0, baseRate: 250 },
    { id: "appliance", name: "Appliance repair", calloutFee: 150, baseRate: 320 },
    { id: "gardening", name: "Gardening", calloutFee: 0, baseRate: 220 },
  ];
}

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
