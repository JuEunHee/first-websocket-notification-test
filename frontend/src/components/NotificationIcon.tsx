
'use client';

import { useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { NotificationPanel } from './NotificationPanel';

export const NotificationIcon = () => {
  const { state } = useWebSocket();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);

  const totalNotifications = state.notifications.length;
  const unreadCount = totalNotifications - readCount;

  const handleIconClick = () => {
    setIsPanelOpen(prev => !prev);
    // 패널을 열 때 모든 알림을 읽음 처리
    if (!isPanelOpen) {
      setReadCount(totalNotifications);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleIconClick} className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none">
        {/* Bell Icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isPanelOpen && <NotificationPanel notifications={state.notifications} />}
    </div>
  );
};
