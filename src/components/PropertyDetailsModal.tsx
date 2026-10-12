import React, { useState } from 'react';
import { Property, RentalDuration, Review } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onProceedToBooking: (property: Property, duration: RentalDuration) => void;
  reviews: Review[];
  onAddReview: (propertyId: string, rating: number, comment: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onProceedToBooking,
  reviews,
  onAddReview,
}) => {
  if (!isOpen || !property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<RentalDuration>('daily');
  const [showShareToast, setShowShareToast] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `مشاهده اقامتگاه مبله ${property.title} در آشیانه`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview(property.id, newRating, newComment.trim());
    setNewComment('');
    setShowReviewForm(false);
  };

  // Price calculations based on duration tab
  let displayPrice = property.dailyPrice;
  let priceCycle = 'هر شب اقامت (با احتساب تخفیف)';
  let durationNote = (
    <div className="flex items-center gap-1.5 text-xs text-[#3f4945] leading-relaxed pt-1">
      <span className="material-symbols-outlined text-[17px] text-[#004337] shrink-0">
        savings
      </span>
      <span>
        برای اقامت‌های بیش از ۳ شب،{' '}
        <strong className="text-[#111c2d] font-bold">۱۵٪ تخفیف خودکار</strong> روی فاکتور نهایی لحاظ می‌گردد.
      </span>
    </div>
  );

  if (selectedDuration === 'monthly') {
    displayPrice = property.monthlyPrice;
    priceCycle = 'اجاره ماهانه مبله کامل';
    durationNote = (
      <div className="flex items-center gap-1.5 text-xs text-[#3f4945] leading-relaxed pt-1">
        <span className="material-symbols-outlined text-[17px] text-[#004337] shrink-0">
          task_alt
        </span>
        <span>
          قرارداد رسمی یک تا سه ماهه با نظافت هفتگی رایگان و تعویض رایگان ملحفه‌ها.
        </span>
      </div>
    );
  } else if (selectedDuration === 'yearly') {
    displayPrice = property.yearlyDeposit;
    priceCycle = 'ودیعه کامل سالانه (رهن)';
    durationNote = (
      <div className="flex items-center gap-1.5 text-xs text-[#3f4945] leading-relaxed pt-1">
        <span className="material-symbols-outlined text-[17px] text-[#004337] shrink-0">
          description
        </span>
        <span>
          تنظیم قرارداد هولوگرام‌دار اتحادیه املاک با ثبت سند امانی در سامانه خودنویس.
        </span>
      </div>
    );
  }

  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-start sm:p-4">
      <div className="bg-[#f9f9ff] text-[#111c2d] w-full max-w-2xl min-h-screen sm:min-h-0 sm:my-6 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative pb-28">
        {/* Sticky Header matching HTML design */}
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
              <h1 className="text-base font-bold text-[#111c2d]">مشخصات اقامتگاه</h1>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                aria-label="اشتراک‌گذاری"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#111c2d] hover:bg-[#e7eeff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>

              <button
                onClick={() => onToggleFavorite(property.id)}
                aria-label="افزودن به علاقه‌مندی‌ها"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#e7eeff] transition-colors"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isFavorite ? 'filled text-[#ba1a1a]' : 'text-[#111c2d]'
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Share Toast */}
        {showShareToast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#004337] text-white text-xs px-4 py-2 rounded-full shadow-lg">
            لینک اقامتگاه در کلیپ‌بورد کپی شد
          </div>
        )}

        {/* Gallery Section */}
        <div className="relative w-full bg-[#f9f9ff]">
          <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-gray-100">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 left-4 z-10">
              <span className="text-[11px] font-semibold bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#111c2d] shadow-xs">
                {toPersianDigits(activeImageIndex + 1)} از {toPersianDigits(property.images.length)} عکس
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2.5 p-3 overflow-x-auto bg-white border-b border-gray-100 no-scrollbar">
            {property.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                  activeImageIndex === idx
                    ? 'ring-2 ring-[#004337] opacity-100 scale-105'
                    : 'opacity-65 hover:opacity-100'
                }`}
                type="button"
              >
                <img src={imgUrl} alt={`عکس ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Title and Rating */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#3f4945]">
              <div className="flex items-center gap-1 text-[#004337] font-semibold">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>{property.addressApprox}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-[#111c2d]">
                <span className="material-symbols-outlined text-[16px] text-[#90321d] filled">
                  star
                </span>
                <span>{toPersianDigits(property.rating)}</span>
                <span className="text-[#3f4945] font-normal">
                  ({toPersianDigits(property.reviewsCount)} نظر)
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl text-[#111c2d] font-bold leading-tight">
              {property.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#3f4945] leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* 4 Feature Badges Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#004337]">
                <span className="material-symbols-outlined text-[22px]">groups</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#3f4945]">ظرفیت</span>
                <span className="text-xs font-bold text-[#111c2d]">
                  تا {toPersianDigits(property.capacity)} نفر
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#004337]">
                <span className="material-symbols-outlined text-[22px]">bed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#3f4945]">اتاق خواب</span>
                <span className="text-xs font-bold text-[#111c2d]">
                  {toPersianDigits(property.bedrooms)} خواب ({property.bedsDescription})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#004337]">
                <span className="material-symbols-outlined text-[22px]">hot_tub</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#3f4945]">حمام و سرویس</span>
                <span className="text-xs font-bold text-[#111c2d]">
                  {property.bathsDescription}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
              <div className="w-10 h-10 rounded-xl bg-[#f0f3ff] flex items-center justify-center text-[#004337]">
                <span className="material-symbols-outlined text-[22px]">straighten</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#3f4945]">متراژ زیربنا</span>
                <span className="text-xs font-bold text-[#111c2d]">
                  {toPersianDigits(property.area)} مترمربع
                </span>
              </div>
            </div>
          </div>

          {/* Rental Duration Segmented Tab */}
          <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111c2d]">بازه اجاره</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#f0f3ff] rounded-xl">
                {(['daily', 'monthly', 'yearly'] as RentalDuration[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedDuration(tab)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      selectedDuration === tab
                        ? 'bg-[#004337] text-white shadow-xs'
                        : 'text-[#3f4945] hover:text-[#111c2d]'
                    }`}
                  >
                    {tab === 'daily' ? 'روزانه' : tab === 'monthly' ? 'ماهانه' : 'سالانه'}
                  </button>
                ))}
              </div>
            </div>
            {durationNote}
          </div>

          {/* Amenities Grid */}
          <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <h3 className="text-sm font-bold text-[#111c2d]">امکانات رفاهی اقامتگاه</h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {property.amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#004337]">
                    {amenity.icon}
                  </span>
                  <span className="text-xs text-[#111c2d]">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Profile */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#111c2d]">{property.host.name}</span>
                  {property.host.isSuperhost && (
                    <span className="material-symbols-outlined text-[#004337] text-[16px]">
                      verified
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#3f4945]">
                  سوپرمیزبان آشیانه • پاسخ‌دهی {property.host.responseRate}
                </span>
              </div>
            </div>
            <span className="text-xs text-[#004337] font-semibold cursor-pointer hover:underline">
              مشاهده پروفایل
            </span>
          </div>

          {/* House Rules */}
          <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <h3 className="text-sm font-bold text-[#111c2d]">مقررات اقامتگاه</h3>
            <div className="flex flex-col gap-2 text-xs text-[#3f4945]">
              <div className="flex items-center justify-between py-1 border-b border-gray-100 font-semibold text-[#111c2d]">
                <span>ورود از {toPersianDigits(property.houseRules.checkIn)}</span>
                <span>خروج تا {toPersianDigits(property.houseRules.checkOut)}</span>
              </div>
              {property.houseRules.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#004337]">
                    check_circle
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Location Section */}
          <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111c2d]">موقعیت مکانی</h3>
              <span className="text-xs text-[#3f4945]">{property.location.approxAreaName}</span>
            </div>
            <div
              className="w-full h-44 bg-cover bg-center rounded-xl overflow-hidden relative flex items-center justify-center border border-gray-200"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9HMO91CgDOy6tfp9seG3Je7v58xnt3udTADkuoPhVqIxPuzb055Q7Z46c9RzabhVhDEFNZKt20Lsyi40k4RchslLzpnhKLro3_2rSaL-I5MFjVPBTBsFEzVqvGf0SLyf4OgJwFyoR_RjeUnGBjXA2qDm2kJalABwdsXm_rg6H8tFs3K3RUzyesbO7tMy5070D08mE4bng1MiUozhhGBlCLBstQfJIB1U94gOGpc_upfPbsRTKLqXY')`,
              }}
            >
              <div className="relative z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[18px] text-[#004337]">
                  apartment
                </span>
                <span className="text-xs font-bold text-[#111c2d]">
                  {property.location.approxAreaName}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-xs border border-[#bfc9c4]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#90321d] text-[18px] filled">
                  star
                </span>
                <span className="text-sm font-bold text-[#111c2d]">
                  {toPersianDigits(property.rating)}
                </span>
                <span className="text-xs text-[#3f4945]">
                  از {toPersianDigits(property.reviewsCount)} نظر مهمانان
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-[#004337] hover:underline"
              >
                {showReviewForm ? 'انصراف' : 'ثبت دیدگاه جدید'}
              </button>
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-3 bg-[#f0f3ff] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111c2d]">امتیاز شما:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`material-symbols-outlined text-[20px] ${
                          star <= newRating ? 'filled text-[#90321d]' : 'text-gray-300'
                        }`}
                      >
                        star
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="تجربه اقامت خود را بنویسید..."
                  rows={3}
                  className="w-full bg-white border border-[#bfc9c4]/50 rounded-xl p-2.5 text-xs text-[#111c2d] focus:outline-none focus:ring-1 focus:ring-[#004337]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#004337] text-white text-xs font-bold rounded-lg hover:bg-[#0d5c4d] transition-colors"
                >
                  ارسال نظر
                </button>
              </form>
            )}

            {/* Review Cards */}
            <div className="space-y-2.5 pt-1">
              {propertyReviews.length > 0 ? (
                propertyReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-[#f0f3ff]/70 rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111c2d]">{rev.userName}</span>
                      <span className="text-[11px] text-[#3f4945]">{rev.date}</span>
                    </div>
                    <p className="text-xs text-[#3f4945] leading-relaxed">«{rev.comment}»</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-[#f0f3ff]/70 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111c2d]">سهراب کاظمی</span>
                    <span className="text-[11px] text-[#3f4945]">اردیبهشت ۱۴۰۳</span>
                  </div>
                  <p className="text-xs text-[#3f4945] leading-relaxed">
                    «واحد بسیار تمیزتر از حد انتظار بود. چشم‌انداز تراس عالی و همه موارد آماده تحویل بود.»
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Booking Bar matching HTML Mockup */}
        <div className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl px-4 py-3.5 border-t border-[#bfc9c4]/30 shadow-xl flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-[#111c2d] tracking-tight">
                {formatToman(displayPrice, false)}
              </span>
              <span className="text-xs text-[#3f4945]">تومان</span>
            </div>
            <span className="text-[11px] text-[#3f4945]">{priceCycle}</span>
          </div>

          <button
            onClick={() => onProceedToBooking(property, selectedDuration)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004337] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#0d5c4d] active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">calendar_month</span>
            <span>انتخاب تاریخ و رزرو</span>
          </button>
        </div>
      </div>
    </div>
  );
};
