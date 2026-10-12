import React from 'react';
import { Property, RentalDuration } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  duration?: RentalDuration;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  duration = 'daily',
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onBookProperty,
}) => {
  // Determine pricing label based on active duration
  let displayPrice = property.dailyPrice;
  let cycleLabel = 'تومان / شب';

  if (duration === 'monthly') {
    displayPrice = property.monthlyPrice;
    cycleLabel = 'تومان / ماه';
  } else if (duration === 'yearly') {
    displayPrice = property.yearlyDeposit;
    cycleLabel = 'تومان ودیعه';
  }

  return (
    <article className="w-full bg-white rounded-2xl shadow-sm border border-[#bfc9c4]/30 overflow-hidden flex flex-col group transition-all hover:shadow-md">
      {/* Property Image Container */}
      <div
        onClick={() => onSelectProperty(property)}
        className="relative w-full h-60 bg-gray-100 overflow-hidden cursor-pointer"
      >
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(e, property.id)}
          aria-label="افزودن به علاقه‌مندی‌ها"
          className={`fav-button absolute top-3 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-sm transition-transform active:scale-75 ${
            isFavorite ? 'text-[#ba1a1a]' : 'text-[#3f4945] hover:text-[#ba1a1a]'
          }`}
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-all ${
              isFavorite ? 'filled text-[#ba1a1a]' : ''
            }`}
          >
            favorite
          </span>
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#111c2d] text-xs font-semibold shadow-xs">
          <span className="material-symbols-outlined text-[15px] text-[#90321d] filled">
            star
          </span>
          <span className="font-bold">{toPersianDigits(property.rating)}</span>
          <span className="text-[#3f4945] font-normal text-[11px]">
            ({toPersianDigits(property.reviewsCount)})
          </span>
        </div>

        {/* Featured Tag if applicable */}
        {property.isFeatured && (
          <div className="absolute top-3 right-3 bg-[#004337]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            برگزیده آشیانه
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col gap-2.5">
        <div
          onClick={() => onSelectProperty(property)}
          className="flex flex-col cursor-pointer"
        >
          <h2 className="text-[17px] font-bold text-[#111c2d] leading-snug group-hover:text-[#004337] transition-colors line-clamp-1">
            {property.title}
          </h2>
          <span className="text-xs text-[#3f4945] mt-1">
            {property.city}، {property.neighborhood} • {toPersianDigits(property.bedrooms)} اتاق خواب • {toPersianDigits(property.capacity)} نفر
          </span>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[19px] font-extrabold text-[#004337] tracking-tight">
              {formatToman(displayPrice, false)}
            </span>
            <span className="text-[11px] text-[#3f4945] font-medium">{cycleLabel}</span>
          </div>

          <button
            onClick={() => onBookProperty(property)}
            className="px-4 py-2 rounded-xl bg-[#004337] text-white text-xs font-bold shadow-xs hover:bg-[#0d5c4d] transition-all active:scale-95 flex items-center gap-1"
            type="button"
          >
            <span>رزرو اقامتگاه</span>
          </button>
        </div>
      </div>
    </article>
  );
};
