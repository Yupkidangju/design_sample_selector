import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  formatCatalogValidationReport,
  validateCurrentCatalog
} from '../src/catalog/validation/index.js';

const ALLOWED_OPTIONS = new Set(['--json', '--strict', '--verbose']);

function writeLine(stream, value) {
  stream.write(`${value}\n`);
}

/**
 * 현재 카탈로그 검증 CLI를 실행하고 프로세스에 적용할 종료 코드를 반환한다.
 * 테스트에서는 출력 스트림과 검증 함수를 주입할 수 있다.
 *
 * @param {readonly string[]} args
 * @param {{ stdout: { write(value: string): unknown }, stderr: { write(value: string): unknown } }} io
 * @param {{ validateCurrentCatalog?: typeof validateCurrentCatalog }} [dependencies]
 * @returns {0|1|2}
 */
export function runCatalogValidationCli(
  args = [],
  io = { stdout: process.stdout, stderr: process.stderr },
  dependencies = {}
) {
  const unknownOption = args.find(option => !ALLOWED_OPTIONS.has(option));
  if (unknownOption !== undefined) {
    writeLine(io.stderr, `알 수 없는 옵션: ${String(unknownOption)}`);
    return 2;
  }

  try {
    const validate = dependencies.validateCurrentCatalog || validateCurrentCatalog;
    const report = validate();
    const output = args.includes('--json')
      ? JSON.stringify(report, null, 2)
      : formatCatalogValidationReport(report, { verbose: args.includes('--verbose') });
    writeLine(io.stdout, output);

    const strictFailure = args.includes('--strict') && report.summary.warningCount > 0;
    return !report.valid || strictFailure ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeLine(io.stderr, `카탈로그 검증 내부 오류: ${message}`);
    return 2;
  }
}

const entryUrl = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : null;

if (entryUrl === import.meta.url) {
  process.exitCode = runCatalogValidationCli(process.argv.slice(2));
}
