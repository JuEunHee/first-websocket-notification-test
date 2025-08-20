
'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Batcher } from '@tanstack/pacer';

// --- 타입 정의 ---
type Notification = {
  type: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
  timestamp: string;
};

type WebSocketState = {
  isConnected: boolean;
  notifications: Notification[];
};

type WebSocketContextType = {
  state: WebSocketState;
  // 향후 액션을 추가할 경우 여기에 정의
};

type Action = 
  | { type: 'SET_IS_CONNECTED'; payload: boolean }
  | { type: 'ADD_NOTIFICATIONS'; payload: Notification[] };

// --- 초기 상태 및 리듀서 ---
const initialState: WebSocketState = {
  isConnected: false,
  notifications: [],
};

const webSocketReducer = (state: WebSocketState, action: Action): WebSocketState => {
  console.log('Reducer 호출됨 - 액션:', action.type, '페이로드:', action.payload);
  switch (action.type) {
    case 'SET_IS_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'ADD_NOTIFICATIONS':
      const newState = { ...state, notifications: [...state.notifications, ...action.payload] };
      console.log('Reducer - 새 알림 추가 후 상태:', newState.notifications);
      return newState;
    default:
      return state;
  }
};

// --- Context 생성 ---
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// --- Provider 컴포넌트 ---
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
let socket: Socket;

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(webSocketReducer, initialState);

  useEffect(() => {
    // pacer 인스턴스 생성: 300ms 주기로 업데이트를 일괄 처리
    const pacer = new Batcher(
      (notifications: Notification[]) => {
        console.log('Batcher onUpdate 호출됨 - 처리할 알림:', notifications);
        dispatch({ type: 'ADD_NOTIFICATIONS', payload: notifications });
      },
      {
        wait: 300, // timeout 대신 wait 사용
      }
    );

    socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ 소켓 연결 성공');
      dispatch({ type: 'SET_IS_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      console.log('❌ 소켓 연결 끊어짐');
      dispatch({ type: 'SET_IS_CONNECTED', payload: false });
    });

    socket.on('notification', (notification: Notification) => {
      console.log('알림 수신 (WebSocket.on):', notification);
      pacer.addItem(notification);
      pacer.flush(); // 알림이 추가될 때마다 즉시 처리하도록 강제
      console.log('Batcher 현재 큐 상태:', pacer.peekAllItems()); // Batcher 내부 큐 상태 확인
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ state }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// --- 커스텀 훅 ---
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
