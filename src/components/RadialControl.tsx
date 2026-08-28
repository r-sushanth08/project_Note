import React, { useState, useRef, useEffect } from 'react';
import { FileText, List, BookOpen, Calendar, Pencil, Plus, ChevronUp, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { ViewMode } from '../types/entry';

interface RadialControlProps {
  isHomeCentered?: boolean;
}

type Direction = 'notes' | 'lists' | 'vocab' | 'calendar' | null;

export const RadialControl: React.FC<RadialControlProps> = ({ isHomeCentered = false }) => {
  const { openNewEntry, setCurrentView } = useEntries();
  const [isHoldingNav, setIsHoldingNav] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [activeDirection, setActiveDirection] = useState<Direction>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);

  // Calculate direction sector based on pointer coordinates relative to center of control
  const calculateDirectionFromCoords = (clientX: number, clientY: number): Direction => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Dead zone check (< 12px from center)
    if (distance < 12) {
      return null;
    }

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
    hasDraggedRef.current = false;
  };

  const handleHomeMove = (clientX: number, clientY: number) => {
    if (!touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 12) {
      hasDraggedRef.current = true;
      const dir = calculateDirectionFromCoords(clientX, clientY);
      setActiveDirection(dir);
    }
  };

  const handleHomeEnd = () => {
    if (hasDraggedRef.current && activeDirection) {
      if (activeDirection === 'notes') openNewEntry('note');
      else if (activeDirection === 'lists') openNewEntry('list');
      else if (activeDirection === 'vocab') openNewEntry('vocab');
      else if (activeDirection === 'calendar') setCurrentView('calendar');
    }

    touchStartPos.current = null;
    hasDraggedRef.current = false;
    setActiveDirection(null);
  };

  // Direct Node Click Handler for Home Screen Navigation
  const handleHomeNodeClick = (e: React.MouseEvent, view: ViewMode) => {
    e.stopPropagation();
    setCurrentView(view);
  };

  // --- NON-HOME DUAL-MODE GESTURE LOGIC ---
  const handleNonHomeStart = (clientX: number, clientY: number, pointerId?: number) => {
    isPointerDownRef.current = true;
    pressStartTimeRef.current = Date.now();
    touchStartPos.current = { x: clientX, y: clientY };
    hasDraggedRef.current = false;

    // Instant Navigation Pop on Hold Down!
    if (!isQuickCreateOpen) {
      setIsHoldingNav(true);
      setActiveDirection(null);
    }

    if (containerRef.current && pointerId !== undefined && containerRef.current.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(pointerId);
      } catch (err) {
        // Fallback
      }
    }
  };

  const handleNonHomeMove = (clientX: number, clientY: number) => {
    if (!isPointerDownRef.current || !touchStartPos.current) return;
    const deltaX = clientX - touchStartPos.current.x;
    const deltaY = clientY - touchStartPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 12) {
      hasDraggedRef.current = true;
      if (isQuickCreateOpen) setIsQuickCreateOpen(false);
      setIsHoldingNav(true);

      const dir = calculateDirectionFromCoords(clientX, clientY);
      setActiveDirection(dir);
    }
  };

  const handleNonHomeEnd = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    const duration = Date.now() - pressStartTimeRef.current;

    if (!hasDraggedRef.current && duration < 250) {
      // QUICK TAP -> Toggle Entry Creation Mode (Rewinds back to pencil if already open!)
      setIsQuickCreateOpen((prev) => !prev);
      setIsHoldingNav(false);
      setActiveDirection(null);
    } else if (hasDraggedRef.current && isHoldingNav) {
      // HOLD & SWIPE DRAG -> Perform Navigation!
      setIsHoldingNav(false);
      if (activeDirection === 'notes') setCurrentView('notes');
      else if (activeDirection === 'lists') setCurrentView('lists');
      else if (activeDirection === 'vocab') setCurrentView('vocab');
      else if (activeDirection === 'calendar') setCurrentView('calendar');
      setActiveDirection(null);
    } else {
      setIsHoldingNav(false);
      setActiveDirection(null);
    }

    touchStartPos.current = null;
    hasDraggedRef.current = false;
  };

  // Quick Create Node Click Handler
  const handleQuickCreateClick = (e: React.MouseEvent, type: 'note' | 'list' | 'vocab') => {
    e.stopPropagation();
    setIsQuickCreateOpen(false);
    openNewEntry(type);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isHomeCentered) {
          setIsHoldingNav(false);
          setIsQuickCreateOpen(false);
          setActiveDirection(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHomeCentered]);

  const isNavVisible = isHoldingNav;
  const isCreateVisible = isQuickCreateOpen && !isHomeCentered;

  return (
    <>
      {/* Background Overlay when Quick Create or Navigation active */}
      {(isHoldingNav || isQuickCreateOpen) && !isHomeCentered && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-200"
          onClick={() => {
            setIsHoldingNav(false);
            setIsQuickCreateOpen(false);
          }}
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
        {/* --- 1. QUICK CREATE NODES (Expanded on Quick Tap with Generous Spacing) --- */}
        {isCreateVisible && (
          <div className="absolute inset-0 z-50 pointer-events-auto">
            {/* TOP: + Note */}
            <button
              onClick={(e) => handleQuickCreateClick(e, 'note')}
              className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer animate-scale-in"
              title="Create New Note"
            >
              <div className="w-13 h-13 rounded-full flex items-center justify-center bg-emerald-500 text-white border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-emerald-300 tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
                + Note
              </span>
            </button>

            {/* RIGHT: + List */}
            <button
              onClick={(e) => handleQuickCreateClick(e, 'list')}
              className="absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center gap-1.5 group cursor-pointer animate-scale-in"
              title="Create New List"
            >
              <div className="w-13 h-13 rounded-full flex items-center justify-center bg-amber-500 text-white border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-110 transition-transform">
                <List className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-amber-300 tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border border-amber-500/40 shadow-sm">
                + List
              </span>
            </button>

            {/* LEFT: + Vocab */}
            <button
              onClick={(e) => handleQuickCreateClick(e, 'vocab')}
              className="absolute top-1/2 -left-24 -translate-y-1/2 flex flex-col items-center gap-1.5 group cursor-pointer animate-scale-in"
              title="Add Vocabulary Card"
            >
              <div className="w-13 h-13 rounded-full flex items-center justify-center bg-indigo-500 text-white border border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-indigo-300 tracking-wide bg-slate-900/95 px-2.5 py-0.5 rounded-full border border-indigo-500/40 shadow-sm">
                + Vocab
              </span>
            </button>
          </div>
        )}

        {/* --- 2. VIBRANT COLORED NAVIGATION NODES (Expanded on Hold) --- */}
        <div
          className={`absolute inset-0 transition-all duration-250 ${
            isNavVisible || isHomeCentered
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none invisible'
          }`}
        >
          {/* TOP: Notes (Emerald Green) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'notes')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'notes' ? 'scale-115 z-10' : 'opacity-85'
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
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'notes'
                  ? 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.8)] ring-2 ring-emerald-400'
                  : 'bg-emerald-500/85 text-white border-emerald-400/60 shadow-[0_0_14px_rgba(16,185,129,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <FileText className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'notes' ? 'text-emerald-300 font-bold' : 'text-slate-200'
              }`}
            >
              Notes
            </span>
          </button>

          {/* RIGHT: Lists (Amber Yellow) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'lists')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'lists' ? 'scale-115 z-10' : 'opacity-85'
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
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'lists'
                  ? 'bg-amber-500 text-white border-amber-300 shadow-[0_0_22px_rgba(245,158,11,0.8)] ring-2 ring-amber-400'
                  : 'bg-amber-500/85 text-white border-amber-400/60 shadow-[0_0_14px_rgba(245,158,11,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <List className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'lists' ? 'text-amber-300 font-bold' : 'text-slate-200'
              }`}
            >
              Lists
            </span>
          </button>

          {/* BOTTOM: Vocab (Purple / Indigo) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'vocab')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'vocab' ? 'scale-115 z-10' : 'opacity-85'
            }`}
            title="Vocab"
          >
            <div
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'vocab'
                  ? 'bg-indigo-500 text-white border-indigo-300 shadow-[0_0_22px_rgba(99,102,241,0.8)] ring-2 ring-indigo-400'
                  : 'bg-indigo-500/85 text-white border-indigo-400/60 shadow-[0_0_14px_rgba(99,102,241,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <BookOpen className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'vocab' ? 'text-indigo-300 font-bold' : 'text-slate-200'
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

          {/* LEFT: Calendar (Orange Accent) */}
          <button
            onClick={(e) => isHomeCentered && handleHomeNodeClick(e, 'calendar')}
            disabled={!isNavVisible && !isHomeCentered}
            className={`pointer-events-auto absolute top-1/2 -left-24 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 group cursor-pointer ${
              activeDirection === 'calendar' ? 'scale-115 z-10' : 'opacity-85'
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
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                activeDirection === 'calendar'
                  ? 'bg-orange-500 text-white border-orange-300 shadow-[0_0_22px_rgba(249,115,22,0.8)] ring-2 ring-orange-400'
                  : 'bg-orange-500/85 text-white border-orange-400/60 shadow-[0_0_14px_rgba(249,115,22,0.4)] backdrop-blur-md group-hover:scale-105'
              }`}
            >
              <Calendar className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                activeDirection === 'calendar' ? 'text-orange-300 font-bold' : 'text-slate-200'
              }`}
            >
              Calendar
            </span>
          </button>
        </div>

        {/* --- CENTER BUTTON --- */}
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
          // Non-Home Screen Dual-Mode Center Control
          <div
            onPointerDown={(e) => handleNonHomeStart(e.clientX, e.clientY, e.pointerId)}
            onPointerMove={(e) => handleNonHomeMove(e.clientX, e.clientY)}
            onPointerUp={handleNonHomeEnd}
            onPointerCancel={handleNonHomeEnd}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleNonHomeStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleNonHomeMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handleNonHomeEnd}
            onTouchCancel={handleNonHomeEnd}
            className={`relative w-16 h-16 rounded-full text-white flex items-center justify-center shadow-float active:scale-95 transition-all duration-300 group touch-none cursor-pointer ${
              isQuickCreateOpen
                ? 'bg-orange-500 ring-4 ring-orange-400/50 scale-105 rotate-90'
                : isHoldingNav
                ? 'bg-red-500 ring-4 ring-red-500/50 scale-105'
                : 'bg-sage-500 hover:bg-sage-600'
            }`}
            title="Quick Tap to Add Entry / Hold & Swipe to Navigate"
          >
            {isQuickCreateOpen ? (
              <Plus className="w-7 h-7 stroke-[2.5] transition-transform" />
            ) : (
              <Pencil className="w-6 h-6 stroke-[2] transition-transform group-hover:rotate-12" />
            )}
          </div>
        )}
      </div>
    </>
  );
};
