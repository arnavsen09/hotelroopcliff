import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking, getTodayDateString, plusDays, validateStayDates } from '../context/BookingContext';
import { BookingSummary } from '../components/BookingSummary';
import { Footer } from '../components/Footer';

export const BookingPage: React.FC = () => {
  const { booking, updateBooking, showToast, rooms } = useBooking();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roomParam = searchParams.get('room');
    if (roomParam && rooms.some((r) => r.name === roomParam)) {
      updateBooking({ room: roomParam });
    }
  }, [searchParams, rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const issue = validateStayDates(booking.checkin, booking.checkout);
    if (issue) {
      showToast(issue);
      return;
    }
    navigate('/checkout');
  };

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">DIRECT BOOKING</span>
          <h1>
            Your stay, your
            <br />
            <em>way.</em>
          </h1>
          <p>
            Select your dates, guests and room. This is a frontend booking preview; live availability is not connected.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　BOOK YOUR STAY
        </div>

        <section className="content-wrap">
          <div className="progress-steps">
            <span className="active">01　Stay &amp; room</span>
            <span>02　Guest details</span>
            <span>03　Payment</span>
            <span>04　Confirmation</span>
          </div>

          <div className="two-col">
            <div className="surface-card">
              <h2>When would you like to stay?</h2>
              <form id="bookingForm" onSubmit={handleSubmit}>
                <div className="field-grid">
                  <label className="form-field">
                    CHECK-IN
                    <input
                      id="bookingCheckin"
                      name="checkin"
                      type="date"
                      min={getTodayDateString()}
                      required
                      value={booking.checkin}
                      onChange={(e) => {
                        const val = e.target.value;
                        const nextCo = booking.checkout <= val ? plusDays(val, 1) : booking.checkout;
                        updateBooking({ checkin: val, checkout: nextCo });
                      }}
                    />
                  </label>
                  <label className="form-field">
                    CHECK-OUT
                    <input
                      id="bookingCheckout"
                      name="checkout"
                      type="date"
                      min={plusDays(booking.checkin, 1)}
                      required
                      value={booking.checkout}
                      onChange={(e) => updateBooking({ checkout: e.target.value })}
                    />
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    ROOMS
                    <select
                      id="bookingRoomQty"
                      name="roomQty"
                      value={booking.roomQty || '1'}
                      onChange={(e) => updateBooking({ roomQty: e.target.value })}
                    >
                      <option value="1">1 room</option>
                      <option value="2">2 rooms</option>
                      <option value="3">3 rooms</option>
                      <option value="4">4 rooms</option>
                    </select>
                  </label>
                  <label className="form-field">
                    ROOM TYPE
                    <select
                      id="bookingRoom"
                      name="room"
                      value={booking.room}
                      onChange={(e) => updateBooking({ room: e.target.value })}
                    >
                      {rooms.filter((r) => r.available !== false).map((r) => (
                        <option key={r.id || r.name} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="field-grid">
                  <label className="form-field">
                    ADULTS
                    <select
                      id="bookingGuests"
                      name="guests"
                      value={booking.guests || '2'}
                      onChange={(e) => updateBooking({ guests: e.target.value })}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                  </label>
                  <label className="form-field">
                    EXTRA BED
                    <select
                      id="bookingExtraBed"
                      name="extraBed"
                      value={booking.extraBed || 'no'}
                      onChange={(e) => updateBooking({ extraBed: e.target.value as 'no' | 'yes' })}
                    >
                      <option value="no">No extra bed</option>
                      <option value="yes">Request extra bed / mattress</option>
                    </select>
                  </label>
                </div>

                <label className="form-field">
                  RATE PLAN
                  <select
                    id="bookingPlan"
                    value={booking.plan || 'room'}
                    onChange={(e) => updateBooking({ plan: e.target.value as 'room' | 'breakfast' })}
                  >
                    <option value="room">Room only</option>
                    <option value="breakfast">Breakfast included (listing rate)</option>
                  </select>
                </label>

                <div className="notice">
                  Room quantity is separate from guest count. Maximum occupancy and extra-bed availability/charges must be confirmed by the hotel. The displayed rates are sample OTA snapshots, not live availability or confirmed direct tariffs.
                </div>

                <button className="button button-dark full-button" type="submit">
                  Continue to guest details <span>↗</span>
                </button>
              </form>
            </div>

            <aside className="summary-card">
              <h3>Your selection</h3>
              <BookingSummary />
              <p className="fine-print">
                Final availability and direct rate must be confirmed by the hotel. No inventory is held in this demo.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
