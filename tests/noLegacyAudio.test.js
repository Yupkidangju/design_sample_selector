import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...collectFiles(full));
    else results.push(full);
  }
  return results;
}

describe('레거시 음악/효과음 기능 완전 삭제 회귀 방지', () => {
  it('오디오 모듈 파일이 존재하지 않는다', () => {
    assert.equal(existsSync(resolve('src/audio')), false);
    assert.equal(existsSync(resolve('src/components/audioWidget.js')), false);
    assert.equal(existsSync(resolve('src/components/compactAudioControls.js')), false);
    assert.equal(existsSync(resolve('src/preview/localizeMarkup.js')), false);
  });

  it('src/ 및 HTML 엔트리에 AudioContext, synthAudio, BGM 컨트롤이 없다', () => {
    const targets = [resolve('index.html'), resolve('showcase.html'), ...collectFiles(resolve('src'))];
    for (const file of targets) {
      const content = readFileSync(file, 'utf8');
      assert.doesNotMatch(
        content,
        /\bAudioContext\b|\bsynthAudio\b|\baudioWidget\b|\bcompactAudioControls\b|audio-widget-root/,
        `Forbidden audio code in ${file}`
      );
    }
  });
});
