import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, type BookingStatus } from "@/db/schema";
import { TRACK_STATUS_ORDER, trackIndexOf } from "./booking-status";

export function generateArrivalPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function advanceBookingStatus(bookingId: string): Promise<BookingStatus | null> {
  const [row] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!row) return null;

  const idx = trackIndexOf(row.status);
  if (idx === -1) return row.status; // pending/cancelled — nothing to advance

  const nextStatus = TRACK_STATUS_ORDER[Math.min(TRACK_STATUS_ORDER.length - 1, idx + 1)];
  await db.update(bookings).set({ status: nextStatus }).where(eq(bookings.id, bookingId));
  return nextStatus;
}
