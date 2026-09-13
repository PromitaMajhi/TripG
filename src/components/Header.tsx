'use client';

import { Compass, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-glass-nav)] backdrop-blur-xl border-b border-pink-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 flex items-center justify-center shadow-[0_4px_18px_rgba(255,46,147,0.5)] border border-white/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            <Compass className="w-5 h-5 text-white" strokeWidth={2.4} />
          </motion.div>

          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent leading-tight">
              TripG
            </span>
            <span className="text-[10px] font-bold tracking-widest text-pink-400 uppercase">
              Vadodara Tour
            </span>
          </div>
        </a>

        {/* Add Stop Trigger */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onAddClick}
            className="btn-3d-pink flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-md cursor-pointer"
            aria-label="Add Destination"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Add Stop</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
