# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg-desktop.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).

## Home-Exclusive Atmospheric Effects (Rain & Lantern Glow)

- **Synchronized Lantern Warm Glow Pulse**:
  - Soft amber/orange radial glow (`animate-lantern-pulse`) centered directly over the lantern flame.
  - Positioned dynamically in CSS (`right-[22%]` on mobile, `right-[16%]` on tablet, `right-[12%]` on desktop) so the glow shifts in **100% perfect sync** with the lantern as screen width changes!
- **Ambient Falling Rain Streaks**:
  - Lightweight vertical rain streak animations (`animate-rain-1`, `animate-rain-2`, `animate-rain-3`) drifting down the background.
- **Home-Exclusive Activation**:
  - Active **ONLY on the Home screen** (`currentView === 'home' && !selectedEntry`).
  - Smoothly fades out (`opacity-0 duration-700`) when navigating to `Notes`, `Lists`, `Vocab`, `Calendar`, `Search`, or Editors, ensuring zero distraction while reading or writing.

## 3 Lexicons of the Day Swipe Carousel (Home Screen)

- **Static Orange Subheading**: The `LEXICON OF THE DAY` subheading with **vibrant orange underline** (`border-b-2 border-orange-500`) stays fixed at top and never shifts during swiping.
- **3 Daily Words Carousel**: Displays 3 least-recently shown words per day.
- **Slide In / Slide Out Transitions**: Swiping left/right or tapping pagination dots triggers smooth slide-in CSS transitions on the word title, phonetic, and meaning block.
- **3 Glowing Pagination Dots**: 3 white indicator dots below the definition text:
  - **Active Word Dot**: Glowing white (`bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] scale-125`).
  - **Inactive Word Dots**: Faded glass white (`bg-white/30`).
- **Touch Swiping**: Swipe left for next word, swipe right for previous word (`onTouchStart`, `onTouchEnd`).

## Screen Navigation Slide Transitions

- **Smooth Slide In / Slide Out**: All screen transitions (`Home`, `Notes`, `Lists`, `Vocab`, `Calendar`, `Search`, and Editors) feature 60 FPS hardware-accelerated slide-in animations.
- **Navigation Direction**:
  - Navigating forward to a section or opening an editor triggers **Slide In Right**.
  - Returning to Home or closing an editor triggers **Slide In Left**.
- **Static Background**: The dark rainy lantern background image remains fixed and static while screens glide smoothly above it.

## Vocabulary Deck (Folder Stacking Cards Effect)

- **Folder Deck Physics**: Vocab cards stack over each other as the user scrolls up (`sticky top-[...]`), creating an authentic physical folder/deck effect.
- **2-Card Max Stack**: Capped at 2 visible card layers max (Current Card + Previous Card), completely hiding older cards underneath for infinite performance.
- **Locked / Hidden Scrollbar**: Browser scrollbars are completely hidden (`no-scrollbar`) so no raw scrollbar disrupts the folder deck aesthetic.
- **Structured Fields**: Cards display `Meaning:`, `Synonyms:`, `Antonyms:`, and orange tag pill buttons (`#PERSONAL`, `#LEARNING`).

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Lexicon Count box, orange-underlined Lexicon of the Day, and central quick-capture dot positioned in the upper-center viewport.
- **Notes** — browse/view/edit existing notes (Diary, Brain Dump, Collections sub-types).
- **Lists** — browse/view/edit existing living lists.
- **Vocab** — browse/view/edit existing vocab entries via the **Folder Stacking Cards Deck**.
- **Calendar** — month/year view with per-day activity indicators.

## Radial Quick-Capture Control ("the dot") Interaction Modes

1. **Direct Click (Tap button directly)**: Opens section browsing view (`Notes`, `Lists`, `Vocab`, `Calendar`).
2. **Drag & Drop (Drag from center dot and release)**: Triggers fast new entry creation immediately.

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: Native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`.
