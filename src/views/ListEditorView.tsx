import React, { useState, useEffect } from 'react';
import { useEntries } from '../context/EntryContext';
import { ListEntry, ListItem } from '../types/entry';
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
  const [tagsInput, setTagsInput] = useState((list.tags || []).join(', '));

  useEffect(() => {
    const updated: ListEntry = {
      ...list,
      title: title || 'Untitled List',
      items,
      tags: tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    updateEntry(updated);
  }, [title, items, tagsInput]);

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
    <div className="w-full max-w-3xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-6">
      {/* Navigation & Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <span className="text-base font-semibold">‹</span>
          <span className="font-medium">All Lists</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-ink-muted">Ongoing living list</span>
          <button
            onClick={handleDeleteList}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
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
        className="w-full text-3xl font-serif font-medium bg-transparent border-b border-ink-border focus:border-sage-500 focus:outline-none pb-2 text-ink-primary placeholder:text-ink-muted"
      />

      {/* Items Section */}
      <div className="flex flex-col gap-3">
        {/* List Items */}
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-ink-border shadow-sm hover:border-sage-200 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 text-ink-muted cursor-grab opacity-50 group-hover:opacity-100" />
                
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleCheck(item.id)}
                  className="w-4 h-4 rounded text-sage-600 focus:ring-sage-500 border-ink-border cursor-pointer accent-sage-600"
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
                  className={`flex-1 bg-transparent border-none focus:outline-none text-sm text-ink-primary ${
                    item.checked ? 'line-through text-ink-muted' : ''
                  }`}
                />
              </div>

              {/* Action Buttons: Reorder & Delete */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-ink-muted hover:text-ink-primary disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 text-ink-muted hover:text-ink-primary disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-ink-muted hover:text-red-500"
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
            className="flex-1 px-4 py-3 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-sm text-ink-primary shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-sm font-medium flex items-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Tags Input */}
      <div className="flex flex-col gap-2 pt-4 border-t border-ink-border">
        <label className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
          Tags (Optional)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="books, reading, goals"
          className="w-full px-4 py-2.5 bg-white border border-ink-border rounded-xl focus:outline-none focus:border-sage-500 text-ink-primary text-sm shadow-sm"
        />
      </div>
    </div>
  );
};
