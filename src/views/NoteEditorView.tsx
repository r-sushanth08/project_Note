import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry, NoteSubtype, CollectionItem } from '../types/entry';
import { TagPillSelector } from '../components/TagPillSelector';
import { Trash2, BookOpen, Lightbulb, FolderKanban, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface NoteEditorViewProps {
  note: NoteEntry;
  onBack: () => void;
}

const COLLECTION_CATEGORIES = ['Books', 'Movies', 'Artists', 'Places', 'Brands', 'Topics', 'General'];

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, onBack }) => {
  const { updateEntry, deleteEntry } = useEntries();

  const [noteSubtype, setNoteSubtype] = useState<NoteSubtype>(note.noteSubtype || 'diary');
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [category, setCategory] = useState(note.category || 'General');
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(
    note.collectionItems || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(note.tags || []);

  // Formatted prominent Timestamp for Diary
  const formattedTimestamp = new Date(note.createdAt).toLocaleString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).toUpperCase();

  useEffect(() => {
    const updated: NoteEntry = {
      ...note,
      noteSubtype,
      title: title || (noteSubtype === 'diary' ? 'Journal Entry' : noteSubtype === 'brain_dump' ? 'Brain Dump' : 'New Collection'),
      content,
      category: noteSubtype === 'collections' ? category : undefined,
      collectionItems: noteSubtype === 'collections' ? collectionItems : undefined,
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
    };
    updateEntry(updated);
  }, [noteSubtype, title, content, category, collectionItems, selectedTags]);

  const handleDelete = () => {
    deleteEntry(note.id);
    onBack();
  };

  // Collection Items Handlers
  const handleAddCollectionItem = () => {
    const newItem: CollectionItem = {
      id: `col-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      notes: '',
    };
    setCollectionItems([...collectionItems, newItem]);
  };

  const handleUpdateCollectionItem = (id: string, field: 'name' | 'notes', value: string) => {
    setCollectionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteCollectionItem = (id: string) => {
    setCollectionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveCollectionItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= collectionItems.length) return;

    const updated = [...collectionItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setCollectionItems(updated);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="text-base font-semibold">‹</span>
          <span className="font-medium">All Notes</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Auto-saved note</span>
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Delete Note Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-type Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setNoteSubtype('diary')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            noteSubtype === 'diary'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Diary</span>
        </button>

        <button
          type="button"
          onClick={() => setNoteSubtype('brain_dump')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            noteSubtype === 'brain_dump'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Brain Dump</span>
        </button>

        <button
          type="button"
          onClick={() => setNoteSubtype('collections')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            noteSubtype === 'collections'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Collections</span>
        </button>
      </div>

      {/* DYNAMIC EDITOR VIEW BASED ON SUBTYPE */}

      {/* 1. DIARY SUBTYPE */}
      {noteSubtype === 'diary' && (
        <div className="flex flex-col gap-4">
          {/* Prominent Timestamp Badge for Diary */}
          <div className="text-xs uppercase tracking-wider font-semibold text-orange-400 bg-slate-900/80 border border-orange-500/30 px-3 py-1.5 rounded-xl w-fit backdrop-blur-md shadow-sm">
            CREATED: {formattedTimestamp}
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Journal Title..."
            className="w-full text-3xl font-serif font-medium bg-transparent border-b border-white/20 focus:border-orange-400 focus:outline-none pb-2 text-white placeholder:text-slate-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write your chronological journal entry, experiences, reflections..."
            className="w-full p-4 bg-slate-900/80 border border-white/20 rounded-2xl focus:outline-none focus:border-orange-400 text-white text-base leading-relaxed shadow-sm resize-y font-sans"
          />
        </div>
      )}

      {/* 2. BRAIN DUMP SUBTYPE */}
      {noteSubtype === 'brain_dump' && (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic / Mindset Header..."
            className="w-full text-2xl font-serif font-medium bg-transparent border-b border-white/20 focus:border-orange-400 focus:outline-none pb-2 text-white placeholder:text-slate-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Dump your raw thoughts, ideas, questions, reminders, and anything on your mind..."
            className="w-full p-4 bg-slate-900/90 border border-white/20 rounded-2xl focus:outline-none focus:border-orange-400 text-white text-base leading-relaxed shadow-sm resize-y font-mono tracking-wide"
          />
        </div>
      )}

      {/* 3. COLLECTIONS SUBTYPE */}
      {noteSubtype === 'collections' && (
        <div className="flex flex-col gap-5">
          {/* Title & Category Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1 block">
                Collection Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Favorite Artists, Books to Read"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white font-serif text-lg shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm shadow-sm"
              >
                {COLLECTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Collection Description */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              placeholder="Brief description or intro for this collection..."
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm leading-relaxed shadow-sm resize-y"
            />
          </div>

          {/* Collection Items List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Collection Items ({collectionItems.length})
              </label>
              <button
                type="button"
                onClick={handleAddCollectionItem}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {collectionItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 italic bg-slate-900/60 rounded-xl border border-white/10">
                No items added yet. Click "+ Add Item" to collect your favorite things!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {collectionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/80 rounded-xl border border-white/15 flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateCollectionItem(item.id, 'name', e.target.value)}
                        placeholder="Item name (e.g. Artist, Book, Movie, Brand)"
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-white/20 rounded-lg text-sm text-white font-medium focus:outline-none focus:border-orange-400"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCollectionItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCollectionItem(index, 'down')}
                          disabled={index === collectionItems.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCollectionItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateCollectionItem(item.id, 'notes', e.target.value)}
                      rows={2}
                      placeholder="Notes, recommendations, or metadata..."
                      className="w-full px-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-orange-400 resize-y"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Tag Pill Selector */}
      <TagPillSelector
        selectedTags={selectedTags}
        onTagsChange={(newTags) => setSelectedTags(newTags)}
      />
    </div>
  );
};
