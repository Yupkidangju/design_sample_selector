// Chrome QA 전용 모듈. 앱의 배포 bundle에는 포함되지 않는다.
export async function auditPreviewLayouts() {
  const [{ getAllSubDesigns }, { getArchetypeHTML }, { commitLocale }, { appState }] = await Promise.all([
    import('../src/data/categories.js'), import('../src/components/archetypeTemplates.js'),
    import('../src/i18n/index.js'), import('../src/state/appState.js')
  ]);
  const host = document.createElement('section');
  const { getLocalizedLegacyAllSubDesigns } = await import('../src/catalog/legacyAdapter.js');
  host.id = 'visual-design-audit';
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;display:block;max-width:none;padding:0';
  document.body.append(host);
  const issues = [];
  let states = 0;
  try {
    for (const locale of ['ko', 'en', 'ja', 'zh-CN', 'zh-TW']) {
      const snapshot = await commitLocale(locale, appState, window);
      const localizedStyles = getLocalizedLegacyAllSubDesigns(snapshot);
      if (localizedStyles.length !== getAllSubDesigns().length) throw new Error(`${locale}: localized catalog count differs`);
      for (const style of localizedStyles) {
        for (const device of ['desktop', 'mobile', 'narrow-desktop', 'split']) {
          host.className = device === 'split' ? 'split-viewport' : `mockup-viewport ${device === 'mobile' ? 'mobile' : 'desktop'}`;
          host.style.width = device === 'desktop' ? '760px' : '320px';
          host.dataset.theme = style.id;
          for (const archetype of ['game', 'web', 'mobile', 'ecommerce', 'blog', 'dashboard', 'media', 'chat']) {
            for (const tab of archetype === 'web' ? ['hero', 'widget', 'form', 'pricing'] : ['hero']) {
              host.dataset.archetype = archetype;
              host.innerHTML = getArchetypeHTML(archetype, style, { tab, snapshot });
              const root = host.querySelector('.archetype-unit');
              states++;
              const problems = [];
              if (!root || !root.clientWidth) problems.push({ type: 'missing-root' });
              else {
                if (root.clientWidth < host.clientWidth - 60) problems.push({ type: 'collapsed-root', width: root.clientWidth });
                if (root.scrollWidth > root.clientWidth + 2) problems.push({ type: 'root-overflow', pixels: root.scrollWidth - root.clientWidth });
                for (const e of root.querySelectorAll('h1,h2,h3,h4,p,button,label,span,a,li')) {
                  if (!e.clientWidth || e.closest('[aria-hidden="true"]') !== host || e.closest('.e120-art,.fx-layer,.shop-cart-drawer:not(.open)')) continue;
                  if (e.scrollWidth > e.clientWidth + 2) problems.push({ type: 'text-overflow', element: e.tagName, class: e.className, pixels: e.scrollWidth - e.clientWidth });
                  const computed = getComputedStyle(e);
                  if (['hidden', 'clip'].includes(computed.overflowY) && e.scrollHeight > e.clientHeight + 2) problems.push({ type: 'text-height-clip', class: e.className, pixels: e.scrollHeight - e.clientHeight });
                }
                const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                while (walker.nextNode()) {
                  const node = walker.currentNode;
                  const parent = node.parentElement;
                  if (!node.textContent.trim() || parent.closest('[aria-hidden="true"]') !== host || parent.closest('.visually-hidden,.e120-art,.fx-layer,.shop-cart-drawer:not(.open)')) continue;
                  const range = document.createRange();
                  range.selectNodeContents(node);
                  const rectangles = [...range.getClientRects()].filter(r => r.width && r.height);
                  let scrollX = false;
                  let scrollY = false;
                  for (let ancestor = parent; ancestor && ancestor !== host; ancestor = ancestor.parentElement) {
                    const css = getComputedStyle(ancestor);
                    scrollX ||= ['auto', 'scroll'].includes(css.overflowX);
                    scrollY ||= ['auto', 'scroll'].includes(css.overflowY);
                    const box = ancestor.getBoundingClientRect();
                    const left = box.left + ancestor.clientLeft;
                    const top = box.top + ancestor.clientTop;
                    const clipped = rectangles.some(r => (
                      (!scrollX && ['hidden', 'clip'].includes(css.overflowX) && (r.left < left - 2 || r.right > left + ancestor.clientWidth + 2)) ||
                      (!scrollY && ['hidden', 'clip'].includes(css.overflowY) && (r.top < top - 3 || r.bottom > top + ancestor.clientHeight + 3))
                    ));
                    if (clipped) { problems.push({ type: 'ancestor-text-clip', class: parent.className, ancestor: ancestor.className, text: node.textContent.trim().slice(0, 60) }); break; }
                  }
                }
              }
              if (problems.length) issues.push({ locale, style: style.id, device, archetype, tab, problems });
            }
          }
        }
      }
    }
  } finally { host.remove(); }
  return { states, styles: 120, locales: 5, devices: ['760px desktop', '320px mobile', '320px desktop', '320px split'], issues };
}
