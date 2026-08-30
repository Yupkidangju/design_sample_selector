import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  generateExpansionThemeStylesheet,
  generateThemeStylesheet
} from '../src/theme/index.js';

const ALLOWED_OPTIONS = new Set(['--check']);
const DEFAULT_TARGET_PATH = fileURLToPath(
  new URL('../src/styles/themeTokens.css', import.meta.url)
);
const DEFAULT_EXPANSION_TARGET_PATH = fileURLToPath(
  new URL('../src/styles/themeTokensExpansion.css', import.meta.url)
);

function writeLine(stream, value) {
  stream.write(`${value}\n`);
}

/**
 * 정규 카탈로그에서 runtime theme CSS를 쓰거나 read-only로 비교한다.
 * 테스트는 파일 경로와 생성·I/O 함수를 주입할 수 있다.
 *
 * @param {readonly string[]} args
 * @param {{ stdout: { write(value: string): unknown }, stderr: { write(value: string): unknown } }} io
 * @param {object} [dependencies]
 * @returns {0|1|2}
 */
export function runThemeStylesCli(
  args = [],
  io = { stdout: process.stdout, stderr: process.stderr },
  dependencies = {}
) {
  const unknownOption = args.find(option => !ALLOWED_OPTIONS.has(option));
  if (unknownOption !== undefined) {
    writeLine(io.stderr, `알 수 없는 옵션: ${String(unknownOption)}`);
    return 2;
  }

  const targets = dependencies.targetPath
    ? [{
        path: dependencies.targetPath,
        generate: dependencies.generateThemeStylesheet || generateThemeStylesheet
      }]
    : [
        {
          path: DEFAULT_TARGET_PATH,
          generate: dependencies.generateThemeStylesheet || generateThemeStylesheet
        },
        {
          path: DEFAULT_EXPANSION_TARGET_PATH,
          generate: dependencies.generateExpansionThemeStylesheet || generateExpansionThemeStylesheet
        }
      ];
  const readFile = dependencies.readFileSync || readFileSync;
  const writeFile = dependencies.writeFileSync || writeFileSync;

  try {
    for (const target of targets) {
      const expected = target.generate();
      if (args.includes('--check')) {
        let current;
        try {
          current = readFile(target.path, 'utf8');
        } catch (error) {
          if (error && typeof error === 'object' && error.code === 'ENOENT') {
            writeLine(
              io.stderr,
              `테마 CSS 파일이 없음: ${target.path}\n복구: npm run generate:themes`
            );
            return 1;
          }
          throw error;
        }

        if (current !== expected) {
          writeLine(
            io.stderr,
            `테마 CSS가 정규 데이터보다 오래됨: ${target.path}\n복구: npm run generate:themes`
          );
          return 1;
        }
        writeLine(io.stdout, `테마 CSS 최신 상태: ${target.path}`);
      } else {
        writeFile(target.path, expected, 'utf8');
        writeLine(io.stdout, `테마 CSS 갱신 완료: ${target.path}`);
      }
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeLine(io.stderr, `테마 CSS 생성 내부 오류: ${message}`);
    return 2;
  }
}

const entryUrl = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : null;

if (entryUrl === import.meta.url) {
  process.exitCode = runThemeStylesCli(process.argv.slice(2));
}
