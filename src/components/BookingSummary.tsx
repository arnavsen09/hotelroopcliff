import React from 'react';
import { useBooking } from '../context/BookingContext';

export const BookingSummary: React.FC = () => {
  const { booking, activeRoom, amount, formatCurrency } = useBooking();

  return (
    <>
      <div className="mini-room">
        <img src={activeRoom.img} alt={activeRoom.name} />
        <div>
          <small>
            {activeRoom.area} · up to {activeRoom.guests} guests
          </small>
          <strong>{activeRoom.name}</strong>
          <small>{activeRoom.bed}</small>
        </div>
      </div>

      <div className="summary-line">
        <span>Stay</span>
        <strong>
          {booking.checkin || 'Select date'} → {booking.checkout || 'Select date'}
        </strong>
      </div>
      <div className="summary-line">
        <span>Duration</span>
        <strong>{amount.nights} night(s)</strong>
      </div>
      <div className="summary-line">
        <span>Rooms</span>
        <strong>{amount.quantity}</strong>
      </div>
      <div className="summary-line">
        <span>Occupancy</span>
        <strong>
          {booking.guests || '1'} adult(s)
          {Number(booking.guests) > 1 && amount.guestAdjustment ? ` (+${formatCurrency(amount.guestAdjustment)}/nt)` : ' (Base)'}
        </strong>
      </div>
      <div className="summary-line">
        <span>Rate plan</span>
        <strong>
          {booking.plan === 'breakfast'
            ? `Artisanal Breakfast (+${formatCurrency(amount.breakfastPerNight || 350)}/nt)`
            : 'Room only'}
        </strong>
      </div>
      {booking.extraBed === 'yes' && (
        <div className="summary-line">
          <span>Extra bed / mattress</span>
          <strong>+{formatCurrency(amount.extraBedPerNight || 750)}/nt</strong>
        </div>
      )}
      <div className="summary-line">
        <span>Nightly tariff</span>
        <strong>{formatCurrency(amount.rate)} / room</strong>
      </div>
      <div className="summary-line">
        <span>Room subtotal</span>
        <strong>{formatCurrency(amount.subtotal)}</strong>
      </div>
      <div className="summary-line">
        <span>Estimated GST (12%)</span>
        <strong>{formatCurrency(amount.taxTotal)}</strong>
      </div>
      <div className="summary-total">
        <span>Estimated Total</span>
        <strong>{formatCurrency(amount.total)}</strong>
      </div>

      <div className="occupancy-note notice" style={{ marginTop: '16px' }}>
        Tariffs scale logically by occupancy. Rates include high-speed Wi-Fi and amenities. Formal reservations subject to hotel check-in policies.
      </div>
    </>
  );
};
