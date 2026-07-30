import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { CATEGORIES } from "./book/data";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 px-4 md:px-10">
        <span className="text-lg font-medium mr-auto">Need-A</span>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/login" className="text-sm text-neutral-300 hover:text-accent">
            Customer
          </Link>
          <Link href="/pro/login" className="text-sm text-neutral-300 hover:text-accent">
            Pro
          </Link>
          <Link href="/admin/login" className="text-sm text-neutral-300 hover:text-accent">
            Admin
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Tag variant="outline">Verified pros</Tag>
          <Tag variant="outline">Money-back guarantee</Tag>
          <Tag variant="outline">Secure payment</Tag>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="text-[42px] font-medium leading-tight">
            Home services, sorted.
          </h1>
          <p className="text-neutral-400 text-base">
            Fix Now, Schedule It, or Get Quotes — get matched with verified pros for
            plumbing, electrical, handyman work, cleaning, appliance repair, and
            gardening.
          </p>
        </div>

        <Link href="/book">
          <Button variant="primary" className="px-6! py-3!">
            Book a service
          </Button>
        </Link>

        <div className="flex gap-3 flex-wrap justify-center max-w-2xl mt-4">
          {CATEGORIES.map((c) => (
            <Tag key={c.id} variant="neutral">
              {c.name}
            </Tag>
          ))}
        </div>
      </main>
    </div>
  );
}
