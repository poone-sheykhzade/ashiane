/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Property,
  Booking,
  Review,
  AppNotification,
  UserProfile,
  FilterParams,
  RentalDuration,
  PropertyCategory,
} from './types';
import { api } from './services/api';
import { toPersianDigits } from './utils/formatters';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DurationPills } from './components/DurationPills';
import { CategoryTabs } from './components/CategoryTabs';
import { SearchBar } from './components/SearchBar';
import { FilterModal } from './components/FilterModal';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';
import { ShaparakGatewayModal } from './components/ShaparakGatewayModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { MyBookingsView } from './components/MyBookingsView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { MapViewModal } from './components/MapViewModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | 'favorites' | 'bookings' | 'profile'>('explore');

  // Core Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('همه');
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>('daily');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>('apartment');
  const [activeFilters, setActiveFilters] = useState<FilterParams>({
    duration: 'daily',
    category: 'apartment',
  });

  // Modals & Flows
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<Property | null>(null);
  const [checkoutData, setCheckoutData] = useState<{
    property: Property;
    duration: RentalDuration;
  } | null>(null);
  const [gatewayData, setGatewayData] = useState<{
    booking: Booking;
    gateway: any;
  } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Load properties based on current filters
  const loadProperties = useCallback(async (filters: FilterParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProperties(filters);
      setProperties(data);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطا در بارگذاری اقامتگاه‌ها');
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function initApp() {
      try {
        const [favRes, bookingsRes, notifsRes, userRes, reviewsRes] = await Promise.all([
          api.getFavorites(),
          api.getBookings(),
          api.getNotifications(),
          api.getUserProfile(),
          api.getReviews(),
        ]);

        setFavoriteIds(favRes.ids || []);
        setBookings(bookingsRes || []);
        setNotifications(notifsRes || []);
        setCurrentUser(userRes || null);
        setReviews(reviewsRes || []);

        await loadProperties(activeFilters);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }

    initApp();
  }, [loadProperties]);

  // When duration or category or city changes from the main screen pills
  const handleDurationChange = (duration: RentalDuration) => {
    setSelectedDuration(duration);
    const updated = { ...activeFilters, duration };
    setActiveFilters(updated);
    loadProperties(updated);
  };

  const handleCategoryChange = (category: PropertyCategory | 'all') => {
    setSelectedCategory(category);
    const updated = { ...activeFilters, category };
    setActiveFilters(updated);
    loadProperties(updated);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const updated = { ...activeFilters, city: city === 'همه' ? undefined : city };
    setActiveFilters(updated);
    loadProperties(updated);
  };

  const handleApplyAdvancedFilters = (newFilters: FilterParams) => {
    setActiveFilters(newFilters);
    if (newFilters.duration) setSelectedDuration(newFilters.duration);
    if (newFilters.category) setSelectedCategory(newFilters.category);
    if (newFilters.city) setSelectedCity(newFilters.city);
    loadProperties(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterParams = { duration: 'daily', category: 'all' };
    setSelectedCity('همه');
    setSelectedDuration('daily');
    setSelectedCategory('all');
    setActiveFilters(defaultFilters);
    loadProperties(defaultFilters);
  };

  // Favorites Toggle
  const handleToggleFavorite = async (e?: React.MouseEvent, propertyId?: string) => {
    if (e) e.stopPropagation();
    if (!propertyId) return;

    try {
      const res = await api.toggleFavorite(propertyId);
      setFavoriteIds(res.ids);
    } catch (err) {
      console.error(err);
    }
  };

  // Add review
  const handleAddReview = async (propertyId: string, rating: number, comment: string) => {
    try {
      const newReview = await api.addReview(propertyId, rating, comment);
      setReviews((prev) => [newReview, ...prev]);
      // Update property rating in state
      loadProperties(activeFilters);
    } catch (err) {
      console.error(err);
    }
  };

  // Bookings management
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.cancelBooking(bookingId);
      const updated = await api.getBookings();
      setBookings(updated);
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error(err);
    }
  };

  // Profile update
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateUserProfile(data);
      setCurrentUser(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Favorite properties list for favorites view
  const favoriteProperties = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="bg-[#f9f9ff] text-[#111c2d] min-h-screen flex flex-col font-sans selection:bg-[#004337] selection:text-white pb-20">
      {/* Universal Top Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={handleCitySelect}
        user={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsDrawerOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Body per tab */}
      <main className="flex-1 w-full pt-16">
        {activeTab === 'explore' && (
          <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4 pb-12">
            {/* Search Bar matching Image 3 */}
            <div className="mb-4">
              <SearchBar
                filters={activeFilters}
                onOpenFilter={() => setFilterModalOpen(true)}
                onQuickSearch={(q) => handleApplyAdvancedFilters({ ...activeFilters, query: q })}
              />
            </div>

            {/* Duration Pills: روزانه / ماهانه / سالانه */}
            <div className="mb-2">
              <DurationPills
                selectedDuration={selectedDuration}
                onSelectDuration={handleDurationChange}
              />
            </div>

            {/* Category Tabs: آپارتمان / ویلا / پنت‌هاوس / کلبه / اقتصادی */}
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />

            {/* Section Header: اقامتگاه‌های منتخب + مرتب‌سازی */}
            <div className="pt-3 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#111c2d]">اقامتگاه‌های منتخب</h2>
                <span className="text-xs text-[#3f4945] font-normal">
                  ({toPersianDigits(properties.length)} مورد)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                className="text-xs text-[#3f4945] hover:text-[#004337] font-semibold flex items-center gap-1 transition-colors"
              >
                <span>مرتب‌سازی</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#004337] animate-spin">
                  progress_activity
                </span>
                <span className="text-xs text-[#3f4945]">در حال جستجو و بارگذاری اقامتگاه‌ها...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-[#ba1a1a] p-6 rounded-2xl text-center space-y-2">
                <span className="material-symbols-outlined text-3xl">error</span>
                <p className="text-xs font-bold">{error}</p>
                <button
                  onClick={() => loadProperties(activeFilters)}
                  className="px-4 py-2 bg-[#004337] text-white text-xs rounded-xl font-bold"
                >
                  تلاش مجدد
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-[#bfc9c4]/30 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#3f4945]">
                  <span className="material-symbols-outlined text-[32px]">apartment</span>
                </div>
                <h3 className="text-base font-bold text-[#111c2d]">اقامتگاهی با این مشخصات یافت نشد</h3>
                <p className="text-xs text-[#3f4945] max-w-xs">
                  لطفا فیلترهای بودجه، شهر یا بازه اجاره را تغییر دهید تا نتایج بیشتری نمایش داده شود.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#004337] text-white text-xs font-bold rounded-xl"
                >
                  حذف همه فیلترها
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    duration={selectedDuration}
                    isFavorite={favoriteIds.includes(property.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, property.id)}
                    onSelectProperty={(prop) => setSelectedPropertyDetails(prop)}
                    onBookProperty={(prop) => setCheckoutData({ property: prop, duration: selectedDuration })}
                  />
                ))}
              </div>
            )}

            {/* Sticky Floating "مشاهده نقشه" Pill Button matching Image 3 */}
            <div className="sticky bottom-20 z-30 self-center flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={() => setMapModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111c2d] hover:bg-[#004337] text-white shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[19px]">map</span>
                <span className="text-xs font-bold">مشاهده نقشه</span>
              </button>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteProperties={favoriteProperties}
            onToggleFavorite={(e, id) => handleToggleFavorite(e, id)}
            onSelectProperty={(prop) => setSelectedPropertyDetails(prop)}
            onBookProperty={(prop) => setCheckoutData({ property: prop, duration: selectedDuration })}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onPayBooking={(booking) => {
              setGatewayData({ booking, gateway: 'mellat' });
            }}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            bookings={bookings}
            onUpdateProfile={handleUpdateProfile}
            onExploreClick={() => setActiveTab('explore')}
          />
        )}
      </main>

      {/* Universal Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        favoritesCount={favoriteIds.length}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={activeFilters}
        onApplyFilters={handleApplyAdvancedFilters}
        onResetFilters={handleResetFilters}
        totalResultsCount={properties.length}
      />

      {/* Property Details Modal (Image 7 & HTML Mockup) */}
      <PropertyDetailsModal
        property={selectedPropertyDetails}
        isOpen={!!selectedPropertyDetails}
        onClose={() => setSelectedPropertyDetails(null)}
        isFavorite={selectedPropertyDetails ? favoriteIds.includes(selectedPropertyDetails.id) : false}
        onToggleFavorite={(id) => handleToggleFavorite(undefined, id)}
        onProceedToBooking={(property, duration) => {
          setSelectedPropertyDetails(null);
          setCheckoutData({ property, duration });
        }}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Booking Checkout Modal (Image 5 & HTML Mockup) */}
      <BookingCheckoutModal
        property={checkoutData?.property || null}
        rentalDuration={checkoutData?.duration || 'daily'}
        isOpen={!!checkoutData}
        onClose={() => setCheckoutData(null)}
        currentUser={currentUser}
        onOpenGateway={(data) => {
          setCheckoutData(null);
          setGatewayData(data);
        }}
      />

      {/* Real Shaparak Payment Gateway Portal */}
      <ShaparakGatewayModal
        booking={gatewayData?.booking || null}
        gateway={gatewayData?.gateway || 'mellat'}
        isOpen={!!gatewayData}
        onSuccess={async (confirmed) => {
          setGatewayData(null);
          setConfirmedBooking(confirmed);
          // Refresh bookings
          const updatedBookings = await api.getBookings();
          setBookings(updatedBookings);
          const updatedNotifs = await api.getNotifications();
          setNotifications(updatedNotifs);
        }}
        onCancel={() => setGatewayData(null)}
      />

      {/* Booking Confirmation Modal (Step 3) */}
      <BookingConfirmationModal
        booking={confirmedBooking}
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
        onViewMyBookings={() => {
          setConfirmedBooking(null);
          setActiveTab('bookings');
        }}
      />

      {/* Interactive Map View Modal */}
      <MapViewModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        properties={properties}
        onSelectProperty={(prop) => {
          setMapModalOpen(false);
          setSelectedPropertyDetails(prop);
        }}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={async () => {
          const updated = await api.markAllNotificationsRead();
          setNotifications(updated);
        }}
        onViewBooking={(bookingId) => {
          setActiveTab('bookings');
        }}
      />
    </div>
  );
}
