'use client';

import { Destination } from '@/types/destination';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Circle,
  Route,
  Share2,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface RouteStepperProps {
  destinations: Destination[];
  onNavigate: (dest: Destination) => void;
  onToggleVisited: (dest: Destination) => void;
  onSelect: (dest: Destination) => void;
}

export default function RouteStepper({
  destinations,
  onNavigate,
  onToggleVisited,
  onSelect,
}: RouteStepperProps) {
  const sorted = [...destinations].sort((a, b) => (a.stop_number || 0) - (b.stop_number || 0));

  // Find the first unvisited stop (current destination)
  const currentStopIndex = sorted.findIndex((d) => !d.visited);

  const handleShare = (d: Destination, e: React.MouseEvent) => {
    e.stopPropagation();
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}`;
    const text = encodeURIComponent(
      `🚩 *TripG Vadodara Tour - Stop #${d.stop_number}: ${d.name}*\n📍 ${d.location}\n🗺️ Google Maps: ${mapUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    toast.success('Sharing on WhatsApp!');
  };

  return (
    <div className="relative max-w-xl mx-auto px-2 py-4">
      {/* Route Timeline Track */}
      <div className="space-y-4">
        {sorted.map((item, index) => {
          const isCurrent = index === currentStopIndex;
          const isVisited = item.visited;
          const isLast = index === sorted.length - 1;

          return (
            <div key={item.id} className="relative flex items-start gap-3">
              {/* Stepper Node & Connecting Line */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                {/* Number Circle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleVisited(item)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 cursor-pointer z-10 ${
                    isVisited
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-pink-500 to-rose-500 border-white text-white shadow-[0_0_20px_rgba(255,46,147,0.7)] animate-pulse'
                      : 'bg-[#1a0f30] border-pink-500/30 text-pink-300'
                  }`}
                  title={isVisited ? 'Mark unvisited' : 'Mark visited'}
                >
                  {isVisited ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span>{item.stop_number}</span>
                  )}
                </motion.button>

                {/* Vertical Connecting Route Line */}
                {!isLast && (
                  <div
                    className={`w-1 flex-1 min-h-[70px] my-1 rounded-full transition-colors ${
                      isVisited
                        ? 'bg-gradient-to-b from-emerald-500 to-emerald-500/40'
                        : isCurrent
                        ? 'bg-gradient-to-b from-pink-500 to-pink-500/20'
                        : 'bg-white/10'
                    }`}
                  />
                )}
              </div>

              {/* Stepper Stop Card */}
              <motion.div
                whileTap={{ scale: 0.99 }}
                className={`flex-1 p-4 rounded-2xl border transition-all mb-2 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-[#25103a] to-[#160a28] border-pink-500 shadow-[0_0_25px_rgba(255,46,147,0.25)] ring-1 ring-pink-500/50'
                    : isVisited
                    ? 'bg-[#120b22]/70 border-emerald-500/30 opacity-80'
                    : 'bg-[#150c26]/90 border-pink-500/15'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="space-y-0.5">
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500 text-white shadow-[0_0_10px_rgba(255,46,147,0.6)] mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Current Target</span>
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white leading-snug">
                      {item.name}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => handleShare(item, e)}
                    className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors shrink-0"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Location & Distance */}
                <div className="flex items-center gap-1 text-xs text-neutral-300/90 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                {item.distance && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[11px] font-medium mb-3">
                    <Route className="w-3 h-3 text-pink-400" />
                    <span>{item.distance}</span>
                  </div>
                )}

                {/* Mobile Action Buttons Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate(item)}
                    className="flex-1 py-2.5 px-3 rounded-xl btn-3d-map flex items-center justify-center gap-2 text-xs font-bold text-white shadow-md cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate (GPS)</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleVisited(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isVisited
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/5 text-neutral-300 border-white/10 hover:border-pink-500/40'
                    }`}
                  >
                    {isVisited ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Mark Visited</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
