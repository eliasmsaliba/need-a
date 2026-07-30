"use client";

import { useMemo, useReducer } from "react";
import { CALL_OUT_FEE, PROVIDERS, VAT_RATE } from "./data";
import type { BookingState, BookingType, CategoryId, StepKey } from "./types";

function initialState(): BookingState {
  return {
    stepIndex: 0,
    category: null,
    address: "Menlyn, Unit 4",
    location: "Kitchen — under sink",
    running: true,
    emergency: true,
    notes: "",
    bookingType: "fixnow",
    schedDate: "",
    schedTime: "",
    selectedProviders: [],
    finalProviderId: null,
    trackIndex: 1,
    rating: 0,
    reviewTags: [],
    comment: "",
    reviewSubmitted: false,
  };
}

function getSeq(bookingType: BookingType): StepKey[] {
  const seq: StepKey[] = ["service", "describe", "type", "matches"];
  if (bookingType === "quotes") seq.push("compare");
  seq.push("confirm", "track", "pay", "review");
  return seq;
}

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "SELECT_CATEGORY"; id: CategoryId }
  | { type: "SET_ADDRESS"; value: string }
  | { type: "SET_LOCATION"; value: string }
  | { type: "SET_NOTES"; value: string }
  | { type: "SET_RUNNING"; value: boolean }
  | { type: "SET_EMERGENCY"; value: boolean }
  | { type: "SET_BOOKING_TYPE"; value: BookingType }
  | { type: "SET_SCHED_DATE"; value: string }
  | { type: "SET_SCHED_TIME"; value: string }
  | { type: "TOGGLE_PROVIDER"; id: string }
  | { type: "CHOOSE_QUOTE"; id: string }
  | { type: "ADVANCE_TRACK" }
  | { type: "SET_RATING"; value: number }
  | { type: "TOGGLE_REVIEW_TAG"; label: string }
  | { type: "SET_COMMENT"; value: string }
  | { type: "SUBMIT_REVIEW" };

function advanceStep(state: BookingState): BookingState {
  const seq = getSeq(state.bookingType);
  const key = seq[state.stepIndex];
  const next = { ...state, stepIndex: Math.min(seq.length - 1, state.stepIndex + 1) };
  if (key === "matches" && state.bookingType !== "quotes") {
    next.finalProviderId = state.selectedProviders[0] ?? null;
  }
  return next;
}

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "NEXT":
      return advanceStep(state);
    case "BACK":
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1) };
    case "RESET":
      return initialState();
    case "SELECT_CATEGORY":
      return { ...state, category: action.id };
    case "SET_ADDRESS":
      return { ...state, address: action.value };
    case "SET_LOCATION":
      return { ...state, location: action.value };
    case "SET_NOTES":
      return { ...state, notes: action.value };
    case "SET_RUNNING":
      return { ...state, running: action.value };
    case "SET_EMERGENCY":
      return { ...state, emergency: action.value };
    case "SET_BOOKING_TYPE":
      return { ...state, bookingType: action.value };
    case "SET_SCHED_DATE":
      return { ...state, schedDate: action.value };
    case "SET_SCHED_TIME":
      return { ...state, schedTime: action.value };
    case "TOGGLE_PROVIDER": {
      if (state.bookingType === "quotes") {
        const has = state.selectedProviders.includes(action.id);
        const selectedProviders = has
          ? state.selectedProviders.filter((id) => id !== action.id)
          : state.selectedProviders.length < 3
            ? [...state.selectedProviders, action.id]
            : state.selectedProviders;
        return { ...state, selectedProviders };
      }
      return { ...state, selectedProviders: [action.id] };
    }
    case "CHOOSE_QUOTE":
      return advanceStep({ ...state, finalProviderId: action.id });
    case "ADVANCE_TRACK":
      return { ...state, trackIndex: Math.min(4, state.trackIndex + 1) };
    case "SET_RATING":
      return { ...state, rating: action.value };
    case "TOGGLE_REVIEW_TAG": {
      const has = state.reviewTags.includes(action.label);
      return {
        ...state,
        reviewTags: has
          ? state.reviewTags.filter((t) => t !== action.label)
          : [...state.reviewTags, action.label],
      };
    }
    case "SET_COMMENT":
      return { ...state, comment: action.value };
    case "SUBMIT_REVIEW":
      return { ...state, reviewSubmitted: true };
    default:
      return state;
  }
}

export function useBookingFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const seq = useMemo(() => getSeq(state.bookingType), [state.bookingType]);
  const stepIdx = Math.min(state.stepIndex, seq.length - 1);
  const currentStep = seq[stepIdx];

  const finalProvider =
    PROVIDERS.find((p) => p.id === state.finalProviderId) ?? PROVIDERS[0];
  const labour = Math.round(finalProvider.hours * finalProvider.rate);
  const materials = finalProvider.materials;
  const subtotal = CALL_OUT_FEE + labour + materials;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  const showBack = stepIdx > 0 && !(currentStep === "review" && state.reviewSubmitted);
  const showContinue =
    (["service", "describe", "matches"] as StepKey[]).includes(currentStep) &&
    !(currentStep === "review" && state.reviewSubmitted);
  let continueDisabled = false;
  if (currentStep === "service") continueDisabled = !state.category;
  if (currentStep === "describe") continueDisabled = !state.address;
  if (currentStep === "matches") continueDisabled = state.selectedProviders.length === 0;

  const actions = useMemo(
    () => ({
      next: () => dispatch({ type: "NEXT" }),
      back: () => dispatch({ type: "BACK" }),
      reset: () => dispatch({ type: "RESET" }),
      selectCategory: (id: CategoryId) => dispatch({ type: "SELECT_CATEGORY", id }),
      setAddress: (value: string) => dispatch({ type: "SET_ADDRESS", value }),
      setLocation: (value: string) => dispatch({ type: "SET_LOCATION", value }),
      setNotes: (value: string) => dispatch({ type: "SET_NOTES", value }),
      setRunning: (value: boolean) => dispatch({ type: "SET_RUNNING", value }),
      setEmergency: (value: boolean) => dispatch({ type: "SET_EMERGENCY", value }),
      setBookingType: (value: BookingType) => dispatch({ type: "SET_BOOKING_TYPE", value }),
      setSchedDate: (value: string) => dispatch({ type: "SET_SCHED_DATE", value }),
      setSchedTime: (value: string) => dispatch({ type: "SET_SCHED_TIME", value }),
      toggleProvider: (id: string) => dispatch({ type: "TOGGLE_PROVIDER", id }),
      chooseQuote: (id: string) => dispatch({ type: "CHOOSE_QUOTE", id }),
      advanceTrack: () => dispatch({ type: "ADVANCE_TRACK" }),
      setRating: (value: number) => dispatch({ type: "SET_RATING", value }),
      toggleReviewTag: (label: string) => dispatch({ type: "TOGGLE_REVIEW_TAG", label }),
      setComment: (value: string) => dispatch({ type: "SET_COMMENT", value }),
      submitReview: () => dispatch({ type: "SUBMIT_REVIEW" }),
    }),
    [],
  );

  return {
    state,
    seq,
    stepIdx,
    currentStep,
    showBack,
    showContinue,
    continueDisabled,
    pricing: { labour, materials, vat, total },
    finalProvider,
    ...actions,
  };
}

export type BookingFlow = ReturnType<typeof useBookingFlow>;
