import { applyEnglishEditorialReview } from './enEditorial.js';

// Stage 1 명시 콘텐츠 기준선. Stage 2 편집 감수는 enEditorial profile을 적용한다.
const catalog = {
  "styles": {
    "swiss-grid": {
      "id": "swiss-grid",
      "name": "Grid-Driven Modernism",
      "summary": "Grid-Driven Modernism applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas-white",
          "name": "Canvas White",
          "usage": "Canvas White defines a distinct surface, text, or signal role in Grid-Driven Modernism.",
          "value": "#F4F4F0"
        },
        {
          "id": "deep-ink",
          "name": "Deep Ink",
          "usage": "Deep Ink defines a distinct surface, text, or signal role in Grid-Driven Modernism.",
          "value": "#111111"
        },
        {
          "id": "swiss-red",
          "name": "Swiss Red",
          "usage": "Swiss Red defines a distinct surface, text, or signal role in Grid-Driven Modernism.",
          "value": "#FF3300"
        },
        {
          "id": "neutral-gray",
          "name": "Neutral Gray",
          "usage": "Neutral Gray defines a distinct surface, text, or signal role in Grid-Driven Modernism.",
          "value": "#666666"
        }
      ],
      "characteristics": [
        "Grid-Driven Modernism interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy.",
        "Grid-Driven Modernism documents an additional composition rule for consistent implementation."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice.",
        "Grid-Driven Modernism can support broader production contexts when its hierarchy is preserved."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience.",
        "Grid-Driven Modernism requires content-length and readability checks in the target interface."
      ]
    },
    "corporate-minimal": {
      "id": "corporate-minimal",
      "name": "Corporate Minimalism",
      "summary": "Corporate Minimalism applies interface language principles and a professional tone within International Typographic Style.",
      "palette": [
        {
          "id": "pure-white",
          "name": "Pure White",
          "usage": "Pure White defines a distinct surface, text, or signal role in Corporate Minimalism.",
          "value": "#FFFFFF"
        },
        {
          "id": "slate-dark",
          "name": "Slate Dark",
          "usage": "Slate Dark defines a distinct surface, text, or signal role in Corporate Minimalism.",
          "value": "#0F172A"
        },
        {
          "id": "trust-blue",
          "name": "Trust Blue",
          "usage": "Trust Blue defines a distinct surface, text, or signal role in Corporate Minimalism.",
          "value": "#2563EB"
        },
        {
          "id": "soft-gray",
          "name": "Soft Gray",
          "usage": "Soft Gray defines a distinct surface, text, or signal role in Corporate Minimalism.",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "Corporate Minimalism interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a professional product voice.",
        "Corporate Minimalism can support broader production contexts when its hierarchy is preserved."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "high-contrast-mono": {
      "id": "high-contrast-mono",
      "name": "High-Contrast Monospace",
      "summary": "High-Contrast Monospace applies interface language principles and a precise tone within International Typographic Style.",
      "palette": [
        {
          "id": "terminal-black",
          "name": "Terminal Black",
          "usage": "Terminal Black defines a distinct surface, text, or signal role in High-Contrast Monospace.",
          "value": "#050505"
        },
        {
          "id": "pure-white",
          "name": "Pure White",
          "usage": "Pure White defines a distinct surface, text, or signal role in High-Contrast Monospace.",
          "value": "#FFFFFF"
        },
        {
          "id": "neon-terminal",
          "name": "Neon Terminal",
          "usage": "Neon Terminal defines a distinct surface, text, or signal role in High-Contrast Monospace.",
          "value": "#00FF66"
        },
        {
          "id": "dim-gray",
          "name": "Dim Gray",
          "usage": "Dim Gray defines a distinct surface, text, or signal role in High-Contrast Monospace.",
          "value": "#333333"
        }
      ],
      "characteristics": [
        "High-Contrast Monospace interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "raw-brutalism": {
      "id": "raw-brutalism",
      "name": "Raw Digital Brutalism",
      "summary": "Raw Digital Brutalism applies revival principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "raw-yellow",
          "name": "Raw Yellow",
          "usage": "Raw Yellow defines a distinct surface, text, or signal role in Raw Digital Brutalism.",
          "value": "#FFFF00"
        },
        {
          "id": "harsh-black",
          "name": "Harsh Black",
          "usage": "Harsh Black defines a distinct surface, text, or signal role in Raw Digital Brutalism.",
          "value": "#000000"
        },
        {
          "id": "hot-pink",
          "name": "Hot Pink",
          "usage": "Hot Pink defines a distinct surface, text, or signal role in Raw Digital Brutalism.",
          "value": "#FF0055"
        },
        {
          "id": "stark-white",
          "name": "Stark White",
          "usage": "Stark White defines a distinct surface, text, or signal role in Raw Digital Brutalism.",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "Raw Digital Brutalism interprets revival principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "neo-brutalism": {
      "id": "neo-brutalism",
      "name": "Trendy Neo-Brutalism",
      "summary": "Trendy Neo-Brutalism applies revival principles and a playful tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "pop-yellow",
          "name": "Pop Yellow",
          "usage": "Pop Yellow defines a distinct surface, text, or signal role in Trendy Neo-Brutalism.",
          "value": "#FEF08A"
        },
        {
          "id": "soft-sky",
          "name": "Soft Sky",
          "usage": "Soft Sky defines a distinct surface, text, or signal role in Trendy Neo-Brutalism.",
          "value": "#BFDBFE"
        },
        {
          "id": "slate-ink",
          "name": "Slate Ink",
          "usage": "Slate Ink defines a distinct surface, text, or signal role in Trendy Neo-Brutalism.",
          "value": "#1E293B"
        },
        {
          "id": "coral-pop",
          "name": "Coral Pop",
          "usage": "Coral Pop defines a distinct surface, text, or signal role in Trendy Neo-Brutalism.",
          "value": "#F43F5E"
        }
      ],
      "characteristics": [
        "Trendy Neo-Brutalism interprets revival principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "cyber-brutalism": {
      "id": "cyber-brutalism",
      "name": "Cyber Brutalism",
      "summary": "Cyber Brutalism applies microtrend principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "abyss-dark",
          "name": "Abyss Dark",
          "usage": "Abyss Dark defines a distinct surface, text, or signal role in Cyber Brutalism.",
          "value": "#0D0E15"
        },
        {
          "id": "cyber-cyan",
          "name": "Cyber Cyan",
          "usage": "Cyber Cyan defines a distinct surface, text, or signal role in Cyber Brutalism.",
          "value": "#00F0FF"
        },
        {
          "id": "neon-pink",
          "name": "Neon Pink",
          "usage": "Neon Pink defines a distinct surface, text, or signal role in Cyber Brutalism.",
          "value": "#FF007A"
        },
        {
          "id": "grid-blue",
          "name": "Grid Blue",
          "usage": "Grid Blue defines a distinct surface, text, or signal role in Cyber Brutalism.",
          "value": "#1F2438"
        }
      ],
      "characteristics": [
        "Cyber Brutalism interprets microtrend principles.",
        "brutalism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and intense motion against the target audience."
      ]
    },
    "glassmorphism": {
      "id": "glassmorphism",
      "name": "Frosted Glassmorphism",
      "summary": "Frosted Glassmorphism applies technique principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "glass-frost",
          "name": "Glass Frost",
          "usage": "Glass Frost defines a distinct surface, text, or signal role in Frosted Glassmorphism.",
          "value": "rgba(255,255,255,0.12)"
        },
        {
          "id": "deep-space",
          "name": "Deep Space",
          "usage": "Deep Space defines a distinct surface, text, or signal role in Frosted Glassmorphism.",
          "value": "#0F172A"
        },
        {
          "id": "glow-indigo",
          "name": "Glow Indigo",
          "usage": "Glow Indigo defines a distinct surface, text, or signal role in Frosted Glassmorphism.",
          "value": "#818CF8"
        },
        {
          "id": "crystal-white",
          "name": "Crystal White",
          "usage": "Crystal White defines a distinct surface, text, or signal role in Frosted Glassmorphism.",
          "value": "#E0E7FF"
        }
      ],
      "characteristics": [
        "Frosted Glassmorphism interprets technique principles.",
        "minimalism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "neumorphism": {
      "id": "neumorphism",
      "name": "Soft Neumorphism",
      "summary": "Soft Neumorphism applies technique principles and a tactile tone within Depth & Materiality.",
      "palette": [
        {
          "id": "soft-surface",
          "name": "Soft Surface",
          "usage": "Soft Surface defines a distinct surface, text, or signal role in Soft Neumorphism.",
          "value": "#E0E5EC"
        },
        {
          "id": "highlight-shadow",
          "name": "Highlight Shadow",
          "usage": "Highlight Shadow defines a distinct surface, text, or signal role in Soft Neumorphism.",
          "value": "#FFFFFF"
        },
        {
          "id": "dark-shadow",
          "name": "Dark Shadow",
          "usage": "Dark Shadow defines a distinct surface, text, or signal role in Soft Neumorphism.",
          "value": "#A3B1C6"
        },
        {
          "id": "tactile-accent",
          "name": "Tactile Accent",
          "usage": "Tactile Accent defines a distinct surface, text, or signal role in Soft Neumorphism.",
          "value": "#4F46E5"
        }
      ],
      "characteristics": [
        "Soft Neumorphism interprets technique principles.",
        "minimalism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "skeuomorphism": {
      "id": "skeuomorphism",
      "name": "Modern Skeuomorphism 2.0",
      "summary": "Modern Skeuomorphism 2.0 applies interface language principles and a tactile tone within Depth & Materiality.",
      "palette": [
        {
          "id": "brushed-charcoal",
          "name": "Brushed Charcoal",
          "usage": "Brushed Charcoal defines a distinct surface, text, or signal role in Modern Skeuomorphism 2.0.",
          "value": "#1E1E24"
        },
        {
          "id": "metallic-gray",
          "name": "Metallic Gray",
          "usage": "Metallic Gray defines a distinct surface, text, or signal role in Modern Skeuomorphism 2.0.",
          "value": "#2D2D35"
        },
        {
          "id": "amber-indicator",
          "name": "Amber Indicator",
          "usage": "Amber Indicator defines a distinct surface, text, or signal role in Modern Skeuomorphism 2.0.",
          "value": "#FF9F1C"
        },
        {
          "id": "led-emerald",
          "name": "Led Emerald",
          "usage": "Led Emerald defines a distinct surface, text, or signal role in Modern Skeuomorphism 2.0.",
          "value": "#4CB944"
        }
      ],
      "characteristics": [
        "Modern Skeuomorphism 2.0 interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "memphis": {
      "id": "memphis",
      "name": "Memphis Pop Design",
      "summary": "Memphis Pop Design applies historical movement principles and a playful tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "memphis-pink",
          "name": "Memphis Pink",
          "usage": "Memphis Pink defines a distinct surface, text, or signal role in Memphis Pop Design.",
          "value": "#FF70A6"
        },
        {
          "id": "peach-coral",
          "name": "Peach Coral",
          "usage": "Peach Coral defines a distinct surface, text, or signal role in Memphis Pop Design.",
          "value": "#FF9770"
        },
        {
          "id": "sunshine-yellow",
          "name": "Sunshine Yellow",
          "usage": "Sunshine Yellow defines a distinct surface, text, or signal role in Memphis Pop Design.",
          "value": "#FFD670"
        },
        {
          "id": "sky-cyan",
          "name": "Sky Cyan",
          "usage": "Sky Cyan defines a distinct surface, text, or signal role in Memphis Pop Design.",
          "value": "#70D6FF"
        }
      ],
      "characteristics": [
        "Memphis Pop Design interprets historical movement principles.",
        "postmodernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "synthwave": {
      "id": "synthwave",
      "name": "80s Synthwave & Outrun",
      "summary": "80s Synthwave & Outrun applies revival principles and a nostalgic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "synth-purple",
          "name": "Synth Purple",
          "usage": "Synth Purple defines a distinct surface, text, or signal role in 80s Synthwave & Outrun.",
          "value": "#1A0B2E"
        },
        {
          "id": "neon-magenta",
          "name": "Neon Magenta",
          "usage": "Neon Magenta defines a distinct surface, text, or signal role in 80s Synthwave & Outrun.",
          "value": "#FF007F"
        },
        {
          "id": "electric-cyan",
          "name": "Electric Cyan",
          "usage": "Electric Cyan defines a distinct surface, text, or signal role in 80s Synthwave & Outrun.",
          "value": "#00F5FF"
        },
        {
          "id": "sunset-gold",
          "name": "Sunset Gold",
          "usage": "Sunset Gold defines a distinct surface, text, or signal role in 80s Synthwave & Outrun.",
          "value": "#FFDD00"
        }
      ],
      "characteristics": [
        "80s Synthwave & Outrun interprets revival principles.",
        "retrofuturism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate dense information density and intense motion against the target audience."
      ]
    },
    "vaporwave": {
      "id": "vaporwave",
      "name": "Vaporwave Chill",
      "summary": "Vaporwave Chill applies microtrend principles and a nostalgic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "vapor-lavender",
          "name": "Vapor Lavender",
          "usage": "Vapor Lavender defines a distinct surface, text, or signal role in Vaporwave Chill.",
          "value": "#D8B4F8"
        },
        {
          "id": "pastel-yellow",
          "name": "Pastel Yellow",
          "usage": "Pastel Yellow defines a distinct surface, text, or signal role in Vaporwave Chill.",
          "value": "#F9F871"
        },
        {
          "id": "chill-violet",
          "name": "Chill Violet",
          "usage": "Chill Violet defines a distinct surface, text, or signal role in Vaporwave Chill.",
          "value": "#845EC2"
        },
        {
          "id": "retro-mint",
          "name": "Retro Mint",
          "usage": "Retro Mint defines a distinct surface, text, or signal role in Vaporwave Chill.",
          "value": "#00C9A7"
        }
      ],
      "characteristics": [
        "Vaporwave Chill interprets microtrend principles.",
        "postmodernism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "high-fashion": {
      "id": "high-fashion",
      "name": "High-Fashion Editorial",
      "summary": "High-Fashion Editorial applies interface language principles and a luxurious tone within Editorial & Organic.",
      "palette": [
        {
          "id": "midnight-ink",
          "name": "Midnight Ink",
          "usage": "Midnight Ink defines a distinct surface, text, or signal role in High-Fashion Editorial.",
          "value": "#0A0A0A"
        },
        {
          "id": "ivory-soft",
          "name": "Ivory Soft",
          "usage": "Ivory Soft defines a distinct surface, text, or signal role in High-Fashion Editorial.",
          "value": "#F5F5F0"
        },
        {
          "id": "champagne-gold",
          "name": "Champagne Gold",
          "usage": "Champagne Gold defines a distinct surface, text, or signal role in High-Fashion Editorial.",
          "value": "#C5A880"
        },
        {
          "id": "warm-charcoal",
          "name": "Warm Charcoal",
          "usage": "Warm Charcoal defines a distinct surface, text, or signal role in High-Fashion Editorial.",
          "value": "#1C1C1E"
        }
      ],
      "characteristics": [
        "High-Fashion Editorial interprets interface language principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a luxurious product voice."
      ],
      "cons": [
        "Validate sparse information density and none motion against the target audience."
      ]
    },
    "fluid-organic": {
      "id": "fluid-organic",
      "name": "Fluid Organic Forms & Warm Tones",
      "summary": "Fluid Organic Forms & Warm Tones applies technique principles and a organic tone within Editorial & Organic.",
      "palette": [
        {
          "id": "warm-clay",
          "name": "Warm Clay",
          "usage": "Warm Clay defines a distinct surface, text, or signal role in Fluid Organic Forms & Warm Tones.",
          "value": "#F7F4EF"
        },
        {
          "id": "forest-pine",
          "name": "Forest Pine",
          "usage": "Forest Pine defines a distinct surface, text, or signal role in Fluid Organic Forms & Warm Tones.",
          "value": "#2C3E35"
        },
        {
          "id": "terracotta",
          "name": "Terracotta",
          "usage": "Terracotta defines a distinct surface, text, or signal role in Fluid Organic Forms & Warm Tones.",
          "value": "#E07A5F"
        },
        {
          "id": "sage-green",
          "name": "Sage Green",
          "usage": "Sage Green defines a distinct surface, text, or signal role in Fluid Organic Forms & Warm Tones.",
          "value": "#81B29A"
        }
      ],
      "characteristics": [
        "Fluid Organic Forms & Warm Tones interprets technique principles.",
        "organic modernism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a organic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "dark-minimal-glass": {
      "id": "dark-minimal-glass",
      "name": "Dark Minimal Glass",
      "summary": "Dark Minimal Glass applies interface language principles and a luxurious tone within Editorial & Organic.",
      "palette": [
        {
          "id": "abyss-background",
          "name": "Abyss Background",
          "usage": "Abyss Background defines a distinct surface, text, or signal role in Dark Minimal Glass.",
          "value": "#0B0F19"
        },
        {
          "id": "card-surface",
          "name": "Card Surface",
          "usage": "Card Surface defines a distinct surface, text, or signal role in Dark Minimal Glass.",
          "value": "#111827"
        },
        {
          "id": "sky-glow",
          "name": "Sky Glow",
          "usage": "Sky Glow defines a distinct surface, text, or signal role in Dark Minimal Glass.",
          "value": "#38BDF8"
        },
        {
          "id": "muted-slate",
          "name": "Muted Slate",
          "usage": "Muted Slate defines a distinct surface, text, or signal role in Dark Minimal Glass.",
          "value": "#94A3B8"
        }
      ],
      "characteristics": [
        "Dark Minimal Glass interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a luxurious product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "y2k-chrome": {
      "id": "y2k-chrome",
      "name": "Y2K Chrome & Hologram",
      "summary": "Y2K Chrome & Hologram applies revival principles and a nostalgic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "chrome-silver",
          "name": "Chrome Silver",
          "usage": "Chrome Silver defines a distinct surface, text, or signal role in Y2K Chrome & Hologram.",
          "value": "#E2E8F0"
        },
        {
          "id": "holo-magenta",
          "name": "Holo Magenta",
          "usage": "Holo Magenta defines a distinct surface, text, or signal role in Y2K Chrome & Hologram.",
          "value": "#EC4899"
        },
        {
          "id": "electric-violet",
          "name": "Electric Violet",
          "usage": "Electric Violet defines a distinct surface, text, or signal role in Y2K Chrome & Hologram.",
          "value": "#8B5CF6"
        },
        {
          "id": "space-navy",
          "name": "Space Navy",
          "usage": "Space Navy defines a distinct surface, text, or signal role in Y2K Chrome & Hologram.",
          "value": "#0F172A"
        }
      ],
      "characteristics": [
        "Y2K Chrome & Hologram interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "frutiger-aero": {
      "id": "frutiger-aero",
      "name": "Frutiger Aero Aqua Gloss",
      "summary": "Frutiger Aero Aqua Gloss applies revival principles and a optimistic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "sky-cyan",
          "name": "Sky Cyan",
          "usage": "Sky Cyan defines a distinct surface, text, or signal role in Frutiger Aero Aqua Gloss.",
          "value": "#38BDF8"
        },
        {
          "id": "aqua-lime",
          "name": "Aqua Lime",
          "usage": "Aqua Lime defines a distinct surface, text, or signal role in Frutiger Aero Aqua Gloss.",
          "value": "#4ADE80"
        },
        {
          "id": "gloss-glass",
          "name": "Gloss Glass",
          "usage": "Gloss Glass defines a distinct surface, text, or signal role in Frutiger Aero Aqua Gloss.",
          "value": "rgba(255,255,255,0.4)"
        },
        {
          "id": "ocean-blue",
          "name": "Ocean Blue",
          "usage": "Ocean Blue defines a distinct surface, text, or signal role in Frutiger Aero Aqua Gloss.",
          "value": "#0284C7"
        }
      ],
      "characteristics": [
        "Frutiger Aero Aqua Gloss interprets revival principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a optimistic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "pixel-arcade": {
      "id": "pixel-arcade",
      "name": "8-Bit Pixel Arcade",
      "summary": "8-Bit Pixel Arcade applies revival principles and a nostalgic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "arcade-purple",
          "name": "Arcade Purple",
          "usage": "Arcade Purple defines a distinct surface, text, or signal role in 8-Bit Pixel Arcade.",
          "value": "#2E0854"
        },
        {
          "id": "pixel-gold",
          "name": "Pixel Gold",
          "usage": "Pixel Gold defines a distinct surface, text, or signal role in 8-Bit Pixel Arcade.",
          "value": "#FBBF24"
        },
        {
          "id": "health-green",
          "name": "Health Green",
          "usage": "Health Green defines a distinct surface, text, or signal role in 8-Bit Pixel Arcade.",
          "value": "#22C55E"
        },
        {
          "id": "pixel-red",
          "name": "Pixel Red",
          "usage": "Pixel Red defines a distinct surface, text, or signal role in 8-Bit Pixel Arcade.",
          "value": "#EF4444"
        }
      ],
      "characteristics": [
        "8-Bit Pixel Arcade interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "pixel material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "kinetic-type": {
      "id": "kinetic-type",
      "name": "Kinetic Typography & Motion",
      "summary": "Kinetic Typography & Motion applies technique principles and a energetic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "hyper-lime",
          "name": "Hyper Lime",
          "usage": "Hyper Lime defines a distinct surface, text, or signal role in Kinetic Typography & Motion.",
          "value": "#CCFF00"
        },
        {
          "id": "pitch-black",
          "name": "Pitch Black",
          "usage": "Pitch Black defines a distinct surface, text, or signal role in Kinetic Typography & Motion.",
          "value": "#050505"
        },
        {
          "id": "flash-white",
          "name": "Flash White",
          "usage": "Flash White defines a distinct surface, text, or signal role in Kinetic Typography & Motion.",
          "value": "#FFFFFF"
        },
        {
          "id": "carbon-gray",
          "name": "Carbon Gray",
          "usage": "Carbon Gray defines a distinct surface, text, or signal role in Kinetic Typography & Motion.",
          "value": "#1E1E1E"
        }
      ],
      "characteristics": [
        "Kinetic Typography & Motion interprets technique principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "bento-grid": {
      "id": "bento-grid",
      "name": "Bento UI 2.0 Precision Grid",
      "summary": "Bento UI 2.0 Precision Grid applies interface language principles and a precise tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "bento-card",
          "name": "Bento Card",
          "usage": "Bento Card defines a distinct surface, text, or signal role in Bento UI 2.0 Precision Grid.",
          "value": "#161B26"
        },
        {
          "id": "subtle-rim",
          "name": "Subtle Rim",
          "usage": "Subtle Rim defines a distinct surface, text, or signal role in Bento UI 2.0 Precision Grid.",
          "value": "rgba(255,255,255,0.08)"
        },
        {
          "id": "active-indigo",
          "name": "Active Indigo",
          "usage": "Active Indigo defines a distinct surface, text, or signal role in Bento UI 2.0 Precision Grid.",
          "value": "#6366F1"
        },
        {
          "id": "data-emerald",
          "name": "Data Emerald",
          "usage": "Data Emerald defines a distinct surface, text, or signal role in Bento UI 2.0 Precision Grid.",
          "value": "#10B981"
        }
      ],
      "characteristics": [
        "Bento UI 2.0 Precision Grid interprets interface language principles.",
        "grid systems lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "acid-techno": {
      "id": "acid-techno",
      "name": "Acid Graphics & Techno Rave",
      "summary": "Acid Graphics & Techno Rave applies microtrend principles and a energetic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "acid-neon-green",
          "name": "Acid Neon Green",
          "usage": "Acid Neon Green defines a distinct surface, text, or signal role in Acid Graphics & Techno Rave.",
          "value": "#39FF14"
        },
        {
          "id": "pure-darkness",
          "name": "Pure Darkness",
          "usage": "Pure Darkness defines a distinct surface, text, or signal role in Acid Graphics & Techno Rave.",
          "value": "#000000"
        },
        {
          "id": "electric-yellow",
          "name": "Electric Yellow",
          "usage": "Electric Yellow defines a distinct surface, text, or signal role in Acid Graphics & Techno Rave.",
          "value": "#FFFF33"
        },
        {
          "id": "toxic-purple",
          "name": "Toxic Purple",
          "usage": "Toxic Purple defines a distinct surface, text, or signal role in Acid Graphics & Techno Rave.",
          "value": "#7928CA"
        }
      ],
      "characteristics": [
        "Acid Graphics & Techno Rave interprets microtrend principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "claymorphism": {
      "id": "claymorphism",
      "name": "Claymorphism & 3D Bubble",
      "summary": "Claymorphism & 3D Bubble applies technique principles and a friendly tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "clay-peach",
          "name": "Clay Peach",
          "usage": "Clay Peach defines a distinct surface, text, or signal role in Claymorphism & 3D Bubble.",
          "value": "#FFDDD2"
        },
        {
          "id": "clay-coral",
          "name": "Clay Coral",
          "usage": "Clay Coral defines a distinct surface, text, or signal role in Claymorphism & 3D Bubble.",
          "value": "#FF6B4A"
        },
        {
          "id": "clay-teal",
          "name": "Clay Teal",
          "usage": "Clay Teal defines a distinct surface, text, or signal role in Claymorphism & 3D Bubble.",
          "value": "#83C5BE"
        },
        {
          "id": "cloud-base",
          "name": "Cloud Base",
          "usage": "Cloud Base defines a distinct surface, text, or signal role in Claymorphism & 3D Bubble.",
          "value": "#EDF6F9"
        }
      ],
      "characteristics": [
        "Claymorphism & 3D Bubble interprets technique principles.",
        "skeuomorphism lineage informs the composition.",
        "clay material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "handcrafted-indie": {
      "id": "handcrafted-indie",
      "name": "Handcrafted Indie Collage",
      "summary": "Handcrafted Indie Collage applies technique principles and a tactile tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "kraft-paper",
          "name": "Kraft Paper",
          "usage": "Kraft Paper defines a distinct surface, text, or signal role in Handcrafted Indie Collage.",
          "value": "#F4ECD8"
        },
        {
          "id": "masking-tape",
          "name": "Masking Tape",
          "usage": "Masking Tape defines a distinct surface, text, or signal role in Handcrafted Indie Collage.",
          "value": "rgba(255, 222, 89, 0.7)"
        },
        {
          "id": "stamp-red",
          "name": "Stamp Red",
          "usage": "Stamp Red defines a distinct surface, text, or signal role in Handcrafted Indie Collage.",
          "value": "#B91C1C"
        },
        {
          "id": "pencil-charcoal",
          "name": "Pencil Charcoal",
          "usage": "Pencil Charcoal defines a distinct surface, text, or signal role in Handcrafted Indie Collage.",
          "value": "#2D3748"
        }
      ],
      "characteristics": [
        "Handcrafted Indie Collage interprets technique principles.",
        "indie craft lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "solarpunk-eco": {
      "id": "solarpunk-eco",
      "name": "Solarpunk Eco-Futurism",
      "summary": "Solarpunk Eco-Futurism applies speculative principles and a optimistic tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "solar-gold",
          "name": "Solar Gold",
          "usage": "Solar Gold defines a distinct surface, text, or signal role in Solarpunk Eco-Futurism.",
          "value": "#F59E0B"
        },
        {
          "id": "forest-bio",
          "name": "Forest Bio",
          "usage": "Forest Bio defines a distinct surface, text, or signal role in Solarpunk Eco-Futurism.",
          "value": "#065F46"
        },
        {
          "id": "clean-emerald",
          "name": "Clean Emerald",
          "usage": "Clean Emerald defines a distinct surface, text, or signal role in Solarpunk Eco-Futurism.",
          "value": "#10B981"
        },
        {
          "id": "warm-parchment",
          "name": "Warm Parchment",
          "usage": "Warm Parchment defines a distinct surface, text, or signal role in Solarpunk Eco-Futurism.",
          "value": "#FEF3C7"
        }
      ],
      "characteristics": [
        "Solarpunk Eco-Futurism interprets speculative principles.",
        "eco futurism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a optimistic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "bauhaus-geometry": {
      "id": "bauhaus-geometry",
      "name": "Bauhaus Geometric Typography",
      "summary": "Bauhaus Geometric Typography applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "workshop-cream",
          "name": "Workshop Cream",
          "usage": "Workshop Cream defines a distinct surface, text, or signal role in Bauhaus Geometric Typography.",
          "value": "#F4EBD0"
        },
        {
          "id": "signal-red",
          "name": "Signal Red",
          "usage": "Signal Red defines a distinct surface, text, or signal role in Bauhaus Geometric Typography.",
          "value": "#C9232C"
        },
        {
          "id": "construction-blue",
          "name": "Construction Blue",
          "usage": "Construction Blue defines a distinct surface, text, or signal role in Bauhaus Geometric Typography.",
          "value": "#174EA6"
        },
        {
          "id": "type-black",
          "name": "Type Black",
          "usage": "Type Black defines a distinct surface, text, or signal role in Bauhaus Geometric Typography.",
          "value": "#171717"
        }
      ],
      "characteristics": [
        "Bauhaus Geometric Typography interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "de-stijl": {
      "id": "de-stijl",
      "name": "De Stijl Neo-Plasticism",
      "summary": "De Stijl Neo-Plasticism applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "gallery-white",
          "name": "Gallery White",
          "usage": "Gallery White defines a distinct surface, text, or signal role in De Stijl Neo-Plasticism.",
          "value": "#F7F5ED"
        },
        {
          "id": "primary-red",
          "name": "Primary Red",
          "usage": "Primary Red defines a distinct surface, text, or signal role in De Stijl Neo-Plasticism.",
          "value": "#D0021B"
        },
        {
          "id": "primary-blue",
          "name": "Primary Blue",
          "usage": "Primary Blue defines a distinct surface, text, or signal role in De Stijl Neo-Plasticism.",
          "value": "#0057A8"
        },
        {
          "id": "orthogonal-black",
          "name": "Orthogonal Black",
          "usage": "Orthogonal Black defines a distinct surface, text, or signal role in De Stijl Neo-Plasticism.",
          "value": "#111111"
        }
      ],
      "characteristics": [
        "De Stijl Neo-Plasticism interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "flat-design": {
      "id": "flat-design",
      "name": "Flat Design 2.0",
      "summary": "Flat Design 2.0 applies interface language principles and a friendly tone within International Typographic Style.",
      "palette": [
        {
          "id": "app-blue",
          "name": "App Blue",
          "usage": "App Blue defines a distinct surface, text, or signal role in Flat Design 2.0.",
          "value": "#006BB6"
        },
        {
          "id": "state-orange",
          "name": "State Orange",
          "usage": "State Orange defines a distinct surface, text, or signal role in Flat Design 2.0.",
          "value": "#C53D00"
        },
        {
          "id": "panel-mist",
          "name": "Panel Mist",
          "usage": "Panel Mist defines a distinct surface, text, or signal role in Flat Design 2.0.",
          "value": "#E7EEF7"
        },
        {
          "id": "navy-copy",
          "name": "Navy Copy",
          "usage": "Navy Copy defines a distinct surface, text, or signal role in Flat Design 2.0.",
          "value": "#102A43"
        }
      ],
      "characteristics": [
        "Flat Design 2.0 interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "constructivist": {
      "id": "constructivist",
      "name": "Constructivist Agitprop",
      "summary": "Constructivist Agitprop applies historical movement principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "newsprint-cream",
          "name": "Newsprint Cream",
          "usage": "Newsprint Cream defines a distinct surface, text, or signal role in Constructivist Agitprop.",
          "value": "#F2E5C8"
        },
        {
          "id": "agit-red",
          "name": "Agit Red",
          "usage": "Agit Red defines a distinct surface, text, or signal role in Constructivist Agitprop.",
          "value": "#B9141A"
        },
        {
          "id": "press-black",
          "name": "Press Black",
          "usage": "Press Black defines a distinct surface, text, or signal role in Constructivist Agitprop.",
          "value": "#1A120E"
        },
        {
          "id": "deep-red",
          "name": "Deep Red",
          "usage": "Deep Red defines a distinct surface, text, or signal role in Constructivist Agitprop.",
          "value": "#5C0B0F"
        }
      ],
      "characteristics": [
        "Constructivist Agitprop interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "punk-zine": {
      "id": "punk-zine",
      "name": "Punk Xerox Zine",
      "summary": "Punk Xerox Zine applies revival principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "copy-paper",
          "name": "Copy Paper",
          "usage": "Copy Paper defines a distinct surface, text, or signal role in Punk Xerox Zine.",
          "value": "#F3F0E8"
        },
        {
          "id": "xerox-black",
          "name": "Xerox Black",
          "usage": "Xerox Black defines a distinct surface, text, or signal role in Punk Xerox Zine.",
          "value": "#111111"
        },
        {
          "id": "staple-red",
          "name": "Staple Red",
          "usage": "Staple Red defines a distinct surface, text, or signal role in Punk Xerox Zine.",
          "value": "#A90F32"
        },
        {
          "id": "bruise-violet",
          "name": "Bruise Violet",
          "usage": "Bruise Violet defines a distinct surface, text, or signal role in Punk Xerox Zine.",
          "value": "#532B78"
        }
      ],
      "characteristics": [
        "Punk Xerox Zine interprets revival principles.",
        "postmodernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "material-design": {
      "id": "material-design",
      "name": "Material Design Paper System",
      "summary": "Material Design Paper System applies interface language principles and a professional tone within Depth & Materiality.",
      "palette": [
        {
          "id": "surface-white",
          "name": "Surface White",
          "usage": "Surface White defines a distinct surface, text, or signal role in Material Design Paper System.",
          "value": "#FFFFFF"
        },
        {
          "id": "action-blue",
          "name": "Action Blue",
          "usage": "Action Blue defines a distinct surface, text, or signal role in Material Design Paper System.",
          "value": "#005BBB"
        },
        {
          "id": "state-violet",
          "name": "State Violet",
          "usage": "State Violet defines a distinct surface, text, or signal role in Material Design Paper System.",
          "value": "#8A3FFC"
        },
        {
          "id": "content-ink",
          "name": "Content Ink",
          "usage": "Content Ink defines a distinct surface, text, or signal role in Material Design Paper System.",
          "value": "#17212B"
        }
      ],
      "characteristics": [
        "Material Design Paper System interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a professional product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "liquid-glass": {
      "id": "liquid-glass",
      "name": "Liquid Glass Interface",
      "summary": "Liquid Glass Interface applies interface language principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "deep-content",
          "name": "Deep Content",
          "usage": "Deep Content defines a distinct surface, text, or signal role in Liquid Glass Interface.",
          "value": "#081A2C"
        },
        {
          "id": "glass-control",
          "name": "Glass Control",
          "usage": "Glass Control defines a distinct surface, text, or signal role in Liquid Glass Interface.",
          "value": "#102D46"
        },
        {
          "id": "lens-cyan",
          "name": "Lens Cyan",
          "usage": "Lens Cyan defines a distinct surface, text, or signal role in Liquid Glass Interface.",
          "value": "#70D7FF"
        },
        {
          "id": "mint-refraction",
          "name": "Mint Refraction",
          "usage": "Mint Refraction defines a distinct surface, text, or signal role in Liquid Glass Interface.",
          "value": "#A5FFDF"
        }
      ],
      "characteristics": [
        "Liquid Glass Interface interprets interface language principles.",
        "minimalism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "art-deco": {
      "id": "art-deco",
      "name": "Art Deco Machine Age",
      "summary": "Art Deco Machine Age applies historical movement principles and a luxurious tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "lacquer-black",
          "name": "Lacquer Black",
          "usage": "Lacquer Black defines a distinct surface, text, or signal role in Art Deco Machine Age.",
          "value": "#15120E"
        },
        {
          "id": "champagne-gold",
          "name": "Champagne Gold",
          "usage": "Champagne Gold defines a distinct surface, text, or signal role in Art Deco Machine Age.",
          "value": "#E1C36B"
        },
        {
          "id": "ivory-letter",
          "name": "Ivory Letter",
          "usage": "Ivory Letter defines a distinct surface, text, or signal role in Art Deco Machine Age.",
          "value": "#FFF4D6"
        },
        {
          "id": "machine-copper",
          "name": "Machine Copper",
          "usage": "Machine Copper defines a distinct surface, text, or signal role in Art Deco Machine Age.",
          "value": "#C96D2D"
        }
      ],
      "characteristics": [
        "Art Deco Machine Age interprets historical movement principles.",
        "art deco lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a luxurious product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "psychedelic-poster": {
      "id": "psychedelic-poster",
      "name": "Psychedelic Poster",
      "summary": "Psychedelic Poster applies revival principles and a immersive tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "night-violet",
          "name": "Night Violet",
          "usage": "Night Violet defines a distinct surface, text, or signal role in Psychedelic Poster.",
          "value": "#241044"
        },
        {
          "id": "tangerine-wave",
          "name": "Tangerine Wave",
          "usage": "Tangerine Wave defines a distinct surface, text, or signal role in Psychedelic Poster.",
          "value": "#FF6A00"
        },
        {
          "id": "mint-counter",
          "name": "Mint Counter",
          "usage": "Mint Counter defines a distinct surface, text, or signal role in Psychedelic Poster.",
          "value": "#63E6BE"
        },
        {
          "id": "sun-yellow",
          "name": "Sun Yellow",
          "usage": "Sun Yellow defines a distinct surface, text, or signal role in Psychedelic Poster.",
          "value": "#F7C948"
        }
      ],
      "characteristics": [
        "Psychedelic Poster interprets revival principles.",
        "psychedelia lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a immersive product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "art-nouveau": {
      "id": "art-nouveau",
      "name": "Art Nouveau Whiplash",
      "summary": "Art Nouveau Whiplash applies historical movement principles and a organic tone within Editorial & Organic.",
      "palette": [
        {
          "id": "parchment",
          "name": "Parchment",
          "usage": "Parchment defines a distinct surface, text, or signal role in Art Nouveau Whiplash.",
          "value": "#F3E7D5"
        },
        {
          "id": "stem-green",
          "name": "Stem Green",
          "usage": "Stem Green defines a distinct surface, text, or signal role in Art Nouveau Whiplash.",
          "value": "#356B4B"
        },
        {
          "id": "petal-rose",
          "name": "Petal Rose",
          "usage": "Petal Rose defines a distinct surface, text, or signal role in Art Nouveau Whiplash.",
          "value": "#9A3F58"
        },
        {
          "id": "leaf-ink",
          "name": "Leaf Ink",
          "usage": "Leaf Ink defines a distinct surface, text, or signal role in Art Nouveau Whiplash.",
          "value": "#203A2D"
        }
      ],
      "characteristics": [
        "Art Nouveau Whiplash interprets historical movement principles.",
        "art nouveau lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a organic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "risograph": {
      "id": "risograph",
      "name": "Risograph Editorial",
      "summary": "Risograph Editorial applies technique principles and a playful tone within Editorial & Organic.",
      "palette": [
        {
          "id": "uncoated-paper",
          "name": "Uncoated Paper",
          "usage": "Uncoated Paper defines a distinct surface, text, or signal role in Risograph Editorial.",
          "value": "#F4EAD4"
        },
        {
          "id": "fluoro-pink",
          "name": "Fluoro Pink",
          "usage": "Fluoro Pink defines a distinct surface, text, or signal role in Risograph Editorial.",
          "value": "#D92E5B"
        },
        {
          "id": "riso-teal",
          "name": "Riso Teal",
          "usage": "Riso Teal defines a distinct surface, text, or signal role in Risograph Editorial.",
          "value": "#00788A"
        },
        {
          "id": "overprint-navy",
          "name": "Overprint Navy",
          "usage": "Overprint Navy defines a distinct surface, text, or signal role in Risograph Editorial.",
          "value": "#172B40"
        }
      ],
      "characteristics": [
        "Risograph Editorial interprets technique principles.",
        "risograph print lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "metro-interface": {
      "id": "metro-interface",
      "name": "Metro Tile Interface",
      "summary": "Metro Tile Interface applies interface language principles and a energetic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "panorama-ink",
          "name": "Panorama Ink",
          "usage": "Panorama Ink defines a distinct surface, text, or signal role in Metro Tile Interface.",
          "value": "#101820"
        },
        {
          "id": "metro-blue",
          "name": "Metro Blue",
          "usage": "Metro Blue defines a distinct surface, text, or signal role in Metro Tile Interface.",
          "value": "#0078D4"
        },
        {
          "id": "signal-orange",
          "name": "Signal Orange",
          "usage": "Signal Orange defines a distinct surface, text, or signal role in Metro Tile Interface.",
          "value": "#C43E00"
        },
        {
          "id": "type-white",
          "name": "Type White",
          "usage": "Type White defines a distinct surface, text, or signal role in Metro Tile Interface.",
          "value": "#FFFFFF"
        }
      ],
      "characteristics": [
        "Metro Tile Interface interprets interface language principles.",
        "microsoft design lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "ulm-rationalism": {
      "id": "ulm-rationalism",
      "name": "Ulm Rationalism",
      "summary": "Ulm Rationalism applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Ulm Rationalism.",
          "value": "#F3F0E7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Ulm Rationalism.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Ulm Rationalism.",
          "value": "#C7392F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Ulm Rationalism.",
          "value": "#1E5572"
        }
      ],
      "characteristics": [
        "Ulm Rationalism interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "swiss-poster": {
      "id": "swiss-poster",
      "name": "Swiss Poster",
      "summary": "Swiss Poster applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Swiss Poster.",
          "value": "#F6F3EA"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Swiss Poster.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Swiss Poster.",
          "value": "#E23B2E"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Swiss Poster.",
          "value": "#164C8C"
        }
      ],
      "characteristics": [
        "Swiss Poster interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "dutch-total-design": {
      "id": "dutch-total-design",
      "name": "Dutch Total Design",
      "summary": "Dutch Total Design applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Dutch Total Design.",
          "value": "#F2F5F3"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Dutch Total Design.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Dutch Total Design.",
          "value": "#D12A27"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Dutch Total Design.",
          "value": "#176B62"
        }
      ],
      "characteristics": [
        "Dutch Total Design interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "new-wave-typography": {
      "id": "new-wave-typography",
      "name": "New Wave Typography",
      "summary": "New Wave Typography applies historical movement principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in New Wave Typography.",
          "value": "#F8F1DF"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in New Wave Typography.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in New Wave Typography.",
          "value": "#E6472F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in New Wave Typography.",
          "value": "#5546A9"
        }
      ],
      "characteristics": [
        "New Wave Typography interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "modular-grid-system": {
      "id": "modular-grid-system",
      "name": "Modular Grid System",
      "summary": "Modular Grid System applies interface language principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Modular Grid System.",
          "value": "#F7F8F6"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Modular Grid System.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Modular Grid System.",
          "value": "#1E5C8A"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Modular Grid System.",
          "value": "#D84A2F"
        }
      ],
      "characteristics": [
        "Modular Grid System interprets interface language principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "functional-wayfinding": {
      "id": "functional-wayfinding",
      "name": "Functional Wayfinding",
      "summary": "Functional Wayfinding applies interface language principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Functional Wayfinding.",
          "value": "#F5F4EE"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Functional Wayfinding.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Functional Wayfinding.",
          "value": "#005F73"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Functional Wayfinding.",
          "value": "#D94829"
        }
      ],
      "characteristics": [
        "Functional Wayfinding interprets interface language principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "japanese-ma-minimal": {
      "id": "japanese-ma-minimal",
      "name": "Japanese Ma Minimalism",
      "summary": "Japanese Ma Minimalism applies interface language principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Japanese Ma Minimalism.",
          "value": "#F5F1E8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Japanese Ma Minimalism.",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Japanese Ma Minimalism.",
          "value": "#8E2F2A"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Japanese Ma Minimalism.",
          "value": "#315C52"
        }
      ],
      "characteristics": [
        "Japanese Ma Minimalism interprets interface language principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "scandinavian-functional": {
      "id": "scandinavian-functional",
      "name": "Scandinavian Functionalism",
      "summary": "Scandinavian Functionalism applies interface language principles and a rational tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Scandinavian Functionalism.",
          "value": "#F3F0E8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Scandinavian Functionalism.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Scandinavian Functionalism.",
          "value": "#2E6F62"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Scandinavian Functionalism.",
          "value": "#C54C36"
        }
      ],
      "characteristics": [
        "Scandinavian Functionalism interprets interface language principles.",
        "modernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rational product voice."
      ],
      "cons": [
        "Validate sparse information density and restrained motion against the target audience."
      ]
    },
    "information-isotype": {
      "id": "information-isotype",
      "name": "Isotype Information Design",
      "summary": "Isotype Information Design applies technique principles and a rebellious tone within International Typographic Style.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Isotype Information Design.",
          "value": "#F4EEDC"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Isotype Information Design.",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Isotype Information Design.",
          "value": "#C9362B"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Isotype Information Design.",
          "value": "#1D6284"
        }
      ],
      "characteristics": [
        "Isotype Information Design interprets technique principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "web-brutalism": {
      "id": "web-brutalism",
      "name": "Web Brutalism",
      "summary": "Web Brutalism applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Web Brutalism.",
          "value": "#F4F4F0"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Web Brutalism.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Web Brutalism.",
          "value": "#0000EE"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Web Brutalism.",
          "value": "#D90000"
        }
      ],
      "characteristics": [
        "Web Brutalism interprets technique principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "anti-design": {
      "id": "anti-design",
      "name": "Anti-Design",
      "summary": "Anti-Design applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Anti-Design.",
          "value": "#FFF36D"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Anti-Design.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Anti-Design.",
          "value": "#E1197B"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Anti-Design.",
          "value": "#1637D6"
        }
      ],
      "characteristics": [
        "Anti-Design interprets technique principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "dada-collage": {
      "id": "dada-collage",
      "name": "Dada Collage",
      "summary": "Dada Collage applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Dada Collage.",
          "value": "#EFE5D2"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Dada Collage.",
          "value": "#FFF9EC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Dada Collage.",
          "value": "#B51F2A"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Dada Collage.",
          "value": "#245071"
        }
      ],
      "characteristics": [
        "Dada Collage interprets technique principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "grunge-typography": {
      "id": "grunge-typography",
      "name": "Grunge Typography",
      "summary": "Grunge Typography applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Grunge Typography.",
          "value": "#171310"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Grunge Typography.",
          "value": "#241E1A"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Grunge Typography.",
          "value": "#E8502E"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Grunge Typography.",
          "value": "#D6B743"
        }
      ],
      "characteristics": [
        "Grunge Typography interprets technique principles.",
        "brutalism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "industrial-stencil": {
      "id": "industrial-stencil",
      "name": "Industrial Stencil",
      "summary": "Industrial Stencil applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Industrial Stencil.",
          "value": "#121516"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Industrial Stencil.",
          "value": "#24292A"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Industrial Stencil.",
          "value": "#F2B705"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Industrial Stencil.",
          "value": "#D9432F"
        }
      ],
      "characteristics": [
        "Industrial Stencil interprets technique principles.",
        "brutalism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "monochrome-xerox": {
      "id": "monochrome-xerox",
      "name": "Monochrome Photocopy",
      "summary": "Monochrome Photocopy applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Monochrome Photocopy.",
          "value": "#111111"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Monochrome Photocopy.",
          "value": "#202020"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Monochrome Photocopy.",
          "value": "#F1F1E8"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Monochrome Photocopy.",
          "value": "#A8A8A0"
        }
      ],
      "characteristics": [
        "Monochrome Photocopy interprets technique principles.",
        "brutalism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "glitch-brutalism": {
      "id": "glitch-brutalism",
      "name": "Glitch Brutalism",
      "summary": "Glitch Brutalism applies technique principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Glitch Brutalism.",
          "value": "#0D1014"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Glitch Brutalism.",
          "value": "#171C23"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Glitch Brutalism.",
          "value": "#00F0FF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Glitch Brutalism.",
          "value": "#FF2B6A"
        }
      ],
      "characteristics": [
        "Glitch Brutalism interprets technique principles.",
        "brutalism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "maximalist-chaos": {
      "id": "maximalist-chaos",
      "name": "Maximalist Chaos",
      "summary": "Maximalist Chaos applies microtrend principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Maximalist Chaos.",
          "value": "#15101C"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Maximalist Chaos.",
          "value": "#281D33"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Maximalist Chaos.",
          "value": "#FF4E00"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Maximalist Chaos.",
          "value": "#C7FF00"
        }
      ],
      "characteristics": [
        "Maximalist Chaos interprets microtrend principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "black-metal-editorial": {
      "id": "black-metal-editorial",
      "name": "Black Metal Editorial",
      "summary": "Black Metal Editorial applies microtrend principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Black Metal Editorial.",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Black Metal Editorial.",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Black Metal Editorial.",
          "value": "#E8E5DC"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Black Metal Editorial.",
          "value": "#8D1D24"
        }
      ],
      "characteristics": [
        "Black Metal Editorial interprets microtrend principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "concrete-interface": {
      "id": "concrete-interface",
      "name": "Concrete Interface",
      "summary": "Concrete Interface applies microtrend principles and a rebellious tone within Brutalism & Neo-Brutalism.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Concrete Interface.",
          "value": "#161819"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Concrete Interface.",
          "value": "#282B2D"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Concrete Interface.",
          "value": "#E3A72F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Concrete Interface.",
          "value": "#BFC6C8"
        }
      ],
      "characteristics": [
        "Concrete Interface interprets microtrend principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "paper-cut-layers": {
      "id": "paper-cut-layers",
      "name": "Paper-cut Layers",
      "summary": "Paper-cut Layers applies microtrend principles and a rebellious tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Paper-cut Layers.",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Paper-cut Layers.",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Paper-cut Layers.",
          "value": "#F97316"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Paper-cut Layers.",
          "value": "#38BDF8"
        }
      ],
      "characteristics": [
        "Paper-cut Layers interprets microtrend principles.",
        "brutalism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a rebellious product voice."
      ],
      "cons": [
        "Validate maximal information density and intense motion against the target audience."
      ]
    },
    "acrylic-ui": {
      "id": "acrylic-ui",
      "name": "Acrylic Material UI",
      "summary": "Acrylic Material UI applies interface language principles and a professional tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Acrylic Material UI.",
          "value": "#E8F0F7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Acrylic Material UI.",
          "value": "#F8FBFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Acrylic Material UI.",
          "value": "#176B87"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Acrylic Material UI.",
          "value": "#7C3AED"
        }
      ],
      "characteristics": [
        "Acrylic Material UI interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a professional product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "mica-surface": {
      "id": "mica-surface",
      "name": "Mica Material",
      "summary": "Mica Material applies interface language principles and a professional tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Mica Material.",
          "value": "#E9EDF3"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Mica Material.",
          "value": "#F9FAFC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Mica Material.",
          "value": "#315F9B"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Mica Material.",
          "value": "#A43B63"
        }
      ],
      "characteristics": [
        "Mica Material interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a professional product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "holographic-foil": {
      "id": "holographic-foil",
      "name": "Holographic Foil",
      "summary": "Holographic Foil applies interface language principles and a professional tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Holographic Foil.",
          "value": "#F0EDF7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Holographic Foil.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Holographic Foil.",
          "value": "#7C3AED"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Holographic Foil.",
          "value": "#008A9A"
        }
      ],
      "characteristics": [
        "Holographic Foil interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a professional product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "chrome-metal-ui": {
      "id": "chrome-metal-ui",
      "name": "Chrome Metal UI",
      "summary": "Chrome Metal UI applies interface language principles and a professional tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Chrome Metal UI.",
          "value": "#E7EBEF"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Chrome Metal UI.",
          "value": "#FAFBFC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Chrome Metal UI.",
          "value": "#285E75"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Chrome Metal UI.",
          "value": "#A2384D"
        }
      ],
      "characteristics": [
        "Chrome Metal UI interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a professional product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "iridescent-mesh": {
      "id": "iridescent-mesh",
      "name": "Iridescent Mesh",
      "summary": "Iridescent Mesh applies technique principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Iridescent Mesh.",
          "value": "#0D1020"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Iridescent Mesh.",
          "value": "#191D31"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Iridescent Mesh.",
          "value": "#7C5CFC"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Iridescent Mesh.",
          "value": "#24D6C8"
        }
      ],
      "characteristics": [
        "Iridescent Mesh interprets technique principles.",
        "retrofuturism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "isometric-depth": {
      "id": "isometric-depth",
      "name": "Isometric Depth",
      "summary": "Isometric Depth applies technique principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Isometric Depth.",
          "value": "#111827"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Isometric Depth.",
          "value": "#1F2937"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Isometric Depth.",
          "value": "#38BDF8"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Isometric Depth.",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "Isometric Depth interprets technique principles.",
        "retrofuturism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "low-poly-interface": {
      "id": "low-poly-interface",
      "name": "Low-poly Interface",
      "summary": "Low-poly Interface applies technique principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Low-poly Interface.",
          "value": "#10151D"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Low-poly Interface.",
          "value": "#1C2530"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Low-poly Interface.",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Low-poly Interface.",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "Low-poly Interface interprets technique principles.",
        "retrofuturism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "soft-plastic": {
      "id": "soft-plastic",
      "name": "Soft Plastic",
      "summary": "Soft Plastic applies technique principles and a futuristic tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Soft Plastic.",
          "value": "#171225"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Soft Plastic.",
          "value": "#28203B"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Soft Plastic.",
          "value": "#A78BFA"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Soft Plastic.",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "Soft Plastic interprets technique principles.",
        "retrofuturism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "embossed-letterpress": {
      "id": "embossed-letterpress",
      "name": "Embossed Letterpress",
      "summary": "Embossed Letterpress applies historical movement principles and a tactile tone within Depth & Materiality.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Embossed Letterpress.",
          "value": "#F1E9D8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Embossed Letterpress.",
          "value": "#FFFDF7"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Embossed Letterpress.",
          "value": "#8D3A2D"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Embossed Letterpress.",
          "value": "#315B55"
        }
      ],
      "characteristics": [
        "Embossed Letterpress interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "mid-century-modern": {
      "id": "mid-century-modern",
      "name": "Mid-century Modern",
      "summary": "Mid-century Modern applies historical movement principles and a tactile tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Mid-century Modern.",
          "value": "#F1E3C6"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Mid-century Modern.",
          "value": "#FFF7E8"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Mid-century Modern.",
          "value": "#C84D32"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Mid-century Modern.",
          "value": "#276D67"
        }
      ],
      "characteristics": [
        "Mid-century Modern interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "atomic-age": {
      "id": "atomic-age",
      "name": "Atomic Age",
      "summary": "Atomic Age applies historical movement principles and a tactile tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Atomic Age.",
          "value": "#F5E7C8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Atomic Age.",
          "value": "#FFF9EA"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Atomic Age.",
          "value": "#D44936"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Atomic Age.",
          "value": "#216B78"
        }
      ],
      "characteristics": [
        "Atomic Age interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "pop-art-halftone": {
      "id": "pop-art-halftone",
      "name": "Pop Art Halftone",
      "summary": "Pop Art Halftone applies historical movement principles and a tactile tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Pop Art Halftone.",
          "value": "#F8E65B"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Pop Art Halftone.",
          "value": "#FFFBEA"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Pop Art Halftone.",
          "value": "#E31B36"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Pop Art Halftone.",
          "value": "#1757A6"
        }
      ],
      "characteristics": [
        "Pop Art Halftone interprets historical movement principles.",
        "modernism lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "op-art": {
      "id": "op-art",
      "name": "Op Art",
      "summary": "Op Art applies historical movement principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Op Art.",
          "value": "#090909"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Op Art.",
          "value": "#181818"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Op Art.",
          "value": "#F8F8F2"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Op Art.",
          "value": "#FF3B30"
        }
      ],
      "characteristics": [
        "Op Art interprets historical movement principles.",
        "postmodernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "space-age": {
      "id": "space-age",
      "name": "Space Age",
      "summary": "Space Age applies historical movement principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Space Age.",
          "value": "#0C1630"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Space Age.",
          "value": "#162445"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Space Age.",
          "value": "#FF7A59"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Space Age.",
          "value": "#63E6E2"
        }
      ],
      "characteristics": [
        "Space Age interprets historical movement principles.",
        "postmodernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "disco-glam": {
      "id": "disco-glam",
      "name": "Disco Glam",
      "summary": "Disco Glam applies historical movement principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Disco Glam.",
          "value": "#180D25"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Disco Glam.",
          "value": "#2A1740"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Disco Glam.",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Disco Glam.",
          "value": "#EC4899"
        }
      ],
      "characteristics": [
        "Disco Glam interprets historical movement principles.",
        "postmodernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "seventies-groovy": {
      "id": "seventies-groovy",
      "name": "1970s Groovy",
      "summary": "1970s Groovy applies historical movement principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in 1970s Groovy.",
          "value": "#25150E"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in 1970s Groovy.",
          "value": "#382319"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in 1970s Groovy.",
          "value": "#F07A24"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in 1970s Groovy.",
          "value": "#B8C33D"
        }
      ],
      "characteristics": [
        "1970s Groovy interprets historical movement principles.",
        "postmodernism lineage informs the composition.",
        "flat material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "eighties-new-wave": {
      "id": "eighties-new-wave",
      "name": "1980s New Wave",
      "summary": "1980s New Wave applies revival principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in 1980s New Wave.",
          "value": "#101225"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in 1980s New Wave.",
          "value": "#1C2040"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in 1980s New Wave.",
          "value": "#FF3D81"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in 1980s New Wave.",
          "value": "#36E2E2"
        }
      ],
      "characteristics": [
        "1980s New Wave interprets revival principles.",
        "postmodernism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "retro-computing": {
      "id": "retro-computing",
      "name": "Retro Computing",
      "summary": "Retro Computing applies revival principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Retro Computing.",
          "value": "#08130F"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Retro Computing.",
          "value": "#10221A"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Retro Computing.",
          "value": "#7CFF8A"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Retro Computing.",
          "value": "#F5C451"
        }
      ],
      "characteristics": [
        "Retro Computing interprets revival principles.",
        "postmodernism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "pulp-comic": {
      "id": "pulp-comic",
      "name": "Pulp Comic",
      "summary": "Pulp Comic applies revival principles and a energetic tone within Retro & Pop Architecture.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Pulp Comic.",
          "value": "#1B1110"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Pulp Comic.",
          "value": "#2D1D19"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Pulp Comic.",
          "value": "#F3C640"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Pulp Comic.",
          "value": "#D93232"
        }
      ],
      "characteristics": [
        "Pulp Comic interprets revival principles.",
        "postmodernism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "newspaper-broadsheet": {
      "id": "newspaper-broadsheet",
      "name": "Newspaper Broadsheet",
      "summary": "Newspaper Broadsheet applies revival principles and a energetic tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Newspaper Broadsheet.",
          "value": "#151515"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Newspaper Broadsheet.",
          "value": "#222222"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Newspaper Broadsheet.",
          "value": "#F2EDE0"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Newspaper Broadsheet.",
          "value": "#D24A35"
        }
      ],
      "characteristics": [
        "Newspaper Broadsheet interprets revival principles.",
        "postmodernism lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a energetic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "literary-journal": {
      "id": "literary-journal",
      "name": "Literary Journal",
      "summary": "Literary Journal applies interface language principles and a precise tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Literary Journal.",
          "value": "#F3EFE7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Literary Journal.",
          "value": "#FFFCF6"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Literary Journal.",
          "value": "#7A302F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Literary Journal.",
          "value": "#385C55"
        }
      ],
      "characteristics": [
        "Literary Journal interprets interface language principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and none motion against the target audience."
      ]
    },
    "academic-modern": {
      "id": "academic-modern",
      "name": "Academic Modernism",
      "summary": "Academic Modernism applies interface language principles and a precise tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Academic Modernism.",
          "value": "#F5F6F3"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Academic Modernism.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Academic Modernism.",
          "value": "#215F78"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Academic Modernism.",
          "value": "#9A4B2D"
        }
      ],
      "characteristics": [
        "Academic Modernism interprets interface language principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and none motion against the target audience."
      ]
    },
    "archival-museum": {
      "id": "archival-museum",
      "name": "Archival Museum",
      "summary": "Archival Museum applies interface language principles and a precise tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Archival Museum.",
          "value": "#EEECE7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Archival Museum.",
          "value": "#FAF9F6"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Archival Museum.",
          "value": "#4C5F75"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Archival Museum.",
          "value": "#8C4F3D"
        }
      ],
      "characteristics": [
        "Archival Museum interprets interface language principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and none motion against the target audience."
      ]
    },
    "photobook-minimal": {
      "id": "photobook-minimal",
      "name": "Minimal Photobook",
      "summary": "Minimal Photobook applies interface language principles and a precise tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Minimal Photobook.",
          "value": "#F7F7F4"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Minimal Photobook.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Minimal Photobook.",
          "value": "#2E5266"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Minimal Photobook.",
          "value": "#9A483A"
        }
      ],
      "characteristics": [
        "Minimal Photobook interprets interface language principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and none motion against the target audience."
      ]
    },
    "botanical-editorial": {
      "id": "botanical-editorial",
      "name": "Botanical Editorial",
      "summary": "Botanical Editorial applies technique principles and a tactile tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Botanical Editorial.",
          "value": "#EFEBDD"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Botanical Editorial.",
          "value": "#FAF8F0"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Botanical Editorial.",
          "value": "#3F6C4B"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Botanical Editorial.",
          "value": "#A44A3F"
        }
      ],
      "characteristics": [
        "Botanical Editorial interprets technique principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "wabi-sabi-paper": {
      "id": "wabi-sabi-paper",
      "name": "Wabi-sabi Paper",
      "summary": "Wabi-sabi Paper applies technique principles and a tactile tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Wabi-sabi Paper.",
          "value": "#E9E1D2"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Wabi-sabi Paper.",
          "value": "#F8F4EB"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Wabi-sabi Paper.",
          "value": "#725547"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Wabi-sabi Paper.",
          "value": "#3F6559"
        }
      ],
      "characteristics": [
        "Wabi-sabi Paper interprets technique principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "collage-magazine": {
      "id": "collage-magazine",
      "name": "Collage Magazine",
      "summary": "Collage Magazine applies technique principles and a tactile tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Collage Magazine.",
          "value": "#F2E6D4"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Collage Magazine.",
          "value": "#FFF8EC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Collage Magazine.",
          "value": "#C83F49"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Collage Magazine.",
          "value": "#287078"
        }
      ],
      "characteristics": [
        "Collage Magazine interprets technique principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "typographic-poster": {
      "id": "typographic-poster",
      "name": "Typographic Poster",
      "summary": "Typographic Poster applies technique principles and a tactile tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Typographic Poster.",
          "value": "#F4EBDD"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Typographic Poster.",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Typographic Poster.",
          "value": "#B9342E"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Typographic Poster.",
          "value": "#235D73"
        }
      ],
      "characteristics": [
        "Typographic Poster interprets technique principles.",
        "editorial lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for print contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "luxury-serif-minimal": {
      "id": "luxury-serif-minimal",
      "name": "Luxury Serif Minimalism",
      "summary": "Luxury Serif Minimalism applies revival principles and a nostalgic tone within Editorial & Organic.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Luxury Serif Minimalism.",
          "value": "#F4EFE7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Luxury Serif Minimalism.",
          "value": "#FFFCF7"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Luxury Serif Minimalism.",
          "value": "#7A2638"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Luxury Serif Minimalism.",
          "value": "#8A6337"
        }
      ],
      "characteristics": [
        "Luxury Serif Minimalism interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "early-web": {
      "id": "early-web",
      "name": "Early Web",
      "summary": "Early Web applies revival principles and a nostalgic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Early Web.",
          "value": "#F2F2EE"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Early Web.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Early Web.",
          "value": "#0000CC"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Early Web.",
          "value": "#B00000"
        }
      ],
      "characteristics": [
        "Early Web interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "geocities-maximal": {
      "id": "geocities-maximal",
      "name": "GeoCities Maximalism",
      "summary": "GeoCities Maximalism applies revival principles and a nostalgic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in GeoCities Maximalism.",
          "value": "#FFF36A"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in GeoCities Maximalism.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in GeoCities Maximalism.",
          "value": "#D719A4"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in GeoCities Maximalism.",
          "value": "#1648D8"
        }
      ],
      "characteristics": [
        "GeoCities Maximalism interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "aqua-desktop": {
      "id": "aqua-desktop",
      "name": "Aqua Desktop",
      "summary": "Aqua Desktop applies revival principles and a nostalgic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Aqua Desktop.",
          "value": "#EAF6FF"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Aqua Desktop.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Aqua Desktop.",
          "value": "#147BC2"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Aqua Desktop.",
          "value": "#6E3FC7"
        }
      ],
      "characteristics": [
        "Aqua Desktop interprets revival principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for web ui contexts.",
        "Supports a nostalgic product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "luna-desktop": {
      "id": "luna-desktop",
      "name": "Luna Desktop",
      "summary": "Luna Desktop applies revival principles and a friendly tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Luna Desktop.",
          "value": "#E7EEF8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Luna Desktop.",
          "value": "#FAFCFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Luna Desktop.",
          "value": "#275FB5"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Luna Desktop.",
          "value": "#3F8C43"
        }
      ],
      "characteristics": [
        "Luna Desktop interprets revival principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "web2-gloss": {
      "id": "web2-gloss",
      "name": "Web 2.0 Gloss",
      "summary": "Web 2.0 Gloss applies revival principles and a friendly tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Web 2.0 Gloss.",
          "value": "#EEF6FA"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Web 2.0 Gloss.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Web 2.0 Gloss.",
          "value": "#137FB3"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Web 2.0 Gloss.",
          "value": "#D54C32"
        }
      ],
      "characteristics": [
        "Web 2.0 Gloss interprets revival principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "flash-portal": {
      "id": "flash-portal",
      "name": "Flash Portal",
      "summary": "Flash Portal applies revival principles and a friendly tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Flash Portal.",
          "value": "#EEF1F7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Flash Portal.",
          "value": "#FFFFFF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Flash Portal.",
          "value": "#5B45B9"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Flash Portal.",
          "value": "#D04473"
        }
      ],
      "characteristics": [
        "Flash Portal interprets revival principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "blogspot-collage": {
      "id": "blogspot-collage",
      "name": "Blogspot Collage",
      "summary": "Blogspot Collage applies revival principles and a friendly tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Blogspot Collage.",
          "value": "#F3EBDD"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Blogspot Collage.",
          "value": "#FFFDF8"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Blogspot Collage.",
          "value": "#A23A4B"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Blogspot Collage.",
          "value": "#3A6F7B"
        }
      ],
      "characteristics": [
        "Blogspot Collage interprets revival principles.",
        "skeuomorphism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "cyber-y2k": {
      "id": "cyber-y2k",
      "name": "Cyber Y2K",
      "summary": "Cyber Y2K applies microtrend principles and a playful tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Cyber Y2K.",
          "value": "#080B13"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Cyber Y2K.",
          "value": "#151A28"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Cyber Y2K.",
          "value": "#28E1D1"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Cyber Y2K.",
          "value": "#A855F7"
        }
      ],
      "characteristics": [
        "Cyber Y2K interprets microtrend principles.",
        "cyberculture lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "kawaii-pixel-web": {
      "id": "kawaii-pixel-web",
      "name": "Kawaii Pixel Web",
      "summary": "Kawaii Pixel Web applies microtrend principles and a playful tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Kawaii Pixel Web.",
          "value": "#171126"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Kawaii Pixel Web.",
          "value": "#281C3D"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Kawaii Pixel Web.",
          "value": "#FF78B7"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Kawaii Pixel Web.",
          "value": "#62E5DF"
        }
      ],
      "characteristics": [
        "Kawaii Pixel Web interprets microtrend principles.",
        "cyberculture lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "scene-core-web": {
      "id": "scene-core-web",
      "name": "Scene-core Web",
      "summary": "Scene-core Web applies microtrend principles and a playful tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Scene-core Web.",
          "value": "#120E1C"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Scene-core Web.",
          "value": "#24182E"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Scene-core Web.",
          "value": "#C7FF00"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Scene-core Web.",
          "value": "#FF3DA1"
        }
      ],
      "characteristics": [
        "Scene-core Web interprets microtrend principles.",
        "cyberculture lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "mcbling-gloss": {
      "id": "mcbling-gloss",
      "name": "McBling Gloss",
      "summary": "McBling Gloss applies microtrend principles and a playful tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in McBling Gloss.",
          "value": "#1A0E18"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in McBling Gloss.",
          "value": "#301A2B"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in McBling Gloss.",
          "value": "#F4C95D"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in McBling Gloss.",
          "value": "#F062B2"
        }
      ],
      "characteristics": [
        "McBling Gloss interprets microtrend principles.",
        "cyberculture lineage informs the composition.",
        "metal material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for graphic contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate maximal information density and expressive motion against the target audience."
      ]
    },
    "tech-optimism-2000": {
      "id": "tech-optimism-2000",
      "name": "2000s Tech Optimism",
      "summary": "2000s Tech Optimism applies interface language principles and a futuristic tone within Y2K & 2000s Glossy Web.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in 2000s Tech Optimism.",
          "value": "#081528"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in 2000s Tech Optimism.",
          "value": "#102743"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in 2000s Tech Optimism.",
          "value": "#34D5E8"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in 2000s Tech Optimism.",
          "value": "#8FE35F"
        }
      ],
      "characteristics": [
        "2000s Tech Optimism interprets interface language principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "cyberpunk-tactical-hud": {
      "id": "cyberpunk-tactical-hud",
      "name": "Cyberpunk HUD",
      "summary": "Cyberpunk HUD applies interface language principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Cyberpunk HUD.",
          "value": "#060B0E"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Cyberpunk HUD.",
          "value": "#0E171B"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Cyberpunk HUD.",
          "value": "#00E5C7"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Cyberpunk HUD.",
          "value": "#FF4655"
        }
      ],
      "characteristics": [
        "Cyberpunk HUD interprets interface language principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "sci-fi-fui": {
      "id": "sci-fi-fui",
      "name": "Sci-fi FUI",
      "summary": "Sci-fi FUI applies interface language principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Sci-fi FUI.",
          "value": "#071019"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Sci-fi FUI.",
          "value": "#0E1E2A"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Sci-fi FUI.",
          "value": "#46C6FF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Sci-fi FUI.",
          "value": "#FFB347"
        }
      ],
      "characteristics": [
        "Sci-fi FUI interprets interface language principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "terminal-matrix": {
      "id": "terminal-matrix",
      "name": "Terminal Matrix",
      "summary": "Terminal Matrix applies interface language principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Terminal Matrix.",
          "value": "#050A07"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Terminal Matrix.",
          "value": "#0B1510"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Terminal Matrix.",
          "value": "#5CFF79"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Terminal Matrix.",
          "value": "#F4D35E"
        }
      ],
      "characteristics": [
        "Terminal Matrix interprets interface language principles.",
        "cyberculture lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate dense information density and expressive motion against the target audience."
      ]
    },
    "data-dense-dashboard": {
      "id": "data-dense-dashboard",
      "name": "Data-Dense Dashboard",
      "summary": "Data-Dense Dashboard applies interface language principles and a precise tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Data-Dense Dashboard.",
          "value": "#0B1220"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Data-Dense Dashboard.",
          "value": "#151F31"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Data-Dense Dashboard.",
          "value": "#4CC9F0"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Data-Dense Dashboard.",
          "value": "#F59E0B"
        }
      ],
      "characteristics": [
        "Data-Dense Dashboard interprets interface language principles.",
        "grid systems lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "real-time-monitor": {
      "id": "real-time-monitor",
      "name": "Real-Time Monitor",
      "summary": "Real-Time Monitor applies interface language principles and a precise tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Real-Time Monitor.",
          "value": "#08131A"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Real-Time Monitor.",
          "value": "#10242D"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Real-Time Monitor.",
          "value": "#2DD4BF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Real-Time Monitor.",
          "value": "#FB7185"
        }
      ],
      "characteristics": [
        "Real-Time Monitor interprets interface language principles.",
        "grid systems lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "chromatic-aberration": {
      "id": "chromatic-aberration",
      "name": "Chromatic Aberration",
      "summary": "Chromatic Aberration applies interface language principles and a precise tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Chromatic Aberration.",
          "value": "#0B0D18"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Chromatic Aberration.",
          "value": "#171A2A"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Chromatic Aberration.",
          "value": "#33D6FF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Chromatic Aberration.",
          "value": "#FF3E91"
        }
      ],
      "characteristics": [
        "Chromatic Aberration interprets interface language principles.",
        "grid systems lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "generative-grid": {
      "id": "generative-grid",
      "name": "Generative Grid",
      "summary": "Generative Grid applies interface language principles and a precise tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Generative Grid.",
          "value": "#09131F"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Generative Grid.",
          "value": "#132238"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Generative Grid.",
          "value": "#64E572"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Generative Grid.",
          "value": "#F4C95D"
        }
      ],
      "characteristics": [
        "Generative Grid interprets interface language principles.",
        "grid systems lineage informs the composition.",
        "screen material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a precise product voice."
      ],
      "cons": [
        "Validate dense information density and restrained motion against the target audience."
      ]
    },
    "biometric-interface": {
      "id": "biometric-interface",
      "name": "Biometric Interface",
      "summary": "Biometric Interface applies speculative principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Biometric Interface.",
          "value": "#07131A"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Biometric Interface.",
          "value": "#102630"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Biometric Interface.",
          "value": "#35E3C1"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Biometric Interface.",
          "value": "#6CA8FF"
        }
      ],
      "characteristics": [
        "Biometric Interface interprets speculative principles.",
        "retrofuturism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "spatial-glass-ui": {
      "id": "spatial-glass-ui",
      "name": "Spatial Glass UI",
      "summary": "Spatial Glass UI applies speculative principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Spatial Glass UI.",
          "value": "#08101D"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Spatial Glass UI.",
          "value": "#121F31"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Spatial Glass UI.",
          "value": "#79D7FF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Spatial Glass UI.",
          "value": "#A78BFA"
        }
      ],
      "characteristics": [
        "Spatial Glass UI interprets speculative principles.",
        "retrofuturism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "ai-native-gradient": {
      "id": "ai-native-gradient",
      "name": "AI-Native Gradient",
      "summary": "AI-Native Gradient applies speculative principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in AI-Native Gradient.",
          "value": "#0D1022"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in AI-Native Gradient.",
          "value": "#191C35"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in AI-Native Gradient.",
          "value": "#8B7CFF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in AI-Native Gradient.",
          "value": "#38D9C5"
        }
      ],
      "characteristics": [
        "AI-Native Gradient interprets speculative principles.",
        "retrofuturism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "quantum-control": {
      "id": "quantum-control",
      "name": "Quantum Control",
      "summary": "Quantum Control applies speculative principles and a futuristic tone within Hyper-Tech & Kinetic Motion.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Quantum Control.",
          "value": "#080C1B"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Quantum Control.",
          "value": "#121A32"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Quantum Control.",
          "value": "#58E0FF"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Quantum Control.",
          "value": "#FF74C8"
        }
      ],
      "characteristics": [
        "Quantum Control interprets speculative principles.",
        "retrofuturism lineage informs the composition.",
        "glass material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for product ui contexts.",
        "Supports a futuristic product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "inflatable-ui": {
      "id": "inflatable-ui",
      "name": "Inflatable UI",
      "summary": "Inflatable UI applies interface language principles and a friendly tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Inflatable UI.",
          "value": "#F7EAF1"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Inflatable UI.",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Inflatable UI.",
          "value": "#E35D9A"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Inflatable UI.",
          "value": "#4279C6"
        }
      ],
      "characteristics": [
        "Inflatable UI interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "toy-block-ui": {
      "id": "toy-block-ui",
      "name": "Toy-Block UI",
      "summary": "Toy-Block UI applies interface language principles and a friendly tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Toy-Block UI.",
          "value": "#F4EFD9"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Toy-Block UI.",
          "value": "#FFFDF3"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Toy-Block UI.",
          "value": "#E45D3F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Toy-Block UI.",
          "value": "#3277B7"
        }
      ],
      "characteristics": [
        "Toy-Block UI interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "kawaii-pastel": {
      "id": "kawaii-pastel",
      "name": "Kawaii Pastel",
      "summary": "Kawaii Pastel applies interface language principles and a friendly tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Kawaii Pastel.",
          "value": "#F8EAF1"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Kawaii Pastel.",
          "value": "#FFF9FC"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Kawaii Pastel.",
          "value": "#D85F98"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Kawaii Pastel.",
          "value": "#5284C8"
        }
      ],
      "characteristics": [
        "Kawaii Pastel interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "sticker-book": {
      "id": "sticker-book",
      "name": "Sticker Book",
      "summary": "Sticker Book applies interface language principles and a friendly tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Sticker Book.",
          "value": "#F7F0D8"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Sticker Book.",
          "value": "#FFFDF5"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Sticker Book.",
          "value": "#E95843"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Sticker Book.",
          "value": "#3978B9"
        }
      ],
      "characteristics": [
        "Sticker Book interprets interface language principles.",
        "skeuomorphism lineage informs the composition.",
        "plastic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for three d contexts.",
        "Supports a friendly product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "doodle-interface": {
      "id": "doodle-interface",
      "name": "Doodle Interface",
      "summary": "Doodle Interface applies technique principles and a tactile tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Doodle Interface.",
          "value": "#F4ECDD"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Doodle Interface.",
          "value": "#FFFCF5"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Doodle Interface.",
          "value": "#C84D3F"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Doodle Interface.",
          "value": "#3C7081"
        }
      ],
      "characteristics": [
        "Doodle Interface interprets technique principles.",
        "indie craft lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "papercraft-ui": {
      "id": "papercraft-ui",
      "name": "Papercraft UI",
      "summary": "Papercraft UI applies technique principles and a tactile tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Papercraft UI.",
          "value": "#F2E8D5"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Papercraft UI.",
          "value": "#FFF9EF"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Papercraft UI.",
          "value": "#D85B42"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Papercraft UI.",
          "value": "#397777"
        }
      ],
      "characteristics": [
        "Papercraft UI interprets technique principles.",
        "indie craft lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "cozy-knit": {
      "id": "cozy-knit",
      "name": "Cozy Knit",
      "summary": "Cozy Knit applies technique principles and a tactile tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Cozy Knit.",
          "value": "#F0E5D7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Cozy Knit.",
          "value": "#FCF8F1"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Cozy Knit.",
          "value": "#A54B45"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Cozy Knit.",
          "value": "#3F7368"
        }
      ],
      "characteristics": [
        "Cozy Knit interprets technique principles.",
        "indie craft lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "dreamcore-cloud": {
      "id": "dreamcore-cloud",
      "name": "Dreamcore Cloud",
      "summary": "Dreamcore Cloud applies technique principles and a tactile tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Dreamcore Cloud.",
          "value": "#EEEAF3"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Dreamcore Cloud.",
          "value": "#FBF9FD"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Dreamcore Cloud.",
          "value": "#8A5FA8"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Dreamcore Cloud.",
          "value": "#4D7FA3"
        }
      ],
      "characteristics": [
        "Dreamcore Cloud interprets technique principles.",
        "indie craft lineage informs the composition.",
        "paper material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a tactile product voice."
      ],
      "cons": [
        "Validate balanced information density and restrained motion against the target audience."
      ]
    },
    "kidcore-play": {
      "id": "kidcore-play",
      "name": "Kidcore Play",
      "summary": "Kidcore Play applies microtrend principles and a playful tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Kidcore Play.",
          "value": "#FFF0C7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Kidcore Play.",
          "value": "#FFF9E8"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Kidcore Play.",
          "value": "#E84B3C"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Kidcore Play.",
          "value": "#3578C5"
        }
      ],
      "characteristics": [
        "Kidcore Play interprets microtrend principles.",
        "organic modernism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "biomorphic-soft": {
      "id": "biomorphic-soft",
      "name": "Biomorphic Soft",
      "summary": "Biomorphic Soft applies microtrend principles and a playful tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Biomorphic Soft.",
          "value": "#EAF2E7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Biomorphic Soft.",
          "value": "#F9FCF7"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Biomorphic Soft.",
          "value": "#3F8B67"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Biomorphic Soft.",
          "value": "#C35F68"
        }
      ],
      "characteristics": [
        "Biomorphic Soft interprets microtrend principles.",
        "organic modernism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "pastel-gradient": {
      "id": "pastel-gradient",
      "name": "Pastel Gradient",
      "summary": "Pastel Gradient applies microtrend principles and a playful tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Pastel Gradient.",
          "value": "#F3EDF7"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Pastel Gradient.",
          "value": "#FFF9FD"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Pastel Gradient.",
          "value": "#8B63B7"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Pastel Gradient.",
          "value": "#3F819A"
        }
      ],
      "characteristics": [
        "Pastel Gradient interprets microtrend principles.",
        "organic modernism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    },
    "cartoon-dashboard": {
      "id": "cartoon-dashboard",
      "name": "Cartoon Dashboard",
      "summary": "Cartoon Dashboard applies microtrend principles and a playful tone within Soft 3D & Solarpunk.",
      "palette": [
        {
          "id": "canvas",
          "name": "Canvas",
          "usage": "Canvas defines a distinct surface, text, or signal role in Cartoon Dashboard.",
          "value": "#FFF0D0"
        },
        {
          "id": "surface",
          "name": "Surface",
          "usage": "Surface defines a distinct surface, text, or signal role in Cartoon Dashboard.",
          "value": "#FFF9E9"
        },
        {
          "id": "signal",
          "name": "Signal",
          "usage": "Signal defines a distinct surface, text, or signal role in Cartoon Dashboard.",
          "value": "#DF553D"
        },
        {
          "id": "counter-signal",
          "name": "Counter Signal",
          "usage": "Counter Signal defines a distinct surface, text, or signal role in Cartoon Dashboard.",
          "value": "#3476B8"
        }
      ],
      "characteristics": [
        "Cartoon Dashboard interprets microtrend principles.",
        "organic modernism lineage informs the composition.",
        "organic material treatment shapes the visual hierarchy."
      ],
      "pros": [
        "Works well for illustration contexts.",
        "Supports a playful product voice."
      ],
      "cons": [
        "Validate balanced information density and expressive motion against the target audience."
      ]
    }
  },
  "categories": {
    "swiss": {
      "id": "swiss",
      "title": "International Typographic Style",
      "description": "International Typographic Style groups related design movements, interface languages, materials, and production contexts."
    },
    "brutalism": {
      "id": "brutalism",
      "title": "Brutalism & Neo-Brutalism",
      "description": "Brutalism & Neo-Brutalism groups related design movements, interface languages, materials, and production contexts."
    },
    "depth": {
      "id": "depth",
      "title": "Depth & Materiality",
      "description": "Depth & Materiality groups related design movements, interface languages, materials, and production contexts."
    },
    "retro": {
      "id": "retro",
      "title": "Retro & Pop Architecture",
      "description": "Retro & Pop Architecture groups related design movements, interface languages, materials, and production contexts."
    },
    "editorial": {
      "id": "editorial",
      "title": "Editorial & Organic",
      "description": "Editorial & Organic groups related design movements, interface languages, materials, and production contexts."
    },
    "y2k": {
      "id": "y2k",
      "title": "Y2K & 2000s Glossy Web",
      "description": "Y2K & 2000s Glossy Web groups related design movements, interface languages, materials, and production contexts."
    },
    "hypertech": {
      "id": "hypertech",
      "title": "Hyper-Tech & Kinetic Motion",
      "description": "Hyper-Tech & Kinetic Motion groups related design movements, interface languages, materials, and production contexts."
    },
    "soft3d": {
      "id": "soft3d",
      "title": "Soft 3D & Solarpunk",
      "description": "Soft 3D & Solarpunk groups related design movements, interface languages, materials, and production contexts."
    }
  },
  "facets": {
    "kind": {
      "id": "kind",
      "label": "Kind",
      "values": {
        "historical-movement": "Historical movement",
        "revival": "Revival",
        "technique": "Technique",
        "interface-language": "Interface language",
        "microtrend": "Microtrend",
        "speculative": "Speculative"
      }
    },
    "era": {
      "id": "era",
      "label": "Era",
      "values": {
        "pre-1950": "Before 1950",
        "1950s-1970s": "1950s–1970s",
        "1980s-1990s": "1980s–1990s",
        "2000s": "2000s",
        "2010s": "2010s",
        "2020s": "2020s",
        "timeless": "Timeless"
      }
    },
    "lineage": {
      "id": "lineage",
      "label": "Lineage",
      "values": {
        "modernism": "Modernism",
        "international-style": "International style",
        "minimalism": "Minimalism",
        "brutalism": "Brutalism",
        "skeuomorphism": "Skeuomorphism",
        "postmodernism": "Postmodernism",
        "retrofuturism": "Retrofuturism",
        "editorial": "Editorial",
        "organic-modernism": "Organic modernism",
        "cyberculture": "Cyberculture",
        "grid-systems": "Grid systems",
        "indie-craft": "Indie craft",
        "eco-futurism": "Eco-futurism",
        "bauhaus": "Bauhaus",
        "de-stijl": "De Stijl",
        "flat-design": "Flat design",
        "constructivism": "Constructivism",
        "punk-diy": "Punk DIY",
        "material-design": "Material Design",
        "liquid-glass": "Liquid Glass",
        "art-deco": "Art Deco",
        "psychedelia": "Psychedelia",
        "art-nouveau": "Art Nouveau",
        "risograph-print": "Risograph print",
        "microsoft-design": "Microsoft design"
      }
    },
    "media": {
      "id": "media",
      "label": "Media",
      "values": {
        "graphic": "Graphic",
        "print": "Print",
        "web-ui": "Web UI",
        "product-ui": "Product UI",
        "illustration": "Illustration",
        "three-d": "3D"
      }
    },
    "materiality": {
      "id": "materiality",
      "label": "Materiality",
      "values": {
        "flat": "Flat",
        "glass": "Glass",
        "paper": "Paper",
        "ink": "Ink",
        "metal": "Metal",
        "plastic": "Plastic",
        "pixel": "Pixel",
        "clay": "Clay",
        "organic": "Organic",
        "screen": "Screen"
      }
    },
    "density": {
      "id": "density",
      "label": "Density",
      "values": {
        "sparse": "Sparse",
        "balanced": "Balanced",
        "dense": "Dense",
        "maximal": "Maximal"
      }
    },
    "tone": {
      "id": "tone",
      "label": "Tone",
      "values": {
        "rational": "Rational",
        "precise": "Precise",
        "professional": "Professional",
        "rebellious": "Rebellious",
        "playful": "Playful",
        "futuristic": "Futuristic",
        "tactile": "Tactile",
        "nostalgic": "Nostalgic",
        "luxurious": "Luxurious",
        "organic": "Organic",
        "immersive": "Immersive",
        "energetic": "Energetic",
        "friendly": "Friendly",
        "optimistic": "Optimistic"
      }
    },
    "motion": {
      "id": "motion",
      "label": "Motion",
      "values": {
        "none": "None",
        "restrained": "Restrained",
        "expressive": "Expressive",
        "intense": "Intense"
      }
    },
    "region": {
      "id": "region",
      "label": "Region & culture",
      "values": {
        "international": "International",
        "europe": "Europe",
        "north-america": "North America",
        "latin-america": "Latin America",
        "east-asia": "East Asia",
        "south-asia": "South Asia",
        "africa": "Africa",
        "middle-east": "Middle East",
        "oceania": "Oceania",
        "global-internet": "Global internet culture"
      }
    },
    "maturity": {
      "id": "maturity",
      "label": "Maturity",
      "values": {
        "canonical": "Canonical",
        "established": "Established",
        "emerging": "Emerging",
        "experimental": "Experimental"
      }
    }
  }
};

export default Object.freeze(applyEnglishEditorialReview(catalog));
