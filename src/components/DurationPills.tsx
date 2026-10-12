import React from 'react';
import { RentalDuration } from '../types';

interface DurationPillsProps {
  selectedDuration: RentalDuration;
  onSelectDuration: (duration: RentalDuration) => void;
}

export const DurationPills: React.FC<DurationPillsProps> = ({
  selectedDuration,
  onSelectDuration,
}) => {
  const options: { id: RentalDuration; label: string; badge?: string }[] = [
    { id: 'daily', label: 'روزانه' },
    { id: 'monthly', label: 'ماهانه' },
    { id: 'yearly', label: 'سالانه' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {options.map((opt) => {
        const isActive = selectedDuration === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelectDuration(opt.id)}
            className={`duration-pill px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#004337] text-white shadow-sm ring-1 ring-[#004337]'
                : 'bg-[#f0f3ff] text-[#3f4945] hover:bg-[#e7eeff] hover:text-[#111c2d]'
            }`}
            type="button"
          >
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
