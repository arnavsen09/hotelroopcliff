import React from 'react';
import { useBooking } from '../context/BookingContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useBooking();

  return (
    <div
      className={`toast ${toastMessage ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {toastMessage}
    </div>
  );
};
