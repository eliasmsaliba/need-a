"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChipToggle } from "@/components/ui/ChipToggle";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { ICON_OPTIONS } from "@/app/book/category-icons";
import type { AdminConsoleFlow } from "../useAdminConsole";

function IconPicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {ICON_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.key)}
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center border cursor-pointer transition-colors duration-150",
              active
                ? "border-accent bg-accent-900 text-accent-300"
                : "border-divider text-neutral-400 hover:border-text/40",
            )}
          >
            <Icon weight={active ? "fill" : "regular"} />
          </button>
        );
      })}
    </div>
  );
}

export function Categories({ flow }: { flow: AdminConsoleFlow }) {
  const { state, addCategory, updateCategory } = flow;
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("wrench");
  const [popular, setPopular] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    const result = await addCategory({ name: name.trim(), icon, popular, calloutFee: 0, baseRate: 0 });
    setCreating(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setName("");
    setIcon("wrench");
    setPopular(false);
  }

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Categories &amp; pricing</h2>

      <Card elevation="glow" className="p-5 gap-3">
        <span className="text-sm font-medium">New category</span>
        <div className="flex gap-4 items-end flex-wrap">
          <Field label="Name" className="flex-1 min-w-[200px]">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pool maintenance"
            />
          </Field>
          <ChipToggle label="Popular" active={popular} onToggle={() => setPopular((p) => !p)} />
          <Button variant="primary" disabled={!name.trim() || creating} onClick={handleCreate}>
            Add category
          </Button>
        </div>
        <IconPicker value={icon} onChange={setIcon} />
        {error && <span className="text-xs text-accent-3-400">{error}</span>}
      </Card>

      <div className="flex flex-col gap-3">
        {state.categories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "flex items-center gap-6 py-4 px-5 rounded-md bg-surface flex-wrap transition-opacity",
              !cat.active && "opacity-50",
            )}
          >
            <IconPicker value={cat.icon} onChange={(nextIcon) => updateCategory(cat.id, { icon: nextIcon })} />
            <span className="flex-1 text-sm font-medium min-w-[120px]">{cat.name}</span>
            <Field label="Call-out fee (R)" className="w-36">
              <Input
                type="number"
                value={cat.calloutFee}
                onChange={(e) => updateCategory(cat.id, { calloutFee: Number(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Base hourly rate (R)" className="w-36">
              <Input
                type="number"
                value={cat.baseRate}
                onChange={(e) => updateCategory(cat.id, { baseRate: Number(e.target.value) || 0 })}
              />
            </Field>
            <ChipToggle
              label={cat.active ? "Active" : "Inactive"}
              active={cat.active}
              onToggle={() => updateCategory(cat.id, { active: !cat.active })}
            />
          </div>
        ))}
      </div>
    </>
  );
}
