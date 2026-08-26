# DECISIONS.md

Key decisions made during discovery, and the reasoning behind them —
kept so future changes are deliberate, not accidental.

## 1. Capture is never blocked by organization

**Decision:** Entries can be saved fully untagged. Tagging is a
later, optional action.

**Why:** The user's primary motivation is processing thoughts/emotions by
writing, and the biggest historical reason they've abandoned apps is "too
many steps to just jot something down." Forcing categorization at
write-time directly conflicts with the app's core purpose.

## 2. Notes and Lists are different entry types with different lifecycles

**Decision:** Lists have no "done"/"closed" state and can be appended to
indefinitely. Notes are freeform prose, timestamped, editable but without
version history.

**Why:** The user confirmed lists are living/ongoing objects, not tasks
with completion states, and explicitly does not want the overhead of
tracking note history.

## 3. Vocab is a first-class entry type, not a note template

**Decision:** Vocab has its own fixed schema (word, meaning, synonyms,
antonyms, examples), its own collection, its own Home-screen count, and
its own daily ritual (Vocab of the Day).

**Why:** The user wants this to function differently from freeform
writing — structured recall/study, not journaling — and wants it visible
as a standalone measure of progress (the count).

## 4. Vocab of the Day cycles oldest-first, not randomly

**Decision:** The daily word is chosen by least-recently-shown, not pure
randomness.

**Why:** User explicitly wants full coverage over time (every saved word
eventually resurfaces) rather than the possibility of some words never
appearing.

## 5. No trash bin; deletion is permanent

**Decision:** Deleting an entry is immediate and irreversible.

**Why:** User was asked twice (once early, once after scope grew to
include streak-like features) and confirmed both times that simple,
permanent delete is preferred over a safety net. Simplicity was
prioritized over protection here deliberately, not by default.

## 6. Calendar is a real date grid, not a GitHub-style heatmap

**Decision:** Initial assumption (contribution-graph style heatmap) was
corrected by the user. The calendar shows actual month/year dates, with a
passive per-day activity indicator, expanding on click to a colored-dot
breakdown by entry type and full access to that day's entries.

**Why:** User wants to navigate by real dates ("that thing from last
week"), not an abstracted intensity map — the calendar needs to double as
a genuine date-based browsing tool, not just a visualization.

## 7. The radial capture gesture is single-stage and capture-only

**Decision:** Dragging the floating "dot" toward a direction and
releasing immediately creates a new entry of that type. There is no
hold-to-reveal-second-menu, and the gesture does not handle browsing.

**Why:** The user's original idea included a two-stage gesture (quick
release = browse, hold = new entry). This was examined directly against
the app's own stated #1 principle — capture must be the least effortful
action — and found to contradict it (the more frequent action, capture,
was assigned the more effortful gesture). When presented with the
tradeoff plainly, the user chose to simplify: capture gets the fast path,
browsing happens through normal section navigation instead. This keeps
the gesture's job singular and unambiguous.

## 8. Privacy and multi-device sync are both hard requirements, held in tension

**Decision:** Both requirements stand as stated. Neither is watered down
to make the other easier. The specific technical resolution is deferred
to ARCHITECTURE.md rather than decided prematurely at the product stage.

**Why:** Strong privacy (private-by-design) and reliable multi-device
sync pull against each other technically (e.g. end-to-end encryption
complicates conflict resolution and search indexing). Naming this
tension explicitly now prevents it from being silently under-resolved
later.

## 9. Home is always the landing screen

**Decision:** The app opens to Home every time, not "resume last screen."

**Why:** User wants Home to function as a ritual check-in point (Hero
stats + capture control), not just a menu — an intentional design choice
reinforcing the reflective, habitual nature of the app.
