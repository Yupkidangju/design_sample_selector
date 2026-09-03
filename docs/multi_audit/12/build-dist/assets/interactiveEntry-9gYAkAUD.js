import{a as u,t as C,g as H,h as z,c as K,s as D,o as E,f as q,l as B,b as S,d as F,r as _,e as T,i as G,j as O,k as R}from"./index-BFii0hNt.js";import{c as V}from"./clipboard-CoaL6PWb.js";function m(d){return d?String(d).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}function U(d){if(!d)return;let w=null,b=0,y=0;function g(s,e){const i=u.getState();return e===b&&i.currentView==="MAIN"&&i.peekSubId===s.id}async function h(s){const e=(o,t)=>q(S()?.copy,o,t),i=++b,r=d.querySelector("#peek-viewport");if(!r)return;r.setAttribute("aria-busy","true"),r.innerHTML=`<p class="inline-preview-state" role="status">${m(e("peek.loading"))}</p>`;let c="import";try{const{renderPreviewComponent:o}=await B();if(!g(s,i))return;const t=d.querySelector("#peek-viewport");if(!t)return;c="render";const n=S();t.innerHTML=o({rendererId:s.previewType,tab:"hero",design:s,snapshot:n}),t.removeAttribute("aria-busy"),c="hydrate",F(t,s,{tab:"hero",compact:!0,snapshot:n}),y=0}catch(o){if(!g(s,i))return;y+=1;const t=!!o?.terminal||y>=2;o?.code!=="RECOVERY_IMPORT_FAILED"&&_({code:"RECOVERY_RENDER_FAILED",phase:c,attempt:y,resourceClass:"peek-preview",terminal:t});const n=d.querySelector("#peek-viewport");if(!n)return;n.removeAttribute("aria-busy"),n.innerHTML=`
        <div class="inline-preview-state" role="alert">
          <p>${m(e("peek.failed"))}</p>
          ${t?`<button type="button" data-peek-preview-reload>${m(e("recovery.reload"))}</button>`:`<button type="button" data-peek-preview-retry>${m(e("recovery.retry"))}</button>`}
        </div>
      `,n.querySelector("[data-peek-preview-retry]")?.addEventListener("click",l=>{l.stopPropagation(),h(s)}),n.querySelector("[data-peek-preview-reload]")?.addEventListener("click",l=>{l.stopPropagation(),window.location.reload()})}}function $(){const{currentView:s,peekSubId:e,viewport:i}=u.getState();if(!(s==="MAIN"&&e)){const n=d.querySelector("#peek-viewport");C(n),b+=1,d.innerHTML="",d.style.display="none",w=null;return}const c=S(),o=(n,l)=>q(c?.copy,n,l),t=H(c).find(n=>n.id===e);if(!t){b+=1,d.style.display="none";return}if(d.style.display="block",w!==t.id){y=0,C(d.querySelector("#peek-viewport")),d.innerHTML=`
        <div class="peek-card ${i==="MOBILE"?"is-mobile":""}" role="region" aria-label="${m(o("peek.previewAria",{name:t.name}))}">
          <div class="peek-meta">
            <span class="peek-cat">${m(t.icon)} ${m(t.categoryTitle)}</span>
            <strong>${m(t.name)}</strong>
          </div>
          <div class="peek-viewport" id="peek-viewport" data-theme="${m(t.id)}" aria-busy="true">
            <p class="inline-preview-state" role="status">${m(o("peek.loading"))}</p>
          </div>
          <div class="peek-footer">
            <p class="peek-hint">${m(o("peek.hint"))}</p>
            <button class="peek-open-detail-btn" type="button" data-peek-open-detail>${m(o("peek.details"))}</button>
          </div>
        </div>
      `,h(t);const n=d.querySelector(".peek-card");L(n,t.id),n?.addEventListener("mouseenter",()=>z(t.id)),n?.addEventListener("mouseleave",()=>K()),n?.addEventListener("click",l=>{l.target.closest("[data-mock-action], button, a, input, select, textarea")||D(t.categoryId,t.id)}),n?.addEventListener("dblclick",l=>{l.target.closest("[data-mock-action], button, a, input, select, textarea")||E(t.categoryId,t.id)}),n?.querySelector("[data-peek-open-detail]")?.addEventListener("click",l=>{l.stopPropagation(),E(t.categoryId,t.id)}),w=t.id}else{const n=d.querySelector(".peek-card");n?.classList.toggle("is-mobile",i==="MOBILE"),L(n,t.id)}}function L(s,e){if(!s||s.classList.contains("is-mobile"))return;const i=document.querySelector(`#main-root [data-sub-id="${e}"]`);if(!i)return;const r=i.getBoundingClientRect(),c=Math.min(380,window.innerWidth-24);let o=r.right+12;o+c>window.innerWidth-12&&(o=r.left-c-12),o<12&&(o=12);let t=r.top;t+300>window.innerHeight&&(t=Math.max(72,window.innerHeight-320)),s.style.right="auto",s.style.left=`${o}px`,s.style.top=`${Math.max(72,t)}px`}u.subscribe((s,e)=>{(s.peekSubId!==e?.peekSubId||s.currentView!==e?.currentView||s.viewport!==e?.viewport)&&$()}),$()}function a(d){return d?String(d).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}function X(d){if(!d)return;let w=0,b=0,y=null;function g(){const e=++w,i=u.getState(),{currentView:r,draftSubId:c,confirmedStyleId:o,confirmSheetOpen:t,recentlyViewed:n,bookmarks:l,compareSubIds:x}=i,M=r==="MAIN"&&(c||o);if(document.body.classList.toggle("dock-open",!!M),d.style.display=M?"block":"none",C(d.querySelector("#confirm-preview")),!M){d.innerHTML="";return}const P=S(),f=(k,j)=>q(P?.copy,k,j),N=new Map(H(P).map(k=>[k.id,k])),I=k=>N.get(k)||null,p=I(c)||I(o),v=I(o),A=n.map(I).filter(Boolean),W=p?l.includes(p.id):!1,Y=p&&(x[0]===p.id||x[1]===p.id);d.innerHTML=`
      <div class="selection-dock ${t?"is-expanded":""}" role="region" aria-label="${a(f("dock.region"))}">
        ${t&&v?L(v,i,f):""}

        <div class="dock-bar">
          <div class="dock-confirmed-chip ${v?"has-value":""}" id="dock-open-confirmed" title="${a(f("dock.confirmedTitle"))}">
            <span class="dock-chip-label">${a(f("dock.selected"))}</span>
            ${v?`<span class="dock-chip-name">${a(v.name)}</span>`:`<span class="dock-chip-empty">${a(f("dock.unconfirmed"))}</span>`}
          </div>

          ${p?`
            <div class="dock-draft">
              <div class="dock-thumb">${T({thumbnailId:p.thumbMotif,design:p})}</div>
              <div class="dock-draft-meta">
                <span class="dock-kicker">${a(p.categoryTitle)}</span>
                <strong class="dock-title">${a(p.name)}</strong>
              </div>
            </div>
            <div class="dock-actions">
              <button class="dock-btn primary" id="dock-open-detail">${a(f("dock.details"))}</button>
              <button class="dock-btn" id="dock-confirm">${a(f(v?.id===p.id?"dock.confirmed":"dock.confirm"))}</button>
              <button class="dock-btn" id="dock-compare">${a(f(Y?"dock.inCompare":"dock.addCompare"))}</button>
              <button class="dock-btn" id="dock-bookmark">${W?"★":"☆"}</button>
              <button class="dock-btn ghost" id="dock-clear" aria-label="${a(f("dock.clear"))}">✕</button>
            </div>
          `:`
            <p class="dock-hint">${a(f("dock.hint"))}</p>
          `}

          ${A.length?`
            <div class="dock-recents" aria-label="${a(f("dock.recents"))}">
              ${A.map(k=>`
                <button class="dock-recent-btn ${k.id===p?.id?"active":""}" data-recent-id="${k.id}" title="${a(k.name)}">
                  ${T({thumbnailId:k.thumbMotif,design:k})}
                </button>
              `).join("")}
            </div>
          `:""}
        </div>
      </div>
    `,s(d,p,v),t&&v&&$(v,e)}function h(e,i){const r=u.getState();return i===w&&r.currentView==="MAIN"&&r.confirmSheetOpen&&r.confirmedStyleId===e.id}async function $(e,i){const r=(t,n)=>q(S()?.copy,t,n);y!==e.id&&(y=e.id,b=0);const c=d.querySelector("#confirm-preview");if(!c||!h(e,i))return;c.setAttribute("aria-busy","true"),c.innerHTML=`<p class="inline-preview-state" role="status">${a(r("dock.loading"))}</p>`;let o="import";try{const{renderPreviewComponent:t}=await B();if(!h(e,i))return;const n=d.querySelector("#confirm-preview");if(!n)return;o="render";const l=S();n.innerHTML=t({rendererId:e.previewType,tab:"hero",design:e,snapshot:l}),n.removeAttribute("aria-busy"),o="hydrate",F(n,e,{tab:"hero",snapshot:l}),b=0}catch(t){if(!h(e,i))return;b+=1;const n=!!t?.terminal||b>=2;t?.code!=="RECOVERY_IMPORT_FAILED"&&_({code:"RECOVERY_RENDER_FAILED",phase:o,attempt:b,resourceClass:"confirm-preview",terminal:n});const l=d.querySelector("#confirm-preview");if(!l)return;l.removeAttribute("aria-busy"),l.innerHTML=`
        <div class="inline-preview-state" role="alert">
          <p>${a(r("dock.failed"))}</p>
          ${n?`<button class="dock-btn" type="button" data-confirm-preview-reload>${a(r("recovery.reload"))}</button>`:`<button class="dock-btn" type="button" data-confirm-preview-retry>${a(r("recovery.retry"))}</button>`}
        </div>
      `,l.querySelector("[data-confirm-preview-retry]")?.addEventListener("click",()=>$(e,i)),l.querySelector("[data-confirm-preview-reload]")?.addEventListener("click",()=>window.location.reload())}}function L(e,i,r){const c=i.liveTweaks;return`
      <div class="confirm-sheet" role="region" aria-label="${a(r("dock.confirmedRegion"))}">
        <div class="confirm-sheet-head">
          <h3>${a(r("dock.confirmedHeading"))}</h3>
          <button class="dock-btn ghost" id="confirm-sheet-close">${a(r("dock.collapse"))}</button>
        </div>
        <div class="confirm-sheet-body">
          <div class="confirm-preview" id="confirm-preview" data-theme="${a(e.id)}" aria-busy="true">
            <p class="inline-preview-state" role="status">${a(r("dock.loading"))}</p>
          </div>
          <div class="confirm-facts">
            <p class="confirm-desc">${a(e.shortDesc)}</p>
            <div class="confirm-palette">
              ${e.palette.map(o=>`
                <button class="confirm-swatch" data-hex="${a(o.hex)}" data-name="${a(o.name)}" title="${a(o.name)}">
                  <i style="background:${o.hex}"></i>
                  <span>${a(o.hex)}</span>
                </button>
              `).join("")}
            </div>
            <pre class="confirm-css">border-radius: ${c.borderRadius}px;
border-width: ${c.borderWidth}px;
box-shadow: 0 ${c.shadowDepth}px ${c.shadowDepth*2}px rgba(0,0,0,.4);
backdrop-filter: blur(${c.backdropBlur}px);
--glow: ${c.glowIntensity};</pre>
            <div class="confirm-sheet-actions">
              <button class="dock-btn" id="confirm-copy-css">${a(r("dock.copyCss"))}</button>
              <button class="dock-btn" id="confirm-open-detail">${a(r("dock.openSandbox"))}</button>
              <button class="dock-btn" id="confirm-to-compare">${a(r("dock.raiseCompare"))}</button>
              <button class="dock-btn ghost" id="confirm-browse">${a(r("dock.browse"))}</button>
            </div>
          </div>
        </div>
      </div>
    `}function s(e,i,r){e.querySelector("#dock-open-detail")?.addEventListener("click",()=>{i&&E(i.categoryId,i.id)}),e.querySelector("#dock-confirm")?.addEventListener("click",()=>{i&&G(i.id)}),e.querySelector("#dock-compare")?.addEventListener("click",()=>{i&&O(i.id)}),e.querySelector("#dock-bookmark")?.addEventListener("click",()=>{i&&(u.toggleBookmark(i.id),R.playSfx("BOOKMARK"))}),e.querySelector("#dock-clear")?.addEventListener("click",()=>{R.playSfx("CLOSE"),u.setState({draftSubId:null,confirmSheetOpen:!1})}),e.querySelector("#dock-open-confirmed")?.addEventListener("click",()=>{r&&u.setState({confirmSheetOpen:!u.getState().confirmSheetOpen,draftSubId:r.id})}),e.querySelector("#confirm-sheet-close")?.addEventListener("click",()=>{u.setState({confirmSheetOpen:!1})}),e.querySelector("#confirm-copy-css")?.addEventListener("click",()=>{const c=u.getState().liveTweaks,o=`.theme-${r.id} {
  border-radius: ${c.borderRadius}px;
  border-width: ${c.borderWidth}px;
  --glow: ${c.glowIntensity};
}`;V(o,"CSS Snippet")}),e.querySelector("#confirm-open-detail")?.addEventListener("click",()=>{r&&E(r.categoryId,r.id)}),e.querySelector("#confirm-to-compare")?.addEventListener("click",()=>{r&&O(r.id)}),e.querySelector("#confirm-browse")?.addEventListener("click",()=>{u.setState({confirmSheetOpen:!1})}),e.querySelectorAll(".confirm-swatch").forEach(c=>{c.addEventListener("click",()=>V(c.dataset.hex,c.dataset.name))}),e.querySelectorAll(".dock-recent-btn").forEach(c=>{c.addEventListener("click",()=>{const o=findSubById(c.getAttribute("data-recent-id"));o&&D(o.categoryId,o.id)})})}u.subscribe((e,i)=>{(e.currentView!==i?.currentView||e.draftSubId!==i?.draftSubId||e.confirmedStyleId!==i?.confirmedStyleId||e.confirmSheetOpen!==i?.confirmSheetOpen||e.recentlyViewed!==i?.recentlyViewed||e.bookmarks!==i?.bookmarks||e.compareSubIds!==i?.compareSubIds)&&g()}),g()}export{U as renderPeekPreview,X as renderSelectionDock};
