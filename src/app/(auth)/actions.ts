"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { issueEmailOtp, verifyEmailOtp } from "@/lib/otp";
import { issuePasswordResetToken, consumePasswordResetToken } from "@/lib/password-reset";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createAccount(
  role: "customer" | "provider",
  email: string,
  phone: string,
  password: string,
): Promise<{ userId: string } | { error: string }> {
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ email, phone, passwordHash, role })
    .returning({ id: users.id });

  try {
    await issueEmailOtp(user.id, email);
  } catch (err) {
    // Roll back so a retry with the same email doesn't hit the "already exists" check.
    await db.delete(users).where(eq(users.id, user.id));
    console.error("Failed to send signup OTP:", err);
    return { error: "Couldn't send a verification email right now. Please try again shortly." };
  }

  return { userId: user.id };
}

export async function verifyOtpAction(
  userId: string,
  code: string,
): Promise<{ success: true } | { error: string }> {
  const ok = await verifyEmailOtp(userId, code);
  if (!ok) return { error: "That code isn't right or has expired." };

  await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));
  return { success: true };
}

export async function resendOtpAction(userId: string): Promise<{ success: true } | { error: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return { error: "Account not found." };

  await issueEmailOtp(user.id, user.email);
  return { success: true };
}

export async function loginAction(
  email: string,
  password: string,
): Promise<{ success: true; role: "customer" | "provider" } | { error: string }> {
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Incorrect email or password." };
    throw err;
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));
  return { success: true, role: user.role };
}

export async function requestPasswordResetAction(email: string): Promise<{ success: true }> {
  const baseUrl = await getBaseUrl();
  await issuePasswordResetToken(email, baseUrl);
  // Always succeed regardless of whether the email exists, to avoid account enumeration.
  return { success: true };
}

export async function resetPasswordAction(
  token: string,
  newPassword: string,
): Promise<{ success: true; role: "customer" | "provider" } | { error: string }> {
  const userId = await consumePasswordResetToken(token);
  if (!userId) return { error: "This reset link is invalid or has expired." };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const [user] = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, userId))
    .returning({ role: users.role });

  return { success: true, role: user.role };
}
