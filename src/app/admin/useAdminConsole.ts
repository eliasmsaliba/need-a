"use client";

import { useReducer } from "react";
import { seedDisputes, seedPayouts } from "./data";
import {
  assignProviderAction,
  advanceBookingStatusAction,
  createCategoryAction,
  inviteTeamMemberAction,
  toggleCustomerSuspendAction,
  toggleProviderSuspendAction,
  toggleTeamMemberActiveAction,
  updateCategoryAction,
  updateCustomerAction,
  updateProviderAction,
  updateTeamMemberRoleAction,
  verifyProviderAction,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type UpdateCustomerInput,
  type UpdateProviderInput,
} from "./actions";
import { ADMIN_STATUS_LABELS } from "@/lib/booking-status";
import type { CategoryRow } from "@/lib/categories";
import type {
  AdminSubRole,
  MockDispute,
  MockPayout,
  RealBooking,
  RealCustomer,
  RealProvider,
  RealRegistration,
  RealTeamMember,
  SectionKey,
} from "./types";

interface AdminState {
  section: SectionKey;
  bookings: RealBooking[];
  categories: CategoryRow[];
  payouts: MockPayout[];
  disputes: MockDispute[];
  providers: RealProvider[];
  customers: RealCustomer[];
  registrations: RealRegistration[];
  team: RealTeamMember[];
}

type Action =
  | { type: "SET_SECTION"; section: SectionKey }
  | { type: "SET_BOOKING"; id: string; patch: Partial<RealBooking> }
  | { type: "MARK_PAYOUT_PAID"; id: string }
  | { type: "ADD_CATEGORY"; category: CategoryRow }
  | { type: "PATCH_CATEGORY"; id: string; patch: Partial<CategoryRow> }
  | { type: "RESOLVE_DISPUTE"; id: string }
  | { type: "DISMISS_DISPUTE"; id: string }
  | { type: "SET_PROVIDER_STATUS"; id: string; status: RealProvider["status"] }
  | { type: "PATCH_PROVIDER"; id: string; patch: Partial<RealProvider> }
  | { type: "SET_CUSTOMER_STATUS"; id: string; status: RealCustomer["status"] }
  | { type: "PATCH_CUSTOMER"; id: string; patch: Partial<RealCustomer> }
  | { type: "ADD_TEAM_MEMBER"; member: RealTeamMember }
  | { type: "PATCH_TEAM_MEMBER"; id: string; patch: Partial<RealTeamMember> };

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
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.category] };
    case "PATCH_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
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
    case "PATCH_PROVIDER":
      return {
        ...state,
        providers: state.providers.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      };
    case "SET_CUSTOMER_STATUS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c,
        ),
      };
    case "PATCH_CUSTOMER":
      return {
        ...state,
        customers: state.customers.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      };
    case "ADD_TEAM_MEMBER":
      return { ...state, team: [...state.team, action.member] };
    case "PATCH_TEAM_MEMBER":
      return {
        ...state,
        team: state.team.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      };
    default:
      return state;
  }
}

export function useAdminConsole(
  initialProviders: RealProvider[],
  initialCustomers: RealCustomer[],
  initialBookings: RealBooking[],
  initialCategories: CategoryRow[],
  initialRegistrations: RealRegistration[],
  initialTeam: RealTeamMember[],
) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    section: "dashboard" as SectionKey,
    bookings: initialBookings,
    categories: initialCategories,
    payouts: seedPayouts(),
    disputes: seedDisputes(),
    providers: initialProviders,
    customers: initialCustomers,
    registrations: initialRegistrations,
    team: initialTeam,
  }));

  const setSection = (section: SectionKey) => dispatch({ type: "SET_SECTION", section });
  const markPayoutPaid = (id: string) => dispatch({ type: "MARK_PAYOUT_PAID", id });
  const resolveDispute = (id: string) => dispatch({ type: "RESOLVE_DISPUTE", id });
  const dismissDispute = (id: string) => dispatch({ type: "DISMISS_DISPUTE", id });

  async function addCategory(input: CreateCategoryInput) {
    const result = await createCategoryAction(input);
    if ("success" in result) {
      dispatch({
        type: "ADD_CATEGORY",
        category: { ...input, id: result.id, active: true },
      });
    }
    return result;
  }

  async function updateCategory(id: string, patch: UpdateCategoryInput) {
    const result = await updateCategoryAction(id, patch);
    if ("success" in result) dispatch({ type: "PATCH_CATEGORY", id, patch });
    return result;
  }

  async function updateProvider(id: string, input: UpdateProviderInput) {
    const result = await updateProviderAction(id, input);
    if ("success" in result) {
      dispatch({
        type: "PATCH_PROVIDER",
        id,
        patch: { name: input.bizName, ...input },
      });
    }
    return result;
  }

  async function updateCustomer(id: string, input: UpdateCustomerInput) {
    const result = await updateCustomerAction(id, input);
    if ("success" in result) {
      dispatch({ type: "PATCH_CUSTOMER", id, patch: { name: input.fullName, phone: input.phone } });
    }
    return result;
  }

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

  async function inviteTeamMember(email: string, subRole: AdminSubRole) {
    const result = await inviteTeamMemberAction(email, subRole);
    if ("success" in result) {
      dispatch({
        type: "ADD_TEAM_MEMBER",
        member: { id: result.id, email: email.trim().toLowerCase(), subRole, active: true },
      });
    }
    return result;
  }

  async function updateTeamMemberRole(id: string, subRole: AdminSubRole) {
    const result = await updateTeamMemberRoleAction(id, subRole);
    if ("success" in result) dispatch({ type: "PATCH_TEAM_MEMBER", id, patch: { subRole } });
    return result;
  }

  async function toggleTeamMemberActive(id: string) {
    const result = await toggleTeamMemberActiveAction(id);
    if ("success" in result) {
      dispatch({ type: "PATCH_TEAM_MEMBER", id, patch: { active: result.active } });
    }
    return result;
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
    addCategory,
    updateCategory,
    updateProvider,
    updateCustomer,
    resolveDispute,
    dismissDispute,
    verifyProvider,
    toggleProviderSuspend,
    toggleCustomerSuspend,
    inviteTeamMember,
    updateTeamMemberRole,
    toggleTeamMemberActive,
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
