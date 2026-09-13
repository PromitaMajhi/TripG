import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Search, MapPin, Plus, Navigation } from 'lucide-react';
import Header from './components/Header.jsx';
import DestinationCard from './components/DestinationCard.jsx';
import DestinationModal from './components/DestinationModal.jsx';

const API_BASE = '/api/destinations';

const FILTER_TABS = [
  { id: 'all', label: '🗺️ সব', emoji: '' },
  { id: 'beach', label: '🏖️ সমুদ্র', emoji: '🏖️' },
  { id: 'mountain', label: '⛰️ পাহাড়', emoji: '⛰️' },
  { id: 'forest', label: '🌿 বন', emoji: '🌿' },
  { id: 'island', label: '🏝️ দ্বীপ', emoji: '🏝️' },
  { id: 'heritage', label: '🏛️ ঐতিহ্য', emoji: '🏛️' },
  { id: 'city', label: '🏙️ শহর', emoji: '🏙️' },
  { id: 'other', label: '📍 অন্যান্য', emoji: '📍' },
  { id: 'visited', label: '✅ গিয়েছি', emoji: '✅' },
];

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch all destinations
  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.success) {
        setDestinations(data.data);
      } else {
        toast.error('ডেটা লোড হয়নি: ' + data.error);
      }
    } catch (err) {
      toast.error('সার্ভারের সাথে সংযোগ হচ্ছে না।');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // SAVE (Add or Update)
  const handleSave = async (formData) => {
    try {
      let res;
      if (editingItem) {
        res = await fetch(`${API_BASE}/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(editingItem ? '✅ আপডেট হয়েছে!' : '✨ নতুন ডেস্টিনেশন যোগ হয়েছে!');
        await fetchDestinations();
        setModalOpen(false);
        setEditingItem(null);
      } else {
        toast.error('সংরক্ষণ হয়নি: ' + data.error);
      }
    } catch (err) {
      toast.error('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('এই ডেস্টিনেশন মুছে ফেলবেন?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('🗑️ মুছে ফেলা হয়েছে।');
        setDestinations((prev) => prev.filter((d) => d._id !== id));
      } else {
        toast.error('মুছতে পারিনি: ' + data.error);
      }
    } catch (err) {
      toast.error('নেটওয়ার্ক সমস্যা।');
    }
  };

  // TOGGLE VISITED
  const handleToggleVisited = async (destination) => {
    try {
      const res = await fetch(`${API_BASE}/${destination._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited: !destination.visited }),
      });
      const data = await res.json();
      if (data.success) {
        const msg = !destination.visited ? '✅ "গিয়েছি" চিহ্নিত!' : '↩️ চিহ্ন সরানো হয়েছে';
        toast.success(msg);
        setDestinations((prev) =>
          prev.map((d) => (d._id === destination._id ? data.data : d))
        );
      }
    } catch (err) {
      toast.error('আপডেট হয়নি।');
    }
  };

  // NAVIGATE — open Google Maps with live location → destination
  const handleNavigate = (destination) => {
    const { latitude, longitude, name } = destination;

    if (!navigator.geolocation) {
      // Fallback: open without origin (Google Maps will use device location)
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
      window.open(url, '_blank');
      return;
    }

    const loadingToast = toast.loading('📍 আপনার অবস্থান খুঁজছি...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(loadingToast);
        const { latitude: userLat, longitude: userLng } = pos.coords;

        // This URL opens Google Maps app on mobile automatically
        const mapsUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${userLat},${userLng}` +
          `&destination=${latitude},${longitude}` +
          `&travelmode=driving`;

        toast.success(`🗺️ ${name} এর দিকে নেভিগেট করছি!`);
        window.open(mapsUrl, '_blank');
      },
      (err) => {
        toast.dismiss(loadingToast);
        // If location permission denied, still open maps with just destination
        toast(`⚠️ অবস্থান নেওয়া যায়নি। শুধু গন্তব্য দেখাচ্ছি।`, { icon: '📍' });
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(url, '_blank');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // OPEN EDIT MODAL
  const handleEdit = (destination) => {
    setEditingItem(destination);
    setModalOpen(true);
  };

  // OPEN ADD MODAL
  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  // FILTER & SEARCH
  const filtered = destinations.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'visited' ? d.visited : d.category === activeFilter);

    return matchesSearch && matchesFilter;
  });

  const visitedCount = destinations.filter((d) => d.visited).length;

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-card)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
          },
        }}
      />

      <Header onAddClick={handleAdd} />

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <Navigation size={12} />
          আপনার ট্যুর গাইড
        </div>
        <h1>আপনার স্বপ্নের গন্তব্য</h1>
        <p>বাংলাদেশের সুন্দর স্থানগুলো সংরক্ষণ করুন এবং মানচিত্রে নেভিগেট করুন।</p>

        {/* Search bar in hero */}
        <div style={{ maxWidth: '440px', margin: '0 auto', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="hero-search"
            type="search"
            className="search-input"
            placeholder="জায়গার নাম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', fontSize: '0.95rem' }}
          />
        </div>

        <div className="hero-stats" style={{ marginTop: '1.5rem' }}>
          <div className="stat">
            <div className="stat-number">{destinations.length}</div>
            <div className="stat-label">মোট গন্তব্য</div>
          </div>
          <div className="stat">
            <div className="stat-number">{visitedCount}</div>
            <div className="stat-label">ভ্রমণ করেছি</div>
          </div>
          <div className="stat">
            <div className="stat-number">{destinations.length - visitedCount}</div>
            <div className="stat-label">বাকি আছে</div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="filter-section">
        <div className="filter-tabs" role="tablist">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              id={`filter-${tab.id}`}
              className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
              role="tab"
              aria-selected={activeFilter === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <main className="main-content" role="main">
        <div className="section-heading">
          <h2>
            {activeFilter === 'all' ? 'সব গন্তব্য' :
             activeFilter === 'visited' ? 'গিয়েছি' : 'ফিল্টার করা'}
          </h2>
          <span className="section-count">{filtered.length} টি</span>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text">ডেটা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <h3>কোনো গন্তব্য পাওয়া যায়নি</h3>
                <p>
                  {searchQuery
                    ? `"${searchQuery}" এর জন্য কোনো ফলাফল নেই`
                    : 'নতুন গন্তব্য যোগ করুন'}
                </p>
              </div>
            ) : (
              filtered.map((destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisited={handleToggleVisited}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        id="fab-add-btn"
        className="fab"
        onClick={handleAdd}
        aria-label="নতুন ডেস্টিনেশন যোগ করো"
        title="নতুন ডেস্টিনেশন যোগ করো"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
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
