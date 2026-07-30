"use server";

import { db } from "@/db";
import { providerProfiles } from "@/db/schema";

export type ProviderStepInput =
  | {
      step: "business";
      bizName: string;
      bizPhone: string;
      bizTradingName: string;
      selectedCategories: string[];
      serviceRadius: number;
    }
  | {
      step: "availability";
      selectedDays: string[];
      startTime: string;
      endTime: string;
      hourlyRate: number;
      calloutFee: number;
    }
  | {
      step: "payout";
      bankName: string;
      accountHolder: string;
      accountNumber: string;
      branchCode: string;
    };

export async function saveProviderStep(
  userId: string,
  input: ProviderStepInput,
): Promise<{ success: true }> {
  const { step, ...fields } = input;

  const insertValues =
    step === "business"
      ? fields
      : step === "availability"
        ? fields
        : { ...fields, status: "pending_verification" as const };

  await db
    .insert(providerProfiles)
    .values({ userId, ...insertValues })
    .onConflictDoUpdate({ target: providerProfiles.userId, set: insertValues });

  return { success: true };
}
