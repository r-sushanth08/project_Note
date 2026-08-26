# TODO.md

Implementation roadmap.

## Phase 1 — Interaction Prototype (Completed & Enhanced)

- [x] Project Scaffolding & Setup (React 18 + TypeScript + Vite + Tailwind CSS)
- [x] Integrate Dark Rainy Lantern background image (`public/bg.jpg`) with translucent dark theme
- [x] Redesign Home screen to card-less text-only layout:
  - [x] Boxed Lexicon Count badge (`words logged`)
  - [x] Orange-underlined `LEXICON OF THE DAY` subheading (`border-b-2 border-orange-500`)
  - [x] White serif word title & text definition
  - [x] Position radial capture dot higher up
  - [x] Fits completely inside `100dvh` mobile viewport without scrolling
- [x] Fix mobile touchscreen drag & drop gesture (`onTouchStart`, `onTouchMove`, `onTouchEnd`, `touch-action: none`)
- [x] Radial Control Dual Interaction Modes (Direct click = browse section, Drag & drop = create new entry)
- [x] Note Sub-types (Diary, Brain Dump, Collections)
- [x] Interactive Tappable Tag Pill System with custom tag creation
- [x] Vocab Folder Deck Stacking Cards Effect (2-card max stack, hidden scrollbar)
- [x] **Hardware-Accelerated Screen Navigation Slide Transitions**:
  - [x] Keyframe slide-in-right and slide-in-left CSS animations
  - [x] Dynamic PageTransition wrapper component
  - [x] Smooth 60 FPS transitions across all screens (Home, Notes, Lists, Vocab, Calendar, Search) and Editors
- [x] Build List editor with checkable items, reordering, and endless appending (no done state)
- [x] Build Calendar grid with per-day passive activity indicators and expanded day view
- [x] Build unified full-text search across Notes, Lists, Vocab, and tags
- [x] Verify unit tests (`vitest`), type checks (`tsc --noEmit`), and production build

## Phase 2 — Local Persistence (Next)

- [ ] Introduce Dexie IndexedDB schemas for offline local storage
- [ ] Migrate in-memory state to persistent browser storage
