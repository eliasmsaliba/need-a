import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import type { Category } from "@/app/book/types";

const DEFAULT_CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: "wrench", popular: true, active: true, calloutFee: 150, baseRate: 350 },
  { id: "electrical", name: "Electrical", icon: "lightning", popular: false, active: true, calloutFee: 150, baseRate: 380 },
  { id: "handyman", name: "Handyman", icon: "hammer", popular: false, active: true, calloutFee: 120, baseRate: 300 },
  { id: "cleaning", name: "Home cleaning", icon: "broom", popular: false, active: true, calloutFee: 0, baseRate: 250 },
  { id: "appliance", name: "Appliance repair", icon: "washing-machine", popular: false, active: true, calloutFee: 150, baseRate: 320 },
  { id: "gardening", name: "Gardening", icon: "plant", popular: false, active: true, calloutFee: 0, baseRate: 220 },
] as const;

async function ensureSeeded() {
  const existing = await db.select({ id: categories.id }).from(categories).limit(1);
  if (existing.length === 0) {
    await db.insert(categories).values([...DEFAULT_CATEGORIES]).onConflictDoNothing();
  }
}

export async function getCategories(opts?: { activeOnly?: boolean }): Promise<Category[]> {
  await ensureSeeded();
  const rows = opts?.activeOnly
    ? await db.select().from(categories).where(eq(categories.active, true))
    : await db.select().from(categories);
  return rows
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((r) => ({ id: r.id, name: r.name, icon: r.icon, popular: r.popular }));
}

export async function getCategoryName(id: string): Promise<string | null> {
  await ensureSeeded();
  const [row] = await db.select({ name: categories.name }).from(categories).where(eq(categories.id, id));
  return row?.name ?? null;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  popular: boolean;
  active: boolean;
  calloutFee: number;
  baseRate: number;
}

export async function getCategoriesAdmin(): Promise<CategoryRow[]> {
  await ensureSeeded();
  const rows = await db.select().from(categories);
  return rows
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      popular: r.popular,
      active: r.active,
      calloutFee: r.calloutFee,
      baseRate: r.baseRate,
    }));
}
