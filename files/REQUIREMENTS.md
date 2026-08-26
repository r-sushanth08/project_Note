# REQUIREMENTS.md

Functionality agreed during discovery, organized by priority. "Essential"
is v1 scope. "Useful Later" is explicitly deferred, not forgotten.
"Unnecessary" is explicitly out, with reasoning, so it isn't re-litigated
by accident later.

## Entry Types

### Note
- Freeform text content, with light structure support (headings, bullets)
- Required title
- Exact timestamp shown above the note (e.g. "2:45 PM"), set at creation
- Editable at any time; edits overwrite in place (no version history)

### List
- A title, plus an ordered set of items
- Items are checkable (checkbox-style)
- Items can be manually reordered (drag to reorder)
- Items can be appended indefinitely — a list has no "done" or "closed"
  state; it stays open forever unless the user deletes it
- Editable at any time

### Vocab
- Fixed fields: word, meaning, synonyms, antonyms, example sentence(s)
- Entered manually by the user (no auto-fetch in v1)
- Flat collection in v1 (no tagging yet — see Useful Later)
- Contributes to the Vocab Count shown on Home, and to the Vocab of the
  Day pool

## Organization

- **Untagged inbox is a valid, permanent state.** Entries are not required
  to be tagged at creation.
- **Tagging happens after the fact**, whenever the user chooses to.
- **Multiple tags per entry** are supported.
- **Full-text search** across Notes, Lists, and Vocab from v1.

## Home / Hero

- Home is the screen the app opens to on every launch (not "resume last
  screen").
- Displays at least the total Vocab Count.
- Displays "Vocab of the Day" — a word pulled from the user's own Vocab
  collection, changing daily, cycling through oldest/least-recently-shown
  words first so all words eventually surface.
- Hosts the radial quick-capture control at its center by default.

## Calendar

- A real calendar view (month/year grid of actual dates — not a GitHub-
  style contribution strip).
- Days with any activity show a subtle passive indicator (e.g. dot or
  underline) directly on the grid, visible without clicking.
- Clicking a day opens a section below the calendar showing colored dots
  indicating which entry types (Note / List / Vocab) occurred that day.
- From that expanded day view, the user has full view/edit access to that
  day's entries.

## Navigation & Capture

- A floating radial control ("the dot"), present on every screen, not
  just Home.
- Tapping it fades the background and opens a radial menu with 4
  directions: Notes, Lists, Vocab, Calendar.
- Dragging toward a direction and releasing creates a **new entry** of
  that type immediately (single-stage gesture — no hold, no secondary
  menu). This is the fast-capture path and its only job.
- Browsing/reviewing existing entries happens by navigating into a
  section normally (not through the radial gesture).

## Deletion

- Deletion is simple and permanent. No trash bin, no undo safety net.

## Sync & Privacy (product-level requirements; mechanism is architecture's job)

- The app must be usable on multiple devices, with entries staying in
  sync across them.
- The app must treat privacy as a hard requirement — content is sensitive
  and personal. Exact technical approach (encryption, storage model,
  etc.) is deferred to ARCHITECTURE.md, but this requirement constrains
  those choices.

## Attachments

- Occasional, not core. Not required for v1 (see Useful Later).

---

## Useful Later (explicitly deferred, not v1)

- Vocab tagging/categorization
- Auto-fetch of word definitions/synonyms/antonyms when adding a Vocab
  entry
- Mood/emotion tagging on Notes
- Attachments (photos/files) on entries
- Additional Hero stats beyond Vocab Count (e.g. streaks)
- Richer text formatting beyond headings/bullets (bold, links, images)

## Explicitly Unnecessary for v1 (with reasoning)

- **Version/edit history on Notes** — user does not want this; free
  editing is preferred over safety nets here.
- **"Done"/"closed" state for Lists** — a list is always open; this
  matches how the user actually uses lists.
- **Trash bin / undo on delete** — user explicitly prefers simple,
  permanent deletion.
