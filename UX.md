# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).
- **Lexicon of the Day**: Displayed below the Lexicon count with a **vibrant orange underline** (`border-b-2 border-orange-500`) under the subheading, followed by the serif word title and white text meaning.

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Lexicon Count box, orange-underlined Lexicon of the Day, and central quick-capture dot positioned in the upper-center viewport.
- **Notes** — browse/view/edit existing notes.
- **Lists** — browse/view/edit existing living lists.
- **Vocab** — browse/view/edit existing vocab entries.
- **Calendar** — month/year view with per-day activity indicators.

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: The Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: The radial quick-capture gesture supports native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`, preventing mobile scroll conflicts while dragging towards Notes, Lists, Vocab, or Calendar.

## The Radial Quick-Capture Control ("the dot")

- Floating dot present on every screen.
- Centered and positioned upper-middle on Home.
- Dragging towards a direction (Notes, Lists, Vocab, Calendar) and releasing immediately opens a blank entry form of that type or Calendar view.
- Single-stage gesture: release in dead zone cancels back to closed dot state.

## Entry Creation & Editing

### Note
- Opens to title field with exact creation timestamp displayed above content (set automatically at creation).
- Supports headings (`#`) and bullet points (`-`).
- In-place auto-save, optional tagging, immediate permanent delete.

### List
- Title field, checkable list items, drag/manual reordering.
- Endless appending (no "done" state; list stays open forever).

### Vocab
- Fixed fields: word, part of speech, meaning, synonyms, antonyms, example sentence(s).
- Manual entry, auto-save, permanent delete.

## Deletion

- Simple and permanent deletion (no trash bin, no undo safety net).
