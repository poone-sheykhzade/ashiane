import React, { useState } from 'react';
import { UserProfile, AppNotification } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  user: UserProfile | null;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onNavigateTab: (tab: 'explore' | 'favorites' | 'bookings' | 'profile') => void;
}

const CITIES = ['همه شهرهای ایران', 'تهران', 'البرز', 'مازندران', 'کیش', 'اصفهان', 'شیراز'];

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  user,
  notifications,
  onOpenNotifications,
  onNavigateTab,
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9ff]/85 backdrop-blur-xl border-b border-[#bfc9c4]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigateTab('explore')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#004337] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">villa</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-extrabold text-[#004337] tracking-tight leading-none">
              آشیانه
            </span>
            <span className="text-[10px] text-[#3f4945] font-medium tracking-wider mt-0.5">
              اقامتگاه‌های مبله لوکس
            </span>
          </div>
        </div>

        {/* City Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-[#f0f3ff] border border-[#bfc9c4]/30 flex items-center gap-1.5 text-[#111c2d] text-sm font-semibold hover:bg-[#e7eeff] transition-colors active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[#004337] text-[18px]">
                location_on
              </span>
              <span>{selectedCity === 'همه' ? 'همه شهرها' : selectedCity}</span>
              <span className="material-symbols-outlined text-[#3f4945] text-[18px] transition-transform duration-200">
                {showCityDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showCityDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#bfc9c4]/40 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-xs text-[#3f4945] font-semibold border-b border-gray-100">
                  انتخاب مقصد اقامت
                </div>
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCity(c === 'همه شهرهای ایران' ? 'همه' : c);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-xs font-medium hover:bg-[#f0f3ff] transition-colors flex items-center justify-between ${
                      (selectedCity === 'همه' && c === 'همه شهرهای ایران') || selectedCity === c
                        ? 'text-[#004337] font-bold bg-[#f0f3ff]/60'
                        : 'text-[#111c2d]'
                    }`}
                  >
                    <span>{c}</span>
                    {((selectedCity === 'همه' && c === 'همه شهرهای ایران') ||
                      selectedCity === c) && (
                      <span className="material-symbols-outlined text-[16px] text-[#004337]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications button */}
          <button
            onClick={onOpenNotifications}
            aria-label="اعلانات"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#3f4945] hover:text-[#004337] hover:bg-[#f0f3ff] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {toPersianDigits(unreadCount)}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={() => onNavigateTab('profile')}
            aria-label="پروفایل کاربر"
            className="w-9 h-9 rounded-full bg-[#004337] text-white flex items-center justify-center text-sm font-bold shadow-sm hover:opacity-90 transition-opacity overflow-hidden"
            type="button"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-[20px]">person</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
