import { useState, useEffect } from 'react';
import { X, MapPin, Crosshair, Loader } from 'lucide-react';

const CATEGORIES = [
  { value: 'manjalpur', label: '📍 Manjalpur Side' },
  { value: 'old-city', label: '🏛️ Old City (Mangal / Nava Bazar)' },
  { value: 'bajwada', label: '🛕 Bajwada Side' },
  { value: 'navapura', label: '🏘️ Navapura Side' },
  { value: 'kishanwadi', label: '⭐ Kishanwadi Side' },
  { value: 'darshan', label: '🙏 Ganesh Darshan' },
  { value: 'other', label: '📍 Other Location' },
];

const EMPTY_FORM = {
  stopNumber: 1,
  name: '',
  location: '',
  distance: '',
  description: '',
  latitude: '',
  longitude: '',
  imageUrl: '',
  category: 'manjalpur',
  visited: false,
};

export default function DestinationModal({ isOpen, onClose, onSave, editingItem }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setForm({
        stopNumber: editingItem.stopNumber || 1,
        name: editingItem.name || '',
        location: editingItem.location || '',
        distance: editingItem.distance || '',
        description: editingItem.description || '',
        latitude: editingItem.latitude || '',
        longitude: editingItem.longitude || '',
        imageUrl: editingItem.imageUrl || '',
        category: editingItem.category || 'manjalpur',
        visited: editingItem.visited || false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Destination name is required';
    if (!form.location.trim()) newErrors.location = 'Location / Area is required';
    if (!form.latitude) newErrors.latitude = 'Latitude is required';
    if (!form.longitude) newErrors.longitude = 'Longitude is required';
    if (form.latitude && (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90)) {
      newErrors.latitude = 'Enter a valid Latitude (-90 to 90)';
    }
    if (form.longitude && (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180)) {
      newErrors.longitude = 'Enter a valid Longitude (-180 to 180)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGettingLocation(false);
      },
      (err) => {
        alert('Could not get GPS location. Please ensure location services are enabled on your device.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSave({
      ...form,
      stopNumber: Number(form.stopNumber) || 1,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    });
    setSaving(false);
  };

  const isEditing = !!editingItem;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Mobile Drag Handle Bar */}
        <div className="sheet-handle-bar" />

        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? '✏️ Edit Destination' : '✨ Add Tour Destination'}
          </h2>
          <button
            id="close-modal-btn"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Stop Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-stop">Tour Stop #</label>
              <input
                id="dest-stop"
                type="number"
                name="stopNumber"
                min="1"
                max="99"
                className="form-input"
                placeholder="1"
                value={form.stopNumber}
                onChange={handleChange}
              />
            </div>

            {/* Category / Zone */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-category">Zone / Category</label>
              <select
                id="dest-category"
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-name">Destination Name *</label>
              <input
                id="dest-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Manjalpur Na Raja"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Location */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-location">Location / Area *</label>
              <input
                id="dest-location"
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Manjalpur, Vadodara"
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            {/* Distance Info */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-dist">Distance from Previous Stop</label>
              <input
                id="dest-dist"
                type="text"
                name="distance"
                className="form-input"
                placeholder="e.g. ~2–3 km from previous stop"
                value={form.distance}
                onChange={handleChange}
              />
            </div>

            {/* GPS Auto Detect Header */}
            <div className="form-group full-width" style={{ marginTop: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className="form-label" style={{ margin: 0 }}>Map GPS Coordinates *</span>
                <button
                  id="get-location-btn"
                  type="button"
                  className="gps-btn"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  title="Detect current device coordinates"
                >
                  {gettingLocation ? (
                    <Loader size={13} className="spinning" />
                  ) : (
                    <Crosshair size={13} />
                  )}
                  <span>{gettingLocation ? 'Locating...' : 'Get Live GPS'}</span>
                </button>
              </div>
            </div>

            {/* Latitude */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-lat">Latitude</label>
              <input
                id="dest-lat"
                type="number"
                name="latitude"
                step="any"
                className="form-input"
                placeholder="22.2612"
                value={form.latitude}
                onChange={handleChange}
              />
              {errors.latitude && <span className="form-error">{errors.latitude}</span>}
            </div>

            {/* Longitude */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-lng">Longitude</label>
              <input
                id="dest-lng"
                type="number"
                name="longitude"
                step="any"
                className="form-input"
                placeholder="73.1895"
                value={form.longitude}
                onChange={handleChange}
              />
              {errors.longitude && <span className="form-error">{errors.longitude}</span>}
            </div>

            {/* Visited Toggle */}
            <div className="form-group full-width" style={{ padding: '0.25rem 0' }}>
              <label className="form-label">Visited Status</label>
              <label className="toggle-wrapper">
                <input
                  type="checkbox"
                  name="visited"
                  checked={form.visited}
                  onChange={handleChange}
                />
                <div className={`toggle-track ${form.visited ? 'on' : ''}`}>
                  <div className={`toggle-thumb ${form.visited ? 'on' : ''}`} />
                </div>
                <span className="toggle-label">{form.visited ? '✅ Visited' : '📌 To Visit'}</span>
              </label>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-desc">Description & Highlights</label>
              <textarea
                id="dest-desc"
                name="description"
                className="form-textarea"
                placeholder="Details about this mandir, specialty, timings, or route tips..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Image URL */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-image">Photo URL (Optional)</label>
              <input
                id="dest-image"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={handleChange}
              />
              <span className="form-hint">Enter an image link to show a photo card preview</span>
            </div>
          </div>

          <div className="form-footer">
            <button
              id="cancel-modal-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="save-destination-btn"
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader size={16} className="spinning" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  <span>{isEditing ? 'Update Stop' : 'Add Stop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
