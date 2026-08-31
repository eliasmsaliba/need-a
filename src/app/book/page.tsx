import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { BookingFlow } from "./BookingFlow";

export default async function BookPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "customer") redirect("/");

  const [savedAddress] = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .limit(1);

  return <BookingFlow initialAddress={savedAddress?.text ?? ""} />;
}
