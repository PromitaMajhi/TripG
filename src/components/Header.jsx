import { Compass, Plus } from 'lucide-react';

export default function Header({ onAddClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="logo" aria-label="TripG Home">
          <div className="logo-icon">
            <Compass size={20} color="white" />
          </div>
          <span className="logo-text">TripG</span>
        </a>

        <div className="header-actions">
          <button
            id="add-destination-header-btn"
            className="btn btn-primary"
            onClick={onAddClick}
          >
            <Plus size={16} />
            <span className="hide-sm">নতুন যোগ করো</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hide-sm { display: none; }
        }
      `}</style>
    </header>
  );
}
