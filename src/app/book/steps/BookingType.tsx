import { CATEGORIES } from "../data";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { BookingFlow } from "../useBookingFlow";
import type { BookingType as BookingTypeValue } from "../types";

export function BookingType({ flow }: { flow: BookingFlow }) {
  const categoryName =
    CATEGORIES.find((c) => c.id === flow.state.category)?.name ?? "Select a service";
  const { bookingType, schedDate, schedTime } = flow.state;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-medium">Choose how you&apos;d like to book</h2>
        <p className="text-neutral-400 text-[13px]">
          {categoryName} · {flow.state.location}
        </p>
      </div>

      <SegmentedControl<BookingTypeValue>
        name="bookingType"
        className="w-fit"
        value={bookingType}
        onChange={flow.setBookingType}
        options={[
          { value: "fixnow", label: "Fix Now" },
          { value: "schedule", label: "Schedule It" },
          { value: "quotes", label: "Get Quotes" },
        ]}
      />

      {bookingType === "fixnow" && (
        <>
          <Card className="p-5 gap-2.5 max-w-[420px]">
            <Tag variant="accent" className="w-fit">
              Emergency response
            </Tag>
            <p className="text-[13px] text-neutral-300">
              Verified technician available now. Price shown before you confirm.
            </p>
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-400">Est. arrival</span>
              <span className="font-medium">18–25 min</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-400">Call-out fee</span>
              <span className="font-medium">R150</span>
            </div>
          </Card>
          <Button
            variant="primary"
            className="w-fit"
            disabled={flow.state.matchesLoading}
            onClick={flow.next}
          >
            Find providers
          </Button>
        </>
      )}

      {bookingType === "schedule" && (
        <>
          <div className="flex gap-5 max-w-[420px]">
            <Field label="Date">
              <Input
                type="date"
                value={schedDate}
                onChange={(e) => flow.patch({ schedDate: e.target.value })}
              />
            </Field>
            <Field label="Time">
              <Input
                type="time"
                value={schedTime}
                onChange={(e) => flow.patch({ schedTime: e.target.value })}
              />
            </Field>
          </div>
          <Button
            variant="primary"
            className="w-fit"
            disabled={!(schedDate && schedTime) || flow.state.matchesLoading}
            onClick={flow.next}
          >
            Schedule visit
          </Button>
        </>
      )}

      {bookingType === "quotes" && (
        <>
          <Card className="p-5 max-w-[420px]">
            <p className="text-[13px] text-neutral-300">
              Best for larger jobs needing inspection — you&apos;ll pick up to 3 verified
              pros and compare standardised quotes.
            </p>
          </Card>
          <Button
            variant="primary"
            className="w-fit"
            disabled={flow.state.matchesLoading}
            onClick={flow.next}
          >
            Request quotes
          </Button>
        </>
      )}
    </>
  );
}
