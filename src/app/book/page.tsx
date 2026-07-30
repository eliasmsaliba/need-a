"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StepRail } from "./StepRail";
import { useBookingFlow } from "./useBookingFlow";
import { ServiceSelect } from "./steps/ServiceSelect";
import { DescribeProblem } from "./steps/DescribeProblem";
import { BookingType } from "./steps/BookingType";
import { Matches } from "./steps/Matches";
import { CompareQuotes } from "./steps/CompareQuotes";
import { Confirm } from "./steps/Confirm";
import { Track } from "./steps/Track";
import { Pay } from "./steps/Pay";
import { Review } from "./steps/Review";

export default function BookPage() {
  const flow = useBookingFlow();

  return (
    <div className="flex-1 min-h-0 pb-20">
      <nav className="flex flex-wrap items-center gap-4 py-3 px-4 md:px-10">
        <span className="text-lg font-medium mr-auto">Need-A</span>
        <div className="flex flex-wrap gap-2.5">
          <span className="rounded-md border border-accent text-accent text-[11px] py-[3px] px-2.5">
            Verified pros
          </span>
          <span className="rounded-md border border-accent text-accent text-[11px] py-[3px] px-2.5">
            Money-back guarantee
          </span>
          <span className="rounded-md border border-accent text-accent text-[11px] py-[3px] px-2.5">
            Secure payment
          </span>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-8 max-w-[1280px] mx-auto pt-8 px-4 md:px-6">
        <StepRail seq={flow.seq} stepIdx={flow.stepIdx} />

        <Card elevation="md" className="flex-1 p-5 md:p-9 gap-6 min-h-[600px]">
          {flow.currentStep === "service" && <ServiceSelect flow={flow} />}
          {flow.currentStep === "describe" && <DescribeProblem flow={flow} />}
          {flow.currentStep === "type" && <BookingType flow={flow} />}
          {flow.currentStep === "matches" && <Matches flow={flow} />}
          {flow.currentStep === "compare" && <CompareQuotes flow={flow} />}
          {flow.currentStep === "confirm" && <Confirm flow={flow} />}
          {flow.currentStep === "track" && <Track flow={flow} />}
          {flow.currentStep === "pay" && <Pay flow={flow} />}
          {flow.currentStep === "review" && <Review flow={flow} />}

          <div className="flex justify-between mt-auto pt-5 border-t border-neutral-800">
            {flow.showBack ? (
              <Button variant="ghost" onClick={flow.back}>
                Back
              </Button>
            ) : (
              <span />
            )}
            {flow.showContinue && (
              <Button
                variant="primary"
                disabled={flow.continueDisabled}
                onClick={flow.next}
                className="ml-auto"
              >
                Continue
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
