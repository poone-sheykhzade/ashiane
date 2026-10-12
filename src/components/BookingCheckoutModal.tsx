import React, { useState, useEffect } from 'react';
import { Property, RentalDuration, PricingBreakdown, PaymentGateway, UserProfile } from '../types';
import { toPersianDigits, formatToman, maskPhoneNumber, maskNationalId } from '../utils/formatters';
import { api } from '../services/api';

interface BookingCheckoutModalProps {
  property: Property | null;
  rentalDuration: RentalDuration;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenGateway: (bookingData: any) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  property,
  rentalDuration,
  isOpen,
  onClose,
  currentUser,
  onOpenGateway,
}) => {
  if (!isOpen || !property) return null;

  const [unitsCount, setUnitsCount] = useState<number>(rentalDuration === 'daily' ? 3 : 1);
  const [guestsCount, setGuestsCount] = useState<number>(Math.min(4, property.capacity));
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);

  // Guest inputs
  const [fullName, setFullName] = useState(currentUser?.fullName || 'سروش مهرابی');
  const [phone, setPhone] = useState(currentUser?.phone || '09123454567');
  const [nationalId, setNationalId] = useState(currentUser?.nationalId || '0081234562');
  const [arrivalNote, setArrivalNote] = useState('');
  const [isEditingGuest, setIsEditingGuest] = useState(false);

  // Gateway selection & terms
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('mellat');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate pricing from server
  useEffect(() => {
    let isMounted = true;
    setLoadingPrice(true);
    setErrorMsg('');

    api
      .calculatePrice(property.id, rentalDuration, unitsCount)
      .then((res) => {
        if (isMounted) {
          setPricing(res);
          setLoadingPrice(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setLoadingPrice(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [property.id, rentalDuration, unitsCount]);

  const handleProceedToPayment = async () => {
    if (!agreedToTerms) {
      setErrorMsg('لطفا ابتدا قوانین رزرو و مقررات لغو را بپذیرید.');
      return;
    }

    if (!fullName || !phone || !nationalId) {
      setErrorMsg('لطفا مشخصات کامل تحویل‌گیرنده را وارد نمایید.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      // Create booking on server first
      const booking = await api.createBooking({
        propertyId: property.id,
        guestInfo: {
          fullName,
          phone,
          nationalId,
          notes: arrivalNote,
        },
        rentalDuration,
        startDate: '۲۴ آبان ۱۴۰۳',
        endDate: '۲۷ آبان ۱۴۰۳',
        unitsCount,
        guestsCount,
      });

      setSubmitting(false);

      // Open Shaparak payment gateway simulation
      onOpenGateway({
        booking,
        gateway: selectedGateway,
      });
    } catch (err: any) {
      setSubmitting(false);
      setErrorMsg(err.message || 'خطا در برقراری ارتباط با درگاه پرداخت شاپرک');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start sm:p-4">
      <div className="bg-[#f9f9ff] text-[#111c2d] w-full max-w-lg min-h-screen sm:min-h-0 sm:my-6 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative pb-28">
        {/* Sticky Header matching HTML Mockup */}
        <header className="sticky top-0 w-full z-30 bg-[#f9f9ff]/90 backdrop-blur-xl border-b border-[#bfc9c4]/30 shadow-xs">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                aria-label="بازگشت"
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#111c2d] hover:bg-[#e7eeff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
              </button>
              <h1 className="text-base font-bold text-[#111c2d]">مشخصات و ثبت نهایی رزرو</h1>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-[#004337] flex items-center justify-center shrink-0 text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Minimal Step Indicator from Image 5 */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between max-w-xs mx-auto relative">
            {/* Step 1 */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004337] text-white flex items-center justify-center text-[11px]">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <span className="text-xs text-[#6f7975]">جزئیات</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#004337] mx-2 opacity-30"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#004337] text-white flex items-center justify-center text-[11px] font-bold">
                ۲
              </div>
              <span className="text-xs text-[#111c2d] font-bold">مشخصات و پرداخت</span>
            </div>

            <div className="flex-1 h-0.5 bg-[#e1dfdc] mx-2"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-1.5 opacity-50">
              <div className="w-6 h-6 rounded-full bg-[#e1dfdc] text-[#636361] flex items-center justify-center text-[11px] font-bold">
                ۳
              </div>
              <span className="text-xs text-[#6f7975]">تایید نهایی</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-4 space-y-4">
          {/* Stay Summary Card */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#bfc9c4]/30 flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-[#90321d] font-bold bg-[#ffdad2]/70 px-2 py-0.5 rounded-full">
                  اقامتگاه اختصاصی
                </span>
                <div className="flex items-center gap-0.5 text-[#111c2d]">
                  <span className="material-symbols-outlined text-[14px] text-[#90321d] filled">
                    star
                  </span>
                  <span className="text-xs font-bold">{toPersianDigits(property.rating)}</span>
                </div>
              </div>
              <h2 className="text-sm font-bold text-[#111c2d] truncate mt-1">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-[#6f7975] text-[11px] mt-1">
                <span>
                  ۲۴ تا ۲۷ آبان ({toPersianDigits(unitsCount)}{' '}
                  {rentalDuration === 'daily' ? 'شب' : 'ماه'})
                </span>
                <span>•</span>
                <span>{toPersianDigits(guestsCount)} مهمان</span>
              </div>
            </div>
          </div>

          {/* Interactive Date & Guests adjustment */}
          <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#bfc9c4]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#3f4945]">مدت اقامت:</span>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setUnitsCount(Math.max(1, unitsCount - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-2 font-bold text-[#004337]">
                  {toPersianDigits(unitsCount)} {rentalDuration === 'daily' ? 'شب' : 'ماه'}
                </span>
                <button
                  type="button"
                  onClick={() => setUnitsCount(unitsCount + 1)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#3f4945]">تعداد نفرات:</span>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-2 font-bold text-[#004337]">
                  {toPersianDigits(guestsCount)} نفر
                </span>
                <button
                  type="button"
                  onClick={() => setGuestsCount(Math.min(property.capacity, guestsCount + 1))}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#bfc9c4]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-[#111c2d]">مشخصات تحویل‌گیرنده</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#004337] bg-[#aaf0dc]/50 px-2.5 py-0.5 rounded-full font-bold">
                  احراز هویت شده
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingGuest(!isEditingGuest)}
                  className="text-[11px] text-[#004337] hover:underline"
                >
                  {isEditingGuest ? 'تایید' : 'ویرایش'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#6f7975] block mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  readOnly={!isEditingGuest}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs text-[#111c2d] font-semibold ${
                    isEditingGuest
                      ? 'bg-white border border-[#004337]'
                      : 'bg-[#f0f3ff]/60 border border-transparent'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#6f7975] block mb-1">شماره تماس</label>
                  <input
                    type="text"
                    value={isEditingGuest ? phone : maskPhoneNumber(phone)}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!isEditingGuest}
                    dir="ltr"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs text-[#111c2d] font-semibold text-right ${
                      isEditingGuest
                        ? 'bg-white border border-[#004337]'
                        : 'bg-[#f0f3ff]/60 border border-transparent'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#6f7975] block mb-1">کد ملی</label>
                  <input
                    type="text"
                    value={isEditingGuest ? nationalId : maskNationalId(nationalId)}
                    onChange={(e) => setNationalId(e.target.value)}
                    readOnly={!isEditingGuest}
                    dir="ltr"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs text-[#111c2d] font-semibold text-right ${
                      isEditingGuest
                        ? 'bg-white border border-[#004337]'
                        : 'bg-[#f0f3ff]/60 border border-transparent'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#6f7975] block mb-1">
                  توضیحات یا ساعت ورود (اختیاری)
                </label>
                <input
                  type="text"
                  value={arrivalNote}
                  onChange={(e) => setArrivalNote(e.target.value)}
                  placeholder="ساعت تقریبی تحویل یا درخواست هماهنگی..."
                  className="w-full bg-[#f0f3ff]/40 border border-[#bfc9c4]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#111c2d] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#004337]"
                />
              </div>
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#bfc9c4]/30 flex flex-col gap-2.5">
            <h3 className="text-sm font-bold text-[#111c2d] pb-1">جزئیات هزینه</h3>

            {loadingPrice ? (
              <div className="py-4 text-center text-xs text-gray-500">
                در حال محاسبه دقیق صورتحساب سرور...
              </div>
            ) : pricing ? (
              <>
                <div className="flex items-center justify-between text-xs text-[#3f4945]">
                  <span>
                    {toPersianDigits(pricing.unitsCount)}{' '}
                    {rentalDuration === 'daily' ? 'شب اقامت' : 'ماه اجاره'}
                  </span>
                  <span className="font-semibold text-[#111c2d]">
                    {formatToman(pricing.subtotal)}
                  </span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#004337]">
                    <span>تخفیف اقامت طولانی (۱۵٪)</span>
                    <span className="font-bold">{formatToman(pricing.discountAmount)}-</span>
                  </div>
                )}

                {pricing.cleaningFee > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#3f4945]">
                    <span>سرویس و خدمات نظافت هتلینگ</span>
                    <span className="font-semibold text-[#111c2d]">
                      {formatToman(pricing.cleaningFee)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-[#3f4945]">
                  <span>ضمانت سلامت و تحویل آشیانه</span>
                  <span className="font-bold text-[#004337]">رایگان</span>
                </div>

                <div className="h-px bg-gray-100 my-1"></div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-[#111c2d]">مجموع پرداختی:</span>
                  <div className="flex items-baseline gap-1 text-[#004337] font-extrabold">
                    <span className="text-xl tracking-tight">
                      {formatToman(pricing.totalAmount, false)}
                    </span>
                    <span className="text-xs font-normal text-[#6f7975]">تومان</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Shaparak Gateway Selector matching HTML Mockup */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#bfc9c4]/30 flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#111c2d]">درگاه پرداخت شاپرک</span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedGateway('mellat')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedGateway === 'mellat'
                    ? 'border-[#004337] bg-[#aaf0dc]/25 shadow-xs'
                    : 'border-[#bfc9c4]/40 bg-[#f0f3ff]/50 hover:bg-[#f0f3ff] opacity-80'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    selectedGateway === 'mellat' ? 'text-[#004337]' : 'text-gray-500'
                  }`}
                >
                  account_balance
                </span>
                <span className="text-xs font-bold mt-1 text-[#111c2d]">بانک ملت</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('zarinpal')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedGateway === 'zarinpal'
                    ? 'border-[#004337] bg-[#aaf0dc]/25 shadow-xs'
                    : 'border-[#bfc9c4]/40 bg-[#f0f3ff]/50 hover:bg-[#f0f3ff] opacity-80'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    selectedGateway === 'zarinpal' ? 'text-[#004337]' : 'text-gray-500'
                  }`}
                >
                  credit_card
                </span>
                <span className="text-xs font-bold mt-1 text-[#111c2d]">زرین‌پال</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('saman')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedGateway === 'saman'
                    ? 'border-[#004337] bg-[#aaf0dc]/25 shadow-xs'
                    : 'border-[#bfc9c4]/40 bg-[#f0f3ff]/50 hover:bg-[#f0f3ff] opacity-80'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    selectedGateway === 'saman' ? 'text-[#004337]' : 'text-gray-500'
                  }`}
                >
                  payments
                </span>
                <span className="text-xs font-bold mt-1 text-[#111c2d]">سامان کیش</span>
              </button>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="terms-agree"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#004337] focus:ring-0 cursor-pointer accent-[#004337]"
              />
              <label htmlFor="terms-agree" className="text-xs text-[#6f7975] cursor-pointer">
                قوانین رزرو و مقررات لغو را می‌پذیرم.
              </label>
            </div>

            {errorMsg && (
              <div className="text-xs text-[#ba1a1a] bg-[#ffdad6]/60 p-2.5 rounded-xl font-medium">
                {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Bar matching HTML Mockup */}
        <aside className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-[#f9f9ff]/95 backdrop-blur-xl border-t border-[#bfc9c4]/30 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col shrink-0">
              <span className="text-[11px] text-[#6f7975]">مبلغ نهایی:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-[#111c2d] tracking-tight">
                  {pricing ? formatToman(pricing.totalAmount, false) : '...'}
                </span>
                <span className="text-[11px] text-[#6f7975]">تومان</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={submitting || loadingPrice}
              className="flex-1 bg-[#004337] hover:bg-[#0d5c4d] disabled:opacity-50 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold shadow-md active:scale-[0.98] transition-all"
              type="button"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>در حال اتصال امن به شاپرک...</span>
                </>
              ) : (
                <>
                  <span>پرداخت در درگاه شاپرک</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
