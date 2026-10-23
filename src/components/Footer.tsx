import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { HotelLogo } from './HotelLogo';

interface FooterProps {
  variant?: 'site' | 'home';
}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const { isAdminLoggedIn, setIsEnquiryOpen } = useBooking();

  return (
    <footer
      className="footer"
      id="contact"
      style={{
        background: '#0D1E18',
        color: '#E2ECE6',
        borderTop: '1px solid rgba(212, 175, 55, 0.28)',
      }}
    >
      <div className="footer-top">
        <div>
          <HotelLogo size="lg" theme="gold" linkToHome={true} />
          {/* Hotel Tagline */}
          <p
            style={{
              marginTop: '16px',
              fontSize: '18px',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
              color: '#F2E3B5',
              letterSpacing: '0.04em',
            }}
          >
            “A considered stay...”
          </p>
          <p
            style={{
              marginTop: '8px',
              fontSize: '13px',
              lineHeight: 1.85,
              color: '#A8BCB1',
              maxWidth: '380px',
            }}
          >
            A bespoke boutique hotel nestled in MP Nagar, Bhopal. Where acoustic quietude, natural daylight, warm hospitality, and timeless comfort come together.
          </p>
        </div>

        <div>
          <span
            style={{
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              fontFamily: 'Cinzel, Georgia, serif',
              color: 'var(--gold)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '14px',
            }}
          >
            HOTEL ADDRESS &amp; CONCIERGE
          </span>
          <p style={{ fontSize: '13px', lineHeight: 1.9, color: '#C8D8D0', margin: 0 }}>
            <strong style={{ color: '#FAF8F5' }}>Hotel Roop Cliff</strong><br />
            Plot No. 33, Zone-I, Maharana Pratap Nagar,<br />
            Near Chetak Bridge, Narmadapuram Road,<br />
            Bhopal, Madhya Pradesh 462011, India
          </p>
          <div style={{ marginTop: '14px', fontSize: '12px', color: '#ECC870' }}>
            Concierge Phone: <a href="tel:+917552553300" className="hover:underline">+91 755 255 3300</a><br />
            Direct Inquiries: <a href="mailto:hotelroopcliff@gmail.com" className="hover:underline">hotelroopcliff@gmail.com</a>
          </div>
        </div>

        <div className="footer-nav">
          <span
            style={{
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              fontFamily: 'Cinzel, Georgia, serif',
              color: 'var(--gold)',
              fontWeight: 700,
              display: 'block',
              marginBottom: '14px',
            }}
          >
            EXPLORE
          </span>
          <Link to="/rooms">Rooms &amp; Suites</Link>
          <Link to="/dining">Bespoke Dining</Link>
          <Link to="/gallery">Hotel Gallery &amp; Photos</Link>
          <Link to="/location">Location &amp; Landmarks</Link>
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#A8BCB1',
              textAlign: 'left',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'inherit',
            }}
            className="hover:text-white transition-colors"
          >
            Direct Inquiry / Concierge
          </button>
          <Link to="/booking">Direct Reservation</Link>
          <Link
            to="/admin"
            style={{
              color: 'var(--gold-light)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            <span>Staff Admin Portal</span> ↗
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {currentYear} Roop Cliff Hotel Bhopal. All rights reserved.</span>
        <span>
          {isAdminLoggedIn ? (
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>● Management Session Active</span>
          ) : (
            'MP Nagar Zone-I · Bhopal, Madhya Pradesh'
          )}
        </span>
      </div>
    </footer>
  );
};
