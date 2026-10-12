import React, { useState, useEffect } from 'react';
import { Booking, PaymentGateway } from '../types';
import { toPersianDigits, formatToman } from '../utils/formatters';
import { api } from '../services/api';

interface ShaparakGatewayModalProps {
  booking: Booking | null;
  gateway: PaymentGateway;
  isOpen: boolean;
  onSuccess: (confirmedBooking: Booking) => void;
  onCancel: () => void;
}

export const ShaparakGatewayModal: React.FC<ShaparakGatewayModalProps> = ({
  booking,
  gateway,
  isOpen,
  onSuccess,
  onCancel,
}) => {
  if (!isOpen || !booking) return null;

  const [timeLeft, setTimeLeft] = useState(599); // 10 minutes in seconds
  const [cardNumber, setCardNumber] = useState('6104 3378 9012 4580');
  const [cvv2, setCvv2] = useState('742');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('06');
  const [dynamicOtp, setDynamicOtp] = useState('84912');
  const [otpSent, setOtpSent] = useState(true);
  const [captchaCode, setCaptchaCode] = useState('5839');
  const [captchaInput, setCaptchaInput] = useState('5839');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${toPersianDigits(m < 10 ? '0' + m : m)}:${toPersianDigits(s < 10 ? '0' + s : s)}`;
  };

  const getGatewayTitle = () => {
    switch (gateway) {
      case 'mellat':
        return 'شرکت به‌پرداخت ملت (بانک ملت)';
      case 'saman':
        return 'پرداخت الکترونیک سامان کیش';
      case 'zarinpal':
        return 'درگاه پرداخت امن زرین‌پال';
    }
  };

  const handlePay = async () => {
    if (captchaInput !== captchaCode) {
      setErrorMessage('کد امنیتی صحیح نمی‌باشد.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');

      // Real server-side verification!
      const confirmed = await api.verifyPayment(
        booking.id,
        gateway,
        `SHP-${Math.floor(10000000 + Math.random() * 90000000)}`
      );

      setIsProcessing(false);
      onSuccess(confirmed);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'خطا در تایید تراکنش در سامانه شاپرک.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 flex flex-col font-sans">
        {/* Official Shaparak Top Header */}
        <div className="bg-[#004337] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px] text-white">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">درگاه پرداخت الکترونیک شاپرک</span>
              <span className="text-[10px] text-emerald-200">{getGatewayTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-mono font-bold text-amber-300">
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Transaction Summary Table */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">پذیرنده اینترنتی:</span>
            <span className="font-bold text-slate-800">سامانه اقامتگاه‌های مبله آشیانه</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">شماره ترمینال / پذیرنده:</span>
            <span className="font-mono text-slate-700">۴۴۸۹۰۱۵۲</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">شناسه سفارش / رزرو:</span>
            <span className="font-mono font-bold text-[#004337]">{booking.bookingCode}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-600 font-bold">مبلغ قابل پرداخت:</span>
            <div className="flex items-baseline gap-1 text-emerald-700 font-extrabold text-sm sm:text-base">
              <span>{formatToman(booking.pricing.totalAmount, false)}</span>
              <span className="text-xs font-normal text-slate-500">تومان</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-5 space-y-4 text-xs">
          {/* Card Number */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">شماره کارت شتابی (۱۶ رقمی)</label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-center text-sm font-bold text-slate-800 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold">💳</span>
            </div>
          </div>

          {/* CVV2 and Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">کد شناسایی دوم (CVV2)</label>
              <input
                type="password"
                value={cvv2}
                maxLength={4}
                onChange={(e) => setCvv2(e.target.value)}
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">تاریخ انقضای کارت</label>
              <div className="flex items-center gap-1.5" dir="ltr">
                <input
                  type="text"
                  value={expMonth}
                  maxLength={2}
                  placeholder="ماه"
                  onChange={(e) => setExpMonth(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="text"
                  value={expYear}
                  maxLength={2}
                  placeholder="سال"
                  onChange={(e) => setExpYear(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-center font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Dynamic OTP */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">رمز اینترنتی پویا</label>
              <button
                type="button"
                onClick={() => {
                  setDynamicOtp(Math.floor(10000 + Math.random() * 90000).toString());
                  setOtpSent(true);
                }}
                className="text-[11px] text-[#004337] hover:underline font-semibold"
              >
                درخواست رمز پویا
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={dynamicOtp}
                onChange={(e) => setDynamicOtp(e.target.value)}
                dir="ltr"
                placeholder="رمز پیامک‌شده"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
              />
              <span className="px-3 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl flex items-center text-[11px]">
                {otpSent ? 'ارسال شد' : ''}
              </span>
            </div>
          </div>

          {/* Captcha */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">کد امنیتی تصویر</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                dir="ltr"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#004337] focus:bg-white"
              />
              <div
                onClick={() => {
                  const nextCode = Math.floor(1000 + Math.random() * 9000).toString();
                  setCaptchaCode(nextCode);
                  setCaptchaInput(nextCode);
                }}
                className="w-24 h-10 bg-slate-200 rounded-xl flex items-center justify-center font-mono font-extrabold text-base tracking-widest text-slate-700 select-none cursor-pointer border border-dashed border-slate-400"
                title="کلیک برای نوسازی کد"
              >
                {captchaCode}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 py-3 bg-[#004337] hover:bg-[#0d5c4d] disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>در حال تایید پرداخت بانکی...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>پرداخت و تایید نهایی</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="py-3 px-5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-colors"
          >
            انصراف
          </button>
        </div>

        {/* Security Footer Note */}
        <div className="px-4 py-2 bg-slate-200 text-[10px] text-slate-600 text-center flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-emerald-700">security</span>
          <span>اتصال امن رمزنگاری‌شده ۲۵۶ بیتی SSL تحت نظارت شاپرک بانک مرکزی</span>
        </div>
      </div>
    </div>
  );
};
