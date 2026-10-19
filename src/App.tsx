import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { EnquiryModal } from './components/EnquiryModal';
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { BookingPage } from './pages/BookingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { GalleryPage } from './pages/GalleryPage';
import { DiningPage } from './pages/DiningPage';
import { LocationPage } from './pages/LocationPage';
import { AdminPage } from './pages/AdminPage';

const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Legacy .html route redirects for backward compatibility */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/rooms.html" element={<Navigate to="/rooms" replace />} />
        <Route path="/booking.html" element={<Navigate to="/booking" replace />} />
        <Route path="/checkout.html" element={<Navigate to="/checkout" replace />} />
        <Route path="/payment.html" element={<Navigate to="/payment" replace />} />
        <Route path="/confirmation.html" element={<Navigate to="/confirmation" replace />} />
        <Route path="/gallery.html" element={<Navigate to="/gallery" replace />} />
        <Route path="/dining.html" element={<Navigate to="/dining" replace />} />
        <Route path="/location.html" element={<Navigate to="/location" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
      <EnquiryModal />
    </div>
  );
};

export default App;
