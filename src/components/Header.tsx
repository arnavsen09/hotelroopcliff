import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { HotelLogo } from './HotelLogo';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdminLoggedIn } = useBooking();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Royal Top Announcement */}
      <div className="announcement">
        <span className="flex items-center gap-2">
          <span>ZONE-I · MP NAGAR · BHOPAL</span>
        </span>
        <span className="flex items-center gap-3">
          <span>BESPOKE 5-STAR LUXURY SUITES</span>
          {isAdminLoggedIn ? (
            <span className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded">
              ★ Management Session Active
            </span>
          ) : (
            <Link
              to="/admin"
              className="hover:text-white transition-colors text-[8px] text-white/60 tracking-widest uppercase"
            >
              Staff Portal
            </Link>
          )}
        </span>
      </div>

      {/* Main Glassmorphic Site Header */}
      <header className="site-header" id="top">
        {/* Brand Zone with Authentic Royal Crest */}
        <div className="flex items-center gap-4">
          <HotelLogo size="md" theme="dark" linkToHome={true} />
        </div>

        {/* Mobile Hamburger Toggle */}
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

        {/* Navigation Zone */}
        <nav id="navLinks" className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/rooms"
            onClick={closeMenu}
            className={isActive('/rooms') ? 'active-nav' : ''}
          >
            Suites &amp; Rates
          </Link>
          <Link
            to="/gallery"
            onClick={closeMenu}
            className={isActive('/gallery') ? 'active-nav' : ''}
          >
            3D Tour &amp; Gallery
          </Link>
          <Link
            to="/dining"
            onClick={closeMenu}
            className={isActive('/dining') ? 'active-nav' : ''}
          >
            Dining
          </Link>
          <Link
            to="/location"
            onClick={closeMenu}
            className={isActive('/location') ? 'active-nav' : ''}
          >
            Location
          </Link>
          <Link
            to="/admin"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive('/admin') ? 'active-nav' : ''}`}
            style={{
              color: isAdminLoggedIn ? 'var(--gold-dark)' : undefined,
              fontWeight: isAdminLoggedIn ? 700 : undefined,
            }}
          >
            {isAdminLoggedIn ? 'Admin Panel ★' : 'Management'}
          </Link>

          {/* Primary Action Button */}
          <Link className="nav-cta" to="/booking" onClick={closeMenu}>
            <span>Reserve Stay</span>
            <span className="arrow-icon">↗</span>
          </Link>
        </nav>
      </header>
    </>
  );
};
