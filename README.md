# ZerOne 포트폴리오

송찬우(Chanwoo Song)의 포트폴리오, https://www.zero0ne.dev

## 내용 고치기

- 문구, 링크, AXIT, 프로젝트, 논문, 기사는 모두 `src/lib/content.ts`에 있습니다. 화면 코드를 건드리지 않고 이 파일만 고치면 됩니다.
- 프로필 사진은 `src/lib/profile/`에 jpg, png, webp 중 한 장을 두면 첫 화면 이름 옆에 자동으로 나옵니다. 파일 이름은 이미지 검색에 쓰이니 `chanwoo-song.webp`처럼 이름을 넣어 주세요.
- 프로젝트와 AXIT 이미지는 `static/work/`, 늘봄 로고는 `static/projects/web/`에 있습니다. 고교 탐구 그림은 이미지 파일이 아니라 `src/lib/components/figures/`의 SVG 컴포넌트입니다.

## 블로그

- `/blog`에 Medium(@zeroone-dev)에 올린 글을 옮겨 둡니다. 글 하나가 `src/lib/blog/posts/<slug>.json` 파일 하나이고, 그림은 `static/blog/<slug>/`에 있습니다. Medium의 GIF는 MP4로 바꿔 둡니다.
- Medium 글 id, Medium 주소, 블로그 slug, 대시보드 id의 짝은 `src/lib/blog/medium-map.json`에 있습니다.
- 새 글 가져오기(Node 22, ffmpeg 필요):

```bash
node scripts/import-medium.mjs --id <Medium 글 id> --slug 2026-10-21-some-title  # 새 글 하나
node scripts/import-medium.mjs --id <Medium 글 id>  # 이미 있는 글 다시 가져오기
node scripts/import-medium.mjs  # 전부
```

- 글은 Medium에 올라간 그대로 옮깁니다. Medium 리다이렉트 링크와 Facebook 추적 링크는 원래 주소로 풀고, 다른 Medium 글로 가는 링크는 블로그 글로 바꿉니다.
- `/blog/rss.xml`(RSS), `/sitemap.xml`, `/llms.txt`의 블로그 목록은 배포할 때 글 파일로 만들어집니다.

## 검색 노출 (SEO · GEO)

- 검색 결과와 공유 링크에 나오는 제목, 설명, 카드 이미지는 `content.ts`의 `meta`에 있습니다. 카드 이미지는 `static/og.png`(1200×630)입니다.
- 검색엔진이 읽는 구조화 데이터(schema.org JSON-LD)는 `src/lib/seo.ts`가 `content.ts`로 만듭니다. 화면에 링크로 두지 않을 프로필(위키데이터 항목, LinkedIn 등)은 `content.ts`의 `otherProfiles`에 URL을 넣으면 `sameAs`에 들어갑니다.
- AI 어시스턴트용 요약 `/llms.txt`도 배포할 때 `content.ts`와 블로그 글로 만들어집니다. `robots.txt`는 `static/`에, `sitemap.xml`은 `src/routes/sitemap.xml/`에 있습니다.

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

Vercel에 `@sveltejs/adapter-vercel`로 배포합니다. 페이지는 배포할 때 미리 만들어(prerender) 정적 파일로 제공합니다. `master`에 푸시하면 프로덕션, 다른 브랜치에 푸시하면 프리뷰 배포가 만들어집니다.

## Blog traffic analytics

Production uses the maintained `@vercel/analytics/sveltekit` SDK (2.0.1). Root layout
initializes its supported SPA subscription only on zero0ne.dev/www.zero0ne.dev;
`filterBlogEvent` accepts pageviews only for `/blog` and the exact published paths
generated from the same server post list as RSS. Every event drops query and hash;
preview hosts, admin, RSS, unknown articles and custom events are rejected. No
application visitor identity, cookies, database or analytics credentials are added.
RSS retains full-navigation `data-sveltekit-reload`.

Vercel Hobby includes 50,000 events/month and one month of reporting; collection
is capped rather than billed for overages. Official UI metrics are read by the
existing Mac dashboard collector, not by SSR or an API token. Visitor counts use
Vercel's privacy-preserving identity discarded after 24h: not people, sessions,
followers or reads. Never add overlapping reporting-window snapshots together.
See https://vercel.com/docs/analytics/limits-and-pricing,
https://vercel.com/docs/analytics/quickstart and
https://vercel.com/docs/analytics/privacy-policy.

Validate: Node22 `npm run check`, `npm run build`, and
`node --experimental-strip-types --test tests/blog-analytics.test.mjs`.
