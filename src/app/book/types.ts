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

export type ProviderBadge = "Verified" | "Elite";

export interface Provider {
  id: string;
  name: string;
  badge: ProviderBadge;
  rating: number;
  jobs: number;
  eta: string;
  estimate: number;
  guaranteeDays: number;
  hours: number;
  rate: number;
  materials: number;
}

export type BookingType = "fixnow" | "schedule" | "quotes";

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
  selectedProviders: string[];
  finalProviderId: string | null;
  trackIndex: number;
  rating: number;
  reviewTags: string[];
  comment: string;
  reviewSubmitted: boolean;
}
