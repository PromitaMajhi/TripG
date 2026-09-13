'use client';

import { Compass, CheckCircle2, Clock, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddClick: () => void;
  onSearchFocus: () => void;
}

export default function BottomNav({
  activeFilter,
  onFilterChange,
  onAddClick,
  onSearchFocus,
}: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-glass-nav)] backdrop-blur-2xl border-t border-pink-500/20 px-4 py-2 flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.7),0_0_20px_rgba(255,46,147,0.15)] md:hidden"
      style={{ paddingBottom: 'calc(0.5rem + var(--safe-bottom))' }}
      aria-label="Mobile Navigation"
    >
      {/* All Stops */}
      <button
        onClick={() => onFilterChange('all')}
        className={`flex flex-col items-center justify-center p-1 text-xs font-semibold gap-1 transition-colors ${
          activeFilter === 'all'
            ? 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(255,46,147,0.8)]'
            : 'text-neutral-400'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Stops</span>
      </button>

      {/* Visited */}
      <button
        onClick={() => onFilterChange('visited')}
        className={`flex flex-col items-center justify-center p-1 text-xs font-semibold gap-1 transition-colors ${
          activeFilter === 'visited'
            ? 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(255,46,147,0.8)]'
            : 'text-neutral-400'
        }`}
      >
        <CheckCircle2 className="w-5 h-5" />
        <span>Visited</span>
      </button>

      {/* Floating 3D Center Add Button */}
      <motion.button
        whileTap={{ scale: 0.9, y: 2 }}
        onClick={onAddClick}
        className="w-13 h-13 rounded-full btn-3d-pink flex items-center justify-center text-white shadow-[0_8px_24px_rgba(255,46,147,0.7)] -mt-6 border-2 border-white/30 cursor-pointer"
        aria-label="Add Tour Destination"
        title="Add Stop"
      >
        <Plus className="w-7 h-7" strokeWidth={2.8} />
      </motion.button>

      {/* To Visit */}
      <button
        onClick={() => onFilterChange('pending')}
        className={`flex flex-col items-center justify-center p-1 text-xs font-semibold gap-1 transition-colors ${
          activeFilter === 'pending'
            ? 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(255,46,147,0.8)]'
            : 'text-neutral-400'
        }`}
      >
        <Clock className="w-5 h-5" />
        <span>To Visit</span>
      </button>

      {/* Search */}
      <button
        onClick={onSearchFocus}
        className="flex flex-col items-center justify-center p-1 text-xs font-semibold gap-1 text-neutral-400 transition-colors"
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>
    </nav>
  );
}
