import type { Category, StepKey } from "./types";

export const CATEGORIES: Category[] = [
  { id: "plumbing", name: "Plumbing", popular: true },
  { id: "electrical", name: "Electrical" },
  { id: "handyman", name: "Handyman" },
  { id: "cleaning", name: "Home cleaning" },
  { id: "appliance", name: "Appliance repair" },
  { id: "gardening", name: "Gardening" },
];

export const REVIEW_TAGS = [
  "Punctuality",
  "Communication",
  "Workmanship",
  "Cleanliness",
  "Value",
];

// Flat estimated job length used for the labour-cost estimate shown before completion —
// real providers don't have a per-job hours figure (no completed-jobs history yet).
export const ESTIMATED_HOURS = 1.5;
export const VAT_RATE = 0.15;

export const BOOKING_TYPE_LABELS: Record<"fixnow" | "schedule" | "quotes", string> = {
  fixnow: "Fix Now",
  schedule: "Schedule It",
  quotes: "Get Quotes",
};

export const STEP_LABELS: Record<StepKey, string> = {
  service: "Service",
  describe: "Details",
  type: "Booking type",
  matches: "Matches",
  compare: "Compare quotes",
  confirm: "Confirm",
  track: "Track",
  pay: "Pay",
  review: "Review",
};
