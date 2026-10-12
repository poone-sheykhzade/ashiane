import React, { useState } from 'react';
import { FilterParams, RentalDuration } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterParams;
  onApplyFilters: (newFilters: FilterParams) => void;
  onResetFilters: () => void;
  totalResultsCount?: number;
}

const AMENITIES_LIST = [
  { id: 'pool', label: 'استخر آب‌گرم و سونا', icon: 'pool' },
  { id: 'wifi', label: 'اینترنت فیبر نوری', icon: 'wifi' },
  { id: 'parking', label: 'پارکینگ اختصاصی', icon: 'directions_car' },
  { id: 'hvac', label: 'تهویه چیلر مرکزی', icon: 'hvac' },
  { id: 'kitchen', label: 'آشپزخانه فول فرنیش', icon: 'countertops' },
  { id: 'security', label: 'نگهبانی ۲۴ ساعته', icon: 'security' },
  { id: 'bbq', label: 'باربیکیو و آلاچیق', icon: 'outdoor_grill' },
  { id: 'fireplace', label: 'شومینه هیزمی', icon: 'fireplace' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  totalResultsCount,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState(filters.query || '');
  const [city, setCity] = useState(filters.city || 'همه');
  const [duration, setDuration] = useState<RentalDuration>(filters.duration || 'daily');
  const [rooms, setRooms] = useState<number>(filters.rooms || 0);
  const [guests, setGuests] = useState<number>(filters.guests || 0);
  const [maxPrice, setMaxPrice] = useState<number>(filters.maxPrice || 10000000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);
  const [sortBy, setSortBy] = useState<string>(filters.sortBy || 'recommended');

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      query: query.trim() || undefined,
      city: city === 'همه' ? undefined : city,
      duration,
      rooms: rooms > 0 ? rooms : undefined,
      guests: guests > 0 ? guests : undefined,
      maxPrice: maxPrice < 10000000 ? maxPrice : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      sortBy: sortBy as any,
    });
    onClose();
  };

  const handleReset = () => {
    setQuery('');
    setCity('همه');
    setDuration('daily');
    setRooms(0);
    setGuests(0);
    setMaxPrice(10000000);
    setSelectedAmenities([]);
    setSortBy('recommended');
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#bfc9c4]/30">
        {/* Modal Header */}
        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#3f4945] hover:bg-[#e7eeff] flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-base font-bold text-[#111c2d]">فیلترهای پیشرفته</h2>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-[#ba1a1a] hover:underline"
            type="button"
          >
            پاک کردن همه
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111c2d]">جستجوی نام یا محله</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثلاً: نیاوران، استخردار، ویلا، دوبلکس..."
                className="w-full bg-[#f0f3ff]/70 border border-[#bfc9c4]/50 rounded-xl px-3.5 py-2.5 text-xs text-[#111c2d] placeholder:text-[#3f4945]/60 focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111c2d]">شهر مقصد</label>
            <div className="flex flex-wrap gap-2">
              {['همه', 'تهران', 'البرز', 'مازندران', 'کیش'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    city === c
                      ? 'bg-[#004337] text-white shadow-xs font-bold'
                      : 'bg-[#f0f3ff] text-[#3f4945] hover:bg-[#e7eeff]'
                  }`}
                >
                  {c === 'همه' ? 'همه شهرها' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Rental Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111c2d]">نوع قرارداد / بازه اجاره</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'daily', label: 'روزانه (کوتاه‌مدت)' },
                { id: 'monthly', label: 'ماهانه (۱ تا ۶ ماه)' },
                { id: 'yearly', label: 'سالانه (رهن/اجاره)' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDuration(d.id as RentalDuration)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                    duration === d.id
                      ? 'border-[#004337] bg-[#aaf0dc]/20 text-[#004337] font-bold'
                      : 'border-[#bfc9c4]/40 bg-[#f9f9ff] text-[#3f4945]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111c2d]">حداکثر سقف بودجه</label>
              <span className="text-xs font-bold text-[#004337]">
                {maxPrice >= 10000000 ? 'بدون محدودیت' : formatToman(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="10000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#004337] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#3f4945]">
              <span>{formatToman(1000000)}</span>
              <span>{formatToman(5000000)}</span>
              <span>۱۰+ میلیون تومان</span>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111c2d]">تعداد اتاق خواب</label>
            <div className="flex gap-2">
              {[
                { count: 0, label: 'مهم نیست' },
                { count: 1, label: '۱ خواب' },
                { count: 2, label: '۲ خواب' },
                { count: 3, label: '۳ خواب' },
                { count: 4, label: '۴+ خواب' },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setRooms(item.count)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    rooms === item.count
                      ? 'border-[#004337] bg-[#004337] text-white font-bold'
                      : 'border-[#bfc9c4]/40 bg-[#f0f3ff] text-[#3f4945]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111c2d]">ظرفیت مهمانان</label>
            <div className="flex gap-2">
              {[0, 2, 4, 6, 8].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGuests(g)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    guests === g
                      ? 'border-[#004337] bg-[#004337] text-white font-bold'
                      : 'border-[#bfc9c4]/40 bg-[#f0f3ff] text-[#3f4945]'
                  }`}
                >
                  {g === 0 ? 'هر تعداد' : `تا ${toPersianDigits(g)} نفر`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#111c2d]">امکانات ضروری</label>
            <div className="grid grid-cols-2 gap-2.5">
              {AMENITIES_LIST.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleToggleAmenity(amenity.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-right transition-all ${
                      isChecked
                        ? 'border-[#004337] bg-[#aaf0dc]/20 text-[#004337] font-semibold'
                        : 'border-[#bfc9c4]/30 bg-white text-[#3f4945] hover:bg-[#f0f3ff]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[19px] ${
                        isChecked ? 'text-[#004337]' : 'text-gray-400'
                      }`}
                    >
                      {amenity.icon}
                    </span>
                    <span className="text-xs flex-1 truncate">{amenity.label}</span>
                    {isChecked && (
                      <span className="material-symbols-outlined text-[16px] text-[#004337]">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111c2d]">مرتب‌سازی نتایج</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'recommended', label: 'پیشنهاد آشیانه' },
                { id: 'rating', label: 'بالاترین امتیاز مهمانان' },
                { id: 'priceAsc', label: 'ارزان‌ترین قیمت' },
                { id: 'priceDesc', label: 'گران‌ترین و لوکس‌ترین' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSortBy(s.id)}
                  className={`py-2 px-3 text-xs rounded-xl border text-right flex items-center justify-between transition-all ${
                    sortBy === s.id
                      ? 'border-[#004337] bg-[#004337] text-white font-bold'
                      : 'border-[#bfc9c4]/30 bg-[#f0f3ff] text-[#3f4945]'
                  }`}
                >
                  <span>{s.label}</span>
                  {sortBy === s.id && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#f9f9ff] flex items-center gap-3 shrink-0">
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 bg-[#004337] hover:bg-[#0d5c4d] text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            type="button"
          >
            <span>اعمال فیلترها</span>
            {totalResultsCount !== undefined && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-normal">
                {toPersianDigits(totalResultsCount)} اقامتگاه
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
