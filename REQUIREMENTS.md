# REQUIREMENTS.md

Functionality agreed during discovery and iteration.

## Entry Types

### Note
- Freeform text content with light structure support (headings, bullets)
- Required title
- Exact timestamp shown above the note (set at creation)
- Editable at any time; edits overwrite in place (no version history)

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
- Single-stage gesture: quick drag and release immediately creates new entry of that type or opens Calendar
- Mobile touch gesture support (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with `touch-action: none`

## Calendar

- Real month/year grid with passive activity indicators (colored dots for Note, List, Vocab)
- Expanded day view shows entry breakdown and provides direct view/edit access

## Deletion

- Simple and permanent deletion (no trash bin, no undo).
