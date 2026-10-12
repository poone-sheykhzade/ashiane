import React from 'react';
import { PropertyCategory } from '../types';

interface CategoryTabsProps {
  selectedCategory: PropertyCategory | 'all';
  onSelectCategory: (category: PropertyCategory | 'all') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: {
    id: PropertyCategory | 'all';
    label: string;
    icon: string;
  }[] = [
    { id: 'apartment', label: 'آپارتمان', icon: 'apartment' },
    { id: 'villa', label: 'ویلا', icon: 'pool' },
    { id: 'penthouse', label: 'پنت‌هاوس', icon: 'landscape' },
    { id: 'cottage', label: 'کلبه', icon: 'cottage' },
    { id: 'budget', label: 'اقتصادی', icon: 'savings' },
  ];

  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-6 overflow-x-auto px-1 pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isActive ? 'all' : cat.id)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer transition-transform active:scale-95"
              type="button"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#004337] text-white shadow-md ring-2 ring-[#004337]/30 scale-105'
                    : 'bg-[#f0f3ff] text-[#3f4945] group-hover:bg-[#e7eeff] group-hover:text-[#004337]'
                }`}
              >
                <span className="material-symbols-outlined text-[23px]">{cat.icon}</span>
              </div>
              <span
                className={`text-xs tracking-tight ${
                  isActive ? 'text-[#004337] font-bold' : 'text-[#3f4945] font-medium'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
