import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { BookingSummary } from '../components/BookingSummary';
import { Footer } from '../components/Footer';

export const CheckoutPage: React.FC = () => {
  const { booking, updateBooking } = useBooking();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(booking.guest?.firstName || '');
  const [lastName, setLastName] = useState(booking.guest?.lastName || '');
  const [email, setEmail] = useState(booking.guest?.email || '');
  const [phone, setPhone] = useState(booking.guest?.phone || '');
  const [request, setRequest] = useState(booking.guest?.request || '');
  const [acknowledged, setAcknowledged] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBooking({
      guest: {
        firstName,
        lastName,
        email,
        phone,
        request,
      },
    });
    navigate('/payment');
  };

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">GUEST DETAILS</span>
          <h1>
            One step closer
            <br />
            to <em>your stay.</em>
          </h1>
          <p>
            Enter guest details to preview the next step. This demo does not transmit or store personal data.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　<Link to="/booking">BOOKING</Link>　/　GUEST DETAILS
        </div>

        <section className="content-wrap">
          <div className="progress-steps">
            <span>01　Stay &amp; room</span>
            <span className="active">02　Guest details</span>
            <span>03　Payment</span>
            <span>04　Confirmation</span>
          </div>

          <div className="two-col">
            <div className="surface-card">
              <h2>Who is staying?</h2>
              <form id="checkoutForm" onSubmit={handleSubmit}>
                <div className="field-grid">
                  <label className="form-field">
                    FIRST NAME
                    <input
                      name="firstName"
                      required
                      autoComplete="given-name"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    LAST NAME
                    <input
                      name="lastName"
                      required
                      autoComplete="family-name"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    EMAIL ADDRESS
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    MOBILE NUMBER
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+91"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                </div>

                <label className="form-field">
                  SPECIAL REQUEST (OPTIONAL)
                  <textarea
                    name="request"
                    rows={3}
                    placeholder="Arrival notes or accessibility requests"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                  />
                </label>

                <label
                  className="form-field"
                  style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '10px' }}
                >
                  <input
                    type="checkbox"
                    required
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    style={{ width: 'auto', marginTop: '2px' }}
                  />
                  <span>
                    I understand this is a demo checkout and no real booking or payment will be created.
                  </span>
                </label>

                <button className="button button-dark full-button" type="submit">
                  Continue to payment preview <span>↗</span>
                </button>
              </form>

              <p className="fine-print">
                For safety, do not enter real personal information into this demonstration website.
              </p>
            </div>

            <aside className="summary-card">
              <h3>Booking summary</h3>
              <BookingSummary />
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
