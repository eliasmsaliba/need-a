"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { adminProfiles, customerProfiles, providerProfiles } from "@/db/schema";
import type { AdminSubRole } from "./types";

async function requireAdmin(allowed?: AdminSubRole[]): Promise<AdminSubRole> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Not authorized.");
  }
  const [profile] = await db
    .select()
    .from(adminProfiles)
    .where(eq(adminProfiles.userId, session.user.id));
  if (!profile) throw new Error("Not authorized.");
  if (allowed && !allowed.includes(profile.subRole)) throw new Error("Not authorized.");
  return profile.subRole;
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
