import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking, formatCurrency } from '../context/BookingContext';
import { Footer } from '../components/Footer';
import { CardTilt } from '../components/CardTilt';

export const RoomsPage: React.FC = () => {
  const { updateBooking, rooms } = useBooking();
  const navigate = useNavigate();

  const handleChooseRoom = (roomName: string) => {
    updateBooking({ room: roomName });
    navigate(`/booking?room=${encodeURIComponent(roomName)}`);
  };

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">ROYAL ACCOMMODATION</span>
          <h1>
            Signature Suites
            <br />
            <em>&amp; Deluxe Quarters.</em>
          </h1>
          <p>
            Experience considered luxury in MP Nagar, Bhopal. Designed with soundproofing, custom furnishings, and warm hospitality for discerning travelers.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　SUITES &amp; ROOMS
        </div>

        <section className="content-wrap">
          <div className="notice">
            Direct reservation benefit: verified direct tariffs, flexible cancellation, and priority check-in assistance directly through Roop Cliff Hotel management.
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            {rooms.filter((r) => r.available !== false).map((room) => (
              <CardTilt
                key={room.id || room.name}
                maxTilt={4}
                glare={true}
                className="room-list-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '320px minmax(0, 1fr)',
                  borderRadius: '8px',
                  boxShadow: '0 12px 35px rgba(13, 30, 24, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
                role="link"
                tabIndex={0}
                aria-label={`Choose ${room.name}`}
                onClick={() => handleChooseRoom(room.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChooseRoom(room.name);
                  }
                }}
              >
                <img
                  src={room.img}
                  alt={`${room.name} photograph`}
                  style={{ width: '100%', height: '100%', minHeight: '260px', objectFit: 'cover' }}
                />

                <div className="room-list-copy" style={{ padding: '28px' }}>
                  <span className="eyebrow" style={{ fontSize: '9px', marginBottom: '6px' }}>
                    {room.area.toUpperCase()} · UP TO {room.guests} GUESTS · {room.bed.toUpperCase()}
                  </span>

                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '32px', margin: '0 0 10px', color: 'var(--green-deep)' }}>
                    {room.name}
                  </h3>

                  <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#4C5D54', margin: '0 0 16px' }}>
                    {room.desc}
                  </p>

                  <div className="chips">
                    <span>{room.bed}</span>
                    <span>City View</span>
                    <span>Climate Control</span>
                    <span>Complimentary Wi-Fi</span>
                    <span>Daily Housekeeping</span>
                  </div>

                  <div className="rate-row" style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid rgba(20, 46, 37, 0.1)' }}>
                    <div>
                      <small style={{ fontSize: '10px', color: 'var(--muted)', display: 'block' }}>
                        Tariff from (Room Only)
                      </small>
                      <strong style={{ fontSize: '26px', fontFamily: 'var(--serif)', color: 'var(--green-deep)' }}>
                        {formatCurrency(room.rate)}
                      </strong>{' '}
                      <small style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        / night + {formatCurrency(room.tax)} taxes
                      </small>
                      <div style={{ fontSize: '10px', color: 'var(--gold-dark)', marginTop: '4px' }}>
                        With Breakfast: <strong>{formatCurrency(room.breakfast)}</strong>/night (+ tax)
                      </div>
                    </div>

                    <Link
                      className="button button-gold"
                      to={`/booking?room=${encodeURIComponent(room.name)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBooking({ room: room.name });
                      }}
                    >
                      Reserve Suite <span>↗</span>
                    </Link>
                  </div>
                </div>
              </CardTilt>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
