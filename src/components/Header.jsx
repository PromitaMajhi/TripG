import { Compass, Plus } from 'lucide-react';

export default function Header({ onAddClick }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <a href="/" className="logo" aria-label="TripG Home">
          <div className="logo-icon">
            <Compass size={22} color="white" />
          </div>
          <div className="logo-text-group">
            <span className="logo-text">TripG</span>
            <span className="logo-subtext">Vadodara Tour</span>
          </div>
        </a>

        <div className="header-actions">
          <button
            id="add-destination-header-btn"
            className="btn btn-primary"
            onClick={onAddClick}
            aria-label="Add New Destination"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            <span>Add Stop</span>
          </button>
        </div>
      </div>
    </header>
  );
}
