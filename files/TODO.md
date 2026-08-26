# TODO.md

Implementation roadmap, organized by the phases defined in
ARCHITECTURE.md. Each phase should be fully working and usable before
moving to the next — do not start Phase 2 work while Phase 1 items are
still incomplete.

## Phase 1 — Interaction Prototype

**Goal:** Prove the feel of the app works, especially the radial capture
gesture. No persistence required.

- [ ] Set up the web app project (framework chosen by the building agent)
- [ ] Build Home screen: layout, Hero placeholder (Vocab Count, Vocab of
      the Day — can use dummy/in-memory data), radial dot control shown
      by default at center
- [ ] Build the radial "dot" control:
  - [ ] Floating dot, present on every screen, fixed relative position
  - [ ] Tap → background fade + radial menu with 4 directions (Notes,
        Lists, Vocab, Calendar)
  - [ ] Drag toward a direction + release → opens a new blank entry of
        that type immediately (single-stage, no hold state)
- [ ] Build Note creation/edit screen: title, timestamp display, content
      area with headings/bullets support
- [ ] Build List creation/edit screen: title, add item, checkbox toggle,
      drag-to-reorder, append-indefinitely (no "done" action anywhere)
- [ ] Build Vocab creation/edit screen: word, meaning, synonyms,
      antonyms, example sentence(s) — manual entry fields
- [ ] Build Notes / Lists / Vocab browse screens (simple list of
      in-memory entries, tap to open)
- [ ] Build Calendar screen:
  - [ ] Real month/year grid
  - [ ] Passive per-day activity indicator (dot/underline) driven by
        in-memory data
  - [ ] Click a day → expand section below with colored dots per type +
        access to that day's entries
- [ ] Wire in-memory tagging: allow adding/removing tags on any entry
      after creation (untagged is valid default)
- [ ] Basic full-text search across in-memory Notes/Lists/Vocab
- [ ] Sanity-check navigation: confirm browsing a section happens via
      normal navigation, not the radial gesture
- [ ] **Milestone check:** the whole loop (create via dot → appears in
      section → appears on calendar → findable via search/tag) works
      end-to-end, entirely in memory

## Phase 2 — Local Persistence

**Goal:** Entries survive closing the app, on one device.

- [ ] Introduce the shared data model (Entry base + Note/List/Vocab
      extensions) as defined in ARCHITECTURE.md
- [ ] Replace in-memory state with local storage (e.g. IndexedDB)
- [ ] Migrate all Phase 1 screens to read/write through the persistence
      layer instead of in-memory state
- [ ] Confirm data survives: refresh, closing tab/app, reopening
- [ ] Re-verify calendar indicators and search work against persisted
      data, not just session data
- [ ] Decide and implement (or explicitly defer) on-device encryption at
      rest — record the decision in DECISIONS.md either way
- [ ] **Milestone check:** app is fully usable day-to-day on one device,
      with no data loss between sessions

## Phase 3 — Multi-Device Sync (future)

**Goal:** Same data, available and in sync across web and mobile.

- [ ] Choose managed backend (Firebase or Supabase) and confirm it
      against the privacy requirement
- [ ] Design and record the privacy-vs-sync resolution in DECISIONS.md
      before implementing (see ARCHITECTURE.md Open Questions)
- [ ] Implement device PIN/biometric unlock as the user-facing access
      gate
- [ ] Implement sync layer (local persistence ↔ backend)
- [ ] Handle basic conflict resolution (even a simple last-write-wins
      rule, explicitly documented, is acceptable for a single-user app)
- [ ] Build/package the mobile app (approach TBD — hybrid shell vs. PWA
      vs. other, decided at this stage)
- [ ] **Milestone check:** editing an entry on one device is reflected on
      the other, and the app remains usable offline with sync catching up
      later

## Deferred Features (not scheduled — pull from REQUIREMENTS.md "Useful
Later" when/if prioritized)

- Vocab tagging/categorization
- Auto-fetch of word definitions/synonyms/antonyms
- Mood/emotion tagging on Notes
- Attachments (photos/files)
- Additional Hero stats beyond Vocab Count (e.g. streaks)
- Richer text formatting (bold, links, images)
