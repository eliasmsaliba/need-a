import { CATEGORIES } from "../data";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import type { BookingFlow } from "../useBookingFlow";

export function Confirm({ flow }: { flow: BookingFlow }) {
  const categoryName =
    CATEGORIES.find((c) => c.id === flow.state.category)?.name ?? "Select a service";
  const p = flow.finalProvider;

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">Confirm booking</h2>
      <Card className="p-5 gap-2.5 max-w-[460px]">
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Provider</span>
          <span>
            {p?.name} · {p?.badge}
          </span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Service</span>
          <span>
            {categoryName} · {flow.state.location}
          </span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Address</span>
          <span>{flow.state.address}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-400">Booking ref</span>
          <span>{flow.state.bookingRef}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span>Est. total</span>
          <span>R{flow.pricing.total.toFixed(2)}</span>
        </div>
      </Card>
      <Tag variant="outline" className="w-fit">
        Arrival PIN {flow.state.arrivalPin} shared once en route
      </Tag>
      <Button variant="primary" className="w-fit" onClick={flow.next}>
        Confirm &amp; authorise payment
      </Button>
    </>
  );
}
