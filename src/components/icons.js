// 같은 선 굵기와 좌표계를 사용해 작은 화면에서도 아이콘의 무게를 맞춘다.
const paths = {
  spectrum: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><path d="M14 17.5h7m-3.5-3.5v7"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  bookmark: '<path d="M6 4h12v17l-6-4-6 4z"/>',
  compare: '<rect x="3" y="4" width="7" height="16" rx="2"/><rect x="14" y="4" width="7" height="16" rx="2"/>',
  swiss: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 10h18M10 3v18"/>',
  brutalism: '<path d="M4 5h14v14H4zM8 19v3h14V8h-4"/>',
  depth: '<path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  retro: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 9h10v6H7zM7 12h3m4 0h3"/>',
  editorial: '<path d="M4 4h7v16H4zM14 4h6M14 9h6M14 14h6M14 19h6"/>',
  y2k: '<path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/>',
  hypertech: '<path d="m13 2-9 12h7l-1 8 10-13h-8z"/>',
  soft3d: '<rect x="4" y="4" width="16" height="16" rx="6"/><path d="M8 10a4 4 0 0 1 4-3"/>'
};

export function icon(name, className = '') {
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spectrum}</svg>`;
}
