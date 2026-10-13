// Everything the page says lives here, so updating the portfolio means editing data,
// not markup. Keep entries factual and linkable.

export interface Link {
	label: string;
	href: string;
}

export const profile = {
	name: '송찬우',
	nameEn: 'Chanwoo Song',
	handle: 'ZerOne',
	role: '개발팀장',
	motto: '세상을 바꾸는 데 0과 1만으로도 충분하다.',
	url: 'https://www.zero0ne.dev/',
	github: 'https://github.com/ZeroOneDeveloper',
	/** Studio portrait. Replace this one file to swap the photo; keep the 7:9 portrait shape. */
	photo: {
		src: '/profile.webp',
		width: 900,
		height: 1157,
		alt: '송찬우 프로필 사진'
	},
	company: {
		name: '유니크굿컴퍼니',
		nameEn: 'Uniquegood Company',
		url: 'https://uniquegood.biz'
	},
	realworld: 'https://realworld.to',
	school: {
		name: '강원대학교 원주캠퍼스',
		department: '컴퓨터공학과',
		cohort: '25학번'
	},
	highSchool: {
		name: '경희고등학교',
		cohort: '63기',
		url: 'https://www.kyungheeboy.hs.kr/'
	}
} as const;

export const profileLinks: Link[] = [
	{ label: 'GitHub', href: profile.github },
	{ label: 'ORCID', href: 'https://orcid.org/0009-0008-2680-6367' },
	{ label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=9rZcbucAAAAJ' },
	{ label: 'DBpia', href: 'https://www.dbpia.co.kr/author/authorDetail?ancId=5473989' },
	{ label: profile.company.name, href: profile.company.url }
];

export const scholarLinks: Link[] = profileLinks.filter((link) =>
	['ORCID', 'Google Scholar', 'DBpia'].includes(link.label)
);

// Header navigation, in page order.
export const nav = [
	{ id: 'projects', label: '작업' },
	{ id: 'career', label: '경력' },
	{ id: 'research', label: '연구' },
	{ id: 'news', label: '기사' }
] as const;

export const focusAreas = [
	{
		title: 'AI 에이전트',
		body: 'AI 에이전트와 함께 제품을 만들고, 사람과 에이전트가 한 팀으로 일하는 방식을 다듬습니다.'
	},
	{
		title: '풀스택 개발',
		body: 'Next.js와 FastAPI, Docker까지. 기획부터 배포까지 한 흐름으로 만듭니다.'
	},
	{
		title: '의료 데이터 분석',
		body: '국민건강보험 코호트 데이터로 질환 사이의 위험을 분석하는 연구에 참여합니다.'
	}
] as const;

// The opening: what he does now, in one line built from the three focus areas.
export const intro = {
	positioning: 'AI 에이전트와 함께 풀스택으로 제품을 만들고, 의료 데이터를 분석합니다.',
	links: [
		{ label: profile.company.name, href: profile.company.url },
		{ label: '리얼월드', href: profile.realworld },
		{ label: 'GitHub', href: profile.github }
	] satisfies Link[]
};

export interface Citation {
	outlet: string;
	date: string;
	href: string;
}

const apnews: Citation = {
	outlet: 'AP신문',
	date: '2026.10.08',
	href: 'https://www.apnews.kr/news/articleView.html?idxno=3051891'
};

// The press story that names him directly: the lead work item.
export const featuredCase = {
	context: '유니크굿컴퍼니 합류 직후',
	shifts: [
		{ from: '8년', fromNote: '앱으로 운영된 기간', to: '3일', toNote: '웹 버전을 만든 기간' },
		{ from: '앱', fromNote: '설치해서 즐기던 게임', to: '웹', toNote: '설치 없이 즐기는 버전' }
	],
	title: 'AI 에이전트로, 8년 된 앱 게임을 사흘 만에 웹으로.',
	body: '유니크굿컴퍼니 합류 직후, 에이전트를 활용해 8년 동안 앱으로 운영된 게임 서비스를 설치 없이 즐길 수 있는 웹 버전으로 사흘 만에 개발했습니다. 2026년 10월 『나노벤처』 북토크에서 회사의 AI 에이전트 조직 시스템 ‘AXIT’ 도입 경험과 함께 이 사례를 발표했습니다.',
	quote:
		'처음엔 ‘어떡하지’보다 ‘해볼 만하다’는 생각이 먼저 들었다. 제가 잘해서라기보다 회사가 쌓아온 기술과 인프라가 있었기에 가능했다.',
	speaker: profile.name,
	quoteSource: apnews,
	sources: [
		apnews,
		{
			outlet: '경제타임스',
			date: '2026.09.30',
			href: 'https://www.ket.kr/news/article.html?no=41104'
		}
	] satisfies Citation[]
};

export interface WorkMedia {
	/** What the picture is, said plainly on the card. */
	label: '사이트 화면' | '출력 예시' | '로고' | '도식';
	alt: string;
	src?: string;
	width?: number;
	height?: number;
	/** Ground the image was made on, so the frame can match it. */
	tone: 'light' | 'dark';
}

export interface Project {
	id: string;
	name: string;
	year: string;
	role: string;
	summary: string;
	stack: string;
	links: Link[];
	media: WorkMedia;
}

export const projects: Project[] = [
	{
		id: 'code01',
		name: 'Code01',
		year: '2025–2026',
		role: '풀스택',
		summary:
			'대학 프로그래밍 수업을 위한 온라인 저지. 조직·문제·퀴즈를 관리하고, Docker 안의 Piston 엔진으로 코드를 자동 채점합니다.',
		stack: 'Next.js · FastAPI · PostgreSQL · Docker',
		links: [
			{ label: 'GitHub', href: 'https://github.com/ZeroOneDeveloper/Code01' },
			{
				label: 'KIIT 2025 논문',
				href: 'https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE12545663'
			}
		],
		media: {
			label: '도식',
			alt: 'Code01 채점 흐름 도식: 학생이 코드를 제출하면 Docker 안의 Piston 엔진이 자동 채점하고, 결과를 실시간으로 보여 줍니다.',
			tone: 'light'
		}
	},
	{
		id: 'neulbom',
		name: '늘봄 NeulBom',
		year: '2023–2024',
		role: '팀 리더',
		summary:
			'“당신 손 안의 작은 학교.” 게시판, 급식 달력, 바코드 학생증, 일정과 알림을 담은 학교 커뮤니티 PWA입니다.',
		stack: 'Next.js · FastAPI · MongoDB',
		links: [{ label: 'GitHub', href: 'https://github.com/KH-Programmers/NeulBom_Frontend' }],
		media: {
			label: '로고',
			src: '/projects/web/neulbom-dark.webp',
			width: 960,
			height: 960,
			alt: '늘봄 로고: 검은 바탕 위 분홍색 꽃잎 모양',
			tone: 'dark'
		}
	},
	{
		id: 'zerocut',
		name: 'ZeroCut',
		year: '2025',
		role: '오픈소스',
		summary: '인생네컷 스타일의 네 컷 사진을 만들어 주는 Python 라이브러리. PyPI에 배포했습니다.',
		stack: 'Python · Pillow',
		links: [{ label: 'PyPI', href: 'https://pypi.org/project/zerocut/' }],
		media: {
			label: '출력 예시',
			src: '/work/zerocut-photo-strip.webp',
			width: 1000,
			height: 2800,
			alt: 'ZeroCut으로 만든 세로 네 컷 사진. 흰 프레임에 그림 네 컷이 이어지고, 아래에 ‘[ ZEROCUT ] 나의 0을 1로 만드는 순간들’ 문구와 2025.06.14 날짜가 있습니다.',
			tone: 'light'
		}
	},
	{
		id: 'ods',
		name: 'ODS',
		year: '2023',
		role: '공동 개발',
		summary:
			'“당신의 목소리가 세상을 바꿀 수 있습니다.” 자원봉사자가 TED 영상을 더빙하는 플랫폼으로, 녹음과 편집을 브라우저에서 처리합니다.',
		stack: 'Next.js · Supabase · wavesurfer.js',
		links: [{ label: '사이트', href: 'https://ods.zero0ne.dev' }],
		media: {
			label: '사이트 화면',
			src: '/work/ods-home-desktop.webp',
			width: 1440,
			height: 900,
			alt: 'ODS 첫 화면. 필기체 ODS 로고 아래 ‘당신의 목소리가 세상을 바꿀 수 있습니다.’ 문구와 파란 시작하기 버튼이 있고, 그 아래 기능 소개 카드가 이어집니다.',
			tone: 'light'
		}
	},
	{
		id: 'uniquecode',
		name: 'UniqueCode',
		year: '2020–2022',
		role: '대표',
		summary:
			'“당신의 디스코드에 유니크한 재미를 더.” 디스코드 봇과 서비스를 만드는 팀을 창업해 이끌었습니다.',
		stack: '팀 운영 · 백엔드',
		links: [],
		media: {
			label: '로고',
			src: '/projects/web/uniquecode.webp',
			width: 640,
			height: 640,
			alt: 'UniqueCode 로고: 검은 바탕 위 흰 필기체 u',
			tone: 'dark'
		}
	},
	{
		id: 'uniquebots',
		name: 'UniqueBots',
		year: '2020–2021',
		role: 'UniqueCode',
		summary:
			'한국 디스코드 봇을 소개하고 홍보하는 봇 리스트 사이트. UniqueCode의 서비스로 운영했습니다.',
		stack: 'Next.js · GraphQL · Prisma',
		links: [{ label: 'GitHub', href: 'https://github.com/paring-chan/uniquebots' }],
		media: {
			label: '로고',
			src: '/projects/web/uniquebots.webp',
			width: 640,
			height: 640,
			alt: 'UniqueBots 로고: 밝은 회색 바탕 위 검은 UB 글자',
			tone: 'light'
		}
	},
	{
		id: 'freeai',
		name: 'FreeAI',
		year: '2020',
		role: '공동 제작',
		summary: '서버 관리, 음악, 게임, 레벨링, 검색을 한데 담은 다기능 디스코드 봇입니다.',
		stack: 'Discord Bot',
		links: [{ label: 'koreanbots', href: 'https://koreanbots.dev/bots/695899835953578025' }],
		media: {
			label: '로고',
			src: '/projects/web/freeai.webp',
			width: 640,
			height: 640,
			alt: 'FreeAI 로고: 검은 바탕 위 흰 삼각형 A',
			tone: 'dark'
		}
	}
];

export function projectById(id: string): Project {
	const found = projects.find((project) => project.id === id);
	if (!found) throw new Error(`Unknown project: ${id}`);
	return found;
}

export interface TimelineItem {
	kind: '회사' | '학교' | '논문' | '프로젝트' | '오픈소스' | '탐구' | '창업' | '서비스';
	title: string;
	detail: string;
	href?: string;
}

export interface TimelineYear {
	year: string;
	current?: boolean;
	items: TimelineItem[];
}

// Career, newest first. Only facts stated elsewhere on this page.
export const timeline: TimelineYear[] = [
	{
		year: '현재',
		current: true,
		items: [
			{
				kind: '회사',
				title: `${profile.company.name} ${profile.role}`,
				detail:
					'리얼월드를 만드는 개발팀. 합류 직후 AI 에이전트로 8년 된 앱 게임의 웹 버전을 사흘 만에 만들었습니다.',
				href: '#case'
			}
		]
	},
	{
		year: '2026',
		items: [
			{
				kind: '논문',
				title: 'Clinical Rheumatology',
				detail: '강직성 척추염 이후 부정맥 위험 · 공동 저자 · 2026.08',
				href: '#research'
			},
			{
				kind: '논문',
				title: 'Sleep Medicine',
				detail: '파킨슨병의 신체형·수면 관련 장애 위험 · 공동 저자 · 2026.06',
				href: '#research'
			}
		]
	},
	{
		year: '2025',
		items: [
			{
				kind: '학교',
				title: `${profile.school.name} ${profile.school.department}`,
				detail: profile.school.cohort
			},
			{
				kind: '프로젝트',
				title: 'Code01',
				detail: '대학 프로그래밍 수업을 위한 온라인 저지 · 2025–2026',
				href: '#code01'
			},
			{
				kind: '논문',
				title: '한국정보기술학회 2025 추계종합학술대회',
				detail: 'Code01 구현 논문 · 2025.11',
				href: '#research'
			},
			{
				kind: '오픈소스',
				title: 'ZeroCut',
				detail: 'PyPI에 배포한 네 컷 사진 라이브러리',
				href: '#zerocut'
			}
		]
	},
	{
		year: '2024',
		items: [
			{
				kind: '논문',
				title: '한국정보과학회 KCC 2024',
				detail: `적분 속도식 일반화 · ${profile.highSchool.name} 재학 중 단독 저자 · 2024.06`,
				href: '#research'
			},
			{
				kind: '탐구',
				title: 'Graph Visualization · Blockchain',
				detail: '고3 탐구 · 함수 그래프 분석, 제품 이력 블록체인',
				href: '#explorations'
			}
		]
	},
	{
		year: '2023',
		items: [
			{
				kind: '프로젝트',
				title: 'ODS',
				detail: 'TED 영상 더빙 플랫폼 · 공동 개발',
				href: '#ods'
			},
			{
				kind: '프로젝트',
				title: '늘봄 NeulBom',
				detail: '학교 커뮤니티 PWA · 팀 리더 · 2023–2024',
				href: '#neulbom'
			},
			{
				kind: '탐구',
				title: 'SIR Model',
				detail: '감염병 확산 시뮬레이션 · 고2 수학Ⅱ',
				href: '#explorations'
			}
		]
	},
	{
		year: '2020–2022',
		items: [
			{
				kind: '창업',
				title: 'UniqueCode 대표',
				detail: '디스코드 봇과 서비스를 만드는 팀을 창업해 이끌었습니다.',
				href: '#uniquecode'
			},
			{
				kind: '서비스',
				title: 'UniqueBots',
				detail: '한국 디스코드 봇 리스트 사이트 · 2020–2021',
				href: '#uniquebots'
			},
			{
				kind: '프로젝트',
				title: 'FreeAI',
				detail: '다기능 디스코드 봇 · 공동 제작 · 2020',
				href: '#freeai'
			}
		]
	}
];

export interface Paper {
	title: string;
	titleEn?: string;
	authors: string[];
	/** Journal or proceedings name. */
	venue: string;
	/** Volume, issue and pages within the venue. */
	locator: string;
	date: string;
	kind: '저널' | '학술대회';
	summary: string;
	href: string;
}

/** How his name is printed in author lists, so it can be emphasised. */
export const selfNames = [profile.name, profile.nameEn];

export const papers: Paper[] = [
	{
		title:
			'Risk of arrhythmia following ankylosing spondylitis, 2012–2023: a nationwide cohort study',
		authors: ['Seung Won Lee', 'Chanwoo Song', 'Minyoung Kim', 'Hohyun Jung', 'Youngoh Bae'],
		venue: 'Clinical Rheumatology',
		locator: '45(8), 4947–4958',
		date: '2026.08',
		kind: '저널',
		summary:
			'강직성 척추염 환자 3,022명과 대조군 30,220명을 비교해 부정맥 발생률이 약 41% 높고, 60세 미만 여성에서 가장 높다는 것을 보였습니다.',
		href: 'https://doi.org/10.1007/s10067-026-08259-9'
	},
	{
		title:
			'Risk of somatoform and sleep-related disorders in Parkinson’s disease: A nationwide matched cohort study',
		authors: ['Youngoh Bae', 'Chanwoo Song', 'Seoyeon Kim', 'Seung Won Lee', 'Hohyun Jung'],
		venue: 'Sleep Medicine',
		locator: 'vol. 142, 108881',
		date: '2026.06',
		kind: '저널',
		summary:
			'2012–2023년 국민건강보험 데이터로 파킨슨병 환자 3,800명과 대조군 19,000명을 비교해, 수면장애 위험이 약 2.3배 높다는 것을 확인했습니다.',
		href: 'https://doi.org/10.1016/j.sleep.2026.108881'
	},
	{
		title: '도커 기반 온라인 저지 시스템 Code01의 구현',
		authors: ['송찬우', '최상일'],
		venue: '한국정보기술학회 2025 추계종합학술대회 및 대학생논문경진대회',
		locator: 'pp. 1701–1704',
		date: '2025.11',
		kind: '학술대회',
		summary:
			'대학 프로그래밍 수업을 위한 온라인 저지. Docker 컨테이너(Piston)에서 학생 코드를 자동 채점하고 결과를 실시간으로 보여 줍니다. FastAPI · Supabase · Next.js.',
		href: 'https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE12545663'
	},
	{
		title: '적분 속도식 일반화 및 반응차수 유도 시스템 구현',
		titleEn:
			'Generalization of Integral Rate Laws and Implementation of a Reaction Order Derivation System',
		authors: ['송찬우'],
		venue: '한국정보과학회 KCC 2024 논문집',
		locator: 'pp. 2484–2486',
		date: '2024.06',
		kind: '학술대회',
		summary:
			'화학의 적분 속도식을 일반화하고, 이를 이용해 반응차수를 유도하는 시스템을 구현했습니다. 경희고등학교 재학 중 단독 저자로 발표했습니다.',
		href: 'https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE11862579'
	}
];

const doiPrefix = 'https://doi.org/';

/** The DOI of a paper link, if it is one. */
export function doiOf(href: string): string | undefined {
	return href.startsWith(doiPrefix) ? href.slice(doiPrefix.length) : undefined;
}

/** Short label for a paper link: DOI, or the index it lives in. */
export function paperLinkLabel(href: string): string {
	return doiOf(href) ? 'DOI' : 'DBpia';
}

export interface Exploration {
	title: string;
	purpose: string;
	year: string;
	summary: string;
	stack: string;
	image: string;
	imageSize: number;
	links: Link[];
}

// High-school research, each summarised on its own poster.
export const explorations: Exploration[] = [
	{
		title: 'SIR Model',
		purpose: '세상을 지키기 위해',
		year: '2023 · 고2 수학Ⅱ',
		summary:
			'출생률과 사망률을 더한 SIR 모델로 감염병 확산을 시뮬레이션하고, 매개변수를 넣으면 그래프로 보여 주는 웹 UI를 만들었습니다.',
		stack: 'Python · Gradio · pandas',
		image: '/projects/web/sir-model.webp',
		imageSize: 960,
		links: [{ label: 'GitHub', href: 'https://github.com/ZeroOneDeveloper/SIR_Model' }]
	},
	{
		title: 'Integral Velocity Equation',
		purpose: '효율적인 화학 공정을 위해',
		year: '2024 · 고3 화학Ⅱ',
		summary:
			'변수분리로 0차·1차·n차 반응의 적분 속도식을 유도하고, 선형 회귀의 R²로 반응차수를 찾습니다. KCC 2024에서 논문으로 발표했습니다.',
		stack: 'Python · NumPy · scikit-learn',
		image: '/projects/web/integral-velocity-equation.webp',
		imageSize: 900,
		links: [
			{ label: 'GitHub', href: 'https://github.com/ZeroOneDeveloper/IntegralVelocityEquation' },
			{ label: '논문', href: 'https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE11862579' }
		]
	},
	{
		title: 'Graph Visualization',
		purpose: '수학이 어려운 학생들을 위해',
		year: '2024 · 고3 미적분',
		summary:
			'LaTeX로 입력한 함수의 정의역, 대칭성, 극값과 변곡점을 1·2계도함수로 분석해 그래프로 그려 줍니다.',
		stack: 'Python · SymPy · matplotlib',
		image: '/projects/web/graph-visualization.webp',
		imageSize: 960,
		links: [
			{ label: 'GitHub', href: 'https://github.com/ZeroOneDeveloper/DesignOfGraphVisualization' }
		]
	},
	{
		title: 'Blockchain',
		purpose: '우리의 자원을 지키기 위해',
		year: '2024 · 고3',
		summary:
			'제품 이력을 블록체인에 기록하는 ‘제품표시이력제’. RSA로 서명한 거래를 작업증명 블록으로 묶습니다.',
		stack: 'Next.js · TypeScript · MongoDB',
		image: '/projects/web/blockchain.webp',
		imageSize: 960,
		links: [
			{ label: 'GitHub', href: 'https://github.com/ZeroOneDeveloper/ProductDisplayHistorySystem' },
			{ label: '데모', href: 'https://blockchain-omega-eight.vercel.app' }
		]
	}
];

export interface Article {
	headline: string;
	outlet: string;
	date: string;
	summary: string;
	tag: 'AI' | '파트너십' | '제품' | '글로벌';
	href: string;
}

// Recent coverage of Uniquegood and Realworld, newest first.
export const articles: Article[] = [
	{
		headline: 'AI와 오목 두고 휴머노이드 체험…23∼24일 서울숲서 AI 축제',
		outlet: '파이낸셜뉴스',
		date: '2026.10.08',
		summary:
			'서울시평생교육진흥원의 ‘AI 평생학습 러닝 그라운드’에서 리얼월드 성수와 협업한 미션형 AI 학습 체험 ‘AI 배움의 숲: 미래인재 시크릿 코드’를 운영합니다.',
		tag: '파트너십',
		href: 'https://www.fnnews.com/news/202610080601109381'
	},
	{
		headline: '산업단지 인공지능 대전환 관심 ‘후끈’…산단공, 제조AI 청사진 제시',
		outlet: '머니투데이',
		date: '2026.09.17',
		summary:
			'이은영 대표가 ‘산업단지 M.AX 혁신 서밋’에서 ‘1명이 1만 명의 AI 동료를 이끄는 시대’를 주제로, 소수 인력이 다수의 AI와 일하는 조직 운영 사례를 발표했습니다.',
		tag: 'AI',
		href: 'https://www.mt.co.kr/economy/2026/09/17/2026091710315156116'
	},
	{
		headline: '송인혁 유니크굿컴퍼니 대표가 설계하는 피지털 상호작용의 미래',
		outlet: '벤처스퀘어',
		date: '2026.01.18',
		summary:
			'AI가 검증된 콘텐츠 원형을 제안하고 사람이 맥락을 더하는 ‘Real World AI Studio’로, 콘텐츠 제작 기간을 수일에서 수분으로 줄였다고 소개했습니다.',
		tag: '제품',
		href: 'https://www.venturesquare.net/1031902'
	},
	{
		headline: '유니크굿컴퍼니, 두바이 ScaleX 100대 글로벌 테크 스케일업 기업 선정',
		outlet: '벤처스퀘어',
		date: '2025.09.24',
		summary:
			'두바이 Expand North Star의 ScaleX 100에 선정됐습니다. AI 기반 체험 콘텐츠 플랫폼 리얼월드의 경쟁력이 선정 이유로 꼽혔습니다.',
		tag: '글로벌',
		href: 'https://www.venturesquare.net/1006251/'
	},
	{
		headline: '리얼월드 AI 베타 공개…코딩 없이 AI로 인터랙티브 콘텐츠 만든다',
		outlet: '데일리시큐',
		date: '2025.09.08',
		summary:
			'테마와 분위기만 정하면 스토리 초안, 이미지, 배경음악을 수 분 안에 생성하는 저작도구 ‘리얼월드 스튜디오’ 베타를 공개했습니다.',
		tag: 'AI',
		href: 'https://www.dailysecu.com/news/articleView.html?idxno=200158'
	},
	{
		headline: '유니크굿컴퍼니, 싱가포르에 조인트벤처 설립',
		outlet: '벤처스퀘어',
		date: '2025.02.26',
		summary:
			'싱가포르 DAS Universe와 합작법인을 세워, 싱가포르·말레이시아에서 디지털 스토리텔링과 물리 공간을 결합한 몰입형 테마파크를 추진합니다.',
		tag: '글로벌',
		href: 'https://www.venturesquare.net/959056/'
	}
];
