import { Star } from "@phosphor-icons/react/dist/ssr";
import { REVIEW_TAGS } from "../data";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { BookingFlow } from "../useBookingFlow";

export function Review({ flow }: { flow: BookingFlow }) {
  const { state, finalProvider, pricing } = flow;

  if (state.reviewSubmitted) {
    const categoryName =
      flow.categories.find((c) => c.id === state.category)?.name ?? "service";
    return (
      <div className="flex flex-col gap-3.5 items-start">
        <Tag variant="accent">Review submitted</Tag>
        <h2 className="text-2xl font-semibold tracking-tight">Thanks for booking with Need-A</h2>
        <p className="text-neutral-400 text-[13px] max-w-[50ch]">
          {finalProvider?.name} completed your {categoryName} job for R{pricing.total.toFixed(2)}. A
          receipt has been sent to your email.
        </p>
        <Button variant="secondary" onClick={flow.reset}>
          Book another service
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">How did {finalProvider?.name} do?</h2>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => flow.setRating(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="cursor-pointer hover:opacity-85"
          >
            <Star
              size={26}
              weight={n <= state.rating ? "fill" : "regular"}
              className={n <= state.rating ? "text-accent-400" : "text-neutral-700"}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {REVIEW_TAGS.map((label) => {
          const active = state.reviewTags.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => flow.toggleReviewTag(label)}
              className={cn(
                "cursor-pointer py-1 px-2.5 rounded-full text-xs border",
                active
                  ? "border-accent-500 bg-accent-800 text-accent-200"
                  : "border-neutral-700 text-neutral-300",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <Field label="Comment (optional)">
        <Textarea
          rows={3}
          value={state.comment}
          onChange={(e) => flow.patch({ comment: e.target.value })}
        />
      </Field>
      <Button
        variant="primary"
        className="w-fit"
        disabled={state.rating === 0}
        onClick={flow.submitReview}
      >
        Submit review
      </Button>
    </>
  );
}
