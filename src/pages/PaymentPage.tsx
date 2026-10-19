import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { BookingSummary } from '../components/BookingSummary';
import { Footer } from '../components/Footer';

export const PaymentPage: React.FC = () => {
  const { booking, updateBooking, paymentSettings, addEnquiry, showToast } = useBooking();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(booking.paymentMethod || 'UPI');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const demoRef = 'RC-RES-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    updateBooking({
      paymentMethod: selectedMethod,
      demoReference: demoRef,
    });

    // Also register in admin inquiries list
    addEnquiry({
      reference: demoRef,
      name: `${booking.guest?.firstName || 'Guest'} ${booking.guest?.lastName || ''}`.trim(),
      email: booking.guest?.email || 'guest@example.com',
      phone: booking.guest?.phone || '+91 00000 00000',
      room: booking.room,
      checkin: booking.checkin,
      checkout: booking.checkout,
      message: `Reservation via ${selectedMethod}. Special requests: ${booking.guest?.request || 'None'}`,
    });

    showToast(`Payment method recorded. Generating booking voucher...`);
    navigate('/confirmation');
  };

  return (
    <>
      <main>
        <section className="page-hero">
          <span className="eyebrow light">SECURE CHECKOUT</span>
          <h1>
            A secure step
            <br />
            towards <em>check-in.</em>
          </h1>
          <p>
            Choose your preferred method to complete your reservation. Configured for {paymentSettings.merchantName}.
          </p>
        </section>

        <div className="breadcrumb">
          <Link to="/">HOME</Link>　/　<Link to="/booking">BOOKING</Link>　/　PAYMENT
        </div>

        <section className="content-wrap">
          <div className="progress-steps">
            <span>01　Stay &amp; room</span>
            <span>02　Guest details</span>
            <span className="active">03　Payment</span>
            <span>04　Confirmation</span>
          </div>

          <div className="two-col">
            <div className="surface-card">
              <h2>Choose a payment method</h2>
              <div className="notice" style={{ background: '#eaf4ee', borderColor: 'var(--green)', color: 'var(--ink)' }}>
                <strong>Verified Hotel Channel</strong>: Management has configured merchant accounts for direct check-in.
                {!paymentSettings.enableLiveGateways && (
                  <span> Test simulation mode active until live gateway webhook deployment.</span>
                )}
              </div>

              <form id="paymentForm" onSubmit={handleSubmit}>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="method"
                      value="UPI"
                      checked={selectedMethod === 'UPI'}
                      onChange={() => setSelectedMethod('UPI')}
                    />
                    <span>
                      <strong>Instant UPI Transfer / QR</strong>
                      <small>Pay directly via Google Pay, PhonePe, Paytm ({paymentSettings.upiId})</small>
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="method"
                      value="Credit / debit card"
                      checked={selectedMethod === 'Credit / debit card'}
                      onChange={() => setSelectedMethod('Credit / debit card')}
                    />
                    <span>
                      <strong>Credit / Debit Card</strong>
                      <small>Visa, Mastercard, RuPay &amp; Diners Club cards</small>
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="method"
                      value="Net banking"
                      checked={selectedMethod === 'Net banking'}
                      onChange={() => setSelectedMethod('Net banking')}
                    />
                    <span>
                      <strong>Net Banking</strong>
                      <small>All major Indian banks supported (SBI, HDFC, ICICI, Axis, PNB)</small>
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="method"
                      value="Pay at property"
                      checked={selectedMethod === 'Pay at property'}
                      onChange={() => setSelectedMethod('Pay at property')}
                    />
                    <span>
                      <strong>Pay at Hotel Front Desk</strong>
                      <small>Cash, POS card terminal or UPI accepted during check-in</small>
                    </span>
                  </label>
                </div>

                {selectedMethod === 'UPI' && (
                  <div
                    style={{
                      background: 'var(--cream)',
                      border: '1px solid var(--line)',
                      padding: '14px',
                      borderRadius: '4px',
                      marginTop: '16px',
                    }}
                  >
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 600 }}>
                      HOTEL VPA / UPI ID
                    </span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)', marginTop: '2px' }}>
                      {paymentSettings.upiId}
                    </div>
                    <small style={{ fontSize: '9px', color: 'var(--muted)' }}>
                      Beneficiary: {paymentSettings.merchantName}
                    </small>
                  </div>
                )}

                <div style={{ marginTop: '16px', fontSize: '10px', color: 'var(--muted)' }}>
                  <strong>Cancellation Policy:</strong> {paymentSettings.cancellationPolicyNotice}
                </div>

                <button className="button button-dark full-button" type="submit" style={{ marginTop: '22px' }}>
                  Confirm &amp; Proceed <span>↗</span>
                </button>
              </form>
            </div>

            <aside className="summary-card">
              <h3>Amount summary</h3>
              <BookingSummary />
              <p className="fine-print">
                Need payment assistance? Contact front desk at {paymentSettings.supportPhone} or {paymentSettings.supportEmail}.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
