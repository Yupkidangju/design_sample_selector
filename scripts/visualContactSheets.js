// 육안 검수용으로 120종 Web Hero를 동일한 스케일의 8개씩 표시한다.
import { getLocalizedLegacyAllSubDesigns } from '../src/catalog/legacyAdapter.js';
import { getArchetypeHTML } from '../src/components/archetypeTemplates.js';
import { getActiveLocaleSnapshot } from '../src/i18n/index.js';

export function renderThemeContactSheet(start = 0) {
  document.querySelector('#theme-contact-sheet')?.remove();
  const sheet = document.createElement('section');
  sheet.id = 'theme-contact-sheet';
  sheet.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#e9edf1;padding:16px;overflow:hidden;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:470px;gap:12px';
  for (const style of getLocalizedLegacyAllSubDesigns(getActiveLocaleSnapshot()).slice(start, start + 8)) {
    const card = document.createElement('article');
    card.style.cssText = 'position:relative;overflow:hidden;border:1px solid #cbd3dc;border-radius:10px;background:#dce3eb';
    const name = document.createElement('p');
    name.textContent = `${style.id} · ${style.name}`;
    name.style.cssText = 'font:600 12px/1.5 Arial,sans-serif;padding:8px;color:#263548;background:#edf1f5;position:relative;z-index:2';
    const viewport = document.createElement('div');
    viewport.className = 'mockup-viewport desktop';
    viewport.dataset.theme = style.id;
    viewport.style.cssText = 'display:block;position:absolute;left:8px;top:48px;width:720px;padding:0;transform:scale(.45);transform-origin:top left;background:none';
    viewport.innerHTML = getArchetypeHTML('web', style, { tab: 'hero', snapshot: getActiveLocaleSnapshot() });
    card.append(name, viewport);
    sheet.append(card);
  }
  document.body.append(sheet);
}
