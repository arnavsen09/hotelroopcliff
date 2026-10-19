import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BookingState,
  Room,
  AmountBreakdown,
  GalleryMediaItem,
  CustomerEnquiry,
  HotelPaymentSettings,
} from '../types';
import { INITIAL_ROOMS } from '../data/rooms';
import { INITIAL_GALLERY_ITEMS } from '../data/gallery';

export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export const getTodayDateString = (): string => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const plusDays = (dateStr: string, n: number = 1): string => {
  const base = dateStr || getTodayDateString();
  const d = new Date(base + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const calculateNights = (checkin: string, checkout: string): number => {
  if (!checkin || !checkout) return 1;
  const t1 = new Date(checkin + 'T12:00:00').getTime();
  const t2 = new Date(checkout + 'T12:00:00').getTime();
  return Math.max(1, Math.round((t2 - t1) / 86400000) || 1);
};

export const validateStayDates = (checkin: string, checkout: string): string => {
  if (!checkin || !checkout) return 'Please choose check-in and check-out dates.';
  const today = getTodayDateString();
  if (checkin < today) return 'Check-in cannot be in the past.';
  if (checkout <= checkin) return 'Check-out must be after check-in.';
  return '';
};

const STORAGE_KEY_BOOKING = 'roopCliffBooking';
const STORAGE_KEY_ROOMS = 'roopCliffRooms_v2';
const STORAGE_KEY_GALLERY = 'roopCliffGallery_v2';
const STORAGE_KEY_ENQUIRIES = 'roopCliffEnquiries_v2';
const STORAGE_KEY_SETTINGS = 'roopCliffSettings_v2';
const STORAGE_KEY_ADMIN_AUTH = 'roopCliffAdminAuth_v2';

const initialBookingState: BookingState = {
  checkin: plusDays(getTodayDateString(), 1),
  checkout: plusDays(getTodayDateString(), 2),
  room: INITIAL_ROOMS[0].name,
  roomQty: '1',
  guests: '2',
  extraBed: 'no',
  plan: 'room',
};

const defaultPaymentSettings: HotelPaymentSettings = {
  upiId: 'roopcliff@okhdfcbank',
  merchantName: 'Roop Cliff Hotel & Suites',
  razorpayKeyId: 'rzp_test_placeholder_key',
  razorpaySecretConfigured: false,
  enableLiveGateways: false,
  cancellationPolicyNotice:
    'Free cancellation up to 48 hours prior to check-in. Non-refundable within 24 hours of arrival.',
  supportPhone: '+91 755 255 3300',
  supportEmail: 'hotelroopcliff@gmail.com',
};

interface BookingContextType {
  // Booking state
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
  activeRoom: Room;
  amount: AmountBreakdown;
  formatCurrency: (n: number) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isEnquiryOpen: boolean;
  setIsEnquiryOpen: (open: boolean) => void;

  // Rooms management
  rooms: Room[];
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  deleteRoom: (roomId: string) => void;
  resetRooms: () => void;

  // Gallery management
  gallery: GalleryMediaItem[];
  addGalleryItem: (item: Omit<GalleryMediaItem, 'id' | 'uploadedAt'>) => void;
  updateGalleryItem: (id: string, updates: Partial<GalleryMediaItem>) => void;
  deleteGalleryItem: (id: string) => void;
  resetGallery: () => void;

  // Enquiries & simulated bookings
  enquiries: CustomerEnquiry[];
  addEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'submittedAt' | 'status'>) => CustomerEnquiry;
  updateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;

  // Payment & config
  paymentSettings: HotelPaymentSettings;
  updatePaymentSettings: (settings: Partial<HotelPaymentSettings>) => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Rooms state
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ROOMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch {
      // ignore
    }
  }, [rooms]);

  // 2. Gallery state
  const [gallery, setGallery] = useState<GalleryMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GALLERY_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(gallery));
    } catch {
      // ignore
    }
  }, [gallery]);

  // 3. Enquiries state
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'enq-sample-1',
        reference: 'RC-ENQ-9K2M4P',
        name: 'Vikramaditya Sharma',
        email: 'vikram.sharma@example.com',
        phone: '+91 98260 12345',
        room: 'Deluxe Room',
        checkin: plusDays(getTodayDateString(), 2),
        checkout: plusDays(getTodayDateString(), 4),
        message: 'Requesting quiet city-view room on top floor for corporate visit.',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'new',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
    } catch {
      // ignore
    }
  }, [enquiries]);

  // 4. Payment settings state
  const [paymentSettings, setPaymentSettings] = useState<HotelPaymentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultPaymentSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(paymentSettings));
    } catch {
      // ignore
    }
  }, [paymentSettings]);

  // 5. Admin Authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'authenticated';
    } catch {
      return false;
    }
  });

  const loginAdmin = (user: string, pass: string): { success: boolean; error?: string } => {
    const trimmedUser = user.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (trimmedUser === 'hotelroopcliff@gmail.com' && trimmedPass === 'Hotel@906') {
      try {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'authenticated');
      } catch {
        // ignore
      }
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid management email or administrative password.' };
  };

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {
      // ignore
    }
    setIsAdminLoggedIn(false);
  };

  // 6. Booking state
  const [booking, setBooking] = useState<BookingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKING);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialBookingState,
          ...parsed,
          checkin: parsed.checkin || initialBookingState.checkin,
          checkout: parsed.checkout || initialBookingState.checkout,
        };
      }
    } catch {
      // fallback
    }
    return initialBookingState;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKING, JSON.stringify(booking));
    } catch {
      // ignore
    }
  }, [booking]);

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking(initialBookingState);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Room CRUD
  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId || r.name === roomId) {
          return { ...r, ...updates };
        }
        return r;
      })
    );
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newId = 'room-' + Math.random().toString(36).slice(2, 8);
    const newRoom: Room = { ...roomData, id: newId, available: true };
    setRooms((prev) => [...prev, newRoom]);
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId && r.name !== roomId));
  };

  const resetRooms = () => {
    setRooms(INITIAL_ROOMS);
    try {
      localStorage.removeItem(STORAGE_KEY_ROOMS);
    } catch {
      // ignore
    }
  };

  // Gallery CRUD
  const addGalleryItem = (itemData: Omit<GalleryMediaItem, 'id' | 'uploadedAt'>) => {
    const newItem: GalleryMediaItem = {
      ...itemData,
      id: 'media-' + Math.random().toString(36).slice(2, 9),
      uploadedAt: getTodayDateString(),
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryMediaItem>) => {
    setGallery((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const resetGallery = () => {
    setGallery(INITIAL_GALLERY_ITEMS);
    try {
      localStorage.removeItem(STORAGE_KEY_GALLERY);
    } catch {
      // ignore
    }
  };

  // Enquiries
  const addEnquiry = (data: Omit<CustomerEnquiry, 'id' | 'submittedAt' | 'status'>): CustomerEnquiry => {
    const newEnq: CustomerEnquiry = {
      ...data,
      id: 'enq-' + Math.random().toString(36).slice(2, 9),
      submittedAt: new Date().toISOString(),
      status: 'new',
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: CustomerEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  // Payment settings
  const updatePaymentSettings = (settings: Partial<HotelPaymentSettings>) => {
    setPaymentSettings((prev) => ({ ...prev, ...settings }));
  };

  // Active room and calculations
  const activeRoom =
    rooms.find((r) => r.name === booking.room) ||
    rooms.find((r) => r.id === booking.room) ||
    rooms[0] ||
    INITIAL_ROOMS[0];

  const nights = calculateNights(booking.checkin, booking.checkout);
  const rate = booking.plan === 'breakfast' ? activeRoom.breakfast : activeRoom.rate;
  const tax = booking.plan === 'breakfast' ? activeRoom.breakfastTax : activeRoom.tax;
  const quantity = Math.max(1, Number(booking.roomQty || 1));
  const subtotal = rate * quantity * nights;
  const taxTotal = tax * quantity * nights;
  const total = (rate + tax) * quantity * nights;

  const amount: AmountBreakdown = {
    nights,
    rate,
    tax,
    quantity,
    subtotal,
    taxTotal,
    total,
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        updateBooking,
        resetBooking,
        activeRoom,
        amount,
        formatCurrency,
        toastMessage,
        showToast,
        isEnquiryOpen,
        setIsEnquiryOpen,
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
        addEnquiry,
        updateEnquiryStatus,
        paymentSettings,
        updatePaymentSettings,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
