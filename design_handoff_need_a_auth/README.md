# Handoff: Need-A Login & Profile Creation (Customer + Provider)

## Overview
Authentication and onboarding for both sides of the Need-A marketplace: customers signing up to book services, and service providers (pros) signing up to offer them. Two separate prototypes, since the two audiences have very different onboarding depth.

## About the Design Files
These files are **design references built in HTML** — clickable prototypes showing layout, form state, and flow logic, not production code. Recreate them in the target codebase's real environment (React Native/React/etc. — or the best-fit stack if none exists) using its existing auth, form, and navigation patterns. Do not port the HTML/CSS/JS directly. In particular, **never implement authentication, password handling, OTP, or bank-detail storage the way the prototype fakes them** — those are UI stand-ins only; production must use real auth (hashed passwords, real OTP delivery, PCI-compliant card handling, encrypted bank details, etc.).

## Fidelity
Functional-prototype level, consistent with the other Need-A handoffs: real controlled form state, step gating (Continue disabled until required fields are valid), and role-appropriate flow depth. Visual styling follows Nocturne tokens as a reference, not pixel-final.

## File 1: Need-A Customer Auth.dc.html
Centered auth card, mode toggle (Sign up / Log in) at top.

**Sign up** — 4-step wizard with a horizontal step indicator (Account → Verify → Profile → Done):
1. Account: email, phone, password, confirm password. Continue disabled until email set, password ≥6 chars, and passwords match.
2. Verify: 6-digit OTP input (prototype accepts the fixed demo code `123456`; wrong code shows an inline error). Real implementation sends a real code via SMS/email.
3. Profile: profile photo (drag-drop placeholder), full name, phone, one-or-more home addresses (label + address, add/remove), payment method (Card fields or Instant EFT note), notification preferences (SMS/Email/Push, each on/off). Continue requires a name.
4. Done: confirmation panel + "Continue to app" link (points at the customer booking prototype).

**Log in** — email + password, "Forgot password?" link opens an inline reset-request mini-flow (email → "reset link sent" confirmation → back to login). Submitting login shows a "Welcome back" success state.

## File 2: Need-A Provider Auth.dc.html
Same mode toggle pattern, but Sign up uses a **left-rail 7-step wizard** (matches the admin console's shell) since provider onboarding is deeper:
1. Account — email, phone, password/confirm (same validation as customer).
2. Verify — same OTP pattern (demo code `123456`).
3. Business info — name, contact phone, optional trading name, multi-select service categories (chips), service-area radius (km).
4. Availability & rates — working days (multi-select chips), start/end time, hourly rate, call-out fee.
5. Verification & portfolio — ID/passport upload, optional certification upload, up to 3 portfolio photo slots (all drag-drop placeholders — wire to real file/image upload with backend virus scan + manual verification review queue).
6. Payout details — bank name, account holder, account number, branch code.
7. Done — "Under review" status panel (frames the realistic 24–48hr verification wait) with an application summary, and a link into the admin console.

**Log in** — same pattern as customer login (password + forgot-password sub-flow).

## Interactions & Behavior
- Step "Continue" buttons are disabled until that step's required fields are valid (see per-step notes above).
- Category and working-day selections are toggleable chips (click to add/remove), not native checkboxes — replicate as a proper multi-select control in production, with accessible labeling.
- Photo/ID uploads are prototype drag-and-drop placeholders (`image-slot` custom element) — replace with the platform's real file/image picker, including validation (file type/size) and, for ID docs, secure storage.
- No real password strength meter, email format validation, or duplicate-account checking in the prototype — add these for production.
- The provider "Done" step and customer "Done" step both link to other prototypes in this project (`Need-A Prototype.dc.html`, `Need-A Admin.dc.html`) purely to demonstrate the intended cross-navigation — replace with real route transitions.

## State Management
Customer signup state:
```
{ mode, signupStep, accEmail, accPhone, accPassword, accConfirm, otp,
  profName, profPhone, addresses: [{label,text}], payment, cardNumber, cardExpiry, cardCvc,
  notif: { sms, email, push }, loginEmail, loginPassword, loginSubmitted,
  forgotMode, forgotEmail, forgotSent }
```
Provider signup state:
```
{ mode, stepIndex, accEmail, accPhone, accPassword, accConfirm, otp,
  bizName, bizPhone, bizTradingName, selectedCategories: [], serviceRadius,
  selectedDays: [], startTime, endTime, hourlyRate, calloutFee,
  bankName, accountHolder, accountNumber, branchCode,
  loginEmail, loginPassword, loginSubmitted, forgotMode, forgotEmail, forgotSent }
```

## Design Tokens (Nocturne system — see `nocturne-styles.css`)
- Background `#161826`, Surface `#232532`, Text `#e9e9ed`, Accent `#9184d9`
- Inter, 500-weight headings / 400 body; radius sm 4px / md 8px / lg 14px
- Outlined buttons (accent border, transparent fill); step indicators use filled accent circles for current/completed steps
- Chips (category/day multi-select) use a pill shape with accent border + tinted fill when active

## Assets
- `image-slot.js` — the drag-and-drop image placeholder web component used for profile photo, ID upload, certification, and portfolio slots in the prototype (reference only — see note above on replacing with real upload).

## Files
- `Need-A Customer Auth.dc.html`
- `Need-A Provider Auth.dc.html`
- `image-slot.js`
- `nocturne-styles.css`
