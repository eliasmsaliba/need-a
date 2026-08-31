"use client";

import { useMemo, useReducer } from "react";
import { ESTIMATED_HOURS, VAT_RATE } from "./data";
import { advanceMyBookingStatusAction, createBooking } from "./actions";
import { getMatchingProviders } from "./provider-actions";
import type { BookingState, BookingType, CategoryId, MatchedProvider, StepKey } from "./types";

function initialState(initialAddress: string): BookingState {
  return {
    stepIndex: 0,
    category: null,
    address: initialAddress,
    location: "",
    running: true,
    emergency: true,
    notes: "",
    bookingType: "fixnow",
    schedDate: "",
    schedTime: "",
    matchedProviders: [],
    matchesLoading: false,
    selectedProviders: [],
    finalProviderId: null,
    bookingId: null,
    bookingRef: null,
    arrivalPin: null,
    trackStatus: null,
    submitting: false,
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
  | { type: "PATCH"; patch: Partial<BookingState> }
  | { type: "SELECT_CATEGORY"; id: CategoryId }
  | { type: "SET_BOOKING_TYPE"; value: BookingType }
  | { type: "TOGGLE_PROVIDER"; id: string }
  | { type: "TOGGLE_REVIEW_TAG"; label: string };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.patch };
    case "SELECT_CATEGORY":
      return { ...state, category: action.id };
    case "SET_BOOKING_TYPE":
      return { ...state, bookingType: action.value };
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
    case "TOGGLE_REVIEW_TAG": {
      const has = state.reviewTags.includes(action.label);
      return {
        ...state,
        reviewTags: has
          ? state.reviewTags.filter((t) => t !== action.label)
          : [...state.reviewTags, action.label],
      };
    }
    default:
      return state;
  }
}

export function useBookingFlow(initialAddress: string) {
  const [state, dispatch] = useReducer(reducer, initialAddress, initialState);

  const patch = (p: Partial<BookingState>) => dispatch({ type: "PATCH", patch: p });

  const seq = useMemo(() => getSeq(state.bookingType), [state.bookingType]);
  const stepIdx = Math.min(state.stepIndex, seq.length - 1);
  const currentStep = seq[stepIdx];

  const finalProvider: MatchedProvider | undefined = state.matchedProviders.find(
    (p) => p.id === state.finalProviderId,
  );
  const labour = finalProvider ? Math.round(ESTIMATED_HOURS * finalProvider.hourlyRate) : 0;
  const calloutFee = finalProvider?.calloutFee ?? 0;
  const subtotal = calloutFee + labour;
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

  async function createBookingAndAdvance(finalProviderId: string) {
    patch({ submitting: true });
    const result = await createBooking({
      category: state.category!,
      bookingType: state.bookingType,
      address: state.address,
      location: state.location,
      running: state.running,
      emergency: state.emergency,
      notes: state.notes,
      schedDate: state.schedDate,
      schedTime: state.schedTime,
      selectedProviderIds: state.selectedProviders,
      finalProviderId,
    });
    patch({
      submitting: false,
      finalProviderId,
      bookingId: result.bookingId,
      bookingRef: result.bookingRef,
      arrivalPin: result.arrivalPin,
      trackStatus: "assigned",
      stepIndex: stepIdx + 1,
    });
  }

  async function next() {
    if (state.submitting || state.matchesLoading) return;
    const key = seq[stepIdx];

    if (key === "type") {
      patch({ matchesLoading: true });
      const matched = await getMatchingProviders(state.category!);
      patch({ matchedProviders: matched, matchesLoading: false, stepIndex: stepIdx + 1 });
      return;
    }

    if (key === "matches" && state.bookingType !== "quotes") {
      const finalId = state.selectedProviders[0];
      if (!finalId) return;
      await createBookingAndAdvance(finalId);
      return;
    }

    patch({ stepIndex: Math.min(seq.length - 1, stepIdx + 1) });
  }

  function back() {
    patch({ stepIndex: Math.max(0, stepIdx - 1) });
  }

  function reset() {
    dispatch({ type: "PATCH", patch: initialState(initialAddress) });
  }

  function selectCategory(id: CategoryId) {
    dispatch({ type: "SELECT_CATEGORY", id });
  }
  function setBookingType(value: BookingType) {
    dispatch({ type: "SET_BOOKING_TYPE", value });
  }
  function toggleProvider(id: string) {
    dispatch({ type: "TOGGLE_PROVIDER", id });
  }

  async function chooseQuote(providerId: string) {
    if (state.submitting) return;
    await createBookingAndAdvance(providerId);
  }

  async function advanceTrack() {
    if (!state.bookingId || state.submitting) return;
    patch({ submitting: true });
    const result = await advanceMyBookingStatusAction(state.bookingId);
    if ("error" in result) {
      patch({ submitting: false });
      return;
    }
    patch({ submitting: false, trackStatus: result.status });
  }

  function setRating(value: number) {
    patch({ rating: value });
  }
  function toggleReviewTag(label: string) {
    dispatch({ type: "TOGGLE_REVIEW_TAG", label });
  }
  function submitReview() {
    patch({ reviewSubmitted: true });
  }

  return {
    state,
    patch,
    seq,
    stepIdx,
    currentStep,
    showBack,
    showContinue,
    continueDisabled,
    pricing: { labour, calloutFee, vat, total },
    finalProvider,
    next,
    back,
    reset,
    selectCategory,
    setBookingType,
    toggleProvider,
    chooseQuote,
    advanceTrack,
    setRating,
    toggleReviewTag,
    submitReview,
  };
}

export type BookingFlow = ReturnType<typeof useBookingFlow>;
