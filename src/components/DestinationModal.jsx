import { useState, useEffect } from 'react';
import { X, MapPin, Crosshair, Loader } from 'lucide-react';

const CATEGORIES = [
  { value: 'beach', label: '🏖️ সমুদ্র সৈকত' },
  { value: 'mountain', label: '⛰️ পাহাড়' },
  { value: 'forest', label: '🌿 বন/জঙ্গল' },
  { value: 'heritage', label: '🏛️ ঐতিহাসিক স্থান' },
  { value: 'city', label: '🏙️ শহর' },
  { value: 'island', label: '🏝️ দ্বীপ' },
  { value: 'other', label: '📍 অন্যান্য' },
];

const EMPTY_FORM = {
  name: '',
  location: '',
  description: '',
  latitude: '',
  longitude: '',
  imageUrl: '',
  category: 'other',
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
        name: editingItem.name || '',
        location: editingItem.location || '',
        description: editingItem.description || '',
        latitude: editingItem.latitude || '',
        longitude: editingItem.longitude || '',
        imageUrl: editingItem.imageUrl || '',
        category: editingItem.category || 'other',
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
    if (!form.name.trim()) newErrors.name = 'গন্তব্যের নাম দিন';
    if (!form.location.trim()) newErrors.location = 'স্থান বা জেলা উল্লেখ করুন';
    if (!form.latitude) newErrors.latitude = 'Latitude প্রয়োজন';
    if (!form.longitude) newErrors.longitude = 'Longitude প্রয়োজন';
    if (form.latitude && (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90)) {
      newErrors.latitude = 'সঠিক Latitude দিন (-90 থেকে 90)';
    }
    if (form.longitude && (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180)) {
      newErrors.longitude = 'সঠিক Longitude দিন (-180 থেকে 180)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('আপনার ডিভাইসের ব্রাউজার লোকেশন সাপোর্ট করে না।');
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
        alert('লোকেশন পাওয়া যায়নি। ফোনের GPS ও পারমিশন অন আছে কিনা চেক করুন।');
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
        {/* Mobile drag handle bar */}
        <div className="sheet-handle-bar" />

        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? '✏️ গন্তব্য সম্পাদনা' : '✨ নতুন গন্তব্য যোগ'}
          </h2>
          <button
            id="close-modal-btn"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-name">গন্তব্যের নাম *</label>
              <input
                id="dest-name"
                type="text"
                name="name"
                className="form-input"
                placeholder="যেমন: সেন্টমার্টিন দ্বীপ"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Location */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-location">জেলা / অবস্থান *</label>
              <input
                id="dest-location"
                type="text"
                name="location"
                className="form-input"
                placeholder="যেমন: কক্সবাজার, চট্টগ্রাম"
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

            {/* GPS Auto Detect Banner */}
            <div className="form-group full-width" style={{ marginTop: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span className="form-label" style={{ margin: 0 }}>ম্যাপ কোঅর্ডিনেট (GPS) *</span>
                <button
                  id="get-location-btn"
                  type="button"
                  className="gps-btn"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  title="আমার বর্তমান GPS লোকেশন সেট করো"
                >
                  {gettingLocation ? (
                    <Loader size={13} className="spinning" />
                  ) : (
                    <Crosshair size={13} />
                  )}
                  <span>{gettingLocation ? 'জিপিএস খোঁজা হচ্ছে...' : 'আমার লাইভ GPS নাও'}</span>
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
                placeholder="20.6272"
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
                placeholder="92.3218"
                value={form.longitude}
                onChange={handleChange}
              />
              {errors.longitude && <span className="form-error">{errors.longitude}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-category">ক্যাটাগরি</label>
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

            {/* Visited Toggle */}
            <div className="form-group" style={{ justifyContent: 'center' }}>
              <label className="form-label">ভ্রমণ করেছেন?</label>
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
                <span className="toggle-label">{form.visited ? '✅ হ্যাঁ, গিয়েছি' : 'না, যাবো'}</span>
              </label>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-desc">সংক্ষিপ্ত বিবরণ</label>
              <textarea
                id="dest-desc"
                name="description"
                className="form-textarea"
                placeholder="এই স্থানটির সৌন্দর্য বা ভ্রমণের কোনো বিশেষ টিপস..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Image URL */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-image">ছবির লিংক (Image URL)</label>
              <input
                id="dest-image"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={handleChange}
              />
              <span className="form-hint">অনলাইন ছবির লিংক দিলে কার্ডে সুন্দর প্রিভিউ দেখতে পাবেন</span>
            </div>
          </div>

          <div className="form-footer">
            <button
              id="cancel-modal-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              বাতিল
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
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  <span>{isEditing ? 'আপডেট করুন' : 'যোগ করুন'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
