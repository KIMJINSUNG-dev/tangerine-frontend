# Tangerine Frontend

> Tangerine 서비스의 프론트엔드 저장소입니다.
> 백엔드 저장소: https://github.com/KIMJINSUNG-dev/tangerine

---

## 기술 스택

- React, TypeScript
- React Query (@tanstack/react-query)
- Axios, Tailwind CSS, React Router

---

## 주요 구현 사항

- JWT 기반 로그인 및 Access Token 자동 재발급 (axios 인터셉터)
- localStorage 단일 키 관리 + storage 이벤트로 탭 간 로그인 상태 동기화
- React Query 기반 서버 상태 관리 (useQuery, useMutation, invalidateQueries)
- TypeScript 도입 (JavaScript 프로젝트에서 점진적 전환)
- Tailwind CSS 기반 반응형 UI 및 다크모드

---

## 배포

- 빌드 결과물을 AWS S3에 업로드 후 CloudFront로 서빙
- 배포 URL: https://dzhda13pro9ex.cloudfront.net
