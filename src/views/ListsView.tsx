import React from 'react';
import { useEntries } from '../context/EntryContext';
import { ListEntry } from '../types/entry';
import { CheckSquare } from 'lucide-react';

export const ListsView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry } = useEntries();

  const listsArray = entries.filter((e): e is ListEntry => e.type === 'list');

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-44 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-orange-400 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-white">Lists</h1>
      </div>

      {/* Lists Grid */}
      {listsArray.length === 0 ? (
        <div className="text-center py-16 text-slate-400 italic bg-slate-900/60 rounded-2xl border border-white/15 backdrop-blur-md">
          No living lists created yet. Drag the pencil dot below to start a list!
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
                className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-card hover:border-orange-400/60 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-medium text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                      {list.title || 'Untitled List'}
                    </h3>
                    <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      {checkedCount}/{totalCount} items
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-col gap-2">
                    {list.items.slice(0, 4).map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckSquare
                          className={`w-4 h-4 ${
                            item.checked ? 'text-orange-400 fill-orange-400/20' : 'text-slate-500'
                          }`}
                        />
                        <span className={item.checked ? 'line-through text-slate-500' : ''}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                    {list.items.length > 4 && (
                      <li className="text-xs text-slate-400 italic pl-6">
                        + {list.items.length - 4} more items...
                      </li>
                    )}
                  </ul>
                </div>

                {list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {list.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full"
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
    </div>
  );
};
