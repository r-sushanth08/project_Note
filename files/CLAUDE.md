# CLAUDE.md

Context for Claude (or any AI coding agent) while building this project.
Read this alongside PROJECT.md, REQUIREMENTS.md, UX.md, ARCHITECTURE.md,
DECISIONS.md, TODO.md, and TESTING.md — this file summarizes the parts
most likely to matter moment-to-moment while writing code, and flags
things that are easy to get subtly wrong.

## What This Project Is

A personal, single-user journaling/thinking app with three entry types
(Note, List, Vocab), built in phases (see ARCHITECTURE.md). Currently in
**Phase 1: interaction prototype** — no persistence is expected or
required yet. Check TODO.md for the current phase's checklist before
assuming later-phase features (sync, auth, encryption) are in scope.

## The One Rule That Overrides Convenience

**Capture must never be blocked or slowed down.** This shows up
concretely as:
- No entry type requires a tag, category, or any field beyond what's
  specified in REQUIREMENTS.md to save.
- The radial capture gesture (see below) is a fast path — don't add
  confirmation dialogs, loading states, or extra taps to it without a
  very good reason.
- If a feature request or convenient implementation shortcut would add a
  step between "user wants to write something" and "user is writing,"
  push back or flag it rather than silently building it.

## The Radial Capture Gesture — Get This One Right

This is the most novel and most fragile part of the UX. Key constraints,
from UX.md and DECISIONS.md #7:
- **Single-stage only.** Drag toward a direction, release, new entry
  opens. There is no hold-to-reveal-more state. Do not reintroduce a
  two-stage interaction even if it seems like a natural extension —
  this was explicitly considered and rejected (see DECISIONS.md #7).
- **Capture-only, not navigation.** This control never browses or opens
  existing entries. Browsing happens through normal section navigation.
  Don't conflate the two even if it seems more "efficient" to reuse the
  same control.
- **Present on every screen**, not just Home, at a consistent position.
- On Home specifically, it's shown expanded/centered by default (the
  user sees the joystick immediately on opening the app) — this is
  slightly different from its collapsed-dot appearance elsewhere.

## Data Model Rules

- Follow the shared `Entry` base shape in ARCHITECTURE.md for all three
  types — don't invent a separate, disconnected schema per type, since
  search and calendar both need to query across all of them uniformly.
- `tags[]` empty is a normal, complete, expected state — never treat it
  as invalid, incomplete, or something to nudge the user to fix.
- `ownerId` exists on every record even though there's only one user
  today (see DECISIONS.md #12) — do not remove it as "unnecessary," and
  do not build any actual multi-user logic around it either. It's a
  placeholder for a possible future, nothing more.
- No version history table/mechanism. Edits overwrite in place. This was
  an explicit choice (DECISIONS.md #1-area), not an oversight — don't
  add undo/history as a "nice improvement" without checking with the
  user first.
- No "done"/"closed" state for Lists, ever, unless the user explicitly
  changes this requirement later.
- Deletion is permanent, no trash/undo layer. Don't add a soft-delete
  pattern "just in case" — it was explicitly declined twice (see
  DECISIONS.md #5).

## Things Explicitly Out of Scope Right Now

Don't build these unless TODO.md's current phase calls for them or the
user explicitly asks:
- Any backend, database, or network call (Phase 1)
- Auth/login of any kind (Phase 1 and 2)
- Attachments (photos/files)
- Vocab tagging, auto-fetched definitions
- Mood/emotion tagging
- Streaks or Hero stats beyond Vocab Count
- Rich formatting beyond headings/bullets in Notes
- Multi-user features of any kind

If a task seems to require one of these to "do it properly," stop and
flag the tension rather than quietly expanding scope.

## Style / Feel

Calm, minimal, distraction-free (see PROJECT.md, UX.md). This is not a
dashboard or a gamified productivity app. When in doubt between a
flashier option and a quieter one, prefer the quieter one. The one
intentional piece of playful/novel interaction is the radial gesture
itself — it doesn't need to be echoed elsewhere in the UI.

## When Requirements Feel Ambiguous

Check REQUIREMENTS.md's "Useful Later" and "Explicitly Unnecessary"
sections and DECISIONS.md before assuming a gap is an oversight — several
things that a typical notes app would include (version history, trash,
list completion states) were deliberately excluded here after direct
discussion with the user. Silence on a feature usually means "decided
against for now," not "forgot to mention."
