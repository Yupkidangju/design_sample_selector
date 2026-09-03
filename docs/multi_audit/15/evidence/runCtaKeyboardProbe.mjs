import { readFileSync } from 'node:fs';

const projectRoot = '/home/eunho1/Projects/web/design_sample_selector_2';
const reportPath = `${projectRoot}/docs/multi_audit/15/evidence/cta-keyboard-report.json`;
const sourcePath = `${projectRoot}/docs/multi_audit/13/evidence/verifyCtaKeyboardChrome.mjs`;

const source = readFileSync(sourcePath, 'utf8')
  .replace("import { PROJECT_BASE } from '../../../../project.config.js';", "const PROJECT_BASE = '/design_sample_selector_2/';")
  .replace("const PROJECT_ROOT = fileURLToPath(new URL('../../../..', import.meta.url));", `const PROJECT_ROOT = ${JSON.stringify(projectRoot)};`)
  .replace("const REPORT_PATH = fileURLToPath(new URL('./cta-keyboard-report.json', import.meta.url));", `const REPORT_PATH = ${JSON.stringify(reportPath)};`)
  .replace('dss-cta-audit13-', 'dss-cta-audit15-')
  .replace(
    '      await dispatchKey(key);',
    [
      '      await evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);',
      '      await waitFor(`document.activeElement === document.querySelector(${JSON.stringify(selector)})`, `${mode} ${key.code} focus`);',
      '      before.focused = true;',
      '      await dispatchKey(key);'
    ].join('\n')
  );

await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
