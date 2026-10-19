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
        <span>Guests</span>
        <strong>{booking.guests || 2} adult(s) total</strong>
      </div>
      <div className="summary-line">
        <span>Rate plan</span>
        <strong>{booking.plan === 'breakfast' ? 'Breakfast included' : 'Room only'}</strong>
      </div>
      <div className="summary-line">
        <span>Extra bed</span>
        <strong>{booking.extraBed === 'yes' ? 'Requested — price not included' : 'No'}</strong>
      </div>
      <div className="summary-line">
        <span>Room subtotal</span>
        <strong>{formatCurrency(amount.subtotal)}</strong>
      </div>
      <div className="summary-line">
        <span>Estimated taxes/fees</span>
        <strong>{formatCurrency(amount.taxTotal)}</strong>
      </div>
      <div className="summary-total">
        <span>Demo total</span>
        <strong>{formatCurrency(amount.total)}</strong>
      </div>

      {booking.extraBed === 'yes' ? (
        <div className="occupancy-note notice" style={{ marginTop: '16px' }}>
          Extra bed/mattress is only a request. Its availability, additional charge and whether breakfast is included must be confirmed with Roop Cliff. No extra-bed fee is included in this estimate.
        </div>
      ) : (
        <div className="occupancy-note notice" style={{ marginTop: '16px' }}>
          This estimate assumes the selected room rate applies to each room. The hotel must confirm maximum guests per room and any extra-person charges.
        </div>
      )}
    </>
  );
};
