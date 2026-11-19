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

  it('20종 × 4대 도메인 × 2언어(KO/EN, 총 160조합)가 깨짐이나 언어 혼입 없이 정상 렌더링된다', () => {
    for (const style of STYLES_20) {
      for (const domainId of DOMAIN_IDS) {
        const htmlKo = renderDomainMarkup(style, domainId, 'ko');
        const htmlEn = renderDomainMarkup(style, domainId, 'en');

        assert.ok(htmlKo.includes(`domain-${domainId}`), `${style.id}/${domainId}/ko`);
        assert.ok(htmlEn.includes(`domain-${domainId}`), `${style.id}/${domainId}/en`);
        assert.doesNotMatch(htmlKo, /undefined|NaN|\[object Object\]/);
        assert.doesNotMatch(htmlEn, /undefined|NaN|\[object Object\]/);
        // 구버전 localizeMarkup.js 파괴 회귀 방지
        assert.doesNotMatch(htmlKo, />이 스타일 확정</);

        // EN 모드 가시 텍스트에 한글 혼입 0건 보장
        const visibleEnText = htmlEn.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
        assert.doesNotMatch(visibleEnText, /[가-힣]/, `${style.id}/${domainId} EN stage leaked Korean`);

        if (domainId === 'dashboard') {
          assert.ok(htmlKo.includes('dash-donut-svg'), `${style.id} dashboard must include SVG donut chart`);
          assert.ok(htmlEn.includes('dash-donut-svg'), `${style.id} EN dashboard must include SVG donut chart`);
        }
      }
    }
  });
});
