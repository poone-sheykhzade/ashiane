import React, { useState } from 'react';
import { UserProfile, Booking } from '../types';
import { toPersianDigits, maskPhoneNumber, maskNationalId } from '../utils/formatters';

interface ProfileViewProps {
  user: UserProfile | null;
  bookings: Booking[];
  onUpdateProfile: (data: Partial<UserProfile>) => void;
  onExploreClick: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  bookings,
  onUpdateProfile,
  onExploreClick,
}) => {
  if (!user) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [nationalId, setNationalId] = useState(user.nationalId);
  const [isHostMode, setIsHostMode] = useState(user.role === 'host');

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalNights = confirmedBookings.reduce((sum, b) => sum + b.unitsCount, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName,
      email,
      phone,
      nationalId,
      role: isHostMode ? 'host' : 'guest',
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#111c2d]">حساب کاربری</h1>
        <p className="text-xs text-[#3f4945] mt-0.5">
          مشخصات هویتی، وضعیت احراز هویت و دسترسی به اطلاعات کاربری
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#bfc9c4]/30 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-[#004337] shadow-sm">
          <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-[#111c2d]">{user.fullName}</h2>
            {user.isVerified && (
              <span className="bg-[#aaf0dc]/50 text-[#004337] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>احراز هویت شده در سامانه شاهکار</span>
              </span>
            )}
          </div>

          <div className="text-xs text-[#3f4945] space-y-0.5">
            <p>شماره تماس: {maskPhoneNumber(user.phone)}</p>
            <p>کد ملی: {maskNationalId(user.nationalId)}</p>
            <p>ایمیل: {user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[#f0f3ff] hover:bg-[#e7eeff] text-[#004337] rounded-xl text-xs font-bold transition-colors"
        >
          {isEditing ? 'انصراف' : 'ویرایش اطلاعات'}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-5 border border-[#004337] shadow-sm space-y-4 text-xs animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-[#111c2d]">ویرایش مشخصات فردی</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-[#6f7975] block mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#f0f3ff] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-[#004337] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#6f7975] block mb-1">شماره تماس</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#f0f3ff] border border-gray-200 rounded-xl px-3 py-2 text-xs text-right focus:bg-white focus:border-[#004337] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6f7975] block mb-1">کد ملی</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#f0f3ff] border border-gray-200 rounded-xl px-3 py-2 text-xs text-right focus:bg-white focus:border-[#004337] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[#6f7975] block mb-1">پست الکترونیکی</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="w-full bg-[#f0f3ff] border border-gray-200 rounded-xl px-3 py-2 text-xs text-right focus:bg-white focus:border-[#004337] focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-[#004337] text-white font-bold rounded-xl hover:bg-[#0d5c4d] transition-colors"
          >
            ذخیره تغییرات
          </button>
        </form>
      )}

      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#bfc9c4]/30 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-[#004337]">
            {toPersianDigits(confirmedBookings.length)}
          </span>
          <span className="text-[11px] text-[#3f4945] mt-1">رزروهای قطعی</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#bfc9c4]/30 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-[#004337]">
            {toPersianDigits(totalNights)}
          </span>
          <span className="text-[11px] text-[#3f4945] mt-1">شب‌های اقامت</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#bfc9c4]/30 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-[#004337]">۱۰۰٪</span>
          <span className="text-[11px] text-[#3f4945] mt-1">ضمانت شاپرک</span>
        </div>
      </div>

      {/* Host Mode Switcher */}
      <div className="bg-[#e7eeff]/60 rounded-2xl p-4 border border-[#bfc9c4]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004337] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">add_home</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-[#111c2d]">میزبانی و ثبت اقامتگاه مبله</span>
            <span className="text-[11px] text-[#3f4945]">
              ملک لوکس مبله خود را در آشیانه ثبت کنید و کسب درآمد نمایید.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsHostMode(!isHostMode);
            onUpdateProfile({ role: !isHostMode ? 'host' : 'guest' });
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isHostMode ? 'bg-[#004337] text-white' : 'bg-white text-[#004337] border border-[#004337]'
          }`}
        >
          {isHostMode ? 'حالت میزبان فعال' : 'ثبت به عنوان میزبان'}
        </button>
      </div>

      {/* Support & Legal links */}
      <div className="bg-white rounded-2xl border border-[#bfc9c4]/30 shadow-xs overflow-hidden divide-y divide-gray-100 text-xs">
        <div className="p-4 flex items-center justify-between hover:bg-[#f0f3ff] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#004337]">support_agent</span>
            <span className="font-semibold text-[#111c2d]">پشتیبانی ۲۴ ساعته آشیانه</span>
          </div>
          <span className="font-bold text-[#004337] font-mono">۰۲۱-۸۸۸۸۴۴۴۴</span>
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-[#f0f3ff] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#004337]">gavel</span>
            <span className="font-semibold text-[#111c2d]">قوانین استرداد وجه و لغو اقامت</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-gray-400">chevron_left</span>
        </div>

        <div className="p-4 flex items-center justify-between hover:bg-[#f0f3ff] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#004337]">verified_user</span>
            <span className="font-semibold text-[#111c2d]">امنیت پرداخت الکترونیک شاپرک</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-gray-400">chevron_left</span>
        </div>
      </div>
    </div>
  );
};
