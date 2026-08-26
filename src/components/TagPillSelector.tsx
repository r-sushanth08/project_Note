import React, { useState } from 'react';
import { useEntries } from '../context/EntryContext';
import { Plus, Check, Tag as TagIcon } from 'lucide-react';

interface TagPillSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagPillSelector: React.FC<TagPillSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const { allTags, addCustomTag } = useEntries();
  const [isAdding, setIsAdding] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) return;

    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    addCustomTag(formatted);

    if (!selectedTags.includes(formatted)) {
      onTagsChange([...selectedTags, formatted]);
    }

    setNewTagInput('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider font-semibold text-slate-300 flex items-center gap-1.5">
          <TagIcon className="w-3.5 h-3.5 text-orange-400" />
          <span>Tags</span>
        </label>
        <span className="text-[11px] text-slate-400">
          {selectedTags.length} selected
        </span>
      </div>

      {/* Tag Pills Grid */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 flex items-center gap-1.5 select-none ${
                isSelected
                  ? 'bg-orange-500 text-white border border-orange-400 shadow-sm font-semibold scale-[1.02]'
                  : 'bg-slate-900/60 text-slate-300 border border-white/15 hover:border-white/30 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              <span>#{tag}</span>
            </button>
          );
        })}

        {/* Custom Tag Input / Button */}
        {isAdding ? (
          <form onSubmit={handleAddCustomTag} className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="New tag..."
              className="px-3 py-1 bg-slate-900 border border-orange-400 rounded-full text-xs text-white focus:outline-none w-28"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-semibold shadow-sm"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-200 px-1"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/40 text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-400 transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>Custom Tag</span>
          </button>
        )}
      </div>
    </div>
  );
};
