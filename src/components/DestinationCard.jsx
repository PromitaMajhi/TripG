import { MapPin, Navigation, Edit3, Trash2, CheckCircle2, Circle, Route, Landmark, Building2, Map, Sparkles, Milestone, Compass } from 'lucide-react';

const CATEGORY_TAGS = {
  manjalpur: { label: 'Manjalpur Side', Icon: MapPin },
  'old-city': { label: 'Old City', Icon: Landmark },
  bajwada: { label: 'Bajwada Side', Icon: Building2 },
  navapura: { label: 'Navapura', Icon: Map },
  kishanwadi: { label: 'Kishanwadi', Icon: Sparkles },
  darshan: { label: 'Darshan', Icon: Milestone },
  other: { label: 'Vadodara', Icon: MapPin },
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

  const catConfig = CATEGORY_TAGS[category] || { label: category || 'Tour Stop', Icon: MapPin };
  const CategoryIcon = catConfig.Icon;

  return (
    <article className="card">
      {/* 3D Image & Badges */}
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
        
        {/* 3D Placeholder when photo is not present */}
        <div
          className="card-image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <div className="placeholder-icon-circle">
            <Compass size={28} />
          </div>
        </div>

        <div className="card-image-overlay" />

        {/* 3D Stop Number Badge */}
        <span className="card-stop-badge">
          Stop #{stopNumber || 1}
        </span>

        {/* Category / Area Badge with Vector Icon */}
        <span className={`card-category-badge cat-${category || 'other'}`}>
          <CategoryIcon size={12} />
          <span>{catConfig.label}</span>
        </span>

        {/* Visited Status Badge with Vector Icon */}
        {visited && (
          <span className="card-visited-badge">
            <CheckCircle2 size={13} />
            <span>Visited</span>
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
              style={{ color: '#fb7185' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="card-location">
          <MapPin size={15} />
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

        {/* 3D Google Maps Navigation Button */}
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
