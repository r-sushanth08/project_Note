# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Real-Time Directional Movement Tracking Navigation (Non-Home Screens)

- **Hold Gesture**: Pressing and holding down on the central pencil dot on non-home screens (`isHomeCentered = false`) expands the 4 radial nodes (`Notes`, `Lists`, `Vocab`, `Calendar`).
- **Zero Default Selection**: When pressing down, **no node is selected by default (`activeDirection = null`)**. No red arrow appears initially until movement occurs.
- **Real-Time Directional Tracking**: Moving your finger/cursor slightly away from the center dot (> 15px) dynamically selects the targeted direction:
  - **Move Left (`<`)**: Highlights **Calendar** (`<`) with red chevron arrow pointer
  - **Move Right (`>`)**: Highlights **Lists** (`>`) with red chevron arrow pointer
  - **Move Up (`^`)**: Highlights **Notes** (`^`) with red chevron arrow pointer
  - **Move Down (`v`)**: Highlights **Vocab** (`v`) with red chevron arrow pointer
- **Release Navigation**: Releasing the hold while pointing at a direction instantly navigates to that screen (`setCurrentView`). Releasing inside the center dead zone closes the menu cleanly without triggering navigation.
- **Home Screen**: Retains full click navigation and drag-to-create actions.

## Larger Back Button Tap Target

- **Tap Target Size**: Increased back button to **`w-11 h-11`** (44px diameter) with bold `‹` chevron text (`text-2xl`) across all section views (`Notes`, `Lists`, `Vocab`, `Calendar`, `Search`) and editors (`NoteEditor`, `ListEditor`, `VocabEditor`).

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

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: Native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`.
