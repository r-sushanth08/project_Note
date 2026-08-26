import React, { useState } from 'react';
import { useEntries } from '../context/EntryContext';
import { Entry } from '../types/entry';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { entries, setCurrentView, setSelectedEntry } = useEntries();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayISO, setSelectedDayISO] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const entriesByDate = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
    const dateKey = new Date(entry.createdAt).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDayEntries = selectedDayISO ? entriesByDate[selectedDayISO] || [] : [];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-2 pb-24 flex flex-col gap-8">
      {/* Subheader */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-orange-400 transition-all shadow-sm"
        >
          ‹
        </button>
        <h1 className="text-3xl font-serif font-medium text-white">Calendar</h1>
      </div>

      {/* Calendar Month Navigation Header */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-card flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-semibold text-white">
            {monthNames[month]} {year}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors border border-orange-500/20"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-14 rounded-xl" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateObj = new Date(year, month, dayNum);
            const isoKey = dateObj.toISOString().split('T')[0];
            const dayEntries = entriesByDate[isoKey] || [];
            const isSelected = selectedDayISO === isoKey;
            const isToday = new Date().toISOString().split('T')[0] === isoKey;

            const hasNote = dayEntries.some((e) => e.type === 'note');
            const hasList = dayEntries.some((e) => e.type === 'list');
            const hasVocab = dayEntries.some((e) => e.type === 'vocab');

            return (
              <button
                key={`day-${dayNum}`}
                onClick={() => setSelectedDayISO(isoKey)}
                className={`h-14 rounded-xl p-2 flex flex-col justify-between items-center transition-all relative border ${
                  isSelected
                    ? 'border-orange-400 bg-orange-500/10 shadow-sm'
                    : 'border-transparent hover:bg-slate-800/50'
                }`}
              >
                <span
                  className={`text-sm ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold'
                      : isSelected
                      ? 'text-orange-300 font-semibold'
                      : 'text-white'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Passive Indicators */}
                <div className="flex items-center justify-center gap-1 h-2">
                  {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Note" />}
                  {hasList && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="List" />}
                  {hasVocab && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" title="Vocab" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Day Details Section */}
      {selectedDayISO && (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/15 shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-serif font-medium text-white">
              Entries for {new Date(selectedDayISO + 'T00:00:00').toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>

            {/* Legend Indicators */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Note
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> List
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Vocab
              </span>
            </div>
          </div>

          {selectedDayEntries.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400 italic">
              No entries recorded on this day.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedDayEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry);
                    if (entry.type === 'note') setCurrentView('notes');
                    else if (entry.type === 'list') setCurrentView('lists');
                    else if (entry.type === 'vocab') setCurrentView('vocab');
                  }}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/15 bg-slate-900/60 hover:border-orange-400/60 hover:bg-slate-900/90 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {entry.type === 'note' && (
                      <span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0" />
                    )}
                    {entry.type === 'list' && (
                      <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                    )}
                    {entry.type === 'vocab' && (
                      <span className="w-3 h-3 rounded-full bg-indigo-400 flex-shrink-0" />
                    )}

                    <div className="flex flex-col">
                      <span className="text-base font-serif font-medium text-white group-hover:text-orange-300 transition-colors">
                        {entry.title || (entry.type === 'vocab' ? (entry as any).word : 'Untitled')}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        {entry.type} · {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open ›
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
