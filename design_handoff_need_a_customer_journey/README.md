# Handoff: Need-A Customer Booking Journey

## Overview
Need-A is a customer service-booking app (home services: plumbing, electrical, handyman, cleaning, appliance repair, gardening). This package covers the primary customer journey: pick a service, describe the problem, choose a booking mode (Fix Now / Schedule It / Get Quotes), get matched with verified pros, confirm and pay, track the job, and leave a review.

## About the Design Files
The bundled file (`Need-A Prototype.dc.html`) is a **design reference built in HTML** — a clickable prototype demonstrating intended layout, states, and flow logic. It is not production code. The task is to **recreate this design in the target codebase's actual environment** (React Native, React web, SwiftUI, etc. — whatever the app already uses, or the best-fit framework if starting fresh), following that codebase's existing component and state-management patterns. Do not port the HTML/CSS/JS directly.

## Fidelity
**Low-to-mid fidelity wireframe with functional interaction logic.** Visual styling follows the Nocturne design system tokens (see below) but has not been polished to pixel-perfect final UI — treat colors/type/spacing here as a faithful reference, not a spec to match to the pixel. The **flow logic and state transitions are the highest-value part of this handoff** — they were built out in detail and should be replicated faithfully.

## Screens / Views
Single continuous flow, left rail shows numbered progress (rail step count varies 8–9 depending on booking type chosen):

1. **Service select** — vertical list of 6 categories (Plumbing "Popular", Electrical, Handyman, Home cleaning, Appliance repair, Gardening). Tap row to select; selected row highlights and shows an accent "Selected" tag. Must select to continue.
2. **Describe problem** — address text field (prefilled), issue-location text field, two 2-option toggles (native radio pairs: "Is water/power active? Yes/No", "Is this an emergency? Yes/No"), optional notes textarea, decorative "Add photo/video" button (non-functional in prototype — should be wired to real media picker). Must fill address to continue.
3. **Booking type** — 3-way segmented control: **Fix Now** / **Schedule It** / **Get Quotes**. Content below the segment changes per selection:
   - Fix Now: card with "Emergency response" tag, est. arrival (18–25 min), call-out fee (R150), CTA "Find providers"
   - Schedule It: date + time pickers, CTA "Schedule visit" (disabled until both filled)
   - Get Quotes: explanatory copy, CTA "Request quotes"
4. **Matches** — grid of 3 provider cards (name, badge "Verified"/"Elite", rating, job count, ETA, price estimate, guarantee days). Fix Now/Schedule: single-select (radio-like, picking one replaces prior pick). Get Quotes: multi-select up to 3 (checkbox-like), subtitle shows "x/3 selected".
5. **Compare quotes** *(Get Quotes flow only)* — table of the selected pros with labour/materials/days/guarantee columns and a "Choose this quote" button per row that both finalizes the pick and advances.
6. **Confirm** — summary card (provider, service, address, booking ref, estimated total range), arrival PIN callout, CTA "Confirm & authorise payment".
7. **Track** — vertical 5-step status timeline (Accepted → En route → Arrived → Working → Done). In this prototype a "Simulate next update" button manually advances status (stand-in for real-time push updates); once fully "Done" a "Continue to payment" CTA appears.
8. **Pay** — itemized invoice table (call-out fee, labour, materials, 15% VAT, total), guarantee tag, CTA "Approve & pay R{total}".
9. **Review** — 5-star rating (click to set), multi-select compliment tags (Punctuality, Communication, Workmanship, Cleanliness, Value), optional comment, "Submit review" (disabled until a rating is chosen). On submit, shows a thank-you panel with a job summary and "Book another service" (resets the whole flow).

## Interactions & Behavior
- Back/Continue footer nav appears on steps without an embedded primary CTA (Service, Describe, Matches); other steps use their own in-content CTA to advance.
- Booking-type selection is state-driven and changes which steps exist in the flow (Compare Quotes only appears for the Get Quotes path).
- All form inputs are controlled and persist across back/forward navigation within a session.
- Provider selection behavior differs by booking type (single-select vs. multi-select up to 3) — same card component, different click handler.
- Invoice total is computed live from the selected/final provider's rate × estimated hours + materials + 15% VAT — not hardcoded.
- Tracking status step is manually advanced in the prototype; in production this should subscribe to a real-time job-status feed (websocket/polling) instead of a button.
- No animated transitions between steps in the prototype; add standard navigation transitions appropriate to the target platform.

## State Management
Minimum state shape needed:
```
{
  stepIndex, category,
  address, location, running, emergency, notes,
  bookingType, schedDate, schedTime,
  selectedProviders: [], finalProviderId,
  trackIndex,
  rating, reviewTags: [], comment, reviewSubmitted
}
```
- `stepIndex` + `bookingType` together determine the active step sequence (derived, not stored separately).
- `selectedProviders` is an array in all cases (length 1 for Fix Now/Schedule, up to 3 for Get Quotes).
- Real implementation should replace static `CATEGORIES`/`PROVIDERS` arrays with API data (service catalog, live provider matching).

## Design Tokens (Nocturne system — see `nocturne-styles.css` for full source)
- Background: `#161826`, Surface: `#232532`, Text: `#e9e9ed`
- Accent: `#9184d9` (blurple), with 100–900 tonal ramps for neutral and accent (see CSS `:root`)
- Font: Inter, 500 weight for headings, 400 for body
- Radius: sm 4px / md 8px / lg 14px
- Spacing scale: ~2.8px–22.4px (0.7× density scale)
- Shadows: hairline edge + ambient dark blur (`--shadow-sm/md/lg`)
- Buttons are outlined (accent border, transparent fill), not solid — this is a deliberate system trait, not a bug
- Icons: Phosphor icon set

## Assets
No custom imagery — all icons are inline Phosphor SVGs (star icon used for ratings). No photography used in this flow.

## Files
- `Need-A Prototype.dc.html` — the interactive prototype (open in a browser to click through the flow)
- `nocturne-styles.css` — the full Nocturne design-system token/component stylesheet referenced above
