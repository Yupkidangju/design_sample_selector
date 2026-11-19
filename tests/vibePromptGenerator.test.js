import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DOMAIN_IDS } from '../src/data/domains.js';
import { STYLES_20 } from '../src/data/styles20.js';
import {
  generateCssTokensBlock,
  generateDesignsMarkdown,
  generateVibePrompt
} from '../src/prompt/vibePromptGenerator.js';

describe('AI 바이브 코딩 프롬프트 및 스펙 생성기', () => {
  it('모든 20종 스타일에 대해 한국어/영어 AI 프롬프트, CSS 토큰, designs.md를 생성한다', () => {
    for (const style of STYLES_20) {
      const ko = generateVibePrompt(style, { domainId: 'game', lang: 'ko' });
      const css = generateCssTokensBlock(style, { lang: 'ko' });
      const cssEn = generateCssTokensBlock(style, { lang: 'en' });
      const md = generateDesignsMarkdown(style, { domainId: 'dashboard' });

      assert.match(ko, /\[DO\]/);
      assert.match(ko, /\[DON'T\]/);
      assert.ok(ko.includes(style.nameKo));
      assert.ok(css.includes(`[data-style="${style.id}"]`));
      assert.ok(md.includes(`# designs.md — ${style.nameKo}`));
      assert.doesNotMatch(cssEn, /[가-힣]/, `English CSS comments leaked Korean on ${style.id}`);

      // 모든 도메인의 영문 프롬프트에 한글 문자가 혼입되지 않아야 한다 (R-02)
      for (const domainId of DOMAIN_IDS) {
        const en = generateVibePrompt(style, { domainId, lang: 'en' });
        assert.ok(en.includes(style.nameEn), `${style.id}/${domainId}`);
        assert.doesNotMatch(en, /[가-힣]/, `Korean leaked into English prompt: ${style.id}/${domainId}`);
        assert.doesNotMatch(en, /Web Audio|synthAudio|BGM|효과음|ARENA TARGET BOX/i);
      }

      // 오디오나 구버전 이모지 ASCII 다이어그램 문구가 섞이지 않아야 한다
      for (const output of [ko, css, md]) {
        assert.doesNotMatch(output, /Web Audio|synthAudio|BGM|효과음|ARENA TARGET BOX/i);
      }
    }
  });
});
