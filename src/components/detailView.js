/**
 * Detail View & Split Comparison Modal Component v2.0
 * Features:
 * - 4-Component Multi-tab Live Sandbox (Hero, Widget, Form, Pricing)
 * - Live CSS Parameter Tuner Sliders (Radius, Border, Shadow, Blur, Glow)
 * - Real-time CSS / HTML Code Inspector with 1-click clipboard copy
 * - Copyable Color Palette Cards
 * - Pros & Cons Interactive Cards
 * - Side-by-Side Dual Split Comparison Sandbox Mode
 */

import { MAIN_CATEGORIES, getAllSubDesigns, getAdjacentSub } from '../data/categories.js';
import { appState } from '../state/appState.js';
import { synthAudio } from '../audio/synthAudio.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { getMockupHTML } from './mockupTemplates.js';
import { hydrateMockup, teardownMockup } from './mockupRuntime.js';
import { confirmStyle, addToCompare } from '../utils/selection.js';

const ALL_SUB_DESIGNS = getAllSubDesigns();
let detailKeyHandler = null;

export function renderDetailView(container) {
  if (!container) return;

  let currentRenderedView = null; // 'DETAIL' | 'SPLIT_COMPARE' | null
  let currentRenderedSubId = null;
  let currentRenderedTab = null;
  let currentRenderedDevice = null;
  let currentRenderedCompareIds = [null, null];

  function update() {
    const state = appState.getState();
    const { currentView, selectedMainCategory, selectedSubCategory, activeComponentTab, sandboxDevice, compareSubIds, liveTweaks, bookmarks } = state;

    // 1. Handle SPLIT_COMPARE View
    if (currentView === 'SPLIT_COMPARE') {
      container.style.display = 'block';
      const needFullSplitRender = (
        currentRenderedView !== 'SPLIT_COMPARE' ||
        currentRenderedCompareIds[0] !== compareSubIds[0] ||
        currentRenderedCompareIds[1] !== compareSubIds[1]
      );

      if (needFullSplitRender) {
        renderSplitCompareView(container, compareSubIds, activeComponentTab);
        currentRenderedView = 'SPLIT_COMPARE';
        currentRenderedSubId = null;
        currentRenderedTab = activeComponentTab;
        currentRenderedCompareIds = [...compareSubIds];
      } else if (currentRenderedTab !== activeComponentTab) {
        // Granular update for split tabs
        updateSplitTabsOnly(container, compareSubIds, activeComponentTab);
        currentRenderedTab = activeComponentTab;
      }
      return;
    }

    // 2. Handle Closed / Main View
    if (currentView !== 'DETAIL' || !selectedMainCategory || !selectedSubCategory) {
      teardownMockup(container);
      container.style.display = 'none';
      container.innerHTML = '';
      currentRenderedView = null;
      currentRenderedSubId = null;
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

    const needFullDetailRender = (
      currentRenderedView !== 'DETAIL' ||
      currentRenderedSubId !== selectedSubCategory
    );

    if (needFullDetailRender) {
      renderFullDetailModal(container, subDesign, mainCat, state);
      currentRenderedView = 'DETAIL';
      currentRenderedSubId = selectedSubCategory;
      currentRenderedTab = activeComponentTab;
      currentRenderedDevice = sandboxDevice;
    } else {
      const needMockupSwap = currentRenderedTab !== activeComponentTab || currentRenderedDevice !== sandboxDevice;
      updateDetailGranular(container, subDesign, state, needMockupSwap);
      currentRenderedTab = activeComponentTab;
      currentRenderedDevice = sandboxDevice;
    }
  }

  // --- Full Detail Modal Initial Render ---
  function renderFullDetailModal(root, subDesign, mainCat, state) {
    teardownMockup(root);
    const { activeComponentTab, sandboxDevice, liveTweaks, bookmarks } = state;
    const isBookmarked = bookmarks.includes(subDesign.id);

    root.innerHTML = `
      <div class="detail-modal-backdrop" id="modal-backdrop"></div>
      
      <div class="detail-modal-container" role="dialog" aria-modal="true" style="--modal-accent: ${mainCat.accentColor}">
        <!-- Top Navigation Bar inside Modal -->
        <div class="modal-top-bar">
          <div class="modal-breadcrumbs">
            <button class="breadcrumb-back-btn" id="btn-modal-back">
              <span>← 메인으로 돌아가기</span>
            </button>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-category">${mainCat.title}</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-sub">${subDesign.name}</span>
          </div>

          <div class="sub-nav-cycle">
            <button class="cycle-btn" id="btn-prev-style" title="이전 스타일">←</button>
            <div class="sub-tabs-container">
              ${mainCat.subCategories.map(s => `
                <button class="sub-tab-btn ${s.id === subDesign.id ? 'active' : ''}" data-sub-id="${s.id}">
                  <span class="sub-tab-thumb">${getMockupHTML(s.previewType, 'thumb', s)}</span>
                  <span>${s.name}</span>
                </button>
              `).join('')}
            </div>
            <button class="cycle-btn" id="btn-next-style" title="다음 스타일">→</button>
          </div>

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

        <!-- Main 2-Column Content Grid -->
        <div class="modal-body-grid">
          <!-- Left Column: Live Interactive Mockup Sandbox -->
          <section class="mockup-sandbox-section">
            <div class="sandbox-header">
              <!-- 4 Component Preview Tabs -->
              <div class="component-tabs-nav" role="tablist">
                <button class="comp-tab-btn ${activeComponentTab === 'hero' ? 'active' : ''}" data-tab="hero">
                  <span>🎯 히어로 랜딩</span>
                </button>
                <button class="comp-tab-btn ${activeComponentTab === 'widget' ? 'active' : ''}" data-tab="widget">
                  <span>📊 대시보드 위젯</span>
                </button>
                <button class="comp-tab-btn ${activeComponentTab === 'form' ? 'active' : ''}" data-tab="form">
                  <span>⚡ 폼 & 컨트롤</span>
                </button>
                <button class="comp-tab-btn ${activeComponentTab === 'pricing' ? 'active' : ''}" data-tab="pricing">
                  <span>🏷️ 가격 & 피처</span>
                </button>
              </div>

              <!-- Device Switcher -->
              <div class="device-switcher">
                <button class="device-btn ${sandboxDevice === 'desktop' ? 'active' : ''}" data-device="desktop">💻 Desktop</button>
                <button class="device-btn ${sandboxDevice === 'mobile' ? 'active' : ''}" data-device="mobile">📱 Mobile</button>
              </div>
            </div>

            <!-- Dynamic Live Rendered UI Component Sandbox -->
            <div class="mockup-viewport ${sandboxDevice}" 
                 id="mockup-viewport"
                 style="
                   --tweak-radius: ${liveTweaks.borderRadius}px;
                   --tweak-border-width: ${liveTweaks.borderWidth}px;
                   --tweak-shadow-depth: ${liveTweaks.shadowDepth}px;
                   --tweak-backdrop-blur: ${liveTweaks.backdropBlur}px;
                   --tweak-glow-intensity: ${liveTweaks.glowIntensity};
                 ">
              ${getMockupHTML(subDesign.previewType, activeComponentTab, subDesign)}
            </div>

            <!-- Live Parameter Tweak Sliders (Live CSS Variable Tuning) -->
            <div class="live-tuner-panel">
              <div class="tuner-header">
                <div class="tuner-title-group">
                  <span class="tuner-icon">🎛️</span>
                  <span class="tuner-title">실시간 디자인 파라미터 튜너 (Live Tweak Sandbox)</span>
                </div>
                <button class="tuner-reset-btn" id="btn-tuner-reset" title="기본값으로 되돌리기">↺ 기본값 리셋</button>
              </div>

              <div class="tuner-sliders-grid">
                <!-- Radius Slider -->
                <div class="slider-control">
                  <div class="slider-label-row">
                    <span>모서리 둥글기 (Radius)</span>
                    <span class="slider-val" id="val-radius">${liveTweaks.borderRadius}px</span>
                  </div>
                  <input type="range" class="tuner-slider" id="slider-radius" min="0" max="48" value="${liveTweaks.borderRadius}" />
                </div>

                <!-- Border Width Slider -->
                <div class="slider-control">
                  <div class="slider-label-row">
                    <span>외곽선 두께 (Border)</span>
                    <span class="slider-val" id="val-border">${liveTweaks.borderWidth}px</span>
                  </div>
                  <input type="range" class="tuner-slider" id="slider-border" min="0" max="8" value="${liveTweaks.borderWidth}" />
                </div>

                <!-- Shadow Depth Slider -->
                <div class="slider-control">
                  <div class="slider-label-row">
                    <span>그림자 깊이 (Shadow)</span>
                    <span class="slider-val" id="val-shadow">${liveTweaks.shadowDepth}px</span>
                  </div>
                  <input type="range" class="tuner-slider" id="slider-shadow" min="0" max="30" value="${liveTweaks.shadowDepth}" />
                </div>

                <!-- Backdrop Blur Slider -->
                <div class="slider-control">
                  <div class="slider-label-row">
                    <span>배경 블러 (Backdrop Blur)</span>
                    <span class="slider-val" id="val-blur">${liveTweaks.backdropBlur}px</span>
                  </div>
                  <input type="range" class="tuner-slider" id="slider-blur" min="0" max="32" value="${liveTweaks.backdropBlur}" />
                </div>

                <div class="slider-control">
                  <div class="slider-label-row">
                    <span>발광 강도 (Glow)</span>
                    <span class="slider-val" id="val-glow">${Number(liveTweaks.glowIntensity).toFixed(1)}</span>
                  </div>
                  <input type="range" class="tuner-slider" id="slider-glow" min="0" max="2" step="0.1" value="${liveTweaks.glowIntensity}" />
                </div>
              </div>
            </div>
          </section>

          <!-- Right Column: Specs, Palette, Characteristics, Pros & Cons, Code Inspector -->
          <section class="style-specs-section">
            <div class="specs-header">
              <div class="specs-cat-badge-line">
                <span class="specs-category-tag">${mainCat.titleEn}</span>
                <span class="specs-pill">${mainCat.icon} ${mainCat.title}</span>
              </div>
              <h2 class="specs-title">${subDesign.name}</h2>
              <p class="specs-en-name">${subDesign.nameEn}</p>
              <p class="specs-desc">${subDesign.shortDesc}</p>
              
              <div class="specs-tags-row">
                ${subDesign.moodTags.map(t => `<span class="mood-tag">#${t}</span>`).join('')}
              </div>
            </div>

            <!-- Color Palette Section (Click to Copy) -->
            <div class="specs-block">
              <h3 class="block-title">🎨 대표 팔레트 (클릭 시 HEX 복사):</h3>
              <div class="palette-grid">
                ${subDesign.palette.map(color => `
                  <div class="palette-card" data-hex="${color.hex}" data-name="${color.name}">
                    <div class="color-swatch" style="background-color: ${color.hex}">
                      <span class="swatch-copy-hint">Copy</span>
                    </div>
                    <div class="color-meta">
                      <span class="color-hex">${color.hex}</span>
                      <span class="color-name">${color.name}</span>
                      <span class="color-usage">${color.usage}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Live CSS Code Inspector -->
            <div class="specs-block code-inspector-block">
              <div class="inspector-head">
                <div class="inspector-title-row">
                  <span class="ins-icon">💻</span>
                  <span class="block-title" style="margin:0;">실시간 CSS 코드 인스펙터</span>
                </div>
                <button class="copy-code-btn" id="btn-copy-css">📋 CSS 복사</button>
              </div>
              <div class="code-viewer-box">
                <pre><code id="live-css-code">${generateLiveCSSSnippet(subDesign, liveTweaks)}</code></pre>
              </div>
            </div>

            <!-- Characteristics List -->
            <div class="specs-block">
              <h3 class="block-title">✨ 핵심 디자인 특징 (Key Characteristics):</h3>
              <ul class="characteristics-list">
                ${subDesign.characteristics.map(char => `
                  <li>
                    <span class="list-bullet">✦</span>
                    <span>${char}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Pros and Cons Interactive Hover Cards -->
            <div class="specs-block">
              <h3 class="block-title">⚖️ 장단점 분석 (Hover for Detail):</h3>
              <div class="pros-cons-grid">
                <div class="pros-cons-box pros-box">
                  <div class="box-header">
                    <span class="box-icon">👍</span>
                    <span class="box-title">장점 (Pros)</span>
                  </div>
                  <div class="box-items">
                    ${subDesign.pros.map((pro, pIdx) => `
                      <div class="pro-con-item pro-item">
                        <span class="item-tag">PRO 0${pIdx + 1}</span>
                        <p class="item-text">${pro}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="pros-cons-box cons-box">
                  <div class="box-header">
                    <span class="box-icon">💡</span>
                    <span class="box-title">단점 및 주의사항 (Cons)</span>
                  </div>
                  <div class="box-items">
                    ${subDesign.cons.map((con, cIdx) => `
                      <div class="pro-con-item con-item">
                        <span class="item-tag">CON 0${cIdx + 1}</span>
                        <p class="item-text">${con}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;

    attachDetailEventListeners(root, subDesign, mainCat);
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) hydrateMockup(viewport, subDesign, { tab: activeComponentTab });
  }

  // --- Granular Update for Detail View (No Flicker / No Rebuild) ---
  function updateDetailGranular(root, subDesign, state, needMockupSwap = false) {
    const { activeComponentTab, sandboxDevice, liveTweaks, bookmarks } = state;

    const compTabBtns = root.querySelectorAll('.comp-tab-btn');
    compTabBtns.forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      btn.classList.toggle('active', tab === activeComponentTab);
    });

    const viewport = root.querySelector('#mockup-viewport');
    if (viewport && needMockupSwap) {
      teardownMockup(viewport);
      viewport.innerHTML = getMockupHTML(subDesign.previewType, activeComponentTab, subDesign);
      viewport.className = `mockup-viewport ${sandboxDevice}`;
      hydrateMockup(viewport, subDesign, { tab: activeComponentTab });
    } else if (viewport) {
      viewport.className = `mockup-viewport ${sandboxDevice}`;
    }
    applyTweaksToDOM(root, liveTweaks, subDesign);

    // 3. Update Device Switcher Buttons
    const deviceBtns = root.querySelectorAll('.device-btn');
    deviceBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === sandboxDevice);
    });

    // 4. Update Bookmark Button State
    const bookmarkBtn = root.querySelector('#btn-modal-bookmark');
    if (bookmarkBtn) {
      const isBookmarked = bookmarks.includes(subDesign.id);
      bookmarkBtn.classList.toggle('active', isBookmarked);
      bookmarkBtn.querySelector('span').textContent = isBookmarked ? '★ 북마크됨' : '☆ 북마크';
    }
  }

  // Helper to apply tweaks to DOM style variables, labels, and code inspector
  function applyTweaksToDOM(root, tweaks, subDesign) {
    const viewport = root.querySelector('#mockup-viewport');
    if (viewport) {
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

    const cssCodeElem = root.querySelector('#live-css-code');
    if (cssCodeElem && subDesign) {
      cssCodeElem.textContent = generateLiveCSSSnippet(subDesign, tweaks);
    }
  }

  // --- Attach Event Listeners for Detail View ---
  function attachDetailEventListeners(root, subDesign, mainCat) {
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

    // Bookmark Toggle
    const bookmarkBtn = root.querySelector('#btn-modal-bookmark');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        const isNow = appState.toggleBookmark(subDesign.id);
        synthAudio.playSfx('BOOKMARK');
        bookmarkBtn.classList.toggle('active', isNow);
        bookmarkBtn.querySelector('span').textContent = isNow ? '★ 북마크됨' : '☆ 북마크';
      });
    }

    const confirmBtn = root.querySelector('#btn-modal-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        confirmStyle(subDesign.id);
        confirmBtn.querySelector('span').textContent = '✓ 확정됨';
        confirmBtn.classList.add('active');
      });
    }

    const goSibling = (dir) => {
      const next = getAdjacentSub(subDesign.id, dir, { sameCategory: true });
      if (!next || next.id === subDesign.id) return;
      synthAudio.playSfx('CLICK');
      const recents = [next.id, ...appState.getState().recentlyViewed.filter((id) => id !== next.id)].slice(0, 6);
      appState.setState({
        selectedMainCategory: next.categoryId,
        selectedSubCategory: next.id,
        liveTweaks: next.defaultTweaks || appState.getState().liveTweaks,
        draftSubId: next.id,
        recentlyViewed: recents
      });
    };

    root.querySelector('#btn-prev-style')?.addEventListener('click', () => goSibling(-1));
    root.querySelector('#btn-next-style')?.addEventListener('click', () => goSibling(1));

    const compareBtn = root.querySelector('#btn-modal-compare');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => {
        addToCompare(subDesign.id, 'A');
        appState.setState({ currentView: 'SPLIT_COMPARE', comparePickerOpen: true });
      });
    }

    // Subcategory Tabs Switcher
    const subTabBtns = root.querySelectorAll('.sub-tab-btn');
    subTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextSubId = btn.getAttribute('data-sub-id');
        if (nextSubId === subDesign.id) return;
        synthAudio.playSfx('CLICK');
        const targetSub = mainCat.subCategories.find(s => s.id === nextSubId);
        const recents = [nextSubId, ...appState.getState().recentlyViewed.filter((id) => id !== nextSubId)].slice(0, 6);
        appState.setState({
          selectedSubCategory: nextSubId,
          liveTweaks: targetSub?.defaultTweaks || appState.getState().liveTweaks,
          draftSubId: nextSubId,
          recentlyViewed: recents
        });
      });
    });

    // Component Tab Switcher (Hero, Widget, Form, Pricing)
    const compTabBtns = root.querySelectorAll('.comp-tab-btn');
    compTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === appState.getState().activeComponentTab) return;
        synthAudio.playSfx('CLICK');
        appState.setState({ activeComponentTab: tab });
      });
    });

    // Device Switcher
    const deviceBtns = root.querySelectorAll('.device-btn');
    deviceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-device');
        if (mode === appState.getState().sandboxDevice) return;
        synthAudio.playSfx('CLICK');
        appState.setState({ sandboxDevice: mode });
      });
    });

    // Palette Cards
    const paletteCards = root.querySelectorAll('.palette-card');
    paletteCards.forEach(card => {
      card.addEventListener('mouseenter', () => synthAudio.playSfx('HOVER'));
      card.addEventListener('click', () => {
        const hex = card.getAttribute('data-hex');
        const name = card.getAttribute('data-name');
        copyToClipboard(hex, name);
      });
    });

    // Parameter Tweak Sliders
    const sliderRadius = root.querySelector('#slider-radius');
    const sliderBorder = root.querySelector('#slider-border');
    const sliderShadow = root.querySelector('#slider-shadow');
    const sliderBlur = root.querySelector('#slider-blur');
    const sliderGlow = root.querySelector('#slider-glow');
    const btnResetTuner = root.querySelector('#btn-tuner-reset');

    const handleSliderInput = () => {
      const radius = parseInt(sliderRadius?.value || '16', 10);
      const border = parseInt(sliderBorder?.value || '1', 10);
      const shadow = parseInt(sliderShadow?.value || '10', 10);
      const blur = parseInt(sliderBlur?.value || '16', 10);
      const glow = parseFloat(sliderGlow?.value || '1');

      const newTweaks = {
        borderRadius: radius,
        borderWidth: border,
        shadowDepth: shadow,
        backdropBlur: blur,
        glowIntensity: glow
      };

      // Fast direct DOM update
      applyTweaksToDOM(root, newTweaks, subDesign);

      // State update
      appState.setState({ liveTweaks: newTweaks });
    };

    if (sliderRadius) sliderRadius.addEventListener('input', handleSliderInput);
    if (sliderBorder) sliderBorder.addEventListener('input', handleSliderInput);
    if (sliderShadow) sliderShadow.addEventListener('input', handleSliderInput);
    if (sliderBlur) sliderBlur.addEventListener('input', handleSliderInput);
    if (sliderGlow) sliderGlow.addEventListener('input', handleSliderInput);

    if (btnResetTuner) {
      btnResetTuner.addEventListener('click', () => {
        synthAudio.playSfx('CLICK');
        const def = subDesign.defaultTweaks || { borderRadius: 16, borderWidth: 1, shadowDepth: 10, backdropBlur: 16, glowIntensity: 1.0 };
        if (sliderRadius) sliderRadius.value = def.borderRadius;
        if (sliderBorder) sliderBorder.value = def.borderWidth;
        if (sliderShadow) sliderShadow.value = def.shadowDepth;
        if (sliderBlur) sliderBlur.value = def.backdropBlur;
        if (sliderGlow) sliderGlow.value = def.glowIntensity ?? 1;
        handleSliderInput();
      });
    }

    // CSS Copy Button
    const btnCopyCSS = root.querySelector('#btn-copy-css');
    if (btnCopyCSS) {
      btnCopyCSS.addEventListener('click', () => {
        const snippet = generateLiveCSSSnippet(subDesign, appState.getState().liveTweaks);
        copyToClipboard(snippet, 'CSS Snippet');
      });
    }

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
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goSibling(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goSibling(1);
      }
    };
    window.addEventListener('keydown', detailKeyHandler);
  }

  // --- Render Split Dual Comparison View ---
  function renderSplitCompareView(root, compareIds, currentTab) {
    const sub1 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[0]) || ALL_SUB_DESIGNS[0];
    const sub2 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[1]) || ALL_SUB_DESIGNS[4];

    root.innerHTML = `
      <div class="detail-modal-backdrop" id="compare-backdrop"></div>
      
      <div class="split-compare-modal-container" role="dialog" aria-modal="true">
        <!-- Split Top Bar -->
        <div class="split-top-bar">
          <div class="split-head-title">
            <span class="split-icon">⚖️</span>
            <h2>스플릿 듀얼 디자인 비교 샌드박스 (Side-by-Side Comparison)</h2>
          </div>

          <!-- Synchronized Component Tab Controls -->
          <div class="split-tab-controls">
            <button class="split-tab-btn ${currentTab === 'hero' ? 'active' : ''}" data-tab="hero">🎯 히어로</button>
            <button class="split-tab-btn ${currentTab === 'widget' ? 'active' : ''}" data-tab="widget">📊 대시보드</button>
            <button class="split-tab-btn ${currentTab === 'form' ? 'active' : ''}" data-tab="form">⚡ 폼</button>
            <button class="split-tab-btn ${currentTab === 'pricing' ? 'active' : ''}" data-tab="pricing">🏷️ 가격표</button>
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
                <select class="split-style-select" id="select-style-a">
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

            <div class="split-picker" data-slot="A">
              ${ALL_SUB_DESIGNS.map((s) => `
                <button class="split-pick-thumb ${s.id === sub1.id ? 'active' : ''}" data-slot="A" data-sub-id="${s.id}" title="${s.name}">
                  ${getMockupHTML(s.previewType, 'thumb', s)}
                </button>
              `).join('')}
            </div>
            <div class="split-viewport" id="split-viewport-a">
              ${getMockupHTML(sub1.previewType, currentTab, sub1)}
            </div>
          </div>

          <!-- Right Style Column -->
          <div class="split-col split-right" style="--split-accent: ${sub2.accentColor}">
            <div class="split-col-header">
              <div class="split-select-wrapper">
                <span class="split-badge">스타일 B</span>
                <select class="split-style-select" id="select-style-b">
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

            <div class="split-picker" data-slot="B">
              ${ALL_SUB_DESIGNS.map((s) => `
                <button class="split-pick-thumb ${s.id === sub2.id ? 'active' : ''}" data-slot="B" data-sub-id="${s.id}" title="${s.name}">
                  ${getMockupHTML(s.previewType, 'thumb', s)}
                </button>
              `).join('')}
            </div>
            <div class="split-viewport" id="split-viewport-b">
              ${getMockupHTML(sub2.previewType, currentTab, sub2)}
            </div>
          </div>
        </div>
      </div>
    `;

    attachSplitCompareListeners(root, compareIds);
    const viewA = root.querySelector('#split-viewport-a');
    const viewB = root.querySelector('#split-viewport-b');
    if (viewA) hydrateMockup(viewA, sub1, { tab: currentTab });
    if (viewB) hydrateMockup(viewB, sub2, { tab: currentTab });
  }

  // Granular update for Split tabs only
  function updateSplitTabsOnly(root, compareIds, currentTab) {
    const sub1 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[0]) || ALL_SUB_DESIGNS[0];
    const sub2 = ALL_SUB_DESIGNS.find(s => s.id === compareIds[1]) || ALL_SUB_DESIGNS[4];

    const tabBtns = root.querySelectorAll('.split-tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === currentTab);
    });

    const viewA = root.querySelector('#split-viewport-a');
    const viewB = root.querySelector('#split-viewport-b');

    if (viewA) {
      teardownMockup(viewA);
      viewA.innerHTML = getMockupHTML(sub1.previewType, currentTab, sub1);
      hydrateMockup(viewA, sub1, { tab: currentTab });
    }
    if (viewB) {
      teardownMockup(viewB);
      viewB.innerHTML = getMockupHTML(sub2.previewType, currentTab, sub2);
      hydrateMockup(viewB, sub2, { tab: currentTab });
    }
  }

  // --- Attach Event Listeners for Split Comparison ---
  function attachSplitCompareListeners(root, compareIds) {
    const closeCompare = () => {
      synthAudio.playSfx('CLOSE');
      appState.setState({ currentView: 'DETAIL' });
    };

    const backdrop = root.querySelector('#compare-backdrop');
    const closeBtn = root.querySelector('#btn-compare-close');

    if (backdrop) backdrop.addEventListener('click', closeCompare);
    if (closeBtn) closeBtn.addEventListener('click', closeCompare);

    const selectA = root.querySelector('#select-style-a');
    const selectB = root.querySelector('#select-style-b');

    if (selectA) {
      selectA.addEventListener('change', (e) => {
        synthAudio.playSfx('CLICK');
        appState.setCompareSubIds(e.target.value, compareIds[1]);
      });
    }
    if (selectB) {
      selectB.addEventListener('change', (e) => {
        synthAudio.playSfx('CLICK');
        appState.setCompareSubIds(compareIds[0], e.target.value);
      });
    }

    const tabBtns = root.querySelectorAll('.split-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === appState.getState().activeComponentTab) return;
        synthAudio.playSfx('CLICK');
        appState.setState({ activeComponentTab: tab });
      });
    });

    root.querySelectorAll('.split-pick-thumb').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slot = btn.getAttribute('data-slot');
        const id = btn.getAttribute('data-sub-id');
        synthAudio.playSfx('CLICK');
        if (slot === 'A') appState.setCompareSubIds(id, compareIds[1]);
        else appState.setCompareSubIds(compareIds[0], id);
      });
    });
  }

  // --- Generate Live CSS Snippet ---
  function generateLiveCSSSnippet(sub, tweaks) {
    const paletteRules = sub.palette.map(p => `  --color-${slugify(p.name)}: ${p.hex};`).join('\n');
    return `/* === [${sub.nameEn}] Design Tokens & Live Tweaks === */
.theme-${sub.id} {
  /* Color Palette */
${paletteRules}

  /* Live Tweaked Metrics */
  border-radius: ${tweaks.borderRadius}px;
  border: ${tweaks.borderWidth}px solid ${sub.palette[1]?.hex || '#FFFFFF'};
  box-shadow: 0 ${tweaks.shadowDepth}px ${tweaks.shadowDepth * 2}px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(${tweaks.backdropBlur}px);
  -webkit-backdrop-filter: blur(${tweaks.backdropBlur}px);
  --glow-intensity: ${tweaks.glowIntensity};
}`;
  }

  function slugify(text) {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

  appState.subscribe(() => update());
}
