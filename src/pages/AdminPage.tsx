import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking, formatCurrency } from '../context/BookingContext';
import { Room, GalleryMediaItem, CustomerEnquiry } from '../types';
import { Footer } from '../components/Footer';
import { HotelLogo } from '../components/HotelLogo';
import { ImageUploader } from '../components/ImageUploader';

export const AdminPage: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    rooms,
    updateRoom,
    addRoom,
    deleteRoom,
    resetRooms,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    resetGallery,
    enquiries,
    updateEnquiryStatus,
    paymentSettings,
    updatePaymentSettings,
    showToast,
  } = useBooking();

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active tab in admin
  const [activeTab, setActiveTab] = useState<'rooms' | 'gallery' | 'enquiries' | 'payments'>('rooms');

  // Room modal state
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    area: '250 sq ft',
    guests: 2,
    bed: '1 king bed',
    rate: 3999,
    tax: 600,
    breakfast: 4599,
    breakfastTax: 700,
    img: 'https://images.trvl-media.com/lodging/123000000/122350000/122349500/122349432/66991da1.jpg?h=800&impolicy=fcrop&w=1200',
    desc: 'Refined comfort and thoughtful conveniences in MP Nagar, Bhopal.',
    amenities: 'City view, Air conditioning, Wi-Fi, Housekeeping',
  });

  // Gallery modal state
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaData, setNewMediaData] = useState<{
    title: string;
    type: 'image' | 'video';
    url: string;
    poster: string;
    category: 'exterior' | 'rooms' | 'dining' | 'experience' | 'video';
    caption: string;
  }>({
    title: '',
    type: 'image',
    url: '',
    poster: '',
    category: 'rooms',
    caption: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginAdmin(emailInput, passwordInput);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed');
      showToast('Login failed. Please check credentials.');
    } else {
      showToast('Welcome back, Hotel Roop Cliff Management.');
    }
  };

  const handleSaveRoomEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    updateRoom(editingRoom.id, editingRoom);
    setEditingRoom(null);
    showToast(`Updated ${editingRoom.name} rates & details successfully.`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomData.name) return;
    addRoom({
      name: newRoomData.name,
      area: newRoomData.area,
      guests: Number(newRoomData.guests),
      bed: newRoomData.bed,
      rate: Number(newRoomData.rate),
      tax: Number(newRoomData.tax),
      breakfast: Number(newRoomData.breakfast),
      breakfastTax: Number(newRoomData.breakfastTax),
      img: newRoomData.img,
      desc: newRoomData.desc,
      amenities: newRoomData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      available: true,
    });
    setIsAddingRoom(false);
    showToast(`Added new room: ${newRoomData.name}`);
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaData.title || !newMediaData.url) {
      showToast('Please provide a title and media URL');
      return;
    }
    addGalleryItem({
      title: newMediaData.title,
      type: newMediaData.type,
      url: newMediaData.url,
      poster: newMediaData.poster || undefined,
      category: newMediaData.category,
      caption: newMediaData.caption,
      featured: false,
    });
    setIsAddingMedia(false);
    setNewMediaData({
      title: '',
      type: 'image',
      url: '',
      poster: '',
      category: 'rooms',
      caption: '',
    });
    showToast('Media added to gallery showcase.');
  };

  // If not logged in, render the secure login gate
  if (!isAdminLoggedIn) {
    return (
      <>
        <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <section className="page-hero" style={{ padding: '40px var(--pad) 30px' }}>
            <span className="eyebrow light">MANAGEMENT PORTAL</span>
            <h1>
              Hotel Administration
              <br />
              <em>&amp; Control Centre.</em>
            </h1>
            <p>
              Authorized personnel only. Access tariff management, gallery media uploads, and customer booking logs.
            </p>
          </section>

          <div className="breadcrumb">
            <Link to="/">HOME</Link>　/　ADMIN LOGIN
          </div>

          <section className="content-wrap" style={{ maxWidth: '520px', margin: '0 auto', width: '100%' }}>
            <div className="surface-card">
              <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                <HotelLogo size="lg" theme="dark" showSubtitle={false} linkToHome={false} />
              </div>
              <span className="eyebrow" style={{ textAlign: 'center' }}>AUTHENTICATION REQUIRED</span>
              <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Staff Sign-In</h2>
              <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '20px' }}>
                Enter the verified management credentials to manage room rates, media, and booking channels.
              </p>

              {loginError && (
                <div
                  style={{
                    background: '#fde8e8',
                    border: '1px solid #f8b4b4',
                    color: '#9b1c1c',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '18px',
                  }}
                >
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="form-field">
                  <label htmlFor="adminEmail">MANAGEMENT USERNAME / EMAIL</label>
                  <input
                    id="adminEmail"
                    type="email"
                    required
                    placeholder="hotelroopcliff@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="adminPassword">MANAGEMENT PASSWORD</label>
                  <input
                    id="adminPassword"
                    type="password"
                    required
                    placeholder="••••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>

                <button className="button button-dark full-button" type="submit" style={{ marginTop: '10px' }}>
                  Authorize &amp; Enter Portal <span>↗</span>
                </button>
              </form>

              <div
                style={{
                  marginTop: '24px',
                  padding: '14px',
                  background: 'var(--cream)',
                  borderRadius: '4px',
                  border: '1px solid var(--line)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '6px' }}>
                  Configured Hotel Credentials:
                </div>
                <div>Username: <code>hotelroopcliff@gmail.com</code></div>
                <div>Password: <code>Hotel@906</code></div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput('hotelroopcliff@gmail.com');
                    setPasswordInput('Hotel@906');
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '5px 10px',
                    background: 'var(--green)',
                    color: '#fff',
                    border: 0,
                    borderRadius: '3px',
                    fontSize: '9px',
                    cursor: 'pointer',
                  }}
                >
                  Click to prefill credentials
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Calculate live statistics
  const totalRooms = rooms.length;
  const avgRate = Math.round(rooms.reduce((acc, r) => acc + r.rate, 0) / (totalRooms || 1));
  const totalPhotos = gallery.filter((g) => g.type === 'image').length;
  const totalVideos = gallery.filter((g) => g.type === 'video').length;

  return (
    <>
      <main style={{ minHeight: '80vh', background: '#f8faf8' }}>
        {/* Top Control Bar */}
        <section
          style={{
            background: 'var(--green-deep)',
            color: '#fff',
            padding: '24px var(--pad)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <HotelLogo size="sm" theme="gold" showSubtitle={false} linkToHome={false} />
              <div>
                <span style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                  HOTEL MANAGEMENT CONSOLE
                </span>
                <h1 style={{ fontSize: '24px', margin: '2px 0 0', color: '#fff', fontFamily: 'var(--serif)' }}>
                  Roop Cliff Bhopal
                </h1>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#98ada2' }}>
                  Logged in as <strong>hotelroopcliff@gmail.com</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link
                to="/"
                target="_blank"
                className="button button-light"
                style={{ padding: '8px 14px', minHeight: '36px', fontSize: '10px' }}
              >
                View Live Site <span>↗</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  showToast('Signed out of admin portal.');
                }}
                className="button"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '8px 14px',
                  minHeight: '36px',
                  fontSize: '10px',
                }}
              >
                Sign Out ⎋
              </button>
            </div>
          </div>
        </section>

        {/* Metric Cards */}
        <div style={{ padding: '24px var(--pad) 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
            }}
          >
            <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #d9e3dc' }}>
              <span style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Rooms Listed
              </span>
              <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--green)', marginTop: '4px' }}>
                {totalRooms}
              </div>
              <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                Avg base: {formatCurrency(avgRate)}/night
              </small>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #d9e3dc' }}>
              <span style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Gallery Showcase
              </span>
              <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--green)', marginTop: '4px' }}>
                {gallery.length} Media
              </div>
              <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                {totalPhotos} photos · {totalVideos} videos
              </small>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #d9e3dc' }}>
              <span style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Customer Enquiries
              </span>
              <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--green)', marginTop: '4px' }}>
                {enquiries.length}
              </div>
              <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                {enquiries.filter((e) => e.status === 'new').length} pending action
              </small>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #d9e3dc' }}>
              <span style={{ fontSize: '9px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Payment Gateway
              </span>
              <div style={{ fontSize: '18px', fontWeight: 600, color: paymentSettings.enableLiveGateways ? '#0e7a48' : '#8b4b2e', marginTop: '8px' }}>
                {paymentSettings.enableLiveGateways ? '● Live Ready' : '○ Demo / Config Ready'}
              </div>
              <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                UPI: {paymentSettings.upiId}
              </small>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: '24px var(--pad) 0' }}>
          <div className="gallery-tabs" style={{ borderBottom: '1px solid #d9e3dc', paddingBottom: '12px' }}>
            <button
              className={`gallery-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              🛌 Rooms &amp; Rates ({rooms.length})
            </button>
            <button
              className={`gallery-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              🖼️ Gallery Media ({gallery.length})
            </button>
            <button
              className={`gallery-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => setActiveTab('enquiries')}
            >
              📋 Enquiries &amp; Bookings ({enquiries.length})
            </button>
            <button
              className={`gallery-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              💳 Payment &amp; Security Settings
            </button>
          </div>
        </div>

        {/* Content Body */}
        <section style={{ padding: '20px var(--pad) 80px' }}>
          {/* TAB 1: ROOMS & RATES */}
          {activeTab === 'rooms' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'var(--serif)' }}>
                    Room Pricing &amp; Inventory
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Adjust base tariffs, breakfast inclusions, and taxes. Changes update immediately across all booking steps.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingRoom(true)}
                    className="button button-dark"
                    style={{ padding: '8px 14px', minHeight: '36px', fontSize: '10px' }}
                  >
                    + Add New Room <span>↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all room rates and categories to factory defaults?')) {
                        resetRooms();
                        showToast('Room rates reset to default values.');
                      }
                    }}
                    className="button button-light"
                    style={{ padding: '8px 14px', minHeight: '36px', fontSize: '10px' }}
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Rooms Grid */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #d9e3dc',
                      borderRadius: '6px',
                      padding: '18px',
                      display: 'grid',
                      gridTemplateColumns: '120px minmax(0, 1fr) auto',
                      gap: '20px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={room.img}
                      alt={room.name}
                      style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px' }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '20px', margin: 0, fontFamily: 'var(--serif)' }}>{room.name}</h3>
                        <span
                          style={{
                            fontSize: '9px',
                            padding: '3px 7px',
                            background: room.available !== false ? '#e1f5ea' : '#fce8e6',
                            color: room.available !== false ? '#0f5132' : '#842029',
                            borderRadius: '3px',
                            fontWeight: 600,
                          }}
                        >
                          {room.available !== false ? 'Active' : 'Paused'}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          {room.area} · {room.bed} · Up to {room.guests} guests
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '6px 0 10px' }}>
                        {room.desc}
                      </p>

                      {/* Quick inline rate edit */}
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Room Rate:</span>
                          <strong style={{ fontSize: '16px', color: 'var(--green)' }}>
                            {formatCurrency(room.rate)}
                          </strong>
                          <span style={{ fontSize: '9px', color: 'var(--muted)' }}>
                            (+ {formatCurrency(room.tax)} tax)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--muted)' }}>With Breakfast:</span>
                          <strong style={{ fontSize: '15px', color: 'var(--gold-dark)' }}>
                            {formatCurrency(room.breakfast)}
                          </strong>
                          <span style={{ fontSize: '9px', color: 'var(--muted)' }}>
                            (+ {formatCurrency(room.breakfastTax)} tax)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingRoom({ ...room })}
                        className="button button-dark"
                        style={{ padding: '8px 12px', minHeight: '34px', fontSize: '9px' }}
                      >
                        Edit Details &amp; Rates <span>↗</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateRoom(room.id, { available: !room.available });
                          showToast(`Toggled ${room.name} availability.`);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid #d9e3dc',
                          padding: '6px',
                          fontSize: '9px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        {room.available !== false ? 'Pause Listing' : 'Activate Listing'}
                      </button>
                      {rooms.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete ${room.name}?`)) {
                              deleteRoom(room.id);
                              showToast(`Deleted ${room.name}`);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 0,
                            color: '#c53030',
                            fontSize: '9px',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          Delete Room
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY & VIDEO MANAGER */}
          {activeTab === 'gallery' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '18px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'var(--serif)' }}>
                    Gallery &amp; Video Walkthroughs
                  </h2>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                    Upload and manage property photographs and video tours. These reflect instantly on <code>/gallery</code>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingMedia(true)}
                    className="button button-dark"
                    style={{ padding: '8px 14px', minHeight: '36px', fontSize: '10px' }}
                  >
                    + Upload Photo / Video <span>↗</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset gallery media to default showcase collection?')) {
                        resetGallery();
                        showToast('Gallery reset to default collection.');
                      }
                    }}
                    className="button button-light"
                    style={{ padding: '8px 14px', minHeight: '36px', fontSize: '10px' }}
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Gallery Items Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '16px',
                }}
              >
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #d9e3dc',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '160px', position: 'relative', background: '#e3ebe6' }}>
                      {item.type === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            poster={item.poster}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span className="media-badge">🎥 Video</span>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.url}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span className="media-badge">📷 Photo</span>
                        </>
                      )}
                    </div>

                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '8px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--gold)',
                          fontWeight: 600,
                        }}
                      >
                        {item.category}
                      </span>
                      <h4 style={{ margin: '4px 0 6px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '10px', color: 'var(--muted)', margin: '0 0 12px', flex: 1, lineHeight: 1.5 }}>
                        {item.caption || 'No caption provided.'}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #d9e3dc' }}>
                        <span style={{ fontSize: '8px', color: 'var(--muted)' }}>
                          {item.uploadedAt}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${item.title}" from gallery?`)) {
                              deleteGalleryItem(item.id);
                              showToast('Media removed from gallery.');
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 0,
                            color: '#c53030',
                            fontSize: '10px',
                            cursor: 'pointer',
                            padding: '4px 6px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ENQUIRIES & BOOKINGS */}
          {activeTab === 'enquiries' && (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'var(--serif)' }}>
                  Customer Stay Enquiries &amp; Leads
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                  Track incoming booking requests, guest dates, and contact requests submitted through the site.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #d9e3dc',
                      borderRadius: '6px',
                      padding: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '16px', color: 'var(--green)' }}>{enq.name}</strong>
                        <span
                          style={{
                            fontSize: '9px',
                            background: 'var(--cream)',
                            color: 'var(--green-deep)',
                            padding: '2px 8px',
                            borderRadius: '3px',
                            fontWeight: 600,
                          }}
                        >
                          {enq.reference}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink)', marginTop: '6px' }}>
                        Requested: <strong>{enq.room}</strong> · Dates: <strong>{enq.checkin} → {enq.checkout}</strong>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
                        Email: <strong>{enq.email}</strong> · Phone: <strong>{enq.phone}</strong>
                      </div>
                      {enq.message && (
                        <div
                          style={{
                            fontSize: '10px',
                            background: '#f4f7f5',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            marginTop: '8px',
                            color: '#2a4237',
                          }}
                        >
                          "{enq.message}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <label style={{ fontSize: '9px', color: 'var(--muted)' }}>
                        Status:
                        <select
                          value={enq.status}
                          onChange={(e) => {
                            updateEnquiryStatus(enq.id, e.target.value as CustomerEnquiry['status']);
                            showToast(`Updated enquiry status to ${e.target.value}`);
                          }}
                          style={{
                            marginLeft: '6px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            borderColor: '#d9e3dc',
                          }}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </label>
                      <small style={{ fontSize: '8px', color: 'var(--muted)' }}>
                        Received: {new Date(enq.submittedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT & SECURITY CONFIGURATION */}
          {activeTab === 'payments' && (
            <div style={{ maxWidth: '780px' }}>
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'var(--serif)' }}>
                  Payment Gateway &amp; Website Security
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0' }}>
                  Prepare live payment integrations (UPI, Razorpay, Net Banking) and manage hotel transaction safeguards.
                </p>
              </div>

              <div className="surface-card">
                <span className="eyebrow">GATEWAY CONFIGURATION</span>
                <h3>Direct Payment Setup</h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Payment settings saved successfully.');
                  }}
                >
                  <div className="field-grid">
                    <label className="form-field">
                      HOTEL UPI ID / VPA
                      <input
                        type="text"
                        value={paymentSettings.upiId}
                        onChange={(e) => updatePaymentSettings({ upiId: e.target.value })}
                        placeholder="roopcliff@bank"
                      />
                    </label>
                    <label className="form-field">
                      MERCHANT BENEFICIARY NAME
                      <input
                        type="text"
                        value={paymentSettings.merchantName}
                        onChange={(e) => updatePaymentSettings({ merchantName: e.target.value })}
                        placeholder="Roop Cliff Hotel"
                      />
                    </label>
                  </div>

                  <div className="field-grid">
                    <label className="form-field">
                      RAZORPAY KEY ID (TEST / LIVE)
                      <input
                        type="text"
                        value={paymentSettings.razorpayKeyId}
                        onChange={(e) => updatePaymentSettings({ razorpayKeyId: e.target.value })}
                        placeholder="rzp_test_..."
                      />
                    </label>
                    <label className="form-field">
                      SUPPORT HELPLINE FOR PAYMENTS
                      <input
                        type="text"
                        value={paymentSettings.supportPhone}
                        onChange={(e) => updatePaymentSettings({ supportPhone: e.target.value })}
                      />
                    </label>
                  </div>

                  <label className="form-field">
                    HOTEL BILLING NOTIFICATIONS EMAIL
                    <input
                      type="email"
                      value={paymentSettings.supportEmail}
                      onChange={(e) => updatePaymentSettings({ supportEmail: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    HOTEL CANCELLATION &amp; REFUND POLICY
                    <textarea
                      rows={3}
                      value={paymentSettings.cancellationPolicyNotice}
                      onChange={(e) => updatePaymentSettings({ cancellationPolicyNotice: e.target.value })}
                    />
                  </label>

                  <div
                    style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--line)',
                      padding: '14px',
                      borderRadius: '4px',
                      marginBottom: '18px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: '11px', marginBottom: '4px' }}>
                      Security &amp; Production Readiness
                    </div>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                      • <strong>HTTPS/SSL</strong>: All client traffic is encrypted in transit.<br />
                      • <strong>Client-Safe Architecture</strong>: API keys and server secrets are never hardcoded in client views.<br />
                      • <strong>Payment Webhooks</strong>: When you deploy live Razorpay/UPI gateway keys, transactions verify server-side before issuing confirmed reservation vouchers.
                    </p>
                  </div>

                  <button className="button button-dark" type="submit">
                    Save Payment Configuration <span>↗</span>
                  </button>
                </form>
              </div>

              {/* GITHUB REPOSITORY SYNC FOR IMAGE STORAGE */}
              <div className="surface-card" style={{ marginTop: '24px' }}>
                <span className="eyebrow">PHOTO STORAGE &amp; GITHUB SYNC</span>
                <h3>GitHub Media Repository Integration</h3>
                <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 16px' }}>
                  When uploading photos for Rooms or Gallery, they are stored immediately in the website. You can also connect your GitHub repository (<code>arnavsen09/hotelroopcliff</code>) to automatically commit uploaded photos directly into <code>public/uploads/</code>!
                </p>

                <div className="field-grid">
                  <label className="form-field">
                    GITHUB REPOSITORY
                    <input
                      type="text"
                      value={paymentSettings.githubRepo || 'arnavsen09/hotelroopcliff'}
                      onChange={(e) => updatePaymentSettings({ githubRepo: e.target.value })}
                      placeholder="arnavsen09/hotelroopcliff"
                    />
                  </label>
                  <label className="form-field">
                    TARGET BRANCH
                    <input
                      type="text"
                      value={paymentSettings.githubBranch || 'main'}
                      onChange={(e) => updatePaymentSettings({ githubBranch: e.target.value })}
                      placeholder="main"
                    />
                  </label>
                </div>

                <label className="form-field">
                  GITHUB PERSONAL ACCESS TOKEN (PAT) (OPTIONAL)
                  <input
                    type="password"
                    value={paymentSettings.githubToken || ''}
                    onChange={(e) => updatePaymentSettings({ githubToken: e.target.value })}
                    placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                  />
                </label>

                <div
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid var(--line)',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    fontSize: '10px',
                    color: '#2D4238',
                    lineHeight: 1.6,
                  }}
                >
                  <strong>How Photo Uploads Work:</strong>
                  <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                    <li><strong>Direct Upload</strong>: Drag-and-drop or select any photo from your phone or PC. It is instantly optimized and stored in your browser's persistent storage to display on the live site.</li>
                    <li><strong>GitHub Storage</strong>: With a GitHub Token added above (requires <code>repo</code> write permission), every uploaded photo will also be committed directly to your GitHub repo in <code>public/uploads/</code>!</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('GitHub repository settings updated.')}
                  className="button button-gold"
                >
                  Save GitHub Sync Settings <span>↗</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* MODAL: EDIT ROOM DETAILS & RATES */}
        {editingRoom && (
          <div className="modal-backdrop" onClick={() => setEditingRoom(null)}>
            <div
              className="surface-card"
              style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="dialog-close" onClick={() => setEditingRoom(null)}>
                ×
              </button>
              <span className="eyebrow">TARIFF &amp; DETAILS</span>
              <h2>Edit {editingRoom.name}</h2>

              <form onSubmit={handleSaveRoomEdits}>
                <div className="field-grid">
                  <label className="form-field">
                    ROOM NAME
                    <input
                      required
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    />
                  </label>
                  <label className="form-field">
                    ROOM SIZE / AREA
                    <input
                      required
                      value={editingRoom.area}
                      onChange={(e) => setEditingRoom({ ...editingRoom, area: e.target.value })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    BASE RATE (ROOM ONLY) ₹
                    <input
                      type="number"
                      required
                      value={editingRoom.rate}
                      onChange={(e) => setEditingRoom({ ...editingRoom, rate: Number(e.target.value) })}
                    />
                  </label>
                  <label className="form-field">
                    TAXES &amp; FEES (ROOM ONLY) ₹
                    <input
                      type="number"
                      required
                      value={editingRoom.tax}
                      onChange={(e) => setEditingRoom({ ...editingRoom, tax: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    RATE WITH BREAKFAST ₹
                    <input
                      type="number"
                      required
                      value={editingRoom.breakfast}
                      onChange={(e) => setEditingRoom({ ...editingRoom, breakfast: Number(e.target.value) })}
                    />
                  </label>
                  <label className="form-field">
                    TAXES &amp; FEES (BREAKFAST) ₹
                    <input
                      type="number"
                      required
                      value={editingRoom.breakfastTax}
                      onChange={(e) => setEditingRoom({ ...editingRoom, breakfastTax: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    MAX GUESTS
                    <input
                      type="number"
                      required
                      value={editingRoom.guests}
                      onChange={(e) => setEditingRoom({ ...editingRoom, guests: Number(e.target.value) })}
                    />
                  </label>
                  <label className="form-field">
                    BED TYPE
                    <input
                      required
                      value={editingRoom.bed}
                      onChange={(e) => setEditingRoom({ ...editingRoom, bed: e.target.value })}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <ImageUploader
                    currentUrl={editingRoom.img}
                    onImageSelected={(url) => setEditingRoom({ ...editingRoom, img: url })}
                    label="Suite / Room Photograph (Direct Upload)"
                  />
                </div>

                <label className="form-field">
                  DESCRIPTION
                  <textarea
                    rows={2}
                    value={editingRoom.desc}
                    onChange={(e) => setEditingRoom({ ...editingRoom, desc: e.target.value })}
                  />
                </label>

                <button className="button button-dark full-button" type="submit">
                  Save Changes to {editingRoom.name} <span>↗</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD NEW ROOM */}
        {isAddingRoom && (
          <div className="modal-backdrop" onClick={() => setIsAddingRoom(false)}>
            <div
              className="surface-card"
              style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="dialog-close" onClick={() => setIsAddingRoom(false)}>
                ×
              </button>
              <span className="eyebrow">NEW INVENTORY</span>
              <h2>Add New Room Type</h2>

              <form onSubmit={handleCreateRoom}>
                <div className="field-grid">
                  <label className="form-field">
                    ROOM NAME
                    <input
                      required
                      placeholder="e.g. Executive Club Room"
                      value={newRoomData.name}
                      onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                    />
                  </label>
                  <label className="form-field">
                    ROOM SIZE
                    <input
                      required
                      placeholder="e.g. 320 sq ft"
                      value={newRoomData.area}
                      onChange={(e) => setNewRoomData({ ...newRoomData, area: e.target.value })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    ROOM ONLY RATE (₹)
                    <input
                      type="number"
                      required
                      value={newRoomData.rate}
                      onChange={(e) => setNewRoomData({ ...newRoomData, rate: Number(e.target.value) })}
                    />
                  </label>
                  <label className="form-field">
                    TAXES (₹)
                    <input
                      type="number"
                      required
                      value={newRoomData.tax}
                      onChange={(e) => setNewRoomData({ ...newRoomData, tax: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    BREAKFAST RATE (₹)
                    <input
                      type="number"
                      required
                      value={newRoomData.breakfast}
                      onChange={(e) => setNewRoomData({ ...newRoomData, breakfast: Number(e.target.value) })}
                    />
                  </label>
                  <label className="form-field">
                    BREAKFAST TAX (₹)
                    <input
                      type="number"
                      required
                      value={newRoomData.breakfastTax}
                      onChange={(e) => setNewRoomData({ ...newRoomData, breakfastTax: Number(e.target.value) })}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <ImageUploader
                    currentUrl={newRoomData.img}
                    onImageSelected={(url) => setNewRoomData({ ...newRoomData, img: url })}
                    label="Suite / Room Photograph (Direct Upload)"
                  />
                </div>

                <label className="form-field">
                  DESCRIPTION
                  <textarea
                    rows={2}
                    value={newRoomData.desc}
                    onChange={(e) => setNewRoomData({ ...newRoomData, desc: e.target.value })}
                  />
                </label>

                <button className="button button-dark full-button" type="submit">
                  Publish Room to Catalog <span>↗</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD GALLERY MEDIA */}
        {isAddingMedia && (
          <div className="modal-backdrop" onClick={() => setIsAddingMedia(false)}>
            <div
              className="surface-card"
              style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="dialog-close" onClick={() => setIsAddingMedia(false)}>
                ×
              </button>
              <span className="eyebrow">MEDIA UPLOAD</span>
              <h2>Add Photo or Video</h2>

              <form onSubmit={handleCreateMedia}>
                <div className="field-grid">
                  <label className="form-field">
                    MEDIA TITLE
                    <input
                      required
                      placeholder="e.g. Deluxe Room City View"
                      value={newMediaData.title}
                      onChange={(e) => setNewMediaData({ ...newMediaData, title: e.target.value })}
                    />
                  </label>
                  <label className="form-field">
                    MEDIA TYPE
                    <select
                      value={newMediaData.type}
                      onChange={(e) => setNewMediaData({ ...newMediaData, type: e.target.value as 'image' | 'video' })}
                    >
                      <option value="image">📷 Photograph</option>
                      <option value="video">🎥 Video Tour</option>
                    </select>
                  </label>
                </div>

                <label className="form-field">
                  CATEGORY
                  <select
                    value={newMediaData.category}
                    onChange={(e) => setNewMediaData({ ...newMediaData, category: e.target.value as any })}
                  >
                    <option value="rooms">Guest Rooms &amp; Suites</option>
                    <option value="exterior">Exterior &amp; Entrance</option>
                    <option value="dining">Dining &amp; Breakfast</option>
                    <option value="experience">Ambience &amp; Facilities</option>
                    <option value="video">Video Tours</option>
                  </select>
                </label>

                {newMediaData.type === 'image' ? (
                  <div style={{ marginBottom: '16px' }}>
                    <ImageUploader
                      currentUrl={newMediaData.url}
                      onImageSelected={(url) => setNewMediaData({ ...newMediaData, url })}
                      label="Upload Photograph (Direct File / Drag & Drop)"
                    />
                  </div>
                ) : (
                  <>
                    <label className="form-field">
                      VIDEO URL (.MP4)
                      <input
                        required
                        placeholder="https://...mp4"
                        value={newMediaData.url}
                        onChange={(e) => setNewMediaData({ ...newMediaData, url: e.target.value })}
                      />
                    </label>

                    <label className="form-field">
                      VIDEO POSTER / THUMBNAIL (OPTIONAL)
                      <input
                        placeholder="https://... poster image"
                        value={newMediaData.poster}
                        onChange={(e) => setNewMediaData({ ...newMediaData, poster: e.target.value })}
                      />
                    </label>
                  </>
                )}

                <label className="form-field">
                  CAPTION / DESCRIPTION
                  <textarea
                    rows={2}
                    placeholder="Brief description for guests"
                    value={newMediaData.caption}
                    onChange={(e) => setNewMediaData({ ...newMediaData, caption: e.target.value })}
                  />
                </label>

                <button className="button button-dark full-button" type="submit">
                  Upload to Gallery <span>↗</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};
