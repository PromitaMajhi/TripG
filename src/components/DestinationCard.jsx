import { MapPin, Navigation, Edit3, Trash2, CheckCircle2, Circle, Route } from 'lucide-react';

const CATEGORY_TAGS = {
  manjalpur: 'Manjalpur Side',
  'old-city': 'Old City',
  bajwada: 'Bajwada Side',
  navapura: 'Navapura',
  kishanwadi: 'Kishanwadi',
  darshan: 'Darshan',
  other: 'Vadodara',
};

export default function DestinationCard({ destination, onEdit, onDelete, onToggleVisited, onNavigate }) {
  const {
    _id,
    stopNumber,
    name,
    location,
    distance,
    description,
    latitude,
    longitude,
    imageUrl,
    category,
    visited,
  } = destination;

  const categoryLabel = CATEGORY_TAGS[category] || category || 'Tour Stop';

  return (
    <article className="card">
      {/* Image & Badges */}
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
          🛕
        </div>

        <div className="card-image-overlay" />

        {/* Stop Number Badge */}
        <span className="card-stop-badge">
          Stop #{stopNumber || 1}
        </span>

        {/* Category / Area Badge */}
        <span className={`card-category-badge cat-${category || 'other'}`}>
          {categoryLabel}
        </span>

        {/* Visited Status Badge */}
        {visited && (
          <span className="card-visited-badge">
            ✓ Visited
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-name">{name}</h3>
          <div className="card-menu">
            <button
              id={`edit-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onEdit(destination)}
              title="Edit Stop"
              aria-label="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              id={`delete-${_id}`}
              className="btn btn-ghost btn-icon"
              onClick={() => onDelete(_id)}
              title="Delete Stop"
              aria-label="Delete"
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

        {/* Distance from previous stop */}
        {distance && (
          <div className="card-distance-tag">
            <Route size={13} />
            <span>{distance}</span>
          </div>
        )}

        {description && (
          <p className="card-description">{description}</p>
        )}

        {/* Coordinates & Visited Toggle */}
        <div className="card-meta-row">
          <div className="card-coords">
            <span className="coord-item">
              GPS: {latitude?.toFixed(4)}°, {longitude?.toFixed(4)}°
            </span>
          </div>

          <button
            id={`toggle-visited-${_id}`}
            className={`card-visited-toggle-btn ${visited ? 'active' : ''}`}
            onClick={() => onToggleVisited(destination)}
            title={visited ? 'Mark as Not Visited' : 'Mark as Visited'}
          >
            {visited ? (
              <>
                <CheckCircle2 size={14} />
                <span>Visited</span>
              </>
            ) : (
              <>
                <Circle size={14} />
                <span>To Visit</span>
              </>
            )}
          </button>
        </div>

        {/* Prominent Google Maps Navigation Button */}
        <div className="card-actions">
          <button
            id={`navigate-${_id}`}
            className="btn btn-map"
            onClick={() => onNavigate(destination)}
            aria-label={`Open Google Maps navigation to ${name}`}
          >
            <Navigation size={18} />
            <span>Navigate on Google Maps</span>
          </button>
        </div>
      </div>
    </article>
  );
}
