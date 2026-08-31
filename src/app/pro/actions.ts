"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, providerProfiles, type BookingStatus } from "@/db/schema";
import { advanceBookingStatus } from "@/lib/bookings";

export async function advanceMyJobStatusAction(
  bookingId: string,
): Promise<{ success: true; status: BookingStatus } | { error: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "provider") return { error: "Not authorized." };

  const [row] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!row || row.finalProviderId !== session.user.id) return { error: "Not authorized." };

  const status = await advanceBookingStatus(bookingId);
  if (!status) return { error: "Booking not found." };
  return { success: true, status };
}

export interface UpdateAvailabilityInput {
  selectedDays: string[];
  startTime: string;
  endTime: string;
  hourlyRate: number;
  calloutFee: number;
}

export async function updateMyAvailabilityAction(
  input: UpdateAvailabilityInput,
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "provider") return { error: "Not authorized." };

  await db
    .update(providerProfiles)
    .set({
      selectedDays: input.selectedDays,
      startTime: input.startTime,
      endTime: input.endTime,
      hourlyRate: input.hourlyRate,
      calloutFee: input.calloutFee,
    })
    .where(eq(providerProfiles.userId, session.user.id));

  return { success: true };
}
