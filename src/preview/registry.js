import { deepFreeze } from '../catalog/contract.js';
import {
  PREVIEW_COMPONENT_TABS,
  PREVIEW_MOTION_CHANNELS,
  PREVIEW_REFERENCE_KINDS,
  createPreviewRegistryError,
  isPreviewClassName,
  isPreviewIdentifier,
  isSafePreviewAssetPath
} from './contract.js';

function definitionError(referenceKind, referenceId, message) {
  throw createPreviewRegistryError('PREVIEW_DEFINITION_INVALID', message, {
    referenceKind,
    referenceId
  });
}

function assertDefinitionRecord(definition, referenceKind) {
  if (!definition || typeof definition !== 'object' || Array.isArray(definition)) {
    definitionError(referenceKind, null, '프리뷰 definition은 객체여야 합니다.');
  }
}

function normalizeAssetPaths(value, referenceKind, referenceId) {
  if (!Array.isArray(value)) {
    definitionError(referenceKind, referenceId, 'assetPaths는 배열이어야 합니다.');
  }

  const paths = [];
  const seen = new Set();
  for (const path of value) {
    if (!isSafePreviewAssetPath(path) || seen.has(path)) {
      definitionError(referenceKind, referenceId, 'assetPaths는 중복 없는 안전한 프로젝트 상대 경로여야 합니다.');
    }
    seen.add(path);
    paths.push(path);
  }
  return Object.freeze(paths);
}

function normalizeId(definition, referenceKind) {
  const id = definition?.id;
  if (!isPreviewIdentifier(id)) {
    definitionError(referenceKind, typeof id === 'string' ? id : null, '프리뷰 ID는 kebab-case여야 합니다.');
  }
  return id;
}

function normalizeRenderer(definition) {
  const referenceKind = 'renderer';
  assertDefinitionRecord(definition, referenceKind);
  const id = normalizeId(definition, referenceKind);
  if (!Array.isArray(definition.aliases)) {
    definitionError(referenceKind, id, 'renderer aliases는 배열이어야 합니다.');
  }
  const aliases = [];
  const seenAliases = new Set();
  for (const alias of definition.aliases) {
    if (!isPreviewIdentifier(alias) || seenAliases.has(alias)) {
      definitionError(referenceKind, id, 'renderer aliases는 중복 없는 kebab-case여야 합니다.');
    }
    seenAliases.add(alias);
    aliases.push(alias);
  }
  if (!Array.isArray(definition.tabs) || definition.tabs.length === 0) {
    definitionError(referenceKind, id, 'renderer tabs는 비어 있지 않은 배열이어야 합니다.');
  }
  const tabs = [];
  const seenTabs = new Set();
  for (const tab of definition.tabs) {
    if (!PREVIEW_COMPONENT_TABS.includes(tab) || seenTabs.has(tab)) {
      definitionError(referenceKind, id, 'renderer tabs는 지원 탭의 중복 없는 부분집합이어야 합니다.');
    }
    seenTabs.add(tab);
    tabs.push(tab);
  }
  if (typeof definition.render !== 'function') {
    definitionError(referenceKind, id, 'renderer render는 함수여야 합니다.');
  }

  return Object.freeze({
    id,
    aliases: Object.freeze(aliases),
    tabs: Object.freeze(tabs),
    assetPaths: normalizeAssetPaths(definition.assetPaths, referenceKind, id),
    render: definition.render
  });
}

function normalizeThumbnail(definition) {
  const referenceKind = 'thumbnail';
  assertDefinitionRecord(definition, referenceKind);
  const id = normalizeId(definition, referenceKind);
  if (typeof definition.render !== 'function') {
    definitionError(referenceKind, id, 'thumbnail render는 함수여야 합니다.');
  }
  return Object.freeze({
    id,
    assetPaths: normalizeAssetPaths(definition.assetPaths, referenceKind, id),
    render: definition.render
  });
}

