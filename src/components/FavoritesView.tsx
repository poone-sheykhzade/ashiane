import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface FavoritesViewProps {
  favoriteProperties: Property[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectProperty: (property: Property) => void;
  onBookProperty: (property: Property) => void;
  onExploreClick: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteProperties,
  onToggleFavorite,
  onSelectProperty,
  onBookProperty,
  onExploreClick,
}) => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#111c2d]">اقامتگاه‌های نشان‌شده</h1>
        <p className="text-xs text-[#3f4945] mt-0.5">
          واحدهای برگزیده شما برای دسترسی سریع و مقایسه قبل از رزرو
        </p>
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#bfc9c4]/30 shadow-xs text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#ffdad2]/50 flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[32px]">favorite_border</span>
          </div>
          <h3 className="text-base font-bold text-[#111c2d]">لیست نشان‌شده‌های شما خالی است</h3>
          <p className="text-xs text-[#3f4945] max-w-xs">
            با کلیک روی آیکون قلب در هر اقامتگاه، آن را به این بخش اضافه کنید تا دسترسی سریع داشته باشید.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="px-5 py-2.5 bg-[#004337] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0d5c4d] transition-all"
          >
            مشاهده اقامتگاه‌های منتخب
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectProperty={onSelectProperty}
              onBookProperty={onBookProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
};
