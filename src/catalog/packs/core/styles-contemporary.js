import { deepFreeze } from '../../contract.js';

/** @type {import('../../contract.js').StyleRecord[]} */
export const CORE_CONTEMPORARY_STYLES = deepFreeze([
  {
    "schemaVersion": 1,
    "id": "high-fashion",
    "aliases": [
      "editorial-serif"
    ],
    "categoryId": "editorial",
    "order": 130,
    "publicationStatus": "legacy",
    "name": {
      "ko": "하이패션 에디토리얼",
      "en": "High-Fashion Editorial"
    },
    "summary": {
      "ko": "우아한 세리프 타이포그래피와 미드나잇 잉크 컬러의 럭셔리 에디토리얼"
    },
    "classification": {
      "kind": "interface-language",
      "era": {
        "start": 1900,
        "end": 2026,
        "label": "20th century–present"
      },
      "lineages": [
        "editorial",
        "minimalism"
      ],
      "media": [
        "print",
        "web-ui"
      ],
      "materiality": [
        "paper",
        "ink"
      ],
      "density": "sparse",
      "tone": [
        "luxurious",
        "precise"
      ],
      "motion": "none",
      "regions": [
        "europe",
        "international"
      ],
      "maturity": "canonical"
    },
    "tokens": {
      "background": "#F7F5F0",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#EFECE6",
      "border": "#D8D2C6",
      "text": "#1C1917",
      "textMuted": "#78716C",
      "accent": "#881337",
      "accentSecondary": "#92400E",
      "radius": "0px",
      "borderWidth": "1px",
      "shadow": "0 4px 20px rgba(0, 0, 0, 0.06)",
      "fontFamily": "'Cinzel', 'Playfair Display', serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "editorial",
      "thumbnailId": "serif-spread",
      "motionId": "ken-burns"
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
        "id": "midnight-ink",
        "name": {
          "ko": "Midnight Ink",
          "en": "Midnight Ink"
        },
        "value": "#0A0A0A",
        "usage": {
          "ko": "메인 배경"
        }
      },
      {
        "id": "ivory-soft",
        "name": {
          "ko": "Ivory Soft",
          "en": "Ivory Soft"
        },
        "value": "#F5F5F0",
        "usage": {
          "ko": "메인 텍스트"
        }
      },
      {
        "id": "champagne-gold",
        "name": {
          "ko": "Champagne Gold",
          "en": "Champagne Gold"
        },
        "value": "#C5A880",
        "usage": {
          "ko": "럭셔리 액센트"
        }
      },
      {
        "id": "warm-charcoal",
        "name": {
          "ko": "Warm Charcoal",
          "en": "Warm Charcoal"
        },
        "value": "#1C1C1E",
        "usage": {
          "ko": "패널 Surface"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "럭셔리",
        "패션",
        "세리프",
        "매거진"
      ],
      "characteristics": [
        "Cinzel/Playfair 계열의 고전적이고 우아한 세리프 타이틀",
        "미드나잇 잉크(#0A0A0A)와 아이보리, 샴페인 골드의 럭셔리 대비",
        "잡지 표지를 보는 듯한 대담한 폰트 스케일링과 여백"
      ],
      "pros": [
        "고급 브랜드 및 매거진의 감성적 가치 극대화",
        "스토리텔링과 기사 형식 콘텐츠의 뛰어난 몰입감"
      ],
      "cons": [
        "고화질의 정교한 사진 에셋이 동반되어야 본래 가치가 살아남"
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
    "id": "fluid-organic",
    "aliases": [
      "bauhaus-geometric",
      "organic-nature"
    ],
    "categoryId": "editorial",
    "order": 140,
    "publicationStatus": "legacy",
    "name": {
      "ko": "플루이드 오가닉 & 웜톤",
      "en": "Fluid Organic & Warm Tone"
    },
    "summary": {
      "ko": "자연 친화적 웜 점토 톤과 부드러운 곡선 블롭 쉐이프의 편안한 UI"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 2010,
        "end": 2026,
        "label": "2010s–2020s"
      },
      "lineages": [
        "organic-modernism"
      ],
      "media": [
        "graphic",
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "organic"
      ],
      "density": "balanced",
      "tone": [
        "organic",
        "friendly"
      ],
      "motion": "restrained",
      "regions": [
        "international"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#F2EFE9",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#E5DFC5",
      "border": "#D4C9A8",
      "text": "#2C3E2D",
      "textMuted": "#6B7C6C",
      "accent": "#3E885B",
      "accentSecondary": "#C07D3E",
      "radius": "24px",
      "borderWidth": "1px",
      "shadow": "0 10px 25px rgba(44, 62, 45, 0.08)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 15px rgba(62, 136, 91, 0.2)"
    },
    "preview": {
      "rendererId": "organic",
      "thumbnailId": "warm-blob",
      "motionId": "blob-morph"
    },
    "defaultTweaks": {
      "borderRadius": 36,
      "borderWidth": 1,
      "shadowDepth": 10,
      "backdropBlur": 0,
      "glowIntensity": 0.2
    },
    "palette": [
      {
        "id": "warm-clay",
        "name": {
          "ko": "Warm Clay",
          "en": "Warm Clay"
        },
        "value": "#F7F4EF",
        "usage": {
          "ko": "메인 배경"
        }
      },
      {
        "id": "forest-pine",
        "name": {
          "ko": "Forest Pine",
          "en": "Forest Pine"
        },
        "value": "#2C3E35",
        "usage": {
          "ko": "메인 텍스트"
        }
      },
      {
        "id": "terracotta",
        "name": {
          "ko": "Terracotta",
          "en": "Terracotta"
        },
        "value": "#E07A5F",
        "usage": {
          "ko": "포인트 버튼"
        }
      },
      {
        "id": "sage-green",
        "name": {
          "ko": "Sage Green",
          "en": "Sage Green"
        },
        "value": "#81B29A",
        "usage": {
          "ko": "서브 뱃지"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "자연",
        "웜톤",
        "블롭곡선",
        "웰빙"
      ],
      "characteristics": [
        "border-radius: 40px 이상의 부드러운 유기적 곡선 커스텀 쉐이프",
        "따뜻한 흙(Clay), 숲(Pine), 테라코타(Terracotta)의 자연 친화 색조",
        "자극적이지 않고 눈이 편안한 인체공학적 비주얼 밸런스"
      ],
      "pros": [
        "마음의 안정을 주는 편안하고 친근한 서비스 이미지",
        "웰빙, 친환경, 뷰티, 라이프스타일 서비스에 최적"
      ],
      "cons": [
        "차갑고 정밀한 데이터 대시보드에는 어울리지 않을 수 있음"
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
    "id": "dark-minimal-glass",
    "aliases": [
      "darkmode-highcontrast"
    ],
    "categoryId": "editorial",
    "order": 150,
    "publicationStatus": "legacy",
    "name": {
      "ko": "다크모드 미니멀 글래스",
      "en": "Dark Mode Minimal Glass"
    },
    "summary": {
      "ko": "딥 네이비 우주 속 발광하는 미세 보더선과 최고급 모던 스펙트럼"
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
        "glass",
        "screen"
      ],
      "density": "sparse",
      "tone": [
        "luxurious",
        "immersive"
      ],
      "motion": "restrained",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#090A0F",
      "surface": "#12151F",
      "surfaceSubtle": "#1C2130",
      "border": "rgba(255, 255, 255, 0.16)",
      "text": "#FFFFFF",
      "textMuted": "#94A3B8",
      "accent": "#38BDF8",
      "accentSecondary": "#818CF8",
      "radius": "12px",
      "borderWidth": "1px",
      "shadow": "0 12px 30px rgba(0, 0, 0, 0.6)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 20px rgba(56, 189, 248, 0.3)"
    },
    "preview": {
      "rendererId": "darkmode",
      "thumbnailId": "oled-panel",
      "motionId": "glow-breathe"
    },
    "defaultTweaks": {
      "borderRadius": 16,
      "borderWidth": 1,
      "shadowDepth": 14,
      "backdropBlur": 16,
      "glowIntensity": 1.2
    },
    "palette": [
      {
        "id": "abyss-background",
        "name": {
          "ko": "Abyss Background",
          "en": "Abyss Background"
        },
        "value": "#0B0F19",
        "usage": {
          "ko": "딥 다크 배경"
        }
      },
      {
        "id": "card-surface",
        "name": {
          "ko": "Card Surface",
          "en": "Card Surface"
        },
        "value": "#111827",
        "usage": {
          "ko": "카드 패널"
        }
      },
      {
        "id": "sky-glow",
        "name": {
          "ko": "Sky Glow",
          "en": "Sky Glow"
        },
        "value": "#38BDF8",
        "usage": {
          "ko": "발광 미세 보더"
        }
      },
      {
        "id": "muted-slate",
        "name": {
          "ko": "Muted Slate",
          "en": "Muted Slate"
        },
        "value": "#94A3B8",
        "usage": {
          "ko": "보조 라벨"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "다크모드",
        "OLED",
        "미니멀",
        "발광보더"
      ],
      "characteristics": [
        "딥 차콜 배경 위에 펼쳐지는 은은한 네온 스카이블루 액센트",
        "극도로 정제된 라인 아이콘과 깔끔한 가독성 보장",
        "OLED 디스플레이의 가치와 배터리 절감을 고려한 미학"
      ],
      "pros": [
        "야간 및 어두운 환경에서 뛰어난 시각적 편안함",
        "최첨단 SaaS 및 글로벌 서비스의 현대적 대세 표준"
      ],
      "cons": [
        "밝은 야외 햇빛 아래에서는 명도 대비 재정비 필요"
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
    "id": "y2k-chrome",
    "aliases": [
      "y2k-chrome-hologram"
    ],
    "categoryId": "y2k",
    "order": 160,
    "publicationStatus": "legacy",
    "name": {
      "ko": "Y2K 크롬 & 홀로그램",
      "en": "Y2K Chrome & Hologram"
    },
    "summary": {
      "ko": "2000년대 초반 메탈릭 실버 크롬, 무지개 홀로그램과 사이버 팝 미학"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 1998,
        "end": 2026,
        "label": "Y2K with 2020s revival"
      },
      "lineages": [
        "cyberculture",
        "retrofuturism"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "metal",
        "plastic",
        "screen"
      ],
      "density": "maximal",
      "tone": [
        "nostalgic",
        "playful",
        "futuristic"
      ],
      "motion": "intense",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#0D0A1A",
      "surface": "rgba(30, 20, 55, 0.7)",
      "surfaceSubtle": "rgba(50, 35, 90, 0.5)",
      "border": "#A855F7",
      "text": "#F3E8FF",
      "textMuted": "#C084FC",
      "accent": "#EC4899",
      "accentSecondary": "#06B6D4",
      "radius": "16px",
      "borderWidth": "2px",
      "shadow": "0 0 30px rgba(168, 85, 247, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 0 25px rgba(236, 72, 153, 0.5)"
    },
    "preview": {
      "rendererId": "y2k-chrome",
      "thumbnailId": "chrome-disc",
      "motionId": "holo-sweep"
    },
    "defaultTweaks": {
      "borderRadius": 18,
      "borderWidth": 2,
      "shadowDepth": 12,
      "backdropBlur": 6,
      "glowIntensity": 1.4
    },
    "palette": [
      {
        "id": "chrome-silver",
        "name": {
          "ko": "Chrome Silver",
          "en": "Chrome Silver"
        },
        "value": "#E2E8F0",
        "usage": {
          "ko": "메탈릭 프레임"
        }
      },
      {
        "id": "holo-magenta",
        "name": {
          "ko": "Holo Magenta",
          "en": "Holo Magenta"
        },
        "value": "#EC4899",
        "usage": {
          "ko": "홀로그램 포인트"
        }
      },
      {
        "id": "electric-violet",
        "name": {
          "ko": "Electric Violet",
          "en": "Electric Violet"
        },
        "value": "#8B5CF6",
        "usage": {
          "ko": "사이버 림라이트"
        }
      },
      {
        "id": "space-navy",
        "name": {
          "ko": "Space Navy",
          "en": "Space Navy"
        },
        "value": "#0F172A",
        "usage": {
          "ko": "배경"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "Y2K",
        "크롬",
        "홀로그램",
        "밀레니엄"
      ],
      "characteristics": [
        "금속성 실버 크롬 텍스트와 홀로그래픽 무지개 쉬머 효과",
        "타원형 캡슐 버튼과 2000년대 테크노 미래주의 폰트",
        "별빛 반짝임(Sparkle)과 실버 림 라이트 반사"
      ],
      "pros": [
        "Z세대에 폭발적인 인기를 끄는 레트로 트렌드 정체성",
        "K-POP, 스트리트 패션, 힙한 브랜드에 독보적인 차별성"
      ],
      "cons": [
        "과도한 홀로그램 사용 시 텍스트 가독성 저하 주의"
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
    "id": "frutiger-aero",
    "aliases": [
      "frutiger-aero-aqua"
    ],
    "categoryId": "y2k",
    "order": 170,
    "publicationStatus": "legacy",
    "name": {
      "ko": "Frutiger Aero 투명 아쿠아",
      "en": "Frutiger Aero Aqua Gloss"
    },
    "summary": {
      "ko": "투명한 물방울, 글로시 유리 구체, 청량한 푸른 하늘과 유토피아적 낙관주의"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 2004,
        "end": 2013,
        "label": "Mid-2000s–early 2010s"
      },
      "lineages": [
        "skeuomorphism",
        "organic-modernism"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "glass",
        "organic"
      ],
      "density": "balanced",
      "tone": [
        "optimistic",
        "friendly"
      ],
      "motion": "expressive",
      "regions": [
        "international"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "linear-gradient(135deg, #0A4368 0%, #05263B 100%)",
      "surface": "rgba(255, 255, 255, 0.2)",
      "surfaceSubtle": "rgba(255, 255, 255, 0.1)",
      "border": "rgba(255, 255, 255, 0.5)",
      "text": "#FFFFFF",
      "textMuted": "#BEE3F8",
      "accent": "#00E5FF",
      "accentSecondary": "#76FF03",
      "radius": "20px",
      "borderWidth": "1.5px",
      "shadow": "0 16px 36px rgba(0, 40, 80, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.6)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 25px rgba(0, 229, 255, 0.6)"
    },
    "preview": {
      "rendererId": "frutiger-aero",
      "thumbnailId": "aqua-sphere",
      "motionId": "aqua-bubble"
    },
    "defaultTweaks": {
      "borderRadius": 22,
      "borderWidth": 2,
      "shadowDepth": 14,
      "backdropBlur": 14,
      "glowIntensity": 1.1
    },
    "themeEffects": {
      "backdropBlur": 14
    },
    "palette": [
      {
        "id": "sky-cyan",
        "name": {
          "ko": "Sky Cyan",
          "en": "Sky Cyan"
        },
        "value": "#38BDF8",
        "usage": {
          "ko": "맑은 하늘 베이스"
        }
      },
      {
        "id": "aqua-lime",
        "name": {
          "ko": "Aqua Lime",
          "en": "Aqua Lime"
        },
        "value": "#4ADE80",
        "usage": {
          "ko": "청량한 초록 잔디"
        }
      },
      {
        "id": "gloss-glass",
        "name": {
          "ko": "Gloss Glass",
          "en": "Gloss Glass"
        },
        "value": "rgba(255,255,255,0.4)",
        "usage": {
          "ko": "투명 젤리 하이라이트"
        }
      },
      {
        "id": "ocean-blue",
        "name": {
          "ko": "Ocean Blue",
          "en": "Ocean Blue"
        },
        "value": "#0284C7",
        "usage": {
          "ko": "깊은 물방울 버튼"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "FrutigerAero",
        "아쿠아",
        "글로시",
        "자연주의"
      ],
      "characteristics": [
        "광택 나는 젤리/아쿠아 버튼과 3D 유리 구체 하이라이트",
        "푸른 하늘과 초록 풀밭의 맑은 2000년대 중반 유토피아 톤",
        "부드러운 곡선과 투명한 플라스틱 캡슐 형태"
      ],
      "pros": [
        "맑고 깨끗한 긍정적 에너지와 청량한 감성 전달",
        "물방울과 유리 질감의 풍부한 시각적 깊이감"
      ],
      "cons": [
        "현대 플랫 미니멀리즘에 비해 그래픽 요소가 다채로움"
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
    "id": "pixel-arcade",
    "aliases": [
      "pixel-arcade-8bit"
    ],
    "categoryId": "y2k",
    "order": 180,
    "publicationStatus": "legacy",
    "name": {
      "ko": "8-Bit 픽셀 아케이드",
      "en": "8-Bit Pixel Arcade"
    },
    "summary": {
      "ko": "도트 그래픽, CRT 모니터 스캔라인, 클래식 레트로 게임기 인터페이스"
    },
    "classification": {
      "kind": "revival",
      "era": {
        "start": 1970,
        "end": 2026,
        "label": "1970s–present"
      },
      "lineages": [
        "cyberculture"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "pixel",
        "screen"
      ],
      "density": "dense",
      "tone": [
        "nostalgic",
        "playful"
      ],
      "motion": "expressive",
      "regions": [
        "global-internet",
        "east-asia"
      ],
      "maturity": "canonical"
    },
    "tokens": {
      "background": "#100C2A",
      "surface": "#1E1646",
      "surfaceSubtle": "#2C2266",
      "border": "#FFCC00",
      "text": "#FFFFFF",
      "textMuted": "#A39BDE",
      "accent": "#00FF66",
      "accentSecondary": "#FF0055",
      "radius": "0px",
      "borderWidth": "4px",
      "shadow": "6px 6px 0px #000000",
      "fontFamily": "'Fira Code', 'Courier New', monospace",
      "glow": "0 0 15px #00FF66"
    },
    "preview": {
      "rendererId": "pixel-arcade",
      "thumbnailId": "arcade-hud",
      "motionId": "pixel-blink"
    },
    "defaultTweaks": {
      "borderRadius": 0,
      "borderWidth": 4,
      "shadowDepth": 8,
      "backdropBlur": 0,
      "glowIntensity": 0.6
    },
    "palette": [
      {
        "id": "arcade-purple",
        "name": {
          "ko": "Arcade Purple",
          "en": "Arcade Purple"
        },
        "value": "#2E0854",
        "usage": {
          "ko": "아케이드 배경"
        }
      },
      {
        "id": "pixel-gold",
        "name": {
          "ko": "Pixel Gold",
          "en": "Pixel Gold"
        },
        "value": "#FBBF24",
        "usage": {
          "ko": "코인/스타 텍스트"
        }
      },
      {
        "id": "health-green",
        "name": {
          "ko": "Health Green",
          "en": "Health Green"
        },
        "value": "#22C55E",
        "usage": {
          "ko": "HP 바"
        }
      },
      {
        "id": "pixel-red",
        "name": {
          "ko": "Pixel Red",
          "en": "Pixel Red"
        },
        "value": "#EF4444",
        "usage": {
          "ko": "보스 알림"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "픽셀아트",
        "8Bit",
        "게임",
        "CRT스캔라인"
      ],
      "characteristics": [
        "픽셀 폰트와 각진 4px 계단식 도트 보더",
        "코인 인서트, HP 게이지, 레트로 게임 HUD 프레임",
        "CRT 브라운관 TV의 은은한 스캔라인과 비프음 감성"
      ],
      "pros": [
        "전 세대에 걸친 친근하고 직관적인 게임 플레이 경험",
        "게이미피케이션(Gamification) 요소와 찰떡궁합"
      ],
      "cons": [
        "긴 문장의 정보성 텍스트 렌더링 시 가독성 한계"
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
    "id": "kinetic-type",
    "aliases": [
      "kinetic-type-motion"
    ],
    "categoryId": "hypertech",
    "order": 190,
    "publicationStatus": "legacy",
    "name": {
      "ko": "키네틱 타이포 & 모션 헤비",
      "en": "Kinetic Typography & Motion"
    },
    "summary": {
      "ko": "흐르는 마퀴(Marquee), 회전하는 텍스트 링, 역동적 속도감의 타이포 중심 UI"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 1960,
        "end": 2026,
        "label": "1960s–present"
      },
      "lineages": [
        "modernism",
        "editorial"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "flat"
      ],
      "density": "maximal",
      "tone": [
        "energetic",
        "precise"
      ],
      "motion": "intense",
      "regions": [
        "international"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#000000",
      "surface": "#111111",
      "surfaceSubtle": "#222222",
      "border": "#CCFF00",
      "text": "#FFFFFF",
      "textMuted": "#888888",
      "accent": "#CCFF00",
      "accentSecondary": "#FFFFFF",
      "radius": "0px",
      "borderWidth": "2px",
      "shadow": "0 0 30px rgba(204, 255, 0, 0.25)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 0 20px #CCFF00"
    },
    "preview": {
      "rendererId": "kinetic-type",
      "thumbnailId": "speed-type",
      "motionId": "marquee-stagger"
    },
    "defaultTweaks": {
      "borderRadius": 8,
      "borderWidth": 1,
      "shadowDepth": 8,
      "backdropBlur": 4,
      "glowIntensity": 1.2
    },
    "palette": [
      {
        "id": "hyper-lime",
        "name": {
          "ko": "Hyper Lime",
          "en": "Hyper Lime"
        },
        "value": "#CCFF00",
        "usage": {
          "ko": "키네틱 액센트"
        }
      },
      {
        "id": "pitch-black",
        "name": {
          "ko": "Pitch Black",
          "en": "Pitch Black"
        },
        "value": "#050505",
        "usage": {
          "ko": "스피드 배경"
        }
      },
      {
        "id": "flash-white",
        "name": {
          "ko": "Flash White",
          "en": "Flash White"
        },
        "value": "#FFFFFF",
        "usage": {
          "ko": "헤드라인 타이포"
        }
      },
      {
        "id": "carbon-gray",
        "name": {
          "ko": "Carbon Gray",
          "en": "Carbon Gray"
        },
        "value": "#1E1E1E",
        "usage": {
          "ko": "컨테이너 트랙"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "키네틱",
        "마퀴",
        "모션",
        "타이포그래피"
      ],
      "characteristics": [
        "무한 롤링되는 대형 타이포 마퀴 배너",
        "초당 프레임의 역동적인 텍스트 스케일링 & 트랜스폼",
        "하이퍼 라임(#CCFF00)과 딥 블랙의 강렬한 레이싱 콘트라스트"
      ],
      "pros": [
        "시선을 단숨에 사로잡는 압도적인 시각적 역동성",
        "신제품 런칭 및 브랜드 캠페인의 흥분감 고조"
      ],
      "cons": [
        "모션에 민감한 사용자(전정기관 장애)를 위한 배려 필요"
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
    "id": "bento-grid",
    "aliases": [
      "bento-ui-precision"
    ],
    "categoryId": "hypertech",
    "order": 200,
    "publicationStatus": "legacy",
    "name": {
      "ko": "Bento UI 2.0 정밀 그리드",
      "en": "Bento UI 2.0 Precision Grid"
    },
    "summary": {
      "ko": "애플·스트라이프 스타일의 비대칭 카드 모듈과 인터랙티브 마이크로 위젯"
    },
    "classification": {
      "kind": "interface-language",
      "era": {
        "start": 2020,
        "end": 2026,
        "label": "2020s"
      },
      "lineages": [
        "grid-systems",
        "minimalism"
      ],
      "media": [
        "web-ui",
        "product-ui"
      ],
      "materiality": [
        "flat",
        "glass"
      ],
      "density": "dense",
      "tone": [
        "precise",
        "professional"
      ],
      "motion": "restrained",
      "regions": [
        "international",
        "east-asia"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#0B0E14",
      "surface": "rgba(22, 28, 38, 0.7)",
      "surfaceSubtle": "rgba(255, 255, 255, 0.04)",
      "border": "rgba(255, 255, 255, 0.1)",
      "text": "#F1F5F9",
      "textMuted": "#94A3B8",
      "accent": "#38BDF8",
      "accentSecondary": "#A78BFA",
      "radius": "18px",
      "borderWidth": "1px",
      "shadow": "0 16px 36px rgba(0, 0, 0, 0.45)",
      "fontFamily": "'Inter', sans-serif",
      "glow": "0 0 25px rgba(56, 189, 248, 0.25)"
    },
    "preview": {
      "rendererId": "bento-grid",
      "thumbnailId": "bento-tiles",
      "motionId": "tile-stagger"
    },
    "defaultTweaks": {
      "borderRadius": 20,
      "borderWidth": 1,
      "shadowDepth": 10,
      "backdropBlur": 12,
      "glowIntensity": 0.7
    },
    "themeEffects": {
      "backdropBlur": 16
    },
    "palette": [
      {
        "id": "bento-card",
        "name": {
          "ko": "Bento Card",
          "en": "Bento Card"
        },
        "value": "#161B26",
        "usage": {
          "ko": "모듈 카드 베이스"
        }
      },
      {
        "id": "subtle-rim",
        "name": {
          "ko": "Subtle Rim",
          "en": "Subtle Rim"
        },
        "value": "rgba(255,255,255,0.08)",
        "usage": {
          "ko": "미세 림 라이트"
        }
      },
      {
        "id": "active-indigo",
        "name": {
          "ko": "Active Indigo",
          "en": "Active Indigo"
        },
        "value": "#6366F1",
        "usage": {
          "ko": "토글 & 진행바"
        }
      },
      {
        "id": "data-emerald",
        "name": {
          "ko": "Data Emerald",
          "en": "Data Emerald"
        },
        "value": "#10B981",
        "usage": {
          "ko": "실시간 지표"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "Bento",
        "애플스타일",
        "위젯",
        "모듈형"
      ],
      "characteristics": [
        "도시락(Bento)처럼 다양한 비율(1x1, 2x1, 2x2)로 완벽히 정렬된 카드",
        "각 카드마다 독립적인 기능(토글, 미니차트, 프로필)을 가진 미니 앱",
        "은은한 글래스 림 보더와 부드러운 다크 그라데이션 서페이스"
      ],
      "pros": [
        "복잡한 다기능 서비스의 정보를 직관적으로 모듈화",
        "최신 글로벌 테크 웹사이트의 대표 트렌드"
      ],
      "cons": [
        "반응형 모바일 화면에서 카드 순서 및 계층 재정렬 설계 필요"
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
    "id": "acid-techno",
    "aliases": [
      "cyberpunk-hud"
    ],
    "categoryId": "hypertech",
    "order": 210,
    "publicationStatus": "legacy",
    "name": {
      "ko": "애시드 그래픽 & 테크노 레이브",
      "en": "Acid Graphics & Techno Rave"
    },
    "summary": {
      "ko": "네온 형광 그린, 크롬 구체, 3D 왜곡 그래픽과 레이브 클럽 감성의 디자인"
    },
    "classification": {
      "kind": "microtrend",
      "era": {
        "start": 2018,
        "end": 2026,
        "label": "Late 2010s–2020s"
      },
      "lineages": [
        "cyberculture",
        "postmodernism"
      ],
      "media": [
        "graphic",
        "web-ui"
      ],
      "materiality": [
        "screen",
        "flat"
      ],
      "density": "maximal",
      "tone": [
        "energetic",
        "rebellious"
      ],
      "motion": "intense",
      "regions": [
        "europe",
        "global-internet"
      ],
      "maturity": "emerging"
    },
    "tokens": {
      "background": "#050608",
      "surface": "rgba(15, 20, 28, 0.85)",
      "surfaceSubtle": "rgba(25, 35, 50, 0.6)",
      "border": "#00F0FF",
      "text": "#00F0FF",
      "textMuted": "#008899",
      "accent": "#CCFF00",
      "accentSecondary": "#FF0055",
      "radius": "4px",
      "borderWidth": "1.5px",
      "shadow": "0 0 25px rgba(0, 240, 255, 0.35)",
      "fontFamily": "'Fira Code', monospace",
      "glow": "0 0 20px #00F0FF"
    },
    "preview": {
      "rendererId": "acid-techno",
      "thumbnailId": "acid-smile",
      "motionId": "hue-distort"
    },
    "defaultTweaks": {
      "borderRadius": 4,
      "borderWidth": 2,
      "shadowDepth": 12,
      "backdropBlur": 0,
      "glowIntensity": 2
    },
    "palette": [
      {
        "id": "acid-neon-green",
        "name": {
          "ko": "Acid Neon Green",
          "en": "Acid Neon Green"
        },
        "value": "#39FF14",
        "usage": {
          "ko": "주요 신호 & 림"
        }
      },
      {
        "id": "pure-darkness",
        "name": {
          "ko": "Pure Darkness",
          "en": "Pure Darkness"
        },
        "value": "#000000",
        "usage": {
          "ko": "클럽 배경"
        }
      },
      {
        "id": "electric-yellow",
        "name": {
          "ko": "Electric Yellow",
          "en": "Electric Yellow"
        },
        "value": "#FFFF33",
        "usage": {
          "ko": "스마일리 & 경고"
        }
      },
      {
        "id": "toxic-purple",
        "name": {
          "ko": "Toxic Purple",
          "en": "Toxic Purple"
        },
        "value": "#7928CA",
        "usage": {
          "ko": "서브 왜곡"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "애시드",
        "테크노",
        "레이브",
        "네온그린"
      ],
      "characteristics": [
        "시각적 충격을 주는 애시드 형광 그린/옐로우와 스마일리 심볼",
        "왜곡된 3D 액체 크롬 텍스처와 바코드 그래픽",
        "언더그라운드 테크노 파티 포스터를 연상시키는 전위적 레이아웃"
      ],
      "pros": [
        "젊은 서브컬처 팬덤을 타겟으로 한 독보적 개성",
        "예술, 음악, 스트리트 패션 브랜드에서 강력한 임팩트"
      ],
      "cons": [
        "가독성과 보편성이 낮아 비즈니스 서비스에는 부적합"
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
    "id": "claymorphism",
    "aliases": [
      "claymorphism-bubble"
    ],
    "categoryId": "soft3d",
    "order": 220,
    "publicationStatus": "legacy",
    "name": {
      "ko": "클레이모피즘 3D 버블",
      "en": "Claymorphism & 3D Bubble"
    },
    "summary": {
      "ko": "점토(Clay)처럼 둥글고 폭신폭신한 3D 입체 카드와 말랑말랑한 인터랙션"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 2020,
        "end": 2026,
        "label": "2020s"
      },
      "lineages": [
        "skeuomorphism"
      ],
      "media": [
        "illustration",
        "three-d",
        "web-ui"
      ],
      "materiality": [
        "clay",
        "plastic"
      ],
      "density": "balanced",
      "tone": [
        "friendly",
        "playful",
        "tactile"
      ],
      "motion": "expressive",
      "regions": [
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#F0F4FD",
      "surface": "#FFFFFF",
      "surfaceSubtle": "#E2EAFC",
      "border": "transparent",
      "text": "#2D3748",
      "textMuted": "#718096",
      "accent": "#FF6B4A",
      "accentSecondary": "#6B46C1",
      "radius": "28px",
      "borderWidth": "0px",
      "shadow": "12px 16px 28px rgba(140, 160, 210, 0.35), inset -8px -8px 12px rgba(0, 0, 0, 0.06), inset 8px 8px 12px rgba(255, 255, 255, 0.9)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 10px 20px rgba(255, 107, 74, 0.25)"
    },
    "preview": {
      "rendererId": "claymorphism",
      "thumbnailId": "clay-bubble",
      "motionId": "squash-breathe"
    },
    "defaultTweaks": {
      "borderRadius": 32,
      "borderWidth": 0,
      "shadowDepth": 20,
      "backdropBlur": 0,
      "glowIntensity": 0.4
    },
    "palette": [
      {
        "id": "clay-peach",
        "name": {
          "ko": "Clay Peach",
          "en": "Clay Peach"
        },
        "value": "#FFDDD2",
        "usage": {
          "ko": "폭신한 카드"
        }
      },
      {
        "id": "clay-coral",
        "name": {
          "ko": "Clay Coral",
          "en": "Clay Coral"
        },
        "value": "#FF6B4A",
        "usage": {
          "ko": "메인 버튼"
        }
      },
      {
        "id": "clay-teal",
        "name": {
          "ko": "Clay Teal",
          "en": "Clay Teal"
        },
        "value": "#83C5BE",
        "usage": {
          "ko": "보조 버블"
        }
      },
      {
        "id": "cloud-base",
        "name": {
          "ko": "Cloud Base",
          "en": "Cloud Base"
        },
        "value": "#EDF6F9",
        "usage": {
          "ko": "배경"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "클레이",
        "3D버블",
        "말랑",
        "소프트"
      ],
      "characteristics": [
        "내부 안쪽 그림자(Inset Shadow)와 부드러운 드롭 섀도가 만드는 풍선 질감",
        "32px 이상의 극단적으로 둥근 모서리와 파스텔 클레이 색조",
        "호버 시 젤리처럼 통통 튀는 바운스 인터랙션"
      ],
      "pros": [
        "보는 사람에게 친근함과 귀여운 심리적 만족감 선사",
        "에듀테크, 키즈, 온보딩 튜토리얼 UI에 최고 효과"
      ],
      "cons": [
        "그림자 연산이 복잡하고 공간을 많이 차지함"
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
    "id": "handcrafted-indie",
    "aliases": [
      "indie-craft"
    ],
    "categoryId": "soft3d",
    "order": 230,
    "publicationStatus": "legacy",
    "name": {
      "ko": "핸드크래프트 콜라주 인디",
      "en": "Handcrafted & Collage Indie"
    },
    "summary": {
      "ko": "마스킹 테이프, 종이 찢김 질감, 손글씨 스티커가 주는 아날로그 따스함"
    },
    "classification": {
      "kind": "technique",
      "era": {
        "start": 2000,
        "end": 2026,
        "label": "2000s–present"
      },
      "lineages": [
        "indie-craft",
        "editorial"
      ],
      "media": [
        "graphic",
        "illustration",
        "web-ui"
      ],
      "materiality": [
        "paper",
        "ink"
      ],
      "density": "dense",
      "tone": [
        "tactile",
        "friendly"
      ],
      "motion": "restrained",
      "regions": [
        "international",
        "global-internet"
      ],
      "maturity": "established"
    },
    "tokens": {
      "background": "#F5EFEB",
      "surface": "#FFFDF9",
      "surfaceSubtle": "#ECE1D8",
      "border": "#4A3E3D",
      "text": "#3D3231",
      "textMuted": "#7C6C6A",
      "accent": "#E05A47",
      "accentSecondary": "#D49B35",
      "radius": "4px",
      "borderWidth": "2px",
      "shadow": "3px 4px 0px #4A3E3D",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "none"
    },
    "preview": {
      "rendererId": "handcrafted-indie",
      "thumbnailId": "kraft-tape",
      "motionId": "tape-peel"
    },
    "defaultTweaks": {
      "borderRadius": 6,
      "borderWidth": 2,
      "shadowDepth": 6,
      "backdropBlur": 0,
      "glowIntensity": 0
    },
    "palette": [
      {
        "id": "kraft-paper",
        "name": {
          "ko": "Kraft Paper",
          "en": "Kraft Paper"
        },
        "value": "#F4ECD8",
        "usage": {
          "ko": "스크랩북 배경"
        }
      },
      {
        "id": "masking-tape",
        "name": {
          "ko": "Masking Tape",
          "en": "Masking Tape"
        },
        "value": "rgba(255, 222, 89, 0.7)",
        "usage": {
          "ko": "테이프 데코"
        }
      },
      {
        "id": "stamp-red",
        "name": {
          "ko": "Stamp Red",
          "en": "Stamp Red"
        },
        "value": "#B91C1C",
        "usage": {
          "ko": "도장 스탬프"
        }
      },
      {
        "id": "pencil-charcoal",
        "name": {
          "ko": "Pencil Charcoal",
          "en": "Pencil Charcoal"
        },
        "value": "#2D3748",
        "usage": {
          "ko": "손글씨 텍스트"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "손그림",
        "콜라주",
        "마스킹테이프",
        "인디"
      ],
      "characteristics": [
        "반투명 마스킹 테이프 그래픽과 스크랩북 페이퍼 질감",
        "살짝 기울어진 각도(Transform rotate)와 손글씨 주석",
        "스탬프 도장 및 빈티지 핀 스티커 데코레이션"
      ],
      "pros": [
        "기계적인 느낌을 배제한 인간적이고 따뜻한 스토리 전달",
        "인디 작가, 독립서점, 개인 블로그/포트폴리오에 이상적"
      ],
      "cons": [
        "정형화된 기업 데이터 표기에는 정돈성이 떨어짐"
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
    "id": "solarpunk-eco",
    "aliases": [
      "solarpunk-green"
    ],
    "categoryId": "soft3d",
    "order": 240,
    "publicationStatus": "legacy",
    "name": {
      "ko": "솔라펑크 에코 퓨처리즘",
      "en": "Solarpunk Eco-Futurism"
    },
    "summary": {
      "ko": "자연과 첨단 재생 에너지가 공존하는 찬란한 황금빛 태양과 녹색 잎사귀 미학"
    },
    "classification": {
      "kind": "speculative",
      "era": {
        "start": 2008,
        "end": 2026,
        "label": "Late 2000s–present"
      },
      "lineages": [
        "eco-futurism",
        "organic-modernism"
      ],
      "media": [
        "graphic",
        "illustration",
        "web-ui"
      ],
      "materiality": [
        "organic",
        "glass"
      ],
      "density": "balanced",
      "tone": [
        "optimistic",
        "organic",
        "futuristic"
      ],
      "motion": "expressive",
      "regions": [
        "international",
        "global-internet"
      ],
      "maturity": "emerging"
    },
    "tokens": {
      "background": "#0A1C14",
      "surface": "#132E22",
      "surfaceSubtle": "#1C4030",
      "border": "#00E699",
      "text": "#E8F5E9",
      "textMuted": "#A5D6A7",
      "accent": "#00E699",
      "accentSecondary": "#FFD54F",
      "radius": "18px",
      "borderWidth": "1.5px",
      "shadow": "0 0 30px rgba(0, 230, 153, 0.3)",
      "fontFamily": "'Space Grotesk', sans-serif",
      "glow": "0 0 25px #00E699"
    },
    "preview": {
      "rendererId": "solarpunk-eco",
      "thumbnailId": "solar-leaf",
      "motionId": "leaf-sway"
    },
    "defaultTweaks": {
      "borderRadius": 20,
      "borderWidth": 1,
      "shadowDepth": 12,
      "backdropBlur": 8,
      "glowIntensity": 1
    },
    "palette": [
      {
        "id": "solar-gold",
        "name": {
          "ko": "Solar Gold",
          "en": "Solar Gold"
        },
        "value": "#F59E0B",
        "usage": {
          "ko": "태양광 에너지"
        }
      },
      {
        "id": "forest-bio",
        "name": {
          "ko": "Forest Bio",
          "en": "Forest Bio"
        },
        "value": "#065F46",
        "usage": {
          "ko": "깊은 숲 베이스"
        }
      },
      {
        "id": "clean-emerald",
        "name": {
          "ko": "Clean Emerald",
          "en": "Clean Emerald"
        },
        "value": "#10B981",
        "usage": {
          "ko": "재생 에너지 뱃지"
        }
      },
      {
        "id": "warm-parchment",
        "name": {
          "ko": "Warm Parchment",
          "en": "Warm Parchment"
        },
        "value": "#FEF3C7",
        "usage": {
          "ko": "따스한 빛 패널"
        }
      }
    ],
    "editorial": {
      "moodTags": [
        "솔라펑크",
        "친환경",
        "태양광",
        "미래생태"
      ],
      "characteristics": [
        "스테인드글라스 패턴과 아르누보 유기적 덩굴 라인 아트",
        "황금빛 태양광(#F59E0B)과 싱그러운 숲 녹색(#10B981)의 조화",
        "지속 가능한 미래와 기술 생태계의 희망찬 분위기"
      ],
      "pros": [
        "ESG, 친환경 기술, 클린에너지 브랜드의 비전 강조",
        "디스토피아적 사이버펑크와 대비되는 긍정적 미래 비전"
      ],
      "cons": [
        "복잡한 식물 장식으로 인해 레이아웃이 다소 장식적일 수 있음"
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
