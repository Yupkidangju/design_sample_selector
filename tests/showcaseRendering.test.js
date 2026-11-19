import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DOMAIN_IDS } from '../src/data/domains.js';
import { STYLES_20 } from '../src/data/styles20.js';
import { renderSpecimenCard } from '../src/gallery/specimenCard.js';
import { renderDomainMarkup } from '../src/showcase/showcaseApp.js';

describe('갤러리 표본 카드 및 20×4 독립 쇼케이스 렌더링', () => {
  it('20종 표본 카드가 모두 새 탭 독립 쇼케이스 링크와 4대 도메인 바로가기를 포함한다', () => {
    for (const style of STYLES_20) {
      const html = renderSpecimenCard(style, { isBookmarked: style.id === 'swiss-grid' });
      assert.ok(html.includes(`data-style="${style.id}"`), style.id);
      assert.ok(html.includes('target="_blank"'), style.id);
      assert.ok(html.includes(`showcase.html?style=${style.id}&domain=web`), style.id);
      assert.ok(html.includes(`showcase.html?style=${style.id}&domain=game`), style.id);
      assert.ok(html.includes('<svg'), `${style.id} specimen must include custom SVG artwork`);
      assert.doesNotMatch(html, /undefined|NaN|\[object Object\]/);
    }
  });

  it('20종 × 4대 도메인(80개 조합)이 깨진 치환 문자열 없이 정상 렌더링된다', () => {
    for (const style of STYLES_20) {
      for (const domainId of DOMAIN_IDS) {
        const html = renderDomainMarkup(style, domainId);
        assert.ok(html.includes(`domain-${domainId}`), `${style.id}/${domainId}`);
        assert.doesNotMatch(html, /undefined|NaN|\[object Object\]/);
        // 구버전 localizeMarkup.js 파괴 회귀 방지
        assert.doesNotMatch(html, />이 스타일 확정</);
        if (domainId === 'dashboard') {
          assert.ok(html.includes('dash-donut-svg'), `${style.id} dashboard must include SVG donut chart`);
        }
      }
    }
  });
});
