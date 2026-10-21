import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { HotelLogo } from './HotelLogo';

interface FooterProps {
  variant?: 'site' | 'home';
}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const { isAdminLoggedIn } = useBooking();

  return (
    <footer className="footer" style={{ background: 'var(--green-deep)', color: '#E2ECE6', borderTop: '1px solid rgba(212, 175, 55, 0.28)' }}>
      <div className="footer-top">
        <div>
          <HotelLogo size="lg" theme="gold" linkToHome={true} />
          <p style={{ marginTop: '18px', fontSize: '13px', lineHeight: 1.85, color: '#A8BCB1', maxWidth: '380px' }}>
            A distinguished boutique sanctuary in the heart of Maharana Pratap Nagar, Bhopal. Renowned for gracious royal hospitality, considered suites, and quiet grandeur.
          </p>
        </div>

        <div>
          <span style={{ fontSize: '9px', letterSpacing: '0.22em', fontFamily: 'var(--display)', color: 'var(--gold)', fontWeight: 700, display: 'block', marginBottom: '14px' }}>
            HOTEL ADDRESS &amp; CONCIERGE
          </span>
          <p style={{ fontSize: '12px', lineHeight: 1.9, color: '#C8D8D0', margin: 0 }}>
            Plot No. 33, Zone-I, Maharana Pratap Nagar,<br />
            Near Chetak Bridge, Narmadapuram Road,<br />
            Bhopal, Madhya Pradesh 462011, India
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--gold-light)' }}>
            Concierge: +91 755 255 3300 · info@hotelroopcliff.com
          </div>
        </div>

        <div className="footer-nav">
          <Link to="/rooms">Suites &amp; Rooms</Link>
          <Link to="/gallery">Gallery &amp; Videos</Link>
          <Link to="/dining">Fine Dining</Link>
          <Link to="/location">Location &amp; Map</Link>
          <Link to="/booking">Direct Booking</Link>
          <Link
            to="/admin"
            style={{
              color: 'var(--gold-light)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Staff / Admin Portal</span> ↗
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} Roop Cliff Hotel, Bhopal. All Royal Rights Reserved.</span>
        <span>
          {isAdminLoggedIn ? (
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>● Management Session Active (/admin)</span>
          ) : (
            'Luxury Boutique Stays · Zone-I MP Nagar'
          )}
        </span>
      </div>
    </footer>
  );
};
