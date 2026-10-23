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
import { CardTilt } from '../components/CardTilt';
import { HotelLogo } from '../components/HotelLogo';

export const HomePage: React.FC = () => {
  const { booking, updateBooking, showToast, setIsEnquiryOpen, rooms } = useBooking();
  const navigate = useNavigate();

  const [searchCheckin, setSearchCheckin] = useState(booking.checkin || plusDays(getTodayDateString(), 1));
  const [searchCheckout, setSearchCheckout] = useState(booking.checkout || plusDays(getTodayDateString(), 2));
  const [searchGuests, setSearchGuests] = useState(booking.guests || '2');
  const [searchRoomType, setSearchRoomType] = useState(booking.room || (rooms[0] && rooms[0].name) || 'Deluxe Room');

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
            HERO SECTION: IMMERSIVE SUITE INTERIOR & BRAND IDENTITY
        ========================================================================= */}
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Roop Cliff Hotel Luxury Suite Interior" />
          <div className="hero-shade" />

          <div className="hero-content">
            {/* Header Crest Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[rgba(13,30,24,0.8)] backdrop-blur-xl border border-[rgba(212,175,55,0.45)] mb-4 shadow-xl">
              <img
                src="/logo-gold.png"
                alt="Roop Cliff Crest"
                style={{ height: '18px', width: 'auto', objectFit: 'contain' }}
              />
              <span className="text-[9px] tracking-[0.24em] uppercase font-bold text-[#F2E3B5]">
                ZONE-I · MP NAGAR · BHOPAL
              </span>
            </div>

            <h1>
              An Oasis of Grandeur
              <br />
              in the <em>Heart of Bhopal.</em>
            </h1>

            <p className="hero-copy">
              Welcome to Roop Cliff Hotel — where timeless Indian heritage meets contemporary hospitality. Discover bespoke suites, quiet architectural comfort, and refined culinary indulgences in MP Nagar.
            </p>

            <div className="flex gap-4 flex-wrap items-center mt-6">
              <Link className="button button-gold" to="/rooms">
                <span>Explore Signature Suites</span>
                <span>↗</span>
              </Link>
              <button
                type="button"
                className="button button-dark"
                style={{
                  background: 'rgba(13, 30, 24, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                }}
                onClick={() => setIsEnquiryOpen(true)}
              >
                <span>Direct Inquiry</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CLEAN, PROPERLY ALIGNED RESERVATION CONSOLE
        ========================================================================= */}
        <section className="booking-wrap" id="booking" style={{ position: 'relative', zIndex: 25, marginTop: '-42px' }}>
          <form
            id="availabilityForm"
            onSubmit={handleAvailabilitySubmit}
            style={{
              maxWidth: '1240px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 20px 50px rgba(13, 30, 24, 0.12)',
              padding: '24px 28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
              gap: '20px',
              alignItems: 'end',
            }}
          >
            {/* Direct Reservation Header Strip */}
            <div
              style={{
                gridColumn: '1 / -1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(20, 46, 37, 0.08)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    fontWeight: 700,
                    color: '#AA8222',
                    textTransform: 'uppercase',
                    display: 'block',
                    fontFamily: 'Cinzel, serif',
                  }}
                >
                  DIRECT RESERVATION
                </span>
                <strong
                  style={{
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                    fontSize: '22px',
                    color: '#142E25',
                    fontWeight: 600,
                  }}
                >
                  Reserve Your Stay
                </strong>
              </div>
              <span style={{ fontSize: '11px', color: '#64756D' }}>
                {nights} {nights === 1 ? 'Night' : 'Nights'} · Best direct rate guarantee with complimentary Wi-Fi
              </span>
            </div>

            {/* Check-in */}
            <div>
              <span
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: '#AA8222',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                CHECK-IN DATE
              </span>
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
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(20, 46, 37, 0.18)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#142E25',
                  backgroundColor: '#FAF8F5',
                  outline: 'none',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Check-out */}
            <div>
              <span
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: '#AA8222',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                CHECK-OUT DATE
              </span>
              <input
                id="checkout"
                type="date"
                min={plusDays(searchCheckin, 1)}
                required
                value={searchCheckout}
                onChange={(e) => setSearchCheckout(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(20, 46, 37, 0.18)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#142E25',
                  backgroundColor: '#FAF8F5',
                  outline: 'none',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Guests */}
            <div>
              <span
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: '#AA8222',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                GUESTS
              </span>
              <select
                id="guests"
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(20, 46, 37, 0.18)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#142E25',
                  backgroundColor: '#FAF8F5',
                  outline: 'none',
                  fontWeight: 500,
                }}
              >
                <option value="1">1 Guest · Solo Traveler</option>
                <option value="2">2 Guests · Couple / Deluxe</option>
                <option value="3">3 Guests · Executive Group</option>
                <option value="4">4 Guests · Family Suite</option>
                <option value="5">5+ Guests · Multi-Suite</option>
              </select>
            </div>

            {/* Room Category */}
            <div>
              <span
                style={{
                  fontSize: '8.5px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  color: '#AA8222',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                SUITE CATEGORY
              </span>
              <select
                value={searchRoomType}
                onChange={(e) => setSearchRoomType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid rgba(20, 46, 37, 0.18)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#142E25',
                  backgroundColor: '#FAF8F5',
                  outline: 'none',
                  fontWeight: 500,
                }}
              >
                {rooms.map((r) => (
                  <option key={r.id || r.name} value={r.name}>
                    {r.name} ({formatCurrency(r.rate)}/nt)
                  </option>
                ))}
              </select>
            </div>

            {/* Check Tariffs Button */}
            <div>
              <button
                className="button button-gold"
                type="submit"
                style={{
                  width: '100%',
                  minHeight: '42px',
                  padding: '10px 24px',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>CHECK TARIFFS</span> <span>↗</span>
              </button>
            </div>
          </form>

          <p className="demo-note" style={{ maxWidth: '1240px', margin: '10px auto 0' }}>
            <span className="dot" /> Real-time direct booking channel · Managed live through the hotel management portal
          </p>
        </section>

        {/* =========================================================================
            PROMINENT ARCHITECTURAL SHOWCASE: ONE IMAGE (THE LAST ONE: HOTEL FAÇADE)
        ========================================================================= */}
        <section className="suite-showcase-hero relative overflow-hidden" id="showcase" style={{ background: '#0D1E18', padding: '64px 0 72px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Editorial Kicker */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#D4AF37]/25 gap-4">
              <div>
                <span className="text-[10px] tracking-[0.28em] uppercase font-bold text-[#D4AF37] block mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
                  BOUTIQUE ARCHITECTURE · ZONE-I MP NAGAR
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif text-[#FAF8F5] tracking-tight leading-tight m-0">
                  A Considered Sanctuary <br />
                  <em className="italic text-[#ECC870]">Crafted for Stillness.</em>
                </h2>
              </div>
              <p className="text-sm text-[#A8BCB1] max-w-md font-light leading-relaxed m-0">
                Immerse yourself in our premier accommodation. Central location, acoustic isolation, and tailored hospitality in the heart of MP Nagar, Bhopal.
              </p>
            </div>

            {/* Single Prominent Architectural Image */}
            <div
              className="relative overflow-hidden rounded-md shadow-2xl"
              style={{
                height: '420px',
                maxHeight: '450px',
                width: '100%',
                position: 'relative',
                borderRadius: '6px',
                border: '1px solid rgba(212, 175, 55, 0.35)',
              }}
            >
              <img
                src="/hotel img.jpeg"
                alt="Hotel Roop Cliff Boutique Architecture at Twilight in MP Nagar Bhopal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(13,30,24,0.1) 0%, rgba(13,30,24,0.3) 60%, rgba(13,30,24,0.85) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  color: '#FFFFFF',
                }}
              >
                <div>
                  <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ECC870', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    ZONE-I · MAHARANA PRATAP NAGAR · BHOPAL
                  </span>
                  <h3 style={{ fontSize: '24px', fontFamily: 'Cormorant Garamond, Georgia, serif', margin: 0, color: '#FAF8F5' }}>
                    Hotel Roop Cliff
                  </h3>
                </div>
                <Link
                  to="/rooms"
                  className="button button-gold"
                  style={{ whiteSpace: 'nowrap', fontSize: '10px', padding: '10px 20px' }}
                >
                  <span>Explore Rooms</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 02: SIGNATURE ROOMS & SUITES WITH AUTHENTIC PHOTOGRAPHY
        ========================================================================= */}
        <section className="rooms-section section-pad bg-white" id="rooms">
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / ALL CATEGORIES</span>
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
                    <p>{room.subtitle || room.desc}</p>
                  </div>
                  <span className="room-arrow">↗</span>
                </div>

                <div className="room-price">
                  <div>
                    <span className="price-label">ROOM TARIFF</span>
                    <strong>
                      {room.rateOnRequest ? (
                        <span>On Request / {formatCurrency(room.rate)}</span>
                      ) : (
                        formatCurrency(room.rate)
                      )}
                      <small> / night</small>
                    </strong>
                    <span className="price-tax">+ {formatCurrency(room.tax)} taxes &amp; fees</span>
                  </div>

                  <div className="breakfast-rate">
                    <span>With Breakfast</span>
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
                  {room.name === 'Cliff Suite' ? 'Request This Room' : 'Reserve Suite'} <span>↗</span>
                </Link>
              </CardTilt>
            ))}
          </div>

          <p className="fine-print">
            Rates reflect current verified direct tariff listings for Roop Cliff Hotel, Bhopal. Custom corporate bookings and banquet requirements can be tailored directly with hotel management.
          </p>
        </section>

        {/* =========================================================================
            SECTION 03: LUXURY AMENITIES & EXPERIENCES
        ========================================================================= */}
        <section className="experience-section" id="experience">
          <div className="experience-photo">
            <img
              src="/staff.jpeg"
              alt="Roop Cliff Hotel Hospitality & Executive Chef Team"
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
                View Visual Gallery <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 04: VERIFIED GUEST REVIEWS
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
            SECTION 05: PRIME LOCATION & ADDRESS
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
            CLOSING CALL TO ACTION
        ========================================================================= */}
        <section className="closing-cta">
          <div className="flex justify-center mb-6">
            <HotelLogo size="hero" theme="gold" linkToHome={false} />
          </div>
          <span className="eyebrow light">YOUR PRIVATE HAVEN AWAITS</span>
          <h2>
            Experience Hospitality
            <br />
            Rooted in <em>True Comfort.</em>
          </h2>
          <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="button button-gold" to="/booking">
              Reserve Your Suite Now <span>↗</span>
            </Link>
            <Link
              to="/rooms"
              className="button button-dark"
              style={{ border: '1px solid rgba(212, 175, 55, 0.4)' }}
            >
              Explore All Rooms <span>↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer variant="home" />
    </>
  );
};

export default HomePage;
