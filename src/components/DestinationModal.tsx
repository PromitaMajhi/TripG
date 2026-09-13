'use client';

import { useState, useEffect } from 'react';
import { Destination, CreateDestinationInput } from '@/types/destination';
import { X, MapPin, Crosshair, Loader2, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Destination>) => Promise<void>;
  editingItem: Destination | null;
}

const CATEGORIES = [
  { value: 'manjalpur', label: 'Manjalpur Side' },
  { value: 'old-city', label: 'Old City (Mangal / Nava Bazar)' },
  { value: 'bajwada', label: 'Bajwada Side' },
  { value: 'navapura', label: 'Navapura Side' },
  { value: 'kishanwadi', label: 'Kishanwadi Side' },
  { value: 'darshan', label: 'Ganesh Darshan' },
  { value: 'other', label: 'Other Vadodara Location' },
];

const DEFAULT_FORM: Partial<Destination> = {
  stop_number: 1,
  name: '',
  location: '',
  distance: '',
  description: '',
  latitude: 22.3008,
  longitude: 73.2045,
  image_url: '',
  category: 'manjalpur',
  visited: false,
};

export default function DestinationModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: DestinationModalProps) {
  const [form, setForm] = useState<Partial<Destination>>(DEFAULT_FORM);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setForm(editingItem);
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name?.trim()) errs.name = 'Destination name is required';
    if (!form.location?.trim()) errs.location = 'Location / Area is required';
    if (form.latitude === undefined || isNaN(Number(form.latitude))) {
      errs.latitude = 'Valid latitude is required (-90 to 90)';
    }
    if (form.longitude === undefined || isNaN(Number(form.longitude))) {
      errs.longitude = 'Valid longitude is required (-180 to 180)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        }));
        setGettingLocation(false);
      },
      () => {
        alert('Could not retrieve device GPS. Please check location permissions.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        stop_number: Number(form.stop_number) || 1,
        latitude: parseFloat(String(form.latitude)),
        longitude: parseFloat(String(form.longitude)),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const isEditing = Boolean(editingItem);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-lg bg-[#150d2a] border border-pink-500/25 sm:rounded-3xl rounded-t-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(255,46,147,0.3)] max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 bg-pink-500/40 rounded-full mx-auto my-2.5 sm:hidden" />

          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-pink-500/15 flex items-center justify-between">
            <h2 className="text-lg font-bold bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span>{isEditing ? 'Edit Tour Destination' : 'Add Tour Destination'}</span>
            </h2>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stop Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Tour Stop #
                </label>
                <input
                  type="number"
                  name="stop_number"
                  min="1"
                  max="99"
                  value={form.stop_number || 1}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Zone / Area
                </label>
                <select
                  name="category"
                  value={form.category || 'manjalpur'}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#120b22]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Destination Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Manjalpur Na Raja"
                  value={form.name || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
                {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* Location */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Location / Area *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Manjalpur, Vadodara"
                  value={form.location || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
                {errors.location && <p className="text-xs text-rose-400">{errors.location}</p>}
              </div>

              {/* Distance */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Distance from Previous Stop
                </label>
                <input
                  type="text"
                  name="distance"
                  placeholder="e.g. ~17–19 km from previous stop"
                  value={form.distance || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
              </div>

              {/* GPS Header & Auto-Detect Button */}
              <div className="sm:col-span-2 flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  GPS Coordinates *
                </span>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 border border-pink-500/35 text-pink-300 hover:bg-pink-500/25 transition-all cursor-pointer"
                >
                  {gettingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="w-3.5 h-3.5" />
                  )}
                  <span>{gettingLocation ? 'Detecting...' : 'Get Device GPS'}</span>
                </button>
              </div>

              {/* Latitude */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="22.2612"
                  value={form.latitude ?? ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
                {errors.latitude && <p className="text-xs text-rose-400">{errors.latitude}</p>}
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="73.1895"
                  value={form.longitude ?? ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
                {errors.longitude && <p className="text-xs text-rose-400">{errors.longitude}</p>}
              </div>

              {/* Visited Toggle */}
              <div className="sm:col-span-2 flex items-center justify-between py-2 border-y border-pink-500/10">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Tour Status
                </span>
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-semibold text-neutral-300">
                    {form.visited ? 'Visited' : 'To Visit'}
                  </span>
                  <input
                    type="checkbox"
                    name="visited"
                    checked={form.visited || false}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#1c1233] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500 border border-pink-500/30 relative"></div>
                </label>
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Description & Notes
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Historical context, decorations, crowd tips..."
                  value={form.description || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image_url || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1233] border border-pink-500/20 text-white text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-sm font-bold border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-3d-pink py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>{isEditing ? 'Update Stop' : 'Add Stop'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
