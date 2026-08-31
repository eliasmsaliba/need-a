import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, customerProfiles, providerProfiles } from "@/db/schema";
import { BOOKING_TYPE_LABELS, CATEGORIES } from "../book/data";
import { bookingRefFor } from "@/lib/booking-status";
import { ProviderDashboard } from "./ProviderDashboard";
import type { ProviderProfileData, RealJob } from "./types";

export default async function ProPage() {
  const session = await auth();
  if (!session?.user) redirect("/pro/login");
  if (session.user.role !== "provider") redirect("/");

  const [row] = await db
    .select()
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, session.user.id));
  if (!row) redirect("/pro/login");

  const profile: ProviderProfileData = {
    bizName: row.bizName,
    bizTradingName: row.bizTradingName,
    selectedCategories: row.selectedCategories,
    serviceRadius: row.serviceRadius,
    selectedDays: row.selectedDays,
    startTime: row.startTime,
    endTime: row.endTime,
    hourlyRate: row.hourlyRate,
    calloutFee: row.calloutFee,
    guaranteeDays: row.guaranteeDays,
    status: row.status,
  };

  const jobRows = await db
    .select({
      id: bookings.id,
      seq: bookings.seq,
      category: bookings.category,
      bookingType: bookings.bookingType,
      address: bookings.address,
      location: bookings.location,
      notes: bookings.notes,
      schedDate: bookings.schedDate,
      schedTime: bookings.schedTime,
      amount: bookings.amount,
      status: bookings.status,
      customerName: customerProfiles.fullName,
      customerPhone: customerProfiles.phone,
    })
    .from(bookings)
    .innerJoin(customerProfiles, eq(customerProfiles.userId, bookings.customerId))
    .where(eq(bookings.finalProviderId, session.user.id))
    .orderBy(desc(bookings.createdAt));

  const jobs: RealJob[] = jobRows.map((j) => ({
    id: j.id,
    ref: bookingRefFor(j.seq),
    category: CATEGORIES.find((c) => c.id === j.category)?.name ?? j.category,
    bookingTypeLabel: BOOKING_TYPE_LABELS[j.bookingType],
    customerName: j.customerName || "Customer",
    customerPhone: j.customerPhone,
    address: j.address,
    location: j.location,
    notes: j.notes,
    schedDate: j.schedDate,
    schedTime: j.schedTime,
    amount: j.amount,
    status: j.status,
  }));

  return <ProviderDashboard profile={profile} jobs={jobs} />;
}
