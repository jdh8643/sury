# 수리수리 다수리 - 우리 동네 수리 플랫폼

우리 동네의 모든 수리 서비스를 한 곳에서 만나보세요!

## 주요 기능

- **수리점 지도**: 내 주변의 모든 수리점을 한눈에 확인
- **차량 수리**: 자동차 정비소 검색 및 예약
- **건물 관리**: 건물 관리 및 수리 서비스 연결
- **수리점 정보**: 상세한 수리점 정보와 리뷰 확인

## 기술 스택

- Frontend: Next.js, TypeScript, Tailwind CSS
- Maps: Kakao Maps API
- Styling: Tailwind CSS

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/jdh8643/map-map.git
cd map-map
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 확인
```
http://localhost:3000
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 페이지
│   ├── map/                  # 지도 관련 컴포넌트
│   ├── car-management/       # 차량 관리 기능
│   ├── building-management/  # 건물 관리 기능
│   ├── shop/                # 수리점 상세 정보
│   └── components/          # 공통 컴포넌트
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
