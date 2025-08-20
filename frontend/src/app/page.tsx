
'use client';

import { NotificationIcon } from "@/components/NotificationIcon";

export default function Home() {
  const sendTestNotification = async () => {
    try {
      const response = await fetch('http://localhost:8080/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '프론트엔드에서 보낸 테스트 알림입니다.',
          type: 'TEST_NOTIFICATION',
          level: 'INFO',
        }),
      });

      if (response.ok) {
        console.log('테스트 알림 전송 성공!');
        alert('테스트 알림 전송 성공!');
      } else {
        console.error('테스트 알림 전송 실패:', response.statusText);
        alert('테스트 알림 전송 실패!');
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('네트워크 오류 발생!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              {/* Notification Icon Component */}
              <NotificationIcon />
            </div>
          </div>
        </nav>
      </header>
      <main className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome!</h2>
          <p className="mt-2 text-gray-600">알림 아이콘을 클릭하여 실시간 알림을 확인하세요.</p>
          <button
            onClick={sendTestNotification}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            테스트 알림 보내기
          </button>
          {/* 여기에 다른 대시보드 컨텐츠가 올 수 있습니다. */}
        </div>
      </main>
    </div>
  );
}
