import React, { useState } from 'react';
import { Booking } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface MyBookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onPayBooking: (booking: Booking) => void;
  onExploreClick: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onPayBooking,
  onExploreClick,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'cancelled'>('all');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'active') return b.status === 'confirmed' || b.status === 'pending';
    if (filterTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111c2d]">رزروهای من</h1>
          <p className="text-xs text-[#3f4945] mt-0.5">
            مدیریت اقامت‌ها، پیگیری فاکتورها و وضعیت پرداخت درگاه شاپرک
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#f0f3ff] rounded-xl self-start">
        {[
          { id: 'all', label: 'همه رزروها' },
          { id: 'active', label: 'فعال و آینده' },
          { id: 'cancelled', label: 'لغوشده‌ها' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterTab(tab.id as any)}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all ${
              filterTab === tab.id
                ? 'bg-[#004337] text-white shadow-xs'
                : 'text-[#3f4945] hover:text-[#111c2d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#bfc9c4]/30 shadow-xs text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#3f4945]">
            <span className="material-symbols-outlined text-[32px]">calendar_today</span>
          </div>
          <h3 className="text-base font-bold text-[#111c2d]">هیچ رزروی در این بخش ثبت نشده است</h3>
          <p className="text-xs text-[#3f4945] max-w-xs">
            برای رزرو اقامتگاه‌های لوکس و مبله نیاوران، ولنجک، کردان و دیگر مقاصد کلیک کنید.
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
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            const isPending = b.status === 'pending';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bfc9c4]/30 shadow-xs flex flex-col sm:flex-row gap-4"
              >
                {/* Property thumbnail */}
                <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={b.propertyImage}
                    alt={b.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[#6f7975]">
                        کد رزرو: <strong className="text-[#004337]">{b.bookingCode}</strong>
                      </span>

                      {/* Status Badge */}
                      {isConfirmed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#aaf0dc]/50 text-[#004337] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>قطعی و پرداخت‌شده</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>در انتظار پرداخت</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          <span>لغوشده</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-[#111c2d] mt-1.5">{b.propertyTitle}</h2>
                    <p className="text-xs text-[#3f4945] mt-0.5">{b.propertyLocation}</p>
                  </div>

                  {/* Stay info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 bg-[#f0f3ff]/50 rounded-xl text-xs">
                    <div>
                      <span className="text-[11px] text-[#6f7975] block">بازه زمانی:</span>
                      <span className="font-semibold text-[#111c2d]">
                        {b.startDate} تا {b.endDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#6f7975] block">مدت اقامت:</span>
                      <span className="font-semibold text-[#111c2d]">
                        {toPersianDigits(b.unitsCount)}{' '}
                        {b.rentalDuration === 'daily' ? 'شب' : 'ماه'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#6f7975] block">مبلغ کل:</span>
                      <span className="font-bold text-[#004337]">
                        {formatToman(b.pricing.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                    <div className="text-[11px] text-[#3f4945]">
                      {b.trackingCode ? (
                        <span>
                          کد پیگیری شاپرک:{' '}
                          <strong className="font-mono text-slate-800">
                            {toPersianDigits(b.trackingCode)}
                          </strong>
                        </span>
                      ) : (
                        <span>در انتظار اتصال به درگاه بانکی</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => onPayBooking(b)}
                          className="px-3.5 py-1.5 bg-[#004337] text-white rounded-lg text-xs font-bold shadow-xs hover:bg-[#0d5c4d] transition-colors"
                        >
                          پرداخت شاپرک
                        </button>
                      )}

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalId(b.id)}
                          className="px-3 py-1.5 bg-red-50 text-[#ba1a1a] rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          لغو رزرو
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="text-base font-bold text-[#111c2d]">آیا از لغو این رزرو مطمئن هستید؟</h3>
            <p className="text-xs text-[#3f4945] leading-relaxed">
              بر اساس قوانین لغو رایگان آشیانه، در صورت لغو تا ۴۸ ساعت قبل از موعد ورود، کل وجه پرداختی بدون کسر جریمه مسترد می‌گردد.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onCancelBooking(cancelModalId);
                  setCancelModalId(null);
                }}
                className="flex-1 py-2.5 bg-[#ba1a1a] text-white text-xs font-bold rounded-xl hover:bg-red-700"
              >
                بله، لغو شود
              </button>
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
