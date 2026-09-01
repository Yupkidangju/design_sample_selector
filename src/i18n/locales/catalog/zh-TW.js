import { applyTraditionalChineseEditorialReview } from './zhTWEditorial.js';

// Stage 1 명시 콘텐츠 기준선. Stage 2 편집 감수는 locale 전용 profile을 적용한다.
const catalog = {
  "styles": {
    "swiss-grid": {
      "id": "swiss-grid",
      "name": "以網格為核心的現代主義",
      "summary": "以網格為核心的現代主義是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas-white",
          "name": "配色1",
          "usage": "以網格為核心的現代主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4F4F0"
        },
        {
          "id": "deep-ink",
          "name": "配色2",
          "usage": "以網格為核心的現代主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#111111"
        },
        {
          "id": "swiss-red",
          "name": "配色3",
          "usage": "以網格為核心的現代主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF3300"
        },
        {
          "id": "neutral-gray",
          "name": "配色4",
          "usage": "以網格為核心的現代主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#666666"
        }
      ],
      "characteristics": [
        "以網格為核心的現代主義重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。",
        "以網格為核心的現代主義明確記錄了維持一致實作所需的補充構圖規則。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。",
        "保留以網格為核心的現代主義的層級後，可用於更廣泛的製作環境。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。",
        "套用以網格為核心的現代主義時，需要同時檢查內容長度與可讀性。"
      ]
    },
    "corporate-minimal": {
      "id": "corporate-minimal",
      "name": "企業極簡主義",
      "summary": "企業極簡主義是在國際字體風格中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "pure-white",
          "name": "配色1",
          "usage": "企業極簡主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "slate-dark",
          "name": "配色2",
          "usage": "企業極簡主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0F172A"
        },
        {
          "id": "trust-blue",
          "name": "配色3",
          "usage": "企業極簡主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#2563EB"
        },
        {
          "id": "soft-gray",
          "name": "配色4",
          "usage": "企業極簡主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "企業極簡主義重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立專業的產品語氣。",
        "保留企業極簡主義的層級後，可用於更廣泛的製作環境。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "high-contrast-mono": {
      "id": "high-contrast-mono",
      "name": "高對比等寬字體",
      "summary": "高對比等寬字體是在國際字體風格中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "terminal-black",
          "name": "配色1",
          "usage": "高對比等寬字體的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#050505"
        },
        {
          "id": "pure-white",
          "name": "配色2",
          "usage": "高對比等寬字體的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "neon-terminal",
          "name": "配色3",
          "usage": "高對比等寬字體的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#00FF66"
        },
        {
          "id": "dim-gray",
          "name": "配色4",
          "usage": "高對比等寬字體的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#333333"
        }
      ],
      "characteristics": [
        "高對比等寬字體重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "raw-brutalism": {
      "id": "raw-brutalism",
      "name": "原生數位粗野主義",
      "summary": "原生數位粗野主義是在粗獷主義中運用復興風格原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "raw-yellow",
          "name": "配色1",
          "usage": "原生數位粗野主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFF00"
        },
        {
          "id": "harsh-black",
          "name": "配色2",
          "usage": "原生數位粗野主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#000000"
        },
        {
          "id": "hot-pink",
          "name": "配色3",
          "usage": "原生數位粗野主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF0055"
        },
        {
          "id": "stark-white",
          "name": "配色4",
          "usage": "原生數位粗野主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "原生數位粗野主義重新詮釋復興風格原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "neo-brutalism": {
      "id": "neo-brutalism",
      "name": "潮流新粗野主義",
      "summary": "潮流新粗野主義是在粗獷主義中運用復興風格原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "pop-yellow",
          "name": "配色1",
          "usage": "潮流新粗野主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FEF08A"
        },
        {
          "id": "soft-sky",
          "name": "配色2",
          "usage": "潮流新粗野主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#BFDBFE"
        },
        {
          "id": "slate-ink",
          "name": "配色3",
          "usage": "潮流新粗野主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#1E293B"
        },
        {
          "id": "coral-pop",
          "name": "配色4",
          "usage": "潮流新粗野主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F43F5E"
        }
      ],
      "characteristics": [
        "潮流新粗野主義重新詮釋復興風格原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "cyber-brutalism": {
      "id": "cyber-brutalism",
      "name": "賽博粗野主義",
      "summary": "賽博粗野主義是在粗獷主義中運用微趨勢原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "abyss-dark",
          "name": "配色1",
          "usage": "賽博粗野主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0D0E15"
        },
        {
          "id": "cyber-cyan",
          "name": "配色2",
          "usage": "賽博粗野主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#00F0FF"
        },
        {
          "id": "neon-pink",
          "name": "配色3",
          "usage": "賽博粗野主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF007A"
        },
        {
          "id": "grid-blue",
          "name": "配色4",
          "usage": "賽博粗野主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1F2438"
        }
      ],
      "characteristics": [
        "賽博粗野主義重新詮釋微趨勢原則。",
        "粗獷主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與強烈的動效。"
      ]
    },
    "glassmorphism": {
      "id": "glassmorphism",
      "name": "霧面玻璃擬態",
      "summary": "霧面玻璃擬態是在立體與材質中運用表現技法原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "glass-frost",
          "name": "配色1",
          "usage": "霧面玻璃擬態的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "rgba(255,255,255,0.12)"
        },
        {
          "id": "deep-space",
          "name": "配色2",
          "usage": "霧面玻璃擬態的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0F172A"
        },
        {
          "id": "glow-indigo",
          "name": "配色3",
          "usage": "霧面玻璃擬態的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#818CF8"
        },
        {
          "id": "crystal-white",
          "name": "配色4",
          "usage": "霧面玻璃擬態的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#E0E7FF"
        }
      ],
      "characteristics": [
        "霧面玻璃擬態重新詮釋表現技法原則。",
        "極簡主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "neumorphism": {
      "id": "neumorphism",
      "name": "柔和新擬態",
      "summary": "柔和新擬態是在立體與材質中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "soft-surface",
          "name": "配色1",
          "usage": "柔和新擬態的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E0E5EC"
        },
        {
          "id": "highlight-shadow",
          "name": "配色2",
          "usage": "柔和新擬態的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "dark-shadow",
          "name": "配色3",
          "usage": "柔和新擬態的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#A3B1C6"
        },
        {
          "id": "tactile-accent",
          "name": "配色4",
          "usage": "柔和新擬態的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#4F46E5"
        }
      ],
      "characteristics": [
        "柔和新擬態重新詮釋表現技法原則。",
        "極簡主義譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "skeuomorphism": {
      "id": "skeuomorphism",
      "name": "現代擬物化 2.0",
      "summary": "現代擬物化 2.0是在立體與材質中運用介面語言原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "brushed-charcoal",
          "name": "配色1",
          "usage": "現代擬物化 2.0的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#1E1E24"
        },
        {
          "id": "metallic-gray",
          "name": "配色2",
          "usage": "現代擬物化 2.0的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#2D2D35"
        },
        {
          "id": "amber-indicator",
          "name": "配色3",
          "usage": "現代擬物化 2.0的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF9F1C"
        },
        {
          "id": "led-emerald",
          "name": "配色4",
          "usage": "現代擬物化 2.0的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#4CB944"
        }
      ],
      "characteristics": [
        "現代擬物化 2.0重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "memphis": {
      "id": "memphis",
      "name": "孟菲斯普普設計",
      "summary": "孟菲斯普普設計是在復古與流行中運用歷史運動原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "memphis-pink",
          "name": "配色1",
          "usage": "孟菲斯普普設計的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FF70A6"
        },
        {
          "id": "peach-coral",
          "name": "配色2",
          "usage": "孟菲斯普普設計的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FF9770"
        },
        {
          "id": "sunshine-yellow",
          "name": "配色3",
          "usage": "孟菲斯普普設計的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FFD670"
        },
        {
          "id": "sky-cyan",
          "name": "配色4",
          "usage": "孟菲斯普普設計的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#70D6FF"
        }
      ],
      "characteristics": [
        "孟菲斯普普設計重新詮釋歷史運動原則。",
        "後現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "synthwave": {
      "id": "synthwave",
      "name": "80年代合成波",
      "summary": "80年代合成波是在復古與流行中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "synth-purple",
          "name": "配色1",
          "usage": "80年代合成波的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#1A0B2E"
        },
        {
          "id": "neon-magenta",
          "name": "配色2",
          "usage": "80年代合成波的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FF007F"
        },
        {
          "id": "electric-cyan",
          "name": "配色3",
          "usage": "80年代合成波的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#00F5FF"
        },
        {
          "id": "sunset-gold",
          "name": "配色4",
          "usage": "80年代合成波的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FFDD00"
        }
      ],
      "characteristics": [
        "80年代合成波重新詮釋復興風格原則。",
        "復古未來主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與強烈的動效。"
      ]
    },
    "vaporwave": {
      "id": "vaporwave",
      "name": "蒸氣波舒緩風",
      "summary": "蒸氣波舒緩風是在復古與流行中運用微趨勢原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "vapor-lavender",
          "name": "配色1",
          "usage": "蒸氣波舒緩風的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#D8B4F8"
        },
        {
          "id": "pastel-yellow",
          "name": "配色2",
          "usage": "蒸氣波舒緩風的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F9F871"
        },
        {
          "id": "chill-violet",
          "name": "配色3",
          "usage": "蒸氣波舒緩風的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#845EC2"
        },
        {
          "id": "retro-mint",
          "name": "配色4",
          "usage": "蒸氣波舒緩風的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#00C9A7"
        }
      ],
      "characteristics": [
        "蒸氣波舒緩風重新詮釋微趨勢原則。",
        "後現代主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "high-fashion": {
      "id": "high-fashion",
      "name": "高級時尚編輯風格",
      "summary": "高級時尚編輯風格是在編輯與有機中運用介面語言原則與奢華氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "midnight-ink",
          "name": "配色1",
          "usage": "高級時尚編輯風格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0A0A0A"
        },
        {
          "id": "ivory-soft",
          "name": "配色2",
          "usage": "高級時尚編輯風格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F5F5F0"
        },
        {
          "id": "champagne-gold",
          "name": "配色3",
          "usage": "高級時尚編輯風格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C5A880"
        },
        {
          "id": "warm-charcoal",
          "name": "配色4",
          "usage": "高級時尚編輯風格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1C1C1E"
        }
      ],
      "characteristics": [
        "高級時尚編輯風格重新詮釋介面語言原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立奢華的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與無的動效。"
      ]
    },
    "fluid-organic": {
      "id": "fluid-organic",
      "name": "流線有機形態與暖色調",
      "summary": "流線有機形態與暖色調是在編輯與有機中運用表現技法原則與有機材料氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "warm-clay",
          "name": "配色1",
          "usage": "流線有機形態與暖色調的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7F4EF"
        },
        {
          "id": "forest-pine",
          "name": "配色2",
          "usage": "流線有機形態與暖色調的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#2C3E35"
        },
        {
          "id": "terracotta",
          "name": "配色3",
          "usage": "流線有機形態與暖色調的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E07A5F"
        },
        {
          "id": "sage-green",
          "name": "配色4",
          "usage": "流線有機形態與暖色調的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#81B29A"
        }
      ],
      "characteristics": [
        "流線有機形態與暖色調重新詮釋表現技法原則。",
        "有機現代主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立有機材料的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "dark-minimal-glass": {
      "id": "dark-minimal-glass",
      "name": "深色模式極簡玻璃",
      "summary": "深色模式極簡玻璃是在編輯與有機中運用介面語言原則與奢華氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "abyss-background",
          "name": "配色1",
          "usage": "深色模式極簡玻璃的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0B0F19"
        },
        {
          "id": "card-surface",
          "name": "配色2",
          "usage": "深色模式極簡玻璃的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#111827"
        },
        {
          "id": "sky-glow",
          "name": "配色3",
          "usage": "深色模式極簡玻璃的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#38BDF8"
        },
        {
          "id": "muted-slate",
          "name": "配色4",
          "usage": "深色模式極簡玻璃的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "深色模式極簡玻璃重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立奢華的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "y2k-chrome": {
      "id": "y2k-chrome",
      "name": "Y2K鉻金屬與全像",
      "summary": "Y2K鉻金屬與全像是在Y2K光澤網頁中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "chrome-silver",
          "name": "配色1",
          "usage": "Y2K鉻金屬與全像的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E2E8F0"
        },
        {
          "id": "holo-magenta",
          "name": "配色2",
          "usage": "Y2K鉻金屬與全像的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#EC4899"
        },
        {
          "id": "electric-violet",
          "name": "配色3",
          "usage": "Y2K鉻金屬與全像的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8B5CF6"
        },
        {
          "id": "space-navy",
          "name": "配色4",
          "usage": "Y2K鉻金屬與全像的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#0F172A"
        }
      ],
      "characteristics": [
        "Y2K鉻金屬與全像重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "frutiger-aero": {
      "id": "frutiger-aero",
      "name": "Frutiger Aero水感亮面",
      "summary": "Frutiger Aero水感亮面是在Y2K光澤網頁中運用復興風格原則與樂觀氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "sky-cyan",
          "name": "配色1",
          "usage": "Frutiger Aero水感亮面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#38BDF8"
        },
        {
          "id": "aqua-lime",
          "name": "配色2",
          "usage": "Frutiger Aero水感亮面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#4ADE80"
        },
        {
          "id": "gloss-glass",
          "name": "配色3",
          "usage": "Frutiger Aero水感亮面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "rgba(255,255,255,0.4)"
        },
        {
          "id": "ocean-blue",
          "name": "配色4",
          "usage": "Frutiger Aero水感亮面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#0284C7"
        }
      ],
      "characteristics": [
        "Frutiger Aero水感亮面重新詮釋復興風格原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立樂觀的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "pixel-arcade": {
      "id": "pixel-arcade",
      "name": "8位元像素街機",
      "summary": "8位元像素街機是在Y2K光澤網頁中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "arcade-purple",
          "name": "配色1",
          "usage": "8位元像素街機的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#2E0854"
        },
        {
          "id": "pixel-gold",
          "name": "配色2",
          "usage": "8位元像素街機的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FBBF24"
        },
        {
          "id": "health-green",
          "name": "配色3",
          "usage": "8位元像素街機的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#22C55E"
        },
        {
          "id": "pixel-red",
          "name": "配色4",
          "usage": "8位元像素街機的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#EF4444"
        }
      ],
      "characteristics": [
        "8位元像素街機重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "像素材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "kinetic-type": {
      "id": "kinetic-type",
      "name": "動態字體與強烈動效",
      "summary": "動態字體與強烈動效是在高科技與動態中運用表現技法原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "hyper-lime",
          "name": "配色1",
          "usage": "動態字體與強烈動效的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#CCFF00"
        },
        {
          "id": "pitch-black",
          "name": "配色2",
          "usage": "動態字體與強烈動效的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#050505"
        },
        {
          "id": "flash-white",
          "name": "配色3",
          "usage": "動態字體與強烈動效的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "carbon-gray",
          "name": "配色4",
          "usage": "動態字體與強烈動效的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1E1E1E"
        }
      ],
      "characteristics": [
        "動態字體與強烈動效重新詮釋表現技法原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "bento-grid": {
      "id": "bento-grid",
      "name": "Bento UI 2.0 精密網格",
      "summary": "Bento UI 2.0 精密網格是在高科技與動態中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "bento-card",
          "name": "配色1",
          "usage": "Bento UI 2.0 精密網格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#161B26"
        },
        {
          "id": "subtle-rim",
          "name": "配色2",
          "usage": "Bento UI 2.0 精密網格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "rgba(255,255,255,0.08)"
        },
        {
          "id": "active-indigo",
          "name": "配色3",
          "usage": "Bento UI 2.0 精密網格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#6366F1"
        },
        {
          "id": "data-emerald",
          "name": "配色4",
          "usage": "Bento UI 2.0 精密網格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#10B981"
        }
      ],
      "characteristics": [
        "Bento UI 2.0 精密網格重新詮釋介面語言原則。",
        "網格系統譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "acid-techno": {
      "id": "acid-techno",
      "name": "酸性圖形與Techno銳舞",
      "summary": "酸性圖形與Techno銳舞是在高科技與動態中運用微趨勢原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "acid-neon-green",
          "name": "配色1",
          "usage": "酸性圖形與Techno銳舞的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#39FF14"
        },
        {
          "id": "pure-darkness",
          "name": "配色2",
          "usage": "酸性圖形與Techno銳舞的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#000000"
        },
        {
          "id": "electric-yellow",
          "name": "配色3",
          "usage": "酸性圖形與Techno銳舞的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFF33"
        },
        {
          "id": "toxic-purple",
          "name": "配色4",
          "usage": "酸性圖形與Techno銳舞的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#7928CA"
        }
      ],
      "characteristics": [
        "酸性圖形與Techno銳舞重新詮釋微趨勢原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "claymorphism": {
      "id": "claymorphism",
      "name": "黏土擬態與3D氣泡",
      "summary": "黏土擬態與3D氣泡是在柔和3D與太陽龐克中運用表現技法原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "clay-peach",
          "name": "配色1",
          "usage": "黏土擬態與3D氣泡的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFDDD2"
        },
        {
          "id": "clay-coral",
          "name": "配色2",
          "usage": "黏土擬態與3D氣泡的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FF6B4A"
        },
        {
          "id": "clay-teal",
          "name": "配色3",
          "usage": "黏土擬態與3D氣泡的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#83C5BE"
        },
        {
          "id": "cloud-base",
          "name": "配色4",
          "usage": "黏土擬態與3D氣泡的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#EDF6F9"
        }
      ],
      "characteristics": [
        "黏土擬態與3D氣泡重新詮釋表現技法原則。",
        "擬物設計譜系引導版面構成。",
        "黏土材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "handcrafted-indie": {
      "id": "handcrafted-indie",
      "name": "手工獨立拼貼",
      "summary": "手工獨立拼貼是在柔和3D與太陽龐克中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "kraft-paper",
          "name": "配色1",
          "usage": "手工獨立拼貼的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4ECD8"
        },
        {
          "id": "masking-tape",
          "name": "配色2",
          "usage": "手工獨立拼貼的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "rgba(255, 222, 89, 0.7)"
        },
        {
          "id": "stamp-red",
          "name": "配色3",
          "usage": "手工獨立拼貼的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#B91C1C"
        },
        {
          "id": "pencil-charcoal",
          "name": "配色4",
          "usage": "手工獨立拼貼的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#2D3748"
        }
      ],
      "characteristics": [
        "手工獨立拼貼重新詮釋表現技法原則。",
        "獨立手作譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "solarpunk-eco": {
      "id": "solarpunk-eco",
      "name": "太陽龐克生態未來主義",
      "summary": "太陽龐克生態未來主義是在柔和3D與太陽龐克中運用思辨樣式原則與樂觀氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "solar-gold",
          "name": "配色1",
          "usage": "太陽龐克生態未來主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F59E0B"
        },
        {
          "id": "forest-bio",
          "name": "配色2",
          "usage": "太陽龐克生態未來主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#065F46"
        },
        {
          "id": "clean-emerald",
          "name": "配色3",
          "usage": "太陽龐克生態未來主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#10B981"
        },
        {
          "id": "warm-parchment",
          "name": "配色4",
          "usage": "太陽龐克生態未來主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FEF3C7"
        }
      ],
      "characteristics": [
        "太陽龐克生態未來主義重新詮釋思辨樣式原則。",
        "生態未來主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立樂觀的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "bauhaus-geometry": {
      "id": "bauhaus-geometry",
      "name": "包浩斯幾何排版",
      "summary": "包浩斯幾何排版是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "workshop-cream",
          "name": "配色1",
          "usage": "包浩斯幾何排版的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EBD0"
        },
        {
          "id": "signal-red",
          "name": "配色2",
          "usage": "包浩斯幾何排版的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#C9232C"
        },
        {
          "id": "construction-blue",
          "name": "配色3",
          "usage": "包浩斯幾何排版的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#174EA6"
        },
        {
          "id": "type-black",
          "name": "配色4",
          "usage": "包浩斯幾何排版的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#171717"
        }
      ],
      "characteristics": [
        "包浩斯幾何排版重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "de-stijl": {
      "id": "de-stijl",
      "name": "風格派新造形主義",
      "summary": "風格派新造形主義是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "gallery-white",
          "name": "配色1",
          "usage": "風格派新造形主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7F5ED"
        },
        {
          "id": "primary-red",
          "name": "配色2",
          "usage": "風格派新造形主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#D0021B"
        },
        {
          "id": "primary-blue",
          "name": "配色3",
          "usage": "風格派新造形主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#0057A8"
        },
        {
          "id": "orthogonal-black",
          "name": "配色4",
          "usage": "風格派新造形主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#111111"
        }
      ],
      "characteristics": [
        "風格派新造形主義重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "flat-design": {
      "id": "flat-design",
      "name": "扁平化設計2.0",
      "summary": "扁平化設計2.0是在國際字體風格中運用介面語言原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "app-blue",
          "name": "配色1",
          "usage": "扁平化設計2.0的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#006BB6"
        },
        {
          "id": "state-orange",
          "name": "配色2",
          "usage": "扁平化設計2.0的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#C53D00"
        },
        {
          "id": "panel-mist",
          "name": "配色3",
          "usage": "扁平化設計2.0的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E7EEF7"
        },
        {
          "id": "navy-copy",
          "name": "配色4",
          "usage": "扁平化設計2.0的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#102A43"
        }
      ],
      "characteristics": [
        "扁平化設計2.0重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "constructivist": {
      "id": "constructivist",
      "name": "構成主義宣傳圖像",
      "summary": "構成主義宣傳圖像是在粗獷主義中運用歷史運動原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "newsprint-cream",
          "name": "配色1",
          "usage": "構成主義宣傳圖像的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F2E5C8"
        },
        {
          "id": "agit-red",
          "name": "配色2",
          "usage": "構成主義宣傳圖像的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#B9141A"
        },
        {
          "id": "press-black",
          "name": "配色3",
          "usage": "構成主義宣傳圖像的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#1A120E"
        },
        {
          "id": "deep-red",
          "name": "配色4",
          "usage": "構成主義宣傳圖像的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#5C0B0F"
        }
      ],
      "characteristics": [
        "構成主義宣傳圖像重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "punk-zine": {
      "id": "punk-zine",
      "name": "龐克影印誌",
      "summary": "龐克影印誌是在粗獷主義中運用復興風格原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "copy-paper",
          "name": "配色1",
          "usage": "龐克影印誌的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3F0E8"
        },
        {
          "id": "xerox-black",
          "name": "配色2",
          "usage": "龐克影印誌的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#111111"
        },
        {
          "id": "staple-red",
          "name": "配色3",
          "usage": "龐克影印誌的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#A90F32"
        },
        {
          "id": "bruise-violet",
          "name": "配色4",
          "usage": "龐克影印誌的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#532B78"
        }
      ],
      "characteristics": [
        "龐克影印誌重新詮釋復興風格原則。",
        "後現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "material-design": {
      "id": "material-design",
      "name": "Material Design紙張系統",
      "summary": "Material Design紙張系統是在立體與材質中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "surface-white",
          "name": "配色1",
          "usage": "Material Design紙張系統的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "action-blue",
          "name": "配色2",
          "usage": "Material Design紙張系統的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#005BBB"
        },
        {
          "id": "state-violet",
          "name": "配色3",
          "usage": "Material Design紙張系統的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8A3FFC"
        },
        {
          "id": "content-ink",
          "name": "配色4",
          "usage": "Material Design紙張系統的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#17212B"
        }
      ],
      "characteristics": [
        "Material Design紙張系統重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立專業的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "liquid-glass": {
      "id": "liquid-glass",
      "name": "Liquid Glass介面",
      "summary": "Liquid Glass介面是在立體與材質中運用介面語言原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "deep-content",
          "name": "配色1",
          "usage": "Liquid Glass介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#081A2C"
        },
        {
          "id": "glass-control",
          "name": "配色2",
          "usage": "Liquid Glass介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#102D46"
        },
        {
          "id": "lens-cyan",
          "name": "配色3",
          "usage": "Liquid Glass介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#70D7FF"
        },
        {
          "id": "mint-refraction",
          "name": "配色4",
          "usage": "Liquid Glass介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A5FFDF"
        }
      ],
      "characteristics": [
        "Liquid Glass介面重新詮釋介面語言原則。",
        "極簡主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "art-deco": {
      "id": "art-deco",
      "name": "裝飾藝術機械時代",
      "summary": "裝飾藝術機械時代是在復古與流行中運用歷史運動原則與奢華氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "lacquer-black",
          "name": "配色1",
          "usage": "裝飾藝術機械時代的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#15120E"
        },
        {
          "id": "champagne-gold",
          "name": "配色2",
          "usage": "裝飾藝術機械時代的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#E1C36B"
        },
        {
          "id": "ivory-letter",
          "name": "配色3",
          "usage": "裝飾藝術機械時代的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF4D6"
        },
        {
          "id": "machine-copper",
          "name": "配色4",
          "usage": "裝飾藝術機械時代的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#C96D2D"
        }
      ],
      "characteristics": [
        "裝飾藝術機械時代重新詮釋歷史運動原則。",
        "裝飾藝術譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立奢華的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "psychedelic-poster": {
      "id": "psychedelic-poster",
      "name": "迷幻海報",
      "summary": "迷幻海報是在復古與流行中運用復興風格原則與沉浸氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "night-violet",
          "name": "配色1",
          "usage": "迷幻海報的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#241044"
        },
        {
          "id": "tangerine-wave",
          "name": "配色2",
          "usage": "迷幻海報的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FF6A00"
        },
        {
          "id": "mint-counter",
          "name": "配色3",
          "usage": "迷幻海報的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#63E6BE"
        },
        {
          "id": "sun-yellow",
          "name": "配色4",
          "usage": "迷幻海報的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F7C948"
        }
      ],
      "characteristics": [
        "迷幻海報重新詮釋復興風格原則。",
        "迷幻藝術譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立沉浸的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "art-nouveau": {
      "id": "art-nouveau",
      "name": "新藝術運動鞭線曲線",
      "summary": "新藝術運動鞭線曲線是在編輯與有機中運用歷史運動原則與有機材料氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "parchment",
          "name": "配色1",
          "usage": "新藝術運動鞭線曲線的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3E7D5"
        },
        {
          "id": "stem-green",
          "name": "配色2",
          "usage": "新藝術運動鞭線曲線的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#356B4B"
        },
        {
          "id": "petal-rose",
          "name": "配色3",
          "usage": "新藝術運動鞭線曲線的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#9A3F58"
        },
        {
          "id": "leaf-ink",
          "name": "配色4",
          "usage": "新藝術運動鞭線曲線的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#203A2D"
        }
      ],
      "characteristics": [
        "新藝術運動鞭線曲線重新詮釋歷史運動原則。",
        "新藝術譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立有機材料的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "risograph": {
      "id": "risograph",
      "name": "Risograph編輯風格",
      "summary": "Risograph編輯風格是在編輯與有機中運用表現技法原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "uncoated-paper",
          "name": "配色1",
          "usage": "Risograph編輯風格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EAD4"
        },
        {
          "id": "fluoro-pink",
          "name": "配色2",
          "usage": "Risograph編輯風格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#D92E5B"
        },
        {
          "id": "riso-teal",
          "name": "配色3",
          "usage": "Risograph編輯風格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#00788A"
        },
        {
          "id": "overprint-navy",
          "name": "配色4",
          "usage": "Risograph編輯風格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#172B40"
        }
      ],
      "characteristics": [
        "Risograph編輯風格重新詮釋表現技法原則。",
        "孔版印刷譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "metro-interface": {
      "id": "metro-interface",
      "name": "Metro動態磚介面",
      "summary": "Metro動態磚介面是在高科技與動態中運用介面語言原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "panorama-ink",
          "name": "配色1",
          "usage": "Metro動態磚介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#101820"
        },
        {
          "id": "metro-blue",
          "name": "配色2",
          "usage": "Metro動態磚介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0078D4"
        },
        {
          "id": "signal-orange",
          "name": "配色3",
          "usage": "Metro動態磚介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C43E00"
        },
        {
          "id": "type-white",
          "name": "配色4",
          "usage": "Metro動態磚介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "Metro動態磚介面重新詮釋介面語言原則。",
        "微軟設計譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "ulm-rationalism": {
      "id": "ulm-rationalism",
      "name": "烏爾姆理性主義",
      "summary": "烏爾姆理性主義是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "烏爾姆理性主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3F0E7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "烏爾姆理性主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "烏爾姆理性主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C7392F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "烏爾姆理性主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1E5572"
        }
      ],
      "characteristics": [
        "烏爾姆理性主義重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "swiss-poster": {
      "id": "swiss-poster",
      "name": "瑞士海報",
      "summary": "瑞士海報是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "瑞士海報的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F6F3EA"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "瑞士海報的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "瑞士海報的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E23B2E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "瑞士海報的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#164C8C"
        }
      ],
      "characteristics": [
        "瑞士海報重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "dutch-total-design": {
      "id": "dutch-total-design",
      "name": "荷蘭總體設計",
      "summary": "荷蘭總體設計是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "荷蘭總體設計的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F2F5F3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "荷蘭總體設計的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "荷蘭總體設計的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#D12A27"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "荷蘭總體設計的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#176B62"
        }
      ],
      "characteristics": [
        "荷蘭總體設計重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "new-wave-typography": {
      "id": "new-wave-typography",
      "name": "新浪潮排版",
      "summary": "新浪潮排版是在國際字體風格中運用歷史運動原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "新浪潮排版的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F8F1DF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "新浪潮排版的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "新浪潮排版的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E6472F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "新浪潮排版的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#5546A9"
        }
      ],
      "characteristics": [
        "新浪潮排版重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "modular-grid-system": {
      "id": "modular-grid-system",
      "name": "模組化網格系統",
      "summary": "模組化網格系統是在國際字體風格中運用介面語言原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "模組化網格系統的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7F8F6"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "模組化網格系統的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "模組化網格系統的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#1E5C8A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "模組化網格系統的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D84A2F"
        }
      ],
      "characteristics": [
        "模組化網格系統重新詮釋介面語言原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "functional-wayfinding": {
      "id": "functional-wayfinding",
      "name": "功能主義導視",
      "summary": "功能主義導視是在國際字體風格中運用介面語言原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "功能主義導視的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F5F4EE"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "功能主義導視的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "功能主義導視的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#005F73"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "功能主義導視的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D94829"
        }
      ],
      "characteristics": [
        "功能主義導視重新詮釋介面語言原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "japanese-ma-minimal": {
      "id": "japanese-ma-minimal",
      "name": "日式「間」極簡主義",
      "summary": "日式「間」極簡主義是在國際字體風格中運用介面語言原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "日式「間」極簡主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F5F1E8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "日式「間」極簡主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "日式「間」極簡主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8E2F2A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "日式「間」極簡主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#315C52"
        }
      ],
      "characteristics": [
        "日式「間」極簡主義重新詮釋介面語言原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "scandinavian-functional": {
      "id": "scandinavian-functional",
      "name": "斯堪地納維亞功能主義",
      "summary": "斯堪地納維亞功能主義是在國際字體風格中運用介面語言原則與理性氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "斯堪地納維亞功能主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3F0E8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "斯堪地納維亞功能主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "斯堪地納維亞功能主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#2E6F62"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "斯堪地納維亞功能主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#C54C36"
        }
      ],
      "characteristics": [
        "斯堪地納維亞功能主義重新詮釋介面語言原則。",
        "現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立理性的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證疏朗的資訊密度與克制的動效。"
      ]
    },
    "information-isotype": {
      "id": "information-isotype",
      "name": "Isotype資訊設計",
      "summary": "Isotype資訊設計是在國際字體風格中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Isotype資訊設計的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EEDC"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Isotype資訊設計的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Isotype資訊設計的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C9362B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Isotype資訊設計的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1D6284"
        }
      ],
      "characteristics": [
        "Isotype資訊設計重新詮釋表現技法原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "web-brutalism": {
      "id": "web-brutalism",
      "name": "網頁粗野主義",
      "summary": "網頁粗野主義是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "網頁粗野主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4F4F0"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "網頁粗野主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "網頁粗野主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#0000EE"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "網頁粗野主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D90000"
        }
      ],
      "characteristics": [
        "網頁粗野主義重新詮釋表現技法原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "anti-design": {
      "id": "anti-design",
      "name": "反設計",
      "summary": "反設計是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "反設計的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF36D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "反設計的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "反設計的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E1197B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "反設計的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1637D6"
        }
      ],
      "characteristics": [
        "反設計重新詮釋表現技法原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "dada-collage": {
      "id": "dada-collage",
      "name": "達達拼貼",
      "summary": "達達拼貼是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "達達拼貼的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EFE5D2"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "達達拼貼的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9EC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "達達拼貼的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#B51F2A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "達達拼貼的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#245071"
        }
      ],
      "characteristics": [
        "達達拼貼重新詮釋表現技法原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "grunge-typography": {
      "id": "grunge-typography",
      "name": "Grunge排版",
      "summary": "Grunge排版是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Grunge排版的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#171310"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Grunge排版的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#241E1A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Grunge排版的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E8502E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Grunge排版的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D6B743"
        }
      ],
      "characteristics": [
        "Grunge排版重新詮釋表現技法原則。",
        "粗獷主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "industrial-stencil": {
      "id": "industrial-stencil",
      "name": "工業模板",
      "summary": "工業模板是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "工業模板的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#121516"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "工業模板的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#24292A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "工業模板的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F2B705"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "工業模板的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D9432F"
        }
      ],
      "characteristics": [
        "工業模板重新詮釋表現技法原則。",
        "粗獷主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "monochrome-xerox": {
      "id": "monochrome-xerox",
      "name": "單色影印",
      "summary": "單色影印是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "單色影印的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#111111"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "單色影印的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#202020"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "單色影印的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F1F1E8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "單色影印的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A8A8A0"
        }
      ],
      "characteristics": [
        "單色影印重新詮釋表現技法原則。",
        "粗獷主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "glitch-brutalism": {
      "id": "glitch-brutalism",
      "name": "故障藝術粗野主義",
      "summary": "故障藝術粗野主義是在粗獷主義中運用表現技法原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "故障藝術粗野主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0D1014"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "故障藝術粗野主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#171C23"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "故障藝術粗野主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#00F0FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "故障藝術粗野主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF2B6A"
        }
      ],
      "characteristics": [
        "故障藝術粗野主義重新詮釋表現技法原則。",
        "粗獷主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "maximalist-chaos": {
      "id": "maximalist-chaos",
      "name": "極繁混沌",
      "summary": "極繁混沌是在粗獷主義中運用微趨勢原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "極繁混沌的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#15101C"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "極繁混沌的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#281D33"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "極繁混沌的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF4E00"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "極繁混沌的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#C7FF00"
        }
      ],
      "characteristics": [
        "極繁混沌重新詮釋微趨勢原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "black-metal-editorial": {
      "id": "black-metal-editorial",
      "name": "黑金屬編輯風格",
      "summary": "黑金屬編輯風格是在粗獷主義中運用微趨勢原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "黑金屬編輯風格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "黑金屬編輯風格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "黑金屬編輯風格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E8E5DC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "黑金屬編輯風格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#8D1D24"
        }
      ],
      "characteristics": [
        "黑金屬編輯風格重新詮釋微趨勢原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "concrete-interface": {
      "id": "concrete-interface",
      "name": "混凝土介面",
      "summary": "混凝土介面是在粗獷主義中運用微趨勢原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "混凝土介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#161819"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "混凝土介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#282B2D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "混凝土介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E3A72F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "混凝土介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#BFC6C8"
        }
      ],
      "characteristics": [
        "混凝土介面重新詮釋微趨勢原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "paper-cut-layers": {
      "id": "paper-cut-layers",
      "name": "剪紙層",
      "summary": "剪紙層是在立體與材質中運用微趨勢原則與反叛氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "剪紙層的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "剪紙層的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "剪紙層的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F97316"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "剪紙層的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#38BDF8"
        }
      ],
      "characteristics": [
        "剪紙層重新詮釋微趨勢原則。",
        "粗獷主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立反叛的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與強烈的動效。"
      ]
    },
    "acrylic-ui": {
      "id": "acrylic-ui",
      "name": "壓克力材質介面",
      "summary": "壓克力材質介面是在立體與材質中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "壓克力材質介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E8F0F7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "壓克力材質介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F8FBFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "壓克力材質介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#176B87"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "壓克力材質介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#7C3AED"
        }
      ],
      "characteristics": [
        "壓克力材質介面重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立專業的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "mica-surface": {
      "id": "mica-surface",
      "name": "Mica（雲母）材質",
      "summary": "Mica（雲母）材質是在立體與材質中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Mica（雲母）材質的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E9EDF3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Mica（雲母）材質的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F9FAFC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Mica（雲母）材質的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#315F9B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Mica（雲母）材質的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A43B63"
        }
      ],
      "characteristics": [
        "Mica（雲母）材質重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立專業的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "holographic-foil": {
      "id": "holographic-foil",
      "name": "全像箔",
      "summary": "全像箔是在立體與材質中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "全像箔的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F0EDF7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "全像箔的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "全像箔的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#7C3AED"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "全像箔的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#008A9A"
        }
      ],
      "characteristics": [
        "全像箔重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立專業的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "chrome-metal-ui": {
      "id": "chrome-metal-ui",
      "name": "鉻金屬介面",
      "summary": "鉻金屬介面是在立體與材質中運用介面語言原則與專業氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "鉻金屬介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E7EBEF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "鉻金屬介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FAFBFC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "鉻金屬介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#285E75"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "鉻金屬介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A2384D"
        }
      ],
      "characteristics": [
        "鉻金屬介面重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立專業的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "iridescent-mesh": {
      "id": "iridescent-mesh",
      "name": "虹彩漸層網格",
      "summary": "虹彩漸層網格是在立體與材質中運用表現技法原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "虹彩漸層網格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0D1020"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "虹彩漸層網格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#191D31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "虹彩漸層網格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#7C5CFC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "虹彩漸層網格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#24D6C8"
        }
      ],
      "characteristics": [
        "虹彩漸層網格重新詮釋表現技法原則。",
        "復古未來主義譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "isometric-depth": {
      "id": "isometric-depth",
      "name": "等角立體層次",
      "summary": "等角立體層次是在立體與材質中運用表現技法原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "等角立體層次的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "等角立體層次的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "等角立體層次的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#38BDF8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "等角立體層次的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "等角立體層次重新詮釋表現技法原則。",
        "復古未來主義譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "low-poly-interface": {
      "id": "low-poly-interface",
      "name": "低多邊形介面",
      "summary": "低多邊形介面是在立體與材質中運用表現技法原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "低多邊形介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#10151D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "低多邊形介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#1C2530"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "低多邊形介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "低多邊形介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "低多邊形介面重新詮釋表現技法原則。",
        "復古未來主義譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "soft-plastic": {
      "id": "soft-plastic",
      "name": "軟塑膠",
      "summary": "軟塑膠是在立體與材質中運用表現技法原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "軟塑膠的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#171225"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "軟塑膠的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#28203B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "軟塑膠的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#A78BFA"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "軟塑膠的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "軟塑膠重新詮釋表現技法原則。",
        "復古未來主義譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "embossed-letterpress": {
      "id": "embossed-letterpress",
      "name": "浮雕凸版印刷",
      "summary": "浮雕凸版印刷是在立體與材質中運用歷史運動原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "浮雕凸版印刷的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F1E9D8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "浮雕凸版印刷的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFDF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "浮雕凸版印刷的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8D3A2D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "浮雕凸版印刷的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#315B55"
        }
      ],
      "characteristics": [
        "浮雕凸版印刷重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "mid-century-modern": {
      "id": "mid-century-modern",
      "name": "世紀中葉現代主義",
      "summary": "世紀中葉現代主義是在復古與流行中運用歷史運動原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "世紀中葉現代主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F1E3C6"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "世紀中葉現代主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF7E8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "世紀中葉現代主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C84D32"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "世紀中葉現代主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#276D67"
        }
      ],
      "characteristics": [
        "世紀中葉現代主義重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "atomic-age": {
      "id": "atomic-age",
      "name": "原子時代",
      "summary": "原子時代是在復古與流行中運用歷史運動原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "原子時代的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F5E7C8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "原子時代的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9EA"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "原子時代的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#D44936"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "原子時代的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#216B78"
        }
      ],
      "characteristics": [
        "原子時代重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "pop-art-halftone": {
      "id": "pop-art-halftone",
      "name": "普普藝術半色調",
      "summary": "普普藝術半色調是在復古與流行中運用歷史運動原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "普普藝術半色調的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F8E65B"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "普普藝術半色調的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFBEA"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "普普藝術半色調的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E31B36"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "普普藝術半色調的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1757A6"
        }
      ],
      "characteristics": [
        "普普藝術半色調重新詮釋歷史運動原則。",
        "現代主義譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "op-art": {
      "id": "op-art",
      "name": "歐普藝術",
      "summary": "歐普藝術是在復古與流行中運用歷史運動原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "歐普藝術的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "歐普藝術的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "歐普藝術的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F8F8F2"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "歐普藝術的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF3B30"
        }
      ],
      "characteristics": [
        "歐普藝術重新詮釋歷史運動原則。",
        "後現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "space-age": {
      "id": "space-age",
      "name": "太空時代",
      "summary": "太空時代是在復古與流行中運用歷史運動原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "太空時代的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0C1630"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "太空時代的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#162445"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "太空時代的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF7A59"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "太空時代的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#63E6E2"
        }
      ],
      "characteristics": [
        "太空時代重新詮釋歷史運動原則。",
        "後現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "disco-glam": {
      "id": "disco-glam",
      "name": "迪斯可華麗風",
      "summary": "迪斯可華麗風是在復古與流行中運用歷史運動原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "迪斯可華麗風的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#180D25"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "迪斯可華麗風的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#2A1740"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "迪斯可華麗風的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "迪斯可華麗風的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#EC4899"
        }
      ],
      "characteristics": [
        "迪斯可華麗風重新詮釋歷史運動原則。",
        "後現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "seventies-groovy": {
      "id": "seventies-groovy",
      "name": "1970年代律動風",
      "summary": "1970年代律動風是在復古與流行中運用歷史運動原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "1970年代律動風的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#25150E"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "1970年代律動風的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#382319"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "1970年代律動風的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F07A24"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "1970年代律動風的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#B8C33D"
        }
      ],
      "characteristics": [
        "1970年代律動風重新詮釋歷史運動原則。",
        "後現代主義譜系引導版面構成。",
        "平面材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "eighties-new-wave": {
      "id": "eighties-new-wave",
      "name": "80年代新浪潮",
      "summary": "80年代新浪潮是在復古與流行中運用復興風格原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "80年代新浪潮的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#101225"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "80年代新浪潮的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#1C2040"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "80年代新浪潮的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF3D81"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "80年代新浪潮的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#36E2E2"
        }
      ],
      "characteristics": [
        "80年代新浪潮重新詮釋復興風格原則。",
        "後現代主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "retro-computing": {
      "id": "retro-computing",
      "name": "復古運算",
      "summary": "復古運算是在復古與流行中運用復興風格原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "復古運算的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#08130F"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "復古運算的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#10221A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "復古運算的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#7CFF8A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "復古運算的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F5C451"
        }
      ],
      "characteristics": [
        "復古運算重新詮釋復興風格原則。",
        "後現代主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "pulp-comic": {
      "id": "pulp-comic",
      "name": "紙漿漫畫",
      "summary": "紙漿漫畫是在復古與流行中運用復興風格原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "紙漿漫畫的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#1B1110"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "紙漿漫畫的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#2D1D19"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "紙漿漫畫的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F3C640"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "紙漿漫畫的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D93232"
        }
      ],
      "characteristics": [
        "紙漿漫畫重新詮釋復興風格原則。",
        "後現代主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "newspaper-broadsheet": {
      "id": "newspaper-broadsheet",
      "name": "大報版式",
      "summary": "大報版式是在編輯與有機中運用復興風格原則與活力氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "大報版式的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#151515"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "大報版式的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#222222"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "大報版式的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F2EDE0"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "大報版式的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D24A35"
        }
      ],
      "characteristics": [
        "大報版式重新詮釋復興風格原則。",
        "後現代主義譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立活力的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "literary-journal": {
      "id": "literary-journal",
      "name": "文學期刊",
      "summary": "文學期刊是在編輯與有機中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "文學期刊的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3EFE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "文學期刊的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFCF6"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "文學期刊的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#7A302F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "文學期刊的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#385C55"
        }
      ],
      "characteristics": [
        "文學期刊重新詮釋介面語言原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與無的動效。"
      ]
    },
    "academic-modern": {
      "id": "academic-modern",
      "name": "學術現代主義",
      "summary": "學術現代主義是在編輯與有機中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "學術現代主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F5F6F3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "學術現代主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "學術現代主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#215F78"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "學術現代主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#9A4B2D"
        }
      ],
      "characteristics": [
        "學術現代主義重新詮釋介面語言原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與無的動效。"
      ]
    },
    "archival-museum": {
      "id": "archival-museum",
      "name": "館藏檔案風格",
      "summary": "館藏檔案風格是在編輯與有機中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "館藏檔案風格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EEECE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "館藏檔案風格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FAF9F6"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "館藏檔案風格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#4C5F75"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "館藏檔案風格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#8C4F3D"
        }
      ],
      "characteristics": [
        "館藏檔案風格重新詮釋介面語言原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與無的動效。"
      ]
    },
    "photobook-minimal": {
      "id": "photobook-minimal",
      "name": "極簡攝影集",
      "summary": "極簡攝影集是在編輯與有機中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "極簡攝影集的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7F7F4"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "極簡攝影集的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "極簡攝影集的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#2E5266"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "極簡攝影集的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#9A483A"
        }
      ],
      "characteristics": [
        "極簡攝影集重新詮釋介面語言原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與無的動效。"
      ]
    },
    "botanical-editorial": {
      "id": "botanical-editorial",
      "name": "植物學編輯風格",
      "summary": "植物學編輯風格是在編輯與有機中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "植物學編輯風格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EFEBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "植物學編輯風格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FAF8F0"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "植物學編輯風格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#3F6C4B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "植物學編輯風格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A44A3F"
        }
      ],
      "characteristics": [
        "植物學編輯風格重新詮釋表現技法原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "wabi-sabi-paper": {
      "id": "wabi-sabi-paper",
      "name": "侘寂紙張",
      "summary": "侘寂紙張是在編輯與有機中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "侘寂紙張的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E9E1D2"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "侘寂紙張的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F8F4EB"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "侘寂紙張的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#725547"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "侘寂紙張的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3F6559"
        }
      ],
      "characteristics": [
        "侘寂紙張重新詮釋表現技法原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "collage-magazine": {
      "id": "collage-magazine",
      "name": "拼貼雜誌",
      "summary": "拼貼雜誌是在編輯與有機中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "拼貼雜誌的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F2E6D4"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "拼貼雜誌的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF8EC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "拼貼雜誌的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C83F49"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "拼貼雜誌的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#287078"
        }
      ],
      "characteristics": [
        "拼貼雜誌重新詮釋表現技法原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "typographic-poster": {
      "id": "typographic-poster",
      "name": "排版海報",
      "summary": "排版海報是在編輯與有機中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "排版海報的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "排版海報的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "排版海報的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#B9342E"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "排版海報的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#235D73"
        }
      ],
      "characteristics": [
        "排版海報重新詮釋表現技法原則。",
        "編輯設計譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於印刷場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "luxury-serif-minimal": {
      "id": "luxury-serif-minimal",
      "name": "奢華襯線極簡主義",
      "summary": "奢華襯線極簡主義是在編輯與有機中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "奢華襯線極簡主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EFE7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "奢華襯線極簡主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFCF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "奢華襯線極簡主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#7A2638"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "奢華襯線極簡主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#8A6337"
        }
      ],
      "characteristics": [
        "奢華襯線極簡主義重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "early-web": {
      "id": "early-web",
      "name": "早期網頁",
      "summary": "早期網頁是在Y2K光澤網頁中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "早期網頁的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F2F2EE"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "早期網頁的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "早期網頁的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#0000CC"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "早期網頁的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#B00000"
        }
      ],
      "characteristics": [
        "早期網頁重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "geocities-maximal": {
      "id": "geocities-maximal",
      "name": "GeoCities極繁主義",
      "summary": "GeoCities極繁主義是在Y2K光澤網頁中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "GeoCities極繁主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF36A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "GeoCities極繁主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "GeoCities極繁主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#D719A4"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "GeoCities極繁主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#1648D8"
        }
      ],
      "characteristics": [
        "GeoCities極繁主義重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "aqua-desktop": {
      "id": "aqua-desktop",
      "name": "Aqua桌面",
      "summary": "Aqua桌面是在Y2K光澤網頁中運用復興風格原則與懷舊氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Aqua桌面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EAF6FF"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Aqua桌面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Aqua桌面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#147BC2"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Aqua桌面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#6E3FC7"
        }
      ],
      "characteristics": [
        "Aqua桌面重新詮釋復興風格原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於網頁介面場景。",
        "有助於建立懷舊的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "luna-desktop": {
      "id": "luna-desktop",
      "name": "Luna桌面",
      "summary": "Luna桌面是在Y2K光澤網頁中運用復興風格原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Luna桌面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#E7EEF8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Luna桌面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FAFCFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Luna桌面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#275FB5"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Luna桌面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3F8C43"
        }
      ],
      "characteristics": [
        "Luna桌面重新詮釋復興風格原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "web2-gloss": {
      "id": "web2-gloss",
      "name": "Web 2.0高光質感",
      "summary": "Web 2.0高光質感是在Y2K光澤網頁中運用復興風格原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Web 2.0高光質感的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EEF6FA"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Web 2.0高光質感的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Web 2.0高光質感的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#137FB3"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Web 2.0高光質感的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D54C32"
        }
      ],
      "characteristics": [
        "Web 2.0高光質感重新詮釋復興風格原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "flash-portal": {
      "id": "flash-portal",
      "name": "Flash入口網站",
      "summary": "Flash入口網站是在Y2K光澤網頁中運用復興風格原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Flash入口網站的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EEF1F7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Flash入口網站的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Flash入口網站的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#5B45B9"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Flash入口網站的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#D04473"
        }
      ],
      "characteristics": [
        "Flash入口網站重新詮釋復興風格原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "blogspot-collage": {
      "id": "blogspot-collage",
      "name": "Blogspot拼貼",
      "summary": "Blogspot拼貼是在Y2K光澤網頁中運用復興風格原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Blogspot拼貼的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3EBDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Blogspot拼貼的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFDF8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Blogspot拼貼的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#A23A4B"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Blogspot拼貼的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3A6F7B"
        }
      ],
      "characteristics": [
        "Blogspot拼貼重新詮釋復興風格原則。",
        "擬物設計譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "cyber-y2k": {
      "id": "cyber-y2k",
      "name": "賽博Y2K",
      "summary": "賽博Y2K是在Y2K光澤網頁中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "賽博Y2K的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#080B13"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "賽博Y2K的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#151A28"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "賽博Y2K的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#28E1D1"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "賽博Y2K的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A855F7"
        }
      ],
      "characteristics": [
        "賽博Y2K重新詮釋微趨勢原則。",
        "網路文化譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "kawaii-pixel-web": {
      "id": "kawaii-pixel-web",
      "name": "可愛像素網頁",
      "summary": "可愛像素網頁是在Y2K光澤網頁中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "可愛像素網頁的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#171126"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "可愛像素網頁的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#281C3D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "可愛像素網頁的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#FF78B7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "可愛像素網頁的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#62E5DF"
        }
      ],
      "characteristics": [
        "可愛像素網頁重新詮釋微趨勢原則。",
        "網路文化譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "scene-core-web": {
      "id": "scene-core-web",
      "name": "Scene-core網頁",
      "summary": "Scene-core網頁是在Y2K光澤網頁中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Scene-core網頁的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#120E1C"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Scene-core網頁的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#24182E"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Scene-core網頁的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C7FF00"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Scene-core網頁的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF3DA1"
        }
      ],
      "characteristics": [
        "Scene-core網頁重新詮釋微趨勢原則。",
        "網路文化譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "mcbling-gloss": {
      "id": "mcbling-gloss",
      "name": "McBling光澤",
      "summary": "McBling光澤是在Y2K光澤網頁中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "McBling光澤的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#1A0E18"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "McBling光澤的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#301A2B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "McBling光澤的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "McBling光澤的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F062B2"
        }
      ],
      "characteristics": [
        "McBling光澤重新詮釋微趨勢原則。",
        "網路文化譜系引導版面構成。",
        "金屬材質塑造視覺層級。"
      ],
      "pros": [
        "適用於平面設計場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證極繁的資訊密度與富有表現力的動效。"
      ]
    },
    "tech-optimism-2000": {
      "id": "tech-optimism-2000",
      "name": "2000年代科技樂觀主義",
      "summary": "2000年代科技樂觀主義是在Y2K光澤網頁中運用介面語言原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "2000年代科技樂觀主義的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#081528"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "2000年代科技樂觀主義的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#102743"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "2000年代科技樂觀主義的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#34D5E8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "2000年代科技樂觀主義的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#8FE35F"
        }
      ],
      "characteristics": [
        "2000年代科技樂觀主義重新詮釋介面語言原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "cyberpunk-tactical-hud": {
      "id": "cyberpunk-tactical-hud",
      "name": "賽博朋克HUD",
      "summary": "賽博朋克HUD是在高科技與動態中運用介面語言原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "賽博朋克HUD的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#060B0E"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "賽博朋克HUD的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0E171B"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "賽博朋克HUD的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#00E5C7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "賽博朋克HUD的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF4655"
        }
      ],
      "characteristics": [
        "賽博朋克HUD重新詮釋介面語言原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "sci-fi-fui": {
      "id": "sci-fi-fui",
      "name": "科幻FUI",
      "summary": "科幻FUI是在高科技與動態中運用介面語言原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "科幻FUI的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#071019"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "科幻FUI的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0E1E2A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "科幻FUI的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#46C6FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "科幻FUI的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FFB347"
        }
      ],
      "characteristics": [
        "科幻FUI重新詮釋介面語言原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "terminal-matrix": {
      "id": "terminal-matrix",
      "name": "終端機矩陣",
      "summary": "終端機矩陣是在高科技與動態中運用介面語言原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "終端機矩陣的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#050A07"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "終端機矩陣的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#0B1510"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "終端機矩陣的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#5CFF79"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "終端機矩陣的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F4D35E"
        }
      ],
      "characteristics": [
        "終端機矩陣重新詮釋介面語言原則。",
        "網路文化譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與富有表現力的動效。"
      ]
    },
    "data-dense-dashboard": {
      "id": "data-dense-dashboard",
      "name": "高密度資料儀表板",
      "summary": "高密度資料儀表板是在高科技與動態中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "高密度資料儀表板的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0B1220"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "高密度資料儀表板的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#151F31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "高密度資料儀表板的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#4CC9F0"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "高密度資料儀表板的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "高密度資料儀表板重新詮釋介面語言原則。",
        "網格系統譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "real-time-monitor": {
      "id": "real-time-monitor",
      "name": "即時監控",
      "summary": "即時監控是在高科技與動態中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "即時監控的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#08131A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "即時監控的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#10242D"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "即時監控的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "即時監控的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "即時監控重新詮釋介面語言原則。",
        "網格系統譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "chromatic-aberration": {
      "id": "chromatic-aberration",
      "name": "色差RGB分割",
      "summary": "色差RGB分割是在高科技與動態中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "色差RGB分割的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0B0D18"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "色差RGB分割的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#171A2A"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "色差RGB分割的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#33D6FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "色差RGB分割的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF3E91"
        }
      ],
      "characteristics": [
        "色差RGB分割重新詮釋介面語言原則。",
        "網格系統譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "generative-grid": {
      "id": "generative-grid",
      "name": "生成式網格",
      "summary": "生成式網格是在高科技與動態中運用介面語言原則與精確氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "生成式網格的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#09131F"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "生成式網格的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#132238"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "生成式網格的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#64E572"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "生成式網格的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#F4C95D"
        }
      ],
      "characteristics": [
        "生成式網格重新詮釋介面語言原則。",
        "網格系統譜系引導版面構成。",
        "發光螢幕材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立精確的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證高密度的資訊密度與克制的動效。"
      ]
    },
    "biometric-interface": {
      "id": "biometric-interface",
      "name": "生物辨識介面",
      "summary": "生物辨識介面是在高科技與動態中運用思辨樣式原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "生物辨識介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#07131A"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "生物辨識介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#102630"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "生物辨識介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#35E3C1"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "生物辨識介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#6CA8FF"
        }
      ],
      "characteristics": [
        "生物辨識介面重新詮釋思辨樣式原則。",
        "復古未來主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "spatial-glass-ui": {
      "id": "spatial-glass-ui",
      "name": "空間玻璃介面",
      "summary": "空間玻璃介面是在高科技與動態中運用思辨樣式原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "空間玻璃介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#08101D"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "空間玻璃介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#121F31"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "空間玻璃介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#79D7FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "空間玻璃介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#A78BFA"
        }
      ],
      "characteristics": [
        "空間玻璃介面重新詮釋思辨樣式原則。",
        "復古未來主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "ai-native-gradient": {
      "id": "ai-native-gradient",
      "name": "AI原生漸層",
      "summary": "AI原生漸層是在高科技與動態中運用思辨樣式原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "AI原生漸層的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#0D1022"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "AI原生漸層的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#191C35"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "AI原生漸層的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8B7CFF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "AI原生漸層的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#38D9C5"
        }
      ],
      "characteristics": [
        "AI原生漸層重新詮釋思辨樣式原則。",
        "復古未來主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "quantum-control": {
      "id": "quantum-control",
      "name": "量子控制",
      "summary": "量子控制是在高科技與動態中運用思辨樣式原則與未來感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "量子控制的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#080C1B"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "量子控制的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#121A32"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "量子控制的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#58E0FF"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "量子控制的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#FF74C8"
        }
      ],
      "characteristics": [
        "量子控制重新詮釋思辨樣式原則。",
        "復古未來主義譜系引導版面構成。",
        "玻璃材質塑造視覺層級。"
      ],
      "pros": [
        "適用於產品介面場景。",
        "有助於建立未來感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "inflatable-ui": {
      "id": "inflatable-ui",
      "name": "充氣式UI",
      "summary": "充氣式UI是在柔和3D與太陽龐克中運用介面語言原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "充氣式UI的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7EAF1"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "充氣式UI的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "充氣式UI的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E35D9A"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "充氣式UI的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#4279C6"
        }
      ],
      "characteristics": [
        "充氣式UI重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "toy-block-ui": {
      "id": "toy-block-ui",
      "name": "玩具積木UI",
      "summary": "玩具積木UI是在柔和3D與太陽龐克中運用介面語言原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "玩具積木UI的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4EFD9"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "玩具積木UI的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFDF3"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "玩具積木UI的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E45D3F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "玩具積木UI的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3277B7"
        }
      ],
      "characteristics": [
        "玩具積木UI重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "kawaii-pastel": {
      "id": "kawaii-pastel",
      "name": "可愛粉彩",
      "summary": "可愛粉彩是在柔和3D與太陽龐克中運用介面語言原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "可愛粉彩的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F8EAF1"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "可愛粉彩的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "可愛粉彩的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#D85F98"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "可愛粉彩的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#5284C8"
        }
      ],
      "characteristics": [
        "可愛粉彩重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "sticker-book": {
      "id": "sticker-book",
      "name": "貼紙簿",
      "summary": "貼紙簿是在柔和3D與太陽龐克中運用介面語言原則與親和氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "貼紙簿的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F7F0D8"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "貼紙簿的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "貼紙簿的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E95843"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "貼紙簿的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3978B9"
        }
      ],
      "characteristics": [
        "貼紙簿重新詮釋介面語言原則。",
        "擬物設計譜系引導版面構成。",
        "塑膠材質塑造視覺層級。"
      ],
      "pros": [
        "適用於3D場景。",
        "有助於建立親和的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "doodle-interface": {
      "id": "doodle-interface",
      "name": "塗鴉介面",
      "summary": "塗鴉介面是在柔和3D與太陽龐克中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "塗鴉介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F4ECDD"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "塗鴉介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "塗鴉介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#C84D3F"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "塗鴉介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3C7081"
        }
      ],
      "characteristics": [
        "塗鴉介面重新詮釋表現技法原則。",
        "獨立手作譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "papercraft-ui": {
      "id": "papercraft-ui",
      "name": "紙藝介面",
      "summary": "紙藝介面是在柔和3D與太陽龐克中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "紙藝介面的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F2E8D5"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "紙藝介面的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "紙藝介面的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#D85B42"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "紙藝介面的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#397777"
        }
      ],
      "characteristics": [
        "紙藝介面重新詮釋表現技法原則。",
        "獨立手作譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "cozy-knit": {
      "id": "cozy-knit",
      "name": "溫馨針織",
      "summary": "溫馨針織是在柔和3D與太陽龐克中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "溫馨針織的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F0E5D7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "溫馨針織的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FCF8F1"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "溫馨針織的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#A54B45"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "溫馨針織的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3F7368"
        }
      ],
      "characteristics": [
        "溫馨針織重新詮釋表現技法原則。",
        "獨立手作譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "dreamcore-cloud": {
      "id": "dreamcore-cloud",
      "name": "夢核雲境",
      "summary": "夢核雲境是在柔和3D與太陽龐克中運用表現技法原則與觸感氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "夢核雲境的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EEEAF3"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "夢核雲境的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FBF9FD"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "夢核雲境的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8A5FA8"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "夢核雲境的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#4D7FA3"
        }
      ],
      "characteristics": [
        "夢核雲境重新詮釋表現技法原則。",
        "獨立手作譜系引導版面構成。",
        "紙張材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立觸感的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與克制的動效。"
      ]
    },
    "kidcore-play": {
      "id": "kidcore-play",
      "name": "Kidcore童趣",
      "summary": "Kidcore童趣是在柔和3D與太陽龐克中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "Kidcore童趣的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF0C7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "Kidcore童趣的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9E8"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "Kidcore童趣的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#E84B3C"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "Kidcore童趣的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3578C5"
        }
      ],
      "characteristics": [
        "Kidcore童趣重新詮釋微趨勢原則。",
        "有機現代主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "biomorphic-soft": {
      "id": "biomorphic-soft",
      "name": "柔和仿生形態",
      "summary": "柔和仿生形態是在柔和3D與太陽龐克中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "柔和仿生形態的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#EAF2E7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "柔和仿生形態的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#F9FCF7"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "柔和仿生形態的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#3F8B67"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "柔和仿生形態的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#C35F68"
        }
      ],
      "characteristics": [
        "柔和仿生形態重新詮釋微趨勢原則。",
        "有機現代主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "pastel-gradient": {
      "id": "pastel-gradient",
      "name": "粉彩漸層",
      "summary": "粉彩漸層是在柔和3D與太陽龐克中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "粉彩漸層的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#F3EDF7"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "粉彩漸層的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9FD"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "粉彩漸層的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#8B63B7"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "粉彩漸層的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3F819A"
        }
      ],
      "characteristics": [
        "粉彩漸層重新詮釋微趨勢原則。",
        "有機現代主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    },
    "cartoon-dashboard": {
      "id": "cartoon-dashboard",
      "name": "卡通儀表板",
      "summary": "卡通儀表板是在柔和3D與太陽龐克中運用微趨勢原則與趣味氛圍的實用介面設計方案。",
      "palette": [
        {
          "id": "canvas",
          "name": "配色1",
          "usage": "卡通儀表板的配色1用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF0D0"
        },
        {
          "id": "surface",
          "name": "配色2",
          "usage": "卡通儀表板的配色2用於區分主要表面、文字與狀態訊號。",
          "value": "#FFF9E9"
        },
        {
          "id": "signal",
          "name": "配色3",
          "usage": "卡通儀表板的配色3用於區分主要表面、文字與狀態訊號。",
          "value": "#DF553D"
        },
        {
          "id": "counter-signal",
          "name": "配色4",
          "usage": "卡通儀表板的配色4用於區分主要表面、文字與狀態訊號。",
          "value": "#3476B8"
        }
      ],
      "characteristics": [
        "卡通儀表板重新詮釋微趨勢原則。",
        "有機現代主義譜系引導版面構成。",
        "有機材料材質塑造視覺層級。"
      ],
      "pros": [
        "適用於插畫場景。",
        "有助於建立趣味的產品語氣。"
      ],
      "cons": [
        "應配合目標使用者驗證均衡的資訊密度與富有表現力的動效。"
      ]
    }
  },
  "categories": {
    "swiss": {
      "id": "swiss",
      "title": "國際字體風格",
      "description": "國際字體風格彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "brutalism": {
      "id": "brutalism",
      "title": "粗獷主義",
      "description": "粗獷主義彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "depth": {
      "id": "depth",
      "title": "立體與材質",
      "description": "立體與材質彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "retro": {
      "id": "retro",
      "title": "復古與流行",
      "description": "復古與流行彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "editorial": {
      "id": "editorial",
      "title": "編輯與有機",
      "description": "編輯與有機彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "y2k": {
      "id": "y2k",
      "title": "Y2K光澤網頁",
      "description": "Y2K光澤網頁彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "hypertech": {
      "id": "hypertech",
      "title": "高科技與動態",
      "description": "高科技與動態彙整相關設計運動、介面語言、材料與製作脈絡。"
    },
    "soft3d": {
      "id": "soft3d",
      "title": "柔和3D與太陽龐克",
      "description": "柔和3D與太陽龐克彙整相關設計運動、介面語言、材料與製作脈絡。"
    }
  },
  "facets": {
    "kind": {
      "id": "kind",
      "label": "樣式類型",
      "values": {
        "historical-movement": "歷史運動",
        "revival": "復興風格",
        "technique": "表現技法",
        "interface-language": "介面語言",
        "microtrend": "微趨勢",
        "speculative": "思辨樣式"
      }
    },
    "era": {
      "id": "era",
      "label": "時代",
      "values": {
        "pre-1950": "1950年以前",
        "1950s-1970s": "1950至1970年代",
        "1980s-1990s": "1980至1990年代",
        "2000s": "2000年代",
        "2010s": "2010年代",
        "2020s": "2020年代",
        "timeless": "跨越時代"
      }
    },
    "lineage": {
      "id": "lineage",
      "label": "設計譜系",
      "values": {
        "modernism": "現代主義",
        "international-style": "國際字體樣式",
        "minimalism": "極簡主義",
        "brutalism": "粗獷主義",
        "skeuomorphism": "擬物設計",
        "postmodernism": "後現代主義",
        "retrofuturism": "復古未來主義",
        "editorial": "編輯設計",
        "organic-modernism": "有機現代主義",
        "cyberculture": "網路文化",
        "grid-systems": "網格系統",
        "indie-craft": "獨立手作",
        "eco-futurism": "生態未來主義",
        "bauhaus": "包浩斯",
        "de-stijl": "風格派",
        "flat-design": "扁平設計",
        "constructivism": "構成主義",
        "punk-diy": "龐克DIY",
        "material-design": "材料設計",
        "liquid-glass": "液態玻璃",
        "art-deco": "裝飾藝術",
        "psychedelia": "迷幻藝術",
        "art-nouveau": "新藝術",
        "risograph-print": "孔版印刷",
        "microsoft-design": "微軟設計"
      }
    },
    "media": {
      "id": "media",
      "label": "媒介",
      "values": {
        "graphic": "平面設計",
        "print": "印刷",
        "web-ui": "網頁介面",
        "product-ui": "產品介面",
        "illustration": "插畫",
        "three-d": "3D"
      }
    },
    "materiality": {
      "id": "materiality",
      "label": "質感與材料",
      "values": {
        "flat": "平面",
        "glass": "玻璃",
        "paper": "紙張",
        "ink": "油墨",
        "metal": "金屬",
        "plastic": "塑膠",
        "pixel": "像素",
        "clay": "黏土",
        "organic": "有機材料",
        "screen": "發光螢幕"
      }
    },
    "density": {
      "id": "density",
      "label": "資訊密度",
      "values": {
        "sparse": "疏朗",
        "balanced": "均衡",
        "dense": "高密度",
        "maximal": "極繁"
      }
    },
    "tone": {
      "id": "tone",
      "label": "氛圍",
      "values": {
        "rational": "理性",
        "precise": "精確",
        "professional": "專業",
        "rebellious": "反叛",
        "playful": "趣味",
        "futuristic": "未來感",
        "tactile": "觸感",
        "nostalgic": "懷舊",
        "luxurious": "奢華",
        "organic": "有機材料",
        "immersive": "沉浸",
        "energetic": "活力",
        "friendly": "親和",
        "optimistic": "樂觀"
      }
    },
    "motion": {
      "id": "motion",
      "label": "動效強度",
      "values": {
        "none": "無",
        "restrained": "克制",
        "expressive": "富有表現力",
        "intense": "強烈"
      }
    },
    "region": {
      "id": "region",
      "label": "地區與文化",
      "values": {
        "international": "國際",
        "europe": "歐洲",
        "north-america": "北美",
        "latin-america": "拉丁美洲",
        "east-asia": "東亞",
        "south-asia": "南亞",
        "africa": "非洲",
        "middle-east": "中東",
        "oceania": "大洋洲",
        "global-internet": "全球網路文化"
      }
    },
    "maturity": {
      "id": "maturity",
      "label": "成熟度",
      "values": {
        "canonical": "經典",
        "established": "成熟",
        "emerging": "新興",
        "experimental": "實驗性"
      }
    }
  }
};

export default Object.freeze(applyTraditionalChineseEditorialReview(catalog));
