import React from 'react';
import { useEntries } from '../context/EntryContext';
import { ListEntry } from '../types/entry';
import { Plus, CheckSquare } from 'lucide-react';

export const ListsView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry, openNewEntry } = useEntries();

  const listsArray = entries.filter((e): e is ListEntry => e.type === 'list');

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink-border pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-ink-border text-ink-secondary hover:text-ink-primary hover:border-sage-500 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-ink-primary">Lists</h1>
      </div>

      {/* Lists Grid */}
      {listsArray.length === 0 ? (
        <div className="text-center py-16 text-ink-muted italic bg-white rounded-2xl border border-ink-border">
          No living lists created yet. Click the + button below to start a list!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listsArray.map((list) => {
            const checkedCount = list.items.filter((i) => i.checked).length;
            const totalCount = list.items.length;

            return (
              <div
                key={list.id}
                onClick={() => setSelectedEntry(list)}
                className="bg-white rounded-2xl p-6 border border-ink-border shadow-card hover:shadow-float transition-all cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-medium text-ink-primary group-hover:text-sage-700 transition-colors line-clamp-1">
                      {list.title || 'Untitled List'}
                    </h3>
                    <span className="text-xs font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                      {checkedCount}/{totalCount} items
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-col gap-2">
                    {list.items.slice(0, 4).map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-ink-secondary">
                        <CheckSquare
                          className={`w-4 h-4 ${
                            item.checked ? 'text-sage-500 fill-sage-100' : 'text-ink-muted'
                          }`}
                        />
                        <span className={item.checked ? 'line-through text-ink-muted' : ''}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                    {list.items.length > 4 && (
                      <li className="text-xs text-ink-muted italic pl-6">
                        + {list.items.length - 4} more items...
                      </li>
                    )}
                  </ul>
                </div>

                {list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink-border">
                    {list.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <button
          onClick={() => openNewEntry('list')}
          className="w-14 h-14 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all"
          title="New List"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
