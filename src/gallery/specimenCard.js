/**
 * 메인 갤러리 대형 라이브 표본(Specimen) 카드 렌더러
 * 클릭 전에도 각 사조의 서체·컬러·질감·그래픽 모티프가 압도적으로 드러나도록 렌더링한다.
 */

import { SHOWCASE_DOMAINS, STYLE_GROUP_MAP } from '../data/domains.js';
import { renderStyleArtwork } from '../showcase/domainArtwork.js';
import { escapeHtml } from '../utils/escape.js';

function inlineStyleVars(style) {
  const entries = [
    ['--font-display', style.fonts.display],
    ['--font-body', style.fonts.body],
    ['--font-mono', style.fonts.mono],
    ...Object.entries(style.cssVars)
  ];
  return entries.map(([key, value]) => `${key}:${value}`).join(';');
}

export function renderSpecimenCard(style, { isBookmarked = false } = {}) {
  const groupLabel = STYLE_GROUP_MAP[style.group]?.shortLabel || style.group;
  const showcaseHref = `./showcase.html?style=${encodeURIComponent(style.id)}&domain=web`;
  const art = renderStyleArtwork(style.id, 'hero');

  return `
    <article class="specimen-card" data-card-style="${escapeHtml(style.id)}">
      <!-- 상단 62%: 해당 사조의 실제 비주얼 표본 포스터 (1클릭 즉시 새 탭 쇼케이스 오픈) -->
      <a class="specimen-poster-link"
         href="${showcaseHref}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="${escapeHtml(style.nameKo)} 독립 새 탭 쇼케이스 열기">
        <div class="specimen-stage" data-style="${escapeHtml(style.id)}" style="${escapeHtml(inlineStyleVars(style))}">
          <div class="specimen-stage-top">
            <span class="specimen-kicker">${escapeHtml(style.specimen.kicker)}</span>
            <span class="specimen-badge">${escapeHtml(style.specimen.badge)}</span>
          </div>

          <div class="specimen-stage-body">
            <div class="specimen-type-block">
              <strong class="specimen-headline">${escapeHtml(style.specimen.headline)}</strong>
              <span class="specimen-sub">${escapeHtml(style.specimen.sub)}</span>
            </div>
            <div class="specimen-art-thumb" aria-hidden="true">
              ${art}
            </div>
          </div>

          <div class="specimen-hover-cta" aria-hidden="true">
            <span>새 탭에서 풀스크린 쇼케이스 열기 ↗</span>
          </div>
        </div>
      </a>

      <!-- 하단 38%: 중립 다크 스튜디오 정보 영역 -->
      <div class="specimen-info">
        <div class="specimen-info-top">
          <div class="specimen-meta-left">
            <span class="specimen-num">${escapeHtml(style.number)}</span>
            <span class="specimen-group-pill">${escapeHtml(groupLabel)}</span>
            <span class="specimen-polarity-pill">${style.polarity === 'dark' ? 'DARK' : 'LIGHT'}</span>
          </div>
          <button type="button"
                  class="specimen-bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}"
                  data-bookmark-toggle="${escapeHtml(style.id)}"
                  aria-pressed="${isBookmarked ? 'true' : 'false'}"
                  aria-label="${escapeHtml(style.nameKo)} 즐겨찾기 ${isBookmarked ? '해제' : '추가'}">
            ${isBookmarked ? '★' : '☆'}
          </button>
        </div>

        <a class="specimen-title-link"
           href="${showcaseHref}"
           target="_blank"
           rel="noopener noreferrer">
          <h2 class="specimen-title">${escapeHtml(style.nameKo)}</h2>
          <span class="specimen-title-en">${escapeHtml(style.nameEn)}</span>
        </a>

        <p class="specimen-tagline">${escapeHtml(style.tagline)}</p>

        <!-- 5색 팔레트 스트립 -->
        <div class="specimen-palette-bar" aria-label="대표 5색 팔레트">
          ${style.palette.map(color => `
            <span class="specimen-palette-chip" style="background:${escapeHtml(color.hex)}" title="${escapeHtml(color.role)} (${escapeHtml(color.hex)})"></span>
          `).join('')}
        </div>

        <!-- 특징 3태그 -->
        <div class="specimen-traits">
          ${style.traits.map(trait => `<span>${escapeHtml(trait)}</span>`).join('')}
        </div>

        <!-- 4대 도메인 직접 새 탭 바로가기 -->
        <div class="specimen-domain-links" aria-label="${escapeHtml(style.nameKo)} 도메인별 바로 열기">
          ${SHOWCASE_DOMAINS.map(domain => `
            <a class="specimen-domain-link"
               href="./showcase.html?style=${encodeURIComponent(style.id)}&domain=${encodeURIComponent(domain.id)}"
               target="_blank"
               rel="noopener noreferrer">
              ${escapeHtml(domain.label)} ↗
            </a>
          `).join('')}
        </div>
      </div>
    </article>
  `;
}
