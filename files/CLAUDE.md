# CLAUDE.md

Context for AI coding agents building this project.

## Project Aesthetic & Visual Theme
- **Background**: Full-screen **Dark Rainy Lantern scene** (`public/bg.jpg`) with dark overlay (`bg-slate-950/45`).
- **Home Screen Layout**: Text-only layout — no heavy cards.
  - **Lexicon Count**: Boxed badge (`bg-white/10 border border-white/20`).
  - **3 Lexicons of the Day Carousel**: Displays 3 least-recently shown words with horizontal touch swiping, 3 glowing white pagination indicator dots, and slide-in CSS transitions.
  - **Static Subheading**: `LEXICON OF THE DAY` with a **vibrant orange underline** (`border-b-2 border-orange-500`) stays static at top and never shifts during swiping.
  - **Mobile 100dvh Viewport**: Fits completely inside a single mobile phone screen height without page scrolling.

## Core Feature Rules
1. **3 Lexicons of the Day Carousel**:
   - Displays 3 least-recently shown words per day.
   - Horizontal touch swiping (`onTouchStart`, `onTouchEnd`).
   - 3 white pagination indicator dots (glowing white for active word, faded white for inactive words).
   - Fixed static `LEXICON OF THE DAY` orange subheading.
2. **Screen Slide Transitions**:
   - Hardware-accelerated Slide In Right / Slide In Left transitions across all screens and editors (`PageTransition.tsx`).
   - Static background remains fixed while screens glide smoothly above it.
3. **Vocab Folder Deck Stacking Cards**:
   - Cards stack over each other as the user scrolls up (`sticky top-[...]`), capped at 2 visible cards max.
   - Hidden/locked scrollbars (`no-scrollbar`).
   - Cards feature formatted fields (`Meaning:`, `Synonyms:`, `Antonyms:`, `Tags`, `View Details ›`).
4. **Note Sub-types**:
   - **Diary**: Chronological journal with prominent Date/Day/Time header (`CREATED: MON, 24 AUG 2026, 14:19`), title, spacious writing canvas.
   - **Brain Dump**: Ultra-minimalist, distraction-free writing space for raw thoughts, ideas, reminders, questions.
   - **Collections**: Structured lists for brands, artists, books, movies, places, topics, personal interests with item management.
5. **Interactive Tag Pill System**:
   - Tappable tag pills (`Work`, `Personal`, `Idea`, `Learning`, `Important`, `Reminder`, `People`, `Travel`, `Experience`, `Question`, `Favorite`, `Explore`).
   - Selected tags highlighted in **vibrant orange** (`bg-orange-500 text-white`).
   - Inline `+ Custom Tag` input creates new reusable tag buttons saved globally.
6. **Radial Capture Gesture**: Single-stage capture gesture (Notes, Lists, Vocab, Calendar).
   - Direct click = browse section view.
   - Drag & drop = create new entry immediately.
7. **Deletion**: Immediate permanent delete, no trash bin.
