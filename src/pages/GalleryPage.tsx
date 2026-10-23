import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { GalleryMediaItem } from '../types';
import { Footer } from '../components/Footer';
import { CardTilt } from '../components/CardTilt';

export const GalleryPage: React.FC = () => {
  const { gallery, isAdminLoggedIn, rooms, updateBooking } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video' | 'rooms' | 'exterior' | 'dining'>('all');
  const [selectedMedia, setSelectedMedia] = useState<GalleryMediaItem | null>(null);

  const filteredItems = gallery.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'image') return item.type === 'image';
    if (activeTab === 'video') return item.type === 'video';
    if (activeTab === 'rooms') return item.category === 'rooms';
    if (activeTab === 'exterior') return item.category === 'exterior';
    if (activeTab === 'dining') return item.category === 'dining';
    return true;
  });

  const handleBookRoom = (roomName: string) => {
    updateBooking({ room: roomName });
    navigate(`/booking?room=${encodeURIComponent(roomName)}`);
  };

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">HOTEL VISUAL ARCHIVE</span>
          <h1>
            The Sanctuary in
            <br />
            <em>Pictures &amp; Motion.</em>
          </h1>
          <p>
            Immerse yourself in Roop Cliff Hotel Bhopal. Explore authentic suites, architecture, dining, and hospitality experiences in MP Nagar.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　GALLERY
        </div>

        <section className="content-wrap">
          {/* Controls Bar */}
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <div className="gallery-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`gallery-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Media
              </button>
              <button
                className={`gallery-tab-btn ${activeTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveTab('image')}
              >
                Photos ({gallery.filter((g) => g.type === 'image').length})
              </button>
              <button
                className={`gallery-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTab('video')}
              >
                Videos ({gallery.filter((g) => g.type === 'video').length})
              </button>
              <button
                className={`gallery-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                onClick={() => setActiveTab('rooms')}
              >
                Suites
              </button>
              <button
                className={`gallery-tab-btn ${activeTab === 'exterior' ? 'active' : ''}`}
                onClick={() => setActiveTab('exterior')}
              >
                Exterior
              </button>
              <button
                className={`gallery-tab-btn ${activeTab === 'dining' ? 'active' : ''}`}
                onClick={() => setActiveTab('dining')}
              >
                Dining
              </button>
            </div>

            {isAdminLoggedIn && (
              <Link
                to="/admin"
                className="button button-gold"
                style={{ padding: '8px 16px', minHeight: '36px', fontSize: '10px' }}
              >
                <span>+ Upload New Photos/Videos</span> <span>↗</span>
              </Link>
            )}
          </div>

          {/* Photo & Video Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredItems.map((item) => (
              <CardTilt
                key={item.id}
                maxTilt={7}
                glare={true}
                className="media-card"
                style={{ height: '250px' }}
                onClick={() => setSelectedMedia(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedMedia(item);
                  }
                }}
              >
                {item.type === 'video' ? (
                  <>
                    <img
                      src={item.poster || 'https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200'}
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="media-play-overlay">
                      <div className="play-button-icon">▶</div>
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={item.title} loading="lazy" />
                )}
                <div className="media-card-info">
                  <h4>{item.title}</h4>
                  <span className="media-type-badge">{item.type}</span>
                </div>
              </CardTilt>
            ))}
          </div>
        </section>

        {/* Media Lightbox / Video Modal */}
        {selectedMedia && (
          <div
            className="dialog-backdrop"
            onClick={() => setSelectedMedia(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedMedia.title}
          >
            <div
              className="media-modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '900px',
                width: '94%',
                background: 'var(--green-deep)',
                color: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--gold)',
                position: 'relative',
              }}
            >
              <button
                className="dialog-close"
                style={{ color: '#fff', zIndex: 10 }}
                onClick={() => setSelectedMedia(null)}
                aria-label="Close modal"
              >
                &times;
              </button>

              <div style={{ position: 'relative', background: '#000', maxHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.url}
                    poster={selectedMedia.poster}
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '24px', color: 'var(--gold-light)' }}>
                    {selectedMedia.title}
                  </h3>
                  {selectedMedia.caption && (
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#B3C7BD' }}>
                      {selectedMedia.caption}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/booking" className="button button-gold" style={{ padding: '8px 18px', fontSize: '10px' }}>
                    Reserve Suite <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer variant="site" />
    </>
  );
};
