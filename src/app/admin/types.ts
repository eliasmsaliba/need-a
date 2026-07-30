export type AdminSubRole = "ops" | "support" | "finance";

export type SectionKey =
  | "dashboard"
  | "dispatch"
  | "providers"
  | "customers"
  | "payments"
  | "categories"
  | "reviews";

export interface RealProvider {
  id: string;
  name: string;
  badge: "New" | "Verified";
  rating: number;
  jobs: number;
  status: "Pending verification" | "Active" | "Suspended";
}

export interface RealCustomer {
  id: string;
  name: string;
  email: string;
  jobs: number;
  spend: number;
  status: "Active" | "Suspended";
}

export interface MockBooking {
  id: string;
  customer: string;
  category: string;
  type: string;
  status: "Pending" | "Assigned" | "En route" | "Working" | "Done" | "Cancelled";
  providerId: string | null;
  amount: number;
}

export interface MockCategory {
  id: string;
  name: string;
  calloutFee: number;
  baseRate: number;
}

export interface MockPayout {
  id: string;
  provider: string;
  amount: number;
  status: "Pending" | "Paid";
}

export interface MockDispute {
  id: string;
  customer: string;
  provider: string;
  reason: string;
  status: "Open" | "Resolved" | "Dismissed";
}

export interface MockProvider {
  id: string;
  name: string;
  badge: "New" | "Verified" | "Elite";
  rating: number;
  jobs: number;
  status: "Pending verification" | "Active" | "Suspended";
}
