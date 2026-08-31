export function formatLocaleCopy(copy, key, values = {}) {
  const template = copy?.[key];
  if (typeof template !== 'string') return key;
  return template.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, name) => (
    Object.hasOwn(values, name) ? String(values[name]) : match
  ));
}
