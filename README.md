# 🚗 IsItempty 프론트엔드 개발 가이드

이 문서는 프론트엔드 개발자가 IsItempty 백엔드 API와 연동하여 개발하는 방법을 안내합니다.
<br>

### **📌(현재 README 추가 수정 필요!)**

## 📋 목차

- [백엔드 API 연결 정보](#백엔드-api-연결-정보)
- [API 엔드포인트](#api-엔드포인트)
- [주차장 데이터 모델](#주차장-데이터-모델)
- [API 테스트 방법](#api-테스트-방법)
- [프론트엔드 개발 시 고려사항](#프론트엔드-개발-시-고려사항)
- [백엔드 개발 환경 설정](#백엔드-개발-환경-설정-선택사항)
- [프론트엔드 개발 환경 설정](#프론트엔드-개발-환경-설정)
- [문제 해결](#문제-해결)

## 🔌 백엔드 API 연결 정보

### 로컬 개발 환경

백엔드 서버는 기본적으로 다음 URL에서 실행됩니다:

```
http://localhost:8080
```

## 🔍 API 엔드포인트

현재 사용 가능한 API 엔드포인트:

| 엔드포인트 | 메서드 | 설명 | 응답 예시 |
|------------|--------|------|-----------|
| `/api/hello` | GET | 테스트용 API | `"Hello, World!"` |
| `/api/parking-lots` | GET | 모든 주차장 목록 조회 | 주차장 객체 배열 |
| `/api/parking-lots/{id}` | GET | 특정 주차장 조회 | 주차장 객체 |
| `/api/parking-lots` | POST | 새 주차장 추가 | 생성된 주차장 객체 |
| `/api/parking-lots/{id}` | PUT | 주차장 정보 수정 | 수정된 주차장 객체 |
| `/api/parking-lots/{id}` | DELETE | 주차장 삭제 | 상태 코드 |

## 📊 주차장 정적 데이터 모델

주차장 객체의 구조:

```json
{
  "id": 1,
  "name": "강남역 주차장",
  "address": "서울시 강남구 강남대로 396",
  "totalSpaces": 200,
  "availableSpaces": 120,
  "isOpen": true,
  "hourlyRate": 3000,
  "latitude": 37.498095,
  "longitude": 127.027610,
  "description": "강남역 근처 24시간 주차장",
  "lastUpdated": "2025-04-06T18:30:00"
}
```

## 🧪 API 테스트 방법

### Postman 사용

1. Postman 다운로드 및 설치: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. 새 요청 생성 및 URL 설정 (예: `http://localhost:8080/api/parking-lots`)
3. 요청 메서드 선택 (GET, POST 등)
4. POST/PUT 요청의 경우 Body 탭에서 JSON 데이터 입력
5. Send 버튼 클릭하여 요청 전송

### 예시 요청

#### 주차장 목록 조회 (GET)

```http
GET http://localhost:8080/api/parking-lots
```

#### 새 주차장 추가 (POST)

```http
POST http://localhost:8080/api/parking-lots
Content-Type: application/json

{
  "name": "테스트 주차장",
  "address": "서울시 강남구",
  "totalSpaces": 100,
  "isOpen": true,
  "hourlyRate": 2000,
  "latitude": 37.5665,
  "longitude": 126.9780,
  "description": "테스트 주차장입니다."
}
```

## 💡 프론트엔드 개발 시 고려사항

### CORS 설정

백엔드는 CORS를 허용하도록 설정되어 있습니다. 기본적으로 `localhost`에서의 요청을 허용합니다.

### 인증 (향후 구현 예정)

현재는 인증이 구현되어 있지 않습니다. 향후 JWT 기반 인증이 추가될 예정입니다.

### 실시간 데이터 업데이트

주차장 가용 공간은 실시간으로 변경될 수 있습니다. 주기적으로 데이터를 갱신하는 로직을 구현하는 것이 좋습니다.

```javascript
// 예시: 30초마다 주차장 데이터 갱신
setInterval(async () => {
  const response = await fetch('http://localhost:8080/api/parking-lots');
  const parkingLots = await response.json();
  updateParkingLotDisplay(parkingLots);
}, 30000);
```

## 🔧 백엔드 개발 환경 설정 (선택사항)
### ***✅프론트 개발자도 IntelliJ IDEA 설치 추천 ❗❗❗***
프론트엔드 개발자도 필요한 경우 백엔드를 로컬에서 실행할 수 있습니다:

1. 백엔드 저장소 클론:
    ```bash
    git clone https://github.com/isitempty/backend.git
    cd backend
    ```

2. SSH 터널 설정:
    ```bash
    ./scripts/setup-ssh-tunnel.sh
    ```

3. 백엔드 애플리케이션 실행:
    ```bash
    ./gradlew bootRun
    ```

자세한 내용은 백엔드 저장소의 README.md를 참조하세요.

## 🚀 프론트엔드 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 프로젝트 설정

1. 프로젝트 클론:
```bash
git clone https://github.com/isitempty/frontend.git
cd frontend
```

2. 의존성 설치:
```bash
npm install
# 또는
yarn install
```

3. 개발 서버 실행:
```bash
npm run dev
# 또는
yarn dev
```

4. 브라우저에서 `http://localhost:3000` 접속

### 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## ⚠️ 문제 해결

### API 연결 오류

- 백엔드 서버가 실행 중인지 확인
- 올바른 URL과 포트를 사용하고 있는지 확인
- 네트워크 연결 상태 확인

### CORS 오류

오류 메시지: `Access to fetch at 'http://localhost:8080/api/parking-lots' from origin 'http://localhost:3000' has been blocked by CORS policy`

**[해결 방법]**

1. 백엔드 개발자에게 CORS 설정 확인 요청
2. 개발 환경에서 CORS 프록시 사용:
   ```bash
   npm install -g local-cors-proxy
   lcp --proxyUrl http://localhost:8080
   ```
    그리고 `http://localhost:8010/proxy` 엔드포인트 사용

### 상태 관리 관련 문제

- Redux DevTools 또는 React DevTools를 사용하여 상태 변화 디버깅
- 컴포넌트 리렌더링 이슈는 React.memo 또는 useMemo 고려

## 📱 반응형 디자인 가이드라인

IsItempty 애플리케이션은 다음 화면 크기를 지원해야 합니다:

- 모바일: 320px ~ 480px
- 태블릿: 481px ~ 768px
- 데스크톱: 769px 이상

```css
/* 반응형 디자인 예시 */
@media (max-width: 480px) {
  .parking-lot-card {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .parking-lot-card {
    width: 48%;
  }
}

@media (min-width: 769px) {
  .parking-lot-card {
    width: 30%;
  }
}
```

문제가 발생하거나 질문이 있는 경우 PM에게 문의하세요
---

© 2025 IsItempty Team