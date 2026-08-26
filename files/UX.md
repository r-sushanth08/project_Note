# UX.md

Agreed user experience and interaction behavior.

## Overall Feel & Visual Theme

Calm, minimal, reflective, and distraction-free. The app is set against a **Dark Rainy Lantern background scene** (`public/bg.jpg`), creating a quiet, atmospheric, late-night place to think and record thoughts.

- **Theme**: Dark aesthetic with crisp white typography (`text-white`, `text-slate-200`) over the lantern background scene with soft dark overlay.
- **Home Screen Aesthetic**: Text-only, minimalist layout — no heavy white cards on Home.
- **Lexicon Count**: Displayed inside a sleek, semi-transparent boxed badge (`words logged`).
- **Lexicon of the Day**: Displayed below the Lexicon count with a **vibrant orange underline** (`border-b-2 border-orange-500`) under the subheading, followed by the serif word title and white text meaning.

## App Structure

Four sections, plus Home:
- **Home** — landing screen on every launch. Shows Lexicon Count box, orange-underlined Lexicon of the Day, and central quick-capture dot positioned in the upper-center viewport.
- **Notes** — browse/view/edit existing notes.
- **Lists** — browse/view/edit existing living lists.
- **Vocab** — browse/view/edit existing vocab entries.
- **Calendar** — month/year view with per-day activity indicators.

## Radial Quick-Capture Control ("the dot") Interaction Modes

The radial control features two distinct triggering mechanisms:

1. **Direct Click (Tap button directly)**:
   - Tapping **Notes** opens the **Notes section view** (`NotesView`).
   - Tapping **Lists** opens the **Lists section view** (`ListsView`).
   - Tapping **Vocab** opens the **Vocab section view** (`VocabView`).
   - Tapping **Calendar** opens the **Calendar section view** (`CalendarView`).

2. **Drag & Drop (Drag from center dot and release)**:
   - Dragging towards **Notes** and releasing creates a **new blank Note** immediately.
   - Dragging towards **Lists** and releasing creates a **new blank List** immediately.
   - Dragging towards **Vocab** and releasing creates a **new blank Vocab entry** immediately.
   - Dragging towards **Calendar** and releasing opens the **Calendar view**.

## Mobile Responsiveness & Touch Gestures

- **Single Mobile Viewport (`100dvh`)**: The Home screen fits completely within a single mobile screen height without requiring scrolling.
- **Mobile Touch Drag & Drop**: The radial quick-capture gesture supports native touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`, preventing mobile scroll conflicts while dragging.
