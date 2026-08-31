export type CategoryId =
  | "plumbing"
  | "electrical"
  | "handyman"
  | "cleaning"
  | "appliance"
  | "gardening";

export interface Category {
  id: CategoryId;
  name: string;
  popular?: boolean;
}

export interface MatchedProvider {
  id: string;
  name: string;
  badge: "Verified";
  guaranteeDays: number;
  hourlyRate: number;
  calloutFee: number;
  serviceRadius: number;
}

export type BookingType = "fixnow" | "schedule" | "quotes";

export type TrackStatus = "assigned" | "en_route" | "arrived" | "working" | "done";

export type StepKey =
  | "service"
  | "describe"
  | "type"
  | "matches"
  | "compare"
  | "confirm"
  | "track"
  | "pay"
  | "review";

export interface BookingState {
  stepIndex: number;
  category: CategoryId | null;
  address: string;
  location: string;
  running: boolean;
  emergency: boolean;
  notes: string;
  bookingType: BookingType;
  schedDate: string;
  schedTime: string;
  matchedProviders: MatchedProvider[];
  matchesLoading: boolean;
  selectedProviders: string[];
  finalProviderId: string | null;
  bookingId: string | null;
  bookingRef: string | null;
  arrivalPin: string | null;
  trackStatus: TrackStatus | null;
  submitting: boolean;
  rating: number;
  reviewTags: string[];
  comment: string;
  reviewSubmitted: boolean;
}
