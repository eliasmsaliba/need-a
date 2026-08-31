import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { BookingFlow } from "../useBookingFlow";

export function Matches({ flow }: { flow: BookingFlow }) {
  const { bookingType, selectedProviders, matchedProviders, matchesLoading } = flow.state;
  const isQuotes = bookingType === "quotes";
  const title = isQuotes ? "Choose up to 3 pros to quote" : "Verified matches near you";
  const subtitle = isQuotes
    ? `${selectedProviders.length}/3 selected`
    : "Select a pro to continue.";

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-neutral-400 text-[13px]">{subtitle}</p>
      </div>

      {matchesLoading && <p className="text-sm text-neutral-400">Finding verified pros…</p>}

      {!matchesLoading && matchedProviders.length === 0 && (
        <p className="text-sm text-neutral-400">
          No verified pros for this category yet — check back soon.
        </p>
      )}

      {!matchesLoading && matchedProviders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedProviders.map((p) => {
            const selected = selectedProviders.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => flow.toggleProvider(p.id)}
                className={cn(
                  "flex flex-col gap-1.5 p-3 rounded-md bg-surface border text-left cursor-pointer",
                  selected ? "border-accent-500" : "border-neutral-700 hover:border-accent-500/50",
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{p.name}</span>
                  <Tag variant="accent">{p.badge}</Tag>
                </div>
                <div className="text-xs text-neutral-400">
                  {p.serviceRadius}km radius · R{p.hourlyRate}/h + R{p.calloutFee} call-out
                </div>
                <Tag variant="outline" className="w-fit">
                  {p.guaranteeDays}-day guarantee
                </Tag>
                {selected && (
                  <Tag variant="accent" className="w-fit">
                    Selected
                  </Tag>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
