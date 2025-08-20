# 🚀 Next.js & Nest.js 기반 실시간 알림 시스템 구축

본 프로젝트는 Next.js(프론트엔드)와 Nest.js(백엔드) 환경에서 웹소켓을 활용하여 실시간 알림 기능을 구현하는 것을 목표로 합니다.

---

### 🌟 주요 기능

- **실시간 알림:** 서버에서 발생한 이벤트를 클라이언트에 실시간으로 푸시합니다.
- **알림 범위 제어:** 전체(Global), 그룹(Workspace), 개인(Private)을 대상으로 알림을 선택적으로 전송합니다.
- **상태 관리:** React Context API를 사용하여 소켓 연결 및 알림 데이터를 전역적으로 관리합니다.
- **성능 최적화:** `tanstack/pacer`를 이용해 단시간에 대량의 알림이 발생했을 때, 클라이언트의 렌더링 부하를 제어(백프레셔 대응)하고 알림을 배치 처리합니다.

### 🛠️ 기술 스택

- **백엔드:**
    - [Nest.js](https://nestjs.com/)
    - [@nestjs/websockets](https://docs.nestjs.com/websockets/gateways) (with Socket.IO)
- **프론트엔드:**
    - [Next.js](https://nextjs.org/) (React)
    - [Socket.IO Client](https://socket.io/docs/v4/client-api/)
    - [Tanstack Pacer](https://tanstack.com/pacer/latest)
    - TypeScript

### 📂 디렉토리 구조 (예상)

```
websocket-notification/
├── backend/
│   ├── src/
│   │   ├── events/
│   │   │   ├── events.gateway.ts     # 웹소켓 게이트웨이 (싱글톤)
│   │   │   └── events.module.ts
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts # 알림 트리거용 REST API
│   │   │   └── notifications.service.ts
│   │   └── app.module.ts
│   └── package.json
├── frontend/
│   ├── context/
│   │   └── WebSocketProvider.tsx     # 소켓 연결 및 상태 관리 (useContext)
│   ├── hooks/
│   │   └── useWebSocket.ts           # WebSocketProvider 데이터 사용을 위한 커스텀 훅
│   ├── components/
│   │   ├── NotificationIcon.tsx      # 네비게이션 바에 위치할 아이콘
│   │   └── NotificationPanel.tsx     # 알림 목록을 보여줄 패널
│   ├── pages/
│   │   ├── _app.tsx                  # WebSocketProvider 적용
│   │   └── index.tsx
│   └── package.json
└── README.md
```

### 🔌 웹소켓 이벤트 설계

- **Client-to-Server Events**
| Event | Payload | 설명 |
| --- | --- | --- |
| `joinRoom` | `{ room: string }` | 특정 워크스페이스나 사용자 개인을 위한 룸에 조인합니다. (예: `workspace-123`) |
| `leaveRoom` | `{ room: string }` | 특정 룸에서 나옵니다. |

- **Server-to-Client Events**
| Event | Payload | 설명 |
| --- | --- | --- |
| `notification` | `{ type: string, level: 'INFO'│'WARN'│'CRITICAL', message: string, timestamp: string }` | 클라이언트에게 전달되는 핵심 알림 데이터입니다. |
| `connected` | `{ sid: string }` | 클라이언트가 성공적으로 소켓에 연결되었을 때 서버가 전송합니다. |

### 🚀 실행 계획

1.  **1단계: 프로젝트 초기화**
    - `npx create-next-app@latest frontend`
    - `npx @nestjs/cli new backend`

2.  **2단계: 백엔드(Nest.js) 개발**
    - `EventsGateway`를 생성하고, `OnGatewayConnection`, `OnGatewayDisconnect` 인터페이스를 구현하여 연결/해제 로직을 관리합니다.
    - `joinRoom`, `leaveRoom` 이벤트를 처리하는 핸들러를 작성합니다.
    - 외부 시스템(또는 관리자)이 알림을 보낼 수 있도록 간단한 REST API 엔드포인트(`POST /notifications`)를 `NotificationsController`에 구현합니다. 이 엔드포인트는 `EventsGateway`를 통해 특정 룸이나 전체에 `notification` 이벤트를 전송합니다.

3.  **3단계: 프론트엔드(Next.js) 개발**
    - `socket.io-client`와 `@tanstack/pacer`를 설치합니다.
    - `WebSocketProvider`를 생성합니다.
        - 내부적으로 `socket.io-client` 인스턴스를 생성하고 서버와 연결합니다.
        - `pacer` 인스턴스를 생성하여 `notification` 이벤트를 수신할 때마다 알림을 큐에 추가하고, 지정된 시간 간격(예: 300ms)으로 상태를 일괄 업데이트합니다.
        - 연결 상태, 알림 목록 등의 상태를 `useReducer`로 관리하고 `Context.Provider`를 통해 하위 컴포넌트에 제공합니다.
    - `useWebSocket` 커스텀 훅을 만들어 컴포넌트에서 쉽게 컨텍스트 값에 접근할 수 있도록 합니다.
    - `_app.tsx`를 `WebSocketProvider`로 감싸 전역적으로 소켓 컨텍스트를 활성화합니다.
    - `NotificationIcon` 컴포넌트에서 `useWebSocket`을 사용하여 새 알림 여부를 뱃지 등으로 표시합니다.

4.  **4단계: 통합 및 테스트**
    - 백엔드 서버와 프론트엔드 개발 서버를 동시에 실행합니다.
    - 백엔드의 테스트 API를 호출하여 프론트엔드의 `NotificationIcon`에 실시간으로 알림이 반영되는지 확인합니다.
    - 대량의 알림을 짧은 시간에 발생시켜 `pacer`가 렌더링을 효과적으로 제어하는지 검증합니다.

### ✅ 주요 아키텍처 결정사항

- **싱글톤 게이트웨이:** Nest.js는 기본적으로 프로바이더를 싱글톤으로 관리합니다. 따라서 `EventsGateway`는 애플리케이션 전체에서 단 하나의 인스턴스만 생성되어 모든 웹소켓 연결을 효율적으로 관리합니다.
- **`useContext` 전역 상태 관리:** Prop-drilling을 피하고 어떤 컴포넌트에서든 소켓 관련 데이터(알림, 연결 상태 등)에 쉽게 접근하기 위해 React Context API를 사용합니다. 이는 애플리케이션의 확장성을 높여줍니다.
- **`tanstack/pacer`를 통한 백프레셔 대응:** 실시간 시스템에서는 수많은 이벤트가 동시에 발생할 수 있습니다. `pacer`를 통해 이러한 이벤트를 클라이언트에서 일괄 처리(batching)함으로써, 과도한 리렌더링으로 인한 성능 저하를 방지하고 안정적인 사용자 경험을 제공합니다.