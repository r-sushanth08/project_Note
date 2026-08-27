# TODO.md

Implementation roadmap.

## Phase 1 — Interaction Prototype (Completed & Enhanced)

- [x] Project Scaffolding & Setup (React 18 + TypeScript + Vite + Tailwind CSS)
- [x] Integrate Dark Rainy Lantern background image (`public/bg-desktop.jpg`) with translucent dark theme
- [x] Redesign Home screen to card-less text-only layout:
  - [x] Boxed Lexicon Count badge (`words logged`)
  - [x] Orange-underlined `LEXICON OF THE DAY` subheading (`border-b-2 border-orange-500`)
  - [x] White serif word title & text definition
  - [x] Position radial capture dot higher up
  - [x] Fits completely inside `100dvh` mobile viewport without scrolling
- [x] **3 Lexicons of the Day Auto-Rotating Carousel on Home Screen**:
  - [x] Selection of 3 least-recently shown words per day (`getVocabOfTheDayList`)
  - [x] Auto-rotation interval (cycles every 6 seconds)
  - [x] Horizontal touch swiping (`onTouchStart`, `onTouchEnd`)
  - [x] 3 glowing white pagination indicator dots
  - [x] Slide-in CSS transitions on word title & definition block
  - [x] Static fixed `LEXICON OF THE DAY` orange subheading
- [x] **Fixed Pinned Section Subheaders**:
  - [x] Pinned sticky top headers in `NotesView`, `ListsView`, `VocabView`, `CalendarView`, and `SearchView` so section titles never scroll offscreen
- [x] **Orange Glowing Vocab Badge in Vocabulary Deck**:
  - [x] Glowing orange count badge (`shadow-[0_0_18px_rgba(249,115,22,0.5)]`)
- [x] **Calendar Dropdown Type Filter**:
  - [x] Dropdown selector (`All Entries`, `Notes`, `Lists`, `Vocab`)
- [x] Fix mobile touchscreen drag & drop gesture (`onTouchStart`, `onTouchMove`, `onTouchEnd`, `touch-action: none`)
- [x] Radial Control Dual Interaction Modes (Direct click = browse section, Drag & drop = create new entry)
- [x] Note Sub-types (Diary, Brain Dump, Collections)
- [x] Interactive Tappable Tag Pill System with custom tag creation
- [x] Vocab Folder Deck Stacking Cards Effect (2-card max stack, hidden scrollbar)
- [x] Hardware-Accelerated Screen Navigation Slide Transitions (`PageTransition.tsx`)
- [x] Build List editor with checkable items, reordering, and endless appending (no done state)
- [x] Build Calendar grid with per-day passive activity indicators and expanded day view
- [x] Build unified full-text search across Notes, Lists, Vocab, and tags
- [x] Verify unit tests (`vitest`), type checks (`tsc --noEmit`), and production build

## Phase 2 — Local Persistence (Next)

- [ ] Introduce Dexie IndexedDB schemas for offline local storage
- [ ] Migrate in-memory state to persistent browser storage
