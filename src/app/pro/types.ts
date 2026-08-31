import type { BookingStatus, ProviderStatus } from "@/db/schema";

export interface RealJob {
  id: string;
  ref: string;
  category: string;
  bookingTypeLabel: string;
  customerName: string;
  customerPhone: string;
  address: string;
  location: string;
  notes: string;
  schedDate: string | null;
  schedTime: string | null;
  amount: number;
  status: BookingStatus;
}

export interface ProviderProfileData {
  bizName: string;
  bizTradingName: string;
  selectedCategories: string[];
  serviceRadius: number;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  hourlyRate: number;
  calloutFee: number;
  guaranteeDays: number;
  status: ProviderStatus;
}
