import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, formatCurrency } from '../context/BookingContext';
import { Footer } from '../components/Footer';
import { Room } from '../types';

export const RoomsPage: React.FC = () => {
  const { updateBooking, rooms } = useBooking();
  const navigate = useNavigate();
  const [selectedRoomModal, setSelectedRoomModal] = useState<Room | null>(null);

  // Four signature room categories matching the exact editorial specifications
  const roomData = [
    {
      name: 'Deluxe Room',
      eyebrow: 'KING BED · APPROX. 280 SQ FT',
      subtitle: 'A calm, well-appointed room for business travellers and short city stays.',
      image: '/deluxe room.jpeg',
      imagePosition: 'left' as const,
      amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Television'],
      rate: 3200,
      bed: 'King Bed',
      area: 'approx. 280 sq ft',
      guests: '2 Guests',
    },
    {
      name: 'Cliff Twin',
      eyebrow: 'TWO SINGLE BEDS · APPROX. 280 SQ FT',
      subtitle: 'Two separate beds for colleagues, friends or family travelling together.',
      image: '/cliff twin.jpeg',
      imagePosition: 'right' as const,
      amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Television'],
      rate: 3400,
      bed: 'Two Single Beds',
      area: 'approx. 280 sq ft',
      guests: '2 Guests',
    },
    {
      name: 'Super Luxe',
      eyebrow: 'KING BED · APPROX. 350 SQ FT',
      subtitle: 'More space to unwind, with a generous king bed and a quiet work corner.',
      image: '/super luxe.jpeg',
      imagePosition: 'left' as const,
      amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Television'],
      rate: 4200,
      bed: 'King Bed',
      area: 'approx. 350 sq ft',
      guests: '2-3 Guests',
    },
    {
      name: 'Cliff Suite',
      eyebrow: 'KING BED · APPROX. 425 SQ FT',
      subtitle: 'Our most spacious category, with a separate sitting area for longer stays.',
      image: '/cliff suit.jpeg',
      imagePosition: 'right' as const,
      amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Television'],
      rate: 5750,
      bed: 'King Bed',
      area: 'approx. 425 sq ft',
      guests: 'Up to 3 Guests',
    },
  ];

  const handleRequestRoom = (roomName: string) => {
    updateBooking({ room: roomName });
    navigate(`/booking?room=${encodeURIComponent(roomName)}`);
  };

  const handleOpenDetails = (roomName: string) => {
    const found = rooms.find((r) => r.name.toLowerCase() === roomName.toLowerCase());
    if (found) {
      setSelectedRoomModal(found);
    } else {
      const fallback = roomData.find((r) => r.name === roomName);
      if (fallback) {
        setSelectedRoomModal({
          id: roomName.toLowerCase().replace(/\s+/g, '-'),
          name: fallback.name,
          subtitle: fallback.subtitle,
          area: fallback.area,
          bed: fallback.bed,
          guests: 2,
          rate: fallback.rate,
          breakfast: fallback.rate + 350,
          tax: Math.round(fallback.rate * 0.12),
          breakfastTax: Math.round((fallback.rate + 350) * 0.12),
          img: fallback.image,
          desc: fallback.subtitle,
          amenities: fallback.amenities,
        });
      }
    }
  };

  return (
    <>
      <main style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', color: '#142E25' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 24px 100px' }}>
          {/* Editorial Header Section */}
          <header style={{ marginBottom: '60px' }}>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                lineHeight: 1.08,
                fontWeight: 500,
                color: '#142E25',
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              Rooms for every
              <br />
              kind of trip.
            </h1>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13.5px',
                color: '#64756D',
                maxWidth: '620px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Room details are preliminary and awaiting confirmation from the hotel. Images are illustrative.
            </p>
          </header>

          {/* Alternating 2-Column Room Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {roomData.map((room) => {
              const imageCol = (
                <div
                  key="img"
                  style={{
                    flex: '1 1 50%',
                    minWidth: '280px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(20, 46, 37, 0.08)',
                    height: '340px',
                    maxHeight: '360px',
                    backgroundColor: '#EBE5DC',
                  }}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                </div>
              );

              const contentCol = (
                <div
                  key="content"
                  style={{
                    flex: '1 1 50%',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '10px 0',
                  }}
                >
                  {/* Eyebrow: Bed · Area */}
                  <span
                    style={{
                      fontFamily: 'Cinzel, Georgia, serif',
                      fontSize: '9.5px',
                      letterSpacing: '0.22em',
                      fontWeight: 700,
                      color: '#AA8222',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                      display: 'block',
                    }}
                  >
                    {room.eyebrow}
                  </span>

                  {/* Title */}
                  <h2
                    style={{
                      fontFamily: 'Cormorant Garamond, Georgia, serif',
                      fontSize: 'clamp(32px, 3.8vw, 44px)',
                      fontWeight: 500,
                      color: '#142E25',
                      margin: '0 0 12px',
                      lineHeight: 1.15,
                    }}
                  >
                    {room.name}
                  </h2>

                  {/* Subtitle */}
                  <p
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '13px',
                      lineHeight: 1.65,
                      color: '#556B60',
                      margin: '0 0 20px',
                      maxWidth: '460px',
                    }}
                  >
                    {room.subtitle}
                  </p>

                  {/* Amenity Badges */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '28px',
                    }}
                  >
                    {room.amenities.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontSize: '10.5px',
                          color: '#4C5D54',
                          backgroundColor: '#FAF8F5',
                          border: '1px solid rgba(20, 46, 37, 0.18)',
                          padding: '4px 10px',
                          borderRadius: '2px',
                          fontWeight: 500,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons: DETAILS & REQUEST THIS ROOM */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(room.name)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #142E25',
                        color: '#142E25',
                        padding: '11px 24px',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#142E25';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.color = '#142E25';
                      }}
                    >
                      DETAILS
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestRoom(room.name)}
                      style={{
                        backgroundColor: '#142E25',
                        border: '1px solid #142E25',
                        color: '#FAF8F5',
                        padding: '11px 24px',
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 14px rgba(20, 46, 37, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0D1E18';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#142E25';
                      }}
                    >
                      REQUEST THIS ROOM
                    </button>
                  </div>
                </div>
              );

              return (
                <article
                  key={room.name}
                  style={{
                    display: 'flex',
                    flexDirection: room.imagePosition === 'left' ? 'row' : 'row-reverse',
                    gap: '48px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {imageCol}
                  {contentCol}
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {/* Details Lightbox Modal */}
      {selectedRoomModal && (
        <div
          className="dialog-backdrop"
          onClick={() => setSelectedRoomModal(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 30, 24, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              maxWidth: '640px',
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          >
            <div style={{ height: '260px', position: 'relative' }}>
              <img
                src={selectedRoomModal.img}
                alt={selectedRoomModal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setSelectedRoomModal(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  backgroundColor: 'rgba(13, 30, 24, 0.8)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <span
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '9px',
                  letterSpacing: '0.22em',
                  color: '#AA8222',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                ROOM SPECIFICATIONS
              </span>
              <h3
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '32px',
                  color: '#142E25',
                  margin: '0 0 10px',
                }}
              >
                {selectedRoomModal.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#556B60', lineHeight: 1.7, margin: '0 0 20px' }}>
                {selectedRoomModal.subtitle || selectedRoomModal.desc}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#FAF8F5',
                  borderRadius: '4px',
                  border: '1px solid rgba(20, 46, 37, 0.08)',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10px', color: '#64756D', textTransform: 'uppercase', display: 'block' }}>
                    Bed Arrangement
                  </span>
                  <strong style={{ fontSize: '13px', color: '#142E25' }}>{selectedRoomModal.bed}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64756D', textTransform: 'uppercase', display: 'block' }}>
                    Room Dimension
                  </span>
                  <strong style={{ fontSize: '13px', color: '#142E25' }}>{selectedRoomModal.area}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64756D', textTransform: 'uppercase', display: 'block' }}>
                    Occupancy
                  </span>
                  <strong style={{ fontSize: '13px', color: '#142E25' }}>
                    Up to {selectedRoomModal.guests} Guests
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#64756D', textTransform: 'uppercase', display: 'block' }}>
                    Direct Tariff
                  </span>
                  <strong style={{ fontSize: '13px', color: '#142E25' }}>
                    {formatCurrency(selectedRoomModal.rate)}/night
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRoomModal(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #142E25',
                    color: '#142E25',
                    padding: '10px 20px',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const roomName = selectedRoomModal.name;
                    setSelectedRoomModal(null);
                    handleRequestRoom(roomName);
                  }}
                  style={{
                    backgroundColor: '#142E25',
                    border: '1px solid #142E25',
                    color: '#FAF8F5',
                    padding: '10px 22px',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Request This Room ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};
