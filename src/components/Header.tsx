import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdminLoggedIn, logoutAdmin } = useBooking();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement">
        <span>MP NAGAR · BHOPAL</span>
        <span>
          A considered stay, close to everything
          {isAdminLoggedIn && (
            <span style={{ marginLeft: '12px', color: '#c09559', fontWeight: 600 }}>
              · Management Active
            </span>
          )}
        </span>
      </div>

      <header className="site-header" id="top">
        <Link to="/" className="wordmark" aria-label="Roop Cliff home" onClick={closeMenu}>
          <span className="wordmark-mark">R</span>
          <span>
            ROOP CLIFF
            <small>BHOPAL</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-expanded={menuOpen}
          aria-controls="navLinks"
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
        </button>

        <nav id="navLinks" className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/rooms" onClick={closeMenu}>
            Rooms
          </Link>
          <Link to="/gallery" onClick={closeMenu}>
            Gallery
          </Link>
          <Link to="/dining" onClick={closeMenu}>
            Dining
          </Link>
          <Link to="/location" onClick={closeMenu}>
            Location
          </Link>
          <Link to="/admin" onClick={closeMenu} style={{ color: isAdminLoggedIn ? 'var(--gold)' : undefined }}>
            {isAdminLoggedIn ? 'Admin Panel ★' : 'Management'}
          </Link>
          <Link className="nav-cta" to="/booking" onClick={closeMenu}>
            Book a stay <span>↗</span>
          </Link>
        </nav>
      </header>
    </>
  );
};
