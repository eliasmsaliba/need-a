import { randomBytes, createHash } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { sendPasswordResetEmail } from "./email";

const RESET_TTL_MS = 30 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issuePasswordResetToken(email: string, baseUrl: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  // Always behave the same whether or not the email exists, to avoid account enumeration.
  if (!user) return;

  const token = randomBytes(32).toString("hex");
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (err) {
    // Swallowed deliberately: the caller always reports success regardless of
    // whether the email exists or the send succeeded, to avoid account enumeration.
    console.error("Failed to send password reset email:", err);
  }
}

export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), isNull(passwordResetTokens.consumedAt)));

  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  await db
    .update(passwordResetTokens)
    .set({ consumedAt: new Date() })
    .where(eq(passwordResetTokens.id, row.id));

  return row.userId;
}
