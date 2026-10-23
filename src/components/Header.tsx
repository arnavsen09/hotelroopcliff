import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { HotelLogo } from './HotelLogo';

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdminLoggedIn, setIsEnquiryOpen } = useBooking();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="announcement">
        <span className="flex items-center gap-2">
          <span>ZONE-I · MP NAGAR · BHOPAL</span>
        </span>
        <span className="flex items-center gap-3">
          <span>A CONSIDERED BOUTIQUE STAY</span>
          {isAdminLoggedIn ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded text-[8.5px]"
            >
              ★ Management Active
            </Link>
          ) : (
            <Link
              to="/admin"
              className="hover:text-white transition-colors text-[8px] text-white/60 tracking-widest uppercase"
            >
              Management
            </Link>
          )}
        </span>
      </div>

      {/* Minimalist Editorial Luxury Top Header */}
      <header className="site-header" id="top">
        {/* Brand Zone: ROOP CLIFF BHOPAL */}
        <Link
          to="/"
          className="flex items-center gap-3.5 group text-decoration-none outline-none focus-visible:ring-1 focus-visible:ring-[#142E25]"
          aria-label="Roop Cliff Bhopal - Home"
        >
          <img
            src="/logo-transparent.png"
            alt="Roop Cliff Emblem"
            style={{
              height: '38px',
              maxHeight: '38px',
              width: 'auto',
              maxWidth: '120px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div className="flex flex-col">
            <span
              className="text-base sm:text-lg tracking-[0.16em] uppercase font-bold text-[#142E25] whitespace-nowrap"
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              ROOP CLIFF BHOPAL
            </span>
            <span
              className="text-[8px] sm:text-[8.5px] tracking-[0.24em] text-[#64756D] uppercase font-medium"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              BOUTIQUE HOTEL · MP NAGAR
            </span>
          </div>
        </Link>

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

        {/* Navigation Links: Rooms, Dining, Gallery, Location, Contact, Admin + Prominent Dark BOOK A STAY CTA */}
        <nav id="navLinks" className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/rooms"
            onClick={closeMenu}
            className={isActive('/rooms') ? 'active-nav' : ''}
          >
            Rooms
          </Link>
          <Link
            to="/dining"
            onClick={closeMenu}
            className={isActive('/dining') ? 'active-nav' : ''}
          >
            Dining
          </Link>
          <Link
            to="/gallery"
            onClick={closeMenu}
            className={isActive('/gallery') ? 'active-nav' : ''}
          >
            Gallery
          </Link>
          <Link
            to="/location"
            onClick={closeMenu}
            className={isActive('/location') ? 'active-nav' : ''}
          >
            Location
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              setIsEnquiryOpen(true);
            }}
            className="hover:text-[#0D1E18] transition-colors uppercase font-semibold text-[11px] tracking-[0.08em] bg-transparent border-0 cursor-pointer p-0"
            style={{ color: '#2D4238' }}
          >
            Contact
          </button>
          <Link
            to="/admin"
            onClick={closeMenu}
            className={`admin-nav-link ${isActive('/admin') ? 'active-nav' : ''}`}
            style={{
              color: isAdminLoggedIn ? 'var(--gold-dark)' : undefined,
              fontWeight: isAdminLoggedIn ? 700 : undefined,
            }}
          >
            {isAdminLoggedIn ? 'Admin Panel ★' : 'Admin'}
          </Link>

          {/* Prominent Dark Action Button: BOOK A STAY */}
          <Link
            to="/booking"
            onClick={closeMenu}
            className="book-stay-cta"
            style={{
              backgroundColor: '#142E25',
              color: '#FAF8F5',
              border: '1px solid #1D3F33',
              padding: '12px 22px',
              borderRadius: '2px',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(20, 46, 37, 0.25)',
              transition: 'all 0.25s ease',
            }}
          >
            <span>BOOK A STAY</span>
            <span style={{ color: '#D4AF37' }}>↗</span>
          </Link>
        </nav>
      </header>
    </>
  );
};
