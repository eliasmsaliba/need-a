import Link from "next/link";
import { ShieldCheck, ArrowsClockwise, LockKey } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { IconTile } from "@/components/ui/IconTile";
import { getCategoryIcon } from "./book/category-icons";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

const TRUST_TAGS = [
  { icon: ShieldCheck, label: "Verified pros" },
  { icon: ArrowsClockwise, label: "Money-back guarantee" },
  { icon: LockKey, label: "Secure payment" },
];

export default async function Home() {
  const categories = await getCategories({ activeOnly: true });

  return (
    <div className="flex-1 flex flex-col">
      <nav className="sticky top-0 z-20 flex flex-wrap items-center gap-x-6 gap-y-2 py-3 px-4 md:px-10 bg-bg/70 backdrop-blur-xl border-b border-divider">
        <span className="text-lg font-semibold mr-auto">Need-A</span>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/login" className="text-sm text-neutral-300 hover:text-accent transition-colors">
            Customer
          </Link>
          <Link href="/pro/login" className="text-sm text-neutral-300 hover:text-accent transition-colors">
            Pro
          </Link>
          <Link href="/admin/login" className="text-sm text-neutral-300 hover:text-accent transition-colors">
            Admin
          </Link>
        </div>
      </nav>

      <main className="relative flex-1 flex flex-col items-center gap-16 px-6 py-20 md:py-28 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
          style={{ background: "var(--color-accent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 right-[-10%] w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
          style={{ background: "var(--color-accent-3)" }}
        />

        <div className="relative flex flex-col items-center gap-5 max-w-2xl">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {TRUST_TAGS.map((t) => (
              <Tag key={t.label} variant="outline" className="gap-1.5">
                <t.icon weight="bold" className="text-sm" />
                {t.label}
              </Tag>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
            Home services,{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              sorted.
            </span>
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-xl">
            Fix Now, Schedule It, or Get Quotes — get matched with verified pros for
            plumbing, electrical, handyman work, cleaning, appliance repair, and
            gardening.
          </p>

          <Link href="/book" className="mt-2">
            <Button variant="gradient" className="px-8! py-3.5! text-base rounded-lg!">
              Book a service
            </Button>
          </Link>
        </div>

        <div className="relative grid grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl w-full">
          {categories.map((c) => (
            <IconTile
              key={c.id}
              href="/book"
              icon={getCategoryIcon(c.icon)}
              label={c.name}
              badge={c.popular ? <Tag variant="accent-3">Popular</Tag> : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
