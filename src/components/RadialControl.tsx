import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil, ChevronUp, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { ViewMode } from '../types/entry';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar';

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isHolding, setIsHolding] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction>('notes');

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingHomeRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);

  // Calculate direction sector based on pointer coordinates relative to center of control
  const calculateDirectionFromCoords = (clientX: number, clientY: number): Direction => {
    if (!containerRef.current) return 'notes';
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // 4 Sectors:
    // Top (-135 to -45 deg) -> Notes
    // Right (-45 to 45 deg) -> Lists
    // Bottom (45 to 135 deg) -> Vocab
    // Left (135 to 180 or -180 to -135 deg) -> Calendar
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

  // --- HOME SCREEN DRAG & CLICK LOGIC ---
  const handleHomeStart = (clientX: number, clientY: number) => {
    touchStartPos.current = { x: clientX, y: clientY };
    isDraggingHomeRef.current = false;
  };

  const handleHomeMove = (clientX: number, clientY: number) => {
    if (!touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 15) {
      isDraggingHomeRef.current = true;
      const dir = calculateDirectionFromCoords(clientX, clientY);
      setActiveDirection(dir);
    }
  };

  const handleHomeEnd = () => {
    if (isDraggingHomeRef.current && activeDirection) {
      if (activeDirection === 'notes') openNewEntry('note');
      else if (activeDirection === 'lists') openNewEntry('list');
      else if (activeDirection === 'vocab') openNewEntry('vocab');
      else if (activeDirection === 'calendar') setCurrentView('calendar');
    }

    touchStartPos.current = null;
    isDraggingHomeRef.current = false;
  };

  // Direct Node Click Handler for Home Screen Navigation
  const handleNodeClick = (e: React.MouseEvent, view: ViewMode) => {
    e.stopPropagation();
    setCurrentView(view);
  };

  // --- NON-HOME HOLD & AIM NAVIGATION LOGIC ---
  const handleNonHomeHoldStart = (pointerId?: number) => {
    isPointerDownRef.current = true;
    setIsHolding(true);
    setActiveDirection('notes');

    if (containerRef.current && pointerId !== undefined && containerRef.current.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(pointerId);
      } catch (err) {
        // Fallback
      }
    }
  };

  const handleNonHomeHoldMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current) return;
    const dir = calculateDirectionFromCoords(clientX, clientY);
    setActiveDirection(dir);
  };

  const handleNonHomeHoldEnd = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsHolding(false);

    // Instantly navigate to active direction where red arrow was pointing
    if (activeDirection === 'notes') setCurrentView('notes');
    else if (activeDirection === 'lists') setCurrentView('lists');
    else if (activeDirection === 'vocab') setCurrentView('vocab');
    else if (activeDirection === 'calendar') setCurrentView('calendar');
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isHomeCentered) setIsHolding(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomeCentered]);

  const isMenuVisible = isHolding || isHomeCentered;

  return (
    <>
      {/* Background Overlay when holding on non-home screens */}
      {isHolding && !isHomeCentered && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-200" />
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
          className={`absolute inset-0 transition-all duration-250 ${
            isMenuVisible
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none invisible'
          }`}
        >
          {/* TOP: Notes (^ Up) */}
          <button
            onClick={(e) => isHomeCentered && handleNodeClick(e, 'notes')}
            disabled={!isMenuVisible}
            className={`pointer-events-auto absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'notes' ? 'scale-110' : 'opacity-70'
            }`}
            title="Notes"
          >
            {/* Red Chevron Arrow Pointer (^ Up on Non-Home) */}
            {!isHomeCentered && activeDirection === 'notes' && (
              <div className="absolute -top-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronUp className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                !isHomeCentered && activeDirection === 'notes'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                !isHomeCentered && activeDirection === 'notes'
                  ? 'text-red-400'
                  : 'text-slate-300 group-hover:text-white'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists (> Right) */}
          <button
            onClick={(e) => isHomeCentered && handleNodeClick(e, 'lists')}
            disabled={!isMenuVisible}
            className={`pointer-events-auto absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'lists' ? 'scale-110' : 'opacity-70'
            }`}
            title="Lists"
          >
            {/* Red Chevron Arrow Pointer (> Right on Non-Home) */}
            {!isHomeCentered && activeDirection === 'lists' && (
              <div className="absolute -right-6 top-3 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                !isHomeCentered && activeDirection === 'lists'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <List className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                !isHomeCentered && activeDirection === 'lists'
                  ? 'text-red-400'
                  : 'text-slate-300 group-hover:text-white'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab (v Down) */}
          <button
            onClick={(e) => isHomeCentered && handleNodeClick(e, 'vocab')}
            disabled={!isMenuVisible}
            className={`pointer-events-auto absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'vocab' ? 'scale-110' : 'opacity-70'
            }`}
            title="Vocab"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                !isHomeCentered && activeDirection === 'vocab'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                !isHomeCentered && activeDirection === 'vocab'
                  ? 'text-red-400'
                  : 'text-slate-300 group-hover:text-white'
              }`}
            >
              Vocab
            </span>

            {/* Red Chevron Arrow Pointer (v Down on Non-Home) */}
            {!isHomeCentered && activeDirection === 'vocab' && (
              <div className="absolute -bottom-6 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronDown className="w-6 h-6 stroke-[3]" />
              </div>
            )}
          </button>

          {/* LEFT: Calendar (< Left) */}
          <button
            onClick={(e) => isHomeCentered && handleNodeClick(e, 'calendar')}
            disabled={!isMenuVisible}
            className={`pointer-events-auto absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'calendar' ? 'scale-110' : 'opacity-70'
            }`}
            title="Calendar"
          >
            {/* Red Chevron Arrow Pointer (< Left on Non-Home) */}
            {!isHomeCentered && activeDirection === 'calendar' && (
              <div className="absolute -left-6 top-3 text-red-500 font-bold animate-bounce drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </div>
            )}

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                !isHomeCentered && activeDirection === 'calendar'
                  ? 'bg-red-500/25 text-red-300 border-red-500 shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900/90 text-white border-white/20 shadow-card backdrop-blur-md group-hover:border-orange-400'
              }`}
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                !isHomeCentered && activeDirection === 'calendar'
                  ? 'text-red-400'
                  : 'text-slate-300 group-hover:text-white'
              }`}
            >
              Calendar
            </span>
          </button>
        </div>

        {/* Center Pencil Dot Button */}
        {isHomeCentered ? (
          // Home Screen Center Control (Drag to create new entry)
          <div
            onPointerDown={(e) => handleHomeStart(e.clientX, e.clientY)}
            onPointerMove={(e) => handleHomeMove(e.clientX, e.clientY)}
            onPointerUp={handleHomeEnd}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleHomeStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleHomeMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleHomeEnd}
            className="relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float hover:bg-sage-600 active:scale-95 transition-all duration-200 group touch-none cursor-pointer"
            title="Quick Capture (Drag to Notes, Lists, Vocab, or Calendar)"
          >
            <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
          </div>
        ) : (
          // Non-Home Screen Center Control (Hold & Aim Navigation)
          <div
            onPointerDown={(e) => handleNonHomeHoldStart(e.pointerId)}
            onPointerMove={(e) => handleNonHomeHoldMove(e.clientX, e.clientY)}
            onPointerUp={handleNonHomeHoldEnd}
            onPointerCancel={handleNonHomeHoldEnd}
            onTouchStart={() => handleNonHomeHoldStart()}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleNonHomeHoldMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleNonHomeHoldEnd}
            onTouchCancel={handleNonHomeHoldEnd}
            className={`relative w-16 h-16 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-float active:scale-95 transition-all duration-200 group touch-none cursor-pointer ${
              isHolding ? 'ring-4 ring-red-500/50 scale-105 bg-red-500' : ''
            }`}
            title="Press & Hold to Aim Navigation"
          >
            <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
          </div>
        )}
      </div>
    </>
  );
};
