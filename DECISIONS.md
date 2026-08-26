# DECISIONS.md

Key decisions made during product development, and the reasoning behind them.

## 1. Capture is never blocked by organization
Entries can be saved fully untagged. Tagging is a later, optional action.

## 2. Notes and Lists are different entry types with different lifecycles
Lists have no "done"/"closed" state and can be appended to indefinitely. Notes are freeform prose, timestamped, editable without version history.

## 3. Vocab is a first-class entry type, not a note template
Vocab has its own fixed schema (word, part of speech, meaning, synonyms, antonyms, examples), its own collection, its own Home count box, and its own daily ritual (Vocab of the Day).

## 4. Vocab of the Day cycles oldest/least-recently shown first
The daily word is chosen by least-recently-shown logic, ensuring full coverage over time.

## 5. No trash bin; deletion is permanent
Deleting an entry is immediate and irreversible.

## 6. Calendar is a real date grid
Calendar shows actual month/year dates with passive activity indicators, expanding on click to colored dots by type (Notes, Lists, Vocab).

## 7. The radial capture gesture is single-stage and capture-only
Dragging the floating "dot" toward a direction and releasing immediately creates a new entry of that type (or opens Calendar).

## 8. Privacy and multi-device sync are both hard requirements, held in tension
Phased architecture: Phase 1 & 2 operate strictly on-device; Phase 3 handles backend sync.

## 9. Home is always the landing screen
The app opens to Home every time on every launch.

## 10. Dark Rainy Lantern Background & Text-Only Home Design
**Decision:** Integrated full-screen rainy lantern background (`public/bg.jpg`) with crisp white text, boxed Lexicon count, and an orange-underlined `LEXICON OF THE DAY` subheading.
**Why:** User requested dark atmospheric backdrop to reinforce reflective journal aesthetic. Text-only cards keep the UI minimal and unobtrusive over the background image.

## 11. Touchscreen Mobile Touch Gestures & 100dvh Single Viewport
**Decision:** Implemented native touch handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none` and dynamic `100dvh` viewport layout.
**Why:** Prevents touchscreen drag-and-drop scrolling conflicts and ensures the entire Home view (Count box, Lexicon of the Day, and Radial Dot) fits comfortably on mobile screens without scrolling.
