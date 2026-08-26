/**
 * Detail View & Split Comparison Modal Component v2.3
 * Features:
 * - Universal Top Design Selector Bar (8 Major Categories & 24 Sub-Styles Instant Switching)
 * - 8 Core Page Archetypes (Game, Web SaaS, Mobile, E-Commerce, Blog, Dashboard, Media, Chat)
 * - Zero-Rebuild Dynamic Theme Injection (DOM Preservation on Style Switch)
 * - WAI-ARIA Compliant Modal Focus Trap & Keyboard Navigation
 * - Live CSS Parameter Tuner Sliders & Real-time CSS/HTML Code Inspector
 * - Copyable Color Palette Cards & Pros/Cons Interactive Cards
 * - Side-by-Side Dual Split Comparison Sandbox Mode
 */

import { MAIN_CATEGORIES, getAllSubDesigns } from '../data/categories.js';
import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { getMockupHTML } from './mockupTemplates.js';
import { getArchetypeHTML } from './archetypeTemplates.js';
import { getNextSplitArchetype, getSplitArchetypeTabs } from './splitCompareTabs.js';
import { hydrateMockup, teardownMockup } from './mockupRuntime.js';
import { confirmStyle, openSplitCompare } from '../utils/selection.js';
import {
  createDefaultInspectorUiState,
  createInspectorArtifacts,
  resolveInspectorContext
} from '../utils/inspectorState.js';
import { canvasVisualEngine } from '../wasm/visualEngine.js';
import { 
  generateLiveCSSSnippet, 
  generateLiveDesignSpecMarkdown, 
  generateLiveTokensJSON, 
  downloadFile 
} from '../utils/designSpecGenerator.js';

const ALL_SUB_DESIGNS = getAllSubDesigns();
let detailKeyHandler = null;
let splitKeyHandler = null;
let lastFocusedElement = null;
let activeFocusTrap = null;

