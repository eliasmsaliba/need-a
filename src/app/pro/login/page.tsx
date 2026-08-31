import { getCategories } from "@/lib/categories";
import { ProviderAuthPageClient } from "./ProviderAuthPageClient";

export const dynamic = "force-dynamic";

export default async function ProviderAuthPage() {
  const categories = await getCategories({ activeOnly: true });
  return <ProviderAuthPageClient categories={categories} />;
}
