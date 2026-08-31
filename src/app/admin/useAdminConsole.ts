"use client";

import { useReducer } from "react";
import { seedCategories, seedDisputes, seedPayouts } from "./data";
import {
  assignProviderAction,
  advanceBookingStatusAction,
  toggleCustomerSuspendAction,
  toggleProviderSuspendAction,
  verifyProviderAction,
} from "./actions";
import { ADMIN_STATUS_LABELS } from "@/lib/booking-status";
import type {
  MockCategory,
  MockDispute,
  MockPayout,
  RealBooking,
  RealCustomer,
  RealProvider,
  SectionKey,
} from "./types";

interface AdminState {
  section: SectionKey;
  bookings: RealBooking[];
  categories: MockCategory[];
  payouts: MockPayout[];
  disputes: MockDispute[];
  providers: RealProvider[];
  customers: RealCustomer[];
}

type Action =
  | { type: "SET_SECTION"; section: SectionKey }
  | { type: "SET_BOOKING"; id: string; patch: Partial<RealBooking> }
  | { type: "MARK_PAYOUT_PAID"; id: string }
  | { type: "UPDATE_CATEGORY"; id: string; field: "calloutFee" | "baseRate"; value: number }
  | { type: "RESOLVE_DISPUTE"; id: string }
  | { type: "DISMISS_DISPUTE"; id: string }
  | { type: "SET_PROVIDER_STATUS"; id: string; status: RealProvider["status"] }
  | { type: "SET_CUSTOMER_STATUS"; id: string; status: RealCustomer["status"] };

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case "SET_SECTION":
      return { ...state, section: action.section };
    case "SET_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, ...action.patch } : b)),
      };
    case "MARK_PAYOUT_PAID":
      return {
        ...state,
        payouts: state.payouts.map((p) => (p.id === action.id ? { ...p, status: "Paid" } : p)),
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, [action.field]: action.value } : c,
        ),
      };
    case "RESOLVE_DISPUTE":
      return {
        ...state,
        disputes: state.disputes.map((d) => (d.id === action.id ? { ...d, status: "Resolved" } : d)),
      };
    case "DISMISS_DISPUTE":
      return {
        ...state,
        disputes: state.disputes.map((d) => (d.id === action.id ? { ...d, status: "Dismissed" } : d)),
      };
    case "SET_PROVIDER_STATUS":
      return {
        ...state,
        providers: state.providers.map((p) =>
          p.id === action.id ? { ...p, status: action.status } : p,
        ),
      };
    case "SET_CUSTOMER_STATUS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c,
        ),
      };
    default:
      return state;
  }
}

export function useAdminConsole(
  initialProviders: RealProvider[],
  initialCustomers: RealCustomer[],
  initialBookings: RealBooking[],
) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    section: "dashboard" as SectionKey,
    bookings: initialBookings,
    categories: seedCategories(),
    payouts: seedPayouts(),
    disputes: seedDisputes(),
    providers: initialProviders,
    customers: initialCustomers,
  }));

  const setSection = (section: SectionKey) => dispatch({ type: "SET_SECTION", section });
  const markPayoutPaid = (id: string) => dispatch({ type: "MARK_PAYOUT_PAID", id });
  const updateCategory = (id: string, field: "calloutFee" | "baseRate", value: string) =>
    dispatch({ type: "UPDATE_CATEGORY", id, field, value: Number(value) || 0 });
  const resolveDispute = (id: string) => dispatch({ type: "RESOLVE_DISPUTE", id });
  const dismissDispute = (id: string) => dispatch({ type: "DISMISS_DISPUTE", id });

  async function assignProvider(bookingId: string, providerId: string) {
    if (!providerId) return;
    const result = await assignProviderAction(bookingId, providerId);
    if ("success" in result) {
      const provider = state.providers.find((p) => p.id === providerId);
      dispatch({
        type: "SET_BOOKING",
        id: bookingId,
        patch: { finalProviderId: providerId, providerName: provider?.name ?? null, status: "assigned" },
      });
    }
  }

  async function advanceBookingStatus(bookingId: string) {
    const result = await advanceBookingStatusAction(bookingId);
    if ("success" in result) {
      dispatch({ type: "SET_BOOKING", id: bookingId, patch: { status: result.status } });
    }
  }

  async function verifyProvider(id: string) {
    const result = await verifyProviderAction(id);
    if ("success" in result) dispatch({ type: "SET_PROVIDER_STATUS", id, status: "Active" });
  }
  async function toggleProviderSuspend(id: string) {
    const result = await toggleProviderSuspendAction(id);
    if ("success" in result) {
      dispatch({
        type: "SET_PROVIDER_STATUS",
        id,
        status: result.status === "suspended" ? "Suspended" : "Active",
      });
    }
  }
  async function toggleCustomerSuspend(id: string) {
    const result = await toggleCustomerSuspendAction(id);
    if ("success" in result) {
      dispatch({
        type: "SET_CUSTOMER_STATUS",
        id,
        status: result.status === "suspended" ? "Suspended" : "Active",
      });
    }
  }

  const activeProviders = state.providers.filter((p) => p.status === "Active");

  const activeJobsCount = state.bookings.filter(
    (b) => !["done", "cancelled"].includes(b.status),
  ).length;
  const gmvToday = state.bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.amount, 0);
  const ratedProviders = state.providers.filter((p) => p.rating > 0);
  const avgRating = ratedProviders.length
    ? (ratedProviders.reduce((a, b) => a + b.rating, 0) / ratedProviders.length).toFixed(1)
    : "0.0";
  const openDisputesCount = state.disputes.filter((d) => d.status === "Open").length;

  const catCounts: Record<string, number> = {};
  state.bookings.forEach((b) => {
    catCounts[b.category] = (catCounts[b.category] || 0) + 1;
  });
  const maxCount = Math.max(1, ...Object.values(catCounts));
  const chartBars = Object.keys(catCounts).map((name) => ({
    name,
    heightPx: Math.max(6, Math.round((catCounts[name] / maxCount) * 110)),
  }));

  const recentBookings = state.bookings.slice(0, 5);

  return {
    state,
    setSection,
    assignProvider,
    advanceBookingStatus,
    markPayoutPaid,
    updateCategory,
    resolveDispute,
    dismissDispute,
    verifyProvider,
    toggleProviderSuspend,
    toggleCustomerSuspend,
    activeProviders,
    activeJobsCount,
    gmvToday,
    avgRating,
    openDisputesCount,
    chartBars,
    recentBookings,
    statusLabel: ADMIN_STATUS_LABELS,
  };
}

export type AdminConsoleFlow = ReturnType<typeof useAdminConsole>;
