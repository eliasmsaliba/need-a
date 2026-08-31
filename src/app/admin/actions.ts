"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  adminProfiles,
  bookings,
  categories,
  customerProfiles,
  providerProfiles,
  users,
  type BookingStatus,
} from "@/db/schema";
import { advanceBookingStatus } from "@/lib/bookings";
import { issueAdminInviteToken } from "@/lib/admin-invite";
import { getBaseUrl } from "@/lib/base-url";
import type { AdminSubRole } from "./types";

async function requireAdmin(
  allowed?: AdminSubRole[],
): Promise<{ userId: string; subRole: AdminSubRole }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized.");
  }
  const [profile] = await db
    .select()
    .from(adminProfiles)
    .where(eq(adminProfiles.userId, session.user.id));
  if (!profile || !profile.active) throw new Error("Not authorized.");
  if (allowed && !allowed.includes(profile.subRole)) throw new Error("Not authorized.");
  return { userId: session.user.id, subRole: profile.subRole };
}

export async function verifyProviderAction(userId: string): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  await db
    .update(providerProfiles)
    .set({ status: "active" })
    .where(eq(providerProfiles.userId, userId));
  return { success: true };
}

export async function toggleProviderSuspendAction(
  userId: string,
): Promise<{ success: true; status: "active" | "suspended" } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  const [row] = await db
    .select()
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, userId));
  if (!row || row.status === "pending_verification") return { error: "Cannot suspend a pending provider." };

  const nextStatus = row.status === "suspended" ? "active" : "suspended";
  await db.update(providerProfiles).set({ status: nextStatus }).where(eq(providerProfiles.userId, userId));
  return { success: true, status: nextStatus };
}

export async function toggleCustomerSuspendAction(
  userId: string,
): Promise<{ success: true; status: "active" | "suspended" } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  const [row] = await db
    .select()
    .from(customerProfiles)
    .where(eq(customerProfiles.userId, userId));
  if (!row) return { error: "Customer not found." };

  const nextStatus = row.status === "suspended" ? "active" : "suspended";
  await db.update(customerProfiles).set({ status: nextStatus }).where(eq(customerProfiles.userId, userId));
  return { success: true, status: nextStatus };
}

export async function assignProviderAction(
  bookingId: string,
  providerId: string,
): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  await db
    .update(bookings)
    .set({ finalProviderId: providerId, status: "assigned" })
    .where(eq(bookings.id, bookingId));
  return { success: true };
}

export async function advanceBookingStatusAction(
  bookingId: string,
): Promise<{ success: true; status: BookingStatus } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  const status = await advanceBookingStatus(bookingId);
  if (!status) return { error: "Booking not found." };
  return { success: true, status };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  popular: boolean;
  calloutFee: number;
  baseRate: number;
}

export async function createCategoryAction(
  input: CreateCategoryInput,
): Promise<{ success: true; id: string } | { error: string }> {
  try {
    await requireAdmin(["ops", "finance"]);
  } catch {
    return { error: "Not authorized." };
  }
  const name = input.name.trim();
  if (!name) return { error: "Category name is required." };

  const id = slugify(name);
  if (!id) return { error: "Category name is required." };

  const [existing] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id));
  if (existing) return { error: "A category with that name already exists." };

  await db.insert(categories).values({
    id,
    name,
    icon: input.icon,
    popular: input.popular,
    calloutFee: input.calloutFee,
    baseRate: input.baseRate,
  });
  return { success: true, id };
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  popular?: boolean;
  active?: boolean;
  calloutFee?: number;
  baseRate?: number;
}

export async function updateCategoryAction(
  id: string,
  input: UpdateCategoryInput,
): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin(["ops", "finance"]);
  } catch {
    return { error: "Not authorized." };
  }
  await db.update(categories).set(input).where(eq(categories.id, id));
  return { success: true };
}

export interface UpdateProviderInput {
  bizName: string;
  bizPhone: string;
  bizTradingName: string;
  selectedCategories: string[];
  serviceRadius: number;
  hourlyRate: number;
  calloutFee: number;
  guaranteeDays: number;
}

export async function updateProviderAction(
  userId: string,
  input: UpdateProviderInput,
): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  await db.update(providerProfiles).set(input).where(eq(providerProfiles.userId, userId));
  return { success: true };
}

export interface UpdateCustomerInput {
  fullName: string;
  phone: string;
}

export async function updateCustomerAction(
  userId: string,
  input: UpdateCustomerInput,
): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin(["ops", "support"]);
  } catch {
    return { error: "Not authorized." };
  }
  await db.update(customerProfiles).set(input).where(eq(customerProfiles.userId, userId));
  return { success: true };
}

export async function inviteTeamMemberAction(
  email: string,
  subRole: AdminSubRole,
): Promise<{ success: true; id: string } | { error: string }> {
  try {
    await requireAdmin(["ops"]);
  } catch {
    return { error: "Not authorized." };
  }

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) return { error: "Email is required." };

  const [existing] = await db.select().from(users).where(eq(users.email, trimmedEmail));
  if (existing) return { error: "An account with this email already exists." };

  const placeholderHash = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
  const [user] = await db
    .insert(users)
    .values({ email: trimmedEmail, passwordHash: placeholderHash, role: "admin", emailVerified: true })
    .returning({ id: users.id });

  await db.insert(adminProfiles).values({ userId: user.id, subRole, active: true });

  try {
    const baseUrl = await getBaseUrl();
    await issueAdminInviteToken(trimmedEmail, baseUrl);
  } catch (err) {
    await db.delete(users).where(eq(users.id, user.id));
    console.error("Failed to send admin invite email:", err);
    return { error: "Couldn't send the invite email right now. Please try again shortly." };
  }

  return { success: true, id: user.id };
}

export async function updateTeamMemberRoleAction(
  userId: string,
  subRole: AdminSubRole,
): Promise<{ success: true } | { error: string }> {
  let caller;
  try {
    caller = await requireAdmin(["ops"]);
  } catch {
    return { error: "Not authorized." };
  }
  if (caller.userId === userId) return { error: "You can't change your own role." };

  await db.update(adminProfiles).set({ subRole }).where(eq(adminProfiles.userId, userId));
  return { success: true };
}

export async function toggleTeamMemberActiveAction(
  userId: string,
): Promise<{ success: true; active: boolean } | { error: string }> {
  let caller;
  try {
    caller = await requireAdmin(["ops"]);
  } catch {
    return { error: "Not authorized." };
  }
  if (caller.userId === userId) return { error: "You can't deactivate your own account." };

  const [row] = await db.select().from(adminProfiles).where(eq(adminProfiles.userId, userId));
  if (!row) return { error: "Team member not found." };

  const nextActive = !row.active;
  await db.update(adminProfiles).set({ active: nextActive }).where(eq(adminProfiles.userId, userId));
  return { success: true, active: nextActive };
}
