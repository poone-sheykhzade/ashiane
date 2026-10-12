import React, { useState } from 'react';
import { Property } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface MapViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const MapViewModal: React.FC<MapViewModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
}) => {
  if (!isOpen) return null;

  const [activeProperty, setActiveProperty] = useState<Property | null>(
    properties[0] || null
  );

  // Approximate relative percentage positions on the Tehran Map graphic
  const markerPositions: Record<string, { top: string; left: string }> = {
    'prop-1': { top: '32%', left: '72%' }, // Niavaran
    'prop-2': { top: '35%', left: '76%' }, // Niavaran palace
    'prop-3': { top: '40%', left: '48%' }, // Velenjak
    'prop-4': { top: '55%', left: '30%' }, // Shahrak Gharb
    'prop-5': { top: '25%', left: '15%' }, // Kordan
    'prop-6': { top: '15%', left: '50%' }, // Mazandaran
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f9f9ff] text-[#111c2d] w-full max-w-4xl h-[92vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-[#bfc9c4]/30">
        {/* Header */}
        <div className="h-16 px-4 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#f0f3ff] text-[#111c2d] hover:bg-[#e7eeff] flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div>
              <h2 className="text-base font-bold text-[#111c2d]">نقشه اقامتگاه‌های آشیانه</h2>
              <span className="text-[11px] text-[#3f4945]">
                {toPersianDigits(properties.length)} اقامتگاه در دسترس
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004337] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#0d5c4d] transition-colors"
            type="button"
          >
            مشاهده لیستی
          </button>
        </div>

        {/* Map Canvas Background */}
        <div className="relative flex-1 bg-[#dae2fd]/30 overflow-hidden select-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9HMO91CgDOy6tfp9seG3Je7v58xnt3udTADkuoPhVqIxPuzb055Q7Z46c9RzabhVhDEFNZKt20Lsyi40k4RchslLzpnhKLro3_2rSaL-I5MFjVPBTBsFEzVqvGf0SLyf4OgJwFyoR_RjeUnGBjXA2qDm2kJalABwdsXm_rg6H8tFs3K3RUzyesbO7tMy5070D08mE4bng1MiUozhhGBlCLBstQfJIB1U94gOGpc_upfPbsRTKLqXY')`,
            }}
          />

          {/* Interactive Property Pin Markers */}
          {properties.map((prop) => {
            const pos = markerPositions[prop.id] || { top: '50%', left: '50%' };
            const isSelected = activeProperty?.id === prop.id;
            const priceMillion = (prop.dailyPrice / 1000000).toFixed(1);

            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => setActiveProperty(prop)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-[#004337] text-white ring-4 ring-[#aaf0dc] scale-110 z-30'
                    : 'bg-white text-[#004337] hover:scale-105 z-10 border border-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">apartment</span>
                <span>{toPersianDigits(priceMillion)} م</span>
              </button>
            );
          })}

          {/* Map Compass / Controls overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-2 shadow-md flex flex-col gap-1.5 text-[#3f4945]">
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-bold"
              >
                +
              </button>
              <div className="h-px bg-gray-200"></div>
              <button
                type="button"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-bold"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Selected Property Popup Card in Bottom */}
        {activeProperty && (
          <div className="p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shrink-0 z-20 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={activeProperty.images[0]}
                  alt={activeProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[#004337] text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                  <span className="truncate">{activeProperty.addressApprox}</span>
                </div>
                <h3 className="text-sm font-bold text-[#111c2d] truncate mt-0.5">
                  {activeProperty.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-[#004337]">
                    {formatToman(activeProperty.dailyPrice)}
                  </span>
                  <span className="text-[11px] text-[#3f4945]">/ شب</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectProperty(activeProperty);
                }}
                className="px-4 py-2.5 bg-[#004337] hover:bg-[#0d5c4d] text-white text-xs font-bold rounded-xl shadow-xs shrink-0 active:scale-95 transition-all"
              >
                مشاهده مشخصات
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
