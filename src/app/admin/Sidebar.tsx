"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { logoutAction } from "../(auth)/actions";
import { ROLE_LABELS } from "./data";
import type { AdminSubRole, SectionKey } from "./types";

interface SidebarProps {
  subRole: AdminSubRole;
  adminEmail: string;
  navItems: { key: SectionKey; label: string }[];
  activeSection: SectionKey;
  onSelect: (key: SectionKey) => void;
}

export function Sidebar({ subRole, adminEmail, navItems, activeSection, onSelect }: SidebarProps) {
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push("/admin/login");
  }

  return (
    <aside className="w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-neutral-800 py-6 px-4 flex flex-col gap-5">
      <div className="text-lg font-semibold px-2">
        Need<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">-A</span> Admin
      </div>

      <div className="flex flex-col gap-0.5 px-2">
        <span className="text-[11px] text-neutral-500">Signed in as</span>
        <span className="text-sm">{ROLE_LABELS[subRole]}</span>
        <span className="text-xs text-neutral-400">{adminEmail}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={cn(
              "text-left py-2.5 px-3 rounded-md text-[13px] cursor-pointer transition-colors duration-200 border-l-2",
              activeSection === item.key
                ? "bg-accent-900/60 border-accent text-text"
                : "border-transparent text-neutral-400 hover:bg-neutral-800 hover:text-text",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Button variant="ghost" className="mt-auto w-fit" onClick={handleLogout}>
        Log out
      </Button>
    </aside>
  );
}
