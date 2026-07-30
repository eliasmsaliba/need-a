import bcrypt from "bcryptjs";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { sendOtpEmail } from "./email";

const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function issueEmailOtp(userId: string, email: string) {
  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);
  await db.insert(otpCodes).values({
    userId,
    codeHash,
    purpose: "verify_email",
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] OTP for ${email}: ${code}`);
  }
  await sendOtpEmail(email, code);
}

export async function verifyEmailOtp(userId: string, code: string): Promise<boolean> {
  const [latest] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.userId, userId),
        eq(otpCodes.purpose, "verify_email"),
        isNull(otpCodes.consumedAt),
      ),
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);

  if (!latest) return false;
  if (latest.expiresAt.getTime() < Date.now()) return false;

  const valid = await bcrypt.compare(code, latest.codeHash);
  if (!valid) return false;

  await db.update(otpCodes).set({ consumedAt: new Date() }).where(eq(otpCodes.id, latest.id));
  return true;
}
