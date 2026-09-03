import{a as m,m as Ie,g as Me,n as X,L as Be,p as pe,b as k,d as N,t as K,T as W,f as x,q as Pe,k as A,i as Re,j as De,e as _}from"./index-BFii0hNt.js";import{c as ue}from"./clipboard-CoaL6PWb.js";import{g as je,r as be,a as V,b as ye,c as He,d as Fe,e as Ne,f as ve,h as me,i as fe,j as Ve}from"./inspectorState-BdQq9pK5.js";import"./componentEntry-jhia2jv3.js";import"./copy-DQ-HfkIO.js";let B=Be,L=Pe(),P=null,R=null,z=null,te=null,U=null;function l(g){return String(g??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Z(g,T){const E=L.find(q=>q.id===g);if(!E)throw new RangeError(`[PreviewState] Unknown ${T} style ID.`);return E}function ae(g){const T=g?.querySelector(".zoom-btn.active"),E=Number.parseFloat(T?.getAttribute("data-scale")||"1"),q=Number.isFinite(E)&&E>0?E:1,H=g?.querySelector("#mockup-viewport")?.querySelector(".archetype-unit, .mockup-unit");return H?(H.style.transform=`scale(${q})`,H.style.transformOrigin="center top",!0):!1}function ze(g){if(!g)return;let T=null,E=null,q=null,D=null,H=null,J=[null,null],G={A:"",B:""},{activeTab:I,activeCssMode:j}=fe(),F=null,Y=null,se=!1;function he(){const e=fe();I=e.activeTab,j=e.activeCssMode}function Se(){const e=m.getState(),t=H!==e.locale;if(t){const i=k();i?.locale===e.locale&&(B=Ie(i),L=Me(i))}const{currentView:n,selectedMainCategory:b,selectedSubCategory:r,activeArchetype:a="game",activeComponentTab:o="hero",sandboxDevice:u="desktop",compareSubIds:c,liveTweaks:S,bookmarks:y}=e;if(n==="SPLIT_COMPARE"){g.style.display="block",X.pauseLoop(),T!=="SPLIT_COMPARE"&&(G={A:"",B:""}),T!=="SPLIT_COMPARE"||t||J[0]!==c[0]||J[1]!==c[1]?(xe(g,c,a,o),T="SPLIT_COMPARE",E=null,q=a,D=o,J=[...c],H=e.locale):(q!==a||D!==o)&&(Ae(g,c,a,o),q=a,D=o);return}if(n!=="DETAIL"||!b||!r){if(T){Q(g),ee(),X.resumeLoop();const i=z?.isConnected?z:Array.from(document.querySelectorAll("#main-root [data-sub-id]")).find(f=>f.dataset.subId===(te||e.galleryFocusId));if(typeof i?.focus=="function")try{i.focus()}catch{}z=null,te=null}g.style.display="none",g.innerHTML="",T=null,E=null,q=null,D=null,J=[null,null];return}const v=B.find(i=>i.id===b);if(!v)return;const h=v.subCategories.find(i=>i.id===r);if(!h)return;g.style.display="block",X.pauseLoop();const p=T!=="DETAIL",C=p||t,s=C||q!==a||a==="web"&&D!==o,d=!s&&E!==r;if(C){const i=t?g.querySelector("#mockup-viewport"):null,f=t?{initialState:pe(i),sidebarScrollTop:g.querySelector(".detail-sidebar-section")?.scrollTop||0,bodyScrollTop:g.querySelector(".modal-body-grid")?.scrollTop||0,focusId:document.activeElement?.id||null}:null;p&&he(),T!=="SPLIT_COMPARE"&&(z=document.activeElement,te=z?.closest?.("[data-sub-id]")?.dataset.subId||e.galleryFocusId||null),ge(g,h,v,e,f),T="DETAIL",E=r,q=a,D=o,H=e.locale,oe(g,{focusInitial:!t})}else s?(we(g,h,a,o,u),ie(g,h,v,e),E=r,q=a,D=o):d?($e(g,h,v,e),ie(g,h,v,e),E=r):ke(g,h,e)}function Q(e){e&&e.querySelectorAll("#mockup-viewport, #split-viewport-a, #split-viewport-b").forEach(t=>{K(t)})}function le(e){const t=e.querySelector("#mockup-viewport")?.innerHTML.trim()||"";return Ve(m.getState(),L,t)}function M(e,t=I,n=j){const b=le(e);return b?t==="html"?b.html:t==="md"?b.markdown:t==="json"?b.json:b.css[n]||b.css.full:""}function O(e){e&&(F&&cancelAnimationFrame(F),F=requestAnimationFrame(()=>{F=null;const t=le(e);if(!t)return;const n=e.querySelector("#live-css-code");n&&(n.textContent=t.css[j]||t.css.full);const b=e.querySelector("#live-html-code");b&&(b.textContent=t.html);const r=e.querySelector("#live-md-code");r&&(r.textContent=t.markdown);const a=e.querySelector("#live-json-code");a&&(a.textContent=t.json)}))}function ge(e,t,n,b,r=null){Q(e);const{activeArchetype:a="game",activeComponentTab:o="hero",sandboxDevice:u="desktop",liveTweaks:c,bookmarks:S}=b,y=S.includes(t.id),v=k(),h=v?.messages||{},p=(i,f)=>x(v?.copy,i,f);e.innerHTML=`
      <div class="detail-modal-backdrop" id="modal-backdrop"></div>
      
      <div class="detail-modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-style-title" style="--modal-accent: ${n.accentColor}">
        
        <!-- UNIVERSAL TOP DESIGN SELECTOR BAR -->
        <header class="universal-top-bar" id="universal-top-bar">
          <div class="top-bar-row-main">
            <div class="top-breadcrumbs">
              <button class="breadcrumb-back-btn" id="btn-modal-back" title="${l(p("detail.backMainTitle"))}">
                <span>← ${l(p("detail.backMain"))}</span>
              </button>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-category" id="top-cat-name">${l(n.title)}</span>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-sub" id="top-sub-name">${l(t.name)}</span>
            </div>

            <!-- 8 Major Category Tabs -->
            <nav class="top-cat-tabs" role="tablist" aria-label="${l(p("detail.categoryTabs"))}">
              ${B.map(i=>`
                <button class="top-cat-tab-btn ${i.id===n.id?"active":""}" 
                        data-cat-id="${i.id}" 
                        style="--cat-accent: ${i.accentColor}"
                        role="tab"
                        aria-selected="${i.id===n.id}">
                  <span>${i.icon}</span>
                  <span>${l(i.title)}</span>
                </button>
              `).join("")}
            </nav>

            <div class="modal-top-actions">
              <button class="modal-action-chip ${y?"active":""}" id="btn-modal-bookmark" title="${l(p("detail.bookmarkToggle"))}">
                <span>${l(p(y?"detail.bookmarked":"detail.bookmark"))}</span>
              </button>
              <button class="modal-action-chip" id="btn-modal-confirm" title="${l(p("detail.confirm"))}">
                <span>${l(p(b.confirmedStyleId===t.id?"detail.confirmed":"detail.confirm"))}</span>
              </button>
              <button class="modal-action-chip" id="btn-modal-compare" title="${l(p("detail.compareTitle"))}">
                <span>${l(p("detail.compare"))}</span>
              </button>
              <button class="modal-close-btn" id="btn-modal-close" aria-label="${l(p("detail.close"))}">
                <span>✕</span>
              </button>
            </div>
          </div>

          <!-- 현재 대분류의 제한된 세부 스타일 선택기 -->
          ${ye(n.subCategories,{categoryId:n.id,categoryTitle:n.title,selectedId:t.id,snapshot:v,renderThumbnail:_})}
        </header>

        <!-- Main 2-Column Content Grid -->
        <div class="modal-body-grid">
          <!-- Left Column: Live Interactive Mockup Sandbox -->
          <section class="mockup-sandbox-section">
            <div class="sandbox-header">
              <!-- 8 Core Page Archetypes Navigation -->
              <div class="archetype-tabs-nav" role="tablist" aria-label="${l(p("detail.archetypeTabs"))}">
                <button class="archetype-tab-btn ${a==="game"?"active":""}" data-archetype="game" role="tab" aria-selected="${a==="game"}">
                  <span>🎮 ${l(p("detail.game"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="web"?"active":""}" data-archetype="web" role="tab" aria-selected="${a==="web"}">
                  <span>🌐 ${l(p("detail.web"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="mobile"?"active":""}" data-archetype="mobile" role="tab" aria-selected="${a==="mobile"}">
                  <span>📱 ${l(p("detail.mobile"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="ecommerce"?"active":""}" data-archetype="ecommerce" role="tab" aria-selected="${a==="ecommerce"}">
                  <span>🛍️ ${l(p("detail.ecommerce"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="blog"?"active":""}" data-archetype="blog" role="tab" aria-selected="${a==="blog"}">
                  <span>📰 ${l(p("detail.blog"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="dashboard"?"active":""}" data-archetype="dashboard" role="tab" aria-selected="${a==="dashboard"}">
                  <span>📊 ${l(p("detail.dashboard"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="media"?"active":""}" data-archetype="media" role="tab" aria-selected="${a==="media"}">
                  <span>🎵 ${l(p("detail.media"))}</span>
                </button>
                <button class="archetype-tab-btn ${a==="chat"?"active":""}" data-archetype="chat" role="tab" aria-selected="${a==="chat"}">
                  <span>💬 ${l(p("detail.chat"))}</span>
                </button>
              </div>

              <!-- Device & Zoom Controls -->
              <div class="sandbox-controls-group">
                <div class="zoom-switcher" role="group" aria-label="${l(p("detail.zoomGroup"))}">
                  <button class="zoom-btn" data-scale="0.8" title="${l(p("detail.zoom80"))}">80%</button>
                  <button class="zoom-btn active" data-scale="1.0" title="${l(p("detail.zoom100"))}">100%</button>
                  <button class="zoom-btn" data-scale="1.2" title="${l(p("detail.zoom120"))}">120%</button>
                </div>
                <div class="device-switcher" role="group" aria-label="${l(p("detail.deviceGroup"))}">
                  <button class="device-btn ${u==="desktop"?"active":""}" data-device="desktop">💻 ${l(h.desktop||"Desktop")}</button>
                  <button class="device-btn ${u==="mobile"?"active":""}" data-device="mobile">📱 ${l(h.mobile||"Mobile")}</button>
                </div>
              </div>
            </div>

            <!-- Web Archetype Sub-Tabs (Hero, Widget, Form, Pricing) -->
            <div class="component-tabs-nav" id="web-sub-tabs" role="tablist" style="display: ${a==="web"?"flex":"none"};">
              <button class="comp-tab-btn ${o==="hero"?"active":""}" data-tab="hero" role="tab" aria-selected="${o==="hero"}">
                <span>🎯 ${l(p("detail.hero"))}</span>
              </button>
              <button class="comp-tab-btn ${o==="widget"?"active":""}" data-tab="widget" role="tab" aria-selected="${o==="widget"}">
                <span>📊 ${l(p("detail.widget"))}</span>
              </button>
              <button class="comp-tab-btn ${o==="form"?"active":""}" data-tab="form" role="tab" aria-selected="${o==="form"}">
                <span>⚡ ${l(p("detail.form"))}</span>
              </button>
              <button class="comp-tab-btn ${o==="pricing"?"active":""}" data-tab="pricing" role="tab" aria-selected="${o==="pricing"}">
                <span>🏷️ ${l(p("detail.pricing"))}</span>
              </button>
            </div>

            <!-- Dynamic Live Rendered UI Archetype Sandbox Viewport -->
            <div class="mockup-viewport ${u}" 
                 id="mockup-viewport"
                 data-theme="${t.id}"
                 data-archetype="${a}"
                 style="
                   --theme-shadow: 0 ${c.shadowDepth}px ${Math.max(10,c.shadowDepth*2)}px rgba(0, 0, 0, 0.5);
                   --tweak-surface-radius: ${c.borderRadius}px;
                   --tweak-border-width: ${c.borderWidth}px;
                   --tweak-shadow-depth: ${c.shadowDepth}px;
                   --tweak-backdrop-blur: ${c.backdropBlur}px;
                   --tweak-glow-intensity: ${c.glowIntensity};
                 ">
              ${V(a,t,{tab:o,snapshot:v})}
            </div>
            
            <div class="sandbox-footer-hint">
              <span>💡 ${l(h.previewHint||"")}</span>
            </div>
          </section>

          <!-- Right Column: Inspector, Parameters & Meta -->
          <aside class="detail-sidebar-section">
            <div class="style-hero-summary">
              <div class="style-badge-row">
                <span class="style-category-badge">${l(n.title)}</span>
                <span class="style-motion-badge">${l(p("detail.motion",{value:t.motionLabel||t.motionProfile}))}</span>
              </div>
              <h2 class="style-title" id="modal-style-title">${l(t.name)}</h2>
              <p class="style-desc">${l(t.shortDesc)}</p>
            </div>

            <!-- Palette Palette -->
            <div class="sidebar-block">
              <h3 class="block-title">🎨 ${l(h.palette||"")}</h3>
              <div class="palette-swatches-grid" id="palette-swatches-grid">
                ${t.palette.map(i=>`
                  <button class="palette-swatch-card" data-hex="${l(i.hex)}" data-name="${l(i.name)}">
                    <span class="swatch-color" style="background: ${i.hex}"></span>
                    <div class="swatch-meta">
                      <span class="swatch-name">${l(i.name)}</span>
                      <span class="swatch-hex">${l(i.hex)}</span>
                    </div>
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Live Parameter Tuner Sliders -->
            <div class="sidebar-block">
              <div class="block-title-row">
                <h3 class="block-title">🎛️ ${l(h.liveTuner||"")}</h3>
                <button class="reset-tweaks-btn" id="btn-reset-tweaks" title="${l(h.reset||"")}">↺ ${l(h.reset||"")}</button>
              </div>
              
              <div class="tweaks-controls-list">
                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <label for="slider-radius">${l(p("detail.radius"))}</label>
                    <strong id="val-radius">${c.borderRadius}px</strong>
                  </div>
                  <input type="range" min="${W.borderRadius.min}" max="${W.borderRadius.max}" step="${W.borderRadius.step}" value="${c.borderRadius}" class="tweak-slider" id="slider-radius" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <label for="slider-border">${l(p("detail.border"))}</label>
                    <strong id="val-border">${c.borderWidth}px</strong>
                  </div>
                  <input type="range" min="${W.borderWidth.min}" max="${W.borderWidth.max}" step="${W.borderWidth.step}" value="${c.borderWidth}" class="tweak-slider" id="slider-border" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <label for="slider-shadow">${l(p("detail.shadow"))}</label>
                    <strong id="val-shadow">${c.shadowDepth}px</strong>
                  </div>
                  <input type="range" min="0" max="30" value="${c.shadowDepth}" class="tweak-slider" id="slider-shadow" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <label for="slider-blur">${l(p("detail.blur"))}</label>
                    <strong id="val-blur">${c.backdropBlur}px</strong>
                  </div>
                  <input type="range" min="0" max="32" value="${c.backdropBlur}" class="tweak-slider" id="slider-blur" />
                </div>

                <div class="tweak-row">
                  <div class="tweak-label-row">
                    <label for="slider-glow">${l(p("detail.glow"))}</label>
                    <strong id="val-glow">${Number(c.glowIntensity??1).toFixed(1)}</strong>
                  </div>
                  <input type="range" min="0" max="2" step="0.1" value="${c.glowIntensity??1}" class="tweak-slider" id="slider-glow" />
                </div>
              </div>
            </div>

            <!-- Reactive Design Spec & Code Inspector (v2.3.0) -->
            <div class="sidebar-block" id="detail-inspector-block">
              <div class="block-title-row">
                <h3 class="block-title">🛠️ ${l(p("detail.inspectorTitle"))}</h3>
              </div>

              <!-- 4-Tab Navigation Bar -->
              <nav class="inspector-tab-nav" role="tablist" aria-label="${l(h.inspector||"")}">
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
                <button class="css-submode-btn active" data-css-sub="full">${l(p("detail.cssFull"))}</button>
                <button class="css-submode-btn" data-css-sub="tokens">${l(p("detail.cssTokens"))}</button>
                <button class="css-submode-btn" data-css-sub="component">${l(p("detail.cssComponent"))}</button>
              </div>

              <!-- Inspector Content Panes -->
              <div class="inspector-viewer-container">
                <div class="inspector-pane active" id="pane-css">
                  <pre class="code-inspector-box"><code id="live-css-code"></code></pre>
                </div>
                <div class="inspector-pane" id="pane-html">
                  <pre class="code-inspector-box"><code id="live-html-code"></code></pre>
                </div>
                <div class="inspector-pane" id="pane-md">
                  <pre class="code-inspector-box markdown-inspector-box"><code id="live-md-code"></code></pre>
                </div>
                <div class="inspector-pane" id="pane-json">
                  <pre class="code-inspector-box"><code id="live-json-code"></code></pre>
                </div>
              </div>

              <!-- Action Toolbar -->
              <div class="inspector-action-bar">
                <button class="inspector-action-btn" id="btn-inspector-copy" title="${l(p("detail.copyCurrent"))}">
                  <span>📋 ${l(p("detail.copyClipboard"))}</span>
                </button>
                <button class="inspector-action-btn" id="btn-inspector-download" title="${l(p("detail.downloadCurrent"))}">
                  <span id="btn-inspector-download-label">${l(p("detail.downloadCss"))}</span>
                </button>
                <button class="inspector-action-btn primary-export" id="btn-inspector-bundle" title="${l(p("detail.bundleTitle"))}">
                  <span>📦 ${l(p("detail.bundle"))}</span>
                </button>
              </div>
            </div>

            <!-- Characteristics / Pros & Cons -->
            <div class="sidebar-block">
              <h3 class="block-title">📋 ${l(h.characteristics||"")}</h3>
              <div class="characteristics-list" id="characteristics-list">
                ${t.characteristics.map(i=>`<div class="char-chip">✓ ${l(i)}</div>`).join("")}
              </div>
              
              <div class="pros-cons-grid" id="pros-cons-grid">
                <div class="pros-box">
                  <h4>👍 ${l(h.pros||"")}</h4>
                  <ul>${t.pros.map(i=>`<li>${l(i)}</li>`).join("")}</ul>
                </div>
                <div class="cons-box">
                  <h4>⚠️ ${l(h.cons||"")}</h4>
                  <ul>${t.cons.map(i=>`<li>${l(i)}</li>`).join("")}</ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `,Ce(e);const C=e.querySelector("#mockup-viewport");C&&N(C,t,{archetype:a,snapshot:v,initialState:r?.initialState||null}),e.querySelectorAll(".inspector-tab-btn").forEach(i=>{const f=i.getAttribute("data-insp-tab")===I;i.classList.toggle("active",f),i.setAttribute("aria-selected",String(f))}),e.querySelectorAll(".inspector-pane").forEach(i=>{i.classList.toggle("active",i.id===`pane-${I}`)}),e.querySelectorAll(".css-submode-btn").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-css-sub")===j)});const s=e.querySelector(".detail-sidebar-section"),d=e.querySelector(".modal-body-grid");if(s&&(s.scrollTop=r?.sidebarScrollTop||0),d&&(d.scrollTop=r?.bodyScrollTop||0),r?.focusId){const i=document.getElementById(r.focusId);i&&e.contains(i)&&i.focus({preventScroll:!0})}O(e)}function we(e,t,n,b,r){const a=e.querySelector("#mockup-viewport");if(!a)return;K(a),a.innerHTML=V(n,t,{tab:b,snapshot:k()}),a.className=`mockup-viewport ${r}`,a.setAttribute("data-theme",t.id),a.setAttribute("data-archetype",n),N(a,t,{archetype:n,snapshot:k()}),ae(e),O(e),e.querySelectorAll(".archetype-tab-btn").forEach(u=>{const c=u.getAttribute("data-archetype")===n;u.classList.toggle("active",c),u.setAttribute("aria-selected",String(c))}),e.querySelectorAll(".comp-tab-btn").forEach(u=>{const c=u.getAttribute("data-tab")===b;u.classList.toggle("active",c),u.setAttribute("aria-selected",String(c))});const o=e.querySelector("#web-sub-tabs");o&&(o.style.display=n==="web"?"flex":"none")}function $e(e,t,n,b){const r=e.querySelector("#mockup-viewport");if(r){const v=pe(r),{activeArchetype:h,activeComponentTab:p,sandboxDevice:C}=b;K(r),r.innerHTML=V(h,t,{tab:p,snapshot:k()}),r.className=`mockup-viewport ${C}`,r.setAttribute("data-theme",t.id),r.setAttribute("data-archetype",h),N(r,t,{archetype:h,snapshot:k(),initialState:v}),ae(e),ce(e,b.liveTweaks)}const a=e.querySelector(".detail-modal-container");a&&a.style.setProperty("--modal-accent",n.accentColor);const o=e.querySelector("#top-cat-name"),u=e.querySelector("#top-sub-name");o&&(o.textContent=n.title),u&&(u.textContent=t.name),e.querySelectorAll(".top-cat-tab-btn").forEach(v=>{const h=v.getAttribute("data-cat-id")===n.id;v.classList.toggle("active",h),v.setAttribute("aria-selected",String(h))});const c=e.querySelector("#top-style-selector"),S=c?.getAttribute("data-category-id")===n.id&&c.querySelector("#detail-style-search")?.value||"",y=Array.from(e.querySelectorAll(".top-style-chip")).some(v=>v.getAttribute("data-sub-id")===t.id);c&&(c.getAttribute("data-category-id")!==n.id||!y)&&(c.outerHTML=ye(n.subCategories,{categoryId:n.id,categoryTitle:n.title,selectedId:t.id,query:S,snapshot:k(),renderThumbnail:_})),e.querySelectorAll(".top-style-chip").forEach(v=>{const h=v.getAttribute("data-sub-id")===t.id;v.classList.toggle("active",h),v.setAttribute("aria-selected",String(h)),h&&v.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})})}function ie(e,t,n,b){const r=k()?.copy,a=(s,d)=>x(r,s,d),o=e.querySelector("#modal-style-title"),u=e.querySelector(".style-desc"),c=e.querySelector(".style-category-badge"),S=e.querySelector(".style-motion-badge");o&&(o.textContent=t.name),u&&(u.textContent=t.shortDesc),c&&(c.textContent=n.title),S&&(S.textContent=a("detail.motion",{value:t.motionLabel||t.motionProfile}));const y=e.querySelector("#palette-swatches-grid");y&&(y.innerHTML=t.palette.map(s=>`
        <button class="palette-swatch-card" data-hex="${l(s.hex)}" data-name="${l(s.name)}">
          <span class="swatch-color" style="background: ${s.hex}"></span>
          <div class="swatch-meta">
            <span class="swatch-name">${l(s.name)}</span>
            <span class="swatch-hex">${l(s.hex)}</span>
          </div>
        </button>
      `).join(""));const v=e.querySelector("#characteristics-list");v&&(v.innerHTML=t.characteristics.map(s=>`<div class="char-chip">✓ ${l(s)}</div>`).join(""));const h=e.querySelector("#pros-cons-grid");h&&(h.innerHTML=`
        <div class="pros-box">
          <h4>👍 ${l(a("detail.pros"))}</h4>
          <ul>${t.pros.map(s=>`<li>${l(s)}</li>`).join("")}</ul>
        </div>
        <div class="cons-box">
          <h4>⚠️ ${l(a("detail.cons"))}</h4>
          <ul>${t.cons.map(s=>`<li>${l(s)}</li>`).join("")}</ul>
        </div>
      `);const p=e.querySelector("#btn-modal-bookmark");if(p){const s=b.bookmarks.includes(t.id);p.classList.toggle("active",s),p.querySelector("span").textContent=a(s?"detail.bookmarked":"detail.bookmark")}const C=e.querySelector("#btn-modal-confirm");if(C){const s=b.confirmedStyleId===t.id;C.classList.toggle("active",s),C.querySelector("span").textContent=a(s?"detail.confirmed":"detail.confirm")}O(e)}function ke(e,t,n){const{sandboxDevice:b="desktop",liveTweaks:r,bookmarks:a}=n,o=e.querySelector("#mockup-viewport");o&&(o.className=`mockup-viewport ${b}`),ce(e,r),e.querySelectorAll(".device-btn").forEach(c=>{c.classList.toggle("active",c.getAttribute("data-device")===b)});const u=e.querySelector("#btn-modal-bookmark");if(u){const c=a.includes(t.id);u.classList.toggle("active",c),u.querySelector("span").textContent=x(k()?.copy,c?"detail.bookmarked":"detail.bookmark")}}function ce(e,t,n){const b=e.querySelector("#mockup-viewport");b&&(b.style.setProperty("--theme-shadow",`0 ${t.shadowDepth}px ${Math.max(10,t.shadowDepth*2)}px rgba(0, 0, 0, 0.5)`),b.style.setProperty("--tweak-surface-radius",`${t.borderRadius}px`),b.style.setProperty("--tweak-border-width",`${t.borderWidth}px`),b.style.setProperty("--tweak-shadow-depth",`${t.shadowDepth}px`),b.style.setProperty("--tweak-backdrop-blur",`${t.backdropBlur}px`),b.style.setProperty("--tweak-glow-intensity",`${t.glowIntensity}`));const r=e.querySelector("#val-radius"),a=e.querySelector("#val-border"),o=e.querySelector("#val-shadow"),u=e.querySelector("#val-blur"),c=e.querySelector("#val-glow");r&&(r.textContent=`${t.borderRadius}px`),a&&(a.textContent=`${t.borderWidth}px`),o&&(o.textContent=`${t.shadowDepth}px`),u&&(u.textContent=`${t.backdropBlur}px`),c&&(c.textContent=`${Number(t.glowIntensity??1).toFixed(1)}`);const S=e.querySelector("#slider-radius"),y=e.querySelector("#slider-border"),v=e.querySelector("#slider-shadow"),h=e.querySelector("#slider-blur"),p=e.querySelector("#slider-glow");S&&S.value!==String(t.borderRadius)&&(S.value=t.borderRadius),y&&y.value!==String(t.borderWidth)&&(y.value=t.borderWidth),v&&v.value!==String(t.shadowDepth)&&(v.value=t.shadowDepth),h&&h.value!==String(t.backdropBlur)&&(h.value=t.backdropBlur),p&&p.value!==String(t.glowIntensity)&&(p.value=t.glowIntensity??1),O(e)}function Ce(e){const t=()=>{A.playSfx("CLOSE"),m.setState({currentView:"MAIN"})},n=e.querySelector("#modal-backdrop"),b=e.querySelector("#btn-modal-close"),r=e.querySelector("#btn-modal-back");n&&n.addEventListener("click",t),b&&b.addEventListener("click",t),r&&r.addEventListener("click",t),e.querySelectorAll(".top-cat-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-cat-id"),i=B.find($=>$.id===d);if(!i||!i.subCategories.length)return;const f=i.subCategories[0];A.playSfx("THEME_SWAP");const w=[f.id,...m.getState().recentlyViewed.filter($=>$!==f.id)].slice(0,6);m.setState({selectedMainCategory:i.id,selectedSubCategory:f.id,liveTweaks:f.defaultTweaks||m.getState().liveTweaks,draftSubId:f.id,recentlyViewed:w})})});const a=e.querySelector("#universal-top-bar");a&&(a.addEventListener("click",s=>{const d=s.target.closest(".top-style-chip");if(!d||!a.contains(d))return;const i=d.getAttribute("data-sub-id"),f=L.find($=>$.id===i);if(!f||f.id===m.getState().selectedSubCategory)return;A.playSfx("THEME_SWAP");const w=[f.id,...m.getState().recentlyViewed.filter($=>$!==f.id)].slice(0,6);m.setState({selectedMainCategory:f.categoryId,selectedSubCategory:f.id,liveTweaks:f.defaultTweaks||m.getState().liveTweaks,draftSubId:f.id,recentlyViewed:w})}),a.addEventListener("input",s=>{if(s.target.id!=="detail-style-search")return;const d=B.find($=>$.id===m.getState().selectedMainCategory);if(!d)return;const i=Ne(d.subCategories,{query:s.target.value,selectedId:m.getState().selectedSubCategory,renderThumbnail:_}),f=a.querySelector("#top-style-chips-scroller"),w=a.querySelector("#detail-style-picker-status");if(f&&(f.innerHTML=i.markup),w){const $=k()?.copy;w.textContent=`${x($,"detail.styleMatches",{count:i.matchCount})}${i.selectedPinned?` · ${x($,"split.selectedPinned")}`:""}`}})),e.querySelectorAll(".archetype-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-archetype");d!==m.getState().activeArchetype&&(A.playSfx("CLICK"),m.setActiveArchetype(d))})}),e.querySelectorAll(".comp-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-tab");d!==m.getState().activeComponentTab&&(A.playSfx("CLICK"),m.setState({activeComponentTab:d}))})}),e.querySelectorAll(".device-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-device");d!==m.getState().sandboxDevice&&(A.playSfx("CLICK"),m.setState({sandboxDevice:d}))})}),e.querySelectorAll(".zoom-btn").forEach(s=>{s.addEventListener("click",()=>{e.querySelectorAll(".zoom-btn").forEach(d=>d.classList.toggle("active",d===s)),ae(e),A.playSfx("CLICK")})});const o=e.querySelector("#btn-modal-bookmark");o&&o.addEventListener("click",()=>{const s=m.getState().selectedSubCategory,d=m.toggleBookmark(s);A.playSfx("BOOKMARK"),o.classList.toggle("active",d),o.querySelector("span").textContent=x(k()?.copy,d?"detail.bookmarked":"detail.bookmark")});const u=e.querySelector("#btn-modal-confirm");u&&u.addEventListener("click",()=>{const s=m.getState().selectedSubCategory;Re(s),u.querySelector("span").textContent=x(k()?.copy,"detail.confirmed"),u.classList.add("active")});const c=e.querySelector("#btn-modal-compare");c&&c.addEventListener("click",()=>{const s=m.getState().selectedSubCategory;De(s)});const S=e.querySelector("#palette-swatches-grid");S&&S.addEventListener("click",s=>{const d=s.target.closest(".palette-swatch-card");if(!d)return;const i=d.getAttribute("data-hex"),f=d.getAttribute("data-name");ue(i,x(k()?.copy,"detail.colorCode",{name:f}))}),e.querySelectorAll(".inspector-tab-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-insp-tab");if(!d||d===I)return;A.playSfx("CLICK"),I=d,e.querySelectorAll(".inspector-tab-btn").forEach(w=>{const $=w.getAttribute("data-insp-tab")===d;w.classList.toggle("active",$),w.setAttribute("aria-selected",String($))}),e.querySelectorAll(".inspector-pane").forEach(w=>{w.classList.toggle("active",w.id===`pane-${d}`)});const i=e.querySelector("#css-submode-nav");i&&(i.style.display=d==="css"?"flex":"none");const f=e.querySelector("#btn-inspector-download-label");if(f){const w=k()?.copy,$={css:x(w,"detail.downloadCss"),html:x(w,"detail.downloadHtml"),md:x(w,"detail.downloadMarkdown"),json:x(w,"detail.downloadJson")};f.textContent=$[d]||x(w,"detail.downloadFile")}O(e)})}),e.querySelectorAll(".css-submode-btn").forEach(s=>{s.addEventListener("click",()=>{const d=s.getAttribute("data-css-sub");!d||d===j||(A.playSfx("CLICK"),j=d,e.querySelectorAll(".css-submode-btn").forEach(i=>{i.classList.toggle("active",i.getAttribute("data-css-sub")===d)}),O(e))})});const y=e.querySelector("#btn-inspector-copy");y&&y.addEventListener("click",()=>{const s=k()?.copy,d={css:{label:x(s,"detail.codeCss")},html:{label:x(s,"detail.codeHtml")},md:{label:x(s,"detail.codeMarkdown")},json:{label:x(s,"detail.codeJson")}},i=d[I]||d.css,f=M(e,I,j);ue(f,i.label)});const v=e.querySelector("#btn-inspector-download");v&&v.addEventListener("click",()=>{const s=ve(m.getState(),L);if(!s)return;const{subDesign:d,archetype:i}=s,f={css:{filename:`${d.id}-${i}.css`,mime:"text/css;charset=utf-8",content:()=>M(e,"css",j)},html:{filename:`${d.id}-${i}.html`,mime:"text/html;charset=utf-8",content:()=>M(e,"html")},md:{filename:`${d.id}-designs.md`,mime:"text/markdown;charset=utf-8",content:()=>M(e,"md")},json:{filename:`${d.id}-tokens.json`,mime:"application/json;charset=utf-8",content:()=>M(e,"json")}},w=f[I]||f.css,$=w.content();me(w.filename,$,w.mime),A.playSfx("SUCCESS")});const h=e.querySelector("#btn-inspector-bundle");h&&h.addEventListener("click",()=>{const s=ve(m.getState(),L);if(!s)return;const{subDesign:d,archetype:i,device:f}=s,w=M(e,"css","full"),$=M(e,"html"),Ee=M(e,"md"),Te=M(e,"json"),qe=`/* ==========================================================================
   DESIGN SPECTRUM INTEGRATED TEXT SNAPSHOT v2.3.0
   Design Style: ${d.name} [${d.id}]
   Archetype: ${i.toUpperCase()} | Device: ${f}
   Generated: ${new Date().toISOString()}
   ========================================================================== */

/* --- FILE 1/4: tokens.json (DTCG 2025.10 Format) --- */
/*
${Te}
*/

/* --- FILE 2/4: designs.md (Design Specification) --- */
/*
${Ee}
*/

/* --- FILE 3/4: style.css (Complete CSS Tokens & Archetype Styles) --- */
${w}

/* --- FILE 4/4: index.html (Component Markup) --- */
<!--
${$}
-->
`;me(`${d.id}-integrated-snapshot.txt`,qe,"text/plain;charset=utf-8"),A.playSfx("CONFIRM")});const p=e.querySelector("#btn-reset-tweaks");p&&p.addEventListener("click",()=>{const d=L.find(i=>i.id===m.getState().selectedSubCategory)?.defaultTweaks||{borderRadius:16,borderWidth:1,shadowDepth:10,backdropBlur:16,glowIntensity:1};A.playSfx("SUCCESS"),m.setState({liveTweaks:d})});const C=(s,d,i=!1)=>{const f=e.querySelector(s);f&&f.addEventListener("input",w=>{const $=i?parseFloat(w.target.value):parseInt(w.target.value,10);m.setState({liveTweaks:{[d]:$}})})};C("#slider-radius","borderRadius"),C("#slider-border","borderWidth"),C("#slider-shadow","shadowDepth"),C("#slider-blur","backdropBlur"),C("#slider-glow","glowIntensity",!0),P&&window.removeEventListener("keydown",P),P=s=>{if(m.getState().currentView!=="DETAIL"){window.removeEventListener("keydown",P),P=null;return}if(s.key==="Escape"){s.preventDefault(),t();return}const i=document.activeElement?.tagName;if(i==="INPUT"||i==="TEXTAREA"||i==="SELECT")return;const f=m.getState().selectedSubCategory;s.key==="["||s.key==="ArrowLeft"&&!s.shiftKey?(s.preventDefault(),ne(f,-1)):s.key==="]"||s.key==="ArrowRight"&&!s.shiftKey?(s.preventDefault(),ne(f,1)):s.shiftKey&&s.key==="ArrowLeft"?(s.preventDefault(),re(-1)):s.shiftKey&&s.key==="ArrowRight"&&(s.preventDefault(),re(1))},window.addEventListener("keydown",P)}function ne(e,t){const n=L.findIndex(o=>o.id===e);if(n<0)return;const b=(n+t+L.length)%L.length,r=L[b];A.playSfx("THEME_SWAP");const a=[r.id,...m.getState().recentlyViewed.filter(o=>o!==r.id)].slice(0,6);m.setState({selectedMainCategory:r.categoryId,selectedSubCategory:r.id,liveTweaks:r.defaultTweaks||m.getState().liveTweaks,draftSubId:r.id,recentlyViewed:a})}function re(e){const t=m.getState().selectedMainCategory,n=B.findIndex(u=>u.id===t);if(n<0)return;const b=(n+e+B.length)%B.length,r=B[b],a=r.subCategories[0];A.playSfx("THEME_SWAP");const o=[a.id,...m.getState().recentlyViewed.filter(u=>u!==a.id)].slice(0,6);m.setState({selectedMainCategory:r.id,selectedSubCategory:a.id,liveTweaks:a.defaultTweaks||m.getState().liveTweaks,draftSubId:a.id,recentlyViewed:o})}function oe(e,{focusInitial:t=!0}={}){ee();const n='button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';if(U=b=>{if(b.key!=="Tab")return;const r=Array.from(e.querySelectorAll(n)).filter(u=>!u.disabled&&u.offsetParent!==null);if(!r.length)return;const a=r[0],o=r[r.length-1];b.shiftKey?document.activeElement===a&&(b.preventDefault(),o.focus()):document.activeElement===o&&(b.preventDefault(),a.focus())},e.addEventListener("keydown",U),t){const b=e.querySelector(".breadcrumb-back-btn")||e.querySelector("button");b&&b.focus()}}function ee(){U&&g&&(g.removeEventListener("keydown",U),U=null)}function xe(e,t,n,b){const r=Z(t[0],"comparison A"),a=Z(t[1],"comparison B"),o=k(),u=(y,v)=>x(o?.copy,y,v);Q(e),e.innerHTML=`
      <div class="detail-modal-backdrop" id="compare-backdrop"></div>
      
      <div class="split-compare-modal-container" role="dialog" aria-modal="true" aria-labelledby="split-modal-title">
        <!-- Split Top Bar -->
        <div class="split-top-bar">
          <div class="split-head-title">
            <span class="split-icon">⚖️</span>
            <h2 id="split-modal-title">${l(u("split.title"))}</h2>
          </div>

          <!-- Synchronized Archetype Tab Controls -->
          <div class="archetype-tabs-nav" role="tablist" aria-label="${l(u("split.archetypes"))}">
            ${je(n).map(y=>`
              <button class="split-tab-btn ${y.ariaSelected==="true"?"active":""}"
                      id="split-tab-${y.id}"
                      data-archetype="${y.id}"
                      role="tab"
                      aria-selected="${y.ariaSelected}"
                      aria-controls="split-viewport-a split-viewport-b"
                      tabindex="${y.tabIndex}">${l(u(`detail.${y.id}`))}</button>
            `).join("")}
          </div>

          <button class="modal-close-btn" id="btn-compare-close" aria-label="${l(u("split.close"))}">
            <span>✕</span>
          </button>
        </div>

        <!-- 2 Side-by-Side Columns -->
        <div class="split-columns-grid">
          <!-- Left Style Column -->
          <div class="split-col split-left" style="--split-accent: ${r.accentColor}">
            <div class="split-col-header">
              <div class="split-select-wrapper">
                <span class="split-badge">${l(u("split.styleA"))}</span>
                <select class="split-style-select" id="select-style-a" aria-label="${l(u("split.selectA"))}">
                  ${L.map(y=>`
                    <option value="${y.id}" ${y.id===r.id?"selected":""}>
                      [${y.categoryTitle}] ${y.name}
                    </option>
                  `).join("")}
                </select>
              </div>
              <p class="split-col-desc">${r.shortDesc}</p>
              <div class="split-palette-strip">
                ${r.palette.map(y=>`<span class="split-dot" style="background:${y.hex}" title="${y.name} (${y.hex})"></span>`).join("")}
              </div>
            </div>

            ${be(L,{slot:"A",query:G.A,selectedId:r.id,snapshot:o,renderThumbnail:_})}
            <div class="split-viewport" id="split-viewport-a" data-theme="${r.id}" data-archetype="${n}" role="tabpanel" aria-labelledby="split-tab-${n}" tabindex="0">
              ${V(n,r,{tab:b,snapshot:o})}
            </div>
          </div>

          <!-- Right Style Column -->
          <div class="split-col split-right" style="--split-accent: ${a.accentColor}">
            <div class="split-col-header">
              <div class="split-select-wrapper">
                <span class="split-badge">${l(u("split.styleB"))}</span>
                <select class="split-style-select" id="select-style-b" aria-label="${l(u("split.selectB"))}">
                  ${L.map(y=>`
                    <option value="${y.id}" ${y.id===a.id?"selected":""}>
                      [${y.categoryTitle}] ${y.name}
                    </option>
                  `).join("")}
                </select>
              </div>
              <p class="split-col-desc">${a.shortDesc}</p>
              <div class="split-palette-strip">
                ${a.palette.map(y=>`<span class="split-dot" style="background:${y.hex}" title="${y.name} (${y.hex})"></span>`).join("")}
              </div>
            </div>

            ${be(L,{slot:"B",query:G.B,selectedId:a.id,snapshot:o,renderThumbnail:_})}
            <div class="split-viewport" id="split-viewport-b" data-theme="${a.id}" data-archetype="${n}" role="tabpanel" aria-labelledby="split-tab-${n}" tabindex="0">
              ${V(n,a,{tab:b,snapshot:o})}
            </div>
          </div>
        </div>
      </div>
    `,Le(e,t);const c=e.querySelector("#split-viewport-a"),S=e.querySelector("#split-viewport-b");c&&N(c,r,{archetype:n,snapshot:o}),S&&N(S,a,{archetype:n,snapshot:o}),oe(e)}function Ae(e,t,n,b){const r=Z(t[0],"comparison A"),a=Z(t[1],"comparison B");e.querySelectorAll(".split-tab-btn").forEach(c=>{const S=c.getAttribute("data-archetype")===n;c.classList.toggle("active",S),c.setAttribute("aria-selected",String(S)),c.setAttribute("tabindex",S?"0":"-1")});const o=e.querySelector("#split-viewport-a"),u=e.querySelector("#split-viewport-b");o&&(K(o),o.innerHTML=V(n,r,{tab:b,snapshot:k()}),o.setAttribute("data-theme",r.id),o.setAttribute("data-archetype",n),o.setAttribute("aria-labelledby",`split-tab-${n}`),N(o,r,{archetype:n,snapshot:k()})),u&&(K(u),u.innerHTML=V(n,a,{tab:b,snapshot:k()}),u.setAttribute("data-theme",a.id),u.setAttribute("data-archetype",n),u.setAttribute("aria-labelledby",`split-tab-${n}`),N(u,a,{archetype:n,snapshot:k()}))}function Le(e,t){const n=()=>{A.playSfx("CLOSE");const{compareReturnView:c,selectedMainCategory:S,selectedSubCategory:y}=m.getState(),v=c==="DETAIL"&&S&&y;m.setState({currentView:v?"DETAIL":"MAIN"})},b=e.querySelector("#compare-backdrop"),r=e.querySelector("#btn-compare-close");b&&b.addEventListener("click",n),r&&r.addEventListener("click",n);const a=e.querySelector("#select-style-a"),o=e.querySelector("#select-style-b");a&&a.addEventListener("change",c=>{A.playSfx("THEME_SWAP"),m.setCompareSubIds(c.target.value,t[1]),e.querySelector("#select-style-a")?.focus({preventScroll:!0})}),o&&o.addEventListener("change",c=>{A.playSfx("THEME_SWAP"),m.setCompareSubIds(t[0],c.target.value),e.querySelector("#select-style-b")?.focus({preventScroll:!0})}),e.querySelectorAll(".split-tab-btn").forEach(c=>{c.addEventListener("click",()=>{const S=c.getAttribute("data-archetype");S!==m.getState().activeArchetype&&(A.playSfx("CLICK"),m.setActiveArchetype(S))}),c.addEventListener("keydown",S=>{const y=He(c.getAttribute("data-archetype"),S.key);if(!y)return;S.preventDefault();const v=e.querySelector(`#split-tab-${y}`);v?.focus(),v?.click()})});const u=e.querySelector(".split-compare-modal-container");u&&(u.addEventListener("click",c=>{const S=c.target.closest(".split-pick-thumb");if(!S||!u.contains(S))return;const y=S.getAttribute("data-slot"),v=S.getAttribute("data-sub-id");A.playSfx("THEME_SWAP"),y==="A"?m.setCompareSubIds(v,t[1]):m.setCompareSubIds(t[0],v),e.querySelector(`#split-style-search-${y.toLocaleLowerCase("en")}`)?.focus({preventScroll:!0})}),u.addEventListener("input",c=>{const S=c.target.getAttribute("data-split-search");if(S!=="A"&&S!=="B")return;G[S]=c.target.value;const y=S==="A"?t[0]:t[1],v=Fe(L,{slot:S,query:G[S],selectedId:y,renderThumbnail:_}),h=S.toLocaleLowerCase("en"),p=u.querySelector(`#split-picker-${h}`),C=u.querySelector(`#split-picker-status-${h}`);p&&(p.innerHTML=v.markup),C&&(C.textContent=`${x(k()?.copy,"split.matchCount",{count:v.matchCount})}${v.selectedPinned?` · ${x(k()?.copy,"split.selectedPinned")}`:""}`)})),R&&window.removeEventListener("keydown",R),R=c=>{if(m.getState().currentView!=="SPLIT_COMPARE"){window.removeEventListener("keydown",R),R=null;return}c.key==="Escape"&&n()},window.addEventListener("keydown",R)}function de(){se||(se=!0,Y?.(),Y=null,Q(g),ee(),P&&(window.removeEventListener("keydown",P),P=null),R&&(window.removeEventListener("keydown",R),R=null),F&&(cancelAnimationFrame(F),F=null),X.resumeLoop(),g.style.display="none",g.innerHTML="")}try{Y=m.subscribe(()=>Se())}catch(e){throw de(),e}return de}export{ae as applySelectedZoom,ze as renderDetailView};