function normalizeMotion(definition) {
  const referenceKind = 'motion';
  assertDefinitionRecord(definition, referenceKind);
  const id = normalizeId(definition, referenceKind);
  if (definition.unitClass !== `motion-${id}` || !isPreviewClassName(definition.unitClass)) {
    definitionError(referenceKind, id, 'motion unitClass는 motion-<id> 형식이어야 합니다.');
  }
  if (definition.effectClass !== `fx-${id}` || !isPreviewClassName(definition.effectClass)) {
    definitionError(referenceKind, id, 'motion effectClass는 fx-<id> 형식이어야 합니다.');
  }
  if (typeof definition.effectLayer !== 'boolean') {
    definitionError(referenceKind, id, 'motion effectLayer는 boolean이어야 합니다.');
  }
  if (!Array.isArray(definition.channels) || definition.channels.length === 0) {
    definitionError(referenceKind, id, 'motion channels는 비어 있지 않은 배열이어야 합니다.');
  }
  const channels = [];
  const seenChannels = new Set();
  for (const channel of definition.channels) {
    if (!PREVIEW_MOTION_CHANNELS.includes(channel) || seenChannels.has(channel)) {
      definitionError(referenceKind, id, 'motion channels는 허용 값의 중복 없는 배열이어야 합니다.');
    }
    seenChannels.add(channel);
    channels.push(channel);
  }
  if (channels.includes('metadata-only') && channels.length !== 1) {
    definitionError(referenceKind, id, 'metadata-only motion은 다른 channel과 함께 선언할 수 없습니다.');
  }
  if (definition.reducedMotionPolicy !== 'suppress') {
    definitionError(referenceKind, id, 'motion reducedMotionPolicy는 suppress여야 합니다.');
  }

  return deepFreeze({
    id,
    unitClass: definition.unitClass,
    effectClass: definition.effectClass,
    effectLayer: definition.effectLayer,
    channels,
    reducedMotionPolicy: definition.reducedMotionPolicy,
    assetPaths: [...normalizeAssetPaths(definition.assetPaths, referenceKind, id)]
  });
}

function normalizeCollection(value, referenceKind, normalizeDefinition) {
  if (!Array.isArray(value)) {
    definitionError(referenceKind, null, `${referenceKind} definitions는 배열이어야 합니다.`);
  }
  const definitions = [];
  const byId = new Map();
  for (const definition of value) {
    const normalized = normalizeDefinition(definition);
    if (byId.has(normalized.id)) {
      throw createPreviewRegistryError(
        'PREVIEW_DEFINITION_DUPLICATE',
        '같은 reference kind 안에서 정규 ID는 중복될 수 없습니다.',
        { referenceKind, referenceId: normalized.id }
      );
    }
    byId.set(normalized.id, normalized);
    definitions.push(normalized);
  }
  return { definitions: Object.freeze(definitions), byId };
}

function buildRendererLookup(rendererDefinitions, rendererById) {
  const lookup = new Map(rendererById);
  const aliasOwners = new Map();
  for (const definition of rendererDefinitions) {
    for (const alias of definition.aliases) {
      if (rendererById.has(alias) || aliasOwners.has(alias)) {
        throw createPreviewRegistryError(
          'PREVIEW_ALIAS_COLLISION',
          'renderer alias는 정규 ID나 다른 alias와 충돌할 수 없습니다.',
          { referenceKind: 'renderer', referenceId: alias }
        );
      }
      aliasOwners.set(alias, definition.id);
      lookup.set(alias, definition);
    }
  }
  return lookup;
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right, 'en'));
}

function collectAssetPaths(...definitionGroups) {
  return sorted(new Set(
    definitionGroups.flatMap(definitions => definitions.flatMap(definition => definition.assetPaths))
  ));
}

function publicRendererCapability(definition, requestedId) {
  return deepFreeze({
    id: definition.id,
    requestedId,
    isAlias: requestedId !== definition.id,
    tabs: [...definition.tabs],
    assetPaths: [...definition.assetPaths]
  });
}

function assertRenderOutput(output, details) {
  if (typeof output !== 'string' || output.length === 0) {
    throw createPreviewRegistryError(
      'PREVIEW_RENDER_OUTPUT_INVALID',
      '프리뷰 구현은 비어 있지 않은 HTML 문자열을 반환해야 합니다.',
      details
    );
  }
  return output;
}

function resolveMotionDefinition(motionById, design, tab) {
  const motionId = design?.preview?.motionId ?? design?.motionProfile;
  const definition = typeof motionId === 'string' ? motionById.get(motionId) : null;
  if (!definition) {
    throw createPreviewRegistryError(
      'PREVIEW_REFERENCE_UNKNOWN',
      '등록되지 않은 motion입니다.',
      { referenceKind: 'motion', referenceId: motionId, tab }
    );
  }
  return definition;
}

