/**
 * 20종 스타일 전용 핸드크래프트 SVG 아트워크 엔진
 * 이모지나 범용 도형 복제 없이, 각 사조의 고유 조형 언어를 순수 SVG로 구현한다.
 */

export function renderStyleArtwork(styleId, variant = 'hero') {
  const isGame = variant === 'game';

  switch (styleId) {
    case 'swiss-grid':
      return `
        <svg class="art-svg art-swiss" viewBox="0 0 420 280" role="img" aria-label="스위스 그리드 기하 아트워크">
          <rect width="420" height="280" fill="#F4F3EE"/>
          <g stroke="#111111" stroke-width="1" opacity="0.22">
            <line x1="70" y1="0" x2="70" y2="280"/><line x1="140" y1="0" x2="140" y2="280"/>
            <line x1="210" y1="0" x2="210" y2="280"/><line x1="280" y1="0" x2="280" y2="280"/>
            <line x1="350" y1="0" x2="350" y2="280"/>
            <line x1="0" y1="70" x2="420" y2="70"/><line x1="0" y1="140" x2="420" y2="140"/>
            <line x1="0" y1="210" x2="420" y2="210"/>
          </g>
          <rect x="70" y="70" width="140" height="140" fill="#111111"/>
          <circle cx="245" cy="140" r="70" fill="#E6321E"/>
          <rect x="140" y="140" width="70" height="70" fill="#F4F3EE"/>
          <line x1="245" y1="36" x2="245" y2="244" stroke="#111111" stroke-width="1.5"/>
          <line x1="140" y1="140" x2="380" y2="140" stroke="#111111" stroke-width="1.5"/>
          <circle cx="245" cy="140" r="${isGame ? '22' : '14'}" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>
          <circle cx="245" cy="140" r="4" fill="#FFFFFF"/>
          <text x="16" y="30" fill="#111111" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">SYS.01 // 12-COL</text>
          <text x="328" y="264" fill="#111111" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">${isGame ? 'LOCK 04:08' : 'GRID 1957'}</text>
        </svg>`;

    case 'bento-grid':
      return `
        <svg class="art-svg art-bento" viewBox="0 0 420 280" role="img" aria-label="벤토 모듈러 아트워크">
          <rect width="420" height="280" fill="#ECEEF4" rx="20"/>
          <rect x="18" y="18" width="218" height="150" rx="18" fill="#1D1D1F"/>
          <circle cx="72" cy="76" r="28" fill="#0066FF"/>
          <circle cx="102" cy="76" r="28" fill="#5E5CE6" opacity="0.82"/>
          <rect x="38" y="124" width="128" height="10" rx="5" fill="#FFFFFF" opacity="0.9"/>
          <rect x="38" y="142" width="84" height="7" rx="3.5" fill="#FFFFFF" opacity="0.4"/>
          <rect x="248" y="18" width="154" height="70" rx="16" fill="#FFFFFF" stroke="#D8DCE6"/>
          <text x="266" y="47" fill="#6E6E73" font-family="Inter, sans-serif" font-size="10" font-weight="600">${isGame ? 'CORE SHIELD' : 'VELOCITY'}</text>
          <text x="266" y="73" fill="#1D1D1F" font-family="Outfit, sans-serif" font-size="24" font-weight="800">${isGame ? '98.4%' : '120Hz'}</text>
          <rect x="248" y="98" width="154" height="70" rx="16" fill="#0066FF"/>
          <path d="M266 146 L296 126 L326 136 L360 112 L386 120" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="360" cy="112" r="5" fill="#FFFFFF"/>
          <rect x="18" y="180" width="122" height="82" rx="16" fill="#FFFFFF" stroke="#D8DCE6"/>
          <rect x="34" y="200" width="42" height="42" rx="11" fill="#EEF4FF"/>
          <circle cx="55" cy="221" r="10" fill="#0066FF"/>
          <rect x="86" y="208" width="40" height="8" rx="4" fill="#1D1D1F"/>
          <rect x="86" y="224" width="28" height="6" rx="3" fill="#9CA3AF"/>
          <rect x="152" y="180" width="250" height="82" rx="16" fill="#FFFFFF" stroke="#D8DCE6"/>
          <g fill="#0066FF" opacity="0.88">
            <rect x="174" y="226" width="18" height="20" rx="5"/>
            <rect x="202" y="212" width="18" height="34" rx="5"/>
            <rect x="230" y="218" width="18" height="28" rx="5"/>
            <rect x="258" y="198" width="18" height="48" rx="5" fill="#5E5CE6"/>
            <rect x="286" y="206" width="18" height="40" rx="5"/>
            <rect x="314" y="194" width="18" height="52" rx="5" fill="#1D1D1F"/>
            <rect x="342" y="208" width="18" height="38" rx="5"/>
          </g>
        </svg>`;

    case 'glassmorphism':
      return `
        <svg class="art-svg art-glass" viewBox="0 0 420 280" role="img" aria-label="프로스테드 글래스 오로라 아트워크">
          <defs>
            <radialGradient id="g-orb1" cx="30%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#5CE1FF"/>
              <stop offset="100%" stop-color="#1E40AF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="g-orb2" cx="75%" cy="70%" r="60%">
              <stop offset="0%" stop-color="#C084FC"/>
              <stop offset="100%" stop-color="#4C1D95" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="g-pane" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="rgba(255,255,255,0.28)"/>
              <stop offset="100%" stop-color="rgba(255,255,255,0.06)"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="#0D132B"/>
          <circle cx="120" cy="95" r="115" fill="url(#g-orb1)"/>
          <circle cx="315" cy="195" r="120" fill="url(#g-orb2)"/>
          <circle cx="210" cy="140" r="88" fill="none" stroke="rgba(92,225,255,0.35)" stroke-width="1.5" stroke-dasharray="6 6"/>
          <circle cx="210" cy="140" r="56" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          <rect x="76" y="64" width="268" height="152" rx="22" fill="url(#g-pane)" stroke="rgba(255,255,255,0.45)" stroke-width="1.5"/>
          <circle cx="210" cy="140" r="34" fill="rgba(92,225,255,0.24)" stroke="#5CE1FF" stroke-width="2"/>
          <circle cx="210" cy="140" r="12" fill="#F8FAFF"/>
          <line x1="112" y1="140" x2="162" y2="140" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
          <line x1="258" y1="140" x2="308" y2="140" stroke="rgba(255,255,255,0.55)" stroke-width="1.5"/>
          <text x="98" y="92" fill="#F8FAFF" font-family="JetBrains Mono, monospace" font-size="10" opacity="0.8">${isGame ? 'ORBITAL RADAR // 09' : 'OPTICAL DEPTH · 24PX'}</text>
        </svg>`;

    case 'dark-minimal-glass':
      return `
        <svg class="art-svg art-linear" viewBox="0 0 420 280" role="img" aria-label="리니어 다크 테크 아트워크">
          <defs>
            <radialGradient id="lin-spot" cx="50%" cy="15%" r="75%">
              <stop offset="0%" stop-color="rgba(124,140,255,0.28)"/>
              <stop offset="100%" stop-color="rgba(8,9,12,0)"/>
            </radialGradient>
            <linearGradient id="lin-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.1"/>
              <stop offset="50%" stop-color="#7C8CFF"/>
              <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="#08090C"/>
          <rect width="420" height="280" fill="url(#lin-spot)"/>
          <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
            <line x1="0" y1="70" x2="420" y2="70"/><line x1="0" y1="140" x2="420" y2="140"/><line x1="0" y1="210" x2="420" y2="210"/>
            <line x1="105" y1="0" x2="105" y2="280"/><line x1="210" y1="0" x2="210" y2="280"/><line x1="315" y1="0" x2="315" y2="280"/>
          </g>
          <circle cx="210" cy="140" r="78" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <circle cx="210" cy="140" r="46" fill="none" stroke="rgba(124,140,255,0.5)" stroke-width="1.2"/>
          <line x1="110" y1="140" x2="310" y2="140" stroke="url(#lin-stroke)" stroke-width="1.5"/>
          <line x1="210" y1="45" x2="210" y2="235" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
          <polygon points="210,118 228,140 210,162 192,140" fill="rgba(124,140,255,0.2)" stroke="#7C8CFF" stroke-width="1.5"/>
          <circle cx="210" cy="140" r="4" fill="#F2F4F8"/>
          <rect x="24" y="22" width="102" height="24" rx="6" fill="#111318" stroke="rgba(255,255,255,0.12)"/>
          <circle cx="38" cy="34" r="3.5" fill="#38BDF8"/>
          <text x="48" y="38" fill="#D4D8E5" font-family="JetBrains Mono, monospace" font-size="10">${isGame ? 'PING 14ms' : 'SYNC 12ms'}</text>
        </svg>`;

    case 'neumorphism':
      return `
        <svg class="art-svg art-neumo" viewBox="0 0 420 280" role="img" aria-label="소프트 뉴모피즘 촉각 다이얼 아트워크">
          <defs>
            <filter id="nm-out" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="9" dy="9" stdDeviation="8" flood-color="#BCC6D6"/>
              <feDropShadow dx="-8" dy="-8" stdDeviation="8" flood-color="#FFFFFF"/>
            </filter>
          </defs>
          <rect width="420" height="280" fill="#E4E9F2"/>
          <rect x="44" y="32" width="332" height="216" rx="28" fill="#E4E9F2" filter="url(#nm-out)"/>
          <circle cx="210" cy="140" r="72" fill="#DDE3EE" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="210" cy="140" r="56" fill="none" stroke="#CFD7E6" stroke-width="10"/>
          <circle cx="210" cy="140" r="56" fill="none" stroke="#4F6DF5" stroke-width="10" stroke-linecap="round" stroke-dasharray="240 360" transform="rotate(-90 210 140)"/>
          <circle cx="210" cy="140" r="38" fill="#E4E9F2" filter="url(#nm-out)"/>
          <circle cx="210" cy="116" r="5" fill="#4F6DF5"/>
          <text x="210" y="147" text-anchor="middle" fill="#2D3748" font-family="Outfit, sans-serif" font-size="18" font-weight="700">${isGame ? '92%' : '21.5°'}</text>
        </svg>`;

    case 'high-contrast-mono':
      return `
        <svg class="art-svg art-mono" viewBox="0 0 420 280" role="img" aria-label="터미널 모노스페이스 던전 및 CLI 아트워크">
          <rect width="420" height="280" fill="#050805"/>
          <rect x="14" y="14" width="392" height="252" fill="#0A120A" stroke="#1F5C2E" stroke-width="1.5"/>
          <line x1="14" y1="42" x2="406" y2="42" stroke="#1F5C2E" stroke-width="1"/>
          <text x="26" y="32" fill="#22FF66" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">root@kernel:~# ${isGame ? './breach --floor=07' : './monitor --live'}</text>
          <g font-family="JetBrains Mono, monospace" font-size="13" fill="#22FF66">
            <text x="30" y="72">+-----------------------------+</text>
            <text x="30" y="94">| . . . . # # # . . . . . . . |</text>
            <text x="30" y="116">| . @ ---&gt; [ ICE_CORE ] . . . |</text>
            <text x="30" y="138">| . . . . # # # . . * . . . . |</text>
            <text x="30" y="160">+-----------------------------+</text>
          </g>
          <text x="30" y="194" fill="#FFB020" font-family="JetBrains Mono, monospace" font-size="11">[WARN] PORT 443 PACKET SPIKE :: 94.2 Gb/s</text>
          <text x="30" y="218" fill="#6EA87B" font-family="JetBrains Mono, monospace" font-size="11">MEM [████████████████░░░░] 82%  SYNC [OK]</text>
          <rect x="30" y="236" width="10" height="15" fill="#22FF66"/>
          <text x="48" y="248" fill="#D8FFE0" font-family="JetBrains Mono, monospace" font-size="11">AWAITING_INPUT_</text>
        </svg>`;

    case 'skeuomorphism':
      return `
        <svg class="art-svg art-skeuo" viewBox="0 0 420 280" role="img" aria-label="하드웨어 스큐어모피즘 계기판 아트워크">
          <defs>
            <linearGradient id="sk-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3C414B"/>
              <stop offset="50%" stop-color="#2B2F37"/>
              <stop offset="100%" stop-color="#20232A"/>
            </linearGradient>
            <linearGradient id="sk-knob" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#575E6C"/>
              <stop offset="100%" stop-color="#1E2128"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="url(#sk-metal)"/>
          <circle cx="24" cy="24" r="5" fill="#181A1F" stroke="#525866"/><circle cx="396" cy="24" r="5" fill="#181A1F" stroke="#525866"/>
          <circle cx="24" cy="256" r="5" fill="#181A1F" stroke="#525866"/><circle cx="396" cy="256" r="5" fill="#181A1F" stroke="#525866"/>
          <rect x="34" y="42" width="186" height="196" rx="12" fill="#111519" stroke="#454B57" stroke-width="2"/>
          <path d="M52 172 Q86 92 120 144 T198 108" fill="none" stroke="#28E070" stroke-width="2.5"/>
          <line x1="48" y1="140" x2="206" y2="140" stroke="rgba(40,224,112,0.22)" stroke-dasharray="4 4"/>
          <circle cx="52" cy="64" r="5" fill="#28E070"/>
          <text x="66" y="68" fill="#28E070" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">${isGame ? 'LOCK 104.2MHz' : 'CH-01 ACTIVE'}</text>
          <circle cx="310" cy="130" r="62" fill="#1A1D22" stroke="#4C5260" stroke-width="2"/>
          <circle cx="310" cy="130" r="46" fill="url(#sk-knob)" stroke="#687082" stroke-width="1.5"/>
          <line x1="310" y1="130" x2="342" y2="98" stroke="#FF5C1B" stroke-width="4" stroke-linecap="round"/>
          <rect x="258" y="208" width="104" height="28" rx="6" fill="#FF5C1B"/>
          <text x="310" y="226" text-anchor="middle" fill="#FFFFFF" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">ENGAGE</text>
        </svg>`;

    case 'neo-brutalism':
      return `
        <svg class="art-svg art-brutal" viewBox="0 0 420 280" role="img" aria-label="네오 브루탈리즘 팝 폭발 아트워크">
          <rect width="420" height="280" fill="#FFE14D"/>
          <rect x="36" y="34" width="348" height="212" fill="#111111" transform="translate(8,8)"/>
          <rect x="36" y="34" width="348" height="212" fill="#FFFFFF" stroke="#111111" stroke-width="4"/>
          <polygon points="210,48 232,96 286,86 254,132 296,174 238,176 220,228 190,180 132,188 164,140 124,96 180,102" fill="#FF4D6D" stroke="#111111" stroke-width="4" stroke-linejoin="miter"/>
          <polygon points="218,86 188,144 214,144 198,196 244,132 216,132" fill="#FFE14D" stroke="#111111" stroke-width="3.5" stroke-linejoin="miter"/>
          <rect x="52" y="50" width="92" height="32" fill="#38E5B0" stroke="#111111" stroke-width="3" transform="rotate(-4 98 66)"/>
          <text x="98" y="71" text-anchor="middle" fill="#111111" font-family="Syne, sans-serif" font-size="13" font-weight="800" transform="rotate(-4 98 66)">${isGame ? 'KO!!' : 'POP!!'}</text>
          <rect x="284" y="198" width="84" height="30" fill="#111111"/>
          <text x="326" y="217" text-anchor="middle" fill="#FFE14D" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">3PX HARD</text>
        </svg>`;

    case 'high-fashion':
      return `
        <svg class="art-svg art-fashion" viewBox="0 0 420 280" role="img" aria-label="하이패션 에디토리얼 아치 아트워크">
          <rect width="420" height="280" fill="#F3EDE3"/>
          <rect x="22" y="22" width="376" height="236" fill="none" stroke="#1A1614" stroke-width="1"/>
          <path d="M135 258 L135 128 A75 75 0 0 1 285 128 L285 258 Z" fill="#1A1614"/>
          <circle cx="210" cy="112" r="34" fill="#FAF7F2"/>
          <path d="M168 258 Q210 158 252 258 Z" fill="#7D1E2E"/>
          <line x1="22" y1="112" x2="398" y2="112" stroke="#A67C52" stroke-width="1" opacity="0.65"/>
          <line x1="210" y1="22" x2="210" y2="258" stroke="#A67C52" stroke-width="0.8" opacity="0.45"/>
          <text x="42" y="54" fill="#1A1614" font-family="Playfair Display, serif" font-style="italic" font-size="18">Edition IX</text>
          <text x="378" y="54" text-anchor="end" fill="#6B6259" font-family="Inter, sans-serif" font-size="10" letter-spacing="3">${isGame ? 'ACT III' : 'ATELIER'}</text>
        </svg>`;

    case 'bauhaus-geometry':
      return `
        <svg class="art-svg art-bauhaus" viewBox="0 0 420 280" role="img" aria-label="바우하우스 삼원색 기하 아트워크">
          <rect width="420" height="280" fill="#F6F1E5"/>
          <rect x="0" y="0" width="140" height="140" fill="#D92B2B"/>
          <circle cx="255" cy="140" r="88" fill="#1B4FBF"/>
          <polygon points="140,280 248,96 356,280" fill="#F2BE22" stroke="#141414" stroke-width="3"/>
          <circle cx="140" cy="140" r="46" fill="#F6F1E5" stroke="#141414" stroke-width="3"/>
          <circle cx="140" cy="140" r="16" fill="#141414"/>
          <line x1="140" y1="0" x2="140" y2="280" stroke="#141414" stroke-width="3"/>
          <line x1="0" y1="140" x2="420" y2="140" stroke="#141414" stroke-width="3"/>
          <text x="20" y="256" fill="#141414" font-family="Outfit, sans-serif" font-size="22" font-weight="800">1919</text>
        </svg>`;

    case 'art-deco':
      return `
        <svg class="art-svg art-deco" viewBox="0 0 420 280" role="img" aria-label="아르데코 선버스트 골드 아트워크">
          <defs>
            <linearGradient id="deco-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#F6DC87"/>
              <stop offset="50%" stop-color="#D4AF37"/>
              <stop offset="100%" stop-color="#9A7818"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="#091815"/>
          <g stroke="rgba(212,175,55,0.28)" stroke-width="1">
            <line x1="210" y1="140" x2="210" y2="10"/><line x1="210" y1="140" x2="290" y2="10"/>
            <line x1="210" y1="140" x2="370" y2="40"/><line x1="210" y1="140" x2="410" y2="140"/>
            <line x1="210" y1="140" x2="370" y2="240"/><line x1="210" y1="140" x2="290" y2="270"/>
            <line x1="210" y1="140" x2="210" y2="270"/><line x1="210" y1="140" x2="130" y2="270"/>
            <line x1="210" y1="140" x2="50" y2="240"/><line x1="210" y1="140" x2="10" y2="140"/>
            <line x1="210" y1="140" x2="50" y2="40"/><line x1="210" y1="140" x2="130" y2="10"/>
          </g>
          <rect x="22" y="22" width="376" height="236" fill="none" stroke="url(#deco-gold)" stroke-width="2"/>
          <rect x="30" y="30" width="360" height="220" fill="none" stroke="rgba(212,175,55,0.45)" stroke-width="1"/>
          <polygon points="210,54 294,140 210,226 126,140" fill="#102420" stroke="url(#deco-gold)" stroke-width="2.5"/>
          <polygon points="210,76 272,140 210,204 148,140" fill="none" stroke="#F3D678" stroke-width="1.2"/>
          <polygon points="210,114 236,140 210,166 184,140" fill="url(#deco-gold)"/>
          <text x="210" y="246" text-anchor="middle" fill="#F3D678" font-family="Cinzel, serif" font-size="11" letter-spacing="4">${isGame ? 'GILDED VAULT XI' : 'MCMXXV · AURELIA'}</text>
        </svg>`;

    case 'risograph':
      return `
        <svg class="art-svg art-riso" viewBox="0 0 420 280" role="img" aria-label="리소그래프 2도 오버프린트 아트워크">
          <defs>
            <pattern id="riso-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.4" fill="#1D42D8" opacity="0.22"/>
            </pattern>
          </defs>
          <rect width="420" height="280" fill="#F6F0E4"/>
          <rect width="420" height="280" fill="url(#riso-dots)"/>
          <circle cx="238" cy="116" r="66" fill="#FF4E7A" opacity="0.82"/>
          <circle cx="228" cy="108" r="66" fill="none" stroke="#1D42D8" stroke-width="2.5"/>
          <polygon points="62,238 178,92 292,238" fill="#1D42D8" opacity="0.82"/>
          <polygon points="154,244 264,126 368,244" fill="#FF4E7A" opacity="0.65"/>
          <rect x="24" y="24" width="372" height="232" fill="none" stroke="#1D42D8" stroke-width="2" stroke-dasharray="7 5"/>
          <text x="40" y="52" fill="#1D42D8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">2-INK OVERPRINT // ED. 050</text>
        </svg>`;

    case 'kinetic-type':
      return `
        <svg class="art-svg art-kinetic" viewBox="0 0 420 280" role="img" aria-label="키네틱 애시드 타이포 아트워크">
          <rect width="420" height="280" fill="#09090B"/>
          <g fill="#CCFF00" opacity="0.14">
            <polygon points="-20,260 120,0 155,0 15,260"/>
            <polygon points="240,280 380,0 415,0 275,280"/>
          </g>
          <text x="26" y="102" fill="none" stroke="#FAFAFA" stroke-width="1.6" font-family="Syne, sans-serif" font-size="64" font-weight="800">VOLT</text>
          <rect x="22" y="114" width="376" height="58" fill="#CCFF00"/>
          <text x="36" y="159" fill="#09090B" font-family="Syne, sans-serif" font-size="46" font-weight="800">${isGame ? '140 BPM ↗' : 'KINETIC ↗'}</text>
          <text x="26" y="232" fill="#FAFAFA" font-family="Syne, sans-serif" font-size="56" font-weight="800">SPEED</text>
          <circle cx="364" cy="214" r="24" fill="#FF2E93"/>
          <text x="364" y="220" text-anchor="middle" fill="#FAFAFA" font-family="JetBrains Mono, monospace" font-size="12" font-weight="700">GO</text>
        </svg>`;

    case 'pixel-arcade':
      return `
        <svg class="art-svg art-pixel" viewBox="0 0 420 280" shape-rendering="crispEdges" role="img" aria-label="8-Bit 픽셀 드래곤 보스 아트워크">
          <rect width="420" height="280" fill="#141028"/>
          <!-- 별빛 도트 -->
          <rect x="34" y="30" width="6" height="6" fill="#FFD43B"/>
          <rect x="88" y="64" width="4" height="4" fill="#FFFCE8"/>
          <rect x="346" y="40" width="6" height="6" fill="#42E8A8"/>
          <rect x="378" y="88" width="4" height="4" fill="#FFD43B"/>
          <!-- 던전 바닥 블록 -->
          <rect x="0" y="232" width="420" height="48" fill="#2B255C"/>
          <rect x="0" y="232" width="420" height="6" fill="#5D54A4"/>
          <g fill="#1B163B">
            <rect x="20" y="246" width="42" height="14"/><rect x="80" y="246" width="42" height="14"/>
            <rect x="140" y="246" width="42" height="14"/><rect x="200" y="246" width="42" height="14"/>
            <rect x="260" y="246" width="42" height="14"/><rect x="320" y="246" width="42" height="14"/>
          </g>
          <!-- 16-Bit 픽셀 크림슨 드래곤 스프라이트 -->
          <g transform="translate(132, 48) scale(8)">
            <!-- 날개 -->
            <rect x="0" y="6" width="4" height="6" fill="#A61E4D"/>
            <rect x="1" y="4" width="3" height="2" fill="#FF3B5C"/>
            <rect x="16" y="6" width="4" height="6" fill="#A61E4D"/>
            <rect x="16" y="4" width="3" height="2" fill="#FF3B5C"/>
            <!-- 뿔 -->
            <rect x="5" y="0" width="2" height="3" fill="#FFD43B"/>
            <rect x="13" y="0" width="2" height="3" fill="#FFD43B"/>
            <!-- 머리 & 몸통 -->
            <rect x="5" y="3" width="10" height="7" fill="#FF3B5C"/>
            <rect x="4" y="10" width="12" height="9" fill="#E02447"/>
            <rect x="7" y="11" width="6" height="7" fill="#FFD43B"/>
            <!-- 눈 -->
            <rect x="6" y="5" width="2" height="2" fill="#FFFCE8"/>
            <rect x="12" y="5" width="2" height="2" fill="#FFFCE8"/>
            <rect x="7" y="6" width="1" height="1" fill="#141028"/>
            <rect x="12" y="6" width="1" height="1" fill="#141028"/>
            <!-- 발톱 -->
            <rect x="5" y="19" width="3" height="2" fill="#FFFCE8"/>
            <rect x="12" y="19" width="3" height="2" fill="#FFFCE8"/>
          </g>
          <!-- 픽셀 하트 3개 -->
          <g transform="translate(24, 20) scale(3)" fill="#FF3B5C">
            <rect x="1" y="0" width="2" height="1"/><rect x="4" y="0" width="2" height="1"/>
            <rect x="0" y="1" width="7" height="2"/><rect x="1" y="3" width="5" height="1"/>
            <rect x="2" y="4" width="3" height="1"/><rect x="3" y="5" width="1" height="1"/>
          </g>
          <text x="396" y="34" text-anchor="end" fill="#FFD43B" font-family="Press Start 2P, monospace" font-size="10">${isGame ? 'BOSS LV.99' : '1UP READY'}</text>
        </svg>`;

    case 'synthwave':
      return `
        <svg class="art-svg art-synth" viewBox="0 0 420 280" role="img" aria-label="80s 신스웨이브 아웃런 지평선 아트워크">
          <defs>
            <linearGradient id="sy-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0C061C"/>
              <stop offset="58%" stop-color="#2D0F52"/>
              <stop offset="100%" stop-color="#FF2A85" stop-opacity="0.4"/>
            </linearGradient>
            <linearGradient id="sy-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFE45E"/>
              <stop offset="55%" stop-color="#FF5E62"/>
              <stop offset="100%" stop-color="#FF2A85"/>
            </linearGradient>
          </defs>
          <rect width="420" height="168" fill="url(#sy-sky)"/>
          <circle cx="210" cy="128" r="64" fill="url(#sy-sun)"/>
          <!-- 아웃런 선셋 컷 스트라이프 -->
          <g fill="#220B40">
            <rect x="140" y="136" width="140" height="4"/>
            <rect x="140" y="146" width="140" height="5"/>
            <rect x="140" y="157" width="140" height="7"/>
          </g>
          <!-- 지평선 & 원근 레이저 그리드 -->
          <rect x="0" y="168" width="420" height="112" fill="#0B0418"/>
          <g stroke="#00F0FF" stroke-width="1.3" opacity="0.8">
            <line x1="0" y1="168" x2="420" y2="168" stroke="#FF2A85" stroke-width="2.5"/>
            <line x1="0" y1="184" x2="420" y2="184"/><line x1="0" y1="205" x2="420" y2="205"/>
            <line x1="0" y1="234" x2="420" y2="234"/><line x1="0" y1="268" x2="420" y2="268"/>
            <line x1="210" y1="168" x2="210" y2="280"/>
            <line x1="175" y1="168" x2="115" y2="280"/><line x1="245" y1="168" x2="305" y2="280"/>
            <line x1="140" y1="168" x2="10" y2="280"/><line x1="280" y1="168" x2="410" y2="280"/>
          </g>
          ${isGame ? '<polygon points="210,96 248,144 210,132 172,144" fill="none" stroke="#00F0FF" stroke-width="2.5"/><circle cx="210" cy="126" r="24" fill="none" stroke="#FF2A85" stroke-width="1.5" stroke-dasharray="5 5"/>' : ''}
          <text x="20" y="30" fill="#00F0FF" font-family="Orbitron, sans-serif" font-size="11" font-weight="700">OUTRUN // 1984</text>
        </svg>`;

    case 'y2k-chrome':
      return `
        <svg class="art-svg art-y2k" viewBox="0 0 420 280" role="img" aria-label="Y2K 액체 크롬 스타 아트워크">
          <defs>
            <linearGradient id="y2k-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="30%" stop-color="#B6C6E8"/>
              <stop offset="55%" stop-color="#63E2FF"/>
              <stop offset="78%" stop-color="#D6A4FF"/>
              <stop offset="100%" stop-color="#FFFFFF"/>
            </linearGradient>
            <radialGradient id="y2k-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stop-color="#63E2FF" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#0F1322" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="420" height="280" fill="#0F1322"/>
          <circle cx="210" cy="140" r="126" fill="url(#y2k-glow)"/>
          <ellipse cx="210" cy="140" rx="145" ry="44" fill="none" stroke="url(#y2k-metal)" stroke-width="3" transform="rotate(-18 210 140)"/>
          <ellipse cx="210" cy="140" rx="120" ry="34" fill="none" stroke="#FF5EDB" stroke-width="1.8" opacity="0.8" transform="rotate(22 210 140)"/>
          <!-- 4각 리퀴드 크롬 스타 -->
          <path d="M210 42 C216 112 238 134 308 140 C238 146 216 168 210 238 C204 168 182 146 112 140 C182 134 204 112 210 42 Z" fill="url(#y2k-metal)" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="328" cy="68" r="16" fill="url(#y2k-metal)"/>
          <text x="24" y="34" fill="#DCE4F5" font-family="Orbitron, sans-serif" font-size="11" font-weight="700">Y2K ✦ LIQUID CHROME</text>
        </svg>`;

    case 'frutiger-aero':
      return `
        <svg class="art-svg art-aero" viewBox="0 0 420 280" role="img" aria-label="Frutiger Aero 물방울 하늘 아트워크">
          <defs>
            <linearGradient id="ae-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2BB7F6"/>
              <stop offset="65%" stop-color="#BBEAFF"/>
              <stop offset="100%" stop-color="#EBFCE8"/>
            </linearGradient>
            <radialGradient id="ae-orb" cx="35%" cy="28%" r="65%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
              <stop offset="45%" stop-color="#7EE2FF" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#0086D4" stop-opacity="0.72"/>
            </radialGradient>
            <linearGradient id="ae-hill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6BE04C"/>
              <stop offset="100%" stop-color="#1E9E47"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="url(#ae-sky)"/>
          <path d="M0 220 Q120 172 240 212 T420 192 L420 280 L0 280 Z" fill="url(#ae-hill)"/>
          <path d="M0 242 Q150 205 290 238 T420 225 L420 280 L0 280 Z" fill="#44C83C" opacity="0.65"/>
          <!-- 투명 물방울 구슬 3개 -->
          <circle cx="210" cy="126" r="64" fill="url(#ae-orb)" stroke="rgba(255,255,255,0.9)" stroke-width="2.5"/>
          <ellipse cx="192" cy="94" rx="28" ry="14" fill="#FFFFFF" opacity="0.72" transform="rotate(-22 192 94)"/>
          <circle cx="102" cy="158" r="28" fill="url(#ae-orb)" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>
          <ellipse cx="94" cy="146" rx="10" ry="5" fill="#FFFFFF" opacity="0.8" transform="rotate(-25 94 146)"/>
          <circle cx="326" cy="96" r="24" fill="url(#ae-orb)" stroke="rgba(255,255,255,0.85)" stroke-width="2"/>
          <ellipse cx="319" cy="86" rx="8" ry="4" fill="#FFFFFF" opacity="0.8"/>
        </svg>`;

    case 'claymorphism':
      return `
        <svg class="art-svg art-clay" viewBox="0 0 420 280" role="img" aria-label="클레이모피즘 3D 버블 캐릭터 아트워크">
          <defs>
            <radialGradient id="cl-pink" cx="35%" cy="28%" r="70%">
              <stop offset="0%" stop-color="#FFB3C7"/>
              <stop offset="60%" stop-color="#FF7096"/>
              <stop offset="100%" stop-color="#D94571"/>
            </radialGradient>
            <radialGradient id="cl-mint" cx="35%" cy="28%" r="70%">
              <stop offset="0%" stop-color="#A8F5EC"/>
              <stop offset="60%" stop-color="#5ED3C6"/>
              <stop offset="100%" stop-color="#2FA69B"/>
            </radialGradient>
            <radialGradient id="cl-yel" cx="35%" cy="28%" r="70%">
              <stop offset="0%" stop-color="#FFF0A8"/>
              <stop offset="65%" stop-color="#FFD166"/>
              <stop offset="100%" stop-color="#E5A22E"/>
            </radialGradient>
          </defs>
          <rect width="420" height="280" fill="#F3EEFF" rx="26"/>
          <circle cx="94" cy="196" r="44" fill="url(#cl-mint)"/>
          <circle cx="332" cy="92" r="36" fill="url(#cl-yel)"/>
          <!-- 말랑한 3D 클레이 캐릭터 -->
          <rect x="136" y="64" width="148" height="148" rx="58" fill="url(#cl-pink)"/>
          <ellipse cx="182" cy="96" rx="28" ry="12" fill="#FFFFFF" opacity="0.55" transform="rotate(-18 182 96)"/>
          <!-- 귀여운 표정 -->
          <circle cx="184" cy="136" r="9" fill="#2D2159"/>
          <circle cx="236" cy="136" r="9" fill="#2D2159"/>
          <circle cx="187" cy="133" r="3" fill="#FFFFFF"/>
          <circle cx="239" cy="133" r="3" fill="#FFFFFF"/>
          <path d="M196 158 Q210 172 224 158" fill="none" stroke="#2D2159" stroke-width="5" stroke-linecap="round"/>
          <ellipse cx="164" cy="150" rx="10" ry="6" fill="#FF3B73" opacity="0.45"/>
          <ellipse cx="256" cy="150" rx="10" ry="6" fill="#FF3B73" opacity="0.45"/>
        </svg>`;

    case 'solarpunk-eco':
      return `
        <svg class="art-svg art-solar" viewBox="0 0 420 280" role="img" aria-label="솔라펑크 보태니컬 온실 아치 아트워크">
          <defs>
            <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F7E5B7"/>
              <stop offset="100%" stop-color="#F4F1E3"/>
            </linearGradient>
          </defs>
          <rect width="420" height="280" fill="url(#sp-sky)"/>
          <circle cx="210" cy="112" r="56" fill="#E8A944" opacity="0.45"/>
          <circle cx="210" cy="112" r="34" fill="#D97736"/>
          <!-- 온실 아치 돔 -->
          <path d="M98 260 L98 138 A112 112 0 0 1 322 138 L322 260 Z" fill="rgba(252,251,245,0.58)" stroke="#2B7A4B" stroke-width="3"/>
          <path d="M138 260 L138 148 A72 72 0 0 1 282 148 L282 260" fill="none" stroke="#2B7A4B" stroke-width="1.5" opacity="0.6"/>
          <line x1="210" y1="26" x2="210" y2="260" stroke="#2B7A4B" stroke-width="1.5" opacity="0.5"/>
          <!-- 보태니컬 잎사귀 -->
          <path d="M126 260 Q158 175 210 218 Q262 175 294 260 Z" fill="#2B7A4B"/>
          <path d="M160 260 Q210 165 260 260 Z" fill="#183629"/>
          <path d="M88 260 Q210 226 332 260 Z" fill="#D97736" opacity="0.85"/>
        </svg>`;

    case 'memphis':
    default:
      return `
        <svg class="art-svg art-memphis" viewBox="0 0 420 280" role="img" aria-label="멤피스 팝 지그재그 컨페티 아트워크">
          <rect width="420" height="280" fill="#FFFDF7"/>
          <!-- 도트 & 지그재그 -->
          <path d="M24 54 L44 36 L64 54 L84 36 L104 54 L124 36" fill="none" stroke="#00C9B7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M294 236 L314 218 L334 236 L354 218 L374 236 L394 218" fill="none" stroke="#FF5FA2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="336" cy="64" r="24" fill="#FFD23F" stroke="#1E1B4B" stroke-width="3"/>
          <!-- 중앙 팝 기하 구성 -->
          <rect x="132" y="74" width="156" height="132" rx="18" fill="#00C9B7" transform="translate(10,10)"/>
          <rect x="132" y="74" width="156" height="132" rx="18" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="3.5"/>
          <polygon points="210,94 256,178 164,178" fill="#FF5FA2" stroke="#1E1B4B" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="176" cy="116" r="18" fill="#FFD23F" stroke="#1E1B4B" stroke-width="3"/>
          <path d="M44 212 A34 34 0 0 1 112 212 Z" fill="#FF5FA2" stroke="#1E1B4B" stroke-width="3"/>
          <g fill="#1E1B4B">
            <circle cx="322" cy="144" r="4"/><circle cx="340" cy="144" r="4"/><circle cx="358" cy="144" r="4"/>
            <circle cx="322" cy="162" r="4"/><circle cx="340" cy="162" r="4"/><circle cx="358" cy="162" r="4"/>
          </g>
        </svg>`;
  }
}
