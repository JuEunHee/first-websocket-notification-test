FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 관련 파일만 먼저 복사
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 나머지 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN pnpm build

# --- Production Stage ---
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# 빌드 스테이지에서 standalone 빌드 결과물만 복사
# .next/standalone 폴더의 내용이 현 디렉토리(/usr/src/app)에 복사됩니다.
COPY --from=builder /usr/src/app/.next/standalone ./

# 정적 파일 복사
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000

# standalone 서버 실행
CMD ["node", "server.js"]