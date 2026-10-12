import React from 'react';
import { AppNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onViewBooking?: (bookingId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onViewBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
      <div className="bg-[#f9f9ff] text-[#111c2d] w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-[#bfc9c4]/30 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-16 px-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f0f3ff] text-[#111c2d] flex items-center justify-center hover:bg-[#e7eeff]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <h2 className="text-base font-bold text-[#111c2d]">اعلان‌ها و پیام‌ها</h2>
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-[#004337] hover:underline"
            type="button"
          >
            خوانده شدن همه
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              هیچ اعلانی در حال حاضر وجود ندارد.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-white border-gray-100 text-[#3f4945]'
                    : 'bg-[#aaf0dc]/20 border-[#004337]/30 text-[#111c2d] shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold">{n.title}</span>
                  <span className="text-[10px] text-gray-400">{n.createdAt}</span>
                </div>
                <p className="text-xs text-[#3f4945] leading-relaxed mt-1">{n.message}</p>
                {n.linkId && onViewBooking && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewBooking(n.linkId!);
                    }}
                    className="mt-2 text-[11px] font-bold text-[#004337] hover:underline flex items-center gap-1"
                  >
                    <span>مشاهده جزئیات سفارش</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
