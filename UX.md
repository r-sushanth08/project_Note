# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Comprehensive Summary of Radial Control Trigger Actions & Behaviors

The floating radial control ("the dot") supports 3 distinct interaction modes:

### 1. 🏡 Home Screen Mode (`isHomeCentered = true`)
- **Location**: Positioned in the upper-center viewport.
- **Static Nodes**: 4 radial node icons (`Notes`, `Lists`, `Vocab`, `Calendar`) are displayed around the central pencil dot.
- **Click Node Icon**: Tapping any node icon directly navigates to that section screen (`Notes`, `Lists`, `Vocab`, `Calendar`).
- **Drag & Drop Gesture**: Dragging from the central pencil dot toward any direction and releasing immediately opens new entry creation (`New Note`, `New List`, `New Vocab`, `Calendar`).

### 2. ⚡ Plus State: Entry Creation Mode (Non-Home Screens, `isHomeCentered = false`)
- **Trigger**: Quick tap (< 250ms, < 12px movement) on the central pencil dot on any non-home screen.
- **Visual Transformations**:
  - The center pencil icon morphs smoothly into an orange **`+` Plus Icon**.
  - Expands **3 Larger Creation Nodes** (`w-14 h-14` / 56px) with generous spacing (`-top-24`, `-right-24`, `-left-24`):
    - **Top (`^`)**: `+ Note` (Emerald Green)
    - **Right (`>`)**: `+ List` (Amber Yellow)
    - **Left (`<`)**: `+ Vocab` (Purple / Indigo)
    - *(Calendar excluded from creation mode)*.
- **Dual Choice Creation**:
  - **Choice A (Direct Tap)**: Tapping any creation node opens fast entry creation (`openNewEntry`) and closes the menu cleanly.
  - **Choice B (Drag & Drop in Plus State)**: Pressing and dragging from the `+` dot button tracks aiming direction with animated chevron arrow indicators (`^` top, `>` right, `<` left). Releasing instantly opens entry creation!
- **Rewind Toggle**: Tapping the central `+` button directly rewinds back to the pencil icon.

### 3. 🎯 Pencil State: Hold & Aim Navigation Mode (Non-Home Screens, `isHomeCentered = false`)
- **Trigger**: Pressing down and holding on the central pencil dot.
- **Visual Transformations**:
  - Instantly pops **4 Larger Vibrant Colored Navigation Nodes** (`w-14 h-14` / 56px) into view:
    - **Top (`^`)**: Notes — Emerald Green (`bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`)
    - **Right (`>`)**: Lists — Amber Yellow (`bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.6)]`)
    - **Bottom (`v`)**: Vocab — Purple / Indigo (`bg-indigo-500 shadow-[0_0_18px_rgba(99,102,241,0.6)]`)
    - **Left (`<`)**: Calendar — Orange Accent (`bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.6)]`)
  - **Red Chevron Pointer Indicator (`^`, `>`, `v`, `<`)**: Displays an animated red chevron arrow pointing to the targeted direction.
- **Real-Time Aiming**: Aiming/moving toward any direction lights up that colored node icon.
- **Release Navigation**: Releasing your hold immediately navigates to that screen (`setCurrentView(activeDirection)`). Releasing inside the center dead zone closes the menu cleanly without triggering navigation.

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
