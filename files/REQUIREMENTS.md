# REQUIREMENTS.md

Functionality agreed during discovery and iteration.

## Entry Types

### Note Sub-types
Notes support 3 specialized sub-types:

1. **Diary (Chronological Journal)**:
   - Chronological journal for recording experiences, events, and reflections
   - Prominent **Date, Day, and Timestamp** header (e.g. `CREATED: MON, 24 AUG 2026, 14:19`)
   - Title field + spacious freeform prose area

2. **Brain Dump (Fast Distraction-Free Capture)**:
   - Ultra-minimalist writing space for quickly capturing raw thoughts, ideas, reminders, and questions
   - Zero header friction, instant auto-save

3. **Collections (Structured Lists & Interests)**:
   - Structured way to collect and organize brands, artists, books, movies, people, places, topics, or personal interests
   - Title, Category selector (`Books`, `Movies`, `Artists`, `Places`, `Brands`, `Topics`, `Custom`), and structured Collection Items (each item has a name and optional notes/metadata)

### Interactive Tag Pill System
- Replaces plain CSV text tag input with **Tappable Tag Pill Buttons**
- Built-in default tags: `Work`, `Personal`, `Idea`, `Learning`, `Important`, `Reminder`, `People`, `Travel`, `Experience`, `Question`, `Favorite`, `Explore`
- Highlighted in vibrant orange when selected (`bg-orange-500 text-white`)
- Inline `+ Custom Tag` creator allows users to add custom tags that become reusable tag buttons for future notes

### List
- Title, plus an ordered set of checkable items
- Items can be manually reordered (move up/down or drag)
- Items can be appended indefinitely — no "done" or "closed" state

### Vocab
- Fixed fields: word, part of speech, meaning, synonyms, antonyms, example sentence(s)
- Entered manually by the user
- Flat collection in v1, contributes to Lexicon count on Home and to Vocab of the Day pool

## Home / Hero

- Opens to Home on every launch
- Displays **Lexicon Count** in a sleek, semi-transparent box (`words logged`)
- Displays **Vocab of the Day** with a **vibrant orange underline** (`border-b-2 border-orange-500`), followed by serif word title and white text definition over a dark rainy lantern background (`public/bg.jpg`)
- Hosts the radial quick-capture control positioned upper-center in a single mobile viewport (`100dvh`) without requiring page scrolling

## Navigation & Capture

- Floating radial control ("the dot") present on every screen
- 4 directions: Notes, Lists, Vocab, Calendar
- **Direct Click**: Opens section browsing view (`Notes`, `Lists`, `Vocab`, `Calendar`)
- **Drag & Drop**: Triggers fast entry creation immediately
- Mobile touch gesture support (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`

## Calendar

- Real month/year grid with passive activity indicators (colored dots for Note, List, Vocab)
- Expanded day view shows entry breakdown and provides direct view/edit access

## Deletion

- Simple and permanent deletion (no trash bin, no undo).
