export interface Room {
  id: string;
  name: string;
  area: string;
  guests: number;
  bed: string;
  rate: number;
  tax: number;
  breakfast: number;
  breakfastTax: number;
  img: string;
  desc: string;
  amenities: string[];
  available?: boolean;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  request?: string;
}

export interface BookingState {
  checkin: string;
  checkout: string;
  room: string;
  roomQty: string;
  guests: string;
  extraBed: 'no' | 'yes';
  plan: 'room' | 'breakfast';
  guest?: GuestInfo;
  paymentMethod?: string;
  demoReference?: string;
}

export interface AmountBreakdown {
  nights: number;
  rate: number;
  tax: number;
  quantity: number;
  subtotal: number;
  taxTotal: number;
  total: number;
}

export interface GalleryMediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  poster?: string;
  category: 'all' | 'exterior' | 'rooms' | 'dining' | 'experience' | 'video';
  caption: string;
  featured?: boolean;
  uploadedAt: string;
}

export interface CustomerEnquiry {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  checkin: string;
  checkout: string;
  message?: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
}

export interface HotelPaymentSettings {
  upiId: string;
  merchantName: string;
  razorpayKeyId: string;
  razorpaySecretConfigured: boolean;
  enableLiveGateways: boolean;
  cancellationPolicyNotice: string;
  supportPhone: string;
  supportEmail: string;
}
