import { MapPin, Navigation, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';

const CATEGORY_EMOJIS = {
  beach: '🏖️',
  mountain: '⛰️',
  forest: '🌿',
  heritage: '🏛️',
  city: '🏙️',
  island: '🏝️',
  other: '📍',
};

const CATEGORY_LABELS = {
  beach: 'সমুদ্র সৈকত',
  mountain: 'পাহাড়',
  forest: 'বন/জঙ্গল',
  heritage: 'ঐতিহাসিক',
  city: 'শহর',
  island: 'দ্বীপ',
  other: 'অন্যান্য',
};

export default function DestinationCard({ destination, onEdit, onDelete, onToggleVisited, onNavigate }) {
  const {
    _id,
    name,
    location,
    description,
    latitude,
    longitude,
    imageUrl,
    category,
    visited,
  } = destination;

  const emoji = CATEGORY_EMOJIS[category] || '📍';
  const label = CATEGORY_LABELS[category] || category;

  return (
    <article className="card">
      {/* Image and badges */}
      <div className="card-image-wrapper">
        {imageUrl ? (
          <img
            className="card-image"
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className="card-image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          {emoji}
        </div>

        <div className="card-image-overlay" />

        {/* Category badge */}
        <span className={`card-category-badge cat-${category}`}>
          {emoji} {label}
        </span>

        {/* Visited badge */}
        {visited && (
          <span className="card-visited-badge">
            ✓ ভ্রমণ সম্পন্ন
          </span>
        )}
      </div>

      {/* Body content */}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-name">{name}</h3>
          <div className="card-menu">
            <button
              id={`edit-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onEdit(destination)}
              title="সম্পাদনা করুন"
              aria-label="সম্পাদনা"
            >
              <Edit3 size={16} />
            </button>
            <button
              id={`delete-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onDelete(_id)}
              title="মুছে ফেলুন"
              aria-label="মুছে ফেলুন"
              style={{ color: 'var(--accent-coral)' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="card-location">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        {description && (
          <p className="card-description">{description}</p>
        )}

        {/* Meta row: Coordinates + Quick Visited Toggle */}
        <div className="card-meta-row">
          <div className="card-coords">
            <span className="coord-item">
              📍 {latitude?.toFixed(3)}°, {longitude?.toFixed(3)}°
            </span>
          </div>

          <button
            id={`toggle-visited-${_id}`}
            className={`card-visited-toggle-btn ${visited ? 'active' : ''}`}
            onClick={() => onToggleVisited(destination)}
            title={visited ? 'ভ্রমণ চিহ্নিত সরানো' : 'ভ্রমণ সম্পন্ন চিহ্নিত করো'}
          >
            {visited ? (
              <>
                <CheckCircle2 size={14} />
                <span>গিয়েছি</span>
              </>
            ) : (
              <>
                <Circle size={14} />
                <span>যাবো</span>
              </>
            )}
          </button>
        </div>

        {/* Full-width Touch-Friendly Map / Navigation Button */}
        <div className="card-actions">
          <button
            id={`navigate-${_id}`}
            className="btn btn-map"
            onClick={() => onNavigate(destination)}
            aria-label={`${name} এর দিকে গুগল ম্যাপ নেভিগেশন চালু করো`}
          >
            <Navigation size={18} />
            <span>মানচিত্রে সরাসরি নেভিগেট করো</span>
          </button>
        </div>
      </div>
    </article>
  );
}
