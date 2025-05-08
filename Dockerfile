# 빌드 단계
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# 환경변수 설정
ARG VITE_KAKAO_MAP_API_KEY
ENV VITE_KAKAO_MAP_API_KEY=${VITE_KAKAO_MAP_API_KEY}
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ARG VITE_KAKAO_CLIENT_ID
ENV VITE_KAKAO_CLIENT_ID=${VITE_KAKAO_CLIENT_ID}
ARG VITE_NAVER_CLIENT_ID
ENV VITE_NAVER_CLIENT_ID=${VITE_NAVER_CLIENT_ID}

RUN npm run build

# 프로덕션 단계
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
