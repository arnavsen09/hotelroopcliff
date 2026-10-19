import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking, getTodayDateString, plusDays, validateStayDates, formatCurrency } from '../context/BookingContext';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  const { booking, updateBooking, showToast, setIsEnquiryOpen, rooms } = useBooking();
  const navigate = useNavigate();

  const [searchCheckin, setSearchCheckin] = useState(booking.checkin || plusDays(getTodayDateString(), 1));
  const [searchCheckout, setSearchCheckout] = useState(booking.checkout || plusDays(getTodayDateString(), 2));
  const [searchGuests, setSearchGuests] = useState(booking.guests || '2');

  const handleAvailabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const issue = validateStayDates(searchCheckin, searchCheckout);
    if (issue) {
      showToast(issue);
      return;
    }
    updateBooking({
      checkin: searchCheckin,
      checkout: searchCheckout,
      guests: searchGuests,
      roomQty: '1',
      extraBed: 'no',
    });
    navigate('/booking');
  };

  const handleRoomClick = (roomName: string) => {
    updateBooking({ room: roomName });
    navigate(`/booking?room=${encodeURIComponent(roomName)}`);
  };

  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Warm, refined hotel lounge interior" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow light">
              <span /> YOUR CITY, YOUR PACE
            </p>
            <h1>
              A quieter way
              <br />
              to stay in the city.
            </h1>
            <p className="hero-copy">
              Thoughtful comfort, warm hospitality and an easy address in the heart of Bhopal.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link className="button button-light" to="/rooms">
                Explore the rooms <span>↗</span>
              </Link>
              <button
                type="button"
                className="button"
                style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}
                onClick={() => setIsEnquiryOpen(true)}
              >
                Send enquiry <span>↗</span>
              </button>
            </div>
          </div>
          <div className="hero-note">
            <span className="note-line" />
            <span>
              ROOP CLIFF, BHOPAL
              <br />
              <small>MAHARANA PRATAP NAGAR</small>
            </span>
          </div>
          <div className="hero-index">
            01 <span>/</span> 04
          </div>
        </section>

        {/* Availability Search Bar */}
        <section className="booking-wrap" id="booking">
          <form id="availabilityForm" className="booking-bar" onSubmit={handleAvailabilitySubmit}>
            <div className="booking-intro">
              <span className="eyebrow">PLAN YOUR STAY</span>
              <strong>Make room for a little ease.</strong>
            </div>

            <label className="booking-field">
              <span>CHECK-IN</span>
              <input
                id="checkin"
                type="date"
                min={getTodayDateString()}
                required
                value={searchCheckin}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchCheckin(val);
                  if (searchCheckout <= val) {
                    setSearchCheckout(plusDays(val, 1));
                  }
                }}
              />
            </label>

            <label className="booking-field">
              <span>CHECK-OUT</span>
              <input
                id="checkout"
                type="date"
                min={plusDays(searchCheckin, 1)}
                required
                value={searchCheckout}
                onChange={(e) => setSearchCheckout(e.target.value)}
              />
            </label>

            <label className="booking-field guests-field">
              <span>GUESTS</span>
              <select
                id="guests"
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
                <option value="6">6 guests</option>
              </select>
            </label>

            <button className="button button-dark" type="submit">
              Check dates <span>↗</span>
            </button>
          </form>
          <p className="demo-note">
            <span className="dot" /> Preview mode · availability is not connected to hotel inventory
          </p>
        </section>

        {/* Section 01: The Stay */}
        <section className="intro-section section-pad" id="stay">
          <div className="intro-label">
            <span className="eyebrow">01 / THE STAY</span>
            <span className="vertical-rule" />
            <span className="muted">COMFORT, CONSIDERED</span>
          </div>
          <div className="intro-main">
            <h2>
              Good days begin
              <br />
              with <em>feeling at ease.</em>
            </h2>
            <div className="intro-bottom">
              <p>
                Whether you're here for work, a family visit or a few days to explore, Roop Cliff is a welcoming place to settle in and feel at home.
              </p>
              <Link className="text-link" to="/dining">
                Discover the experience <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="intro-photo">
            <img
              src="https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200"
              alt="Roop Cliff guest room interior"
              loading="lazy"
            />
            <span className="photo-caption">A PLACE TO UNWIND</span>
          </div>
        </section>

        {/* Section 02: The Rooms */}
        <section className="rooms-section section-pad" id="rooms">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / THE ROOMS</span>
              <h2>
                Find your kind
                <br />
                of <em>comfortable.</em>
              </h2>
            </div>
            <p>Space to recharge, thoughtful essentials and a restful place to return to.</p>
          </div>

          <div className="room-grid">
            {rooms.filter((r) => r.available !== false).map((room, idx) => (
              <article
                key={room.name}
                className="room-card"
                role="link"
                tabIndex={0}
                aria-label={`View rates and book ${room.name}`}
                onClick={() => handleRoomClick(room.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRoomClick(room.name);
                  }
                }}
              >
                <div className="room-image">
                  <img src={room.img} alt={`${room.name} interior`} loading="lazy" />
                  <span className="room-number">0{idx + 1}</span>
                </div>
                <div className="room-meta">
                  <div>
                    <h3>{room.name}</h3>
                    <p>{room.desc}</p>
                  </div>
                  <span className="room-arrow">↗</span>
                </div>
                <div className="room-price">
                  <div>
                    <span className="price-label">MAKEMYTRIP LISTING · ROOM ONLY</span>
                    <strong>
                      {formatCurrency(room.rate)}
                      <small> / night</small>
                    </strong>
                    <span className="price-tax">+ {formatCurrency(room.tax)} taxes &amp; fees</span>
                  </div>
                  <div className="breakfast-rate">
                    <span>With breakfast</span>
                    <strong>
                      {formatCurrency(room.breakfast)}
                      <small> / night</small>
                    </strong>
                  </div>
                </div>
                <div className="room-details">
                  <span>{room.area}</span>
                  <span>Up to {room.guests} guests</span>
                  <span>{room.bed}</span>
                  <span>City view</span>
                </div>
                <Link
                  className="room-link"
                  to={`/booking?room=${encodeURIComponent(room.name)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBooking({ room: room.name });
                  }}
                >
                  View rates &amp; book <span>↗</span>
                </Link>
              </article>
            ))}
          </div>

          <p className="fine-print">
            Rates shown are a snapshot of MakeMyTrip listing prices for a sample 1-night stay, 26–27 October 2026, for the displayed room options. Breakfast-inclusive rates are shown separately; taxes and fees are additional. OTA offers, dates, occupancy and availability change prices. These are not confirmed direct-booking tariffs; verify with the hotel before launch. Room sizes, bed types and occupancy are based on public listing details. Property photos are sourced from public hotel listings; confirm permission to reuse before public launch.
          </p>
        </section>

        {/* Section 03: The Experience */}
        <section className="experience-section" id="experience">
          <div className="experience-photo">
            <img
              src="https://gos3.ibcdn.com/c3155b2b-7d32-40b8-b436-e69452890389.jpeg"
              alt="Warm hotel lounge inspiration"
              loading="lazy"
            />
          </div>
          <div className="experience-panel">
            <span className="eyebrow light">03 / THE EXPERIENCE</span>
            <h2>
              Thoughtful details.
              <br />
              <em>Uncomplicated stays.</em>
            </h2>
            <p>
              Come back to a calm room after a full day in the city. Enjoy a warm welcome, practical comforts and a location that keeps your plans within reach.
            </p>
            <div className="amenities">
              <div>
                <span className="amenity-icon">✳</span>
                <span>Comfort-led rooms</span>
              </div>
              <div>
                <span className="amenity-icon">⌁</span>
                <span>Connected essentials</span>
              </div>
              <div>
                <span className="amenity-icon">◷</span>
                <span>Helpful hospitality</span>
              </div>
              <div>
                <span className="amenity-icon">⌂</span>
                <span>Convenient city access</span>
              </div>
            </div>
            <p className="fine-print light-fine">Amenities shown are illustrative and require hotel confirmation.</p>
          </div>
        </section>

        {/* Section 04: The Location */}
        <section className="location-section section-pad" id="location">
          <div className="location-copy">
            <span className="eyebrow">04 / THE LOCATION</span>
            <h2>
              Well placed
              <br />
              for <em>what brings you.</em>
            </h2>
            <p>In Maharana Pratap Nagar, a practical base for business, city errands and exploring Bhopal.</p>
            <div className="address-card">
              <span className="address-icon">⌖</span>
              <div>
                <strong>Roop Cliff</strong>
                <p>
                  Plot No. 33, Zone-I, Maharana Pratap Nagar,
                  <br />
                  Narmadapuram Road, Bhopal, Madhya Pradesh 462011
                </p>
                <a
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.google.com/maps/search/?api=1&query=Roop+Cliff+MP+Nagar+Bhopal"
                >
                  Open directions <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="map-card">
            <div className="map-visual">
              <div className="map-grid" />
              <div className="map-route" />
              <div className="map-pin">
                <span>R</span>
              </div>
              <div className="map-label">
                ROOP CLIFF <small>MP NAGAR · BHOPAL</small>
              </div>
              <span className="map-compass">N ↑</span>
            </div>
            <a
              className="map-link"
              href="https://www.google.com/maps/search/?api=1&query=Roop+Cliff+MP+Nagar+Bhopal"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps <span>↗</span>
            </a>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="closing-cta">
          <div className="closing-orb" />
          <span className="eyebrow light">YOUR NEXT STAY STARTS HERE</span>
          <h2>
            Make your time
            <br />
            in Bhopal <em>feel easy.</em>
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button-light" to="/booking">
              Book your stay <span>↗</span>
            </Link>
            <button
              type="button"
              className="button button-dark"
              onClick={() => setIsEnquiryOpen(true)}
            >
              Send an enquiry <span>↗</span>
            </button>
          </div>
        </section>
      </main>

      <Footer variant="home" />
    </>
  );
};
