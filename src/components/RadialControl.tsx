import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { ViewMode } from '../types/entry';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar' | null;

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isOpen, setIsOpen] = useState(isHomeCentered);
  const [activeDirection, setActiveDirection] = useState<Direction>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const wasDraggedRef = useRef<boolean>(false);

  // Calculate direction sector from coordinates relative to center of control
  const calculateDirectionFromCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 25) {
      return null;
    }

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    if (angleDeg >= -135 && angleDeg < -45) {
      return 'notes';
    } else if (angleDeg >= -45 && angleDeg < 45) {
      return 'lists';
    } else if (angleDeg >= 45 && angleDeg < 135) {
      return 'vocab';
    } else {
      return 'calendar';
    }
  };

  const handleStart = (clientX: number, clientY: number) => {
    touchStartPos.current = { x: clientX, y: clientY };
    wasDraggedRef.current = false;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 15) {
      wasDraggedRef.current = true;
      if (!isOpen) setIsOpen(true);
      const dir = calculateDirectionFromCoords(clientX, clientY);
      setActiveDirection(dir);
    }
  };

  const handleEnd = () => {
    if (wasDraggedRef.current && activeDirection) {
      // Drag action -> Create New Entry
      if (activeDirection === 'notes') openNewEntry('note');
      else if (activeDirection === 'lists') openNewEntry('list');
      else if (activeDirection === 'vocab') openNewEntry('vocab');
      else if (activeDirection === 'calendar') setCurrentView('calendar');

      if (!isHomeCentered) setIsOpen(false);
    }

    // Reset drag tracking state after short delay to allow click handler check
    setTimeout(() => {
      touchStartPos.current = null;
      wasDraggedRef.current = false;
      setActiveDirection(null);
    }, 50);
  };

  const handleCenterButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only toggle open/close if the user tapped/clicked without dragging
    if (!wasDraggedRef.current && !isHomeCentered) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleNodeClick = (e: React.MouseEvent, view: ViewMode) => {
    e.stopPropagation();
    if (!isHomeCentered) setIsOpen(false);
    setActiveDirection(null);
    setCurrentView(view);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isHomeCentered) setIsOpen(false);
        setActiveDirection(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomeCentered]);

  return (
    <>
      {/* Background Overlay when expanded */}
      {isOpen && !isHomeCentered && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Control Container */}
      <div
        ref={containerRef}
        className={`z-50 select-none touch-none ${
          isHomeCentered
            ? 'relative flex justify-center items-center'
            : 'fixed bottom-28 left-1/2 -translate-x-1/2 flex justify-center items-center'
        }`}
      >
        {/* Radial Nodes Options */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
            isOpen || isHomeCentered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          {/* TOP: Notes */}
          <button
            onClick={(e) => handleNodeClick(e, 'notes')}
            className={`pointer-events-auto absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'notes' ? 'scale-110' : ''
            }`}
            title="Click to browse Notes"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'notes'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'notes' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists */}
          <button
            onClick={(e) => handleNodeClick(e, 'lists')}
            className={`pointer-events-auto absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'lists' ? 'scale-110' : ''
            }`}
            title="Click to browse Lists"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'lists'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <List className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'lists' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab */}
          <button
            onClick={(e) => handleNodeClick(e, 'vocab')}
            className={`pointer-events-auto absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'vocab' ? 'scale-110' : ''
            }`}
            title="Click to browse Vocab"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'vocab'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'vocab' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Vocab
            </span>
          </button>

          {/* LEFT: Calendar */}
          <button
            onClick={(e) => handleNodeClick(e, 'calendar')}
            className={`pointer-events-auto absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center gap-1 group transition-transform duration-150 ${
              activeDirection === 'calendar' ? 'scale-110' : ''
            }`}
            title="Click to view Calendar"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'calendar'
                  ? 'bg-orange-500 text-white border-orange-400 shadow-lg'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-medium tracking-wide transition-colors ${
                activeDirection === 'calendar' ? 'text-orange-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Calendar
            </span>
          </button>
        </div>

        {/* Center Pencil Dot Button */}
        <button
          onClick={handleCenterButtonClick}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handleEnd}
          className={`relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all duration-200 group touch-none ${
            isOpen ? 'ring-4 ring-orange-400/40 scale-105 bg-orange-500' : ''
          }`}
          title="Click to toggle menu / Drag to create new entry"
        >
          <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
};
