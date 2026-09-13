import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Search, MapPin, Plus, Navigation, CheckCircle2, Compass, X, Clock, Layers } from 'lucide-react';
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
  { id: 'visited', label: '✅ ভ্রমণ করেছি', emoji: '✅' },
  { id: 'pending', label: '📌 বাকি আছে', emoji: '📌' },
];

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const searchInputRef = useRef(null);

  // Fetch all destinations from API
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

  // SAVE (Create or Update)
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
        toast.success(editingItem ? '✅ ডেস্টিনেশন আপডেট হয়েছে!' : '✨ নতুন ডেস্টিনেশন যুক্ত হয়েছে!');
        await fetchDestinations();
        setModalOpen(false);
        setEditingItem(null);
      } else {
        toast.error('সংরক্ষণ ব্যর্থ: ' + data.error);
      }
    } catch (err) {
      toast.error('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি এই ডেস্টিনেশনটি মুছে ফেলতে চান?')) return;
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
        const msg = !destination.visited ? '✅ ভ্রমণ সম্পন্ন হিসেবে চিহ্নিত!' : '↩️ ভ্রমণ তালিকা থেকে সরানো হয়েছে';
        toast.success(msg);
        setDestinations((prev) =>
          prev.map((d) => (d._id === destination._id ? data.data : d))
        );
      }
    } catch (err) {
      toast.error('আপডেট ব্যর্থ হয়েছে।');
    }
  };

  // NAVIGATE — open Google Maps app on phone with live GPS origin → destination
  const handleNavigate = (destination) => {
    const { latitude, longitude, name } = destination;

    if (!navigator.geolocation) {
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(fallbackUrl, '_blank');
      return;
    }

    const loadingToast = toast.loading('📍 আপনার লাইভ জিপিএস অবস্থান নেওয়া হচ্ছে...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(loadingToast);
        const { latitude: userLat, longitude: userLng } = pos.coords;

        // Opens Google Maps app on mobile phone directly with driving route
        const mapsUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${userLat},${userLng}` +
          `&destination=${latitude},${longitude}` +
          `&travelmode=driving`;

        toast.success(`🗺️ ${name} এর জন্য গুগল ম্যাপ চালু হচ্ছে!`);
        window.open(mapsUrl, '_blank');
      },
      (err) => {
        toast.dismiss(loadingToast);
        toast(`⚠️ অবস্থান পাওয়া যায়নি। সরাসরি গন্তব্যের ম্যাপ ওপেন করছি।`, { icon: '📍' });
        const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        window.open(fallbackUrl, '_blank');
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

  // FOCUS SEARCH
  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // FILTER & SEARCH LOGIC
  const filtered = destinations.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchQuery.toLowerCase());

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
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-card)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            borderRadius: '12px',
          },
        }}
      />

      {/* Mobile Top Header */}
      <Header onAddClick={handleAdd} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Navigation size={13} />
          <span>স্মার্ট ট্যুর ও ম্যাপ নেভিগেশন</span>
        </div>
        <h1>আপনার স্বপ্নের ভ্রমণ শুরু হোক</h1>
        <p>বাংলাদেশের জনপ্রিয় দর্শনীয় স্থানগুলো খুঁজে নিন এবং এক ক্লিকেই লাইভ লোকেশন থেকে ম্যাপে চলে যান।</p>

        {/* Search Bar with Clear Button */}
        <div className="search-box-container">
          <div className="search-box-inner">
            <Search size={18} className="search-icon-svg" />
            <input
              ref={searchInputRef}
              id="hero-search-input"
              type="search"
              className="search-input-field"
              placeholder="স্থান বা জেলার নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="গন্তব্য খুঁজুন"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="সার্চ মুছুন"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Stats Cards (Clickable to Filter) */}
        <div className="hero-stats">
          <div
            className={`stat-card ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number">{destinations.length}</div>
            <div className="stat-label">মোট গন্তব্য</div>
          </div>

          <div
            className={`stat-card ${activeFilter === 'visited' ? 'active' : ''}`}
            onClick={() => setActiveFilter('visited')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number" style={{ color: 'var(--accent-secondary)' }}>
              {visitedCount}
            </div>
            <div className="stat-label">ভ্রমণ করেছি</div>
          </div>

          <div
            className={`stat-card ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number" style={{ color: 'var(--accent-sky)' }}>
              {pendingCount}
            </div>
            <div className="stat-label">বাকি আছে</div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="filter-section">
        <div className="filter-tabs" role="tablist" aria-label="ক্যাটাগরি ফিল্টার">
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

      {/* Main Destination List */}
      <main className="main-content" role="main">
        <div className="section-heading">
          <h2>
            {activeFilter === 'all' ? 'সকল দর্শনীয় স্থান' :
             activeFilter === 'visited' ? 'ভ্রমণ সম্পন্ন স্থানসমূহ' :
             activeFilter === 'pending' ? 'ভ্রমণের বাকি স্থানসমূহ' :
             `${FILTER_TABS.find((t) => t.id === activeFilter)?.label || ''} স্থানসমূহ`}
          </h2>
          <span className="section-count">{filtered.length} টি স্থান</span>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text">গন্তব্যের তালিকা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <h3>কোনো স্থান পাওয়া যায়নি</h3>
                <p>
                  {searchQuery
                    ? `"${searchQuery}" অনুসন্ধানে কোনো ফলাফল মেলেনি।`
                    : 'আপনার পছন্দের কোনো স্থান এখনো যোগ করা হয়নি।'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  style={{ margin: '0 auto' }}
                >
                  <Plus size={16} />
                  <span>নতুন স্থান যোগ করুন</span>
                </button>
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

      {/* Desktop Floating Action Button */}
      <button
        id="fab-add-btn"
        className="fab"
        onClick={handleAdd}
        aria-label="নতুন ডেস্টিনেশন যোগ করো"
        title="নতুন ডেস্টিনেশন যোগ করো"
      >
        <Plus size={26} />
      </button>

      {/* Mobile Bottom Navigation Bar (Phone Native Feel) */}
      <nav className="bottom-nav" aria-label="মোবাইল নেভিগেশন">
        <button
          className={`bottom-nav-item ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
          aria-label="সব স্থান"
        >
          <Compass size={20} />
          <span>হোম</span>
        </button>

        <button
          className={`bottom-nav-item ${activeFilter === 'visited' ? 'active' : ''}`}
          onClick={() => setActiveFilter('visited')}
          aria-label="ভ্রমণ করেছি"
        >
          <CheckCircle2 size={20} />
          <span>গিয়েছি</span>
        </button>

        {/* Center Glowing Add Button */}
        <button
          id="mobile-nav-add-btn"
          className="bottom-nav-add-btn"
          onClick={handleAdd}
          aria-label="নতুন গন্তব্য যোগ করুন"
          title="নতুন গন্তব্য যোগ"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>

        <button
          className={`bottom-nav-item ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
          aria-label="বাকি আছে"
        >
          <Clock size={20} />
          <span>বাকি</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={handleFocusSearch}
          aria-label="অনুসন্ধান"
        >
          <Search size={20} />
          <span>খুঁজুন</span>
        </button>
      </nav>

      {/* Bottom Sheet Modal on Mobile / Centered Modal on Desktop */}
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
