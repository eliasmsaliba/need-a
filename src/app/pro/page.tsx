import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

export default function ProHome() {
  return (
    <div className="flex-1 flex flex-col">
      <nav className="flex items-center py-3 px-10">
        <span className="text-lg font-medium">Need-A Pro</span>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <Tag variant="outline">Provider dashboard</Tag>
        <h1 className="text-3xl font-medium">You&apos;re in.</h1>
        <p className="text-neutral-400 max-w-md">
          The full pro dashboard (dispatch, job tracking, payouts) isn&apos;t built yet — this is a
          placeholder landing spot after signup/login.
        </p>
        <Link href="/">
          <Button variant="secondary">Back to Need-A</Button>
        </Link>
      </main>
    </div>
  );
}
