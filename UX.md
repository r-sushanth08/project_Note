# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Top Navigation Header

- **Brand Logo**: "Jrnl." text logo on the left; clicking navigates back to Home.
- **Clock Focus Button**: Positioned on the right, replacing the legacy search button with a **Clock icon button** (`<Clock className="w-4 h-4" /> Focus`) that navigates to the **Cognitive Audio Entrainment Focus Timer** (`FocusTimerView`).

## Cognitive Audio Profile Matrix & Entrainment Engine (`FocusTimerView`)

Specialized cognitive entrainment and focus timer integrating the full **Cognitive Audio Matrix** that maps brainwave frequency bands, target cognitive states, tempos (BPM), carrier waves, and recommended acoustic textures to distinct user use-cases with smart safety duration caps.

### 🧠 Cognitive Audio Data Matrix Table

| Brainwave State | Frequency ($\Delta f$) | Targets | BPM Range & Default | Recommended Rhythmic Sounds | Carrier Tone | Max Duration Limit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Beta ($\beta$)** | 14–30 Hz (20 Hz) | High alertness, executive function, problem solving | 90–120 BPM (Default: 100) | Fast Metronome, Rapid Temple Blocks, Crisp Metallic Click | 216 Hz + 20 Hz carrier | **Max 30 mins** *(Safety overstimulation cap)* |
| **Alpha ($\alpha$)** | 8–13 Hz (10 Hz) | Calm focus, relaxed alertness, creative flow | 60–80 BPM (Default: 70) | Standard Clock, Steady Wood Chimes, Gentle Hand Drums | 432 Hz + 10 Hz carrier | **Max 30 mins** *(Safety overstimulation cap)* |
| **Theta ($\theta$)** | 4–7 Hz (6 Hz) | Deep meditation, hypnagogia, subconscious insight | 40–60 BPM (Default: 50) | Slow Singing Bowl, Shamanic Drumbeat, Ocean Pulse | 432 Hz + 6 Hz carrier | **Up to 8 hours / Continuous** |
| **Delta ($\delta$)** | 0.5–4 Hz (2 Hz) | Deep sleep, cellular repair, mental detachment | 20–40 BPM (Default: 24) | Spaced-Out Gong Strikes, 432Hz/528Hz Solfeggio Carrier | 528 Hz + 2 Hz Solfeggio | **Up to 8 hours / Continuous** |

### 🛠️ Key Engine & UI Features
- **Dynamic Binaural Carrier Wave**: Synthesizes a subtle, customizable carrier wave ($f_{\text{base}} + \Delta f_{\text{brainwave}}$) in stereo underneath the rhythmic acoustic textures, complete with toggle and volume controls.
- **Smart Safety Restrictions**: Automatically restricts Beta & Alpha sessions to $\le 30$ minutes with a mindful overstimulation warning badge, while unlocking multi-hour and continuous overnight modes for Theta and Delta.
- **Goal Quick Presets**: Instant one-tap configuration for "Intense Study & Work", "Fight Fatigue", "Creative Flow", "Post-Stress Reset", "Deep Meditation", "Sleep Prep", "Insomnia Relief", and "Physical Recovery".
- **Visual Circular Progress Ring & Waveforms**: Real-time SVG circular countdown ring with rhythmic pulse glow synchronized to the audio ticks and carrier frequency.

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
  - Expands **3 Proportional Creation Nodes** (`w-12 h-12` / 48px, noticeably smaller than central 64px dot) with generous spacing (`-top-24`, `-right-24`, `-left-24`):
    - **Top (`^`)**: `+ Note` (Emerald Green)
    - **Right (`>`)**: `+ List` (Amber Yellow)
    - **Left (`<`)**: `+ Vocab` (Purple / Indigo)
    - *(Calendar excluded from creation mode)*.
- **Dual Choice Creation**:
  - **Choice A (Direct Tap)**: Tapping any creation node opens fast entry creation (`openNewEntry`) and closes the menu cleanly.
  - **Choice B (Drag & Drop in Plus State)**: Pressing and dragging from the `+` dot button tracks aiming direction with animated chevron arrow indicators (`^` top, `>` right, `<` left). Releasing instantly opens entry creation!
- **Bulletproof Rewind Toggle**: Tapping or releasing on the central `+` button explicitly rewinds back to the sage pencil icon (`Pencil`).

### 3. 🎯 Pencil State: Hold & Aim Navigation Mode (Non-Home Screens, `isHomeCentered = false`)
- **Trigger**: Pressing down and holding on the central pencil dot.
- **Visual Transformations**:
  - Instantly pops **4 Proportional Vibrant Colored Navigation Nodes** (`w-12 h-12` / 48px) into view:
    - **Top (`^`)**: Notes — Emerald Green (`bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.6)]`)
    - **Right (`>`)**: Lists — Amber Yellow (`bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.6)]`)
    - **Bottom (`v`)**: Vocab — Purple / Indigo (`bg-indigo-500 shadow-[0_0_18px_rgba(99,102,241,0.6)]`)
    - **Left (`<`)**: Calendar — Orange Accent (`bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.6)]`)
  - **Red Chevron Pointer Indicator (`^`, `>`, `v`, `<`)**: Displays an animated red chevron arrow pointing to the targeted direction.
- **Real-Time Aiming**: Aiming/moving toward any direction lights up that colored node icon.
- **Release Navigation**: Releasing your hold immediately navigates to that screen (`setCurrentView(activeDirection)`). Releasing inside the center dead zone closes the menu cleanly without triggering navigation.

## Larger Back Button Tap Target

- **Tap Target Size**: Standardized back button to **`w-11 h-11`** (44px diameter) with bold `‹` chevron text (`text-2xl`) across all section views (`Notes`, `Lists`, `Vocab`, `Calendar`, `Search`, `Focus`) and editors (`NoteEditor`, `ListEditor`, `VocabEditor`).

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
