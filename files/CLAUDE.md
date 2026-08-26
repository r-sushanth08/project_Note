# CLAUDE.md

Context for AI coding agents building this project.

## Project Aesthetic & Visual Theme
- **Background**: Full-screen **Dark Rainy Lantern scene** (`public/bg.jpg`) with dark overlay (`bg-slate-950/45`).
- **Home Screen Layout**: Text-only layout — no heavy cards.
  - **Lexicon Count**: Boxed badge (`bg-white/10 border border-white/20`).
  - **Lexicon of the Day**: Subheading with a **vibrant orange underline** (`border-b-2 border-orange-500`), followed by serif word title and white text meaning.
  - **Mobile 100dvh Viewport**: Fits completely inside a single mobile phone screen height without page scrolling.

## Core Feature Rules
1. **Note Sub-types**:
   - **Diary**: Chronological journal with prominent Date/Day/Time header (`CREATED: MON, 24 AUG 2026, 14:19`), title, spacious writing canvas.
   - **Brain Dump**: Ultra-minimalist, distraction-free writing space for raw thoughts, ideas, reminders, questions.
   - **Collections**: Structured lists for brands, artists, books, movies, places, topics, personal interests with item management.
2. **Interactive Tag Pill System**:
   - Tappable tag pills (`Work`, `Personal`, `Idea`, `Learning`, `Important`, `Reminder`, `People`, `Travel`, `Experience`, `Question`, `Favorite`, `Explore`).
   - Selected tags highlighted in **vibrant orange** (`bg-orange-500 text-white`).
   - Inline `+ Custom Tag` input creates new reusable tag buttons saved globally.
3. **Radial Capture Gesture**: Single-stage capture gesture (Notes, Lists, Vocab, Calendar).
   - Direct click = browse section view.
   - Drag & drop = create new entry immediately.
4. **Deletion**: Immediate permanent delete, no trash bin.
