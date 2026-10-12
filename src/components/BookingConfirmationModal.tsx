import React from 'react';
import { Booking } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewMyBookings,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-[#111c2d] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#bfc9c4]/30 flex flex-col p-6 space-y-5">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-[#aaf0dc]/40 flex items-center justify-center text-[#004337] ring-8 ring-[#aaf0dc]/20">
            <span className="material-symbols-outlined text-[36px]">verified</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#004337]">رزرو شما قطعی شد</h2>
          <p className="text-xs text-[#3f4945] max-w-xs leading-relaxed">
            پرداخت در درگاه شاپرک با موفقیت انجام شد و پیامک تایید و لوکیشن برای شما ارسال گردید.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-[#f0f3ff]/70 border border-[#bfc9c4]/40 rounded-2xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#bfc9c4]/30">
            <span className="text-[#3f4945]">شماره رزرو آشیانه:</span>
            <span className="font-mono font-bold text-sm text-[#004337]">
              {booking.bookingCode}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#3f4945]">کد پیگیری شاپرک:</span>
            <span className="font-mono font-bold text-slate-800">
              {toPersianDigits(booking.trackingCode || '۲۹۱۸۴۲۱۰')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#3f4945]">اقامتگاه:</span>
            <span className="font-bold text-[#111c2d] truncate max-w-[180px]">
              {booking.propertyTitle}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#3f4945]">تاریخ اقامت:</span>
            <span className="font-medium text-[#111c2d]">
              {booking.startDate} تا {booking.endDate} ({toPersianDigits(booking.unitsCount)}{' '}
              {booking.rentalDuration === 'daily' ? 'شب' : 'ماه'})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#3f4945]">تحویل‌گیرنده:</span>
            <span className="font-medium text-[#111c2d]">{booking.guestInfo.fullName}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#bfc9c4]/30">
            <span className="text-[#111c2d] font-bold">مبلغ کل پرداخت‌شده:</span>
            <span className="font-extrabold text-[#004337] text-sm">
              {formatToman(booking.pricing.totalAmount)}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-[#e7eeff]/60 rounded-xl text-[11px] text-[#3f4945] flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#004337] shrink-0 mt-0.5">
            info
          </span>
          <p className="leading-relaxed">
            میزبان از رزرو شما مطلع شده و هماهنگی‌های لازم جهت تحویل کلید و کارت تردد پارکینگ صورت گرفته است.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onViewMyBookings();
            }}
            className="w-full py-3 bg-[#004337] hover:bg-[#0d5c4d] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>مشاهده در رزروهای من</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-transparent hover:bg-[#f0f3ff] text-[#3f4945] rounded-xl font-semibold text-xs transition-colors"
            type="button"
          >
            بازگشت به صفحه کاوش
          </button>
        </div>
      </div>
    </div>
  );
};
