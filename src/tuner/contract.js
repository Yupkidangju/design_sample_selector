/** Inspector 튜너가 허용하는 단일 경계 계약. */
export const TUNER_LIMITS = Object.freeze({
  borderRadius: Object.freeze({ min: 0, max: 64, step: 1 }),
  borderWidth: Object.freeze({ min: 0, max: 12, step: 1 }),
  shadowDepth: Object.freeze({ min: 0, max: 30, step: 1 }),
  backdropBlur: Object.freeze({ min: 0, max: 32, step: 1 }),
  glowIntensity: Object.freeze({ min: 0, max: 2, step: 0.1 })
});

export function isTweakValueValid(key, value) {
  const limit = TUNER_LIMITS[key];
  return Boolean(limit && Number.isFinite(value) && value >= limit.min && value <= limit.max);
}

export function isTweakPatchValid(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.entries(value).every(([key, item]) => isTweakValueValid(key, item))
  );
}
