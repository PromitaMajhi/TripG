'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Destination } from '@/types/destination';
import { INITIAL_DESTINATIONS } from '@/data/vadodaraStops';
import Header from '@/components/Header';
import DestinationCard from '@/components/DestinationCard';
import DestinationModal from '@/components/DestinationModal';
import BottomNav from '@/components/BottomNav';
import ParticleGlow from '@/components/ParticleGlow';
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
        // Fallback to embedded destinations
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
    // Optimistic local update
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
        toast.success(newVisited ? 'Marked as Visited!' : 'Marked as To Visit');
      } else {
        // Revert on error
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
        toast('Device location unavailable. Opening destination directly on Google Maps.');
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

  return (
    <div className="app-container relative z-10">
      {/* Dynamic Ambient Background Glow */}
      <ParticleGlow />

      {/* 3D Header */}
      <Header onAddClick={handleAdd} />

      {/* Hero Section */}
      <section className="relative pt-10 pb-8 px-4 text-center border-b border-pink-500/15 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/15 border border-pink-500/35 text-pink-300 text-xs font-bold shadow-[0_4px_14px_rgba(255,46,147,0.2)]">
            <Milestone className="w-3.5 h-3.5" />
            <span>Vadodara Tour Route Guide</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent leading-tight">
            Vadodara Darshan Tour
          </h1>

          {/* 3D Route Flow Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#180e30]/80 border border-pink-500/30 text-xs font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_15px_rgba(255,46,147,0.2)] backdrop-blur-md">
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

          <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
            Explore all 11 sacred destinations with live turn-by-turn Google Maps GPS navigation.
          </p>

          {/* 3D Search Bar */}
          <div className="max-w-md mx-auto pt-2">
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
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-3">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('all')}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                activeFilter === 'all'
                  ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(255,46,147,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                {destinations.length}
              </div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                Total Stops
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('visited')}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                activeFilter === 'visited'
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <div className="text-2xl font-black text-emerald-400">{visitedCount}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                Visited
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter('pending')}
              className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                activeFilter === 'pending'
                  ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(255,46,147,0.35)]'
                  : 'bg-[#180e30]/80 border-white/10 hover:border-pink-500/30'
              }`}
            >
              <div className="text-2xl font-black text-pink-400">{pendingCount}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider pt-0.5">
                To Visit
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Tabs Section */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-2 w-full">
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

      {/* Destination Grid */}
      <main className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
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
            <p className="text-sm font-semibold text-neutral-400">Loading Vadodara tour stops...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
