import React, { useState } from 'react';
import { useBooking, getTodayDateString, plusDays, validateStayDates } from '../context/BookingContext';
import { HotelLogo } from './HotelLogo';

export const EnquiryModal: React.FC = () => {
  const { isEnquiryOpen, setIsEnquiryOpen, showToast, rooms, addEnquiry } = useBooking();
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    room: 'Any available room',
    checkin: plusDays(getTodayDateString(), 1),
    checkout: plusDays(getTodayDateString(), 2),
    message: '',
  });

  if (!isEnquiryOpen) return null;

  const handleClose = () => {
    setIsEnquiryOpen(false);
    setSubmittedRef(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const issue = validateStayDates(formData.checkin, formData.checkout);
    if (issue) {
      showToast(issue);
      return;
    }
    const refCode = 'RC-ENQ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    addEnquiry({
      reference: refCode,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      room: formData.room,
      checkin: formData.checkin,
      checkout: formData.checkout,
      message: formData.message,
    });
    setSubmittedRef(refCode);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 26, 20, 0.68)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
      }}
      onClick={handleClose}
    >
      <div
        className={submittedRef ? 'result-dialog' : 'enquiry-dialog'}
        style={{
          position: 'relative',
          display: 'block',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dialog-close" onClick={handleClose} aria-label="Close dialog">
          ×
        </button>

        {!submittedRef ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <HotelLogo size="sm" theme="dark" linkToHome={false} />
            </div>
            <span className="eyebrow">VIP CONCIERGE &amp; RESERVATIONS</span>
            <h2>
              Send a <em>Privileged Request.</em>
            </h2>
            <p className="dialog-sub">
              For presidential suites, wedding party blocks, or corporate tariffs, reach out directly to our management desk in MP Nagar, Bhopal.
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                Your name
                <input
                  name="name"
                  required
                  placeholder="Full name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </label>

              <div className="form-row">
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </label>
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Room preference
                <select
                  name="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                >
                  <option value="Any available room">Any available room</option>
                  {rooms.map((r) => (
                    <option key={r.id || r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-row">
                <label>
                  Check-in
                  <input
                    name="checkin"
                    type="date"
                    min={getTodayDateString()}
                    required
                    value={formData.checkin}
                    onChange={(e) => {
                      const nextCheckin = e.target.value;
                      const nextCheckout =
                        formData.checkout <= nextCheckin ? plusDays(nextCheckin, 1) : formData.checkout;
                      setFormData({ ...formData, checkin: nextCheckin, checkout: nextCheckout });
                    }}
                  />
                </label>
                <label>
                  Check-out
                  <input
                    name="checkout"
                    type="date"
                    min={plusDays(formData.checkin, 1)}
                    required
                    value={formData.checkout}
                    onChange={(e) => setFormData({ ...formData, checkout: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Anything else?
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Guests, requests or questions"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </label>

              <button className="button button-dark full-button" type="submit">
                Preview enquiry <span>↗</span>
              </button>
              <p className="form-legal" style={{ marginTop: '12px' }}>
                Demo only. Do not enter sensitive personal information. No data is transmitted or saved.
              </p>
            </form>
          </>
        ) : (
          <div>
            <div className="result-icon">✓</div>
            <span className="eyebrow">DEMO INTERACTION</span>
            <h2>
              Your stay, <em>in the making.</em>
            </h2>
            <p>
              Thank you, <strong>{formData.name}</strong>. We recorded your preview enquiry for{' '}
              <strong>{formData.room}</strong> from <strong>{formData.checkin}</strong> to{' '}
              <strong>{formData.checkout}</strong>.
            </p>
            <div className="demo-ticket">
              <span>PREVIEW REFERENCE</span>
              <strong>{submittedRef}</strong>
              <small>This is not a real booking confirmation.</small>
            </div>
            <button className="button button-dark full-button" onClick={handleClose}>
              Done <span>↗</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
