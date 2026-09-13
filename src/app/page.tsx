'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Destination } from '@/types/destination';
import { INITIAL_DESTINATIONS } from '@/data/vadodaraStops';
import Header from '@/components/Header';
import DestinationCard from '@/components/DestinationCard';
import DestinationModal from '@/components/DestinationModal';
import BottomNav from '@/components/BottomNav';
import ParticleGlow from '@/components/ParticleGlow';
import RouteStepper from '@/components/RouteStepper';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  Landmark,
  Building2,
  Map,
  Sparkles,
  Milestone,
  ArrowRight,
  X,
  Navigation,
  Layers,
  Route as RouteIcon,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All Stops', Icon: Compass },
  { id: 'manjalpur', label: 'Manjalpur', Icon: MapPin },
  { id: 'old-city', label: 'Old City', Icon: Landmark },
  { id: 'bajwada', label: 'Bajwada', Icon: Building2 },
  { id: 'navapura', label: 'Navapura', Icon: Map },
  { id: 'kishanwadi', label: 'Kishanwadi', Icon: Sparkles },
  { id: 'pending', label: 'To Visit', Icon: Clock },
  { id: 'visited', label: 'Visited', Icon: CheckCircle2 },
];

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch destinations from Route Handler
  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch('/api/destinations');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const sorted = [...data.data].sort((a, b) => (a.stop_number || 0) - (b.stop_number || 0));
        setDestinations(sorted);
      } else {
        setDestinations(INITIAL_DESTINATIONS);
      }
    } catch (err) {
      console.warn('API error, using initial dataset:', err);
      setDestinations(INITIAL_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // SAVE (Create or Update)
  const handleSave = async (formData: Partial<Destination>) => {
    try {
      if (editingItem) {
        const res = await fetch(`/api/destinations/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Tour stop updated successfully!');
          setDestinations((prev) =>
            prev.map((d) => (d.id === editingItem.id ? { ...d, ...formData } : d))
          );
        } else {
          toast.error(data.error || 'Failed to update');
        }
      } else {
        const res = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('New tour stop added!');
          setDestinations((prev) =>
            [...prev, data.data].sort((a, b) => (a.stop_number || 0) - (b.stop_number || 0))
          );
        } else {
          toast.error(data.error || 'Failed to add stop');
        }
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      toast.error('Network error while saving.');
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this stop from the tour?')) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Stop removed from tour');
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      } else {
        toast.error(data.error || 'Could not delete stop');
      }
    } catch (err) {
      toast.error('Network error.');
    }
  };

  // TOGGLE VISITED
  const handleToggleVisited = async (destination: Destination) => {
    const newVisited = !destination.visited;
    setDestinations((prev) =>
      prev.map((d) => (d.id === destination.id ? { ...d, visited: newVisited } : d))
    );

    try {
      const res = await fetch(`/api/destinations/${destination.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: newVisited }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(newVisited ? '🎉 Marked as Visited!' : 'Marked as To Visit');
      } else {
        setDestinations((prev) =>
          prev.map((d) => (d.id === destination.id ? { ...d, visited: !newVisited } : d))
        );
        toast.error('Could not update status');
      }
    } catch (err) {
      toast.error('Network error updating status');
    }
  };

  // LIVE GPS GOOGLE MAPS NAVIGATION
  const handleNavigate = (destination: Destination) => {
    const { latitude, longitude, name } = destination;

    if (!navigator.geolocation) {
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(fallbackUrl, '_blank');
      return;
    }

    const toastId = toast.loading('Acquiring live GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(toastId);
        const { latitude: userLat, longitude: userLng } = pos.coords;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}&travelmode=driving`;
        toast.success(`Routing to ${name} on Google Maps!`);
        window.open(mapsUrl, '_blank');
      },
      () => {
        toast.dismiss(toastId);
        toast('Opening destination directly on Google Maps.');
        const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        window.open(fallbackUrl, '_blank');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const handleEdit = (destination: Destination) => {
    setEditingItem(destination);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filter and Search logic
  const filtered = destinations.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (d.name || '').toLowerCase().includes(q) ||
      (d.location || '').toLowerCase().includes(q) ||
      (d.distance || '').toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q);

    let matchesFilter = true;
    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'visited') {
      matchesFilter = d.visited === true;
    } else if (activeFilter === 'pending') {
      matchesFilter = !d.visited;
    } else {
      matchesFilter = d.category === activeFilter;
    }

    return matchesSearch && matchesFilter;
  });

  const visitedCount = destinations.filter((d) => d.visited).length;
  const pendingCount = destinations.length - visitedCount;
  const progressPercent =
    destinations.length > 0 ? Math.round((visitedCount / destinations.length) * 100) : 0;

  // Identify next unvisited stop
  const sortedStops = [...destinations].sort(
    (a, b) => (a.stop_number || 0) - (b.stop_number || 0)
  );
  const nextTargetStop = sortedStops.find((d) => !d.visited) || sortedStops[0];

  return (
    <div className="app-container relative z-10 min-h-screen pb-20 md:pb-8">
      {/* Dynamic Ambient Background Glow */}
      <ParticleGlow />

      {/* 3D Header */}
      <Header onAddClick={handleAdd} />

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-6 px-4 text-center border-b border-pink-500/15 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3.5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/35 text-pink-300 text-xs font-bold shadow-[0_4px_14px_rgba(255,46,147,0.2)]">
            <Milestone className="w-3.5 h-3.5" />
            <span>Vadodara Darshan 11 Stops</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent leading-tight">
            Vadodara Tour Navigator
          </h1>

          {/* 3D Route Flow Pill */}
          <div className="hidden sm:inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#180e30]/80 border border-pink-500/30 text-xs font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(255,46,147,0.2)] backdrop-blur-md">
            <span>Parul Univ</span>
            <ArrowRight className="w-3 h-3 text-pink-400" />
            <span>Manjalpur</span>
            <ArrowRight className="w-3 h-3 text-pink-400" />
            <span>Old City</span>
            <ArrowRight className="w-3 h-3 text-pink-400" />
            <span>Navapura</span>
            <ArrowRight className="w-3 h-3 text-pink-400" />
            <span>Kishanwadi</span>
          </div>

          {/* Mobile-First Sticky "Next Target Stop" Quick Navigator Card */}
          {nextTargetStop && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-br from-[#241038] via-[#1a0c2c] to-[#120820] border border-pink-500/40 shadow-[0_10px_30px_rgba(255,46,147,0.25)] text-left space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-pink-400">
                    Next Target Stop
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Stop #{nextTargetStop.stop_number}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {nextTargetStop.name}
                </h3>
                <p className="text-xs text-neutral-300/80 line-clamp-1 pt-0.5">
                  📍 {nextTargetStop.location}
                </p>
                {nextTargetStop.distance && (
                  <p className="text-[11px] font-semibold text-pink-400 pt-0.5">
                    🚗 {nextTargetStop.distance}
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-neutral-400">Tour Progress</span>
                  <span className="text-pink-300">
                    {visitedCount} of {destinations.length} Stops ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 shadow-[0_0_12px_rgba(255,46,147,0.8)]"
                  />
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleNavigate(nextTargetStop)}
                  className="flex-1 py-2.5 px-3 rounded-xl btn-3d-map flex items-center justify-center gap-2 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate Now</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleToggleVisited(nextTargetStop)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-1">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#180e30] border border-pink-500/25 shadow-[0_8px_28px_rgba(0,0,0,0.5)] focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all">
              <Search className="w-4 h-4 text-pink-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stop name, market, or area..."
                className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-neutral-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Stat Counters */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto pt-2">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('all')}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(255,46,147,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                {destinations.length}
              </div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                Total
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('visited')}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                activeFilter === 'visited'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{visitedCount}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                Visited
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('pending')}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                activeFilter === 'pending'
                  ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(255,46,147,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black text-pink-400">{pendingCount}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                To Visit
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Toolbar & View Switcher (Cards vs Route Stepper) */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-2 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#180e30] border border-pink-500/30 w-full sm:w-auto shadow-md">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Card Feed</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Route Roadmap</span>
          </button>
        </div>

        {/* Emergency Help Button */}
        <button
          onClick={() => setHelpModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Vadodara Emergency Helplines</span>
        </button>
      </section>

      {/* Filter Tabs Section (Only in Card view) */}
      {viewMode === 'cards' && (
        <section className="max-w-6xl mx-auto px-4 pt-2 pb-2 w-full">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const TabIcon = tab.Icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'btn-3d-pink text-white border-white/20'
                      : 'bg-[#180e30] text-neutral-400 border-white/10 hover:border-pink-500/40 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-4 w-full flex-1">
        {viewMode === 'timeline' ? (
          <div>
            <div className="flex items-center justify-between pb-3 px-2">
              <h2 className="text-lg font-bold text-white">Step-by-Step Route Roadmap</h2>
              <span className="text-xs text-pink-400 font-semibold">11 Connected Stops</span>
            </div>
            <RouteStepper
              destinations={destinations}
              onNavigate={handleNavigate}
              onToggleVisited={handleToggleVisited}
              onSelect={handleEdit}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeFilter === 'all'
                  ? 'All Tour Destinations'
                  : activeFilter === 'visited'
                  ? 'Visited Stops'
                  : activeFilter === 'pending'
                  ? 'Remaining Stops to Visit'
                  : `${FILTER_TABS.find((t) => t.id === activeFilter)?.label || ''} Stops`}
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300">
                {filtered.length} Stops
              </span>
            </div>

            {loading ? (
              <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-pink-500/20 border-t-pink-500 rounded-full animate-spin shadow-[0_0_20px_rgba(255,46,147,0.4)]" />
                <p className="text-sm font-semibold text-neutral-400">
                  Loading Vadodara tour stops...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#180e30]/50 border border-dashed border-pink-500/25 rounded-3xl max-w-lg mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-pink-500/15 border border-pink-500/35 flex items-center justify-center mx-auto text-pink-400 shadow-[0_0_25px_rgba(255,46,147,0.3)]">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No destinations found</h3>
                <p className="text-xs text-neutral-400">
                  {searchQuery
                    ? `No tour stops match "${searchQuery}".`
                    : 'No destinations found in this filter category.'}
                </p>
                <button
                  onClick={handleAdd}
                  className="btn-3d-pink px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Stop</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisited={handleToggleVisited}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Desktop Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full btn-3d-pink hidden md:flex items-center justify-center text-white shadow-[0_10px_32px_rgba(255,46,147,0.6)] cursor-pointer"
        aria-label="Add Destination"
        title="Add Stop"
      >
        <Plus className="w-6 h-6" strokeWidth={2.8} />
      </motion.button>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddClick={handleAdd}
        onSearchFocus={handleFocusSearch}
      />

      {/* Add / Edit Destination Modal */}
      <DestinationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        editingItem={editingItem}
      />

      {/* Emergency Assistance Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#25103a] to-[#140a24] border border-pink-500/40 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="w-5 h-5" />
                <span>Vadodara Emergency Helplines</span>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              In case of emergency during your tour in Vadodara, tap any number to call immediately:
            </p>

            <div className="space-y-2 text-sm font-semibold">
              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 text-white"
              >
                <span>Police / National Emergency</span>
                <span className="text-pink-400 font-bold">112</span>
              </a>
              <a
                href="tel:1095"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 text-white"
              >
                <span>Vadodara Traffic Helpline</span>
                <span className="text-pink-400 font-bold">1095</span>
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 text-white"
              >
                <span>Ambulance (Gujarat Emergency)</span>
                <span className="text-emerald-400 font-bold">108</span>
              </a>
              <a
                href="tel:02652433111"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 text-white"
              >
                <span>Vadodara Municipal Corp (VMC)</span>
                <span className="text-pink-400 text-xs">0265-2433111</span>
              </a>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl btn-3d-pink text-xs font-bold text-white shadow-md cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
