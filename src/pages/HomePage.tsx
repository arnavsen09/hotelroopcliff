import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useBooking,
  getTodayDateString,
  plusDays,
  validateStayDates,
  formatCurrency,
  calculateNights,
} from '../context/BookingContext';
import { Footer } from '../components/Footer';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { CardTilt } from '../components/CardTilt';
import { Room3DViewer } from '../components/Room3DViewer';
import { HotelLogo } from '../components/HotelLogo';

export const HomePage: React.FC = () => {
  const { booking, updateBooking, showToast, setIsEnquiryOpen, rooms } = useBooking();
  const navigate = useNavigate();

  const [searchCheckin, setSearchCheckin] = useState(booking.checkin || plusDays(getTodayDateString(), 1));
  const [searchCheckout, setSearchCheckout] = useState(booking.checkout || plusDays(getTodayDateString(), 2));
  const [searchGuests, setSearchGuests] = useState(booking.guests || '2');
  const [searchRoomType, setSearchRoomType] = useState(booking.room || (rooms[0] && rooms[0].name) || 'Deluxe Room');
  const [selected3DRoom, setSelected3DRoom] = useState<string>(rooms[0]?.name || 'Deluxe Room');

  const nights = calculateNights(searchCheckin, searchCheckout);

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
      room: searchRoomType,
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
        {/* =========================================================================
            HERO SECTION: 3D EMBEDDED REALM, STARDUST PARTICLES & ROYAL CREST
        ========================================================================= */}
        <section className="hero">
          {/* Three.js 3D Gyroscope with Embossed Gold Royal Medallion */}
          <ThreeCanvas />

          <div className="hero-image" role="img" aria-label="Roop Cliff Hotel Luxury Interior Lounge" />
          <div className="hero-shade" />

          <div className="hero-content">
            {/* Royal Gold Filigree Header Crest Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[rgba(13,30,24,0.7)] backdrop-blur-xl border border-[rgba(212,175,55,0.45)] mb-4 shadow-xl">
              <img
                src="/favicon.svg"
                alt="Roop Cliff Crown"
                className="w-5 h-5 drop-shadow"
              />
              <span className="text-[9px] tracking-[0.26em] uppercase font-bold text-[#F2E3B5]">
                ESTABLISHED IN ZONE-I · BHOPAL
              </span>
            </div>

            <h1>
              An Oasis of Grandeur
              <br />
              in the <em>Heart of Bhopal.</em>
            </h1>

            <p className="hero-copy">
              Welcome to Roop Cliff Hotel — where timeless Indian heritage meets contemporary 5-star hospitality. Discover bespoke suites, quiet architectural comfort, and refined culinary indulgences in MP Nagar.
            </p>

            <div className="flex gap-4 flex-wrap items-center mt-6">
              <Link className="button button-gold" to="/rooms">
                <span>Explore Signature Suites</span>
                <span>↗</span>
              </Link>
              <a
                className="button button-dark"
                href="#virtual-tour"
                style={{
                  background: 'rgba(13, 30, 24, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                }}
              >
                <span>3D Virtual Tour</span>
                <span>▼</span>
              </a>
              <button
                type="button"
                className="button"
                style={{
                  background: 'transparent',
                  color: 'var(--gold-light)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '10px',
                }}
                onClick={() => setIsEnquiryOpen(true)}
              >
                <span>VIP Concierge</span>
                <span>✦</span>
              </button>
            </div>
          </div>

          <div className="hero-note">
            <span className="note-line" />
            <span>
              ROOP CLIFF HOTEL · BHOPAL
              <br />
              <small style={{ color: 'var(--gold)', letterSpacing: '0.15em' }}>
                ZONE-I MAHARANA PRATAP NAGAR
              </small>
            </span>
          </div>

          <div className="hero-index">
            ROOP CLIFF <span>/</span> 5-STAR LUXURY
          </div>
        </section>

        {/* =========================================================================
            FLOATING GLASSMORPHIC RESERVATION CONSOLE
        ========================================================================= */}
        <section className="booking-wrap" id="booking">
          <form id="availabilityForm" className="booking-bar" onSubmit={handleAvailabilitySubmit}>
            <div className="booking-intro">
              <span className="eyebrow" style={{ color: 'var(--gold-dark)', fontSize: '8.5px' }}>
                DIRECT RESERVATION
              </span>
              <strong>Reserve Your Stay</strong>
              <small style={{ fontSize: '9px', color: 'var(--muted)', display: 'block', marginTop: '2px' }}>
                {nights} {nights === 1 ? 'Night' : 'Nights'} · Best rate guarantee with complimentary Wi-Fi
              </small>
            </div>

            <label className="booking-field">
              <span>CHECK-IN DATE</span>
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
              <span>CHECK-OUT DATE</span>
              <input
                id="checkout"
                type="date"
                min={plusDays(searchCheckin, 1)}
                required
                value={searchCheckout}
                onChange={(e) => setSearchCheckout(e.target.value)}
              />
            </label>

            <label className="booking-field">
              <span>GUESTS</span>
              <select
                id="guests"
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
              >
                <option value="1">1 Guest · Solo Traveler</option>
                <option value="2">2 Guests · Couple / Deluxe</option>
                <option value="3">3 Guests · Executive Group</option>
                <option value="4">4 Guests · Family Suite</option>
                <option value="5">5+ Guests · Multi-Suite</option>
              </select>
            </label>

            <label className="booking-field">
              <span>SUITE TYPE</span>
              <select
                value={searchRoomType}
                onChange={(e) => setSearchRoomType(e.target.value)}
              >
                {rooms.map((r) => (
                  <option key={r.id || r.name} value={r.name}>
                    {r.name} ({formatCurrency(r.rate)}/nt)
                  </option>
                ))}
              </select>
            </label>

            <button className="button button-gold" type="submit" style={{ whiteSpace: 'nowrap' }}>
              Check Tariffs <span>↗</span>
            </button>
          </form>

          <p className="demo-note">
            <span className="dot" /> Real-time direct booking channel · Managed live through the hotel management portal
          </p>
        </section>

        {/* =========================================================================
            SECTION 01: THE HERITAGE & SANCTUARY
        ========================================================================= */}
        <section className="intro-section section-pad" id="stay">
          <div className="intro-label">
            <span className="eyebrow">01 / THE SANCTUARY</span>
            <span className="vertical-rule" />
            <span className="muted">TIMELESS HOSPITALITY</span>
          </div>

          <div className="intro-main">
            <h2>
              Where Every Arrival
              <br />
              Feels Like <em>Coming Home.</em>
            </h2>
            <div className="intro-bottom">
              <p>
                Nestled within the commercial epicenter of Maharana Pratap Nagar, Roop Cliff provides an acoustic haven from the city’s pulse. Designed with meticulous attention to soundproofing, plush custom furnishings, and authentic Madhya Pradesh warmth.
              </p>
              <div style={{ display: 'flex', gap: '24px', margin: '24px 0', borderTop: '1px solid var(--line)', paddingTop: '18px' }}>
                <div>
                  <strong style={{ fontSize: '24px', fontFamily: 'var(--serif)', color: 'var(--gold-dark)', display: 'block' }}>
                    4.8 ★
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Guest Review Rating</span>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '24px' }}>
                  <strong style={{ fontSize: '24px', fontFamily: 'var(--serif)', color: 'var(--green-deep)', display: 'block' }}>
                    Zone-I
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Central Prime MP Nagar</span>
                </div>
                <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '24px' }}>
                  <strong style={{ fontSize: '24px', fontFamily: 'var(--serif)', color: 'var(--green-deep)', display: 'block' }}>
                    100%
                  </strong>
                  <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Pure Vegetarian Dining</span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Link className="text-link" to="/dining">
                  Discover Culinary &amp; Concierge <span>↗</span>
                </Link>
                <Link className="text-link" to="/location" style={{ borderColor: 'var(--green-deep)' }}>
                  Transit &amp; Distance Map <span>↗</span>
                </Link>
              </div>
            </div>
          </div>

          <CardTilt maxTilt={6} glare={true} className="intro-photo">
            <img
              src="https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200"
              alt="Roop Cliff Luxury Suite Interior"
              loading="lazy"
            />
            <span className="photo-caption">REFINED TRANQUILITY · SUITE 01</span>
          </CardTilt>
        </section>

        {/* =========================================================================
            NEW FEATURE: 3D INTERACTIVE VIRTUAL SUITE EXPLORER (THREE.JS)
        ========================================================================= */}
        <section className="section-pad bg-[#0B1812] text-white relative overflow-hidden" id="virtual-tour">
          {/* Subtle Ambient Gold Gradient */}
          <div className="absolute inset-0 bg-radial-gradient from-[rgba(212,175,55,0.08)] via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[#D4AF37] text-[9px] uppercase tracking-widest font-semibold mb-3">
                <span>✦</span>
                <span>REAL-TIME 3D ARCHITECTURAL TOUR</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-4">
                Step Inside <em>The Grandeur.</em>
              </h2>
              <p className="text-white/70 text-sm md:text-base font-light">
                Explore our signature suites in interactive 3D. Inspect luxury furnishings, toggle day &amp; night ambiance, and experience the refined acoustics before booking.
              </p>
            </div>

            {/* Three.js 3D Interactive Room Model */}
            <Room3DViewer
              rooms={rooms}
              selectedRoomName={selected3DRoom}
              onSelectRoom={(name) => setSelected3DRoom(name)}
              onBookRoom={(name) => handleRoomClick(name)}
            />
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: SIGNATURE ROOMS & SUITES WITH 3D TILT CARDS
        ========================================================================= */}
        <section className="rooms-section section-pad" id="rooms">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / SIGNATURE SUITES</span>
              <h2>
                Curated Spaces for
                <br />
                <em>Considered Stays.</em>
              </h2>
            </div>
            <p>
              Each suite is outfitted with plush king or twin bedding, smart climate control, high-speed Wi-Fi, and soundproofing for deep, restorative sleep.
            </p>
          </div>

          <div className="room-grid">
            {rooms.filter((r) => r.available !== false).map((room, idx) => (
              <CardTilt
                key={room.id || room.name}
                maxTilt={8}
                glare={true}
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
                    <span className="price-label">ROOM ONLY TARIFF</span>
                    <strong>
                      {formatCurrency(room.rate)}
                      <small> / night</small>
                    </strong>
                    <span className="price-tax">+ {formatCurrency(room.tax)} taxes &amp; fees</span>
                  </div>

                  <div className="breakfast-rate">
                    <span>With Royal Breakfast</span>
                    <strong>
                      {formatCurrency(room.breakfast)}
                      <small> / night</small>
                    </strong>
                  </div>
                </div>

                <div className="room-details">
                  <span>{room.area}</span>
                  <span>Up to {room.guests} Guests</span>
                  <span>{room.bed}</span>
                  <span>City View</span>
                </div>

                <Link
                  className="room-link"
                  to={`/booking?room=${encodeURIComponent(room.name)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateBooking({ room: room.name });
                  }}
                >
                  Reserve Suite <span>↗</span>
                </Link>
              </CardTilt>
            ))}
          </div>

          <p className="fine-print">
            Rates reflect current tariff listings for Roop Cliff Hotel, Bhopal. Breakfast inclusions, extra-bed configurations, and banquet requirements can be customized during booking or directly with the management.
          </p>
        </section>

        {/* =========================================================================
            SECTION 03: LUXURY AMENITIES & EXPERIENCES (GLASSMORPHIC BENTO)
        ========================================================================= */}
        <section className="experience-section" id="experience">
          <div className="experience-photo">
            <img
              src="https://gos3.ibcdn.com/c3155b2b-7d32-40b8-b436-e69452890389.jpeg"
              alt="Roop Cliff Hotel Fine Dining Lounge"
              loading="lazy"
            />
          </div>

          <div className="experience-panel">
            <span className="eyebrow light">03 / BESPOKE EXPERIENCES</span>
            <h2>
              Artisanal Dining.
              <br />
              <em>Effortless Ease.</em>
            </h2>
            <p>
              From our morning vegetarian breakfast spread featuring local specialties to personalized business concierge amenities, Roop Cliff is tuned for discerning business leaders, wedding families, and leisure travelers.
            </p>

            <div className="amenities">
              <div>
                <span className="amenity-icon">✦</span>
                <span>Pure Vegetarian Fine Dining</span>
              </div>
              <div>
                <span className="amenity-icon">⌁</span>
                <span>High-Speed Fiber Connectivity</span>
              </div>
              <div>
                <span className="amenity-icon">◷</span>
                <span>24-Hour Room Concierge</span>
              </div>
              <div>
                <span className="amenity-icon">⌖</span>
                <span>Central Zone-I MP Nagar Hub</span>
              </div>
            </div>

            <div style={{ marginTop: '36px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/dining" className="button button-gold">
                View Dining Inclusions <span>↗</span>
              </Link>
              <Link to="/gallery" className="button button-dark" style={{ border: '1px solid rgba(212, 175, 55, 0.4)' }}>
                Watch Video Walkthrough <span>▶</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: VERIFIED GUEST REVIEWS & ACCOLADES
        ========================================================================= */}
        <section className="section-pad bg-[#F4EFE6] border-y border-[rgba(212,175,55,0.25)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="eyebrow" style={{ color: 'var(--gold-dark)' }}>
                DISCERNING GUESTS
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#0D1E18]">
                Words of <em>Quiet Praise.</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    'The location in Zone-I MP Nagar is unbeatable. Rooms are immaculately clean, beds are exceptionally comfortable, and the staff is genuinely gracious.',
                  author: 'Rajeev Sharma',
                  role: 'Corporate Executive, Mumbai',
                  rating: 5,
                  tag: 'MakeMyTrip Verified Guest',
                },
                {
                  quote:
                    'Stayed here for a family wedding in Bhopal. The rooms are spacious, breakfast was fresh and authentic, and the quiet ambiance was a relief after busy events.',
                  author: 'Dr. Ananya Verma',
                  role: 'Family Visit, New Delhi',
                  rating: 5,
                  tag: 'Google Reviews 5-Star',
                },
                {
                  quote:
                    'Direct booking through their platform was seamless. They accommodated our late check-in with ease and arranged swift transit to Rani Kamlapati station.',
                  author: 'Kunal Singhania',
                  role: 'Business Traveler, Indore',
                  rating: 5,
                  tag: 'Direct Booking Guest',
                },
              ].map((rev, i) => (
                <CardTilt
                  key={i}
                  maxTilt={6}
                  glare={true}
                  className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-[rgba(212,175,55,0.28)] shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-sm italic text-[#16221C] leading-relaxed mb-6 font-serif">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="border-t border-[rgba(212,175,55,0.2)] pt-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-[#0D1E18] font-bold">{rev.author}</strong>
                      <span className="text-[#64756D] text-[11px]">{rev.role}</span>
                    </div>
                    <span className="text-[10px] text-[#AA8222] font-semibold bg-[#AA8222]/10 px-2 py-0.5 rounded">
                      {rev.tag}
                    </span>
                  </div>
                </CardTilt>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 05: PRIME LOCATION & TRAVEL HUBS
        ========================================================================= */}
        <section className="location-section section-pad" id="location">
          <div className="location-copy">
            <span className="eyebrow">04 / THE ADDRESS</span>
            <h2>
              Strategically Located
              <br />
              in <em>Zone-I, MP Nagar.</em>
            </h2>
            <p>
              Located along Narmadapuram Road near Chetak Bridge, Roop Cliff offers swift connectivity to Rani Kamlapati Railway Station (Habibganj), DB City Mall, government secretariats, and Raja Bhoj Airport.
            </p>

            <div className="address-card">
              <span className="address-icon">⌖</span>
              <div>
                <strong>Roop Cliff Hotel</strong>
                <p>
                  Plot No. 33, Zone-I, Maharana Pratap Nagar,
                  <br />
                  Narmadapuram Road, Near Chetak Bridge, Bhopal, MP 462011
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.google.com/maps/search/?api=1&query=Roop+Cliff+MP+Nagar+Bhopal"
                  >
                    Open In Google Maps <span>↗</span>
                  </a>
                  <Link to="/location" className="text-link" style={{ borderColor: 'var(--green-deep)' }}>
                    Transit Directions <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="map-card">
            <div className="map-visual">
              <div className="map-grid" />
              <div className="map-route" />
              <div className="map-pin">
                <span>RC</span>
              </div>
              <div className="map-label">
                ROOP CLIFF HOTEL <small>ZONE-I · CHETAK BRIDGE · BHOPAL</small>
              </div>
              <span className="map-compass">NORTH ↑</span>
            </div>
            <a
              className="map-link"
              href="https://www.google.com/maps/search/?api=1&query=Roop+Cliff+MP+Nagar+Bhopal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Get Chauffeur &amp; Navigation Directions</span>
              <span>↗</span>
            </a>
          </div>
        </section>

        {/* =========================================================================
            CLOSING GRAND CALL TO ACTION WITH AUTHENTIC ROYAL CREST
        ========================================================================= */}
        <section className="closing-cta">
          <div className="flex justify-center mb-6">
            <HotelLogo size="hero" theme="gold" linkToHome={false} />
          </div>
          <span className="eyebrow light">YOUR PRIVATE HAVEN AWAITS</span>
          <h2>
            Experience Hospitality
            <br />
            Rooted in <em>True Grandeur.</em>
          </h2>
          <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button-gold" to="/booking">
              Reserve Your Suite Now <span>↗</span>
            </Link>
            <button
              type="button"
              className="button button-dark"
              style={{ border: '1px solid rgba(212, 175, 55, 0.4)' }}
              onClick={() => setIsEnquiryOpen(true)}
            >
              Enquire for Banquets &amp; Groups <span>↗</span>
            </button>
          </div>
        </section>
      </main>

      <Footer variant="home" />
    </>
  );
};
