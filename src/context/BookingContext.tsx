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

const STORAGE_KEY_BOOKING = 'roopCliffBooking_v4';
const STORAGE_KEY_ROOMS = 'roopCliffRooms_v4';
const STORAGE_KEY_GALLERY = 'roopCliffGallery_v4';
const STORAGE_KEY_ENQUIRIES = 'roopCliffEnquiries_v4';
const STORAGE_KEY_SETTINGS = 'roopCliffSettings_v4';
const STORAGE_KEY_ADMIN_AUTH = 'roopCliffAdminAuth_v4';
const STORAGE_KEY_ADMIN_HASH = 'roopCliffAdminHash_v1';
const STORAGE_KEY_ADMIN_LOCK = 'roopCliffAdminLock_v1';

// Cryptographic SHA-256 password hash helper
export const hashPassword = async (pass: string): Promise<string> => {
  const enc = new TextEncoder().encode(pass);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Default pre-computed SHA-256 hash for initial hotel administrative access
const DEFAULT_ADMIN_HASH = 'a7282b9ee8cb65443401b8cba783feaf0f72b16c84537cfe009bc5fa621bad52';
const DEFAULT_ADMIN_EMAIL = 'hotelroopcliff@gmail.com';

const initialBookingState: BookingState = {
  checkin: plusDays(getTodayDateString(), 1),
  checkout: plusDays(getTodayDateString(), 2),
  room: INITIAL_ROOMS[1].name, // Default to Deluxe Room
  roomQty: '1',
  guests: '1',
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
  supportPhone: '8269197272 / 0755 4532682',
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

  // Admin Auth & Security
  isAdminLoggedIn: boolean;
  loginAdmin: (user: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Rooms state
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((r: Room) => ({ ...r, rateOnRequest: false }));
      }
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.supportPhone || parsed.supportPhone === '+91 755 255 3300') {
          parsed.supportPhone = '8269197272 / 0755 4532682';
        }
        return parsed;
      }
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

  // 5. Admin Authentication & Security Hardening
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (raw) {
        if (raw.startsWith('{')) {
          const parsed = JSON.parse(raw);
          if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
            return true;
          }
          sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
          return false;
        }
        return raw === 'authenticated';
      }
    } catch {
      return false;
    }
    return false;
  });

  const loginAdmin = async (user: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedUser = user.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // Check brute-force lockout status
    let lockData = { attempts: 0, lockedUntil: 0 };
    try {
      const savedLock = localStorage.getItem(STORAGE_KEY_ADMIN_LOCK);
      if (savedLock) lockData = JSON.parse(savedLock);
    } catch {
      // ignore
    }

    if (lockData.lockedUntil && Date.now() < lockData.lockedUntil) {
      const remainingSec = Math.max(1, Math.ceil((lockData.lockedUntil - Date.now()) / 1000));
      const mins = Math.ceil(remainingSec / 60);
      return {
        success: false,
        error: `Console locked for security due to multiple failed attempts. Please wait ${mins} minute(s) (${remainingSec}s).`,
      };
    }

    // Retrieve active hashed credentials
    const activeEmail = (paymentSettings.supportEmail || DEFAULT_ADMIN_EMAIL).toLowerCase();
    const activeHash = localStorage.getItem(STORAGE_KEY_ADMIN_HASH) || DEFAULT_ADMIN_HASH;

    const inputHash = await hashPassword(trimmedPass);

    const isEmailValid = trimmedUser === DEFAULT_ADMIN_EMAIL || trimmedUser === activeEmail;
    const isPasswordValid = inputHash === activeHash;

    if (isEmailValid && isPasswordValid) {
      // Clear any lockout upon success
      try {
        localStorage.removeItem(STORAGE_KEY_ADMIN_LOCK);
      } catch {
        // ignore
      }

      // Create secure timed session token (2 hours validity)
      const sessionData = {
        token: 'rc_auth_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
        issuedAt: Date.now(),
        expiresAt: Date.now() + 2 * 3600 * 1000,
      };

      try {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, JSON.stringify(sessionData));
      } catch {
        // ignore
      }

      setIsAdminLoggedIn(true);
      return { success: true };
    }

    // Record failed attempt
    const newAttempts = (lockData.attempts || 0) + 1;
    if (newAttempts >= 5) {
      const lockUntil = Date.now() + 5 * 60 * 1000; // 5-minute lockout
      try {
        localStorage.setItem(
          STORAGE_KEY_ADMIN_LOCK,
          JSON.stringify({ attempts: 0, lockedUntil: lockUntil })
        );
      } catch {
        // ignore
      }
      return {
        success: false,
        error: 'Too many consecutive failed attempts. Console locked for 5 minutes for hotel security.',
      };
    } else {
      try {
        localStorage.setItem(
          STORAGE_KEY_ADMIN_LOCK,
          JSON.stringify({ attempts: newAttempts, lockedUntil: 0 })
        );
      } catch {
        // ignore
      }
      const attemptsRemaining = 5 - newAttempts;
      return {
        success: false,
        error: `Invalid credentials. ${attemptsRemaining} attempt(s) remaining before security lockout.`,
      };
    }
  };

  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isAdminLoggedIn) return { success: false, error: 'Unauthorized.' };
    if (!newPass || newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const activeHash = localStorage.getItem(STORAGE_KEY_ADMIN_HASH) || DEFAULT_ADMIN_HASH;
    const inputCurrentHash = await hashPassword(currentPass.trim());

    if (inputCurrentHash !== activeHash) {
      return { success: false, error: 'Current password verification failed.' };
    }

    const newHash = await hashPassword(newPass.trim());
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_HASH, newHash);
    } catch {
      // ignore
    }
    return { success: true };
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
  const quantity = Math.max(1, Number(booking.roomQty || 1));
  const guestCount = Math.max(1, parseInt(booking.guests || '1', 10));

  // Average guests per room
  const guestsPerRoom = Math.max(1, Math.ceil(guestCount / quantity));

  // Base rate is for 1 guest (Single Occupancy)
  const baseRate = activeRoom.rate;

  // Incremental adjustment for additional guests per room:
  // 1 guest: +₹0 (base rate)
  // 2 guests: +₹600 (double occupancy)
  // 3+ guests: +₹600 + (guests - 2) * ₹750 (triple / group occupancy)
  let guestAdjustment = 0;
  if (guestsPerRoom === 2) {
    guestAdjustment = 600;
  } else if (guestsPerRoom >= 3) {
    guestAdjustment = 600 + (guestsPerRoom - 2) * 750;
  }

  // Breakfast charge per guest per night
  const perGuestBreakfastRate = Math.max(350, Math.round((activeRoom.breakfast - activeRoom.rate) || 350));
  const breakfastCharge = booking.plan === 'breakfast' ? perGuestBreakfastRate * guestsPerRoom : 0;

  // Extra bed/mattress charge: ₹750/night per room if requested
  const extraBedCharge = booking.extraBed === 'yes' ? 750 : 0;

  // Effective nightly rate per room
  const rate = baseRate + guestAdjustment + breakfastCharge + extraBedCharge;

  // Tax calculation: Standard GST 12% on accommodation
  const tax = Math.round(rate * 0.12);

  const subtotal = rate * quantity * nights;
  const taxTotal = tax * quantity * nights;
  const total = subtotal + taxTotal;

  const amount: AmountBreakdown = {
    nights,
    rate,
    tax,
    quantity,
    subtotal,
    taxTotal,
    total,
    baseRate,
    guestAdjustment,
    breakfastPerNight: breakfastCharge,
    extraBedPerNight: extraBedCharge,
    guestCount,
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
        changeAdminPassword,
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
