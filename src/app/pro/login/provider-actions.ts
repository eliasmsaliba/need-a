"use server";

import { db } from "@/db";
import { providerProfiles } from "@/db/schema";
import { encrypt } from "@/lib/encryption";

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
      step: "verification";
      idDocumentUrl: string | null;
      certificationUrl: string | null;
      portfolioUrls: string[];
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
  let insertValues;
  switch (input.step) {
    case "business":
      insertValues = {
        bizName: input.bizName,
        bizPhone: input.bizPhone,
        bizTradingName: input.bizTradingName,
        selectedCategories: input.selectedCategories,
        serviceRadius: input.serviceRadius,
      };
      break;
    case "availability":
      insertValues = {
        selectedDays: input.selectedDays,
        startTime: input.startTime,
        endTime: input.endTime,
        hourlyRate: input.hourlyRate,
        calloutFee: input.calloutFee,
      };
      break;
    case "verification":
      insertValues = {
        idDocumentUrl: input.idDocumentUrl,
        certificationUrl: input.certificationUrl,
        portfolioUrls: input.portfolioUrls,
      };
      break;
    case "payout":
      insertValues = {
        bankName: input.bankName,
        accountHolder: input.accountHolder,
        accountNumber: encrypt(input.accountNumber),
        branchCode: input.branchCode,
        status: "pending_verification" as const,
      };
      break;
  }

  await db
    .insert(providerProfiles)
    .values({ userId, ...insertValues })
    .onConflictDoUpdate({ target: providerProfiles.userId, set: insertValues });

  return { success: true };
}
