import { getCategoryIcon } from "../category-icons";
import { Tag } from "@/components/ui/Tag";
import { IconTile } from "@/components/ui/IconTile";
import type { BookingFlow } from "../useBookingFlow";

export function ServiceSelect({ flow }: { flow: BookingFlow }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">What do you need help with?</h2>
        <p className="text-neutral-400 text-[13px]">
          Pick a category to get matched with verified pros.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {flow.categories.map((c) => {
          const selected = flow.state.category === c.id;
          return (
            <IconTile
              key={c.id}
              icon={getCategoryIcon(c.icon)}
              label={c.name}
              selected={selected}
              onClick={() => flow.selectCategory(c.id)}
              badge={
                <div className="flex gap-1.5">
                  {c.popular && <Tag variant="accent-3">Popular</Tag>}
                  {selected && <Tag variant="accent">Selected</Tag>}
                </div>
              }
            />
          );
        })}
      </div>
    </>
  );
}
