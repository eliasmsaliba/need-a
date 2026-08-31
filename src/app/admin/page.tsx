import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { adminProfiles, bookings, customerProfiles, providerProfiles, users } from "@/db/schema";
import { BOOKING_TYPE_LABELS } from "../book/data";
import { bookingRefFor } from "@/lib/booking-status";
import { getCategoriesAdmin } from "@/lib/categories";
import { AdminConsole } from "./AdminConsole";
import type { RealBooking, RealCustomer, RealProvider, RealRegistration } from "./types";

const PROVIDER_STATUS_LABEL = {
  pending_verification: "Pending verification",
  active: "Active",
  suspended: "Suspended",
} as const;

const CUSTOMER_STATUS_LABEL = {
  active: "Active",
  suspended: "Suspended",
} as const;

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const [profile] = await db
    .select()
    .from(adminProfiles)
    .where(eq(adminProfiles.userId, session.user.id));
  if (!profile) redirect("/admin/login");

  const providerRows = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      bizName: providerProfiles.bizName,
      bizPhone: providerProfiles.bizPhone,
      bizTradingName: providerProfiles.bizTradingName,
      selectedCategories: providerProfiles.selectedCategories,
      serviceRadius: providerProfiles.serviceRadius,
      hourlyRate: providerProfiles.hourlyRate,
      calloutFee: providerProfiles.calloutFee,
      guaranteeDays: providerProfiles.guaranteeDays,
      status: providerProfiles.status,
      idDocumentUrl: providerProfiles.idDocumentUrl,
    })
    .from(users)
    .innerJoin(providerProfiles, eq(providerProfiles.userId, users.id))
    .where(eq(users.role, "provider"));

  const providers: RealProvider[] = providerRows.map((p) => ({
    id: p.id,
    name: p.bizName || p.email,
    email: p.email,
    badge: p.status === "pending_verification" ? "New" : "Verified",
    rating: 0,
    jobs: 0,
    status: PROVIDER_STATUS_LABEL[p.status],
    idDocumentUrl: p.idDocumentUrl,
    bizPhone: p.bizPhone,
    bizTradingName: p.bizTradingName,
    selectedCategories: p.selectedCategories,
    serviceRadius: p.serviceRadius,
    hourlyRate: p.hourlyRate,
    calloutFee: p.calloutFee,
    guaranteeDays: p.guaranteeDays,
  }));

  const customerRows = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      fullName: customerProfiles.fullName,
      phone: customerProfiles.phone,
      status: customerProfiles.status,
    })
    .from(users)
    .innerJoin(customerProfiles, eq(customerProfiles.userId, users.id))
    .where(eq(users.role, "customer"));

  const customers: RealCustomer[] = customerRows.map((c) => ({
    id: c.id,
    name: c.fullName || c.email,
    email: c.email,
    phone: c.phone,
    jobs: 0,
    spend: 0,
    status: CUSTOMER_STATUS_LABEL[c.status],
  }));

  const customerNameById = new Map(customerRows.map((c) => [c.id, c.fullName || c.email]));
  const providerNameById = new Map(providerRows.map((p) => [p.id, p.bizName || p.email]));

  const categoriesFull = await getCategoriesAdmin();
  const categoryNameById = new Map(categoriesFull.map((c) => [c.id, c.name]));

  const bookingRows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  const realBookings: RealBooking[] = bookingRows.map((b) => ({
    id: b.id,
    ref: bookingRefFor(b.seq),
    customerName: customerNameById.get(b.customerId) ?? "Customer",
    category: categoryNameById.get(b.category) ?? b.category,
    bookingTypeLabel: BOOKING_TYPE_LABELS[b.bookingType],
    status: b.status,
    finalProviderId: b.finalProviderId,
    providerName: b.finalProviderId ? (providerNameById.get(b.finalProviderId) ?? null) : null,
    amount: b.amount,
  }));

  const registrations: RealRegistration[] = [
    ...providerRows.map((p) => ({
      id: p.id,
      name: p.bizName || p.email,
      email: p.email,
      role: "provider" as const,
      createdAt: p.createdAt.toISOString(),
      status: PROVIDER_STATUS_LABEL[p.status],
    })),
    ...customerRows.map((c) => ({
      id: c.id,
      name: c.fullName || c.email,
      email: c.email,
      role: "customer" as const,
      createdAt: c.createdAt.toISOString(),
      status: CUSTOMER_STATUS_LABEL[c.status],
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50);

  return (
    <AdminConsole
      subRole={profile.subRole}
      adminEmail={session.user.email ?? ""}
      initialProviders={providers}
      initialCustomers={customers}
      initialBookings={realBookings}
      initialCategories={categoriesFull}
      initialRegistrations={registrations}
    />
  );
}
