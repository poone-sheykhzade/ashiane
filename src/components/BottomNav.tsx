import React from 'react';
import { toPersianDigits } from '../utils/formatters';

interface BottomNavProps {
  activeTab: 'explore' | 'favorites' | 'bookings' | 'profile';
  onChangeTab: (tab: 'explore' | 'favorites' | 'bookings' | 'profile') => void;
  favoritesCount: number;
  bookingsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  favoritesCount,
  bookingsCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#bfc9c4]/30 shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
      <div className="h-16 max-w-md mx-auto px-4 flex items-center justify-around">
        {/* Explore */}
        <button
          onClick={() => onChangeTab('explore')}
          className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'explore'
              ? 'text-[#004337] font-bold'
              : 'text-[#3f4945] hover:text-[#004337]'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[23px] ${
              activeTab === 'explore' ? 'filled' : ''
            }`}
          >
            explore
          </span>
          <span className="text-[11px]">کاوش</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onChangeTab('favorites')}
          className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'favorites'
              ? 'text-[#004337] font-bold'
              : 'text-[#3f4945] hover:text-[#004337]'
          }`}
          type="button"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[23px] ${
                activeTab === 'favorites' ? 'filled' : ''
              }`}
            >
              favorite
            </span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-[15px] bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {toPersianDigits(favoritesCount)}
              </span>
            )}
          </div>
          <span className="text-[11px]">نشان‌شده‌ها</span>
        </button>

        {/* Bookings */}
        <button
          onClick={() => onChangeTab('bookings')}
          className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'bookings'
              ? 'text-[#004337] font-bold'
              : 'text-[#3f4945] hover:text-[#004337]'
          }`}
          type="button"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[23px] ${
                activeTab === 'bookings' ? 'filled' : ''
              }`}
            >
              calendar_month
            </span>
            {bookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-[15px] bg-[#004337] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {toPersianDigits(bookingsCount)}
              </span>
            )}
          </div>
          <span className="text-[11px]">رزروهای من</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`min-w-[56px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'profile'
              ? 'text-[#004337] font-bold'
              : 'text-[#3f4945] hover:text-[#004337]'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[23px] ${
              activeTab === 'profile' ? 'filled' : ''
            }`}
          >
            account_circle
          </span>
          <span className="text-[11px]">حساب من</span>
        </button>
      </div>
    </nav>
  );
};
