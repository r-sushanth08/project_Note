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

      {/* Timestamp Above Note per REQUIREMENTS.md */}
      <div className="text-xs uppercase tracking-wider font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg w-fit">
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
          className="w-full text-3xl font-serif font-medium bg-transparent border-b border-white/20 focus:border-orange-400 focus:outline-none pb-2 text-white placeholder:text-slate-500"
        />

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder="Write your thoughts freely... (Supports # Headings and - Bullet lists)"
          className="w-full p-4 bg-slate-900/80 border border-white/20 rounded-2xl focus:outline-none focus:border-orange-400 text-white text-base leading-relaxed shadow-sm resize-y font-sans"
        />

        {/* Tags */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Tags (Optional)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="journal, reflection, ideas"
            className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-white text-sm shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
