
'use client';

// --- 타입 정의 ---
type Notification = {
  type: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
  timestamp: string;
};

interface NotificationPanelProps {
  notifications: Notification[];
}

const getLevelColor = (level: Notification['level']) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-100 border-red-500';
    case 'WARN': return 'bg-yellow-100 border-yellow-500';
    case 'INFO':
    default: return 'bg-blue-100 border-blue-500';
  }
};

export const NotificationPanel = ({ notifications }: NotificationPanelProps) => {
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">알림</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notif, index) => (
            <div key={index} className={`p-4 ${getLevelColor(notif.level)} border-l-4`}>
              <div className="flex justify-between items-start">
                <p className="font-bold text-sm text-gray-800">{notif.type}</p>
                <p className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleTimeString()}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500">새로운 알림이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
