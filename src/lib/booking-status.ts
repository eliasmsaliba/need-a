import type { BookingStatus } from "@/db/schema";

// Post-"assigned" progression a booking moves through once a provider is on the job.
// "pending" (unmatched) and "cancelled" are terminal/branch states not part of this sequence.
export const TRACK_STATUS_ORDER = ["assigned", "en_route", "arrived", "working", "done"] as const;

// Index of a (possibly wider) booking status within TRACK_STATUS_ORDER, or -1 if it's
// "pending"/"cancelled" — a plain .indexOf() can't take a BookingStatus argument since
// TRACK_STATUS_ORDER's element type is the narrower 5-value track subset.
export function trackIndexOf(status: BookingStatus): number {
  return (TRACK_STATUS_ORDER as readonly string[]).indexOf(status);
}

// Raw status labels, as shown in the admin console.
export const ADMIN_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  en_route: "En route",
  arrived: "Arrived",
  working: "Working",
  done: "Done",
  cancelled: "Cancelled",
};

// Customer-facing labels for the Track step — "assigned" reads as "Accepted" from their side.
export const CUSTOMER_TRACK_LABELS: Record<(typeof TRACK_STATUS_ORDER)[number], string> = {
  assigned: "Accepted",
  en_route: "En route",
  arrived: "Arrived",
  working: "Working",
  done: "Done",
};

export function bookingRefFor(seq: number): string {
  return `BK-${1000 + seq}`;
}
