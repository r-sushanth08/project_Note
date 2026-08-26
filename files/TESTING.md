# TESTING.md

How we'll verify the app actually works, matched to each phase in
ARCHITECTURE.md/TODO.md. Testing depth grows as the app grows — Phase 1
doesn't need the same rigor as Phase 3.

## Phase 1 — Interaction Prototype

Since there's no persistence yet, testing here is almost entirely
**manual, interaction-focused verification** — does it feel right, not
just does it technically run.

- **Radial capture gesture** (highest priority to test — it's the app's
  most novel and most complex interaction):
  - Tapping the dot fades the background and shows all 4 directions
    clearly
  - Dragging toward each of the 4 directions and releasing opens the
    correct entry type, every time
  - Releasing in a "dead zone" (not clearly toward any direction) does
    not accidentally create the wrong entry type — it should cancel back
    to the closed state
  - The dot is reachable and behaves identically from every screen, not
    just Home
- **Entry creation correctness:**
  - Note: title + content + timestamp all appear correctly; headings/
    bullets render as expected
  - List: items can be added, checked, unchecked, reordered by drag, and
    appended to with no artificial limit or "done" action anywhere in
    the UI
  - Vocab: all five fields (word, meaning, synonyms, antonyms, examples)
    save and redisplay correctly
- **Calendar:**
  - A day with activity shows the passive indicator; a day with none
    does not
  - Clicking a day shows the correct colored dots for the entry types
    that actually occurred, and links to the correct entries
- **Tagging:** an entry with no tags is displayed normally (not as an
  error/warning state); adding/removing tags after creation works
- **Search:** finds matches across all three entry types, not just one
- **Explicit non-goal for this phase:** don't test data survival across
  refresh — Phase 1 is expected to lose data on refresh. That is correct
  behavior here, not a bug.

## Phase 2 — Local Persistence

Adds real data-integrity testing on top of Phase 1's interaction checks.

- **Persistence correctness:**
  - Create an entry of each type, close the app fully, reopen — all data
    and fields are intact, exactly as entered
  - Edit an existing entry, reopen — the edit persisted (and, per
    DECISIONS.md #1/#5-equivalent, no old version is retrievable — this
    is expected, not a defect)
  - Delete an entry, reopen — it's gone permanently, no trace, no trash
    (matches the explicit no-undo decision)
- **Derived views stay correct against real storage:**
  - Calendar indicators reflect actual stored `createdAt` dates, not
    session-only data
  - Search reflects everything in storage, not just what was created in
    the current session
- **Storage limits/edge cases:**
  - Reasonable volume of entries (e.g. hundreds) doesn't meaningfully
    degrade search or calendar performance
  - Very long note content or long lists don't break the UI
- **If on-device encryption at rest was implemented** (per the Phase 2
  open decision): verify data is genuinely unreadable outside the app,
  not just visually hidden

## Phase 3 — Multi-Device Sync

Adds sync-specific and security-specific testing.

- **Sync correctness:**
  - Create an entry on Device A, confirm it appears on Device B within
    an expected time window
  - Edit an entry on Device A while Device B is offline; bring Device B
    back online; confirm the documented conflict rule (e.g. last-write-
    wins) behaves as documented — not silently, unpredictably different
  - Delete on one device propagates correctly to the other (permanent,
    per the no-trash decision)
- **Access control:**
  - PIN/biometric gate actually blocks access without correct
    credentials
  - Verify what happens on a new/unrecognized device attempting to sync
    (should not silently grant access)
- **Privacy verification:**
  - Confirm the specific privacy mechanism decided at Phase 3 design
    time (e.g. encryption in transit/at rest at the backend) is actually
    in effect — not assumed. This should be checked directly (e.g.
    inspecting what the backend actually stores), not just trusted from
    documentation.
- **Offline resilience:**
  - App remains fully usable with no network connection (create, edit,
    delete all work locally)
  - Queued changes sync correctly once connectivity returns

## General Principles Across All Phases

- Prioritize testing the things that are *unusual* about this app (the
  radial gesture, the untagged-inbox behavior, list-never-closes
  behavior, calendar day-detail view) over things that are standard CRUD
  and low-risk.
- A bug in the capture path (the radial dot) is the highest-severity bug
  category in this app, given it's the core design principle — treat it
  accordingly.
- No automated test suite is mandated for Phase 1; manual verification
  against the checklists above is sufficient. Introducing automated
  tests (unit tests for the data model, integration tests for sync) is a
  reasonable investment starting at Phase 2, especially once data
  durability matters.
