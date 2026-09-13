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
    if (!form.name.trim()) newErrors.name = 'নাম দেওয়া আবশ্যক';
    if (!form.location.trim()) newErrors.location = 'স্থান দেওয়া আবশ্যক';
    if (!form.latitude) newErrors.latitude = 'Latitude দেওয়া আবশ্যক';
    if (!form.longitude) newErrors.longitude = 'Longitude দেওয়া আবশ্যক';
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
      alert('আপনার ব্রাউজার location সাপোর্ট করে না।');
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
        alert('Location নেওয়া যায়নি: ' + err.message);
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {isEditing ? '✏️ ডেস্টিনেশন সম্পাদনা' : '✨ নতুন ডেস্টিনেশন'}
          </h2>
          <button
            id="close-modal-btn"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="বন্ধ করো"
          >
            <X size={18} />
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
                placeholder="যেমন: কক্সবাজার সৈকত"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span style={{ color: 'var(--accent-coral)', fontSize: '0.75rem' }}>{errors.name}</span>}
            </div>

            {/* Location */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-location">জেলা / বিভাগ *</label>
              <input
                id="dest-location"
                type="text"
                name="location"
                className="form-input"
                placeholder="যেমন: চট্টগ্রাম বিভাগ"
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && <span style={{ color: 'var(--accent-coral)', fontSize: '0.75rem' }}>{errors.location}</span>}
            </div>

            {/* Latitude */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-lat">Latitude *</label>
              <input
                id="dest-lat"
                type="number"
                name="latitude"
                step="any"
                className="form-input"
                placeholder="21.4272"
                value={form.latitude}
                onChange={handleChange}
              />
              {errors.latitude && <span style={{ color: 'var(--accent-coral)', fontSize: '0.75rem' }}>{errors.latitude}</span>}
            </div>

            {/* Longitude */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="dest-lng">Longitude *</label>
                <button
                  id="get-location-btn"
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', marginBottom: '0.4rem' }}
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                  title="আমার বর্তমান অবস্থান ব্যবহার করো"
                >
                  {gettingLocation ? (
                    <Loader size={11} className="spinning" />
                  ) : (
                    <Crosshair size={11} />
                  )}
                  {gettingLocation ? 'নিচ্ছি...' : 'লাইভ'}
                </button>
              </div>
              <input
                id="dest-lng"
                type="number"
                name="longitude"
                step="any"
                className="form-input"
                placeholder="92.0058"
                value={form.longitude}
                onChange={handleChange}
              />
              {errors.longitude && <span style={{ color: 'var(--accent-coral)', fontSize: '0.75rem' }}>{errors.longitude}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="dest-category">ধরন</label>
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

            {/* Visited */}
            <div className="form-group" style={{ justifyContent: 'flex-end', paddingBottom: '0.25rem' }}>
              <label className="form-label">গিয়েছেন?</label>
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
                <span className="toggle-label">{form.visited ? '✅ হ্যাঁ' : 'না'}</span>
              </label>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-desc">বিবরণ</label>
              <textarea
                id="dest-desc"
                name="description"
                className="form-textarea"
                placeholder="এই স্থান সম্পর্কে কিছু লিখুন..."
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            {/* Image URL */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="dest-image">ছবির লিংক (URL)</label>
              <input
                id="dest-image"
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={handleChange}
              />
              <span className="form-hint">ছবির URL দিলে কার্ডে দেখাবে</span>
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
                <><Loader size={14} /> সংরক্ষণ করছি...</>
              ) : (
                <><MapPin size={14} /> {isEditing ? 'আপডেট করো' : 'যোগ করো'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
