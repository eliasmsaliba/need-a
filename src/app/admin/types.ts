import type { BookingStatus, UserRole } from "@/db/schema";

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
  | "registrations"
  | "team"
  | "reviews";

export interface RealProvider {
  id: string;
  name: string;
  email: string;
  badge: "New" | "Verified";
  rating: number;
  jobs: number;
  status: "Pending verification" | "Active" | "Suspended";
  idDocumentUrl: string | null;
  bizPhone: string;
  bizTradingName: string;
  selectedCategories: string[];
  serviceRadius: number;
  hourlyRate: number;
  calloutFee: number;
  guaranteeDays: number;
}

export interface RealCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobs: number;
  spend: number;
  status: "Active" | "Suspended";
}

export interface RealTeamMember {
  id: string;
  email: string;
  subRole: AdminSubRole;
  active: boolean;
}

export interface RealRegistration {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  status: string;
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
