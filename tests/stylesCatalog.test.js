import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STYLE_GROUPS, SHOWCASE_DOMAINS, resolveDomainId } from '../src/data/domains.js';
import {
  STYLES_20,
  getStyleById,
  resolveStyle,
  getAdjacentStyles,
  filterStyles
} from '../src/data/styles20.js';

describe('20종 소수 정예 디자인 카탈로그 계약', () => {
  it('정확히 20종의 고유 스타일이 3개 그룹(7+6+7)으로 구성된다', () => {
    assert.equal(STYLES_20.length, 20);
    const ids = new Set(STYLES_20.map(s => s.id));
    assert.equal(ids.size, 20);

    const byGroup = STYLES_20.reduce((acc, s) => {
      acc[s.group] = (acc[s.group] || 0) + 1;
      return acc;
    }, {});
    assert.deepEqual(byGroup, { modern: 7, editorial: 6, playful: 7 });
    assert.equal(STYLE_GROUPS.length, 4);
    assert.equal(SHOWCASE_DOMAINS.length, 4);
  });

  it('모든 스타일은 동일한 cssVars 키셋, 유효 색 토큰, monoName, 영문 팔레트 roleEn을 가진다', () => {
    const baselineKeys = Object.keys(STYLES_20[0].cssVars).sort();
    for (const style of STYLES_20) {
      assert.ok(style.fonts.display && style.fonts.body && style.fonts.mono, style.id);
      assert.ok(style.fonts.displayName && style.fonts.bodyName && style.fonts.monoName, style.id);
      assert.equal(style.palette.length, 5, `${style.id} palette length`);
      for (const swatch of style.palette) {
        assert.ok(swatch.role && swatch.roleEn, `${style.id} swatch role/roleEn`);
        assert.doesNotMatch(swatch.roleEn, /[가-힣]/, `${style.id} roleEn must be English`);
      }
      assert.deepEqual(Object.keys(style.cssVars).sort(), baselineKeys, `${style.id} cssVars parity`);
      assert.doesNotMatch(style.cssVars['--surface'], /gradient\(/i, `${style.id} --surface must be valid CSS color`);
      assert.equal(style.traits.length, 3, `${style.id} traits length`);
      assert.ok(style.dna.dosKo.length >= 4 && style.dna.dontsKo.length >= 4, style.id);
      assert.ok(style.dna.dosEn.length >= 4 && style.dna.dontsEn.length >= 4, style.id);
    }
    assert.equal(getStyleById('pixel-arcade')?.fonts.monoName, 'Press Start 2P + JetBrains Mono');
  });

  it('스타일 해석, 인접 탐색, 검색·그룹·즐겨찾기 필터가 정확히 동작한다', () => {
    assert.equal(getStyleById('pixel-arcade')?.number, '14');
    assert.equal(getStyleById('unknown-style'), null);

    const fallback = resolveStyle('non-existent');
    assert.equal(fallback.wasFallback, true);
    assert.equal(fallback.style.id, 'swiss-grid');

    assert.equal(resolveDomainId('game'), 'game');
    assert.equal(resolveDomainId('invalid'), 'web');

    const adj = getAdjacentStyles('swiss-grid');
    assert.equal(adj.prev.id, 'memphis');
    assert.equal(adj.next.id, 'bento-grid');

    assert.equal(filterStyles({ group: 'editorial' }).length, 6);
    assert.equal(filterStyles({ query: '픽셀' }).length, 1);
    assert.equal(filterStyles({ bookmarksOnly: true, bookmarks: ['art-deco', 'synthwave'] }).length, 2);
  });
});
