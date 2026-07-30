import type { Category, Provider, StepKey } from "./types";

export const CATEGORIES: Category[] = [
  { id: "plumbing", name: "Plumbing", popular: true },
  { id: "electrical", name: "Electrical" },
  { id: "handyman", name: "Handyman" },
  { id: "cleaning", name: "Home cleaning" },
  { id: "appliance", name: "Appliance repair" },
  { id: "gardening", name: "Gardening" },
];

export const PROVIDERS: Provider[] = [
  {
    id: "thabo",
    name: "Thabo M.",
    badge: "Verified",
    rating: 4.9,
    jobs: 128,
    eta: "22 min",
    estimate: 450,
    guaranteeDays: 30,
    hours: 1.5,
    rate: 350,
    materials: 220,
  },
  {
    id: "sarah",
    name: "Sarah K.",
    badge: "Verified",
    rating: 4.8,
    jobs: 86,
    eta: "31 min",
    estimate: 480,
    guaranteeDays: 30,
    hours: 2,
    rate: 280,
    materials: 240,
  },
  {
    id: "given",
    name: "Given P.",
    badge: "Elite",
    rating: 5.0,
    jobs: 240,
    eta: "40 min",
    estimate: 510,
    guaranteeDays: 90,
    hours: 1,
    rate: 600,
    materials: 210,
  },
];

export const REVIEW_TAGS = [
  "Punctuality",
  "Communication",
  "Workmanship",
  "Cleanliness",
  "Value",
];

export const TRACK_LABELS = ["Accepted", "En route", "Arrived", "Working", "Done"];

export const CALL_OUT_FEE = 150;
export const VAT_RATE = 0.15;
export const BOOKING_REF = "#NA-30281";
export const ARRIVAL_PIN = "4821";

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
