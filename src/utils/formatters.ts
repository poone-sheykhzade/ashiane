/**
 * Persian number and currency formatting utilities
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toPersianDigits(input: number | string | undefined | null): string {
  if (input === undefined || input === null) return '';
  return input.toString().replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

export function toEnglishDigits(input: string): string {
  if (!input) return '';
  return input.replace(/[۰-۹]/g, (w) => ENGLISH_DIGITS[PERSIAN_DIGITS.indexOf(w)]);
}

export function formatToman(amount: number | undefined | null, includeUnit: boolean = true): string {
  if (amount === undefined || amount === null) return includeUnit ? '۰ تومان' : '۰';
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianFormatted = toPersianDigits(parts);
  return includeUnit ? `${persianFormatted} تومان` : persianFormatted;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const clean = toEnglishDigits(phone).replace(/\s+/g, '');
  if (clean.length < 11) return toPersianDigits(phone);
  // e.g. 0912***4567 -> ۰۹۱۲***۴۵۶۷
  const masked = clean.substring(0, 4) + '***' + clean.substring(clean.length - 4);
  return toPersianDigits(masked);
}

export function maskNationalId(nationalId: string): string {
  if (!nationalId) return '';
  const clean = toEnglishDigits(nationalId).replace(/\s+/g, '');
  if (clean.length < 10) return toPersianDigits(nationalId);
  // e.g. 008******2 -> ۰۰۸******۲
  const masked = clean.substring(0, 3) + '******' + clean.substring(clean.length - 1);
  return toPersianDigits(masked);
}

export function isValidIranianPhone(phone: string): boolean {
  const clean = toEnglishDigits(phone).replace(/[\s-+]/g, '');
  return /^09\d{9}$/.test(clean);
}

export function isValidIranianNationalId(code: string): boolean {
  const clean = toEnglishDigits(code).trim();
  if (!/^\d{10}$/.test(clean)) return false;
  if (/^(\d)\1{9}$/.test(clean)) return false; // Not all digits identical

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  const checkDigit = parseInt(clean[9], 10);

  return remainder < 2 ? checkDigit === remainder : checkDigit === 11 - remainder;
}

/**
 * Simple Persian calendar helper for display
 */
export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export function getTodayJalaliDisplay(): string {
  return `${toPersianDigits(14)} ${PERSIAN_MONTHS[7]} ${toPersianDigits(1403)}`;
}

export function formatStayDateRange(startDateStr: string, endDateStr: string, nights: number): string {
  // Format into Persian e.g. ۲۴ تا ۲۷ آبان (۳ شب)
  return `${toPersianDigits(startDateStr)} تا ${toPersianDigits(endDateStr)} (${toPersianDigits(nights)} شب)`;
}