export function renderDetailView(container) {
  if (!container) return;

  let currentRenderedView = null; // 'DETAIL' | 'SPLIT_COMPARE' | null
  let currentRenderedSubId = null;
  let currentRenderedArchetype = null;
  let currentRenderedTab = null;
  let currentRenderedDevice = null;
  let currentRenderedCompareIds = [null, null];
  let { activeTab: activeInspectorTab, activeCssMode: activeCssSubMode } = createDefaultInspectorUiState();
  let rafInspectorUpdateId = null;

  function resetInspectorUiState() {
    const defaultState = createDefaultInspectorUiState();
    activeInspectorTab = defaultState.activeTab;
    activeCssSubMode = defaultState.activeCssMode;
  }

  function update() {
    const state = appState.getState();
    const { 
      currentView, 
      selectedMainCategory, 
      selectedSubCategory, 
      activeArchetype = 'game', 
      activeComponentTab = 'hero', 
      sandboxDevice = 'desktop', 
      compareSubIds, 
      liveTweaks, 
      bookmarks 
    } = state;

    // 1. Handle SPLIT_COMPARE View
    if (currentView === 'SPLIT_COMPARE') {
      container.style.display = 'block';
      canvasVisualEngine.pauseLoop();

      const needFullSplitRender = (
        currentRenderedView !== 'SPLIT_COMPARE' ||
        currentRenderedCompareIds[0] !== compareSubIds[0] ||
        currentRenderedCompareIds[1] !== compareSubIds[1]
      );

      if (needFullSplitRender) {
        renderSplitCompareView(container, compareSubIds, activeArchetype, activeComponentTab);
        currentRenderedView = 'SPLIT_COMPARE';
        currentRenderedSubId = null;
        currentRenderedArchetype = activeArchetype;
        currentRenderedTab = activeComponentTab;
        currentRenderedCompareIds = [...compareSubIds];
      } else if (currentRenderedArchetype !== activeArchetype || currentRenderedTab !== activeComponentTab) {
        updateSplitTabsOnly(container, compareSubIds, activeArchetype, activeComponentTab);
        currentRenderedArchetype = activeArchetype;
        currentRenderedTab = activeComponentTab;
      }
      return;
    }

    // 2. Handle Closed / Main View
    if (currentView !== 'DETAIL' || !selectedMainCategory || !selectedSubCategory) {
      if (currentRenderedView) {
        teardownHydratedViewports(container);
        removeFocusTrap();
        canvasVisualEngine.resumeLoop();
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          try { lastFocusedElement.focus(); } catch { /* ignore */ }
          lastFocusedElement = null;
        }
      }
      container.style.display = 'none';
      container.innerHTML = '';
      currentRenderedView = null;
      currentRenderedSubId = null;
      currentRenderedArchetype = null;
      currentRenderedTab = null;
      currentRenderedCompareIds = [null, null];
      return;
    }

    // 3. Handle DETAIL View
    const mainCat = MAIN_CATEGORIES.find(c => c.id === selectedMainCategory);
    if (!mainCat) return;

    const subDesign = mainCat.subCategories.find(s => s.id === selectedSubCategory);
    if (!subDesign) return;

    container.style.display = 'block';
    canvasVisualEngine.pauseLoop();

    const isInitialOpen = currentRenderedView !== 'DETAIL';
    const needArchetypeRebuild = isInitialOpen || currentRenderedArchetype !== activeArchetype || (activeArchetype === 'web' && currentRenderedTab !== activeComponentTab);
    const needThemeSwapOnly = !needArchetypeRebuild && currentRenderedSubId !== selectedSubCategory;

    if (isInitialOpen) {
      resetInspectorUiState();
      // SPLIT→DETAIL 재진입은 스플릿 컨트롤로 opener를 덮어쓰지 않는다 (SEC-F003)
      if (currentRenderedView !== 'SPLIT_COMPARE') {
        lastFocusedElement = document.activeElement;
      }
      renderFullDetailModal(container, subDesign, mainCat, state);
      currentRenderedView = 'DETAIL';
      currentRenderedSubId = selectedSubCategory;
      currentRenderedArchetype = activeArchetype;
      currentRenderedTab = activeComponentTab;
      currentRenderedDevice = sandboxDevice;
      setupFocusTrap(container);
    } else if (needArchetypeRebuild) {
      // Archetype changed: rebuild viewport HTML
      rebuildArchetypeViewport(container, subDesign, activeArchetype, activeComponentTab, sandboxDevice);
      updateDetailMetadataAndInspector(container, subDesign, mainCat, state);
      currentRenderedSubId = selectedSubCategory;
      currentRenderedArchetype = activeArchetype;
      currentRenderedTab = activeComponentTab;
      currentRenderedDevice = sandboxDevice;
    } else if (needThemeSwapOnly) {
      // Zero-Rebuild Theme Swap: atomic token & variable swap, preserving DOM state!
      applyZeroRebuildThemeSwap(container, subDesign, mainCat, state);
      updateDetailMetadataAndInspector(container, subDesign, mainCat, state);
      currentRenderedSubId = selectedSubCategory;
      currentRenderedDevice = sandboxDevice;
    } else {
      // Minor parameter/device update
      updateDetailGranular(container, subDesign, state, false);
      currentRenderedDevice = sandboxDevice;
    }
  }

  // --- Full Detail Modal Initial Render ---
  function teardownHydratedViewports(root) {
    if (!root) return;
    root.querySelectorAll('#mockup-viewport, #split-viewport-a, #split-viewport-b').forEach((el) => {
      teardownMockup(el);
    });
  }

  function getCurrentInspectorArtifacts(root) {
    const html = root.querySelector('#mockup-viewport')?.innerHTML.trim() || '';
    return createInspectorArtifacts(appState.getState(), ALL_SUB_DESIGNS, html);
  }

  function getCurrentInspectorContent(root, tab = activeInspectorTab, cssMode = activeCssSubMode) {
    const artifacts = getCurrentInspectorArtifacts(root);
    if (!artifacts) return '';
    if (tab === 'html') return artifacts.html;
    if (tab === 'md') return artifacts.markdown;
    if (tab === 'json') return artifacts.json;
    return artifacts.css[cssMode] || artifacts.css.full;
  }

  function refreshAllInspectorPanes(root) {
    if (!root) return;

    if (rafInspectorUpdateId) {
      cancelAnimationFrame(rafInspectorUpdateId);
    }

    rafInspectorUpdateId = requestAnimationFrame(() => {
      rafInspectorUpdateId = null;
      const artifacts = getCurrentInspectorArtifacts(root);
      if (!artifacts) return;

      // 1. CSS Pane
      const cssElem = root.querySelector('#live-css-code');
      if (cssElem) {
        cssElem.textContent = artifacts.css[activeCssSubMode] || artifacts.css.full;
      }

      // 2. HTML Pane
      const htmlElem = root.querySelector('#live-html-code');
      if (htmlElem) {
        htmlElem.textContent = artifacts.html;
      }

      // 3. Markdown Pane
      const mdElem = root.querySelector('#live-md-code');
      if (mdElem) {
        mdElem.textContent = artifacts.markdown;
      }

      // 4. JSON Tokens Pane
      const jsonElem = root.querySelector('#live-json-code');
      if (jsonElem) {
        jsonElem.textContent = artifacts.json;
      }
    });
  }

  function renderFullDetailModal(root, subDesign, mainCat, state) {
    teardownHydratedViewports(root);
    const { activeArchetype = 'game', activeComponentTab = 'hero', sandboxDevice = 'desktop', liveTweaks, bookmarks } = state;
    const isBookmarked = bookmarks.includes(subDesign.id);

    root.innerHTML = `
      <div class="detail-modal-backdrop" id="modal-backdrop"></div>
      
      <div class="detail-modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-style-title" style="--modal-accent: ${mainCat.accentColor}">
        
        <!-- UNIVERSAL TOP DESIGN SELECTOR BAR -->
        <header class="universal-top-bar" id="universal-top-bar">
          <div class="top-bar-row-main">
            <div class="top-breadcrumbs">
              <button class="breadcrumb-back-btn" id="btn-modal-back" title="메인 갤러리로 돌아가기">
                <span>← 메인</span>
              </button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-category" id="top-cat-name">${mainCat.title}</span>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-sub" id="top-sub-name">${subDesign.name}</span>
            </div>

            <!-- 8 Major Category Tabs -->
            <nav class="top-cat-tabs" role="tablist" aria-label="디자인 대분류">
              ${MAIN_CATEGORIES.map(c => `
                <button class="top-cat-tab-btn ${c.id === mainCat.id ? 'active' : ''}" 
                        data-cat-id="${c.id}" 
                        style="--cat-accent: ${c.accentColor}"
                        role="tab"
                        aria-selected="${c.id === mainCat.id}">
                  <span>${c.icon}</span>
                  <span>${c.title}</span>
                </button>
              `).join('')}
            </nav>

            <div class="modal-top-actions">
              <button class="modal-action-chip ${isBookmarked ? 'active' : ''}" id="btn-modal-bookmark" title="즐겨찾기 토글">
                <span>${isBookmarked ? '★ 북마크됨' : '☆ 북마크'}</span>
              </button>
              <button class="modal-action-chip" id="btn-modal-confirm" title="이 스타일 확정">
                <span>${state.confirmedStyleId === subDesign.id ? '✓ 확정됨' : '이 스타일 확정'}</span>
              </button>
              <button class="modal-action-chip" id="btn-modal-compare" title="다른 스타일과 나란히 비교">
                <span>⚖️ 스플릿 비교</span>
              </button>
              <button class="modal-close-btn" id="btn-modal-close" aria-label="닫기">
                <span>✕</span>
              </button>
            </div>
          </div>

          <!-- 24 Sub-Styles Thumbnail Chips Scroller -->
          <div class="top-style-chips-scroller" id="top-style-chips-scroller" role="tablist" aria-label="24개 세부 스타일">
            ${ALL_SUB_DESIGNS.map(s => `
              <button class="top-style-chip ${s.id === subDesign.id ? 'active' : ''}" 
                      data-sub-id="${s.id}" 
                      data-cat-id="${s.categoryId}"
                      title="[${s.categoryTitle}] ${s.name}"
                      role="tab"
                      aria-selected="${s.id === subDesign.id}">
                <span class="chip-thumb-mini">${getMockupHTML(s.previewType, 'thumb', s)}</span>
                <span>${s.name}</span>
              </button>
            `).join('')}
          </div>
        </header>

        <!-- Main 2-Column Content Grid -->
        <div class="modal-body-grid">
          <!-- Left Column: Live Interactive Mockup Sandbox -->
          <section class="mockup-sandbox-section">
            <div class="sandbox-header">
              <!-- 8 Core Page Archetypes Navigation -->
              <div class="archetype-tabs-nav" role="tablist" aria-label="화면 아키타입">
                <button class="archetype-tab-btn ${activeArchetype === 'game' ? 'active' : ''}" data-archetype="game" role="tab" aria-selected="${activeArchetype === 'game'}">
                  <span>🎮 게임</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'web' ? 'active' : ''}" data-archetype="web" role="tab" aria-selected="${activeArchetype === 'web'}">
                  <span>🌐 웹 SaaS</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'mobile' ? 'active' : ''}" data-archetype="mobile" role="tab" aria-selected="${activeArchetype === 'mobile'}">
                  <span>📱 모바일</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'ecommerce' ? 'active' : ''}" data-archetype="ecommerce" role="tab" aria-selected="${activeArchetype === 'ecommerce'}">
                  <span>🛍️ 쇼핑몰</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'blog' ? 'active' : ''}" data-archetype="blog" role="tab" aria-selected="${activeArchetype === 'blog'}">
                  <span>📰 블로그</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'dashboard' ? 'active' : ''}" data-archetype="dashboard" role="tab" aria-selected="${activeArchetype === 'dashboard'}">
                  <span>📊 대시보드</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'media' ? 'active' : ''}" data-archetype="media" role="tab" aria-selected="${activeArchetype === 'media'}">
                  <span>🎵 미디어</span>
                </button>
                <button class="archetype-tab-btn ${activeArchetype === 'chat' ? 'active' : ''}" data-archetype="chat" role="tab" aria-selected="${activeArchetype === 'chat'}">
                  <span>💬 채팅</span>
                </button>
              </div>

              <!-- Device & Zoom Controls -->
              <div class="sandbox-controls-group">
                <div class="zoom-switcher" role="group" aria-label="뷰포트 배율">
                  <button class="zoom-btn" data-scale="0.8" title="80% 축소">80%</button>
                  <button class="zoom-btn active" data-scale="1.0" title="100% 기본">100%</button>
                  <button class="zoom-btn" data-scale="1.2" title="120% 확대">120%</button>
                </div>
                <div class="device-switcher" role="group" aria-label="디바이스 전환">
                  <button class="device-btn ${sandboxDevice === 'desktop' ? 'active' : ''}" data-device="desktop">💻 Desktop</button>
                  <button class="device-btn ${sandboxDevice === 'mobile' ? 'active' : ''}" data-device="mobile">📱 Mobile</button>
                </div>
              </div>
            </div>

            <!-- Web Archetype Sub-Tabs (Hero, Widget, Form, Pricing) -->
            <div class="component-tabs-nav" id="web-sub-tabs" role="tablist" style="display: ${activeArchetype === 'web' ? 'flex' : 'none'};">
              <button class="comp-tab-btn ${activeComponentTab === 'hero' ? 'active' : ''}" data-tab="hero" role="tab" aria-selected="${activeComponentTab === 'hero'}">
                <span>🎯 히어로</span>
              </button>
              <button class="comp-tab-btn ${activeComponentTab === 'widget' ? 'active' : ''}" data-tab="widget" role="tab" aria-selected="${activeComponentTab === 'widget'}">
                <span>📊 위젯</span>
              </button>
              <button class="comp-tab-btn ${activeComponentTab === 'form' ? 'active' : ''}" data-tab="form" role="tab" aria-selected="${activeComponentTab === 'form'}">
                <span>⚡ 폼</span>
              </button>
              <button class="comp-tab-btn ${activeComponentTab === 'pricing' ? 'active' : ''}" data-tab="pricing" role="tab" aria-selected="${activeComponentTab === 'pricing'}">
                <span>🏷️ 가격표</span>
              </button>
            </div>

            <!-- Dynamic Live Rendered UI Archetype Sandbox Viewport -->
            <div class="mockup-viewport ${sandboxDevice}" 
                 id="mockup-viewport"
                 data-theme="${subDesign.id}"
                 data-archetype="${activeArchetype}"
                 style="
                   --theme-radius: ${liveTweaks.borderRadius}px;
                   --theme-border-width: ${liveTweaks.borderWidth}px;
                   --theme-shadow: 0 ${liveTweaks.shadowDepth}px ${Math.max(10, liveTweaks.shadowDepth * 2)}px rgba(0, 0, 0, 0.5);
                   --tweak-radius: ${liveTweaks.borderRadius}px;
                   --tweak-border-width: ${liveTweaks.borderWidth}px;
                   --tweak-shadow-depth: ${liveTweaks.shadowDepth}px;
                   --tweak-backdrop-blur: ${liveTweaks.backdropBlur}px;
                   --tweak-glow-intensity: ${liveTweaks.glowIntensity};
                 ">
              ${getArchetypeHTML(activeArchetype, subDesign, { tab: activeComponentTab })}
            </div>
            
            <div class="sandbox-footer-hint">
              <span>💡 화면 내부 요소를 클릭하거나 조작하면 실제 인터랙션 및 사운드가 작동합니다.</span>
            </div>
          </section>

          <!-- Right Column: Inspector, Parameters & Meta -->
          <aside class="detail-sidebar-section">
            <div class="style-hero-summary">
              <div class="style-badge-row">
                <span class="style-category-badge">${mainCat.title}</span>
                <span class="style-motion-badge">모션: ${subDesign.motionProfile || 'Normal'}</span>
              </div>
              <h2 class="style-title" id="modal-style-title">${subDesign.name}</h2>
              <span class="style-title-en">${subDesign.nameEn}</span>
              <p class="style-desc">${subDesign.shortDesc}</p>
            </div>

            <!-- Palette Palette -->
            <div class="sidebar-block">
              <h3 class="block-title">🎨 고유 컬러 팔레트 (클릭하여 HEX 복사)</h3>
              <div class="palette-swatches-grid" id="palette-swatches-grid">
                ${subDesign.palette.map(p => `
                  <button class="palette-swatch-card" data-hex="${p.hex}" data-name="${p.name}">
                    <span class="swatch-color" style="background: ${p.hex}"></span>
                    <div class="swatch-meta">
                      <span class="swatch-name">${p.name}</span>
                      <span class="swatch-hex">${p.hex}</span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Live Parameter Tuner Sliders -->
            <div class="sidebar-block">
              <div class="block-title-row">
                <h3 class="block-title">🎛️ 실시간 파라미터 튜너 (Live CSS Tuning)</h3>
                <button class="reset-tweaks-btn" id="btn-reset-tweaks" title="스타일 고유 기본값으로 리셋">↺ 기본값 리셋</button>
              </div>
              
              <div class="tweaks-controls-list">
                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <span>모서리 둥글기 (Border Radius)</span>
                    <strong id="val-radius">${liveTweaks.borderRadius}px</strong>
                  </div>
                  <input type="range" min="0" max="64" value="${liveTweaks.borderRadius}" class="tweak-slider" id="slider-radius" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <span>테두리 두께 (Border Width)</span>
                    <strong id="val-border">${liveTweaks.borderWidth}px</strong>
                  </div>
                  <input type="range" min="0" max="12" value="${liveTweaks.borderWidth}" class="tweak-slider" id="slider-border" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <span>그림자 깊이 (Shadow Depth)</span>
                    <strong id="val-shadow">${liveTweaks.shadowDepth}px</strong>
                  </div>
                  <input type="range" min="0" max="30" value="${liveTweaks.shadowDepth}" class="tweak-slider" id="slider-shadow" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <span>배경 블러 (Backdrop Blur)</span>
                    <strong id="val-blur">${liveTweaks.backdropBlur}px</strong>
                  </div>
                  <input type="range" min="0" max="32" value="${liveTweaks.backdropBlur}" class="tweak-slider" id="slider-blur" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <span>발광 강도 (Glow Intensity)</span>
                    <strong id="val-glow">${Number(liveTweaks.glowIntensity ?? 1).toFixed(1)}</strong>
                  </div>
                  <input type="range" min="0" max="2" step="0.1" value="${liveTweaks.glowIntensity ?? 1}" class="tweak-slider" id="slider-glow" />
                </div>
              </div>
            </div>

            <!-- Reactive Design Spec & Code Inspector (v2.3.0) -->
            <div class="sidebar-block" id="detail-inspector-block">
              <div class="block-title-row">
                <h3 class="block-title">🛠️ 실시간 디자인 사양 및 인스펙터</h3>
              </div>

              <!-- 4-Tab Navigation Bar -->
              <nav class="inspector-tab-nav" role="tablist" aria-label="디자인 인스펙터 탭">
                <button class="inspector-tab-btn active" data-insp-tab="css" role="tab" aria-selected="true" id="tab-insp-css">
                  <span>💻 Live CSS</span>
                </button>
                <button class="inspector-tab-btn" data-insp-tab="html" role="tab" aria-selected="false" id="tab-insp-html">
                  <span>📄 Live HTML</span>
                </button>
                <button class="inspector-tab-btn" data-insp-tab="md" role="tab" aria-selected="false" id="tab-insp-md">
                  <span>📋 Live designs.md</span>
                </button>
                <button class="inspector-tab-btn" data-insp-tab="json" role="tab" aria-selected="false" id="tab-insp-json">
                  <span>🏷️ Design Tokens</span>
                </button>
              </nav>

              <!-- Live CSS Sub-Toggles -->
              <div class="css-submode-nav" id="css-submode-nav">
                <button class="css-submode-btn active" data-css-sub="full">전체 번들</button>
                <button class="css-submode-btn" data-css-sub="tokens">테마 토큰만</button>
                <button class="css-submode-btn" data-css-sub="component">아키타입 CSS</button>
              </div>

              <!-- Inspector Content Panes -->
              <div class="inspector-viewer-container">
                <div class="inspector-pane active" id="pane-css">
                  <pre class="code-inspector-box"><code id="live-css-code">${generateLiveCSSSnippet(subDesign, liveTweaks, activeArchetype, activeCssSubMode)}</code></pre>
                </div>
                <div class="inspector-pane" id="pane-html">
                  <pre class="code-inspector-box"><code id="live-html-code"></code></pre>
                </div>
                <div class="inspector-pane" id="pane-md">
                  <pre class="code-inspector-box markdown-inspector-box"><code id="live-md-code">${generateLiveDesignSpecMarkdown(subDesign, liveTweaks, activeArchetype, sandboxDevice)}</code></pre>
                </div>
                <div class="inspector-pane" id="pane-json">
                  <pre class="code-inspector-box"><code id="live-json-code">${generateLiveTokensJSON(subDesign, liveTweaks)}</code></pre>
                </div>
              </div>

              <!-- Action Toolbar -->
              <div class="inspector-action-bar">
                <button class="inspector-action-btn" id="btn-inspector-copy" title="현재 탭 내용 복사">
                  <span>📋 클립보드 복사</span>
                </button>
                <button class="inspector-action-btn" id="btn-inspector-download" title="현재 탭 파일 다운로드">
                  <span id="btn-inspector-download-label">💾 .css 다운로드</span>
                </button>
                <button class="inspector-action-btn primary-export" id="btn-inspector-bundle" title="네 가지 산출물을 한 TXT로 합친 통합 스냅샷 내보내기">
                  <span>📦 통합 TXT 스냅샷</span>
                </button>
              </div>
            </div>

            <!-- Characteristics / Pros & Cons -->
            <div class="sidebar-block">
              <h3 class="block-title">📋 디자인 사조 특징 및 가이드</h3>
              <div class="characteristics-list" id="characteristics-list">
                ${subDesign.characteristics.map(c => `<div class="char-chip">✓ ${c}</div>`).join('')}
              </div>
              
              <div class="pros-cons-grid" id="pros-cons-grid">
                <div class="pros-box">
                  <h4>👍 장점 및 적합한 분야</h4>
                  <ul>${subDesign.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
                <div class="cons-box">
                  <h4>⚠️ 주의점 및 한계</h4>
                  <ul>${subDesign.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;

    attachDetailEventListeners(root);
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) {
      hydrateMockup(viewport, subDesign, { archetype: activeArchetype, tab: activeComponentTab });
    }
    refreshAllInspectorPanes(root);
  }

  // Rebuild viewport when Archetype changes
  function rebuildArchetypeViewport(root, subDesign, activeArchetype, activeComponentTab, sandboxDevice) {
    const viewport = root.querySelector('#mockup-viewport');
    if (!viewport) return;

    teardownMockup(viewport);
    viewport.innerHTML = getArchetypeHTML(activeArchetype, subDesign, { tab: activeComponentTab });
    viewport.className = `mockup-viewport ${sandboxDevice}`;
    viewport.setAttribute('data-theme', subDesign.id);
    viewport.setAttribute('data-archetype', activeArchetype);
    hydrateMockup(viewport, subDesign, { archetype: activeArchetype, tab: activeComponentTab });
    refreshAllInspectorPanes(root);

    // Update Archetype Tab Buttons
    root.querySelectorAll('.archetype-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-archetype') === activeArchetype;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', String(match));
    });

    const webSubTabs = root.querySelector('#web-sub-tabs');
    if (webSubTabs) {
      webSubTabs.style.display = activeArchetype === 'web' ? 'flex' : 'none';
    }
  }

  // Zero-Rebuild Theme Swapping (Preserves DOM & In-Memory Interaction State!)
  function applyZeroRebuildThemeSwap(root, newSubDesign, mainCat, state) {
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) {
      viewport.setAttribute('data-theme', newSubDesign.id);
      applyTweaksToDOM(root, state.liveTweaks, newSubDesign);
    }

    const modalContainer = root.querySelector('.detail-modal-container');
    if (modalContainer) {
      modalContainer.style.setProperty('--modal-accent', mainCat.accentColor);
    }

    // Update Top Breadcrumbs & Chips
    const topCatName = root.querySelector('#top-cat-name');
    const topSubName = root.querySelector('#top-sub-name');
    if (topCatName) topCatName.textContent = mainCat.title;
    if (topSubName) topSubName.textContent = newSubDesign.name;

    root.querySelectorAll('.top-cat-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-cat-id') === mainCat.id;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', String(match));
    });

    root.querySelectorAll('.top-style-chip').forEach(chip => {
      const match = chip.getAttribute('data-sub-id') === newSubDesign.id;
      chip.classList.toggle('active', match);
      chip.setAttribute('aria-selected', String(match));
      if (match) chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  // Update Metadata & Inspector in Sidebar
  function updateDetailMetadataAndInspector(root, subDesign, mainCat, state) {
    const title = root.querySelector('#modal-style-title');
    const titleEn = root.querySelector('.style-title-en');
    const desc = root.querySelector('.style-desc');
    const catBadge = root.querySelector('.style-category-badge');
    const motionBadge = root.querySelector('.style-motion-badge');

    if (title) title.textContent = subDesign.name;
    if (titleEn) titleEn.textContent = subDesign.nameEn;
    if (desc) desc.textContent = subDesign.shortDesc;
    if (catBadge) catBadge.textContent = mainCat.title;
    if (motionBadge) motionBadge.textContent = `모션: ${subDesign.motionProfile || 'Normal'}`;

    // Update Palette Swatches
    const paletteGrid = root.querySelector('#palette-swatches-grid');
    if (paletteGrid) {
      paletteGrid.innerHTML = subDesign.palette.map(p => `
        <button class="palette-swatch-card" data-hex="${p.hex}" data-name="${p.name}">
          <span class="swatch-color" style="background: ${p.hex}"></span>
          <div class="swatch-meta">
            <span class="swatch-name">${p.name}</span>
            <span class="swatch-hex">${p.hex}</span>
          </div>
        </button>
      `).join('');
    }

    // Update Characteristics & Pros/Cons
    const charList = root.querySelector('#characteristics-list');
    if (charList) {
      charList.innerHTML = subDesign.characteristics.map(c => `<div class="char-chip">✓ ${c}</div>`).join('');
    }

    const prosCons = root.querySelector('#pros-cons-grid');
    if (prosCons) {
      prosCons.innerHTML = `
        <div class="pros-box">
          <h4>👍 장점 및 적합한 분야</h4>
          <ul>${subDesign.pros.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="cons-box">
          <h4>⚠️ 주의점 및 한계</h4>
          <ul>${subDesign.cons.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      `;
    }

    // Update Bookmark & Confirm Buttons
    const bookmarkBtn = root.querySelector('#btn-modal-bookmark');
    if (bookmarkBtn) {
      const isBookmarked = state.bookmarks.includes(subDesign.id);
      bookmarkBtn.classList.toggle('active', isBookmarked);
      bookmarkBtn.querySelector('span').textContent = isBookmarked ? '★ 북마크됨' : '☆ 북마크';
    }

    const confirmBtn = root.querySelector('#btn-modal-confirm');
    if (confirmBtn) {
      const isConfirmed = state.confirmedStyleId === subDesign.id;
      confirmBtn.classList.toggle('active', isConfirmed);
      confirmBtn.querySelector('span').textContent = isConfirmed ? '✓ 확정됨' : '이 스타일 확정';
    }

    refreshAllInspectorPanes(root);
  }

  // Granular update for tweaks / sliders
  function updateDetailGranular(root, subDesign, state) {
    const { sandboxDevice = 'desktop', liveTweaks, bookmarks } = state;
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) {
      viewport.className = `mockup-viewport ${sandboxDevice}`;
    }
    applyTweaksToDOM(root, liveTweaks, subDesign);

    root.querySelectorAll('.device-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === sandboxDevice);
    });

    const bookmarkBtn = root.querySelector('#btn-modal-bookmark');
    if (bookmarkBtn) {
      const isBookmarked = bookmarks.includes(subDesign.id);
      bookmarkBtn.classList.toggle('active', isBookmarked);
      bookmarkBtn.querySelector('span').textContent = isBookmarked ? '★ 북마크됨' : '☆ 북마크';
    }
  }

  function applyTweaksToDOM(root, tweaks, subDesign) {
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) {
      viewport.style.setProperty('--theme-radius', `${tweaks.borderRadius}px`);
      viewport.style.setProperty('--theme-border-width', `${tweaks.borderWidth}px`);
      viewport.style.setProperty('--theme-shadow', `0 ${tweaks.shadowDepth}px ${Math.max(10, tweaks.shadowDepth * 2)}px rgba(0, 0, 0, 0.5)`);
      viewport.style.setProperty('--tweak-radius', `${tweaks.borderRadius}px`);
      viewport.style.setProperty('--tweak-border-width', `${tweaks.borderWidth}px`);
      viewport.style.setProperty('--tweak-shadow-depth', `${tweaks.shadowDepth}px`);
      viewport.style.setProperty('--tweak-backdrop-blur', `${tweaks.backdropBlur}px`);
      viewport.style.setProperty('--tweak-glow-intensity', `${tweaks.glowIntensity}`);
    }

    const valRadius = root.querySelector('#val-radius');
    const valBorder = root.querySelector('#val-border');
    const valShadow = root.querySelector('#val-shadow');
    const valBlur = root.querySelector('#val-blur');
    const valGlow = root.querySelector('#val-glow');

    if (valRadius) valRadius.textContent = `${tweaks.borderRadius}px`;
    if (valBorder) valBorder.textContent = `${tweaks.borderWidth}px`;
    if (valShadow) valShadow.textContent = `${tweaks.shadowDepth}px`;
    if (valBlur) valBlur.textContent = `${tweaks.backdropBlur}px`;
    if (valGlow) valGlow.textContent = `${Number(tweaks.glowIntensity ?? 1).toFixed(1)}`;

    const sliderRadius = root.querySelector('#slider-radius');
    const sliderBorder = root.querySelector('#slider-border');
    const sliderShadow = root.querySelector('#slider-shadow');
    const sliderBlur = root.querySelector('#slider-blur');
    const sliderGlow = root.querySelector('#slider-glow');

    if (sliderRadius && sliderRadius.value !== String(tweaks.borderRadius)) sliderRadius.value = tweaks.borderRadius;
    if (sliderBorder && sliderBorder.value !== String(tweaks.borderWidth)) sliderBorder.value = tweaks.borderWidth;
    if (sliderShadow && sliderShadow.value !== String(tweaks.shadowDepth)) sliderShadow.value = tweaks.shadowDepth;
    if (sliderBlur && sliderBlur.value !== String(tweaks.backdropBlur)) sliderBlur.value = tweaks.backdropBlur;
    if (sliderGlow && sliderGlow.value !== String(tweaks.glowIntensity)) sliderGlow.value = tweaks.glowIntensity ?? 1;

    refreshAllInspectorPanes(root);
  }

  // --- Attach Event Listeners ---
  function attachDetailEventListeners(root) {
    const closeModal = () => {
      synthAudio.playSfx('CLOSE');
      appState.setState({ currentView: 'MAIN' });
    };

    const backdrop = root.querySelector('#modal-backdrop');
    const closeBtn = root.querySelector('#btn-modal-close');
    const backBtn = root.querySelector('#btn-modal-back');

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backBtn) backBtn.addEventListener('click', closeModal);

    // 1. Top Category Tabs Switching
    root.querySelectorAll('.top-cat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        const targetCat = MAIN_CATEGORIES.find(c => c.id === catId);
        if (!targetCat || !targetCat.subCategories.length) return;
        const targetSub = targetCat.subCategories[0];
        
        synthAudio.playSfx('THEME_SWAP');
        const recents = [targetSub.id, ...appState.getState().recentlyViewed.filter(id => id !== targetSub.id)].slice(0, 6);
        appState.setState({
          selectedMainCategory: targetCat.id,
          selectedSubCategory: targetSub.id,
          liveTweaks: targetSub.defaultTweaks || appState.getState().liveTweaks,
          draftSubId: targetSub.id,
          recentlyViewed: recents
        });
      });
    });

    // 2. Top Sub-Style Chips Switching (Zero-Rebuild Theme Swap)
    root.querySelectorAll('.top-style-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const subId = chip.getAttribute('data-sub-id');
        const targetSub = ALL_SUB_DESIGNS.find(s => s.id === subId);
        if (!targetSub || targetSub.id === appState.getState().selectedSubCategory) return;

        synthAudio.playSfx('THEME_SWAP');
        const recents = [targetSub.id, ...appState.getState().recentlyViewed.filter(id => id !== targetSub.id)].slice(0, 6);
        appState.setState({
          selectedMainCategory: targetSub.categoryId,
          selectedSubCategory: targetSub.id,
          liveTweaks: targetSub.defaultTweaks || appState.getState().liveTweaks,
          draftSubId: targetSub.id,
          recentlyViewed: recents
        });
      });
    });

    // 3. Archetype Tabs Navigation
    root.querySelectorAll('.archetype-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const arch = btn.getAttribute('data-archetype');
        if (arch === appState.getState().activeArchetype) return;
        synthAudio.playSfx('CLICK');
        appState.setActiveArchetype(arch);
      });
    });

    // 4. Web Sub-Tabs (Hero, Widget, Form, Pricing)
    root.querySelectorAll('.comp-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === appState.getState().activeComponentTab) return;
        synthAudio.playSfx('CLICK');
        appState.setState({ activeComponentTab: tab });
      });
    });

    // 5. Device & Zoom Switcher
    root.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const device = btn.getAttribute('data-device');
        if (device === appState.getState().sandboxDevice) return;
        synthAudio.playSfx('CLICK');
        appState.setState({ sandboxDevice: device });
      });
    });

    root.querySelectorAll('.zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scale = parseFloat(btn.getAttribute('data-scale') || '1.0');
        root.querySelectorAll('.zoom-btn').forEach(b => b.classList.toggle('active', b === btn));
        const viewport = root.querySelector('#mockup-viewport');
        const unit = viewport?.querySelector('.archetype-unit') || viewport?.querySelector('.mockup-unit');
        if (unit) {
          unit.style.transform = `scale(${scale})`;
          unit.style.transformOrigin = 'center top';
        }
        synthAudio.playSfx('CLICK');
      });
    });

    // 6. Bookmark Toggle
    const bookmarkBtn = root.querySelector('#btn-modal-bookmark');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        const currentSubId = appState.getState().selectedSubCategory;
        const isNow = appState.toggleBookmark(currentSubId);
        synthAudio.playSfx('BOOKMARK');
        bookmarkBtn.classList.toggle('active', isNow);
        bookmarkBtn.querySelector('span').textContent = isNow ? '★ 북마크됨' : '☆ 북마크';
      });
    }

    // 7. Confirm Style Button
    const confirmBtn = root.querySelector('#btn-modal-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const currentSubId = appState.getState().selectedSubCategory;
        confirmStyle(currentSubId);
        confirmBtn.querySelector('span').textContent = '✓ 확정됨';
        confirmBtn.classList.add('active');
      });
    }

    // 8. Split Compare Trigger
    const compareBtn = root.querySelector('#btn-modal-compare');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        const currentSubId = appState.getState().selectedSubCategory;
        openSplitCompare(currentSubId);
      });
    }

    // 9. Palette Card Copy Listener (Delegation)
    const paletteGrid = root.querySelector('#palette-swatches-grid');
    if (paletteGrid) {
      paletteGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.palette-swatch-card');
        if (!card) return;
        const hex = card.getAttribute('data-hex');
        const name = card.getAttribute('data-name');
        copyToClipboard(hex, `${name} 색상 코드`);
      });
    }

    // 10. Dynamic 4-Tab Inspector & Action Toolbar Listeners
    // 10.1 Inspector Tab Switching
    root.querySelectorAll('.inspector-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-insp-tab');
        if (!tab || tab === activeInspectorTab) return;
        synthAudio.playSfx('CLICK');
        activeInspectorTab = tab;

        root.querySelectorAll('.inspector-tab-btn').forEach(b => {
          const isActive = b.getAttribute('data-insp-tab') === tab;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', String(isActive));
        });

        root.querySelectorAll('.inspector-pane').forEach(pane => {
          pane.classList.toggle('active', pane.id === `pane-${tab}`);
        });

        const subModeNav = root.querySelector('#css-submode-nav');
        if (subModeNav) {
          subModeNav.style.display = tab === 'css' ? 'flex' : 'none';
        }

        const downloadLabel = root.querySelector('#btn-inspector-download-label');
        if (downloadLabel) {
          const labels = {
            css: '💾 .css 다운로드',
            html: '💾 .html 다운로드',
            md: '💾 .md 다운로드',
            json: '💾 .json 다운로드'
          };
          downloadLabel.textContent = labels[tab] || '💾 파일 다운로드';
        }

        refreshAllInspectorPanes(root);
      });
    });

    // 10.2 CSS Sub-Mode Switching (Full Bundle, Tokens Only, Component CSS)
    root.querySelectorAll('.css-submode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-css-sub');
        if (!mode || mode === activeCssSubMode) return;
        synthAudio.playSfx('CLICK');
        activeCssSubMode = mode;

        root.querySelectorAll('.css-submode-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-css-sub') === mode);
        });

        refreshAllInspectorPanes(root);
      });
    });

    // 10.3 Inspector Action: Clipboard Copy
    const inspCopyBtn = root.querySelector('#btn-inspector-copy');
    if (inspCopyBtn) {
      inspCopyBtn.addEventListener('click', () => {
        const paneMap = {
          css: { label: 'CSS 스타일 코드' },
          html: { label: 'HTML 마크업' },
          md: { label: 'designs.md 사양서' },
          json: { label: '디자인 토큰 JSON' }
        };
        const activeMeta = paneMap[activeInspectorTab] || paneMap.css;
        const code = getCurrentInspectorContent(root, activeInspectorTab, activeCssSubMode);
        copyToClipboard(code, activeMeta.label);
      });
    }

    // 10.4 Inspector Action: File Download
    const inspDownloadBtn = root.querySelector('#btn-inspector-download');
    if (inspDownloadBtn) {
      inspDownloadBtn.addEventListener('click', () => {
        const context = resolveInspectorContext(appState.getState(), ALL_SUB_DESIGNS);
        if (!context) return;
        const { subDesign: currentSubDesign, archetype } = context;
        const fileMap = {
          css: {
            filename: `${currentSubDesign.id}-${archetype}.css`,
            mime: 'text/css;charset=utf-8',
            content: () => getCurrentInspectorContent(root, 'css', activeCssSubMode)
          },
          html: {
            filename: `${currentSubDesign.id}-${archetype}.html`,
            mime: 'text/html;charset=utf-8',
            content: () => getCurrentInspectorContent(root, 'html')
          },
          md: {
            filename: `${currentSubDesign.id}-designs.md`,
            mime: 'text/markdown;charset=utf-8',
            content: () => getCurrentInspectorContent(root, 'md')
          },
          json: {
            filename: `${currentSubDesign.id}-tokens.json`,
            mime: 'application/json;charset=utf-8',
            content: () => getCurrentInspectorContent(root, 'json')
          }
        };

        const target = fileMap[activeInspectorTab] || fileMap.css;
        const contentStr = target.content();
        downloadFile(target.filename, contentStr, target.mime);
        synthAudio.playSfx('SUCCESS');
      });
    }

    // 10.5 Inspector Action: Full Bundle Package Export
    const inspBundleBtn = root.querySelector('#btn-inspector-bundle');
    if (inspBundleBtn) {
      inspBundleBtn.addEventListener('click', () => {
        const context = resolveInspectorContext(appState.getState(), ALL_SUB_DESIGNS);
        if (!context) return;
        const { subDesign: currentSubDesign, archetype, device } = context;
        const cssContent = getCurrentInspectorContent(root, 'css', 'full');
        const htmlContent = getCurrentInspectorContent(root, 'html');
        const mdContent = getCurrentInspectorContent(root, 'md');
        const jsonContent = getCurrentInspectorContent(root, 'json');

        const packageText = `/* ==========================================================================
   DESIGN SPECTRUM INTEGRATED TEXT SNAPSHOT v2.3.0
   Design Style: ${currentSubDesign.name} (${currentSubDesign.nameEn}) [${currentSubDesign.id}]
   Archetype: ${archetype.toUpperCase()} | Device: ${device}
   Generated: ${new Date().toISOString()}
   ========================================================================== */

/* --- FILE 1/4: tokens.json (DTCG 2025.10 Format) --- */
/*
${jsonContent}
*/

/* --- FILE 2/4: designs.md (Design Specification) --- */
/*
${mdContent}
*/

/* --- FILE 3/4: style.css (Complete CSS Tokens & Archetype Styles) --- */
${cssContent}

/* --- FILE 4/4: index.html (Component Markup) --- */
<!--
${htmlContent}
-->
`;

        downloadFile(`${currentSubDesign.id}-integrated-snapshot.txt`, packageText, 'text/plain;charset=utf-8');
        synthAudio.playSfx('CONFIRM');
      });
    }

    // 11. Reset Tweaks Button with enhanced feedback
    const resetTweaksBtn = root.querySelector('#btn-reset-tweaks');
    if (resetTweaksBtn) {
      resetTweaksBtn.addEventListener('click', () => {
        const currentSub = ALL_SUB_DESIGNS.find(s => s.id === appState.getState().selectedSubCategory);
        const defaults = currentSub?.defaultTweaks || { borderRadius: 16, borderWidth: 1, shadowDepth: 10, backdropBlur: 16, glowIntensity: 1.0 };
        synthAudio.playSfx('SUCCESS');
        appState.setState({ liveTweaks: defaults });
      });
    }

    // 12. Sliders Two-Way Binding
    const bindSlider = (id, key, isFloat = false) => {
      const slider = root.querySelector(id);
      if (!slider) return;
      slider.addEventListener('input', (e) => {
        const val = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
        appState.setState({
          liveTweaks: { [key]: val }
        });
      });
    };

    bindSlider('#slider-radius', 'borderRadius');
    bindSlider('#slider-border', 'borderWidth');
    bindSlider('#slider-shadow', 'shadowDepth');
    bindSlider('#slider-blur', 'backdropBlur');
    bindSlider('#slider-glow', 'glowIntensity', true);

    // 13. Keyboard Shortcuts ([ / ], Shift+Arrows, Esc)
    if (detailKeyHandler) window.removeEventListener('keydown', detailKeyHandler);
    detailKeyHandler = (e) => {
      const view = appState.getState().currentView;
      if (view !== 'DETAIL') {
        window.removeEventListener('keydown', detailKeyHandler);
        detailKeyHandler = null;
        return;
      }
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const currentSubId = appState.getState().selectedSubCategory;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === '[' || (e.key === 'ArrowLeft' && !e.shiftKey)) {
        e.preventDefault();
        cycleGlobalSub(currentSubId, -1);
      } else if (e.key === ']' || (e.key === 'ArrowRight' && !e.shiftKey)) {
        e.preventDefault();
        cycleGlobalSub(currentSubId, 1);
      } else if (e.shiftKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        cycleCategory(-1);
      } else if (e.shiftKey && e.key === 'ArrowRight') {
        e.preventDefault();
        cycleCategory(1);
      }
    };
    window.addEventListener('keydown', detailKeyHandler);
  }

  function cycleGlobalSub(currentSubId, dir) {
    const idx = ALL_SUB_DESIGNS.findIndex(s => s.id === currentSubId);
    if (idx < 0) return;
    const nextIdx = (idx + dir + ALL_SUB_DESIGNS.length) % ALL_SUB_DESIGNS.length;
    const next = ALL_SUB_DESIGNS[nextIdx];
    synthAudio.playSfx('THEME_SWAP');
    const recents = [next.id, ...appState.getState().recentlyViewed.filter(id => id !== next.id)].slice(0, 6);
    appState.setState({
      selectedMainCategory: next.categoryId,
      selectedSubCategory: next.id,
      liveTweaks: next.defaultTweaks || appState.getState().liveTweaks,
      draftSubId: next.id,
      recentlyViewed: recents
    });
  }

  function cycleCategory(dir) {
    const currentCatId = appState.getState().selectedMainCategory;
    const idx = MAIN_CATEGORIES.findIndex(c => c.id === currentCatId);
    if (idx < 0) return;
    const nextIdx = (idx + dir + MAIN_CATEGORIES.length) % MAIN_CATEGORIES.length;
    const nextCat = MAIN_CATEGORIES[nextIdx];
    const nextSub = nextCat.subCategories[0];
    synthAudio.playSfx('THEME_SWAP');
    const recents = [nextSub.id, ...appState.getState().recentlyViewed.filter(id => id !== nextSub.id)].slice(0, 6);
    appState.setState({
      selectedMainCategory: nextCat.id,
      selectedSubCategory: nextSub.id,
      liveTweaks: nextSub.defaultTweaks || appState.getState().liveTweaks,
      draftSubId: nextSub.id,
      recentlyViewed: recents
    });
  }

  // --- WAI-ARIA Focus Trap Helper ---
  function setupFocusTrap(modalRoot) {
    removeFocusTrap();
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    activeFocusTrap = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(modalRoot.querySelectorAll(focusableSelectors))
        .filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    modalRoot.addEventListener('keydown', activeFocusTrap);
    const initialTarget = modalRoot.querySelector('.breadcrumb-back-btn') || modalRoot.querySelector('button');
    if (initialTarget) initialTarget.focus();
  }

  function removeFocusTrap() {
    if (activeFocusTrap && container) {
      container.removeEventListener('keydown', activeFocusTrap);
      activeFocusTrap = null;
    }
  }

  // --- Render Split Dual Comparison View ---
  function renderSplitCompareView(root, compareIds, activeArchetype, currentTab) {
    const sub1 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[0]) || ALL_SUB_DESIGNS[0];
    const sub2 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[1]) || ALL_SUB_DESIGNS[4];

    teardownHydratedViewports(root);
    root.innerHTML = `
      <div class="detail-modal-backdrop" id="compare-backdrop"></div>
      
      <div class="split-compare-modal-container" role="dialog" aria-modal="true" aria-labelledby="split-modal-title">
        <!-- Split Top Bar -->
        <div class="split-top-bar">
          <div class="split-head-title">
            <span class="split-icon">⚖️</span>
            <h2 id="split-modal-title">스플릿 듀얼 디자인 비교 샌드박스 (Side-by-Side)</h2>
          </div>

          <!-- Synchronized Archetype Tab Controls -->
          <div class="archetype-tabs-nav" role="tablist" aria-label="비교 아키타입">
            ${getSplitArchetypeTabs(activeArchetype).map(tab => `
              <button class="split-tab-btn ${tab.ariaSelected === 'true' ? 'active' : ''}"
                      id="split-tab-${tab.id}"
                      data-archetype="${tab.id}"
                      role="tab"
                      aria-selected="${tab.ariaSelected}"
                      aria-controls="split-viewport-a split-viewport-b"
                      tabindex="${tab.tabIndex}">${tab.label}</button>
            `).join('')}
          </div>

          <button class="modal-close-btn" id="btn-compare-close" aria-label="닫기">
            <span>✕</span>
          </button>
        </div>

        <!-- 2 Side-by-Side Columns -->
        <div class="split-columns-grid">
          <!-- Left Style Column -->
          <div class="split-col split-left" style="--split-accent: ${sub1.accentColor}">
            <div class="split-col-header">
              <div class="split-select-wrapper">
                <span class="split-badge">스타일 A</span>
                <select class="split-style-select" id="select-style-a" aria-label="스타일 A 선택">
                  ${ALL_SUB_DESIGNS.map(s => `
                    <option value="${s.id}" ${s.id === sub1.id ? 'selected' : ''}>
                      [${s.categoryTitle}] ${s.name}
                    </option>
                  `).join('')}
                </select>
              </div>
              <p class="split-col-desc">${sub1.shortDesc}</p>
              <div class="split-palette-strip">
                ${sub1.palette.map(p => `<span class="split-dot" style="background:${p.hex}" title="${p.name} (${p.hex})"></span>`).join('')}
              </div>
            </div>

            <div class="split-picker" data-slot="A" role="tablist">
              ${ALL_SUB_DESIGNS.map((s) => `
                <button class="split-pick-thumb ${s.id === sub1.id ? 'active' : ''}" data-slot="A" data-sub-id="${s.id}" title="${s.name}" role="tab" aria-selected="${s.id === sub1.id}">
                  ${getMockupHTML(s.previewType, 'thumb', s)}
                </button>
              `).join('')}
            </div>
            <div class="split-viewport" id="split-viewport-a" data-theme="${sub1.id}" data-archetype="${activeArchetype}" role="tabpanel" aria-labelledby="split-tab-${activeArchetype}" tabindex="0">
              ${getArchetypeHTML(activeArchetype, sub1, { tab: currentTab })}
            </div>
          </div>

          <!-- Right Style Column -->
          <div class="split-col split-right" style="--split-accent: ${sub2.accentColor}">
            <div class="split-col-header">
              <div class="split-select-wrapper">
                <span class="split-badge">스타일 B</span>
                <select class="split-style-select" id="select-style-b" aria-label="스타일 B 선택">
                  ${ALL_SUB_DESIGNS.map(s => `
                    <option value="${s.id}" ${s.id === sub2.id ? 'selected' : ''}>
                      [${s.categoryTitle}] ${s.name}
                    </option>
                  `).join('')}
                </select>
              </div>
              <p class="split-col-desc">${sub2.shortDesc}</p>
              <div class="split-palette-strip">
                ${sub2.palette.map(p => `<span class="split-dot" style="background:${p.hex}" title="${p.name} (${p.hex})"></span>`).join('')}
              </div>
            </div>

            <div class="split-picker" data-slot="B" role="tablist">
              ${ALL_SUB_DESIGNS.map((s) => `
                <button class="split-pick-thumb ${s.id === sub2.id ? 'active' : ''}" data-slot="B" data-sub-id="${s.id}" title="${s.name}" role="tab" aria-selected="${s.id === sub2.id}">
                  ${getMockupHTML(s.previewType, 'thumb', s)}
                </button>
              `).join('')}
            </div>
            <div class="split-viewport" id="split-viewport-b" data-theme="${sub2.id}" data-archetype="${activeArchetype}" role="tabpanel" aria-labelledby="split-tab-${activeArchetype}" tabindex="0">
              ${getArchetypeHTML(activeArchetype, sub2, { tab: currentTab })}
            </div>
          </div>
        </div>
      </div>
    `;

    attachSplitCompareListeners(root, compareIds);
    const viewA = root.querySelector('#split-viewport-a');
    const viewB = root.querySelector('#split-viewport-b');
    if (viewA) hydrateMockup(viewA, sub1, { archetype: activeArchetype, tab: currentTab });
    if (viewB) hydrateMockup(viewB, sub2, { archetype: activeArchetype, tab: currentTab });
    setupFocusTrap(root);
  }

  function updateSplitTabsOnly(root, compareIds, activeArchetype, currentTab) {
    const sub1 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[0]) || ALL_SUB_DESIGNS[0];
    const sub2 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[1]) || ALL_SUB_DESIGNS[4];

    root.querySelectorAll('.split-tab-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-archetype') === activeArchetype;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    const viewA = root.querySelector('#split-viewport-a');
    const viewB = root.querySelector('#split-viewport-b');

    if (viewA) {
      teardownMockup(viewA);
      viewA.innerHTML = getArchetypeHTML(activeArchetype, sub1, { tab: currentTab });
      viewA.setAttribute('data-theme', sub1.id);
      viewA.setAttribute('data-archetype', activeArchetype);
      viewA.setAttribute('aria-labelledby', `split-tab-${activeArchetype}`);
      hydrateMockup(viewA, sub1, { archetype: activeArchetype, tab: currentTab });
    }
    if (viewB) {
      teardownMockup(viewB);
      viewB.innerHTML = getArchetypeHTML(activeArchetype, sub2, { tab: currentTab });
      viewB.setAttribute('data-theme', sub2.id);
      viewB.setAttribute('data-archetype', activeArchetype);
      viewB.setAttribute('aria-labelledby', `split-tab-${activeArchetype}`);
      hydrateMockup(viewB, sub2, { archetype: activeArchetype, tab: currentTab });
    }
  }

  function attachSplitCompareListeners(root, compareIds) {
    const closeCompare = () => {
      synthAudio.playSfx('CLOSE');
      const { compareReturnView, selectedMainCategory, selectedSubCategory } = appState.getState();
      const canDetail = compareReturnView === 'DETAIL' && selectedMainCategory && selectedSubCategory;
      appState.setState({ currentView: canDetail ? 'DETAIL' : 'MAIN' });
    };

    const backdrop = root.querySelector('#compare-backdrop');
    const closeBtn = root.querySelector('#btn-compare-close');

    if (backdrop) backdrop.addEventListener('click', closeCompare);
    if (closeBtn) closeBtn.addEventListener('click', closeCompare);

    const selectA = root.querySelector('#select-style-a');
    const selectB = root.querySelector('#select-style-b');

    if (selectA) {
      selectA.addEventListener('change', (e) => {
        synthAudio.playSfx('THEME_SWAP');
        appState.setCompareSubIds(e.target.value, compareIds[1]);
      });
    }
    if (selectB) {
      selectB.addEventListener('change', (e) => {
        synthAudio.playSfx('THEME_SWAP');
        appState.setCompareSubIds(compareIds[0], e.target.value);
      });
    }

    root.querySelectorAll('.split-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const arch = btn.getAttribute('data-archetype');
        if (arch === appState.getState().activeArchetype) return;
        synthAudio.playSfx('CLICK');
        appState.setActiveArchetype(arch);
      });
      btn.addEventListener('keydown', event => {
        const nextArchetype = getNextSplitArchetype(btn.getAttribute('data-archetype'), event.key);
        if (!nextArchetype) return;
        event.preventDefault();
        const nextTab = root.querySelector(`#split-tab-${nextArchetype}`);
        nextTab?.focus();
        nextTab?.click();
      });
    });

    root.querySelectorAll('.split-pick-thumb').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = btn.getAttribute('data-slot');
        const id = btn.getAttribute('data-sub-id');
        synthAudio.playSfx('THEME_SWAP');
        if (slot === 'A') appState.setCompareSubIds(id, compareIds[1]);
        else appState.setCompareSubIds(compareIds[0], id);
      });
    });

    // ESC Key for Split Compare View (FIN-F006)
    if (splitKeyHandler) window.removeEventListener('keydown', splitKeyHandler);
    splitKeyHandler = (e) => {
      if (appState.getState().currentView !== 'SPLIT_COMPARE') {
        window.removeEventListener('keydown', splitKeyHandler);
        splitKeyHandler = null;
        return;
      }
      if (e.key === 'Escape') {
        closeCompare();
      }
    };
    window.addEventListener('keydown', splitKeyHandler);
  }

  appState.subscribe(() => update());
}
