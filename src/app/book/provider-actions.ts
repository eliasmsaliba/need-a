"use server";

import { and, arrayContains, eq } from "drizzle-orm";
import { db } from "@/db";
import { providerProfiles, users } from "@/db/schema";
import { getCategoryName } from "@/lib/categories";
import type { CategoryId, MatchedProvider } from "./types";

export async function getMatchingProviders(categoryId: CategoryId): Promise<MatchedProvider[]> {
  const categoryName = await getCategoryName(categoryId);
  if (!categoryName) return [];

  const rows = await db
    .select({
      id: users.id,
      name: providerProfiles.bizName,
      guaranteeDays: providerProfiles.guaranteeDays,
      hourlyRate: providerProfiles.hourlyRate,
      calloutFee: providerProfiles.calloutFee,
      serviceRadius: providerProfiles.serviceRadius,
    })
    .from(providerProfiles)
    .innerJoin(users, eq(users.id, providerProfiles.userId))
    .where(
      and(
        eq(providerProfiles.status, "active"),
        arrayContains(providerProfiles.selectedCategories, [categoryName]),
      ),
    );

  return rows.map((r) => ({ ...r, name: r.name || "Unnamed pro", badge: "Verified" as const }));
}
