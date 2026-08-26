# CLAUDE.md

Context for AI coding agents building this project.

## Project Aesthetic & Visual Theme
- **Background**: Full-screen **Dark Rainy Lantern scene** (`public/bg.jpg`) with dark overlay (`bg-slate-950/45`).
- **Home Screen Layout**: Text-only layout — no heavy cards.
  - **Lexicon Count**: Boxed badge (`bg-white/10 border border-white/20`).
  - **Lexicon of the Day**: Subheading with a **vibrant orange underline** (`border-b-2 border-orange-500`), followed by serif word title and white text meaning.
  - **Mobile 100dvh Viewport**: Fits completely inside a single mobile phone screen height without page scrolling.
  - **Radial Dot Positioning**: Positioned higher up in the upper-middle section.

## Core Interaction Rules
1. **Capture beats everything**: Do not delay entry creation.
2. **Radial Gesture**: Single-stage capture gesture (Notes, Lists, Vocab, Calendar). Supports native mobile touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`.
3. **Entry Types**:
   - Note: Timestamp above content, headings & bullets.
   - List: Reorderable checkable items, infinite append (no done state).
   - Vocab: Word, part of speech, meaning, synonyms, antonyms, examples.
4. **Deletion**: Immediate permanent delete, no trash bin.
