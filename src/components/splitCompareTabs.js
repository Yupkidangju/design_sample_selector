const SPLIT_ARCHETYPES = [
  { id: 'game', label: '🎮 게임' },
  { id: 'web', label: '🌐 웹' },
  { id: 'mobile', label: '📱 모바일' },
  { id: 'ecommerce', label: '🛍️ 쇼핑몰' },
  { id: 'blog', label: '📰 블로그' },
  { id: 'dashboard', label: '📊 대시보드' },
  { id: 'media', label: '🎵 미디어' },
  { id: 'chat', label: '💬 채팅' }
];

export function getSplitArchetypeTabs(activeArchetype) {
  return SPLIT_ARCHETYPES.map(tab => {
    const isActive = tab.id === activeArchetype;
    return {
      ...tab,
      ariaSelected: String(isActive),
      tabIndex: isActive ? 0 : -1
    };
  });
}

export function getNextSplitArchetype(currentArchetype, key) {
  const currentIndex = SPLIT_ARCHETYPES.findIndex(tab => tab.id === currentArchetype);
  if (currentIndex < 0) return null;
  if (key === 'Home') return SPLIT_ARCHETYPES[0].id;
  if (key === 'End') return SPLIT_ARCHETYPES.at(-1).id;
  if (!['ArrowLeft', 'ArrowRight'].includes(key)) return null;

  const direction = key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (currentIndex + direction + SPLIT_ARCHETYPES.length) % SPLIT_ARCHETYPES.length;
  return SPLIT_ARCHETYPES[nextIndex].id;
}
