import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { GalleryMediaItem } from '../types';
import { Footer } from '../components/Footer';

export const GalleryPage: React.FC = () => {
  const { gallery, isAdminLoggedIn } = useBooking();
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

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">PHOTO &amp; VIDEO SHOWCASE</span>
          <h1>
            The place, in
            <br />
            <em>pictures &amp; motion.</em>
          </h1>
          <p>
            Explore guest rooms, twin layouts, exterior views, and property walkthrough videos of Roop Cliff, Bhopal.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　GALLERY
        </div>

        <section className="content-wrap">
          {/* Controls bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
            <div className="gallery-tabs" style={{ marginBottom: 0 }}>
              <button
                className={`gallery-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({gallery.length})
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
                Rooms
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
                className="button button-dark"
                style={{ padding: '8px 14px', minHeight: '36px', fontSize: '9px' }}
              >
                + Manage &amp; Upload Media <span>↗</span>
              </Link>
            )}
          </div>

          {/* Media Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="media-card"
                style={{ height: '240px' }}
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
                    <video
                      src={item.url}
                      poster={item.poster || ''}
                      preload="metadata"
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="video-play-icon">▶</div>
                    <span className="media-badge">🎥 Video</span>
                  </>
                ) : (
                  <>
                    <img src={item.url} alt={item.title} loading="lazy" />
                    <span className="media-badge">📷 Photo</span>
                  </>
                )}

                <div className="media-overlay">
                  <div>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.85, display: 'block' }}>
                      {item.category}
                    </span>
                    <h3 className="media-title">{item.title}</h3>
                    {item.caption && (
                      <p style={{ fontSize: '10px', margin: '4px 0 0', opacity: 0.8, lineHeight: 1.4 }}>
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--cream)', borderRadius: '6px' }}>
              <h3>No media items in this category.</h3>
              <p style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Select another filter or add items via the management panel.
              </p>
            </div>
          )}

          <p className="fine-print" style={{ marginTop: '35px' }}>
            Media managed via the Roop Cliff Management Portal. To upload property photography or video walkthroughs, authenticate into the Staff Portal.
          </p>
        </section>

        {/* Lightbox / Video Modal */}
        {selectedMedia && (
          <div className="modal-backdrop" onClick={() => setSelectedMedia(null)}>
            <div
              style={{
                position: 'relative',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                background: 'var(--green-deep)',
                borderRadius: '8px',
                overflow: 'hidden',
                color: '#fff',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="dialog-close"
                style={{ color: '#fff', zIndex: 10, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: '36px', height: '36px', display: 'grid', placeItems: 'center' }}
                onClick={() => setSelectedMedia(null)}
                aria-label="Close modal"
              >
                ×
              </button>

              <div style={{ background: '#000', maxHeight: '68vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    playsInline
                    style={{ maxHeight: '68vh', width: '100%', outline: 'none' }}
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    style={{ maxHeight: '68vh', maxWidth: '100%', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div style={{ padding: '20px 24px', background: 'var(--green-deep)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      {selectedMedia.type.toUpperCase()} · {selectedMedia.category.toUpperCase()}
                    </span>
                    <h2 style={{ fontSize: '20px', margin: '4px 0 6px', color: '#fff', fontFamily: 'var(--serif)' }}>
                      {selectedMedia.title}
                    </h2>
                    <p style={{ fontSize: '11px', margin: 0, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                      {selectedMedia.caption}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to="/booking"
                      className="button button-light"
                      style={{ padding: '8px 16px', minHeight: '38px', fontSize: '10px' }}
                    >
                      Book a stay <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};
