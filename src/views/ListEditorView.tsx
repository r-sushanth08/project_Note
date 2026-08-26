import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { ListEntry, ListItem } from '../types/entry';
import { TagPillSelector } from '../components/TagPillSelector';
import { Trash2, Plus, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

interface ListEditorViewProps {
  list: ListEntry;
  onBack: () => void;
}

export const ListEditorView: React.FC<ListEditorViewProps> = ({ list, onBack }) => {
  const { updateEntry, deleteEntry } = useEntries();

  const [title, setTitle] = useState(list.title || '');
  const [items, setItems] = useState<ListItem[]>(list.items || []);
  const [newItemText, setNewItemText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(list.tags || []);

  useEffect(() => {
    const updated: ListEntry = {
      ...list,
      title: title || 'Untitled List',
      items,
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
    };
    updateEntry(updated);
  }, [title, items, selectedTags]);

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ListItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: newItemText.trim(),
      checked: false,
      order: items.length,
    };

    setItems([...items, newItem]);
    setNewItemText('');
  };

  const handleToggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    setItems(newItems.map((item, idx) => ({ ...item, order: idx })));
  };

  const handleDeleteList = () => {
    deleteEntry(list.id);
    onBack();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-44 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar">
      {/* Navigation & Controls */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <span className="text-base font-semibold">‹</span>
          <span className="font-medium">All Lists</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Ongoing living list</span>
          <button
            onClick={handleDeleteList}
            className="text-red-400 hover:text-red-300 transition-colors p-1"
            title="Delete List Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="List Title"
        className="w-full text-3xl font-serif font-medium bg-transparent border-b border-white/20 focus:border-orange-400 focus:outline-none pb-2 text-white placeholder:text-slate-500 flex-shrink-0"
      />

      {/* Items Section */}
      <div className="flex flex-col gap-3">
        {/* List Items */}
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-sm hover:border-orange-400/50 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 text-slate-500 cursor-grab opacity-60 group-hover:opacity-100" />

                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleCheck(item.id)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 border-white/20 cursor-pointer accent-orange-500"
                />

                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setItems((prev) =>
                      prev.map((i) => (i.id === item.id ? { ...i, text: newText } : i))
                    );
                  }}
                  className={`flex-1 bg-transparent border-none focus:outline-none text-sm text-white ${
                    item.checked ? 'line-through text-slate-500' : ''
                  }`}
                />
              </div>

              {/* Action Buttons: Reorder & Delete */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-slate-400 hover:text-red-400"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Append New Item Input */}
        <form onSubmit={handleAddItem} className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 px-4 py-3 bg-slate-900/80 border border-white/20 rounded-xl focus:outline-none focus:border-orange-400 text-sm text-white shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium flex items-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Interactive Tag Pill Selector */}
      <TagPillSelector
        selectedTags={selectedTags}
        onTagsChange={(newTags) => setSelectedTags(newTags)}
      />
    </div>
  );
};
