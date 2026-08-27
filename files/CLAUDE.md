# CLAUDE.md

Context for AI coding agents building this project.

## Project Aesthetic & Visual Theme
- **Background**: Full-screen **Dark Rainy Lantern scene** (`public/bg-desktop.jpg`) with dark overlay (`bg-slate-950/40`).
- **Home Screen Layout**: Text-only layout — no heavy cards.
  - **Lexicon Count**: Boxed badge (`bg-white/10 border border-white/20`).
  - **Auto-Rotating 3 Lexicons of the Day Carousel**: Cycles through 3 daily words every 6 seconds with horizontal touch swiping, 3 glowing white pagination indicator dots, and slide-in CSS transitions.
  - **Static Subheading**: `LEXICON OF THE DAY` with a **vibrant orange underline** (`border-b-2 border-orange-500`) stays static at top and never shifts.
  - **Mobile 100dvh Viewport**: Fits completely inside a single mobile phone screen height without page scrolling.

## Core Feature Rules
1. **Fixed Pinned Section Subheaders**:
   - Subheader title bars in `Notes`, `Lists`, `Vocab`, `Calendar`, and `Search` are pinned to top (`sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-white/10`) so titles never scroll offscreen.
2. **Auto-Rotating Lexicon Carousel**:
   - Home screen automatically cycles through 3 daily words every 6 seconds.
3. **Orange Glowing Vocab Count Badge**:
   - Vocab count badge in Vocabulary Deck features a vibrant orange ambient glow (`shadow-[0_0_18px_rgba(249,115,22,0.5)]`).
4. **Calendar Dropdown Type Filter**:
   - Calendar features a dropdown filter selector (`All Entries`, `Notes`, `Lists`, `Vocab`).
5. **Screen Slide Transitions**:
   - Hardware-accelerated Slide In Right / Slide In Left transitions across all screens and editors (`PageTransition.tsx`).
6. **Vocab Folder Deck Stacking Cards**:
   - Cards stack over each other as the user scrolls up (`sticky top-[...]`), capped at 2 visible cards max.
   - Hidden/locked scrollbars (`no-scrollbar`).
7. **Note Sub-types**:
   - **Diary**: Chronological journal with prominent Date/Day/Time header.
   - **Brain Dump**: Ultra-minimalist, distraction-free writing space.
   - **Collections**: Structured lists for brands, artists, books, movies, places, topics.
8. **Interactive Tag Pill System**:
   - Tappable tag pills plus inline `+ Custom Tag` creation.
9. **Radial Capture Gesture**: Single-stage capture gesture (Notes, Lists, Vocab, Calendar).
10. **Deletion**: Immediate permanent delete, no trash bin.
