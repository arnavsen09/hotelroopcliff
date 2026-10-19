import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

interface FooterProps {
  variant?: 'site' | 'home';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'site' }) => {
  const currentYear = new Date().getFullYear();
  const { isAdminLoggedIn } = useBooking();

  return (
    <footer className={variant === 'home' ? 'footer' : 'site-footer'}>
      <div className={variant === 'home' ? 'footer-top' : 'site-footer-top'}>
        <Link className="wordmark footer-wordmark" to="/">
          <span className="wordmark-mark">R</span>
          <span>
            ROOP CLIFF<small>BHOPAL</small>
          </span>
        </Link>
        <p style={{ maxWidth: '380px' }}>
          Comfort, considered.
          <br />A quieter way to stay in MP Nagar, Bhopal.
        </p>
        <div className={variant === 'home' ? 'footer-nav' : 'site-footer-links'}>
          <Link to="/rooms">Rooms</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/dining">Dining</Link>
          <Link to="/location">Location</Link>
          <Link to="/booking">Book a stay</Link>
          <Link
            to="/admin"
            style={{
              color: 'var(--gold)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Staff Portal</span> ↗
          </Link>
        </div>
      </div>
      <div className={variant === 'home' ? 'footer-bottom' : 'site-footer-bottom'}>
        <span>© {currentYear} Roop Cliff · Website preview</span>
        <span>
          {isAdminLoggedIn ? (
            <span style={{ color: 'var(--gold)' }}>● Management Session Active (/admin)</span>
          ) : (
            'DEMO BOOKING FLOW · HOTEL ROOP CLIFF'
          )}
        </span>
      </div>
    </footer>
  );
};
