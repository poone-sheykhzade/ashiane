import {
  Property,
  Booking,
  Review,
  AppNotification,
  UserProfile,
  FilterParams,
  PricingBreakdown,
  RentalDuration,
  PaymentGateway,
} from '../types';

export const api = {
  async getProperties(filters: FilterParams = {}): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.city && filters.city !== 'همه') params.append('city', filters.city);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.duration) params.append('duration', filters.duration);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.rooms) params.append('rooms', filters.rooms.toString());
    if (filters.guests) params.append('guests', filters.guests.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.amenities && filters.amenities.length > 0) {
      params.append('amenities', filters.amenities.join(','));
    }

    const res = await fetch(`/api/properties?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در دریافت لیست اقامتگاه‌ها');
    return json.data;
  },

  async getProperty(id: string): Promise<Property> {
    const res = await fetch(`/api/properties/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'اقامتگاه یافت نشد');
    return json.data;
  },

  async calculatePrice(
    propertyId: string,
    rentalDuration: RentalDuration,
    unitsCount: number
  ): Promise<PricingBreakdown> {
    const res = await fetch('/api/pricing/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, rentalDuration, unitsCount }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در محاسبه قیمت');
    return json.data;
  },

  async createBooking(data: {
    propertyId: string;
    guestInfo: { fullName: string; phone: string; nationalId: string; notes?: string };
    rentalDuration: RentalDuration;
    startDate: string;
    endDate: string;
    unitsCount: number;
    guestsCount: number;
  }): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در ثبت رزرو');
    return json.data;
  },

  async getBookings(): Promise<Booking[]> {
    const res = await fetch('/api/bookings');
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در دریافت رزروها');
    return json.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'رزرو یافت نشد');
    return json.data;
  },

  async cancelBooking(id: string): Promise<void> {
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در لغو رزرو');
  },

  async verifyPayment(
    bookingId: string,
    gateway: PaymentGateway,
    cardRef?: string
  ): Promise<Booking> {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, gateway, cardRef }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'خطا در پرداخت');
    return json.data;
  },

  async getFavorites(): Promise<{ properties: Property[]; ids: string[] }> {
    const res = await fetch('/api/favorites');
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return { properties: json.data, ids: json.ids };
  },

  async toggleFavorite(propertyId: string): Promise<{ isFavorited: boolean; ids: string[] }> {
    const res = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return { isFavorited: json.isFavorited, ids: json.favorites };
  },

  async getReviews(propertyId?: string): Promise<Review[]> {
    const url = propertyId ? `/api/reviews?propertyId=${propertyId}` : '/api/reviews';
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async addReview(propertyId: string, rating: number, comment: string): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, rating, comment }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getNotifications(): Promise<AppNotification[]> {
    const res = await fetch('/api/notifications');
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async markAllNotificationsRead(): Promise<AppNotification[]> {
    const res = await fetch('/api/notifications/read-all', { method: 'POST' });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch('/api/user/profile');
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },

  async updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  },
};
