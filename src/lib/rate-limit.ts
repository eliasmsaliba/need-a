import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

// DB-backed rather than in-memory: serverless function instances don't share
// memory between invocations, so an in-process counter wouldn't actually limit anything.
export async function checkRateLimit(key: string, { max, windowMs }: RateLimitOptions): Promise<boolean> {
  const now = new Date();

  const [existing] = await db.select().from(rateLimits).where(eq(rateLimits.key, key));

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await db
      .insert(rateLimits)
      .values({ key, count: 1, windowStart: now })
      .onConflictDoUpdate({ target: rateLimits.key, set: { count: 1, windowStart: now } });
    return true;
  }

  if (existing.count >= max) return false;

  await db
    .update(rateLimits)
    .set({ count: sql`${rateLimits.count} + 1` })
    .where(eq(rateLimits.key, key));
  return true;
}
