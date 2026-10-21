import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { BookingSummary } from '../components/BookingSummary';
import { Footer } from '../components/Footer';
import { HotelLogo } from '../components/HotelLogo';

export const ConfirmationPage: React.FC = () => {
  const { booking, resetBooking } = useBooking();

  return (
    <>
      <main>
        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　BOOKING PREVIEW
        </div>

        <section className="content-wrap">
          <div className="surface-card" style={{ maxWidth: '760px', margin: '25px auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <HotelLogo size="md" theme="dark" linkToHome={false} />
            </div>
            <div className="confirmation-mark">✓</div>
            <span className="eyebrow">ROYAL RESERVATION TICKET</span>
            <h1
              style={{
                font: 'clamp(36px,5vw,56px)/1.1 var(--serif)',
                fontWeight: 400,
                margin: '14px 0',
                color: 'var(--green-deep)',
              }}
            >
              Reservation Request
              <br />
              <em>Confirmed.</em>
            </h1>
            <p style={{ fontSize: '12px', lineHeight: 2, color: '#73796f', maxWidth: '560px' }}>
              The front-end booking journey has reached its final screen. This is not a real reservation, booking ID, payment receipt or confirmation from Roop Cliff.
            </p>

            <div style={{ marginTop: '24px', marginBottom: '24px' }}>
              <BookingSummary />
              <div className="summary-line">
                <span>Guest name</span>
                <strong>
                  {booking.guest?.firstName ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest'}
                </strong>
              </div>
              <div className="summary-line">
                <span>Contact</span>
                <strong>{booking.guest?.email || 'name@example.com'}</strong>
              </div>
              <div className="summary-line">
                <span>Payment option selected</span>
                <strong>{booking.paymentMethod || 'UPI (Demo)'}</strong>
              </div>
              <div className="summary-line">
                <span>Demo reference</span>
                <strong style={{ letterSpacing: '0.06em', color: 'var(--gold)' }}>
                  {booking.demoReference || 'RC-DEMO-PREVIEW'}
                </strong>
              </div>
            </div>

            <div className="notice">
              Production launch checklist: connect real room inventory and rate rules, secure server-side booking creation, email/SMS notifications, payment gateway and verified refund/cancellation policies. Do not use this demo flow to accept real guests or money.
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '25px', flexWrap: 'wrap' }}>
              <Link className="button button-dark" to="/" onClick={resetBooking}>
                Return to homepage <span>↗</span>
              </Link>
              <Link className="text-link" to="/rooms">
                Explore rooms <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
