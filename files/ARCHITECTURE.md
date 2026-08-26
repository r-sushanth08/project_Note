# ARCHITECTURE.md

Technical architecture, built only after product requirements (PROJECT.md,
REQUIREMENTS.md, UX.md) were settled. This is written in **phases**
deliberately — the product will be built incrementally, and each phase
has a different, honest answer to "where does data live and how private
is it."

## Guiding Constraint

REQUIREMENTS.md states two hard requirements that pull against each
other: strong privacy and multi-device sync. Rather than resolving that
tension prematurely, the architecture is phased so the tension only needs
solving when it actually becomes real (Phase 3). Phases 1 and 2 satisfy
privacy trivially, because data never leaves the user's device.

## Phase 1 — Interaction Prototype (current target)

**Goal:** Prove out the product's feel — especially the radial
quick-capture gesture, the calendar, Home/Hero, and the three entry types
— without committing to a data layer yet.

- **Platform:** Web app, responsive for both phone and desktop browsers.
- **Framework:** Left to the AI coding agent's judgment; a component-based
  framework well-supported by AI coding tools (e.g. React) is a
  reasonable default, but this is an implementation detail, not a fixed
  decision.
- **Data persistence:** None. State lives in memory only, via normal
  application state. Refreshing the page or closing the tab is expected
  to lose data. This is acceptable and intentional for this phase — the
  goal is validating interactions, not durability.
- **Privacy:** Trivially satisfied — nothing is stored or transmitted
  anywhere.
- **Explicitly out of scope for Phase 1:** persistence, sync, auth,
  attachments, tagging persistence beyond the current session.

## Phase 2 — Local Persistence

**Goal:** Entries survive closing the app/browser, on a single device.
Still no network involvement.

- **Storage:** Browser-local storage (e.g. IndexedDB, or a thin wrapper
  around it) on web; equivalent local storage if/when a native or
  hybrid mobile shell is introduced.
- **Scope:** Single device only. No sync between devices yet.
- **Privacy:** Still trivially satisfied — data never leaves the device.
  Whether to add device-level encryption-at-rest here is an open,
  non-blocking question (see Open Questions).
- **Data model work happens here** (see Data Model below) — this is the
  first phase where a real schema matters, since data needs to survive
  and be queryable (for search, calendar, tags).

## Phase 3 — Multi-Device Sync (future)

**Goal:** The same data, kept in sync across web and a future mobile app.

- **Backend:** A managed backend service (e.g. Firebase or Supabase),
  chosen over self-hosting since there's no existing infrastructure and
  the preference is to avoid operating a server.
- **Auth / access:** A device-level PIN or biometric (fingerprint) lock
  is the intended access model for the single-user case — not a
  traditional login. A managed backend's own auth system may still be
  used under the hood to identify "this device belongs to this data,"
  but the user-facing experience is a PIN/fingerprint unlock, not a
  username/password screen.
- **Privacy-vs-sync resolution:** Deferred to design time for this phase.
  Candidate approaches to evaluate then (not decided now): client-side
  encryption before data reaches the managed backend, relying on the
  backend provider's security model directly, or a hybrid. This decision
  should be made deliberately when Phase 3 is actually scoped, with
  real tradeoffs (search/query capability vs. encryption strength)
  weighed at that time.
- **Mobile app:** Introduced in this phase. Likely approaches (to be
  decided when reached): a wrapped/hybrid version of the existing web
  app (e.g. Capacitor-style shell) to avoid maintaining two separate
  codebases, or a PWA-first approach, depending on what the AI coding
  agents handle best at the time.

## Future Direction (explicitly not designed for now)

The user mentioned that, after the app is fully functional for personal
use, it could potentially expand to support other users managing their
own data. **This is not a v1, Phase 1–3, or near-term goal**, and no
multi-tenant features should be built for it now. The only accommodation
made today is a light one: the data model (below) scopes records by an
owner/user identifier from the start, even though only one user exists,
so that a future migration to multi-user doesn't require restructuring
existing data. This is the only concession to that future — nothing else
about multi-user (accounts, permissions, isolation guarantees) is in
scope until it becomes a real, prioritized goal.

## Data Model (introduced at Phase 2)

All entry types share a common shape, then extend it:

```
Entry (base)
- id
- ownerId          // future-proofing only; single fixed value until multi-user is real
- type             // "note" | "list" | "vocab"
- title
- createdAt        // exact timestamp, set once at creation
- updatedAt
- tags[]           // empty by default; user-assigned later

Note extends Entry
- content          // freeform text, supports headings/bullets

List extends Entry
- items[]          // ordered array
  - id
  - text
  - checked
  - order

Vocab extends Entry
- word
- meaning
- synonyms[]
- antonyms[]
- examples[]
```

Notes:
- `title` is required for Note and List per REQUIREMENTS.md; Vocab's
  "title" is effectively the word itself.
- `tags[]` being empty is a normal, first-class state (the untagged
  inbox), not an error or incomplete state.
- No version/history table — edits overwrite `content`/`items`/fields in
  place, consistent with the explicit decision against version history.
- Calendar activity indicators and search are both derived views over
  this same data — they do not require separate storage, just querying
  by `createdAt` (calendar) or text/field matching (search).

## Open Questions (non-blocking, revisit when relevant phase is reached)

- Whether Phase 2 local storage should be encrypted at rest on-device.
- Exact mobile packaging approach for Phase 3 (hybrid shell vs. PWA vs.
  native rebuild).
- Exact privacy mechanism for Phase 3 sync (see above).
- Whether Vocab needs its own tags table or reuses the shared `tags[]`
  mechanism once Vocab tagging is prioritized (see REQUIREMENTS.md,
  Useful Later).
