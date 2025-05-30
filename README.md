# 🚗 IsItEmpty 프론트엔드

<div align="center">
  <img src="./public/images/logo.png" alt="IsItEmpty Logo" width="400"/>
  
  > 🅿️ 실시간 주차장 빈자리 확인으로 주차 스트레스 해소!
</div>

서울시 공공데이터를 활용한 실시간 주차장 빈자리 확인 서비스의 프론트엔드 시스템입니다.

## 💡 서비스 소개

IsItEmpty는 다음과 같은 문제를 해결하기 위해 만들어졌습니다:

- 🚫 불법 주정차로 인한 사회적 문제
- 😫 주차 공간을 찾기 위한 불필요한 시간 낭비
- 🌍 교통 체증과 환경 오염

### 주요 기능

1. 🗺️ **실시간 지도 기반 서비스**
   - 카카오맵 기반 주차장 위치 표시
   - 실시간 빈자리 정보 업데이트
   - 현재 위치 기반 주변 주차장 검색

2. 🔍 **스마트 검색 시스템**
   - 주소 기반 주차장 검색
   - 다양한 필터링 옵션
   - 즐겨찾기 기능

3. 👥 **사용자 커뮤니티**
   - 주차장 리뷰 및 평점
   - 실시간 이용 후기
   - 주차장 정보 공유

4. 📱 **모바일 최적화**
   - 반응형 디자인
   - 터치 친화적 UI
   - 모바일 우선 설계

5. 👑 **관리자 대시보드**
   - 사용자 관리
     * 사용자 목록 조회
     * 사용자 정보 수정
     * 계정 삭제
     * 권한 레벨 변경 (관리자/일반 사용자)
   - 문의사항 관리
     * 문의 목록 조회
     * 문의 답변/삭제
   - 시스템 모니터링
     * 사용자 통계
     * 서비스 이용 현황

## 🛠 기술 스택

- **프레임워크**: 
  - ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
  - ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

- **언어**: 
  - ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
  - ![JSX](https://img.shields.io/badge/JSX-61DAFB?style=flat-square&logo=react&logoColor=black)

- **스타일링**: 
  - ![CSS Modules](https://img.shields.io/badge/CSS_Modules-000000?style=flat-square&logo=css3&logoColor=white)

- **상태 관리**: 
  - ![React Context](https://img.shields.io/badge/React_Context-61DAFB?style=flat-square&logo=react&logoColor=black)

- **라우팅**: 
  - ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white)

- **HTTP 클라이언트**: 
  - ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

- **지도**: 
  - ![Kakao Maps](https://img.shields.io/badge/Kakao_Maps-FFCD00?style=flat-square&logo=kakao&logoColor=black)

- **인증**: 
  - ![OAuth2.0](https://img.shields.io/badge/OAuth2.0-2C5BB4?style=flat-square)

- **배포**: 
  - ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
  - ![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

- **CI/CD**: 
  - ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)

## 📱 사용자 인터페이스

### 메인 화면
- 🗺️ 실시간 주차장 지도
- 🔍 주차장 검색 바
- ⭐ 즐겨찾기 주차장 바로가기

### 주차장 상세 정보
- 📍 위치 정보
- 💰 요금 정보
- 🕒 운영 시간
- 📊 실시간 주차 현황
- ⭐ 평점 및 리뷰

### 사용자 페이지
- 👤 프로필 관리
- 📝 내 리뷰 관리
- ⭐ 즐겨찾기 관리
- 📜 이용 내역

### 관리자 페이지
- 👥 사용자 관리 대시보드
  * 사용자 목록 테이블 뷰
  * 권한 관리 인터페이스
  * 계정 관리 도구
- 📮 문의사항 관리
  * 문의 목록 및 상태 관리
  * 답변 작성 인터페이스
- 📊 통계 및 모니터링
  * 사용자 활동 통계
  * 시스템 상태 모니터링

## 📁 프로젝트 구조

```
isitempty-frontend/
├── src/
│   ├── api/                # API 통신 모듈
│   │   ├── apiService.js   # API 요청 함수
│   │   └── axiosInstance.js # Axios 설정
│   ├── components/         # 재사용 컴포넌트
│   │   ├── Header/        # 헤더 컴포넌트
│   │   ├── Footer/        # 푸터 컴포넌트
│   │   └── common/        # 공통 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home/          # 홈 페이지
│   │   ├── Map/           # 지도 페이지
│   │   ├── Login/         # 로그인 페이지
│   │   ├── Signup/        # 회원가입 페이지
│   │   ├── Mypage/        # 마이페이지
│   │   └── Admin/         # 관리자 페이지
│   ├── repository/        # 로컬 스토리지
│   ├── App.jsx           # 앱 루트 컴포넌트
│   └── main.jsx          # 진입점
├── public/               # 정적 파일
├── index.html           # HTML 템플릿
└── package.json         # 프로젝트 설정
```

## ⚙️ 개발 환경 설정

1. 필수 요구사항
   - 📦 Node.js 20.x 이상
   - 📦 npm 10.x 이상

2. 환경변수 설정
   ```env
   VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_KAKAO_CLIENT_ID=your_kakao_client_id
   VITE_NAVER_CLIENT_ID=your_naver_client_id
   ```

3. 설치 및 실행
   ```bash
   # 의존성 설치
   npm install --legacy-peer-deps

   # 개발 서버 실행
   npm run dev

   # 프로덕션 빌드
   npm run build
   ```

4. Docker 실행
   ```bash
   # Docker 이미지 빌드
   docker build -t isitempty-frontend .

   # Docker 컨테이너 실행
   docker run -p 80:80 isitempty-frontend
   ```

## 🎨 디자인 가이드

### 색상 팔레트
- 🔵 Primary: `#4269cc`
- ⚫ Text: `#213547`
- ⚪ Background: `#ffffff`
- 🔘 Accent: `#646cff`

### 타이포그래피
- 기본 폰트: Inter, system-ui, Avenir
- 제목: 2.5em (h1), 2em (h2), 1.5em (h3)
- 본문: 1em

### 반응형 브레이크포인트
- 📱 모바일: < 768px
- 💻 태블릿: 768px ~ 1024px
- 🖥️ 데스크톱: > 1024px

## 🚀 배포

GitHub Actions를 통한 자동 배포:
1. main 브랜치 push 시 자동 빌드
2. 환경변수 주입
3. Docker 이미지 빌드
4. Nginx 설정 적용
5. 운영 서버 배포

## 🔍 성능 최적화

- 📦 Code Splitting
- 🔄 Lazy Loading
- 🖼️ 이미지 최적화
- 💾 캐싱 전략

## 🌐 브라우저 지원

- ![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=flat-square&logo=google-chrome&logoColor=white)
- ![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat-square&logo=firefox-browser&logoColor=white)
- ![Safari](https://img.shields.io/badge/Safari-000000?style=flat-square&logo=safari&logoColor=white)
- ![Edge](https://img.shields.io/badge/Edge-0078D7?style=flat-square&logo=microsoft-edge&logoColor=white)

## 📜 라이선스

This project is licensed under the MIT License - see the LICENSE file for details

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 관련 문의사항은 아래 채널을 통해 연락주세요:

- 이메일: contact@isitempty.kr
- 웹사이트: https://isitempty.kr
- GitHub: https://github.com/isitempty
