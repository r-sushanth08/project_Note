import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { NoteEntry } from '../types/entry';
import { Trash2 } from 'lucide-react';

interface NoteEditorViewProps {
  note: NoteEntry;
  onBack: () => void;
}

export const NoteEditorView: React.FC<NoteEditorViewProps> = ({ note, onBack }) => {
  const { updateEntry, deleteEntry } = useEntries();

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [tagsInput, setTagsInput] = useState((note.tags || []).join(', '));

  // Formatted creation timestamp per REQUIREMENTS.md
  const formattedTimestamp = new Date(note.createdAt).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    const updated: NoteEntry = {
      ...note,
      title: title || 'Untitled Note',
      content,
      tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    updateEntry(updated);
  }, [title, content, tagsInput]);

  const handleDelete = () => {
    deleteEntry(note.id);
    onBack();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-6">
      {/* Navigation & Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <span className="text-base font-semibold">‹</span>
          <span className="font-medium">All Notes</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink-muted">Auto-saved note</span>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Delete Note Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timestamp Above Note per REQUIREMENTS.md */}
      <div className="text-xs uppercase tracking-wider font-semibold text-sage-700 bg-sage-50 px-3 py-1.5 rounded-lg w-fit border border-sage-200">
        Created: {formattedTimestamp}
      </div>

      {/* Note Form */}
      <div className="flex flex-col gap-4">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full text-3xl font-serif font-medium bg-transparent border-b border-ink-border focus:border-sage-500 focus:outline-none pb-2 text-ink-primary placeholder:text-ink-muted"
        />

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Write your thoughts freely... (Supports # Headings and - Bullet lists)"
          className="w-full p-4 bg-white border border-ink-border rounded-2xl focus:outline-none focus:border-sage-500 text-ink-primary text-base leading-relaxed shadow-sm resize-y font-sans"
        />

        {/* Tags */}
        <div className="flex flex-col gap-2 pt-2 border-t border-ink-border">
          <label className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
            Tags (Optional)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="journal, reflection, ideas"
            className="w-full px-4 py-2.5 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
