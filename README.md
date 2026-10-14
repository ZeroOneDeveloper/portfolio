# ZerOne 포트폴리오

송찬우(Chanwoo Song)의 포트폴리오, https://www.zero0ne.dev

## 내용 고치기

- 문구, 링크, AXIT, 프로젝트, 논문, 기사는 모두 `src/lib/content.ts`에 있습니다. 화면 코드를 건드리지 않고 이 파일만 고치면 됩니다.
- 프로필 사진은 `src/lib/profile/`에 jpg, png, webp 중 한 장을 두면 첫 화면 이름 옆에 자동으로 나옵니다.
- 프로젝트와 AXIT 이미지는 `static/work/`, 늘봄 로고는 `static/projects/web/`에 있습니다. 고교 탐구 그림은 이미지 파일이 아니라 `src/lib/components/figures/`의 SVG 컴포넌트입니다.

## 개발

```bash
pnpm install
pnpm dev     # 로컬 서버
pnpm check   # 타입 검사
pnpm lint    # Prettier + ESLint
pnpm build   # 프로덕션 빌드
```

Node 22가 필요합니다(`package.json`의 `engines`).

## 배포

Vercel에 `@sveltejs/adapter-vercel`로 배포합니다. `master`에 푸시하면 프로덕션, 다른 브랜치에 푸시하면 프리뷰 배포가 만들어집니다.
