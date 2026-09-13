'use client';

import { Destination } from '@/types/destination';
import {
  MapPin,
  Navigation,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Route,
  Landmark,
  Building2,
  Map,
  Sparkles,
  Milestone,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DestinationCardProps {
  destination: Destination;
  onEdit: (dest: Destination) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (dest: Destination) => void;
  onNavigate: (dest: Destination) => void;
}

const CATEGORY_MAP: Record<string, { label: string; Icon: any }> = {
  manjalpur: { label: 'Manjalpur', Icon: MapPin },
  'old-city': { label: 'Old City', Icon: Landmark },
  bajwada: { label: 'Bajwada', Icon: Building2 },
  navapura: { label: 'Navapura', Icon: Map },
  kishanwadi: { label: 'Kishanwadi', Icon: Sparkles },
  darshan: { label: 'Darshan', Icon: Milestone },
  other: { label: 'Vadodara', Icon: MapPin },
};

export default function DestinationCard({
  destination,
  onEdit,
  onDelete,
  onToggleVisited,
  onNavigate,
}: DestinationCardProps) {
  const {
    id,
    stop_number,
    name,
    location,
    distance,
    description,
    latitude,
    longitude,
    image_url,
    category,
    visited,
  } = destination;

  const catMeta = CATEGORY_MAP[category] || { label: 'Tour Stop', Icon: MapPin };
  const CategoryIcon = catMeta.Icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="card-3d flex flex-col group"
    >
      {/* 3D Image & Overlay Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-[#120b22]">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const placeholder = (e.target as HTMLElement).nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}

        {/* 3D Fallback Placeholder */}
        <div
          className="w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#271644_0%,#100820_100%)]"
          style={{ display: image_url ? 'none' : 'flex' }}
        >
          <div className="w-14 h-14 rounded-full bg-pink-500/15 border border-pink-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(255,46,147,0.35)] text-pink-400">
            <Compass className="w-7 h-7" />
          </div>
        </div>

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140b26] via-[#140b26]/30 to-transparent pointer-events-none" />

        {/* Stop Number Pill */}
        <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_4px_14px_rgba(255,46,147,0.5)] border border-white/20 tracking-wider">
          Stop #{stop_number || 1}
        </span>

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-md flex items-center gap-1.5 cat-badge-${category || 'other'}`}
        >
          <CategoryIcon className="w-3 h-3" />
          <span>{catMeta.label}</span>
        </span>

        {/* Visited Indicator */}
        {visited && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Visited</span>
          </span>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {name}
            </h3>

            {/* Quick Actions (Edit/Delete) */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(destination)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-pink-300 hover:text-white hover:bg-pink-500/20 transition-colors"
                title="Edit Stop"
                aria-label="Edit Stop"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                title="Delete Stop"
                aria-label="Delete Stop"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-pink-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Distance from previous stop */}
          {distance && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-semibold">
              <Route className="w-3 h-3 text-pink-400 shrink-0" />
              <span>{distance}</span>
            </div>
          )}

          {description && (
            <p className="text-xs text-neutral-300/80 line-clamp-2 leading-relaxed pt-1">
              {description}
            </p>
          )}
        </div>

        {/* Meta & Navigation Footer */}
        <div className="pt-2 space-y-3 border-t border-pink-500/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-neutral-400 bg-black/30 px-2 py-0.5 rounded border border-white/5">
              GPS: {latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°
            </span>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => onToggleVisited(destination)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                visited
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-white/5 text-neutral-300 border border-white/10 hover:border-pink-500/40'
              }`}
            >
              {visited ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Visited</span>
                </>
              ) : (
                <>
                  <Circle className="w-3.5 h-3.5" />
                  <span>To Visit</span>
                </>
              )}
            </motion.button>
          </div>

          {/* 3D Google Maps Direct Turn-by-Turn Navigation */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(destination)}
            className="btn-3d-map w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Navigate on Google Maps</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
