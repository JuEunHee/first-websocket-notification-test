# Stage 1: Build
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
FROM node:22-alpine

WORKDIR /usr/src/app

# 빌드 스테이지에서 빌드 결과물과 의존성 복사
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 8080

CMD ["node", "dist/main"]
