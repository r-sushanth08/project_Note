# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Fixed Pinned Section Subheaders

- **Pinned Headers**: In `Notes`, `Lists`, `Vocab`, `Calendar`, and `Search`, the section subheader title bar (back button `‹`, section title, and top action buttons/filters) is pinned to the top of the viewport (`sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-white/10`).
- **Scroll Behavior**: When scrolling down through long lists of notes, living list items, stacking vocab cards, or calendar grids, the section title stays fixed at top without moving offscreen.

## Auto-Rotating Lexicon of the Day (Home Screen)

- **Static Orange Subheading**: The `LEXICON OF THE DAY` subheading with **vibrant orange underline** (`border-b-2 border-orange-500`) stays fixed at top and never shifts during swiping.
- **Auto-Rotation**: Automatically rotates through the 3 daily Lexicon words every 6 seconds with smooth slide-in CSS transitions.
- **Manual Override**: Touch swiping or clicking pagination dots pauses/resets the auto-rotation loop.
- **3 Glowing Pagination Dots**: 3 white indicator dots below the definition text:
  - **Active Word Dot**: Glowing white (`bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-125`).
  - **Inactive Word Dots**: Faded glass white (`bg-white/30`).

## Vocabulary Deck (Folder Stacking Cards Effect & Orange Glow Badge)

- **Orange Glowing Count Badge**: The top count pill badge (`{vocabList.length} cards in folder`) features a vibrant orange ambient glow (`shadow-[0_0_18px_rgba(249,115,22,0.5)]`).
- **Folder Deck Physics**: Vocab cards stack over each other as the user scrolls up (`sticky top-[...]`), creating an authentic physical folder/deck effect.
- **2-Card Max Stack**: Capped at 2 visible card layers max (Current Card + Previous Card), completely hiding older cards underneath for infinite performance.
- **Locked / Hidden Scrollbar**: Browser scrollbars are completely hidden (`no-scrollbar`) so no raw scrollbar disrupts the folder deck aesthetic.

## Calendar Entry Type Dropdown Filter

- **Filter Dropdown**: Styled `<select>` dropdown in the Calendar subheader:
  - `All Entries`
  - `Notes`
  - `Lists`
  - `Vocab`
- **Filtered View**: Filters both the passive day indicators in the month calendar grid and the expanded day details section below.

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Lexicon Count box, orange-underlined Lexicon of the Day, and central quick-capture dot positioned in the upper-center viewport.
- **Notes** — browse/view/edit existing notes (Diary, Brain Dump, Collections sub-types).
- **Lists** — browse/view/edit existing living lists.
- **Vocab** — browse/view/edit existing vocab entries via the **Folder Stacking Cards Deck**.
- **Calendar** — month/year view with per-day activity indicators and dropdown type filter.

## Radial Quick-Capture Control ("the dot") Interaction Modes

1. **Direct Click (Tap button directly)**: Opens section browsing view (`Notes`, `Lists`, `Vocab`, `Calendar`).
2. **Drag & Drop (Drag from center dot and release)**: Triggers fast new entry creation immediately.

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: Native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`.
