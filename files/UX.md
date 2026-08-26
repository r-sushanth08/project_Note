# UX.md

Agreed user experience and interaction behavior. Visual design (colors,
typography, spacing) is intentionally left open — this covers *behavior*,
not final visuals.

## Overall Feel

Calm, minimal, distraction-free. Not a dashboard, not gamified beyond the
one explicitly requested Hero stat. The app should feel like a quiet place
to think, not a tool demanding attention.

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Hero (Vocab Count,
  Vocab of the Day). Hosts the radial capture control by default.
- **Notes** — browse/view/edit existing notes.
- **Lists** — browse/view/edit existing lists.
- **Vocab** — browse/view/edit existing vocab entries.
- **Calendar** — month/year view with per-day activity indicators.

There is no bottom tab bar and no hamburger menu. Movement between
sections happens two ways:
1. The radial "dot" control, for creating new entries fast.
2. Direct navigation into a section when the user wants to browse or
   reread (exact mechanism — e.g. cards on Home, or a lightweight way to
   jump directly to a section — still open; to be resolved during visual
   design, not a blocking product decision).

## The Radial Quick-Capture Control ("the dot")

This is the primary way new entries get created, and it is a capture
accelerator only — it does not browse, does not confirm, does not have a
secondary state.

**Behavior:**
- A small floating dot is present on every screen in the app (not just
  Home), always in the same relative position.
- Tapping it fades the background and reveals a radial menu centered on
  the dot's position, with four directions corresponding to Notes, Lists,
  Vocab, and Calendar.
- The user drags toward the direction of the type they want.
- Releasing over a direction immediately opens a **new, blank entry** of
  that type, ready to write.
- This is single-stage: no hold-to-reveal-more, no ambiguity about what a
  quick release does. Quick release always means "create new."
- On Home specifically, the dot/joystick is shown by default at the
  center of the screen (the user sees it immediately on opening the app).

**Explicitly not part of this control:** browsing old entries, opening a
section to read (that happens by navigating into the section directly).

## Entry Creation & Editing

### Note
- Opens to a blank writing surface with the title field and an exact
  timestamp shown above the content area (set automatically at creation,
  not user-editable after the fact — TBD if this needs confirming later,
  currently assumed fixed at creation time).
- Supports headings and bullets as light structural formatting.
- No tag prompt at creation — tagging is optional and deferred.
- Saves without requiring a tag or category.

### List
- Opens to a title field and an empty item list with an "add item" entry
  point.
- Items can be checked/unchecked.
- Items can be reordered via drag.
- New items can be appended at any time, indefinitely — there is no
  "finish" or "complete" action for the list itself.

### Vocab
- Opens to a form with fixed fields: word, meaning, synonyms, antonyms,
  example sentence(s).
- All fields entered manually by the user.
- Saving adds it to the flat Vocab collection and makes it eligible for
  future Vocab of the Day rotation.

## Tagging (Deferred Organization)

- Entries are created untagged by default; this is a normal, complete
  state, not a partial one.
- At any later point, the user can open an entry and add one or more tags
  to it.
- Browsing by tag is a supported way of finding entries later (alongside
  full-text search and the calendar).

## Calendar Interaction

- Displays a real month/year grid.
- Days with any recorded activity show a subtle passive mark (dot or
  underline) directly on the grid — visible without interaction.
- Tapping a day expands a section below the calendar grid showing colored
  dots representing which entry types occurred that day (Note, List,
  Vocab each get a distinct color).
- From this expanded view, the user can open, view, and edit any of that
  day's entries directly — full access, not just a summary.

## Home / Hero

- Displays the total Vocab Count.
- Displays "Vocab of the Day," pulled from the user's own saved words,
  rotating so that the least-recently-shown word is prioritized (ensuring
  full coverage over time rather than pure randomness).
- Hosts the radial capture control at center by default.
- Additional Hero content beyond Vocab Count is explicitly left open for
  later (see REQUIREMENTS.md — Useful Later).

## Search

- A single full-text search surface across Notes, Lists, and Vocab
  together (not siloed per-section) — exact placement in the navigation
  is open, to be resolved during visual design.

## Deletion

- Deleting an entry is immediate and permanent — no confirmation-safety-
  net beyond whatever minimal "are you sure" step feels appropriate at
  build time (no trash/undo system).

## Open UX Questions (not blocking, to resolve during visual design)

- Exact mechanism for jumping directly into a section to browse (cards on
  Home vs. some lightweight persistent access alongside the radial dot).
- Whether the note timestamp is truly fixed at creation or can reflect
  edit time as well.
- Placement and visual treatment of the search entry point.
- Full visual language (color, type, spacing) — nothing here is decided.
