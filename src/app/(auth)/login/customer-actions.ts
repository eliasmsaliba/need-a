"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { addresses, customerProfiles } from "@/db/schema";

export interface CustomerProfileInput {
  fullName: string;
  phone: string;
  addresses: { label: string; text: string }[];
  payment: "card" | "eft";
  cardNumber: string;
  notif: { sms: boolean; email: boolean; push: boolean };
}

export async function completeCustomerProfile(
  userId: string,
  input: CustomerProfileInput,
): Promise<{ success: true }> {
  const cardLast4 =
    input.payment === "card" && input.cardNumber.replace(/\D/g, "").length >= 4
      ? input.cardNumber.replace(/\D/g, "").slice(-4)
      : null;

  await db
    .insert(customerProfiles)
    .values({
      userId,
      fullName: input.fullName,
      phone: input.phone,
      payment: input.payment,
      cardLast4,
      notifSms: input.notif.sms,
      notifEmail: input.notif.email,
      notifPush: input.notif.push,
    })
    .onConflictDoUpdate({
      target: customerProfiles.userId,
      set: {
        fullName: input.fullName,
        phone: input.phone,
        payment: input.payment,
        cardLast4,
        notifSms: input.notif.sms,
        notifEmail: input.notif.email,
        notifPush: input.notif.push,
      },
    });

  await db.delete(addresses).where(eq(addresses.userId, userId));
  if (input.addresses.length > 0) {
    await db
      .insert(addresses)
      .values(input.addresses.map((a) => ({ userId, label: a.label, text: a.text })));
  }

  return { success: true };
}
