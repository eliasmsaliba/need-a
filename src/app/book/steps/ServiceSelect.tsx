import { CATEGORIES } from "../data";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { BookingFlow } from "../useBookingFlow";

export function ServiceSelect({ flow }: { flow: BookingFlow }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-medium">What do you need help with?</h2>
        <p className="text-neutral-400 text-[13px]">
          Pick a category to get matched with verified pros.
        </p>
      </div>
      <div className="flex flex-col border border-neutral-800 rounded-md overflow-hidden">
        {CATEGORIES.map((c) => {
          const selected = flow.state.category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => flow.selectCategory(c.id)}
              className={cn(
                "flex items-center justify-between py-3.5 px-4 text-left cursor-pointer hover:bg-neutral-800/60",
                selected && "bg-neutral-800",
              )}
            >
              <span className="text-sm">{c.name}</span>
              <div className="flex gap-2 items-center">
                {c.popular && <Tag variant="neutral">Popular</Tag>}
                {selected && <Tag variant="accent">Selected</Tag>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
