export type RentalDuration = 'daily' | 'monthly' | 'yearly';

export type PropertyCategory = 'apartment' | 'villa' | 'penthouse' | 'cottage' | 'budget';

export interface Amenity {
  id: string;
  name: string;
  icon: string; // Material symbol or Lucide icon name
}

export interface HostInfo {
  id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  responseRate: string;
  phoneMasked: string;
  propertiesCount: number;
}

export interface Property {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  city: string;
  neighborhood: string;
  addressApprox: string;
  category: PropertyCategory;
  categoryLabel: string;
  rentalDurations: RentalDuration[];
  dailyPrice: number; // in Tomans
  monthlyPrice: number;
  yearlyDeposit: number;
  yearlyRent: number;
  cleaningFee: number;
  stayDiscountPercent: number; // e.g. 15 for 3+ nights
  capacity: number;
  bedrooms: number;
  bedsDescription: string;
  bathrooms: number;
  bathsDescription: string;
  area: number; // in square meters
  rating: number;
  reviewsCount: number;
  images: string[];
  amenities: Amenity[];
  host: HostInfo;
  houseRules: {
    checkIn: string;
    checkOut: string;
    rules: string[];
  };
  cancellationPolicy: string;
  location: {
    lat: number;
    lng: number;
    mapImageUrl?: string;
    approxAreaName: string;
  };
  blockedDates: string[]; // YYYY-MM-DD
  isFeatured?: boolean;
}

export interface BookingGuestInfo {
  fullName: string;
  phone: string;
  nationalId: string;
  notes?: string;
}

export interface PricingBreakdown {
  rentalDuration: RentalDuration;
  unitsCount: number; // nights or months
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  cleaningFee: number;
  guaranteeFee: number;
  totalAmount: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type PaymentGateway = 'mellat' | 'zarinpal' | 'saman';

export interface Booking {
  id: string;
  bookingCode: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  userId: string;
  guestInfo: BookingGuestInfo;
  rentalDuration: RentalDuration;
  startDate: string;
  endDate: string;
  unitsCount: number;
  guestsCount: number;
  pricing: PricingBreakdown;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  gateway?: PaymentGateway;
  trackingCode?: string;
  referenceNumber?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
  linkId?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  nationalId: string;
  email: string;
  isVerified: boolean;
  role: 'guest' | 'host' | 'admin';
  avatar: string;
  registeredDate: string;
}

export interface FilterParams {
  query?: string;
  city?: string;
  neighborhood?: string;
  category?: PropertyCategory | 'all';
  duration?: RentalDuration;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  guests?: number;
  amenities?: string[];
  sortBy?: 'recommended' | 'priceAsc' | 'priceDesc' | 'rating' | 'newest';
}