function applyMotionUnitClass(output, motionDefinition, details) {
  const marker = 'class="mockup-unit';
  const markerIndex = output.indexOf(marker);
  const markerEnd = markerIndex + marker.length;
  const classEnd = output.indexOf('"', markerEnd);
  const tagEnd = output.indexOf('>', markerEnd);
  if (
    markerIndex < 0 ||
    (output[markerEnd] !== '"' && !/\s/u.test(output[markerEnd] || '')) ||
    classEnd < 0 ||
    tagEnd < 0 ||
    classEnd > tagEnd
  ) {
    throw createPreviewRegistryError(
      'PREVIEW_RENDER_OUTPUT_INVALID',
      'component renderer output에는 mockup-unit root class가 필요합니다.',
      details
    );
  }

  const classValue = output.slice(markerIndex + 'class="'.length, classEnd);
  if (classValue.split(/\s+/u).includes(motionDefinition.unitClass)) {
    return output;
  }

  return `${output.slice(0, markerEnd)} ${motionDefinition.unitClass}${output.slice(markerEnd)}`;
}

export function createPreviewRegistry(definitionGroups) {
  if (!definitionGroups || typeof definitionGroups !== 'object' || Array.isArray(definitionGroups)) {
    definitionError(null, null, 'preview definition groups는 객체여야 합니다.');
  }

  const renderers = normalizeCollection(definitionGroups.renderers, 'renderer', normalizeRenderer);
  const thumbnails = normalizeCollection(definitionGroups.thumbnails, 'thumbnail', normalizeThumbnail);
  const motions = normalizeCollection(definitionGroups.motions, 'motion', normalizeMotion);
  const rendererLookup = buildRendererLookup(renderers.definitions, renderers.byId);

  const inventory = deepFreeze({
    rendererIds: sorted(renderers.byId.keys()),
    thumbnailIds: sorted(thumbnails.byId.keys()),
    motionIds: sorted(motions.byId.keys()),
    assetPaths: collectAssetPaths(renderers.definitions, thumbnails.definitions, motions.definitions)
  });

  function hasPreviewReference(referenceKind, referenceId) {
    if (!PREVIEW_REFERENCE_KINDS.includes(referenceKind) || typeof referenceId !== 'string') {
      return false;
    }
    if (referenceKind === 'renderer') return rendererLookup.has(referenceId);
    if (referenceKind === 'thumbnail') return thumbnails.byId.has(referenceId);
    return motions.byId.has(referenceId);
  }

  function getPreviewRendererCapability(rendererId) {
    if (typeof rendererId !== 'string') return null;
    const definition = rendererLookup.get(rendererId);
    return definition ? publicRendererCapability(definition, rendererId) : null;
  }

  function getPreviewMotionDefinition(motionId) {
    if (typeof motionId !== 'string') return null;
    return motions.byId.get(motionId) || null;
  }

  function renderPreviewComponent(options = {}) {
    const rendererId = options?.rendererId;
    const tab = options?.tab;
    const definition = typeof rendererId === 'string' ? rendererLookup.get(rendererId) : null;
    if (!definition) {
      throw createPreviewRegistryError(
        'PREVIEW_REFERENCE_UNKNOWN',
        '등록되지 않은 renderer입니다.',
        { referenceKind: 'renderer', referenceId: rendererId, tab }
      );
    }
    if (!definition.tabs.includes(tab)) {
      throw createPreviewRegistryError(
        'PREVIEW_TAB_UNSUPPORTED',
        'renderer가 지원하지 않는 component tab입니다.',
        { referenceKind: 'renderer', referenceId: rendererId, tab }
      );
    }
    const details = {
      referenceKind: 'renderer',
      referenceId: rendererId,
      tab
    };
    const motionDefinition = resolveMotionDefinition(motions.byId, options?.design, tab);
    const output = assertRenderOutput(definition.render(tab, options?.design), details);
    return applyMotionUnitClass(output, motionDefinition, details);
  }

  function renderPreviewThumbnail(options = {}) {
    const thumbnailId = options?.thumbnailId;
    const definition = typeof thumbnailId === 'string' ? thumbnails.byId.get(thumbnailId) : null;
    if (!definition) {
      throw createPreviewRegistryError(
        'PREVIEW_REFERENCE_UNKNOWN',
        '등록되지 않은 thumbnail입니다.',
        { referenceKind: 'thumbnail', referenceId: thumbnailId }
      );
    }
    return assertRenderOutput(definition.render(options?.design), {
      referenceKind: 'thumbnail',
      referenceId: thumbnailId
    });
  }

  return Object.freeze({
    getPreviewReferenceInventory: () => inventory,
    hasPreviewReference,
    getPreviewRendererCapability,
    getPreviewMotionDefinition,
    renderPreviewComponent,
    renderPreviewThumbnail
  });
}
