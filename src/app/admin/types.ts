import type { BookingStatus } from "@/db/schema";

export type AdminSubRole = "ops" | "support" | "finance";

export interface RealBooking {
  id: string;
  ref: string;
  customerName: string;
  category: string;
  bookingTypeLabel: string;
  status: BookingStatus;
  finalProviderId: string | null;
  providerName: string | null;
  amount: number;
}

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
  idDocumentUrl: string | null;
}

export interface RealCustomer {
  id: string;
  name: string;
  email: string;
  jobs: number;
  spend: number;
  status: "Active" | "Suspended";
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
