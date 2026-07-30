# Handoff: Need-A Admin / Backend Console

## Overview
Internal admin console for operating the Need-A marketplace: dispatching jobs, managing providers and customers, handling payments/payouts, editing category pricing, and resolving disputes. Covers three role types: Ops Admin, Support Agent, Finance.

## About the Design Files
The bundled file (`Need-A Admin.dc.html`) is a **design reference built in HTML** — a clickable prototype showing layout, role-based navigation, and interaction logic. It is not production code. Recreate this in the target codebase's actual environment (React web admin framework, internal tooling stack, etc. — or the best-fit stack if none exists), following existing component/state patterns. Do not port the HTML/CSS/JS directly.

## Fidelity
Functional-prototype level, same tier as the customer-facing "Need-A Prototype" handoff: real interactive state (role switching, table actions, assignment, editable pricing), Nocturne-system styling as reference (not pixel-final).

## Roles & Navigation
Role switcher (dropdown, top of left sidebar) changes which sections are visible:
- **Ops Admin**: Dashboard, Dispatch queue, Providers, Customers, Payments & payouts, Categories & pricing, Reviews & disputes (full access)
- **Support Agent**: Dashboard, Dispatch queue, Providers, Customers, Reviews & disputes (no financial data/pricing control)
- **Finance**: Dashboard, Payments & payouts, Categories & pricing (no dispatch/provider/customer ops)

Switching role that hides the current section auto-redirects to Dashboard. Implement this as a real permissions map, not just hidden nav — routes/actions for a section should also be access-controlled server-side.

## Screens / Views
1. **Dashboard** — 4 stat cards (Active jobs, GMV today, Avg pro rating, Open disputes) computed from the underlying data; a bar chart of bookings-by-category; a recent-bookings table (last 5).
2. **Dispatch queue** — table of all bookings (ID, customer, category, type, status, provider, amount). Unassigned bookings show a provider-assignment dropdown (only "Active" providers selectable); assigning sets status to "Assigned". Assigned-but-not-done bookings show a "Mark {next status}" button cycling Pending → Assigned → En route → Working → Done.
3. **Providers** — table (name, badge, rating, jobs, status). "Pending verification" providers get a "Verify" action (→ Active). All others get a Suspend/Reinstate toggle.
4. **Customers** — table (name, email, jobs, total spend, status) with a Suspend/Reinstate toggle per row.
5. **Payments & payouts** — table of payout batches (ID, provider, amount, status). Pending payouts get a "Mark as paid" action.
6. **Categories & pricing** — one row per service category with two editable numeric fields: call-out fee and base hourly rate. Changes persist live (no separate save step in the prototype — consider whether production wants an explicit save/publish step with an audit trail).
7. **Reviews & disputes** — card list of flagged disputes (customer vs. provider, reason, status). Open disputes get Resolve/Dismiss actions.

## Interactions & Behavior
- All tables/cards are driven by in-memory seed data reflecting realistic states (pending, assigned, suspended, etc.) — replace with real API-backed data and mutations.
- Status tag color convention (Nocturne mono-accent system, no red): accent = positive/complete (Active, Done, Paid, Resolved); outline = in-progress/neutral (Pending, Assigned, En route, Working, Open); neutral/muted = negative/stopped (Suspended, Cancelled).
- No confirmation dialogs on destructive actions (suspend, dismiss) in the prototype — production should confirm before suspending a provider/customer or dismissing a dispute.
- No pagination/search/filtering built into these tables — add for production scale (the prototype uses small fixed seed lists).

## State Management
Core state shape:
```
{
  role: 'ops' | 'support' | 'finance',
  section: string,               // active nav key, derived-safe on role change
  bookings: [{ id, customer, category, type, status, providerId, amount }],
  providers: [{ id, name, badge, rating, jobs, status }],
  customers: [{ id, name, email, jobs, spend, status }],
  payouts: [{ id, provider, amount, status }],
  categories: [{ id, name, calloutFee, baseRate }],
  disputes: [{ id, customer, provider, reason, status }],
}
```
- Booking status progression is a fixed sequence: Pending → Assigned → En route → Working → Done (plus a terminal Cancelled outside the sequence).
- Dashboard stats (active jobs, GMV, avg rating, open disputes) are all derived/computed from the above collections, not stored separately.

## Design Tokens (Nocturne system — see `nocturne-styles.css`)
- Background `#161826`, Surface `#232532`, Text `#e9e9ed`, Accent `#9184d9`
- Inter, 500-weight headings / 400 body
- Radius: sm 4px / md 8px / lg 14px; compact 0.7× spacing scale
- Outlined buttons (accent border, transparent fill) — not solid-filled
- No red/warning color — status semantics are conveyed via the accent/neutral/outline tag variants only

## Assets
No custom imagery. No icons beyond native form controls in this view (no Phosphor icons used here, unlike the customer app).

## Files
- `Need-A Admin.dc.html` — interactive admin prototype (open in a browser to click through)
- `nocturne-styles.css` — full Nocturne design-system stylesheet
