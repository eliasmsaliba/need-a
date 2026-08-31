"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, providerProfiles, type BookingType } from "@/db/schema";
import { advanceBookingStatus, generateArrivalPin } from "@/lib/bookings";
import { bookingRefFor } from "@/lib/booking-status";
import { ESTIMATED_HOURS, VAT_RATE } from "./data";
import type { CategoryId, TrackStatus } from "./types";

export interface CreateBookingInput {
  category: CategoryId;
  bookingType: BookingType;
  address: string;
  location: string;
  running: boolean;
  emergency: boolean;
  notes: string;
  schedDate: string;
  schedTime: string;
  selectedProviderIds: string[];
  finalProviderId: string;
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<{ bookingId: string; bookingRef: string; arrivalPin: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    throw new Error("Not authorized.");
  }

  const [provider] = await db
    .select({ hourlyRate: providerProfiles.hourlyRate, calloutFee: providerProfiles.calloutFee })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, input.finalProviderId));
  if (!provider) throw new Error("Selected provider not found.");

  const labour = Math.round(ESTIMATED_HOURS * provider.hourlyRate);
  const subtotal = provider.calloutFee + labour;
  const amount = Math.round(subtotal * (1 + VAT_RATE));

  const arrivalPin = generateArrivalPin();
  const [row] = await db
    .insert(bookings)
    .values({
      customerId: session.user.id,
      category: input.category,
      bookingType: input.bookingType,
      address: input.address,
      location: input.location,
      running: input.running,
      emergency: input.emergency,
      notes: input.notes,
      schedDate: input.schedDate || null,
      schedTime: input.schedTime || null,
      selectedProviderIds: input.selectedProviderIds,
      finalProviderId: input.finalProviderId,
      amount,
      status: "assigned",
      arrivalPin,
    })
    .returning({ id: bookings.id, seq: bookings.seq });

  return { bookingId: row.id, bookingRef: bookingRefFor(row.seq), arrivalPin };
}

export async function advanceMyBookingStatusAction(
  bookingId: string,
): Promise<{ status: TrackStatus } | { error: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const [row] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!row || row.customerId !== session.user.id) return { error: "Not authorized." };

  const status = await advanceBookingStatus(bookingId);
  if (!status || status === "pending" || status === "cancelled") {
    return { error: "This booking can't be advanced." };
  }
  return { status };
}
