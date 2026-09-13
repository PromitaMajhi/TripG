import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  Navigation, 
  CheckCircle2, 
  Compass, 
  X, 
  Clock, 
  MapPin, 
  Milestone, 
  Landmark, 
  Building2, 
  Map, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import Header from './components/Header.jsx';
import DestinationCard from './components/DestinationCard.jsx';
import DestinationModal from './components/DestinationModal.jsx';

const API_BASE = '/api/destinations';

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

export default function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const searchInputRef = useRef(null);

  // Fetch all tour destinations
  const fetchDestinations = useCallback(async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (data.success) {
        const sorted = (data.data || []).sort((a, b) => (a.stopNumber || 0) - (b.stopNumber || 0));
        setDestinations(sorted);
      } else {
        toast.error('Failed to load tour data: ' + data.error);
      }
    } catch (err) {
      toast.error('Could not connect to database.');
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
        toast.success(editingItem ? 'Destination updated successfully!' : 'New tour stop added!');
        await fetchDestinations();
        setModalOpen(false);
        setEditingItem(null);
      } else {
        toast.error('Save failed: ' + data.error);
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stop from the tour?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Stop removed from tour.');
        setDestinations((prev) => prev.filter((d) => d._id !== id));
      } else {
        toast.error('Could not delete: ' + data.error);
      }
    } catch (err) {
      toast.error('Network error.');
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
        const msg = !destination.visited ? 'Marked as Visited!' : 'Marked as To Visit';
        toast.success(msg);
        setDestinations((prev) =>
          prev.map((d) => (d._id === destination._id ? data.data : d))
        );
      }
    } catch (err) {
      toast.error('Failed to update visited status.');
    }
  };

  // NAVIGATE — open Google Maps with live GPS origin → destination
  const handleNavigate = (destination) => {
    const { latitude, longitude, name } = destination;

    if (!navigator.geolocation) {
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(fallbackUrl, '_blank');
      return;
    }

    const loadingToast = toast.loading('Locating GPS position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss(loadingToast);
        const { latitude: userLat, longitude: userLng } = pos.coords;

        // Opens Google Maps directly with driving route from user's live position
        const mapsUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${userLat},${userLng}` +
          `&destination=${latitude},${longitude}` +
          `&travelmode=driving`;

        toast.success(`Opening Google Maps navigation to ${name}!`);
        window.open(mapsUrl, '_blank');
      },
      (err) => {
        toast.dismiss(loadingToast);
        toast('Location unavailable. Opening destination on map directly.');
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
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1c1233',
            color: '#ffffff',
            border: '1px solid rgba(255, 46, 147, 0.35)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            boxShadow: '0 12px 36px rgba(0,0,0,0.7), 0 0 20px rgba(255, 46, 147, 0.3)',
            borderRadius: '14px',
          },
        }}
      />

      {/* Top Header */}
      <Header onAddClick={handleAdd} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Milestone size={14} />
          <span>Vadodara Tour Route Guide</span>
        </div>

        <h1>Vadodara Darshan Tour</h1>

        {/* 3D Route Flow Banner without emojis */}
        <div className="route-flow-banner">
          <span>Parul Univ</span>
          <span className="route-arrow"><ArrowRight size={12} /></span>
          <span>Manjalpur</span>
          <span className="route-arrow"><ArrowRight size={12} /></span>
          <span>Old City</span>
          <span className="route-arrow"><ArrowRight size={12} /></span>
          <span>Navapura</span>
          <span className="route-arrow"><ArrowRight size={12} /></span>
          <span>Kishanwadi</span>
        </div>

        <p>Explore all 11 sacred destinations with live turn-by-turn Google Maps GPS navigation.</p>

        {/* 3D Search Bar */}
        <div className="search-box-container">
          <div className="search-box-inner">
            <Search size={18} className="search-icon-svg" />
            <input
              ref={searchInputRef}
              id="hero-search-input"
              type="search"
              className="search-input-field"
              placeholder="Search by stop name, pol, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search destinations"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* 3D Clickable Stat Cards */}
        <div className="hero-stats">
          <div
            className={`stat-card ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number">{destinations.length}</div>
            <div className="stat-label">Total Stops</div>
          </div>

          <div
            className={`stat-card ${activeFilter === 'visited' ? 'active' : ''}`}
            onClick={() => setActiveFilter('visited')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number" style={{ color: 'var(--accent-emerald)' }}>
              {visitedCount}
            </div>
            <div className="stat-label">Visited</div>
          </div>

          <div
            className={`stat-card ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveFilter('pending')}
            role="button"
            tabIndex={0}
          >
            <div className="stat-number" style={{ color: 'var(--accent-pink)' }}>
              {pendingCount}
            </div>
            <div className="stat-label">To Visit</div>
          </div>
        </div>
      </section>

      {/* 3D Filter Tabs with Vector Icons Only */}
      <div className="filter-section">
        <div className="filter-tabs" role="tablist" aria-label="Filter tour stops">
          {FILTER_TABS.map((tab) => {
            const IconComponent = tab.Icon;
            return (
              <button
                key={tab.id}
                id={`filter-${tab.id}`}
                className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.id)}
                role="tab"
                aria-selected={activeFilter === tab.id}
              >
                <IconComponent size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tour Stop Cards */}
      <main className="main-content" role="main">
        <div className="section-heading">
          <h2>
            {activeFilter === 'all' ? 'All Tour Destinations' :
             activeFilter === 'visited' ? 'Visited Stops' :
             activeFilter === 'pending' ? 'Remaining Stops to Visit' :
             `${FILTER_TABS.find((t) => t.id === activeFilter)?.label || ''} Stops`}
          </h2>
          <span className="section-count">{filtered.length} Stops</span>
        </div>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p className="loading-text">Loading Vadodara tour destinations...</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-box">
                  <Compass size={38} />
                </div>
                <h3>No destinations found</h3>
                <p>
                  {searchQuery
                    ? `No stops match "${searchQuery}".`
                    : 'No destinations found in this category.'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleAdd}
                  style={{ margin: '0 auto' }}
                >
                  <Plus size={16} />
                  <span>Add New Stop</span>
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

      {/* Desktop 3D Floating Action Button */}
      <button
        id="fab-add-btn"
        className="fab"
        onClick={handleAdd}
        aria-label="Add Destination"
        title="Add New Destination"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* Mobile 3D Bottom Navigation Bar */}
      <nav className="bottom-nav" aria-label="Mobile Navigation">
        <button
          className={`bottom-nav-item ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
          aria-label="All Stops"
        >
          <Compass size={20} />
          <span>Stops</span>
        </button>

        <button
          className={`bottom-nav-item ${activeFilter === 'visited' ? 'active' : ''}`}
          onClick={() => setActiveFilter('visited')}
          aria-label="Visited Stops"
        >
          <CheckCircle2 size={20} />
          <span>Visited</span>
        </button>

        {/* 3D Floating Center Add Button */}
        <button
          id="mobile-nav-add-btn"
          className="bottom-nav-add-btn"
          onClick={handleAdd}
          aria-label="Add Tour Stop"
          title="Add Stop"
        >
          <Plus size={26} strokeWidth={2.8} />
        </button>

        <button
          className={`bottom-nav-item ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
          aria-label="To Visit"
        >
          <Clock size={20} />
          <span>To Visit</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={handleFocusSearch}
          aria-label="Search"
        >
          <Search size={20} />
          <span>Search</span>
        </button>
      </nav>

      {/* 3D Modal / Bottom Sheet */}
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
