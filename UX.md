# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Horizontal Calendar Date Strip (Notes View)

- **Date Strip Header**: Replaces tag bar in `NotesView.tsx`.
- **Calendar Icon / All Dates Button**: Calendar icon button (`<Calendar className="w-4 h-4 text-orange-400" />`) with an "All Dates" reset option.
- **Date Pills**: Horizontally scrollable strip displaying day of week letter (`M`, `T`, `W`, `T`, `F`, `S`, `S`) above date numbers (`24`, `25`, `26`, `27`, `28`).
- **Glowing Active Date Pill**: Selected date glows with a vibrant orange border and shadow (`bg-orange-500/20 border border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.5)] font-bold scale-105`).
- **Date Filtering**: Clicking a date filters notes to entries created on that specific date.

## Folder Deck Stacking Cards Effect (Notes & Vocab Views)

- **Folder Deck Physics**: Note cards and Vocab cards stack over each other as the user scrolls up (`sticky top-[...]`), creating an authentic physical folder/deck effect.
- **2-Card Max Stack**: Capped at 2 visible card layers max (Current Card + Previous Card), completely hiding older cards underneath for infinite performance.
- **Separate Title Header & Scroll Boundary**: The section title header sits in a static header container at top (`flex-shrink-0`), while cards scroll strictly within the content region below (`flex-1 overflow-y-auto`). Cards **NEVER pass underneath or behind the title header**.

## Auto-Rotating Lexicon of the Day (Home Screen)

- **Static Orange Subheading**: The `LEXICON OF THE DAY` subheading with **vibrant orange underline** (`border-b-2 border-orange-500`) stays fixed at top and never shifts during swiping.
- **Auto-Rotation**: Automatically rotates through the 3 daily Lexicon words every 6 seconds with smooth slide-in CSS transitions.
- **Manual Override**: Touch swiping or clicking pagination dots pauses/resets the auto-rotation loop.

## Calendar Entry Type Dropdown Filter

- **Filter Dropdown**: Styled `<select>` dropdown in the Calendar subheader (`All Entries`, `Notes`, `Lists`, `Vocab`).
- **Filtered View**: Filters both the passive day indicators in the month calendar grid and the expanded day details section below.

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Lexicon Count box, orange-underlined Lexicon of the Day, and central quick-capture dot positioned in the upper-center viewport.
- **Notes** — browse/view/edit existing notes (Diary, Brain Dump, Collections sub-types) with horizontal calendar date strip and folder deck stacking cards effect.
- **Lists** — browse/view/edit existing living lists.
- **Vocab** — browse/view/edit existing vocab entries via the **Folder Stacking Cards Deck**.
- **Calendar** — month/year view with per-day activity indicators and dropdown type filter.

## Radial Quick-Capture Control ("the dot") Interaction Modes

1. **Direct Click (Tap button directly)**: Opens section browsing view (`Notes`, `Lists`, `Vocab`, `Calendar`).
2. **Drag & Drop (Drag from center dot and release)**: Triggers fast new entry creation immediately.

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: Native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`.
