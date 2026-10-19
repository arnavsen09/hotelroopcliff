import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking, formatCurrency } from '../context/BookingContext';
import { Footer } from '../components/Footer';

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
          <span className="eyebrow light">ROOMS &amp; SUITES</span>
          <h1>
            Find your kind of
            <br />
            <em>comfortable.</em>
          </h1>
          <p>
            Explore the room types listed for Roop Cliff. Rates below are a third-party listing snapshot and may vary with dates, offers and availability.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　ROOMS
        </div>

        <section className="content-wrap">
          <div className="notice">
            Rates shown are illustrative MakeMyTrip listing snapshots for sample dates, not guaranteed direct-booking rates. Confirm current pricing, taxes and inventory with the hotel. Listing photos are externally hosted and reuse permission should be confirmed before launch.
          </div>

          <div className="room-list">
            {rooms.filter((r) => r.available !== false).map((room) => (
              <article
                key={room.name}
                className="room-list-card"
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
                <img src={room.img} alt={`${room.name} photo from hotel listing`} />
                <div className="room-list-copy">
                  <span className="eyebrow">
                    {room.area.toUpperCase()} · UP TO {room.guests} GUESTS
                  </span>
                  <h3>{room.name}</h3>
                  <p>{room.desc}</p>
                  <div className="chips">
                    <span>{room.bed}</span>
                    <span>City view</span>
                    <span>Air conditioning</span>
                  </div>
                  <div className="rate-row">
                    <div>
                      <small>Indicative room-only rate from</small>
                      <br />
                      <strong>{formatCurrency(room.rate)}</strong>{' '}
                      <small>/ night + {formatCurrency(room.tax)} taxes</small>
                    </div>
                    <Link
                      className="button button-dark"
                      to={`/booking?room=${encodeURIComponent(room.name)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBooking({ room: room.name });
                      }}
                    >
                      Choose room <span>↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
