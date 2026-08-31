import { randomBytes, createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { sendAdminInviteEmail } from "./email";

const INVITE_TTL_MS = 30 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueAdminInviteToken(email: string, baseUrl: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return;

  const token = randomBytes(32).toString("hex");
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  const inviteUrl = `${baseUrl}/reset-password?token=${token}`;
  await sendAdminInviteEmail(email, inviteUrl);
}
