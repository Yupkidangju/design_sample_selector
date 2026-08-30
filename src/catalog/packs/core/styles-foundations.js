import { deepFreeze } from '../../contract.js';

/** @type {import('../../contract.js').StyleRecord[]} */
export const CORE_FOUNDATION_STYLES = deepFreeze([
  {
    "schemaVersion": 1,
    "id": "swiss-grid",
    "aliases": [],
    "categoryId": "swiss",
    "order": 10,
    "publicationStatus": "legacy",
    "name": {
      "ko": "격자 중심 모더니즘",
      "en": "Grid-Driven Modernism"
    },
    "summary": {
      "ko": "정밀한 12컬럼 구조와 산세리프 폰트로 구현된 스위스 모더니즘의 정수"
    },
    "classification": {
      "kind": "historical-movement",
      "era": {
        "start": 1950,
        "end": 1970,
        "label": "1950s–1970s"
      },
      "lineages": [
        "modernism",
        "international-style",
        "grid-systems"
      ],
      "media": [
        "graphic",
        "print",
        "web-ui"
      ],
      "materiality": [
        "flat"
      ],
      "density": "balanced",
      "tone": [
        "rational",
        "precise"
      ],
      "motion": "restrained",
      "regions": [
        "europe",
        "international"
      ],
      "maturity": "canonical"
    },
    "tokens": {
      "background": "#F4F4F0",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#EAEAE6",
      "border": "#111111",
      "text": "#111111",
      "textMuted": "#555555",
      "accent": "#FF3300",
      "accentSecondary": "#000000",
      "radius": "0px",
      "borderWidth": "2px",
      "shadow": "4px 4px 0px #111111",
      "fontFamily": "'Space Grotesk', 'Helvetica Neue', sans-serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "swiss",
      "thumbnailId": "grid-lines",
      "motionId": "grid-reveal"
    },
    "defaultTweaks": {
      "borderRadius": 0,
      "borderWidth": 1,
      "shadowDepth": 0,
      "backdropBlur": 0,
      "glowIntensity": 0
    },
    "palette": [
      {
        "id": "canvas-white",
        "name": {
          "ko": "Canvas White",
          "en": "Canvas White"
        },
        "value": "#F4F4F0",
        "usage": {
          "ko": "메인 배경"
        }
      },
      {
        "id": "deep-ink",
        "name": {
          "ko": "Deep Ink",
          "en": "Deep Ink"
        },
        "value": "#111111",
        "usage": {
          "ko": "주요 텍스트 & 신호"
        }
      },
      {
        "id": "swiss-red",
        "name": {
          "ko": "Swiss Red",
          "en": "Swiss Red"
        },
        "value": "#FF3300",
        "usage": {
          "ko": "포인트 액센트"
        }
      },
      {
        "id": "neutral-gray",
        "name": {
          "ko": "Neutral Gray",
          "en": "Neutral Gray"
        },
        "value": "#666666",
        "usage": {
          "ko": "보조 그리드 라인"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "미니멀",
        "정밀성",
        "아카이브",
        "스위스"
      ],
      "characteristics": [
        "엄격한 수학적 Grid System 기반 기하학적 정보 배치",
        "Inter / Helvetica 계열 산세리프 타이포그래피 극대화",
        "강렬한 International Red (#FF3300) 포인트 컬러",
        "풍부한 여백(Negative Space)과 비대칭 계층 구조"
      ],
      "pros": [
        "정보의 시각적 명확성 및 압도적인 가독성",
        "시대를 초월한 세련된 모던 브랜드 이미지 구축",
        "반응형 그리드 변환이 매우 정밀하고 직관적임"
      ],
      "cons": [
        "엄격한 규칙성으로 인해 자유분방한 감성 표현 제한",
        "여백이 과도할 경우 콘텐츠 밀도가 낮아 보일 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "corporate-minimal",
    "aliases": [],
    "categoryId": "swiss",
    "order": 20,
    "publicationStatus": "legacy",
    "name": {
      "ko": "기업형 미니멀리즘",
      "en": "Corporate Minimalist"
    },
    "summary": {
      "ko": "글로벌 테크 기업 및 신뢰성 중심의 현대적 린 디자인 체계"
    },
    "classification": {
      "kind": "interface-language",
      "era": {
        "start": 2010,
        "end": 2026,
        "label": "2010s–2020s"
      },
      "lineages": [
        "minimalism",
        "grid-systems"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "flat"
      ],
      "density": "sparse",
      "tone": [
        "professional",
        "rational"
      ],
      "motion": "restrained",
      "regions": [
        "international"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#F8FAFC",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#F1F5F9",
      "border": "#E2E8F0",
      "text": "#0F172A",
      "textMuted": "#64748B",
      "accent": "#2563EB",
      "accentSecondary": "#0EA5E9",
      "radius": "12px",
      "borderWidth": "1px",
      "shadow": "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 15px rgba(37, 99, 235, 0.2)"
    },
    "preview": {
      "rendererId": "corporate",
      "thumbnailId": "saas-nav",
      "motionId": "sparkline"
    },
    "defaultTweaks": {
      "borderRadius": 12,
      "borderWidth": 1,
      "shadowDepth": 8,
      "backdropBlur": 0,
      "glowIntensity": 0.3
    },
    "palette": [
      {
        "id": "pure-white",
        "name": {
          "ko": "Pure White",
          "en": "Pure White"
        },
        "value": "#FFFFFF",
        "usage": {
          "ko": "카드 Surface"
        }
      },
      {
        "id": "slate-dark",
        "name": {
          "ko": "Slate Dark",
          "en": "Slate Dark"
        },
        "value": "#0F172A",
        "usage": {
          "ko": "메인 헤드라인"
        }
      },
      {
        "id": "trust-blue",
        "name": {
          "ko": "Trust Blue",
          "en": "Trust Blue"
        },
        "value": "#2563EB",
        "usage": {
          "ko": "CTA 버튼 & 강조"
        }
      },
      {
        "id": "soft-gray",
        "name": {
          "ko": "Soft Gray",
          "en": "Soft Gray"
        },
        "value": "#94A3B8",
        "usage": {
          "ko": "서브 라인"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "SaaS",
        "신뢰감",
        "B2B",
        "테크"
      ],
      "characteristics": [
        "신뢰감을 주는 신뢰성 블루(#2563EB)와 딥 슬레이트 톤 조합",
        "정교한 카드 구분선과 마이크로 액센트 배지",
        "명확한 전환 유도 버튼(CTA) 중심의 구조"
      ],
      "pros": [
        "높은 사용자 전환율(Conversion Rate)",
        "브랜드 신뢰도 및 프로페셔널한 느낌 전달",
        "다양한 연령층에 직관적인 UX 제공"
      ],
      "cons": [
        "유사한 다른 기업 웹사이트와 차별성이 다소 부족할 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "high-contrast-mono",
    "aliases": [
      "minimalism-clean"
    ],
    "categoryId": "swiss",
    "order": 30,
    "publicationStatus": "legacy",
    "name": {
      "ko": "고대비 모노스페이스",
      "en": "High-Contrast Monospace"
    },
    "summary": {
      "ko": "개발자 도구와 터미널 감성의 초명확 직관 레이아웃"
    },
    "classification": {
      "kind": "interface-language",
      "era": {
        "start": 2010,
        "end": 2026,
        "label": "2010s–2020s"
      },
      "lineages": [
        "minimalism",
        "cyberculture"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "screen",
        "flat"
      ],
      "density": "dense",
      "tone": [
        "precise",
        "futuristic"
      ],
      "motion": "restrained",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#050505",
      "surface": "#121212",
      "surfaceSubtle": "#1E1E1E",
      "border": "#333333",
      "text": "#FFFFFF",
      "textMuted": "#888888",
      "accent": "#00FF66",
      "accentSecondary": "#00CC55",
      "radius": "4px",
      "borderWidth": "1px",
      "shadow": "0 0 15px rgba(0, 255, 102, 0.15)",
      "fontFamily": "'Fira Code', monospace",
      "glow": "0 0 12px rgba(0, 255, 102, 0.4)"
    },
    "preview": {
      "rendererId": "minimalism",
      "thumbnailId": "terminal",
      "motionId": "caret-blink"
    },
    "defaultTweaks": {
      "borderRadius": 4,
      "borderWidth": 1,
      "shadowDepth": 0,
      "backdropBlur": 0,
      "glowIntensity": 0.8
    },
    "palette": [
      {
        "id": "terminal-black",
        "name": {
          "ko": "Terminal Black",
          "en": "Terminal Black"
        },
        "value": "#050505",
        "usage": {
          "ko": "배경"
        }
      },
      {
        "id": "pure-white",
        "name": {
          "ko": "Pure White",
          "en": "Pure White"
        },
        "value": "#FFFFFF",
        "usage": {
          "ko": "텍스트"
        }
      },
      {
        "id": "neon-terminal",
        "name": {
          "ko": "Neon Terminal",
          "en": "Neon Terminal"
        },
        "value": "#00FF66",
        "usage": {
          "ko": "상태 뱃지"
        }
      },
      {
        "id": "dim-gray",
        "name": {
          "ko": "Dim Gray",
          "en": "Dim Gray"
        },
        "value": "#333333",
        "usage": {
          "ko": "경계선"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "개발자",
        "터미널",
        "모노스페이스",
        "고대비"
      ],
      "characteristics": [
        "Monospace 고정폭 폰트와 명확한 1px 단색 보더선",
        "흑백 대비 중심에 네온 터미널 그린(#00FF66) 액센트",
        "데이터 밀도가 높은 커맨드 라인 인스펙터 인터페이스"
      ],
      "pros": [
        "개발자 및 기술 기반 사용자 층에 친숙한 UI",
        "코드 및 시스템 데이터 가독성 극대화"
      ],
      "cons": [
        "일반 대중 소비자에게는 다소 딱딱하게 느껴질 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "raw-brutalism",
    "aliases": [],
    "categoryId": "brutalism",
    "order": 40,
    "publicationStatus": "legacy",
    "name": {
      "ko": "날것의 디지털 브루탈리즘",
      "en": "Raw Digital Brutalism"
    },
    "summary": {
      "ko": "세공되지 않은 원초적 HTML 디폴트 요소와 위트 있는 반항적 디자인"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 2014,
        "end": 2026,
        "label": "2010s–2020s revival"
      },
      "lineages": [
        "brutalism"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "flat",
        "ink"
      ],
      "density": "dense",
      "tone": [
        "rebellious",
        "energetic"
      ],
      "motion": "expressive",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#0D0D0D",
      "surface": "#171717",
      "surfaceSubtle": "#262626",
      "border": "#FFFFFF",
      "text": "#FFFFFF",
      "textMuted": "#A3A3A3",
      "accent": "#FFFF00",
      "accentSecondary": "#FF0055",
      "radius": "0px",
      "borderWidth": "3px",
      "shadow": "6px 6px 0px #FFFFFF",
      "fontFamily": "'Fira Code', 'Courier New', monospace",
      "glow": "none"
    },
    "preview": {
      "rendererId": "raw-brutal",
      "thumbnailId": "raw-html",
      "motionId": "hard-punch"
    },
    "defaultTweaks": {
      "borderRadius": 0,
      "borderWidth": 4,
      "shadowDepth": 6,
      "backdropBlur": 0,
      "glowIntensity": 0
    },
    "palette": [
      {
        "id": "raw-yellow",
        "name": {
          "ko": "Raw Yellow",
          "en": "Raw Yellow"
        },
        "value": "#FFFF00",
        "usage": {
          "ko": "포인트 버튼"
        }
      },
      {
        "id": "harsh-black",
        "name": {
          "ko": "Harsh Black",
          "en": "Harsh Black"
        },
        "value": "#000000",
        "usage": {
          "ko": "외곽선 & 배경"
        }
      },
      {
        "id": "hot-pink",
        "name": {
          "ko": "Hot Pink",
          "en": "Hot Pink"
        },
        "value": "#FF0055",
        "usage": {
          "ko": "경고 & 액션"
        }
      },
      {
        "id": "stark-white",
        "name": {
          "ko": "Stark White",
          "en": "Stark White"
        },
        "value": "#FFFFFF",
        "usage": {
          "ko": "서브 카드"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "원색",
        "로우파이",
        "파격",
        "언더그라운드"
      ],
      "characteristics": [
        "원색 마젠타/옐로우 조합과 기본 브라우저 스타일",
        "거친 4px 블랙 보더와 파괴적 그리드 정렬",
        "예측 불가한 텍스처와 대형 타이포그래피"
      ],
      "pros": [
        "독보적이고 잊혀지지 않는 강렬한 인상 전달",
        "기존 웹 표준틀을 깨는 창의적 브랜드 정체성"
      ],
      "cons": [
        "사용자 호불호가 갈릴 수 있으며 접근성 사전 검증 필수"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "neo-brutalism",
    "aliases": [],
    "categoryId": "brutalism",
    "order": 50,
    "publicationStatus": "legacy",
    "name": {
      "ko": "트렌디 네오 브루탈리즘",
      "en": "Trendy Neo-Brutalism"
    },
    "summary": {
      "ko": "두꺼운 검은 외곽선과 팝 파스텔 톤, 5px 하드 섀도가 결합된 대중적 브루탈리즘"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 2018,
        "end": 2026,
        "label": "Late 2010s–2020s"
      },
      "lineages": [
        "brutalism",
        "postmodernism"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "flat"
      ],
      "density": "balanced",
      "tone": [
        "playful",
        "rebellious"
      ],
      "motion": "expressive",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#FFFDF5",
      "surface": "#FFE600",
      "surfaceSubtle": "#FF80BF",
      "border": "#000000",
      "text": "#000000",
      "textMuted": "#222222",
      "accent": "#FF0055",
      "accentSecondary": "#00D4FF",
      "radius": "12px",
      "borderWidth": "3px",
      "shadow": "5px 5px 0px #000000",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "neo-brutal",
      "thumbnailId": "hard-shadow",
      "motionId": "hard-press"
    },
    "defaultTweaks": {
      "borderRadius": 12,
      "borderWidth": 3,
      "shadowDepth": 6,
      "backdropBlur": 0,
      "glowIntensity": 0
    },
    "palette": [
      {
        "id": "pop-yellow",
        "name": {
          "ko": "Pop Yellow",
          "en": "Pop Yellow"
        },
        "value": "#FEF08A",
        "usage": {
          "ko": "메인 카드 Surface"
        }
      },
      {
        "id": "soft-sky",
        "name": {
          "ko": "Soft Sky",
          "en": "Soft Sky"
        },
        "value": "#BFDBFE",
        "usage": {
          "ko": "보조 카드"
        }
      },
      {
        "id": "slate-ink",
        "name": {
          "ko": "Slate Ink",
          "en": "Slate Ink"
        },
        "value": "#1E293B",
        "usage": {
          "ko": "텍스트 & 섀도"
        }
      },
      {
        "id": "coral-pop",
        "name": {
          "ko": "Coral Pop",
          "en": "Coral Pop"
        },
        "value": "#F43F5E",
        "usage": {
          "ko": "강조 버튼"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "팝",
        "파스텔",
        "트렌디",
        "캐주얼"
      ],
      "characteristics": [
        "3~4px 실선 border & 5px solid black hard shadow",
        "밝은 팝 파스텔 옐로우/핑크/블루 색상 블록",
        "호버 시 섀도 축소 및 튀어나오는 물리 클릭 효과"
      ],
      "pros": [
        "젊고 활력 넘치는 인상과 높은 클릭 유도력",
        "시각적 요소의 확실한 구분으로 높은 인지성"
      ],
      "cons": [
        "보수적인 금융/법률 서비스에는 어울리지 않을 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "cyber-brutalism",
    "aliases": [
      "acid-techno-brutal"
    ],
    "categoryId": "brutalism",
    "order": 60,
    "publicationStatus": "legacy",
    "name": {
      "ko": "사이버 브루탈리즘",
      "en": "Cyber Brutalism"
    },
    "summary": {
      "ko": "해커 문화, 사이버네틱 무드와 거친 와이어프레임의 미래지향적 조화"
    },
    "classification": {
      "kind": "microtrend",
      "era": {
        "start": 2020,
        "end": 2026,
        "label": "2020s"
      },
      "lineages": [
        "brutalism",
        "cyberculture"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "screen"
      ],
      "density": "dense",
      "tone": [
        "rebellious",
        "futuristic"
      ],
      "motion": "intense",
      "regions": [
        "global-internet"
      ],
      "maturity": "emerging"
    },
    "tokens": {
      "background": "#0A0A0C",
      "surface": "#141419",
      "surfaceSubtle": "#1F1F27",
      "border": "#00FFCC",
      "text": "#F4F4F5",
      "textMuted": "#A1A1AA",
      "accent": "#FF0055",
      "accentSecondary": "#00FFCC",
      "radius": "2px",
      "borderWidth": "3px",
      "shadow": "6px 6px 0px #00FFCC",
      "fontFamily": "'Fira Code', monospace",
      "glow": "0 0 20px rgba(0, 255, 204, 0.4)"
    },
    "preview": {
      "rendererId": "cyberpunk",
      "thumbnailId": "neon-wire",
      "motionId": "glitch-scan"
    },
    "defaultTweaks": {
      "borderRadius": 0,
      "borderWidth": 2,
      "shadowDepth": 0,
      "backdropBlur": 0,
      "glowIntensity": 1.5
    },
    "palette": [
      {
        "id": "abyss-dark",
        "name": {
          "ko": "Abyss Dark",
          "en": "Abyss Dark"
        },
        "value": "#0D0E15",
        "usage": {
          "ko": "전체 배경"
        }
      },
      {
        "id": "cyber-cyan",
        "name": {
          "ko": "Cyber Cyan",
          "en": "Cyber Cyan"
        },
        "value": "#00F0FF",
        "usage": {
          "ko": "네온 발광"
        }
      },
      {
        "id": "neon-pink",
        "name": {
          "ko": "Neon Pink",
          "en": "Neon Pink"
        },
        "value": "#FF007A",
        "usage": {
          "ko": "포인트 경고"
        }
      },
      {
        "id": "grid-blue",
        "name": {
          "ko": "Grid Blue",
          "en": "Grid Blue"
        },
        "value": "#1F2438",
        "usage": {
          "ko": "와이어프레임"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "사이버펑크",
        "글리치",
        "와이어프레임",
        "네온"
      ],
      "characteristics": [
        "네온 사이버 블루(#00F0FF)와 글리치 폰트 효과",
        "거친 다크 모드 와이어프레임과 시스템 로그 스니펫",
        "디지털 노이즈와 고대비 매트릭스 그리드 라인"
      ],
      "pros": [
        "게임, Web3, 하이테크 분야에서 강렬한 몰입감 제공",
        "미래적인 개성과 테크니컬한 이미지 강조"
      ],
      "cons": [
        "장시간 열람 시 눈의 피로도가 증가할 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "glassmorphism",
    "aliases": [
      "glassmorphism-luxe"
    ],
    "categoryId": "depth",
    "order": 70,
    "publicationStatus": "legacy",
    "name": {
      "ko": "프로스테드 글래스모피즘",
      "en": "Frosted Glassmorphism"
    },
    "summary": {
      "ko": "반투명 굴절 유리의 몽환적인 레이어링과 고급스러운 블러 서페이스"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 2013,
        "end": 2026,
        "label": "2010s–2020s"
      },
      "lineages": [
        "minimalism",
        "skeuomorphism"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "glass"
      ],
      "density": "balanced",
      "tone": [
        "futuristic",
        "luxurious"
      ],
      "motion": "restrained",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#0B0E17",
      "surface": "rgba(255, 255, 255, 0.08)",
      "surfaceSubtle": "rgba(255, 255, 255, 0.04)",
      "border": "rgba(255, 255, 255, 0.22)",
      "text": "#FFFFFF",
      "textMuted": "rgba(255, 255, 255, 0.7)",
      "accent": "#00F0FF",
      "accentSecondary": "#A855F7",
      "radius": "20px",
      "borderWidth": "1px",
      "shadow": "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 30px rgba(0, 240, 255, 0.3)"
    },
    "preview": {
      "rendererId": "glassmorphism",
      "thumbnailId": "frost-orbs",
      "motionId": "glass-orb"
    },
    "defaultTweaks": {
      "borderRadius": 20,
      "borderWidth": 1,
      "shadowDepth": 16,
      "backdropBlur": 20,
      "glowIntensity": 1
    },
    "themeEffects": {
      "backdropBlur": 20
    },
    "palette": [
      {
        "id": "glass-frost",
        "name": {
          "ko": "Glass Frost",
          "en": "Glass Frost"
        },
        "value": "rgba(255,255,255,0.12)",
        "usage": {
          "ko": "유리 카드 Surface"
        }
      },
      {
        "id": "deep-space",
        "name": {
          "ko": "Deep Space",
          "en": "Deep Space"
        },
        "value": "#0F172A",
        "usage": {
          "ko": "딥 다크 배경"
        }
      },
      {
        "id": "glow-indigo",
        "name": {
          "ko": "Glow Indigo",
          "en": "Glow Indigo"
        },
        "value": "#818CF8",
        "usage": {
          "ko": "백그라운드 빛 구체"
        }
      },
      {
        "id": "crystal-white",
        "name": {
          "ko": "Crystal White",
          "en": "Crystal White"
        },
        "value": "#E0E7FF",
        "usage": {
          "ko": "유리 단면 빛"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "글래스",
        "블러",
        "프리미엄",
        "모던OS"
      ],
      "characteristics": [
        "backdrop-filter: blur(20px) 기반 미세 반투명 굴절 효과",
        "유리 단면을 연상시키는 1px 반투명 빛 테두리",
        "배경에 배치된 은은하게 구동되는 네온 그래디언트 구체"
      ],
      "pros": [
        "압도적인 프리미엄 미학 및 레이어간 깊이감 분리",
        "모던하고 세련된 OS/앱 UI 패널 감성"
      ],
      "cons": [
        "저사양 기기에서 GPU 블러 연산 부담이 있을 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "neumorphism",
    "aliases": [
      "neumorphism-soft"
    ],
    "categoryId": "depth",
    "order": 80,
    "publicationStatus": "legacy",
    "name": {
      "ko": "소프트 뉴모피즘",
      "en": "Soft Neumorphism"
    },
    "summary": {
      "ko": "플라스틱 서페이스가 입체적으로 융기하고 눌리는 부드러운 양각/음각 UI"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 2019,
        "end": 2026,
        "label": "Late 2010s–2020s"
      },
      "lineages": [
        "minimalism",
        "skeuomorphism"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "plastic"
      ],
      "density": "sparse",
      "tone": [
        "tactile",
        "friendly"
      ],
      "motion": "restrained",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#E0E5EC",
      "surface": "#E0E5EC",
      "surfaceSubtle": "#D1D9E6",
      "border": "transparent",
      "text": "#31344B",
      "textMuted": "#7E8BA3",
      "accent": "#4D7CFE",
      "accentSecondary": "#6C5CE7",
      "radius": "20px",
      "borderWidth": "0px",
      "shadow": "9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.8)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "neumorphism",
      "thumbnailId": "soft-knob",
      "motionId": "inset-press"
    },
    "defaultTweaks": {
      "borderRadius": 24,
      "borderWidth": 0,
      "shadowDepth": 12,
      "backdropBlur": 0,
      "glowIntensity": 0.2
    },
    "palette": [
      {
        "id": "soft-surface",
        "name": {
          "ko": "Soft Surface",
          "en": "Soft Surface"
        },
        "value": "#E0E5EC",
        "usage": {
          "ko": "전체 메인 톤"
        }
      },
      {
        "id": "highlight-shadow",
        "name": {
          "ko": "Highlight Shadow",
          "en": "Highlight Shadow"
        },
        "value": "#FFFFFF",
        "usage": {
          "ko": "상단 빛 반사"
        }
      },
      {
        "id": "dark-shadow",
        "name": {
          "ko": "Dark Shadow",
          "en": "Dark Shadow"
        },
        "value": "#A3B1C6",
        "usage": {
          "ko": "하단 이중 그림자"
        }
      },
      {
        "id": "tactile-accent",
        "name": {
          "ko": "Tactile Accent",
          "en": "Tactile Accent"
        },
        "value": "#4F46E5",
        "usage": {
          "ko": "활성화 포인트"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "소프트",
        "촉감",
        "양각음각",
        "미니멀"
      ],
      "characteristics": [
        "단일 바탕색 위에 상단 밝은 그림자와 하단 어두운 그림자의 이중 결합",
        "물리적 버튼을 누르는 듯한 인셋(Inset) 그림자 찌그러짐",
        "극도로 절제된 단색조(Monochromatic) 평온한 톤앤매너"
      ],
      "pros": [
        "실제 기기를 만지는 듯한 시각적 촉감 제공",
        "눈에 자극이 적고 조화로운 오디오/헬스케어 기기 UI"
      ],
      "cons": [
        "버튼과 바탕 간 명도 차가 적어 접근성(A11y) 확보 난이도 높음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "skeuomorphism",
    "aliases": [
      "skeuomorphism-classic"
    ],
    "categoryId": "depth",
    "order": 90,
    "publicationStatus": "legacy",
    "name": {
      "ko": "모던 스큐어모피즘 2.0",
      "en": "Modern Skeuomorphism 2.0"
    },
    "summary": {
      "ko": "현대적 플랫 디자인 감각으로 재해석된 고급스러운 아날로그 질감"
    },
    "classification": {
      "kind": "interface-language",
      "era": {
        "start": 2000,
        "end": 2013,
        "label": "2000s–early 2010s"
      },
      "lineages": [
        "skeuomorphism"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "metal",
        "plastic"
      ],
      "density": "dense",
      "tone": [
        "tactile",
        "professional"
      ],
      "motion": "expressive",
      "regions": [
        "international"
      ],
      "maturity": "canonical"
    },
    "tokens": {
      "background": "#2B2520",
      "surface": "linear-gradient(180deg, #5C5248 0%, #3D352E 100%)",
      "surfaceSubtle": "#4A4038",
      "border": "#7A6F62",
      "text": "#F3EBDD",
      "textMuted": "#BAAF9F",
      "accent": "#D4AF37",
      "accentSecondary": "#C07D3E",
      "radius": "10px",
      "borderWidth": "1px",
      "shadow": "0 8px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
      "fontFamily": "'Cinzel', serif",
      "glow": "0 0 15px rgba(212, 175, 55, 0.3)"
    },
    "preview": {
      "rendererId": "skeuomorphism",
      "thumbnailId": "metal-dial",
      "motionId": "analog-needle"
    },
    "defaultTweaks": {
      "borderRadius": 16,
      "borderWidth": 1,
      "shadowDepth": 16,
      "backdropBlur": 0,
      "glowIntensity": 0.8
    },
    "palette": [
      {
        "id": "brushed-charcoal",
        "name": {
          "ko": "Brushed Charcoal",
          "en": "Brushed Charcoal"
        },
        "value": "#1E1E24",
        "usage": {
          "ko": "메인 가공 표면"
        }
      },
      {
        "id": "metallic-gray",
        "name": {
          "ko": "Metallic Gray",
          "en": "Metallic Gray"
        },
        "value": "#2D2D35",
        "usage": {
          "ko": "금속 노브 섀시"
        }
      },
      {
        "id": "amber-indicator",
        "name": {
          "ko": "Amber Indicator",
          "en": "Amber Indicator"
        },
        "value": "#FF9F1C",
        "usage": {
          "ko": "아날로그 게인 빛"
        }
      },
      {
        "id": "led-emerald",
        "name": {
          "ko": "LED Emerald",
          "en": "LED Emerald"
        },
        "value": "#4CB944",
        "usage": {
          "ko": "전원 표시등"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "아날로그",
        "금속질감",
        "노브다이얼",
        "촉감"
      ],
      "characteristics": [
        "금속, 가죽, 유리, 아날로그 노브 Dial의 정교한 질감 표면",
        "현실 세계의 조명 방향을 반영한 그래디언트와 부드러운 발광",
        "아날로그 토글 스위치 및 앰프 게인 미터 연출"
      ],
      "pros": [
        "직관적인 사용법 학습 없이 즉각적인 직관성 제공",
        "풍부한 시각적 재미와 정교한 공예적 가치"
      ],
      "cons": [
        "CSS 디테일 및 그래픽 제작 공수가 큼"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "memphis",
    "aliases": [
      "memphis-pattern"
    ],
    "categoryId": "retro",
    "order": 100,
    "publicationStatus": "legacy",
    "name": {
      "ko": "멤피스 팝 아키텍처",
      "en": "Memphis Pop Architecture"
    },
    "summary": {
      "ko": "80년대 멤피스 그룹의 기하학 패턴과 통발 지그재그 라인의 유쾌한 팝 감성"
    },
    "classification": {
      "kind": "historical-movement",
      "era": {
        "start": 1981,
        "end": 1988,
        "label": "1980s"
      },
      "lineages": [
        "postmodernism"
      ],
      "media": [
        "graphic",
        "print",
        "illustration",
        "web-ui"
      ],
      "materiality": [
        "flat",
        "plastic"
      ],
      "density": "maximal",
      "tone": [
        "playful",
        "energetic"
      ],
      "motion": "expressive",
      "regions": [
        "europe",
        "international"
      ],
      "maturity": "canonical"
    },
    "tokens": {
      "background": "#FFFDF0",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#FFF3B0",
      "border": "#111111",
      "text": "#111111",
      "textMuted": "#444444",
      "accent": "#FF4081",
      "accentSecondary": "#00E5FF",
      "radius": "14px",
      "borderWidth": "3px",
      "shadow": "5px 5px 0px #111111",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "memphis",
      "thumbnailId": "geo-confetti",
      "motionId": "confetti-spin"
    },
    "defaultTweaks": {
      "borderRadius": 8,
      "borderWidth": 3,
      "shadowDepth": 6,
      "backdropBlur": 0,
      "glowIntensity": 0
    },
    "palette": [
      {
        "id": "memphis-pink",
        "name": {
          "ko": "Memphis Pink",
          "en": "Memphis Pink"
        },
        "value": "#FF70A6",
        "usage": {
          "ko": "메인 팝 컬러"
        }
      },
      {
        "id": "peach-coral",
        "name": {
          "ko": "Peach Coral",
          "en": "Peach Coral"
        },
        "value": "#FF9770",
        "usage": {
          "ko": "보조 도형"
        }
      },
      {
        "id": "sunshine-yellow",
        "name": {
          "ko": "Sunshine Yellow",
          "en": "Sunshine Yellow"
        },
        "value": "#FFD670",
        "usage": {
          "ko": "배경 패턴"
        }
      },
      {
        "id": "sky-cyan",
        "name": {
          "ko": "Sky Cyan",
          "en": "Sky Cyan"
        },
        "value": "#70D6FF",
        "usage": {
          "ko": "물결 포인트"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "멤피스",
        "80s",
        "도형",
        "비비드"
      ],
      "characteristics": [
        "지그재그 물결선, 트라이앵글, 컨페티 기하학 패턴",
        "비비드 파스텔 핑크/옐로우/블루의 경쾌한 대비",
        "장난기 넘치고 활력 있는 아날로그 그래픽 조합"
      ],
      "pros": [
        "보는 순간 미소를 유발하는 유쾌하고 젊은 브랜드 에너지",
        "엔터테인먼트, 페스티벌, 창의적 포트폴리오에 최적"
      ],
      "cons": [
        "시각적 요소가 너무 번잡해지면 메인 메시지 전달력 감소"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "synthwave",
    "aliases": [
      "synthwave-neon"
    ],
    "categoryId": "retro",
    "order": 110,
    "publicationStatus": "legacy",
    "name": {
      "ko": "80년대 신스웨이브",
      "en": "80s Synthwave & Outrun"
    },
    "summary": {
      "ko": "원근감 있는 3D 그리드, 석양 그리드와 네온 핑크의 신선한 노스탤지어"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 2000,
        "end": 2026,
        "label": "2000s–2020s"
      },
      "lineages": [
        "retrofuturism",
        "cyberculture"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "screen"
      ],
      "density": "dense",
      "tone": [
        "nostalgic",
        "immersive"
      ],
      "motion": "intense",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#0D0221",
      "surface": "#1E0836",
      "surfaceSubtle": "#300E54",
      "border": "#FF007F",
      "text": "#00F0FF",
      "textMuted": "#D400FF",
      "accent": "#FF007F",
      "accentSecondary": "#00F0FF",
      "radius": "8px",
      "borderWidth": "2px",
      "shadow": "0 0 25px rgba(255, 0, 127, 0.45)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 0 20px #FF007F"
    },
    "preview": {
      "rendererId": "retro",
      "thumbnailId": "outrun-sun",
      "motionId": "sun-grid"
    },
    "defaultTweaks": {
      "borderRadius": 10,
      "borderWidth": 2,
      "shadowDepth": 14,
      "backdropBlur": 10,
      "glowIntensity": 1.8
    },
    "palette": [
      {
        "id": "synth-purple",
        "name": {
          "ko": "Synth Purple",
          "en": "Synth Purple"
        },
        "value": "#1A0B2E",
        "usage": {
          "ko": "우주 배경"
        }
      },
      {
        "id": "neon-magenta",
        "name": {
          "ko": "Neon Magenta",
          "en": "Neon Magenta"
        },
        "value": "#FF007F",
        "usage": {
          "ko": "네온 라인"
        }
      },
      {
        "id": "electric-cyan",
        "name": {
          "ko": "Electric Cyan",
          "en": "Electric Cyan"
        },
        "value": "#00F5FF",
        "usage": {
          "ko": "그리드 선"
        }
      },
      {
        "id": "sunset-gold",
        "name": {
          "ko": "Sunset Gold",
          "en": "Sunset Gold"
        },
        "value": "#FFDD00",
        "usage": {
          "ko": "석양 태양"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "신스웨이브",
        "아웃런",
        "3D그리드",
        "네온석양"
      ],
      "characteristics": [
        "지평선으로 수렴하는 3D 퍼스펙티브 네온 그리드",
        "보라색 우주 배경 속 불타는 네온 석양 실루엣",
        "크롬 타입 로고와 글리치 신스 그래디언트"
      ],
      "pros": [
        "영화와 음악적 노스탤지어가 결합된 압도적 몰입감",
        "특색 있는 다크 모드 비주얼 임팩트"
      ],
      "cons": [
        "특정 레트로 서브컬처에 치우쳐 보편적 포털에는 어색할 수 있음"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  },
  {
    "schemaVersion": 1,
    "id": "vaporwave",
    "aliases": [
      "vaporwave-80s"
    ],
    "categoryId": "retro",
    "order": 120,
    "publicationStatus": "legacy",
    "name": {
      "ko": "베이퍼웨이브 칠",
      "en": "Vaporwave Chill"
    },
    "summary": {
      "ko": "고전 조각상, 로파이 감성, 몽환적인 윈도우 95 감성의 칠웨이브 미학"
    },
    "classification": {
      "kind": "microtrend",
      "era": {
        "start": 2010,
        "end": 2026,
        "label": "2010s–2020s"
      },
      "lineages": [
        "postmodernism",
        "cyberculture",
        "retrofuturism"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "screen"
      ],
      "density": "maximal",
      "tone": [
        "nostalgic",
        "playful"
      ],
      "motion": "expressive",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#1A0B2E",
      "surface": "#2D124D",
      "surfaceSubtle": "#411B6D",
      "border": "#FF71CE",
      "text": "#01CDFE",
      "textMuted": "#B967FF",
      "accent": "#FF71CE",
      "accentSecondary": "#05FFA1",
      "radius": "12px",
      "borderWidth": "2px",
      "shadow": "0 0 25px rgba(255, 113, 206, 0.45)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 0 20px #FF71CE"
    },
    "preview": {
      "rendererId": "vaporwave",
      "thumbnailId": "statue-win95",
      "motionId": "vhs-shift"
    },
    "defaultTweaks": {
      "borderRadius": 0,
      "borderWidth": 2,
      "shadowDepth": 4,
      "backdropBlur": 8,
      "glowIntensity": 0.5
    },
    "palette": [
      {
        "id": "vapor-lavender",
        "name": {
          "ko": "Vapor Lavender",
          "en": "Vapor Lavender"
        },
        "value": "#D8B4F8",
        "usage": {
          "ko": "유리 윈도우"
        }
      },
      {
        "id": "pastel-yellow",
        "name": {
          "ko": "Pastel Yellow",
          "en": "Pastel Yellow"
        },
        "value": "#F9F871",
        "usage": {
          "ko": "타이틀 글꼴"
        }
      },
      {
        "id": "chill-violet",
        "name": {
          "ko": "Chill Violet",
          "en": "Chill Violet"
        },
        "value": "#845EC2",
        "usage": {
          "ko": "배경 그래디언트"
        }
      },
      {
        "id": "retro-mint",
        "name": {
          "ko": "Retro Mint",
          "en": "Retro Mint"
        },
        "value": "#00C9A7",
        "usage": {
          "ko": "스캔라인 라인"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "베이퍼웨이브",
        "로파이",
        "윈도우95",
        "파스텔"
      ],
      "characteristics": [
        "로파이 아날로그 TV 스캔라인과 파스텔 퍼플 틸 그래디언트",
        "고전 석상 서프라이즈 그래픽과 레트로 OS 창 UI",
        "몽환적이고 느긋한 90년대 칠아웃 무드"
      ],
      "pros": [
        "서브컬처 예술 감성과 고유한 아티스틱 브랜드 표현",
        "차별화된 개성을 꿈꾸는 음악/패션 갤러리에 적합"
      ],
      "cons": [
        "일반적인 가독성 위주 정보 전달에는 비효율적"
      ],
      "accessibilityNotes": []
    },
    "provenance": {
      "reviewedAt": "2026-08-30",
      "sources": [],
      "assets": []
    }
  }
]);
