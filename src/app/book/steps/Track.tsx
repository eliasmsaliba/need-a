import { CUSTOMER_TRACK_LABELS, TRACK_STATUS_ORDER } from "@/lib/booking-status";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { BookingFlow } from "../useBookingFlow";

export function Track({ flow }: { flow: BookingFlow }) {
  const { trackStatus, submitting } = flow.state;
  const currentIdx = trackStatus ? TRACK_STATUS_ORDER.indexOf(trackStatus) : -1;
  const done = trackStatus === "done";

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-medium">Track {flow.finalProvider?.name}</h2>
        <p className="text-neutral-400 text-[13px]">
          {flow.finalProvider?.badge} · Arrival PIN {flow.state.arrivalPin}
        </p>
      </div>
      <div className="flex flex-col max-w-[420px]">
        {TRACK_STATUS_ORDER.map((status, i) => {
          const on = i <= currentIdx;
          return (
            <div key={status} className="flex items-start gap-2.5">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full mt-[3px]",
                  on ? "bg-accent-400" : "bg-neutral-600",
                )}
              />
              <div className="flex-1 pb-4">
                <div className={cn("text-[13px]", on ? "text-text" : "text-neutral-500")}>
                  {CUSTOMER_TRACK_LABELS[status]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!done && (
        <Button variant="secondary" className="w-fit" disabled={submitting} onClick={flow.advanceTrack}>
          Simulate next update
        </Button>
      )}
      {done && (
        <Button variant="primary" className="w-fit" onClick={flow.next}>
          Continue to payment
        </Button>
      )}
    </>
  );
}
