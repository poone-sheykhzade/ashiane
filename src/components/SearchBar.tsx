import React from 'react';
import { FilterParams } from '../types';
import { toPersianDigits } from '../utils/formatters';

interface SearchBarProps {
  filters: FilterParams;
  onOpenFilter: () => void;
  onQuickSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onOpenFilter,
  onQuickSearch,
}) => {
  const cityText = filters.city && filters.city !== 'همه' ? filters.city : 'تهران، منطقه ۱ و ۲';
  const guestsText = filters.guests ? `${toPersianDigits(filters.guests)} نفر` : '۲ نفر';
  const durationText =
    filters.duration === 'monthly'
      ? 'اجاره ماهانه'
      : filters.duration === 'yearly'
      ? 'اجاره سالانه'
      : 'روزانه';

  return (
    <div className="w-full bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#bfc9c4]/40 p-1.5 pr-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-md">
      {/* Search text / click to search */}
      <button
        onClick={onOpenFilter}
        className="flex items-center gap-3 min-w-0 flex-1 text-right focus:outline-none"
        type="button"
      >
        <span className="material-symbols-outlined text-[#004337] text-[22px] shrink-0">
          search
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-[#111c2d] truncate">
            {filters.query ? `جستجو: «${filters.query}»` : cityText}
          </span>
          <span className="text-[11px] text-[#3f4945] truncate">
            {durationText} • {guestsText} • اقامتگاه‌های ممتاز
          </span>
        </div>
      </button>

      {/* Filter trigger button */}
      <button
        onClick={onOpenFilter}
        aria-label="فیلترها"
        className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#3f4945] hover:text-[#004337] hover:bg-[#e7eeff] transition-all shrink-0 active:scale-90"
        type="button"
      >
        <span className="material-symbols-outlined text-[19px]">tune</span>
      </button>
    </div>
  );
};
