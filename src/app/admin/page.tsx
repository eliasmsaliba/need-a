import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { adminProfiles, bookings, customerProfiles, providerProfiles, users } from "@/db/schema";
import { BOOKING_TYPE_LABELS, CATEGORIES } from "../book/data";
import { bookingRefFor } from "@/lib/booking-status";
import { AdminConsole } from "./AdminConsole";
import type { RealBooking, RealCustomer, RealProvider } from "./types";

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
      bizName: providerProfiles.bizName,
      status: providerProfiles.status,
      idDocumentUrl: providerProfiles.idDocumentUrl,
    })
    .from(users)
    .innerJoin(providerProfiles, eq(providerProfiles.userId, users.id))
    .where(eq(users.role, "provider"));

  const providers: RealProvider[] = providerRows.map((p) => ({
    id: p.id,
    name: p.bizName || p.email,
    badge: p.status === "pending_verification" ? "New" : "Verified",
    rating: 0,
    jobs: 0,
    status: PROVIDER_STATUS_LABEL[p.status],
    idDocumentUrl: p.idDocumentUrl,
  }));

  const customerRows = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: customerProfiles.fullName,
      status: customerProfiles.status,
    })
    .from(users)
    .innerJoin(customerProfiles, eq(customerProfiles.userId, users.id))
    .where(eq(users.role, "customer"));

  const customers: RealCustomer[] = customerRows.map((c) => ({
    id: c.id,
    name: c.fullName || c.email,
    email: c.email,
    jobs: 0,
    spend: 0,
    status: CUSTOMER_STATUS_LABEL[c.status],
  }));

  const customerNameById = new Map(customerRows.map((c) => [c.id, c.fullName || c.email]));
  const providerNameById = new Map(providerRows.map((p) => [p.id, p.bizName || p.email]));

  const bookingRows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

  const realBookings: RealBooking[] = bookingRows.map((b) => ({
    id: b.id,
    ref: bookingRefFor(b.seq),
    customerName: customerNameById.get(b.customerId) ?? "Customer",
    category: CATEGORIES.find((c) => c.id === b.category)?.name ?? b.category,
    bookingTypeLabel: BOOKING_TYPE_LABELS[b.bookingType],
    status: b.status,
    finalProviderId: b.finalProviderId,
    providerName: b.finalProviderId ? (providerNameById.get(b.finalProviderId) ?? null) : null,
    amount: b.amount,
  }));

  return (
    <AdminConsole
      subRole={profile.subRole}
      adminEmail={session.user.email ?? ""}
      initialProviders={providers}
      initialCustomers={customers}
      initialBookings={realBookings}
    />
  );
}
