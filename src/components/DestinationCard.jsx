import { MapPin, Navigation, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

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
  beach: 'সমুদ্র',
  mountain: 'পাহাড়',
  forest: 'বন',
  heritage: 'ঐতিহ্য',
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
      {/* Image */}
      <div className="card-image-wrapper">
        {imageUrl ? (
          <img
            className="card-image"
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="card-image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          {emoji}
        </div>

        {/* Category badge */}
        <span className={`card-category-badge cat-${category}`}>
          {emoji} {label}
        </span>

        {/* Visited badge */}
        {visited && (
          <span className="card-visited-badge">✓ গিয়েছি</span>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-name">{name}</h3>
          <div className="card-menu">
            <button
              id={`toggle-visited-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onToggleVisited(destination)}
              title={visited ? 'না গেলে চিহ্নিত করো' : 'গিয়েছি চিহ্নিত করো'}
            >
              {visited ? (
                <Eye size={15} color="var(--accent-secondary)" />
              ) : (
                <EyeOff size={15} />
              )}
            </button>
            <button
              id={`edit-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onEdit(destination)}
              title="সম্পাদনা"
            >
              <Edit2 size={14} />
            </button>
            <button
              id={`delete-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onDelete(_id)}
              title="মুছে ফেলো"
              style={{ color: 'var(--accent-coral)' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="card-location">
          <MapPin size={13} />
          {location}
        </div>

        {description && (
          <p className="card-description">{description}</p>
        )}

        <div className="card-coords">
          <span className="coord-item">
            <MapPin size={10} />
            {latitude?.toFixed(4)}°N
          </span>
          <span className="coord-item">
            {longitude?.toFixed(4)}°E
          </span>
        </div>

        {/* Map / Navigate button */}
        <div className="card-actions">
          <button
            id={`navigate-${_id}`}
            className="btn btn-map"
            onClick={() => onNavigate(destination)}
          >
            <Navigation size={15} />
            মানচিত্রে দেখো
          </button>
        </div>
      </div>
    </article>
  );
}
