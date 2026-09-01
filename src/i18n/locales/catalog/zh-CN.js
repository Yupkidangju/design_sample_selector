import { applySimplifiedChineseEditorialReview } from './zhCNEditorial.js';

// Stage 1 명시 콘텐츠 기준선. Stage 2 편집 감수는 zhCNEditorial profile을 적용한다.
const catalog = {
  "styles": {
    "swiss-grid": {
      "id": "swiss-grid",
      "name": "以网格为核心的现代主义",
      "summary": "以网格为核心的现代主义是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas-white",
          "name": "配色1",
          "usage": "以网格为核心的现代主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4F4F0"
        },
        {
          "id": "deep-ink",
          "name": "配色2",
          "usage": "以网格为核心的现代主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#111111"
        },
        {
          "id": "swiss-red",
          "name": "配色3",
          "usage": "以网格为核心的现代主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF3300"
        },
        {
          "id": "neutral-gray",
          "name": "配色4",
          "usage": "以网格为核心的现代主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#666666"
        }
      ],
      "characteristics": [
        "以网格为核心的现代主义重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。",
        "以网格为核心的现代主义明确记录了保持一致实现所需的补充构图规则。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。",
        "保持以网格为核心的现代主义的层级后，可用于更广泛的制作环境。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。",
        "应用以网格为核心的现代主义时，需要同时检查内容长度与可读性。"
      ]
    },
    "corporate-minimal": {
      "id": "corporate-minimal",
      "name": "企业极简主义",
      "summary": "企业极简主义是在国际字体风格中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "pure-white",
          "name": "配色1",
          "usage": "企业极简主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "slate-dark",
          "name": "配色2",
          "usage": "企业极简主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0F172A"
        },
        {
          "id": "trust-blue",
          "name": "配色3",
          "usage": "企业极简主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#2563EB"
        },
        {
          "id": "soft-gray",
          "name": "配色4",
          "usage": "企业极简主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "企业极简主义重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立专业的产品语气。",
        "保持企业极简主义的层级后，可用于更广泛的制作环境。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "high-contrast-mono": {
      "id": "high-contrast-mono",
      "name": "高对比度等宽字体",
      "summary": "高对比度等宽字体是在国际字体风格中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "terminal-black",
          "name": "配色1",
          "usage": "高对比度等宽字体的配色1用于区分主要表面、文字与状态信号。",
          "value": "#050505"
        },
        {
          "id": "pure-white",
          "name": "配色2",
          "usage": "高对比度等宽字体的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "neon-terminal",
          "name": "配色3",
          "usage": "高对比度等宽字体的配色3用于区分主要表面、文字与状态信号。",
          "value": "#00FF66"
        },
        {
          "id": "dim-gray",
          "name": "配色4",
          "usage": "高对比度等宽字体的配色4用于区分主要表面、文字与状态信号。",
          "value": "#333333"
        }
      ],
      "characteristics": [
        "高对比度等宽字体重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "raw-brutalism": {
      "id": "raw-brutalism",
      "name": "原生数字粗野主义",
      "summary": "原生数字粗野主义是在粗野主义中运用复兴风格原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "raw-yellow",
          "name": "配色1",
          "usage": "原生数字粗野主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFFF00"
        },
        {
          "id": "harsh-black",
          "name": "配色2",
          "usage": "原生数字粗野主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#000000"
        },
        {
          "id": "hot-pink",
          "name": "配色3",
          "usage": "原生数字粗野主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF0055"
        },
        {
          "id": "stark-white",
          "name": "配色4",
          "usage": "原生数字粗野主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "原生数字粗野主义重新诠释复兴风格原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "neo-brutalism": {
      "id": "neo-brutalism",
      "name": "潮流新粗野主义",
      "summary": "潮流新粗野主义是在粗野主义中运用复兴风格原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "pop-yellow",
          "name": "配色1",
          "usage": "潮流新粗野主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FEF08A"
        },
        {
          "id": "soft-sky",
          "name": "配色2",
          "usage": "潮流新粗野主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#BFDBFE"
        },
        {
          "id": "slate-ink",
          "name": "配色3",
          "usage": "潮流新粗野主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#1E293B"
        },
        {
          "id": "coral-pop",
          "name": "配色4",
          "usage": "潮流新粗野主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F43F5E"
        }
      ],
      "characteristics": [
        "潮流新粗野主义重新诠释复兴风格原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "cyber-brutalism": {
      "id": "cyber-brutalism",
      "name": "赛博粗野主义",
      "summary": "赛博粗野主义是在粗野主义中运用微趋势原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "abyss-dark",
          "name": "配色1",
          "usage": "赛博粗野主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0D0E15"
        },
        {
          "id": "cyber-cyan",
          "name": "配色2",
          "usage": "赛博粗野主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#00F0FF"
        },
        {
          "id": "neon-pink",
          "name": "配色3",
          "usage": "赛博粗野主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF007A"
        },
        {
          "id": "grid-blue",
          "name": "配色4",
          "usage": "赛博粗野主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1F2438"
        }
      ],
      "characteristics": [
        "赛博粗野主义重新诠释微趋势原则。",
        "粗野主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与强烈的动效。"
      ]
    },
    "glassmorphism": {
      "id": "glassmorphism",
      "name": "磨砂玻璃拟态",
      "summary": "磨砂玻璃拟态是在立体与材质中运用表现技法原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "glass-frost",
          "name": "配色1",
          "usage": "磨砂玻璃拟态的配色1用于区分主要表面、文字与状态信号。",
          "value": "rgba(255,255,255,0.12)"
        },
        {
          "id": "deep-space",
          "name": "配色2",
          "usage": "磨砂玻璃拟态的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0F172A"
        },
        {
          "id": "glow-indigo",
          "name": "配色3",
          "usage": "磨砂玻璃拟态的配色3用于区分主要表面、文字与状态信号。",
          "value": "#818CF8"
        },
        {
          "id": "crystal-white",
          "name": "配色4",
          "usage": "磨砂玻璃拟态的配色4用于区分主要表面、文字与状态信号。",
          "value": "#E0E7FF"
        }
      ],
      "characteristics": [
        "磨砂玻璃拟态重新诠释表现技法原则。",
        "极简主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "neumorphism": {
      "id": "neumorphism",
      "name": "柔和新拟态",
      "summary": "柔和新拟态是在立体与材质中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "soft-surface",
          "name": "配色1",
          "usage": "柔和新拟态的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E0E5EC"
        },
        {
          "id": "highlight-shadow",
          "name": "配色2",
          "usage": "柔和新拟态的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "dark-shadow",
          "name": "配色3",
          "usage": "柔和新拟态的配色3用于区分主要表面、文字与状态信号。",
          "value": "#A3B1C6"
        },
        {
          "id": "tactile-accent",
          "name": "配色4",
          "usage": "柔和新拟态的配色4用于区分主要表面、文字与状态信号。",
          "value": "#4F46E5"
        }
      ],
      "characteristics": [
        "柔和新拟态重新诠释表现技法原则。",
        "极简主义谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "skeuomorphism": {
      "id": "skeuomorphism",
      "name": "现代拟物化 2.0",
      "summary": "现代拟物化 2.0是在立体与材质中运用界面语言原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "brushed-charcoal",
          "name": "配色1",
          "usage": "现代拟物化 2.0的配色1用于区分主要表面、文字与状态信号。",
          "value": "#1E1E24"
        },
        {
          "id": "metallic-gray",
          "name": "配色2",
          "usage": "现代拟物化 2.0的配色2用于区分主要表面、文字与状态信号。",
          "value": "#2D2D35"
        },
        {
          "id": "amber-indicator",
          "name": "配色3",
          "usage": "现代拟物化 2.0的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF9F1C"
        },
        {
          "id": "led-emerald",
          "name": "配色4",
          "usage": "现代拟物化 2.0的配色4用于区分主要表面、文字与状态信号。",
          "value": "#4CB944"
        }
      ],
      "characteristics": [
        "现代拟物化 2.0重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "memphis": {
      "id": "memphis",
      "name": "孟菲斯波普设计",
      "summary": "孟菲斯波普设计是在复古与流行中运用历史运动原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "memphis-pink",
          "name": "配色1",
          "usage": "孟菲斯波普设计的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FF70A6"
        },
        {
          "id": "peach-coral",
          "name": "配色2",
          "usage": "孟菲斯波普设计的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FF9770"
        },
        {
          "id": "sunshine-yellow",
          "name": "配色3",
          "usage": "孟菲斯波普设计的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FFD670"
        },
        {
          "id": "sky-cyan",
          "name": "配色4",
          "usage": "孟菲斯波普设计的配色4用于区分主要表面、文字与状态信号。",
          "value": "#70D6FF"
        }
      ],
      "characteristics": [
        "孟菲斯波普设计重新诠释历史运动原则。",
        "后现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "synthwave": {
      "id": "synthwave",
      "name": "80年代Synthwave",
      "summary": "80年代Synthwave是在复古与流行中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "synth-purple",
          "name": "配色1",
          "usage": "80年代Synthwave的配色1用于区分主要表面、文字与状态信号。",
          "value": "#1A0B2E"
        },
        {
          "id": "neon-magenta",
          "name": "配色2",
          "usage": "80年代Synthwave的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FF007F"
        },
        {
          "id": "electric-cyan",
          "name": "配色3",
          "usage": "80年代Synthwave的配色3用于区分主要表面、文字与状态信号。",
          "value": "#00F5FF"
        },
        {
          "id": "sunset-gold",
          "name": "配色4",
          "usage": "80年代Synthwave的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FFDD00"
        }
      ],
      "characteristics": [
        "80年代Synthwave重新诠释复兴风格原则。",
        "复古未来主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与强烈的动效。"
      ]
    },
    "vaporwave": {
      "id": "vaporwave",
      "name": "蒸汽波轻松风",
      "summary": "蒸汽波轻松风是在复古与流行中运用微趋势原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "vapor-lavender",
          "name": "配色1",
          "usage": "蒸汽波轻松风的配色1用于区分主要表面、文字与状态信号。",
          "value": "#D8B4F8"
        },
        {
          "id": "pastel-yellow",
          "name": "配色2",
          "usage": "蒸汽波轻松风的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F9F871"
        },
        {
          "id": "chill-violet",
          "name": "配色3",
          "usage": "蒸汽波轻松风的配色3用于区分主要表面、文字与状态信号。",
          "value": "#845EC2"
        },
        {
          "id": "retro-mint",
          "name": "配色4",
          "usage": "蒸汽波轻松风的配色4用于区分主要表面、文字与状态信号。",
          "value": "#00C9A7"
        }
      ],
      "characteristics": [
        "蒸汽波轻松风重新诠释微趋势原则。",
        "后现代主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "high-fashion": {
      "id": "high-fashion",
      "name": "高级时尚编辑风格",
      "summary": "高级时尚编辑风格是在编辑与有机中运用界面语言原则与奢华氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "midnight-ink",
          "name": "配色1",
          "usage": "高级时尚编辑风格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0A0A0A"
        },
        {
          "id": "ivory-soft",
          "name": "配色2",
          "usage": "高级时尚编辑风格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F5F5F0"
        },
        {
          "id": "champagne-gold",
          "name": "配色3",
          "usage": "高级时尚编辑风格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C5A880"
        },
        {
          "id": "warm-charcoal",
          "name": "配色4",
          "usage": "高级时尚编辑风格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1C1C1E"
        }
      ],
      "characteristics": [
        "高级时尚编辑风格重新诠释界面语言原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立奢华的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与无的动效。"
      ]
    },
    "fluid-organic": {
      "id": "fluid-organic",
      "name": "流线有机形态与暖色调",
      "summary": "流线有机形态与暖色调是在编辑与有机中运用表现技法原则与有机材料氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "warm-clay",
          "name": "配色1",
          "usage": "流线有机形态与暖色调的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7F4EF"
        },
        {
          "id": "forest-pine",
          "name": "配色2",
          "usage": "流线有机形态与暖色调的配色2用于区分主要表面、文字与状态信号。",
          "value": "#2C3E35"
        },
        {
          "id": "terracotta",
          "name": "配色3",
          "usage": "流线有机形态与暖色调的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E07A5F"
        },
        {
          "id": "sage-green",
          "name": "配色4",
          "usage": "流线有机形态与暖色调的配色4用于区分主要表面、文字与状态信号。",
          "value": "#81B29A"
        }
      ],
      "characteristics": [
        "流线有机形态与暖色调重新诠释表现技法原则。",
        "有机现代主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立有机材料的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "dark-minimal-glass": {
      "id": "dark-minimal-glass",
      "name": "深色模式极简玻璃",
      "summary": "深色模式极简玻璃是在编辑与有机中运用界面语言原则与奢华氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "abyss-background",
          "name": "配色1",
          "usage": "深色模式极简玻璃的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0B0F19"
        },
        {
          "id": "card-surface",
          "name": "配色2",
          "usage": "深色模式极简玻璃的配色2用于区分主要表面、文字与状态信号。",
          "value": "#111827"
        },
        {
          "id": "sky-glow",
          "name": "配色3",
          "usage": "深色模式极简玻璃的配色3用于区分主要表面、文字与状态信号。",
          "value": "#38BDF8"
        },
        {
          "id": "muted-slate",
          "name": "配色4",
          "usage": "深色模式极简玻璃的配色4用于区分主要表面、文字与状态信号。",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "深色模式极简玻璃重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立奢华的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "y2k-chrome": {
      "id": "y2k-chrome",
      "name": "Y2K铬金属与全息",
      "summary": "Y2K铬金属与全息是在Y2K光泽网页中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "chrome-silver",
          "name": "配色1",
          "usage": "Y2K铬金属与全息的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E2E8F0"
        },
        {
          "id": "holo-magenta",
          "name": "配色2",
          "usage": "Y2K铬金属与全息的配色2用于区分主要表面、文字与状态信号。",
          "value": "#EC4899"
        },
        {
          "id": "electric-violet",
          "name": "配色3",
          "usage": "Y2K铬金属与全息的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8B5CF6"
        },
        {
          "id": "space-navy",
          "name": "配色4",
          "usage": "Y2K铬金属与全息的配色4用于区分主要表面、文字与状态信号。",
          "value": "#0F172A"
        }
      ],
      "characteristics": [
        "Y2K铬金属与全息重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "frutiger-aero": {
      "id": "frutiger-aero",
      "name": "Frutiger Aero水感亮面",
      "summary": "Frutiger Aero水感亮面是在Y2K光泽网页中运用复兴风格原则与乐观氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "sky-cyan",
          "name": "配色1",
          "usage": "Frutiger Aero水感亮面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#38BDF8"
        },
        {
          "id": "aqua-lime",
          "name": "配色2",
          "usage": "Frutiger Aero水感亮面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#4ADE80"
        },
        {
          "id": "gloss-glass",
          "name": "配色3",
          "usage": "Frutiger Aero水感亮面的配色3用于区分主要表面、文字与状态信号。",
          "value": "rgba(255,255,255,0.4)"
        },
        {
          "id": "ocean-blue",
          "name": "配色4",
          "usage": "Frutiger Aero水感亮面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#0284C7"
        }
      ],
      "characteristics": [
        "Frutiger Aero水感亮面重新诠释复兴风格原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立乐观的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "pixel-arcade": {
      "id": "pixel-arcade",
      "name": "8位像素街机",
      "summary": "8位像素街机是在Y2K光泽网页中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "arcade-purple",
          "name": "配色1",
          "usage": "8位像素街机的配色1用于区分主要表面、文字与状态信号。",
          "value": "#2E0854"
        },
        {
          "id": "pixel-gold",
          "name": "配色2",
          "usage": "8位像素街机的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FBBF24"
        },
        {
          "id": "health-green",
          "name": "配色3",
          "usage": "8位像素街机的配色3用于区分主要表面、文字与状态信号。",
          "value": "#22C55E"
        },
        {
          "id": "pixel-red",
          "name": "配色4",
          "usage": "8位像素街机的配色4用于区分主要表面、文字与状态信号。",
          "value": "#EF4444"
        }
      ],
      "characteristics": [
        "8位像素街机重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "像素材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "kinetic-type": {
      "id": "kinetic-type",
      "name": "动态字体与强烈动效",
      "summary": "动态字体与强烈动效是在高科技与动态中运用表现技法原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "hyper-lime",
          "name": "配色1",
          "usage": "动态字体与强烈动效的配色1用于区分主要表面、文字与状态信号。",
          "value": "#CCFF00"
        },
        {
          "id": "pitch-black",
          "name": "配色2",
          "usage": "动态字体与强烈动效的配色2用于区分主要表面、文字与状态信号。",
          "value": "#050505"
        },
        {
          "id": "flash-white",
          "name": "配色3",
          "usage": "动态字体与强烈动效的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "carbon-gray",
          "name": "配色4",
          "usage": "动态字体与强烈动效的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1E1E1E"
        }
      ],
      "characteristics": [
        "动态字体与强烈动效重新诠释表现技法原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "bento-grid": {
      "id": "bento-grid",
      "name": "Bento UI 2.0 精密网格",
      "summary": "Bento UI 2.0 精密网格是在高科技与动态中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "bento-card",
          "name": "配色1",
          "usage": "Bento UI 2.0 精密网格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#161B26"
        },
        {
          "id": "subtle-rim",
          "name": "配色2",
          "usage": "Bento UI 2.0 精密网格的配色2用于区分主要表面、文字与状态信号。",
          "value": "rgba(255,255,255,0.08)"
        },
        {
          "id": "active-indigo",
          "name": "配色3",
          "usage": "Bento UI 2.0 精密网格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#6366F1"
        },
        {
          "id": "data-emerald",
          "name": "配色4",
          "usage": "Bento UI 2.0 精密网格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#10B981"
        }
      ],
      "characteristics": [
        "Bento UI 2.0 精密网格重新诠释界面语言原则。",
        "网格系统谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "acid-techno": {
      "id": "acid-techno",
      "name": "酸性图形与Techno锐舞",
      "summary": "酸性图形与Techno锐舞是在高科技与动态中运用微趋势原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "acid-neon-green",
          "name": "配色1",
          "usage": "酸性图形与Techno锐舞的配色1用于区分主要表面、文字与状态信号。",
          "value": "#39FF14"
        },
        {
          "id": "pure-darkness",
          "name": "配色2",
          "usage": "酸性图形与Techno锐舞的配色2用于区分主要表面、文字与状态信号。",
          "value": "#000000"
        },
        {
          "id": "electric-yellow",
          "name": "配色3",
          "usage": "酸性图形与Techno锐舞的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FFFF33"
        },
        {
          "id": "toxic-purple",
          "name": "配色4",
          "usage": "酸性图形与Techno锐舞的配色4用于区分主要表面、文字与状态信号。",
          "value": "#7928CA"
        }
      ],
      "characteristics": [
        "酸性图形与Techno锐舞重新诠释微趋势原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "claymorphism": {
      "id": "claymorphism",
      "name": "黏土拟态与3D气泡",
      "summary": "黏土拟态与3D气泡是在柔和3D与太阳朋克中运用表现技法原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "clay-peach",
          "name": "配色1",
          "usage": "黏土拟态与3D气泡的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFDDD2"
        },
        {
          "id": "clay-coral",
          "name": "配色2",
          "usage": "黏土拟态与3D气泡的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FF6B4A"
        },
        {
          "id": "clay-teal",
          "name": "配色3",
          "usage": "黏土拟态与3D气泡的配色3用于区分主要表面、文字与状态信号。",
          "value": "#83C5BE"
        },
        {
          "id": "cloud-base",
          "name": "配色4",
          "usage": "黏土拟态与3D气泡的配色4用于区分主要表面、文字与状态信号。",
          "value": "#EDF6F9"
        }
      ],
      "characteristics": [
        "黏土拟态与3D气泡重新诠释表现技法原则。",
        "拟物设计谱系指导版式构成。",
        "黏土材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "handcrafted-indie": {
      "id": "handcrafted-indie",
      "name": "手工独立拼贴",
      "summary": "手工独立拼贴是在柔和3D与太阳朋克中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "kraft-paper",
          "name": "配色1",
          "usage": "手工独立拼贴的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4ECD8"
        },
        {
          "id": "masking-tape",
          "name": "配色2",
          "usage": "手工独立拼贴的配色2用于区分主要表面、文字与状态信号。",
          "value": "rgba(255, 222, 89, 0.7)"
        },
        {
          "id": "stamp-red",
          "name": "配色3",
          "usage": "手工独立拼贴的配色3用于区分主要表面、文字与状态信号。",
          "value": "#B91C1C"
        },
        {
          "id": "pencil-charcoal",
          "name": "配色4",
          "usage": "手工独立拼贴的配色4用于区分主要表面、文字与状态信号。",
          "value": "#2D3748"
        }
      ],
      "characteristics": [
        "手工独立拼贴重新诠释表现技法原则。",
        "独立手作谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "solarpunk-eco": {
      "id": "solarpunk-eco",
      "name": "太阳朋克生态未来主义",
      "summary": "太阳朋克生态未来主义是在柔和3D与太阳朋克中运用思辨样式原则与乐观氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "solar-gold",
          "name": "配色1",
          "usage": "太阳朋克生态未来主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F59E0B"
        },
        {
          "id": "forest-bio",
          "name": "配色2",
          "usage": "太阳朋克生态未来主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#065F46"
        },
        {
          "id": "clean-emerald",
          "name": "配色3",
          "usage": "太阳朋克生态未来主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#10B981"
        },
        {
          "id": "warm-parchment",
          "name": "配色4",
          "usage": "太阳朋克生态未来主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FEF3C7"
        }
      ],
      "characteristics": [
        "太阳朋克生态未来主义重新诠释思辨样式原则。",
        "生态未来主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立乐观的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "bauhaus-geometry": {
      "id": "bauhaus-geometry",
      "name": "包豪斯几何排版",
      "summary": "包豪斯几何排版是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "workshop-cream",
          "name": "配色1",
          "usage": "包豪斯几何排版的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EBD0"
        },
        {
          "id": "signal-red",
          "name": "配色2",
          "usage": "包豪斯几何排版的配色2用于区分主要表面、文字与状态信号。",
          "value": "#C9232C"
        },
        {
          "id": "construction-blue",
          "name": "配色3",
          "usage": "包豪斯几何排版的配色3用于区分主要表面、文字与状态信号。",
          "value": "#174EA6"
        },
        {
          "id": "type-black",
          "name": "配色4",
          "usage": "包豪斯几何排版的配色4用于区分主要表面、文字与状态信号。",
          "value": "#171717"
        }
      ],
      "characteristics": [
        "包豪斯几何排版重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "de-stijl": {
      "id": "de-stijl",
      "name": "风格派新造型主义",
      "summary": "风格派新造型主义是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "gallery-white",
          "name": "配色1",
          "usage": "风格派新造型主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7F5ED"
        },
        {
          "id": "primary-red",
          "name": "配色2",
          "usage": "风格派新造型主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#D0021B"
        },
        {
          "id": "primary-blue",
          "name": "配色3",
          "usage": "风格派新造型主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#0057A8"
        },
        {
          "id": "orthogonal-black",
          "name": "配色4",
          "usage": "风格派新造型主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#111111"
        }
      ],
      "characteristics": [
        "风格派新造型主义重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "flat-design": {
      "id": "flat-design",
      "name": "扁平化设计2.0",
      "summary": "扁平化设计2.0是在国际字体风格中运用界面语言原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "app-blue",
          "name": "配色1",
          "usage": "扁平化设计2.0的配色1用于区分主要表面、文字与状态信号。",
          "value": "#006BB6"
        },
        {
          "id": "state-orange",
          "name": "配色2",
          "usage": "扁平化设计2.0的配色2用于区分主要表面、文字与状态信号。",
          "value": "#C53D00"
        },
        {
          "id": "panel-mist",
          "name": "配色3",
          "usage": "扁平化设计2.0的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E7EEF7"
        },
        {
          "id": "navy-copy",
          "name": "配色4",
          "usage": "扁平化设计2.0的配色4用于区分主要表面、文字与状态信号。",
          "value": "#102A43"
        }
      ],
      "characteristics": [
        "扁平化设计2.0重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "constructivist": {
      "id": "constructivist",
      "name": "建构主义宣传图形",
      "summary": "建构主义宣传图形是在粗野主义中运用历史运动原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "newsprint-cream",
          "name": "配色1",
          "usage": "建构主义宣传图形的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F2E5C8"
        },
        {
          "id": "agit-red",
          "name": "配色2",
          "usage": "建构主义宣传图形的配色2用于区分主要表面、文字与状态信号。",
          "value": "#B9141A"
        },
        {
          "id": "press-black",
          "name": "配色3",
          "usage": "建构主义宣传图形的配色3用于区分主要表面、文字与状态信号。",
          "value": "#1A120E"
        },
        {
          "id": "deep-red",
          "name": "配色4",
          "usage": "建构主义宣传图形的配色4用于区分主要表面、文字与状态信号。",
          "value": "#5C0B0F"
        }
      ],
      "characteristics": [
        "建构主义宣传图形重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "punk-zine": {
      "id": "punk-zine",
      "name": "朋克复印志",
      "summary": "朋克复印志是在粗野主义中运用复兴风格原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "copy-paper",
          "name": "配色1",
          "usage": "朋克复印志的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3F0E8"
        },
        {
          "id": "xerox-black",
          "name": "配色2",
          "usage": "朋克复印志的配色2用于区分主要表面、文字与状态信号。",
          "value": "#111111"
        },
        {
          "id": "staple-red",
          "name": "配色3",
          "usage": "朋克复印志的配色3用于区分主要表面、文字与状态信号。",
          "value": "#A90F32"
        },
        {
          "id": "bruise-violet",
          "name": "配色4",
          "usage": "朋克复印志的配色4用于区分主要表面、文字与状态信号。",
          "value": "#532B78"
        }
      ],
      "characteristics": [
        "朋克复印志重新诠释复兴风格原则。",
        "后现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "material-design": {
      "id": "material-design",
      "name": "Material Design纸张系统",
      "summary": "Material Design纸张系统是在立体与材质中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "surface-white",
          "name": "配色1",
          "usage": "Material Design纸张系统的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "action-blue",
          "name": "配色2",
          "usage": "Material Design纸张系统的配色2用于区分主要表面、文字与状态信号。",
          "value": "#005BBB"
        },
        {
          "id": "state-violet",
          "name": "配色3",
          "usage": "Material Design纸张系统的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8A3FFC"
        },
        {
          "id": "content-ink",
          "name": "配色4",
          "usage": "Material Design纸张系统的配色4用于区分主要表面、文字与状态信号。",
          "value": "#17212B"
        }
      ],
      "characteristics": [
        "Material Design纸张系统重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立专业的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "liquid-glass": {
      "id": "liquid-glass",
      "name": "Liquid Glass界面",
      "summary": "Liquid Glass界面是在立体与材质中运用界面语言原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "deep-content",
          "name": "配色1",
          "usage": "Liquid Glass界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#081A2C"
        },
        {
          "id": "glass-control",
          "name": "配色2",
          "usage": "Liquid Glass界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#102D46"
        },
        {
          "id": "lens-cyan",
          "name": "配色3",
          "usage": "Liquid Glass界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#70D7FF"
        },
        {
          "id": "mint-refraction",
          "name": "配色4",
          "usage": "Liquid Glass界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A5FFDF"
        }
      ],
      "characteristics": [
        "Liquid Glass界面重新诠释界面语言原则。",
        "极简主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "art-deco": {
      "id": "art-deco",
      "name": "装饰艺术机械时代",
      "summary": "装饰艺术机械时代是在复古与流行中运用历史运动原则与奢华氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "lacquer-black",
          "name": "配色1",
          "usage": "装饰艺术机械时代的配色1用于区分主要表面、文字与状态信号。",
          "value": "#15120E"
        },
        {
          "id": "champagne-gold",
          "name": "配色2",
          "usage": "装饰艺术机械时代的配色2用于区分主要表面、文字与状态信号。",
          "value": "#E1C36B"
        },
        {
          "id": "ivory-letter",
          "name": "配色3",
          "usage": "装饰艺术机械时代的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FFF4D6"
        },
        {
          "id": "machine-copper",
          "name": "配色4",
          "usage": "装饰艺术机械时代的配色4用于区分主要表面、文字与状态信号。",
          "value": "#C96D2D"
        }
      ],
      "characteristics": [
        "装饰艺术机械时代重新诠释历史运动原则。",
        "装饰艺术谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立奢华的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "psychedelic-poster": {
      "id": "psychedelic-poster",
      "name": "迷幻海报",
      "summary": "迷幻海报是在复古与流行中运用复兴风格原则与沉浸氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "night-violet",
          "name": "配色1",
          "usage": "迷幻海报的配色1用于区分主要表面、文字与状态信号。",
          "value": "#241044"
        },
        {
          "id": "tangerine-wave",
          "name": "配色2",
          "usage": "迷幻海报的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FF6A00"
        },
        {
          "id": "mint-counter",
          "name": "配色3",
          "usage": "迷幻海报的配色3用于区分主要表面、文字与状态信号。",
          "value": "#63E6BE"
        },
        {
          "id": "sun-yellow",
          "name": "配色4",
          "usage": "迷幻海报的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F7C948"
        }
      ],
      "characteristics": [
        "迷幻海报重新诠释复兴风格原则。",
        "迷幻艺术谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立沉浸的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "art-nouveau": {
      "id": "art-nouveau",
      "name": "新艺术运动鞭线曲线",
      "summary": "新艺术运动鞭线曲线是在编辑与有机中运用历史运动原则与有机材料氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "parchment",
          "name": "配色1",
          "usage": "新艺术运动鞭线曲线的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3E7D5"
        },
        {
          "id": "stem-green",
          "name": "配色2",
          "usage": "新艺术运动鞭线曲线的配色2用于区分主要表面、文字与状态信号。",
          "value": "#356B4B"
        },
        {
          "id": "petal-rose",
          "name": "配色3",
          "usage": "新艺术运动鞭线曲线的配色3用于区分主要表面、文字与状态信号。",
          "value": "#9A3F58"
        },
        {
          "id": "leaf-ink",
          "name": "配色4",
          "usage": "新艺术运动鞭线曲线的配色4用于区分主要表面、文字与状态信号。",
          "value": "#203A2D"
        }
      ],
      "characteristics": [
        "新艺术运动鞭线曲线重新诠释历史运动原则。",
        "新艺术谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立有机材料的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "risograph": {
      "id": "risograph",
      "name": "Risograph编辑风格",
      "summary": "Risograph编辑风格是在编辑与有机中运用表现技法原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "uncoated-paper",
          "name": "配色1",
          "usage": "Risograph编辑风格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EAD4"
        },
        {
          "id": "fluoro-pink",
          "name": "配色2",
          "usage": "Risograph编辑风格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#D92E5B"
        },
        {
          "id": "riso-teal",
          "name": "配色3",
          "usage": "Risograph编辑风格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#00788A"
        },
        {
          "id": "overprint-navy",
          "name": "配色4",
          "usage": "Risograph编辑风格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#172B40"
        }
      ],
      "characteristics": [
        "Risograph编辑风格重新诠释表现技法原则。",
        "孔版印刷谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "metro-interface": {
      "id": "metro-interface",
      "name": "Metro磁贴界面",
      "summary": "Metro磁贴界面是在高科技与动态中运用界面语言原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "panorama-ink",
          "name": "配色1",
          "usage": "Metro磁贴界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#101820"
        },
        {
          "id": "metro-blue",
          "name": "配色2",
          "usage": "Metro磁贴界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0078D4"
        },
        {
          "id": "signal-orange",
          "name": "配色3",
          "usage": "Metro磁贴界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C43E00"
        },
        {
          "id": "type-white",
          "name": "配色4",
          "usage": "Metro磁贴界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "Metro磁贴界面重新诠释界面语言原则。",
        "微软设计谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "ulm-rationalism": {
      "id": "ulm-rationalism",
      "name": "乌尔姆理性主义",
      "summary": "乌尔姆理性主义是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "乌尔姆理性主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3F0E7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "乌尔姆理性主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "乌尔姆理性主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C7392F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "乌尔姆理性主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1E5572"
        }
      ],
      "characteristics": [
        "乌尔姆理性主义重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "swiss-poster": {
      "id": "swiss-poster",
      "name": "瑞士海报",
      "summary": "瑞士海报是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "瑞士海报的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F6F3EA"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "瑞士海报的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "瑞士海报的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E23B2E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "瑞士海报的配色4用于区分主要表面、文字与状态信号。",
          "value": "#164C8C"
        }
      ],
      "characteristics": [
        "瑞士海报重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "dutch-total-design": {
      "id": "dutch-total-design",
      "name": "荷兰整体设计",
      "summary": "荷兰整体设计是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "荷兰整体设计的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F2F5F3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "荷兰整体设计的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "荷兰整体设计的配色3用于区分主要表面、文字与状态信号。",
          "value": "#D12A27"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "荷兰整体设计的配色4用于区分主要表面、文字与状态信号。",
          "value": "#176B62"
        }
      ],
      "characteristics": [
        "荷兰整体设计重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "new-wave-typography": {
      "id": "new-wave-typography",
      "name": "新浪潮排版",
      "summary": "新浪潮排版是在国际字体风格中运用历史运动原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "新浪潮排版的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F8F1DF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "新浪潮排版的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "新浪潮排版的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E6472F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "新浪潮排版的配色4用于区分主要表面、文字与状态信号。",
          "value": "#5546A9"
        }
      ],
      "characteristics": [
        "新浪潮排版重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "modular-grid-system": {
      "id": "modular-grid-system",
      "name": "模块化网格系统",
      "summary": "模块化网格系统是在国际字体风格中运用界面语言原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "模块化网格系统的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7F8F6"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "模块化网格系统的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "模块化网格系统的配色3用于区分主要表面、文字与状态信号。",
          "value": "#1E5C8A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "模块化网格系统的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D84A2F"
        }
      ],
      "characteristics": [
        "模块化网格系统重新诠释界面语言原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "functional-wayfinding": {
      "id": "functional-wayfinding",
      "name": "功能主义导视",
      "summary": "功能主义导视是在国际字体风格中运用界面语言原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "功能主义导视的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F5F4EE"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "功能主义导视的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "功能主义导视的配色3用于区分主要表面、文字与状态信号。",
          "value": "#005F73"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "功能主义导视的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D94829"
        }
      ],
      "characteristics": [
        "功能主义导视重新诠释界面语言原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "japanese-ma-minimal": {
      "id": "japanese-ma-minimal",
      "name": "日式“间”极简主义",
      "summary": "日式“间”极简主义是在国际字体风格中运用界面语言原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "日式“间”极简主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F5F1E8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "日式“间”极简主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "日式“间”极简主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8E2F2A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "日式“间”极简主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#315C52"
        }
      ],
      "characteristics": [
        "日式“间”极简主义重新诠释界面语言原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "scandinavian-functional": {
      "id": "scandinavian-functional",
      "name": "斯堪的纳维亚功能主义",
      "summary": "斯堪的纳维亚功能主义是在国际字体风格中运用界面语言原则与理性氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "斯堪的纳维亚功能主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3F0E8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "斯堪的纳维亚功能主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "斯堪的纳维亚功能主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#2E6F62"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "斯堪的纳维亚功能主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#C54C36"
        }
      ],
      "characteristics": [
        "斯堪的纳维亚功能主义重新诠释界面语言原则。",
        "现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立理性的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证疏朗的信息密度与克制的动效。"
      ]
    },
    "information-isotype": {
      "id": "information-isotype",
      "name": "Isotype信息设计",
      "summary": "Isotype信息设计是在国际字体风格中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Isotype信息设计的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EEDC"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Isotype信息设计的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Isotype信息设计的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C9362B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Isotype信息设计的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1D6284"
        }
      ],
      "characteristics": [
        "Isotype信息设计重新诠释表现技法原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "web-brutalism": {
      "id": "web-brutalism",
      "name": "网页粗野主义",
      "summary": "网页粗野主义是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "网页粗野主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4F4F0"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "网页粗野主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "网页粗野主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#0000EE"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "网页粗野主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D90000"
        }
      ],
      "characteristics": [
        "网页粗野主义重新诠释表现技法原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "anti-design": {
      "id": "anti-design",
      "name": "反设计",
      "summary": "反设计是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "反设计的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFF36D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "反设计的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "反设计的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E1197B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "反设计的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1637D6"
        }
      ],
      "characteristics": [
        "反设计重新诠释表现技法原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "dada-collage": {
      "id": "dada-collage",
      "name": "达达拼贴画",
      "summary": "达达拼贴画是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "达达拼贴画的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EFE5D2"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "达达拼贴画的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9EC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "达达拼贴画的配色3用于区分主要表面、文字与状态信号。",
          "value": "#B51F2A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "达达拼贴画的配色4用于区分主要表面、文字与状态信号。",
          "value": "#245071"
        }
      ],
      "characteristics": [
        "达达拼贴画重新诠释表现技法原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "grunge-typography": {
      "id": "grunge-typography",
      "name": "Grunge排版",
      "summary": "Grunge排版是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Grunge排版的配色1用于区分主要表面、文字与状态信号。",
          "value": "#171310"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Grunge排版的配色2用于区分主要表面、文字与状态信号。",
          "value": "#241E1A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Grunge排版的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E8502E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Grunge排版的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D6B743"
        }
      ],
      "characteristics": [
        "Grunge排版重新诠释表现技法原则。",
        "粗野主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "industrial-stencil": {
      "id": "industrial-stencil",
      "name": "工业模板",
      "summary": "工业模板是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "工业模板的配色1用于区分主要表面、文字与状态信号。",
          "value": "#121516"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "工业模板的配色2用于区分主要表面、文字与状态信号。",
          "value": "#24292A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "工业模板的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F2B705"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "工业模板的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D9432F"
        }
      ],
      "characteristics": [
        "工业模板重新诠释表现技法原则。",
        "粗野主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "monochrome-xerox": {
      "id": "monochrome-xerox",
      "name": "单色复印",
      "summary": "单色复印是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "单色复印的配色1用于区分主要表面、文字与状态信号。",
          "value": "#111111"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "单色复印的配色2用于区分主要表面、文字与状态信号。",
          "value": "#202020"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "单色复印的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F1F1E8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "单色复印的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A8A8A0"
        }
      ],
      "characteristics": [
        "单色复印重新诠释表现技法原则。",
        "粗野主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "glitch-brutalism": {
      "id": "glitch-brutalism",
      "name": "故障艺术粗野主义",
      "summary": "故障艺术粗野主义是在粗野主义中运用表现技法原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "故障艺术粗野主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0D1014"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "故障艺术粗野主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#171C23"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "故障艺术粗野主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#00F0FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "故障艺术粗野主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF2B6A"
        }
      ],
      "characteristics": [
        "故障艺术粗野主义重新诠释表现技法原则。",
        "粗野主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "maximalist-chaos": {
      "id": "maximalist-chaos",
      "name": "极繁混沌",
      "summary": "极繁混沌是在粗野主义中运用微趋势原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "极繁混沌的配色1用于区分主要表面、文字与状态信号。",
          "value": "#15101C"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "极繁混沌的配色2用于区分主要表面、文字与状态信号。",
          "value": "#281D33"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "极繁混沌的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF4E00"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "极繁混沌的配色4用于区分主要表面、文字与状态信号。",
          "value": "#C7FF00"
        }
      ],
      "characteristics": [
        "极繁混沌重新诠释微趋势原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "black-metal-editorial": {
      "id": "black-metal-editorial",
      "name": "黑色金属社论",
      "summary": "黑色金属社论是在粗野主义中运用微趋势原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "黑色金属社论的配色1用于区分主要表面、文字与状态信号。",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "黑色金属社论的配色2用于区分主要表面、文字与状态信号。",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "黑色金属社论的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E8E5DC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "黑色金属社论的配色4用于区分主要表面、文字与状态信号。",
          "value": "#8D1D24"
        }
      ],
      "characteristics": [
        "黑色金属社论重新诠释微趋势原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "concrete-interface": {
      "id": "concrete-interface",
      "name": "混凝土界面",
      "summary": "混凝土界面是在粗野主义中运用微趋势原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "混凝土界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#161819"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "混凝土界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#282B2D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "混凝土界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E3A72F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "混凝土界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#BFC6C8"
        }
      ],
      "characteristics": [
        "混凝土界面重新诠释微趋势原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "paper-cut-layers": {
      "id": "paper-cut-layers",
      "name": "剪纸层",
      "summary": "剪纸层是在立体与材质中运用微趋势原则与反叛氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "剪纸层的配色1用于区分主要表面、文字与状态信号。",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "剪纸层的配色2用于区分主要表面、文字与状态信号。",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "剪纸层的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F97316"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "剪纸层的配色4用于区分主要表面、文字与状态信号。",
          "value": "#38BDF8"
        }
      ],
      "characteristics": [
        "剪纸层重新诠释微趋势原则。",
        "粗野主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立反叛的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与强烈的动效。"
      ]
    },
    "acrylic-ui": {
      "id": "acrylic-ui",
      "name": "亚克力材质界面",
      "summary": "亚克力材质界面是在立体与材质中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "亚克力材质界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E8F0F7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "亚克力材质界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F8FBFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "亚克力材质界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#176B87"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "亚克力材质界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#7C3AED"
        }
      ],
      "characteristics": [
        "亚克力材质界面重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立专业的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "mica-surface": {
      "id": "mica-surface",
      "name": "云母材质",
      "summary": "云母材质是在立体与材质中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "云母材质的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E9EDF3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "云母材质的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F9FAFC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "云母材质的配色3用于区分主要表面、文字与状态信号。",
          "value": "#315F9B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "云母材质的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A43B63"
        }
      ],
      "characteristics": [
        "云母材质重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立专业的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "holographic-foil": {
      "id": "holographic-foil",
      "name": "全息箔",
      "summary": "全息箔是在立体与材质中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "全息箔的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F0EDF7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "全息箔的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "全息箔的配色3用于区分主要表面、文字与状态信号。",
          "value": "#7C3AED"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "全息箔的配色4用于区分主要表面、文字与状态信号。",
          "value": "#008A9A"
        }
      ],
      "characteristics": [
        "全息箔重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立专业的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "chrome-metal-ui": {
      "id": "chrome-metal-ui",
      "name": "铬金属界面",
      "summary": "铬金属界面是在立体与材质中运用界面语言原则与专业氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "铬金属界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E7EBEF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "铬金属界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FAFBFC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "铬金属界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#285E75"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "铬金属界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A2384D"
        }
      ],
      "characteristics": [
        "铬金属界面重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立专业的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "iridescent-mesh": {
      "id": "iridescent-mesh",
      "name": "虹彩渐变网格",
      "summary": "虹彩渐变网格是在立体与材质中运用表现技法原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "虹彩渐变网格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0D1020"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "虹彩渐变网格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#191D31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "虹彩渐变网格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#7C5CFC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "虹彩渐变网格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#24D6C8"
        }
      ],
      "characteristics": [
        "虹彩渐变网格重新诠释表现技法原则。",
        "复古未来主义谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "isometric-depth": {
      "id": "isometric-depth",
      "name": "等距立体层次",
      "summary": "等距立体层次是在立体与材质中运用表现技法原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "等距立体层次的配色1用于区分主要表面、文字与状态信号。",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "等距立体层次的配色2用于区分主要表面、文字与状态信号。",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "等距立体层次的配色3用于区分主要表面、文字与状态信号。",
          "value": "#38BDF8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "等距立体层次的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "等距立体层次重新诠释表现技法原则。",
        "复古未来主义谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "low-poly-interface": {
      "id": "low-poly-interface",
      "name": "低多边形界面",
      "summary": "低多边形界面是在立体与材质中运用表现技法原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "低多边形界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#10151D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "低多边形界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#1C2530"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "低多边形界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "低多边形界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "低多边形界面重新诠释表现技法原则。",
        "复古未来主义谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "soft-plastic": {
      "id": "soft-plastic",
      "name": "软塑料",
      "summary": "软塑料是在立体与材质中运用表现技法原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "软塑料的配色1用于区分主要表面、文字与状态信号。",
          "value": "#171225"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "软塑料的配色2用于区分主要表面、文字与状态信号。",
          "value": "#28203B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "软塑料的配色3用于区分主要表面、文字与状态信号。",
          "value": "#A78BFA"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "软塑料的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "软塑料重新诠释表现技法原则。",
        "复古未来主义谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "embossed-letterpress": {
      "id": "embossed-letterpress",
      "name": "压花凸版印刷",
      "summary": "压花凸版印刷是在立体与材质中运用历史运动原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "压花凸版印刷的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F1E9D8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "压花凸版印刷的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFDF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "压花凸版印刷的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8D3A2D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "压花凸版印刷的配色4用于区分主要表面、文字与状态信号。",
          "value": "#315B55"
        }
      ],
      "characteristics": [
        "压花凸版印刷重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "mid-century-modern": {
      "id": "mid-century-modern",
      "name": "世纪中叶现代主义",
      "summary": "世纪中叶现代主义是在复古与流行中运用历史运动原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "世纪中叶现代主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F1E3C6"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "世纪中叶现代主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF7E8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "世纪中叶现代主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C84D32"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "世纪中叶现代主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#276D67"
        }
      ],
      "characteristics": [
        "世纪中叶现代主义重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "atomic-age": {
      "id": "atomic-age",
      "name": "原子时代",
      "summary": "原子时代是在复古与流行中运用历史运动原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "原子时代的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F5E7C8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "原子时代的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9EA"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "原子时代的配色3用于区分主要表面、文字与状态信号。",
          "value": "#D44936"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "原子时代的配色4用于区分主要表面、文字与状态信号。",
          "value": "#216B78"
        }
      ],
      "characteristics": [
        "原子时代重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "pop-art-halftone": {
      "id": "pop-art-halftone",
      "name": "波普艺术半色调",
      "summary": "波普艺术半色调是在复古与流行中运用历史运动原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "波普艺术半色调的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F8E65B"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "波普艺术半色调的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFBEA"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "波普艺术半色调的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E31B36"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "波普艺术半色调的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1757A6"
        }
      ],
      "characteristics": [
        "波普艺术半色调重新诠释历史运动原则。",
        "现代主义谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "op-art": {
      "id": "op-art",
      "name": "欧普艺术",
      "summary": "欧普艺术是在复古与流行中运用历史运动原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "欧普艺术的配色1用于区分主要表面、文字与状态信号。",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "欧普艺术的配色2用于区分主要表面、文字与状态信号。",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "欧普艺术的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F8F8F2"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "欧普艺术的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF3B30"
        }
      ],
      "characteristics": [
        "欧普艺术重新诠释历史运动原则。",
        "后现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "space-age": {
      "id": "space-age",
      "name": "太空时代",
      "summary": "太空时代是在复古与流行中运用历史运动原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "太空时代的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0C1630"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "太空时代的配色2用于区分主要表面、文字与状态信号。",
          "value": "#162445"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "太空时代的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF7A59"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "太空时代的配色4用于区分主要表面、文字与状态信号。",
          "value": "#63E6E2"
        }
      ],
      "characteristics": [
        "太空时代重新诠释历史运动原则。",
        "后现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "disco-glam": {
      "id": "disco-glam",
      "name": "迪斯科华丽风",
      "summary": "迪斯科华丽风是在复古与流行中运用历史运动原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "迪斯科华丽风的配色1用于区分主要表面、文字与状态信号。",
          "value": "#180D25"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "迪斯科华丽风的配色2用于区分主要表面、文字与状态信号。",
          "value": "#2A1740"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "迪斯科华丽风的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "迪斯科华丽风的配色4用于区分主要表面、文字与状态信号。",
          "value": "#EC4899"
        }
      ],
      "characteristics": [
        "迪斯科华丽风重新诠释历史运动原则。",
        "后现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "seventies-groovy": {
      "id": "seventies-groovy",
      "name": "1970年代律动风",
      "summary": "1970年代律动风是在复古与流行中运用历史运动原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "1970年代律动风的配色1用于区分主要表面、文字与状态信号。",
          "value": "#25150E"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "1970年代律动风的配色2用于区分主要表面、文字与状态信号。",
          "value": "#382319"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "1970年代律动风的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F07A24"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "1970年代律动风的配色4用于区分主要表面、文字与状态信号。",
          "value": "#B8C33D"
        }
      ],
      "characteristics": [
        "1970年代律动风重新诠释历史运动原则。",
        "后现代主义谱系指导版式构成。",
        "平面材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "eighties-new-wave": {
      "id": "eighties-new-wave",
      "name": "80年代新浪潮",
      "summary": "80年代新浪潮是在复古与流行中运用复兴风格原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "80年代新浪潮的配色1用于区分主要表面、文字与状态信号。",
          "value": "#101225"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "80年代新浪潮的配色2用于区分主要表面、文字与状态信号。",
          "value": "#1C2040"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "80年代新浪潮的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF3D81"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "80年代新浪潮的配色4用于区分主要表面、文字与状态信号。",
          "value": "#36E2E2"
        }
      ],
      "characteristics": [
        "80年代新浪潮重新诠释复兴风格原则。",
        "后现代主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "retro-computing": {
      "id": "retro-computing",
      "name": "复古计算",
      "summary": "复古计算是在复古与流行中运用复兴风格原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "复古计算的配色1用于区分主要表面、文字与状态信号。",
          "value": "#08130F"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "复古计算的配色2用于区分主要表面、文字与状态信号。",
          "value": "#10221A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "复古计算的配色3用于区分主要表面、文字与状态信号。",
          "value": "#7CFF8A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "复古计算的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F5C451"
        }
      ],
      "characteristics": [
        "复古计算重新诠释复兴风格原则。",
        "后现代主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "pulp-comic": {
      "id": "pulp-comic",
      "name": "纸浆漫画",
      "summary": "纸浆漫画是在复古与流行中运用复兴风格原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "纸浆漫画的配色1用于区分主要表面、文字与状态信号。",
          "value": "#1B1110"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "纸浆漫画的配色2用于区分主要表面、文字与状态信号。",
          "value": "#2D1D19"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "纸浆漫画的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F3C640"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "纸浆漫画的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D93232"
        }
      ],
      "characteristics": [
        "纸浆漫画重新诠释复兴风格原则。",
        "后现代主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "newspaper-broadsheet": {
      "id": "newspaper-broadsheet",
      "name": "大报版式",
      "summary": "大报版式是在编辑与有机中运用复兴风格原则与活力氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "大报版式的配色1用于区分主要表面、文字与状态信号。",
          "value": "#151515"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "大报版式的配色2用于区分主要表面、文字与状态信号。",
          "value": "#222222"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "大报版式的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F2EDE0"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "大报版式的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D24A35"
        }
      ],
      "characteristics": [
        "大报版式重新诠释复兴风格原则。",
        "后现代主义谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立活力的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "literary-journal": {
      "id": "literary-journal",
      "name": "文学期刊",
      "summary": "文学期刊是在编辑与有机中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "文学期刊的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3EFE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "文学期刊的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFCF6"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "文学期刊的配色3用于区分主要表面、文字与状态信号。",
          "value": "#7A302F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "文学期刊的配色4用于区分主要表面、文字与状态信号。",
          "value": "#385C55"
        }
      ],
      "characteristics": [
        "文学期刊重新诠释界面语言原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与无的动效。"
      ]
    },
    "academic-modern": {
      "id": "academic-modern",
      "name": "学术现代主义",
      "summary": "学术现代主义是在编辑与有机中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "学术现代主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F5F6F3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "学术现代主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "学术现代主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#215F78"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "学术现代主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#9A4B2D"
        }
      ],
      "characteristics": [
        "学术现代主义重新诠释界面语言原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与无的动效。"
      ]
    },
    "archival-museum": {
      "id": "archival-museum",
      "name": "馆藏档案风格",
      "summary": "馆藏档案风格是在编辑与有机中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "馆藏档案风格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EEECE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "馆藏档案风格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FAF9F6"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "馆藏档案风格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#4C5F75"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "馆藏档案风格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#8C4F3D"
        }
      ],
      "characteristics": [
        "馆藏档案风格重新诠释界面语言原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与无的动效。"
      ]
    },
    "photobook-minimal": {
      "id": "photobook-minimal",
      "name": "极简摄影集",
      "summary": "极简摄影集是在编辑与有机中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "极简摄影集的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7F7F4"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "极简摄影集的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "极简摄影集的配色3用于区分主要表面、文字与状态信号。",
          "value": "#2E5266"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "极简摄影集的配色4用于区分主要表面、文字与状态信号。",
          "value": "#9A483A"
        }
      ],
      "characteristics": [
        "极简摄影集重新诠释界面语言原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与无的动效。"
      ]
    },
    "botanical-editorial": {
      "id": "botanical-editorial",
      "name": "植物学编辑风格",
      "summary": "植物学编辑风格是在编辑与有机中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "植物学编辑风格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EFEBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "植物学编辑风格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FAF8F0"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "植物学编辑风格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#3F6C4B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "植物学编辑风格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A44A3F"
        }
      ],
      "characteristics": [
        "植物学编辑风格重新诠释表现技法原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "wabi-sabi-paper": {
      "id": "wabi-sabi-paper",
      "name": "侘寂纸张",
      "summary": "侘寂纸张是在编辑与有机中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "侘寂纸张的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E9E1D2"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "侘寂纸张的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F8F4EB"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "侘寂纸张的配色3用于区分主要表面、文字与状态信号。",
          "value": "#725547"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "侘寂纸张的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3F6559"
        }
      ],
      "characteristics": [
        "侘寂纸张重新诠释表现技法原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "collage-magazine": {
      "id": "collage-magazine",
      "name": "拼贴画杂志",
      "summary": "拼贴画杂志是在编辑与有机中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "拼贴画杂志的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F2E6D4"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "拼贴画杂志的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF8EC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "拼贴画杂志的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C83F49"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "拼贴画杂志的配色4用于区分主要表面、文字与状态信号。",
          "value": "#287078"
        }
      ],
      "characteristics": [
        "拼贴画杂志重新诠释表现技法原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "typographic-poster": {
      "id": "typographic-poster",
      "name": "排版海报",
      "summary": "排版海报是在编辑与有机中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "排版海报的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "排版海报的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "排版海报的配色3用于区分主要表面、文字与状态信号。",
          "value": "#B9342E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "排版海报的配色4用于区分主要表面、文字与状态信号。",
          "value": "#235D73"
        }
      ],
      "characteristics": [
        "排版海报重新诠释表现技法原则。",
        "编辑设计谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于印刷场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "luxury-serif-minimal": {
      "id": "luxury-serif-minimal",
      "name": "奢华衬线极简主义",
      "summary": "奢华衬线极简主义是在编辑与有机中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "奢华衬线极简主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EFE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "奢华衬线极简主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFCF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "奢华衬线极简主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#7A2638"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "奢华衬线极简主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#8A6337"
        }
      ],
      "characteristics": [
        "奢华衬线极简主义重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "early-web": {
      "id": "early-web",
      "name": "早期网页",
      "summary": "早期网页是在Y2K光泽网页中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "早期网页的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F2F2EE"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "早期网页的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "早期网页的配色3用于区分主要表面、文字与状态信号。",
          "value": "#0000CC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "早期网页的配色4用于区分主要表面、文字与状态信号。",
          "value": "#B00000"
        }
      ],
      "characteristics": [
        "早期网页重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "geocities-maximal": {
      "id": "geocities-maximal",
      "name": "GeoCities极繁主义",
      "summary": "GeoCities极繁主义是在Y2K光泽网页中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "GeoCities极繁主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFF36A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "GeoCities极繁主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "GeoCities极繁主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#D719A4"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "GeoCities极繁主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#1648D8"
        }
      ],
      "characteristics": [
        "GeoCities极繁主义重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "aqua-desktop": {
      "id": "aqua-desktop",
      "name": "Aqua桌面",
      "summary": "Aqua桌面是在Y2K光泽网页中运用复兴风格原则与怀旧氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Aqua桌面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EAF6FF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Aqua桌面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Aqua桌面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#147BC2"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Aqua桌面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#6E3FC7"
        }
      ],
      "characteristics": [
        "Aqua桌面重新诠释复兴风格原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于网页界面场景。",
        "有助于建立怀旧的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "luna-desktop": {
      "id": "luna-desktop",
      "name": "Luna桌面",
      "summary": "Luna桌面是在Y2K光泽网页中运用复兴风格原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Luna桌面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#E7EEF8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Luna桌面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FAFCFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Luna桌面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#275FB5"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Luna桌面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3F8C43"
        }
      ],
      "characteristics": [
        "Luna桌面重新诠释复兴风格原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "web2-gloss": {
      "id": "web2-gloss",
      "name": "Web 2.0高光质感",
      "summary": "Web 2.0高光质感是在Y2K光泽网页中运用复兴风格原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Web 2.0高光质感的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EEF6FA"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Web 2.0高光质感的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Web 2.0高光质感的配色3用于区分主要表面、文字与状态信号。",
          "value": "#137FB3"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Web 2.0高光质感的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D54C32"
        }
      ],
      "characteristics": [
        "Web 2.0高光质感重新诠释复兴风格原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "flash-portal": {
      "id": "flash-portal",
      "name": "Flash门户",
      "summary": "Flash门户是在Y2K光泽网页中运用复兴风格原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Flash门户的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EEF1F7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Flash门户的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Flash门户的配色3用于区分主要表面、文字与状态信号。",
          "value": "#5B45B9"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Flash门户的配色4用于区分主要表面、文字与状态信号。",
          "value": "#D04473"
        }
      ],
      "characteristics": [
        "Flash门户重新诠释复兴风格原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "blogspot-collage": {
      "id": "blogspot-collage",
      "name": "Blogspot拼贴",
      "summary": "Blogspot拼贴是在Y2K光泽网页中运用复兴风格原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Blogspot拼贴的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3EBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Blogspot拼贴的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFDF8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Blogspot拼贴的配色3用于区分主要表面、文字与状态信号。",
          "value": "#A23A4B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Blogspot拼贴的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3A6F7B"
        }
      ],
      "characteristics": [
        "Blogspot拼贴重新诠释复兴风格原则。",
        "拟物设计谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "cyber-y2k": {
      "id": "cyber-y2k",
      "name": "赛博Y2K",
      "summary": "赛博Y2K是在Y2K光泽网页中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "赛博Y2K的配色1用于区分主要表面、文字与状态信号。",
          "value": "#080B13"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "赛博Y2K的配色2用于区分主要表面、文字与状态信号。",
          "value": "#151A28"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "赛博Y2K的配色3用于区分主要表面、文字与状态信号。",
          "value": "#28E1D1"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "赛博Y2K的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A855F7"
        }
      ],
      "characteristics": [
        "赛博Y2K重新诠释微趋势原则。",
        "网络文化谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "kawaii-pixel-web": {
      "id": "kawaii-pixel-web",
      "name": "可爱像素网页",
      "summary": "可爱像素网页是在Y2K光泽网页中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "可爱像素网页的配色1用于区分主要表面、文字与状态信号。",
          "value": "#171126"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "可爱像素网页的配色2用于区分主要表面、文字与状态信号。",
          "value": "#281C3D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "可爱像素网页的配色3用于区分主要表面、文字与状态信号。",
          "value": "#FF78B7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "可爱像素网页的配色4用于区分主要表面、文字与状态信号。",
          "value": "#62E5DF"
        }
      ],
      "characteristics": [
        "可爱像素网页重新诠释微趋势原则。",
        "网络文化谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "scene-core-web": {
      "id": "scene-core-web",
      "name": "Scene-core网页",
      "summary": "Scene-core网页是在Y2K光泽网页中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Scene-core网页的配色1用于区分主要表面、文字与状态信号。",
          "value": "#120E1C"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Scene-core网页的配色2用于区分主要表面、文字与状态信号。",
          "value": "#24182E"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Scene-core网页的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C7FF00"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Scene-core网页的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF3DA1"
        }
      ],
      "characteristics": [
        "Scene-core网页重新诠释微趋势原则。",
        "网络文化谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "mcbling-gloss": {
      "id": "mcbling-gloss",
      "name": "McBling光泽",
      "summary": "McBling光泽是在Y2K光泽网页中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "McBling光泽的配色1用于区分主要表面、文字与状态信号。",
          "value": "#1A0E18"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "McBling光泽的配色2用于区分主要表面、文字与状态信号。",
          "value": "#301A2B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "McBling光泽的配色3用于区分主要表面、文字与状态信号。",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "McBling光泽的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F062B2"
        }
      ],
      "characteristics": [
        "McBling光泽重新诠释微趋势原则。",
        "网络文化谱系指导版式构成。",
        "金属材质塑造视觉层级。"
      ],
      "pros": [
        "适用于平面设计场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证极繁的信息密度与富有表现力的动效。"
      ]
    },
    "tech-optimism-2000": {
      "id": "tech-optimism-2000",
      "name": "2000年代科技乐观主义",
      "summary": "2000年代科技乐观主义是在Y2K光泽网页中运用界面语言原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "2000年代科技乐观主义的配色1用于区分主要表面、文字与状态信号。",
          "value": "#081528"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "2000年代科技乐观主义的配色2用于区分主要表面、文字与状态信号。",
          "value": "#102743"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "2000年代科技乐观主义的配色3用于区分主要表面、文字与状态信号。",
          "value": "#34D5E8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "2000年代科技乐观主义的配色4用于区分主要表面、文字与状态信号。",
          "value": "#8FE35F"
        }
      ],
      "characteristics": [
        "2000年代科技乐观主义重新诠释界面语言原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "cyberpunk-tactical-hud": {
      "id": "cyberpunk-tactical-hud",
      "name": "赛博朋克HUD",
      "summary": "赛博朋克HUD是在高科技与动态中运用界面语言原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "赛博朋克HUD的配色1用于区分主要表面、文字与状态信号。",
          "value": "#060B0E"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "赛博朋克HUD的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0E171B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "赛博朋克HUD的配色3用于区分主要表面、文字与状态信号。",
          "value": "#00E5C7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "赛博朋克HUD的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF4655"
        }
      ],
      "characteristics": [
        "赛博朋克HUD重新诠释界面语言原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "sci-fi-fui": {
      "id": "sci-fi-fui",
      "name": "科幻FUI",
      "summary": "科幻FUI是在高科技与动态中运用界面语言原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "科幻FUI的配色1用于区分主要表面、文字与状态信号。",
          "value": "#071019"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "科幻FUI的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0E1E2A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "科幻FUI的配色3用于区分主要表面、文字与状态信号。",
          "value": "#46C6FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "科幻FUI的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FFB347"
        }
      ],
      "characteristics": [
        "科幻FUI重新诠释界面语言原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "terminal-matrix": {
      "id": "terminal-matrix",
      "name": "终端矩阵",
      "summary": "终端矩阵是在高科技与动态中运用界面语言原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "终端矩阵的配色1用于区分主要表面、文字与状态信号。",
          "value": "#050A07"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "终端矩阵的配色2用于区分主要表面、文字与状态信号。",
          "value": "#0B1510"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "终端矩阵的配色3用于区分主要表面、文字与状态信号。",
          "value": "#5CFF79"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "终端矩阵的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F4D35E"
        }
      ],
      "characteristics": [
        "终端矩阵重新诠释界面语言原则。",
        "网络文化谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与富有表现力的动效。"
      ]
    },
    "data-dense-dashboard": {
      "id": "data-dense-dashboard",
      "name": "高密度数据仪表板",
      "summary": "高密度数据仪表板是在高科技与动态中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "高密度数据仪表板的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0B1220"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "高密度数据仪表板的配色2用于区分主要表面、文字与状态信号。",
          "value": "#151F31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "高密度数据仪表板的配色3用于区分主要表面、文字与状态信号。",
          "value": "#4CC9F0"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "高密度数据仪表板的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "高密度数据仪表板重新诠释界面语言原则。",
        "网格系统谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "real-time-monitor": {
      "id": "real-time-monitor",
      "name": "实时监控",
      "summary": "实时监控是在高科技与动态中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "实时监控的配色1用于区分主要表面、文字与状态信号。",
          "value": "#08131A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "实时监控的配色2用于区分主要表面、文字与状态信号。",
          "value": "#10242D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "实时监控的配色3用于区分主要表面、文字与状态信号。",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "实时监控的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "实时监控重新诠释界面语言原则。",
        "网格系统谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "chromatic-aberration": {
      "id": "chromatic-aberration",
      "name": "色差RGB分割",
      "summary": "色差RGB分割是在高科技与动态中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "色差RGB分割的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0B0D18"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "色差RGB分割的配色2用于区分主要表面、文字与状态信号。",
          "value": "#171A2A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "色差RGB分割的配色3用于区分主要表面、文字与状态信号。",
          "value": "#33D6FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "色差RGB分割的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF3E91"
        }
      ],
      "characteristics": [
        "色差RGB分割重新诠释界面语言原则。",
        "网格系统谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "generative-grid": {
      "id": "generative-grid",
      "name": "生成式网格",
      "summary": "生成式网格是在高科技与动态中运用界面语言原则与精确氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "生成式网格的配色1用于区分主要表面、文字与状态信号。",
          "value": "#09131F"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "生成式网格的配色2用于区分主要表面、文字与状态信号。",
          "value": "#132238"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "生成式网格的配色3用于区分主要表面、文字与状态信号。",
          "value": "#64E572"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "生成式网格的配色4用于区分主要表面、文字与状态信号。",
          "value": "#F4C95D"
        }
      ],
      "characteristics": [
        "生成式网格重新诠释界面语言原则。",
        "网格系统谱系指导版式构成。",
        "发光屏幕材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立精确的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证高密度的信息密度与克制的动效。"
      ]
    },
    "biometric-interface": {
      "id": "biometric-interface",
      "name": "生物识别界面",
      "summary": "生物识别界面是在高科技与动态中运用思辨样式原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "生物识别界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#07131A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "生物识别界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#102630"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "生物识别界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#35E3C1"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "生物识别界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#6CA8FF"
        }
      ],
      "characteristics": [
        "生物识别界面重新诠释思辨样式原则。",
        "复古未来主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "spatial-glass-ui": {
      "id": "spatial-glass-ui",
      "name": "空间玻璃界面",
      "summary": "空间玻璃界面是在高科技与动态中运用思辨样式原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "空间玻璃界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#08101D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "空间玻璃界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#121F31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "空间玻璃界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#79D7FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "空间玻璃界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#A78BFA"
        }
      ],
      "characteristics": [
        "空间玻璃界面重新诠释思辨样式原则。",
        "复古未来主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "ai-native-gradient": {
      "id": "ai-native-gradient",
      "name": "AI原生渐变",
      "summary": "AI原生渐变是在高科技与动态中运用思辨样式原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "AI原生渐变的配色1用于区分主要表面、文字与状态信号。",
          "value": "#0D1022"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "AI原生渐变的配色2用于区分主要表面、文字与状态信号。",
          "value": "#191C35"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "AI原生渐变的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8B7CFF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "AI原生渐变的配色4用于区分主要表面、文字与状态信号。",
          "value": "#38D9C5"
        }
      ],
      "characteristics": [
        "AI原生渐变重新诠释思辨样式原则。",
        "复古未来主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "quantum-control": {
      "id": "quantum-control",
      "name": "量子控制",
      "summary": "量子控制是在高科技与动态中运用思辨样式原则与未来感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "量子控制的配色1用于区分主要表面、文字与状态信号。",
          "value": "#080C1B"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "量子控制的配色2用于区分主要表面、文字与状态信号。",
          "value": "#121A32"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "量子控制的配色3用于区分主要表面、文字与状态信号。",
          "value": "#58E0FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "量子控制的配色4用于区分主要表面、文字与状态信号。",
          "value": "#FF74C8"
        }
      ],
      "characteristics": [
        "量子控制重新诠释思辨样式原则。",
        "复古未来主义谱系指导版式构成。",
        "玻璃材质塑造视觉层级。"
      ],
      "pros": [
        "适用于产品界面场景。",
        "有助于建立未来感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "inflatable-ui": {
      "id": "inflatable-ui",
      "name": "充气式UI",
      "summary": "充气式UI是在柔和3D与太阳朋克中运用界面语言原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "充气式UI的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7EAF1"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "充气式UI的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "充气式UI的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E35D9A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "充气式UI的配色4用于区分主要表面、文字与状态信号。",
          "value": "#4279C6"
        }
      ],
      "characteristics": [
        "充气式UI重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "toy-block-ui": {
      "id": "toy-block-ui",
      "name": "玩具积木UI",
      "summary": "玩具积木UI是在柔和3D与太阳朋克中运用界面语言原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "玩具积木UI的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4EFD9"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "玩具积木UI的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFDF3"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "玩具积木UI的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E45D3F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "玩具积木UI的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3277B7"
        }
      ],
      "characteristics": [
        "玩具积木UI重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "kawaii-pastel": {
      "id": "kawaii-pastel",
      "name": "卡哇伊粉彩",
      "summary": "卡哇伊粉彩是在柔和3D与太阳朋克中运用界面语言原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "卡哇伊粉彩的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F8EAF1"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "卡哇伊粉彩的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "卡哇伊粉彩的配色3用于区分主要表面、文字与状态信号。",
          "value": "#D85F98"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "卡哇伊粉彩的配色4用于区分主要表面、文字与状态信号。",
          "value": "#5284C8"
        }
      ],
      "characteristics": [
        "卡哇伊粉彩重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "sticker-book": {
      "id": "sticker-book",
      "name": "贴纸书",
      "summary": "贴纸书是在柔和3D与太阳朋克中运用界面语言原则与亲和氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "贴纸书的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F7F0D8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "贴纸书的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "贴纸书的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E95843"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "贴纸书的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3978B9"
        }
      ],
      "characteristics": [
        "贴纸书重新诠释界面语言原则。",
        "拟物设计谱系指导版式构成。",
        "塑料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于3D场景。",
        "有助于建立亲和的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "doodle-interface": {
      "id": "doodle-interface",
      "name": "涂鸦界面",
      "summary": "涂鸦界面是在柔和3D与太阳朋克中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "涂鸦界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F4ECDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "涂鸦界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "涂鸦界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#C84D3F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "涂鸦界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3C7081"
        }
      ],
      "characteristics": [
        "涂鸦界面重新诠释表现技法原则。",
        "独立手作谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "papercraft-ui": {
      "id": "papercraft-ui",
      "name": "纸艺界面",
      "summary": "纸艺界面是在柔和3D与太阳朋克中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "纸艺界面的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F2E8D5"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "纸艺界面的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "纸艺界面的配色3用于区分主要表面、文字与状态信号。",
          "value": "#D85B42"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "纸艺界面的配色4用于区分主要表面、文字与状态信号。",
          "value": "#397777"
        }
      ],
      "characteristics": [
        "纸艺界面重新诠释表现技法原则。",
        "独立手作谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "cozy-knit": {
      "id": "cozy-knit",
      "name": "温馨针织",
      "summary": "温馨针织是在柔和3D与太阳朋克中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "温馨针织的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F0E5D7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "温馨针织的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FCF8F1"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "温馨针织的配色3用于区分主要表面、文字与状态信号。",
          "value": "#A54B45"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "温馨针织的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3F7368"
        }
      ],
      "characteristics": [
        "温馨针织重新诠释表现技法原则。",
        "独立手作谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "dreamcore-cloud": {
      "id": "dreamcore-cloud",
      "name": "梦核云境",
      "summary": "梦核云境是在柔和3D与太阳朋克中运用表现技法原则与触感氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "梦核云境的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EEEAF3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "梦核云境的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FBF9FD"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "梦核云境的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8A5FA8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "梦核云境的配色4用于区分主要表面、文字与状态信号。",
          "value": "#4D7FA3"
        }
      ],
      "characteristics": [
        "梦核云境重新诠释表现技法原则。",
        "独立手作谱系指导版式构成。",
        "纸张材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立触感的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与克制的动效。"
      ]
    },
    "kidcore-play": {
      "id": "kidcore-play",
      "name": "Kidcore童趣",
      "summary": "Kidcore童趣是在柔和3D与太阳朋克中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Kidcore童趣的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFF0C7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Kidcore童趣的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9E8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Kidcore童趣的配色3用于区分主要表面、文字与状态信号。",
          "value": "#E84B3C"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Kidcore童趣的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3578C5"
        }
      ],
      "characteristics": [
        "Kidcore童趣重新诠释微趋势原则。",
        "有机现代主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "biomorphic-soft": {
      "id": "biomorphic-soft",
      "name": "柔和仿生形态",
      "summary": "柔和仿生形态是在柔和3D与太阳朋克中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "柔和仿生形态的配色1用于区分主要表面、文字与状态信号。",
          "value": "#EAF2E7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "柔和仿生形态的配色2用于区分主要表面、文字与状态信号。",
          "value": "#F9FCF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "柔和仿生形态的配色3用于区分主要表面、文字与状态信号。",
          "value": "#3F8B67"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "柔和仿生形态的配色4用于区分主要表面、文字与状态信号。",
          "value": "#C35F68"
        }
      ],
      "characteristics": [
        "柔和仿生形态重新诠释微趋势原则。",
        "有机现代主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "pastel-gradient": {
      "id": "pastel-gradient",
      "name": "粉彩渐变",
      "summary": "粉彩渐变是在柔和3D与太阳朋克中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "粉彩渐变的配色1用于区分主要表面、文字与状态信号。",
          "value": "#F3EDF7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "粉彩渐变的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9FD"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "粉彩渐变的配色3用于区分主要表面、文字与状态信号。",
          "value": "#8B63B7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "粉彩渐变的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3F819A"
        }
      ],
      "characteristics": [
        "粉彩渐变重新诠释微趋势原则。",
        "有机现代主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    },
    "cartoon-dashboard": {
      "id": "cartoon-dashboard",
      "name": "卡通仪表板",
      "summary": "卡通仪表板是在柔和3D与太阳朋克中运用微趋势原则与趣味氛围的实用界面设计方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "卡通仪表板的配色1用于区分主要表面、文字与状态信号。",
          "value": "#FFF0D0"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "卡通仪表板的配色2用于区分主要表面、文字与状态信号。",
          "value": "#FFF9E9"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "卡通仪表板的配色3用于区分主要表面、文字与状态信号。",
          "value": "#DF553D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "卡通仪表板的配色4用于区分主要表面、文字与状态信号。",
          "value": "#3476B8"
        }
      ],
      "characteristics": [
        "卡通仪表板重新诠释微趋势原则。",
        "有机现代主义谱系指导版式构成。",
        "有机材料材质塑造视觉层级。"
      ],
      "pros": [
        "适用于插画场景。",
        "有助于建立趣味的产品语气。"
      ],
      "cons": [
        "应结合目标用户验证均衡的信息密度与富有表现力的动效。"
      ]
    }
  },
  "categories": {
    "swiss": {
      "id": "swiss",
      "title": "国际字体风格",
      "description": "国际字体风格汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "brutalism": {
      "id": "brutalism",
      "title": "粗野主义",
      "description": "粗野主义汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "depth": {
      "id": "depth",
      "title": "立体与材质",
      "description": "立体与材质汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "retro": {
      "id": "retro",
      "title": "复古与流行",
      "description": "复古与流行汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "editorial": {
      "id": "editorial",
      "title": "编辑与有机",
      "description": "编辑与有机汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "y2k": {
      "id": "y2k",
      "title": "Y2K光泽网页",
      "description": "Y2K光泽网页汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "hypertech": {
      "id": "hypertech",
      "title": "高科技与动态",
      "description": "高科技与动态汇集相关设计运动、界面语言、材料与制作语境。"
    },
    "soft3d": {
      "id": "soft3d",
      "title": "柔和3D与太阳朋克",
      "description": "柔和3D与太阳朋克汇集相关设计运动、界面语言、材料与制作语境。"
    }
  },
  "facets": {
    "kind": {
      "id": "kind",
      "label": "样式类型",
      "values": {
        "historical-movement": "历史运动",
        "revival": "复兴风格",
        "technique": "表现技法",
        "interface-language": "界面语言",
        "microtrend": "微趋势",
        "speculative": "思辨样式"
      }
    },
    "era": {
      "id": "era",
      "label": "时代",
      "values": {
        "pre-1950": "1950年以前",
        "1950s-1970s": "1950至1970年代",
        "1980s-1990s": "1980至1990年代",
        "2000s": "2000年代",
        "2010s": "2010年代",
        "2020s": "2020年代",
        "timeless": "跨越时代"
      }
    },
    "lineage": {
      "id": "lineage",
      "label": "设计谱系",
      "values": {
        "modernism": "现代主义",
        "international-style": "国际字体样式",
        "minimalism": "极简主义",
        "brutalism": "粗野主义",
        "skeuomorphism": "拟物设计",
        "postmodernism": "后现代主义",
        "retrofuturism": "复古未来主义",
        "editorial": "编辑设计",
        "organic-modernism": "有机现代主义",
        "cyberculture": "网络文化",
        "grid-systems": "网格系统",
        "indie-craft": "独立手作",
        "eco-futurism": "生态未来主义",
        "bauhaus": "包豪斯",
        "de-stijl": "风格派",
        "flat-design": "扁平设计",
        "constructivism": "构成主义",
        "punk-diy": "朋克DIY",
        "material-design": "材料设计",
        "liquid-glass": "液态玻璃",
        "art-deco": "装饰艺术",
        "psychedelia": "迷幻艺术",
        "art-nouveau": "新艺术",
        "risograph-print": "孔版印刷",
        "microsoft-design": "微软设计"
      }
    },
    "media": {
      "id": "media",
      "label": "媒介",
      "values": {
        "graphic": "平面设计",
        "print": "印刷",
        "web-ui": "网页界面",
        "product-ui": "产品界面",
        "illustration": "插画",
        "three-d": "3D"
      }
    },
    "materiality": {
      "id": "materiality",
      "label": "质感与材料",
      "values": {
        "flat": "平面",
        "glass": "玻璃",
        "paper": "纸张",
        "ink": "油墨",
        "metal": "金属",
        "plastic": "塑料",
        "pixel": "像素",
        "clay": "黏土",
        "organic": "有机材料",
        "screen": "发光屏幕"
      }
    },
    "density": {
      "id": "density",
      "label": "信息密度",
      "values": {
        "sparse": "疏朗",
        "balanced": "均衡",
        "dense": "高密度",
        "maximal": "极繁"
      }
    },
    "tone": {
      "id": "tone",
      "label": "氛围",
      "values": {
        "rational": "理性",
        "precise": "精确",
        "professional": "专业",
        "rebellious": "反叛",
        "playful": "趣味",
        "futuristic": "未来感",
        "tactile": "触感",
        "nostalgic": "怀旧",
        "luxurious": "奢华",
        "organic": "有机材料",
        "immersive": "沉浸",
        "energetic": "活力",
        "friendly": "亲和",
        "optimistic": "乐观"
      }
    },
    "motion": {
      "id": "motion",
      "label": "动效强度",
      "values": {
        "none": "无",
        "restrained": "克制",
        "expressive": "富有表现力",
        "intense": "强烈"
      }
    },
    "region": {
      "id": "region",
      "label": "地区与文化",
      "values": {
        "international": "国际",
        "europe": "欧洲",
        "north-america": "北美",
        "latin-america": "拉丁美洲",
        "east-asia": "东亚",
        "south-asia": "南亚",
        "africa": "非洲",
        "middle-east": "中东",
        "oceania": "大洋洲",
        "global-internet": "全球网络文化"
      }
    },
    "maturity": {
      "id": "maturity",
      "label": "成熟度",
      "values": {
        "canonical": "经典",
        "established": "成熟",
        "emerging": "新兴",
        "experimental": "实验性"
      }
    }
  }
};

export default Object.freeze(applySimplifiedChineseEditorialReview(catalog));
