import { PREVIEW_COMPONENT_TABS } from './contract.js';

const EMPTY_ASSET_PATHS = Object.freeze([]);

function action(label, message, className = 'w1-action') {
  return `<button class="${className}" type="button" data-mock-action="toast" data-mock-msg="${message}">${label}</button>`;
}

function defineRenderer(id, render) {
  return Object.freeze({
    id,
    aliases: EMPTY_ASSET_PATHS,
    tabs: PREVIEW_COMPONENT_TABS,
    assetPaths: EMPTY_ASSET_PATHS,
    render
  });
}

function renderBauhaus(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-bauhaus-geometry-unit" data-preview-tab="widget">
        <div class="w1-bauhaus-meter"><i class="shape circle"></i><strong>72</strong><span>FORM SCORE</span></div>
        <div class="w1-bauhaus-modules"><span>R / 04</span><span>B / 12</span><span>Y / 03</span></div>
        ${action('RECOMPOSE', 'Bauhaus modules recomposed', 'w1-bauhaus-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-bauhaus-geometry-unit" data-preview-tab="form">
        <div class="w1-bauhaus-form-mark"><i class="shape triangle"></i><span>WERK / FORM</span></div>
        <label class="w1-bauhaus-field">PROJECT<input type="text" value="TYPE WORKSHOP 03" /></label>
        <label class="w1-bauhaus-field">MODULE<select><option>CIRCLE + BAR</option></select></label>
        ${action('ASSEMBLE →', 'Bauhaus form assembled', 'w1-bauhaus-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-bauhaus-geometry-unit" data-preview-tab="pricing">
        <div class="w1-bauhaus-price-shape"><i class="shape square"></i><b>01</b></div>
        <section class="w1-bauhaus-plan"><span>FOUNDATION KIT</span><strong>48<small> / TERM</small></strong><p>12 forms · 3 primary systems · type workshop</p></section>
        ${action('ENROLL', 'Foundation kit selected', 'w1-bauhaus-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-bauhaus-geometry-unit" data-preview-tab="hero">
      <div class="w1-bauhaus-stage" aria-hidden="true"><i class="shape circle"></i><i class="shape triangle"></i><i class="shape bar"></i></div>
      <div class="w1-bauhaus-copy"><span>FORM FOLLOWS FUNCTION · 1923</span><h2>BUILD WITH<br />PRIMARY FORMS</h2><p>A modular school for type, color and useful objects.</p></div>
      ${action('ENTER WORKSHOP', 'Bauhaus workshop opened', 'w1-bauhaus-action')}
    </div>`;
}

function renderDeStijl(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-de-stijl-unit" data-preview-tab="widget">
        <div class="w1-stijl-kpi red"><strong>64%</strong><span>RED PLANE</span></div>
        <div class="w1-stijl-kpi white"><strong>24</strong><span>MODULES</span></div>
        <div class="w1-stijl-kpi blue"><strong>12%</strong><span>BLUE PLANE</span></div>
        ${action('BALANCE PLANES', 'Orthogonal planes balanced', 'w1-stijl-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-de-stijl-unit" data-preview-tab="form">
        <header class="w1-stijl-form-title">COMPOSITION / REQUEST</header>
        <label class="w1-stijl-field yellow">TITLE<input type="text" value="NEO PLASTIC STUDY" /></label>
        <label class="w1-stijl-field white">RATIO<select><option>4 × 7 ORTHOGONAL</option></select></label>
        ${action('SUBMIT GRID', 'De Stijl request submitted', 'w1-stijl-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-de-stijl-unit" data-preview-tab="pricing">
        <section class="w1-stijl-plan red"><span>PLAN R</span><strong>€24</strong><small>6 PLANES</small></section>
        <section class="w1-stijl-plan blue"><span>PLAN B</span><strong>€48</strong><small>12 PLANES</small></section>
        ${action('CHOOSE B', 'Blue composition selected', 'w1-stijl-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-de-stijl-unit" data-preview-tab="hero">
      <div class="w1-stijl-cell white"><h2>PURE<br />RELATIONS</h2></div>
      <div class="w1-stijl-cell red" aria-hidden="true"></div><div class="w1-stijl-cell blue" aria-hidden="true"></div>
      <div class="w1-stijl-cell yellow"><p>Horizontal. Vertical. Essential.</p>${action('VIEW COMPOSITION', 'De Stijl composition opened', 'w1-stijl-action')}</div>
    </div>`;
}

function renderFlatDesign(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-flat-design-unit" data-preview-tab="widget">
        <header class="w1-flat-bar"><span>Today</span><b>3 of 4 complete</b></header>
        <ul class="w1-flat-list"><li><i>✓</i> Design review</li><li><i>✓</i> Contrast audit</li><li><i>○</i> Publish notes</li></ul>
        ${action('ADD TASK', 'Flat task added', 'w1-flat-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-flat-design-unit" data-preview-tab="form">
        <h3>Create workspace</h3>
        <label class="w1-flat-field"><span>Name</span><input type="text" value="Pattern Library" /><small>Visible to your team</small></label>
        <label class="w1-flat-field"><span>Color</span><select><option>Accessible blue</option></select></label>
        ${action('CREATE WORKSPACE', 'Workspace created', 'w1-flat-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-flat-design-unit" data-preview-tab="pricing">
        <div class="w1-flat-plan-icon" aria-hidden="true">◆</div>
        <section><span>TEAM</span><strong>$18<small>/seat</small></strong><p>Shared boards · status history · clear permissions</p></section>
        ${action('START TEAM PLAN', 'Team plan selected', 'w1-flat-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-flat-design-unit" data-preview-tab="hero">
      <nav class="w1-flat-nav"><b>PLAIN</b><span>Work · Notes · Calendar</span></nav>
      <div class="w1-flat-hero-icon" aria-hidden="true"><i>✓</i></div>
      <section><span class="w1-flat-kicker">EVERY ACTION LOOKS ACTIONABLE</span><h2>Simple surfaces.<br />Clear signifiers.</h2><p>Flat controls with borders, labels and visible states.</p></section>
      ${action('OPEN BOARD', 'Flat board opened', 'w1-flat-action')}
    </div>`;
}

function renderConstructivist(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-constructivist-unit" data-preview-tab="widget">
        <div class="w1-construct-dial"><strong>84</strong><span>UNITS READY</span></div>
        <div class="w1-construct-report"><b>SHIFT 03</b><p>OUTPUT +21%<br />CREWS 12<br />PRESS 04</p></div>
        ${action('ISSUE REPORT', 'Production report issued', 'w1-construct-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-constructivist-unit" data-preview-tab="form">
        <h3>SUBMIT THE MESSAGE</h3><span class="w1-construct-slash">/ / /</span>
        <label class="w1-construct-field">SLOGAN<input type="text" value="BUILD THE COMMON FUTURE" /></label>
        <label class="w1-construct-field">DISTRICT<select><option>NORTH PRESS / 04</option></select></label>
        ${action('SEND TO PRESS', 'Message sent to press', 'w1-construct-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-constructivist-unit" data-preview-tab="pricing">
        <div class="w1-construct-edition"><b>EDITION A</b><strong>25</strong><span>POSTERS / MONTH</span></div>
        <div class="w1-construct-ray" aria-hidden="true"></div>
        ${action('JOIN THE PRESS', 'Press edition selected', 'w1-construct-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-constructivist-unit" data-preview-tab="hero">
      <div class="w1-construct-disc" aria-hidden="true"></div><div class="w1-construct-beam" aria-hidden="true"></div>
      <span class="w1-construct-index">№ 04 / NEW WORK</span>
      <h2>DESIGN<br />MOVES<br />PEOPLE</h2>
      <p>Type, signal and structure for collective action.</p>
      ${action('READ THE PROGRAM', 'Constructivist program opened', 'w1-construct-action')}
    </div>`;
}

function renderPunkZine(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-punk-zine-unit" data-preview-tab="widget">
        <header class="w1-punk-stamp">TONIGHT / DOOR COUNT</header>
        <div class="w1-punk-stats"><span><b>187</b> IN</span><span><b>43</b> ZINES</span><span><b>09</b> BANDS</span></div>
        <p class="w1-punk-note">NO SPONSORS // ALL AGES // COPY IT</p>
        ${action('STAMP UPDATE', 'Zine count stamped', 'w1-punk-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-punk-zine-unit" data-preview-tab="form">
        <h3><span>SEND</span> YOUR <em>NOISE</em></h3>
        <label class="w1-punk-field">BAND / COLLECTIVE<input type="text" value="PAPER STATIC" /></label>
        <label class="w1-punk-field crooked">FORMAT<select><option>ONE-PAGE MANIFESTO</option></select></label>
        ${action('XEROX THIS', 'Submission copied', 'w1-punk-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-punk-zine-unit" data-preview-tab="pricing">
        <section class="w1-punk-issue"><span>ISSUE 06</span><strong>PAY WHAT<br />YOU CAN</strong><p>12 copies · staples · postage scars</p></section>
        <div class="w1-punk-halftone" aria-hidden="true"></div>
        ${action('GET THE BUNDLE', 'Zine bundle requested', 'w1-punk-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-punk-zine-unit" data-preview-tab="hero">
      <div class="w1-punk-ransom" aria-hidden="true"><span>NO</span><span>MORE</span><span>POLISH</span></div>
      <p class="w1-punk-kicker">XEROX CULTURE / ISSUE 06 / FREE TO COPY</p>
      <h2>PAPER<br />STATIC</h2>
      <p>Flyers, field notes and loud ideas from the basement press.</p>
      ${action('READ THE ISSUE', 'Punk issue opened', 'w1-punk-action')}
    </div>`;
}

function renderMaterial(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-material-design-unit" data-preview-tab="widget">
        <header class="w1-material-appbar"><b>Workspace health</b><span>Live</span></header>
        <div class="w1-material-kpis"><article><small>ACTIVE</small><strong>1,248</strong><i>+8.4%</i></article><article><small>SYNC</small><strong>98.6%</strong><i>Stable</i></article></div>
        ${action('VIEW REPORT', 'Material report opened', 'w1-material-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-material-design-unit" data-preview-tab="form">
        <h3>New project</h3>
        <label class="w1-material-field"><span>Project name</span><input type="text" value="Surface study" /></label>
        <label class="w1-material-field"><span>Access</span><select><option>Design team</option></select></label>
        <div class="w1-material-form-actions">${action('CANCEL', 'Material form cancelled', 'w1-material-text-action')}${action('CREATE', 'Material project created', 'w1-material-action')}</div>
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-material-design-unit" data-preview-tab="pricing">
        <header class="w1-material-plan-head"><span>STUDIO</span><b>Recommended</b></header>
        <strong class="w1-material-price">$32<small>/month</small></strong>
        <ul><li>Three elevation levels</li><li>Shared state history</li><li>Accessible components</li></ul>
        ${action('START STUDIO', 'Material Studio selected', 'w1-material-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-material-design-unit" data-preview-tab="hero">
      <nav class="w1-material-appbar"><b>Paperwork</b><span>Projects · Activity</span></nav>
      <section class="w1-material-hero-card"><small>DESIGN OPERATIONS</small><h2>Give every surface a reason.</h2><p>Clear hierarchy, useful state and restrained elevation.</p>${action('EXPLORE SYSTEM', 'Material system opened', 'w1-material-action')}</section>
      <button class="w1-material-fab" type="button" aria-label="새 프로젝트" data-mock-action="toast" data-mock-msg="New material project">+</button>
    </div>`;
}

function renderLiquidGlass(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-liquid-glass-unit" data-preview-tab="widget">
        <div class="w1-liquid-content"><span>OCEAN CURRENT</span><strong>18.4<small> km/h</small></strong><i class="w1-liquid-plot"></i></div>
        <div class="w1-liquid-control"><b>Depth lens</b><span>420 m</span>${action('REFRAME', 'Liquid lens reframed', 'w1-liquid-action')}</div>
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-liquid-glass-unit" data-preview-tab="form">
        <div class="w1-liquid-backdrop-copy"><span>Route 04</span><h3>Coastal survey</h3><p>Map content remains solid beneath the controls.</p></div>
        <div class="w1-liquid-form-panel"><label>DESTINATION<input type="text" value="Moraine inlet" /></label><label>VIEW<select><option>Focus route</option></select></label>${action('SAVE ROUTE', 'Liquid route saved', 'w1-liquid-action')}</div>
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-liquid-glass-unit" data-preview-tab="pricing">
        <section class="w1-liquid-price-content"><span>CONTENT LAYER</span><h3>Navigator Pro</h3><p>Offline maps · contrast backplates · spatial controls</p></section>
        <aside class="w1-liquid-price-control"><strong>$24</strong><small>/month</small>${action('ACTIVATE', 'Liquid plan activated', 'w1-liquid-action')}</aside>
      </div>`;
  }
  return `
    <div class="mockup-unit w1-liquid-glass-unit" data-preview-tab="hero">
      <div class="w1-liquid-scene"><span>FIELD NOTE 08</span><h2>See the content.<br />Feel the controls.</h2><p>Functional glass floats only where navigation needs it.</p></div>
      <nav class="w1-liquid-dock" aria-label="프리뷰 탐색"><button type="button" data-mock-action="toast" data-mock-msg="Previous lens">←</button><span>08 / 12</span>${action('OPEN FIELD', 'Liquid field opened', 'w1-liquid-action')}</nav>
    </div>`;
}

function renderArtDeco(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-art-deco-unit" data-preview-tab="widget">
        <header class="w1-deco-crown"><i></i><span>NIGHT INDEX</span><i></i></header>
        <div class="w1-deco-gauges"><article><strong>82</strong><span>OCCUPANCY</span></article><article><strong>14</strong><span>EVENTS</span></article><article><strong>96</strong><span>RATING</span></article></div>
        ${action('OPEN LEDGER', 'Deco ledger opened', 'w1-deco-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-art-deco-unit" data-preview-tab="form">
        <div class="w1-deco-form-frame"><span>RESERVATIONS</span><h3>AN EVENING<br />ABOVE THE CITY</h3><label>PARTY<input type="number" value="2" /></label><label>HOUR<select><option>20:30</option></select></label>${action('RESERVE TABLE', 'Deco table reserved', 'w1-deco-action')}</div>
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-art-deco-unit" data-preview-tab="pricing">
        <div class="w1-deco-sunburst" aria-hidden="true"></div>
        <section class="w1-deco-membership"><span>THE GOLD KEY</span><strong>120<small> / YEAR</small></strong><p>Salon access · priority tables · private programme</p>${action('CLAIM THE KEY', 'Gold key claimed', 'w1-deco-action')}</section>
      </div>`;
  }
  return `
    <div class="mockup-unit w1-art-deco-unit" data-preview-tab="hero">
      <div class="w1-deco-fan" aria-hidden="true"><i></i><i></i><i></i></div>
      <span class="w1-deco-era">MACHINE AGE / 1929</span>
      <h2>THE<br />MIDNIGHT<br />SALON</h2><p>Geometry, rhythm and a precise measure of gold.</p>
      ${action('ENTER THE SALON', 'Deco salon opened', 'w1-deco-action')}
    </div>`;
}

function renderPsychedelic(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-psychedelic-poster-unit" data-preview-tab="widget">
        <div class="w1-psych-orbit"><span>LIVE</span><strong>68<small>%</small></strong><i>CAPACITY</i></div>
        <div class="w1-psych-lineup"><b>ROOM A</b><span>19:30 / LUMEN CHOIR</span><span>21:10 / ORBITAL MOSS</span></div>
        ${action('SHIFT THE LINEUP', 'Psychedelic lineup shifted', 'w1-psych-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-psychedelic-poster-unit" data-preview-tab="form">
        <h3>ADD YOUR<br />FREQUENCY</h3>
        <label class="w1-psych-field">ACT<input type="text" value="VELVET SIGNAL" /></label>
        <label class="w1-psych-field">STAGE<select><option>PRISM ROOM</option></select></label>
        ${action('BEND THE POSTER', 'Poster entry submitted', 'w1-psych-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-psychedelic-poster-unit" data-preview-tab="pricing">
        <div class="w1-psych-ticket"><span>THREE NIGHTS</span><strong>72</strong><small>ALL ROOMS / ALL LIGHT</small></div>
        <div class="w1-psych-waves" aria-hidden="true"><i></i><i></i><i></i></div>
        ${action('TAKE THE TRIP', 'Festival pass selected', 'w1-psych-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-psychedelic-poster-unit" data-preview-tab="hero">
      <div class="w1-psych-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <span class="w1-psych-date">FRI 18 — SUN 20 / DOORS AT DUSK</span>
      <h2><span>WAVE</span><span>FORM</span><span>WEEKEND</span></h2>
      <p>Three rooms of sound, light and collective motion.</p>
      ${action('SEE THE PROGRAM', 'Psychedelic program opened', 'w1-psych-action')}
    </div>`;
}

function renderArtNouveau(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-art-nouveau-unit" data-preview-tab="widget">
        <div class="w1-nouveau-vine left" aria-hidden="true"></div>
        <section class="w1-nouveau-almanac"><span>BOTANICAL ALMANAC</span><h3>August growth</h3><div><b>18</b><small>new leaves</small><b>07</b><small>blooms</small></div>${action('OPEN JOURNAL', 'Botanical journal opened', 'w1-nouveau-action')}</section>
        <div class="w1-nouveau-vine right" aria-hidden="true"></div>
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-art-nouveau-unit" data-preview-tab="form">
        <fieldset class="w1-nouveau-fieldset"><legend>ATELIER COMMISSION</legend><label>YOUR NAME<input type="text" value="Evelyn Hart" /></label><label>OBJECT<select><option>Botanical bookplate</option></select></label>${action('SEND COMMISSION', 'Atelier commission sent', 'w1-nouveau-action')}</fieldset>
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-art-nouveau-unit" data-preview-tab="pricing">
        <div class="w1-nouveau-bud" aria-hidden="true"></div>
        <section class="w1-nouveau-patron"><span>SEASONAL PATRON</span><strong>48<small> / quarter</small></strong><p>Four folios · studio letters · seed archive</p>${action('BECOME A PATRON', 'Nouveau patron plan selected', 'w1-nouveau-action')}</section>
      </div>`;
  }
  return `
    <div class="mockup-unit w1-art-nouveau-unit" data-preview-tab="hero">
      <div class="w1-nouveau-frame" aria-hidden="true"><i></i><i></i></div>
      <span class="w1-nouveau-kicker">THE LIVING LINE / VOL. IV</span>
      <h2>AN ATLAS<br />OF QUIET<br />GROWTH</h2><p>Essays and field notes framed by the garden.</p>
      ${action('ENTER THE ATLAS', 'Art Nouveau atlas opened', 'w1-nouveau-action')}
    </div>`;
}

function renderRisograph(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-risograph-unit" data-preview-tab="widget">
        <header class="w1-riso-header"><span>PRESS QUEUE</span><b>DRUM 02</b></header>
        <ol class="w1-riso-queue"><li><i class="pink"></i><span>FIELD NOTES</span><b>120</b></li><li><i class="teal"></i><span>SHOW FLYER</span><b>080</b></li><li><i class="over"></i><span>MAP FOLD</span><b>060</b></li></ol>
        ${action('START NEXT RUN', 'Risograph run started', 'w1-riso-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-risograph-unit" data-preview-tab="form">
        <div class="w1-riso-registration"><i class="pink"></i><i class="teal"></i></div>
        <h3>BUILD A PRINT RUN</h3>
        <label class="w1-riso-field">TITLE<input type="text" value="COMMON GROUND" /></label><label class="w1-riso-field">INKS<select><option>FLUORO PINK + TEAL</option></select></label>
        ${action('MAKE MASTERS', 'Riso masters prepared', 'w1-riso-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-risograph-unit" data-preview-tab="pricing">
        <section class="w1-riso-run"><span>TWO-COLOR RUN</span><strong>100<small> copies</small></strong><p>A3 fold · uncoated stock · two stencil masters</p></section>
        <div class="w1-riso-dots" aria-hidden="true"></div>
        ${action('BOOK THE PRESS', 'Risograph press booked', 'w1-riso-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-risograph-unit" data-preview-tab="hero">
      <div class="w1-riso-overprint" aria-hidden="true"><span class="pink">RISO</span><span class="teal">RISO</span></div>
      <span class="w1-riso-edition">EDITION 03 / TWO INKS / 100 COPIES</span>
      <h2>COMMON<br />GROUND</h2><p>Independent stories printed one bright layer at a time.</p>
      ${action('READ THE EDITION', 'Riso edition opened', 'w1-riso-action')}
    </div>`;
}

function renderMetro(tab) {
  if (tab === 'widget') {
    return `
      <div class="mockup-unit w1-metro-interface-unit" data-preview-tab="widget">
        <header class="w1-metro-title">activity</header>
        <div class="w1-metro-widget-tiles"><article class="blue"><strong>08</strong><span>projects</span></article><article class="orange"><strong>24</strong><span>updates</span></article><article class="wide"><b>96%</b><span>team rhythm</span></article></div>
        ${action('SEE ALL ACTIVITY', 'Metro activity opened', 'w1-metro-action')}
      </div>`;
  }
  if (tab === 'form') {
    return `
      <div class="mockup-unit w1-metro-interface-unit" data-preview-tab="form">
        <header class="w1-metro-title">new board</header>
        <div class="w1-metro-form-tiles"><label class="blue">NAME<input type="text" value="city signals" /></label><label class="orange">COLOR<select><option>signal orange</option></select></label></div>
        ${action('CREATE BOARD →', 'Metro board created', 'w1-metro-action')}
      </div>`;
  }
  if (tab === 'pricing') {
    return `
      <div class="mockup-unit w1-metro-interface-unit" data-preview-tab="pricing">
        <header class="w1-metro-title">choose a track</header>
        <section class="w1-metro-price-tile blue"><span>STUDIO</span><strong>24<small>/mo</small></strong><p>Unlimited panorama · live tiles · team history</p></section>
        ${action('START STUDIO', 'Metro Studio selected', 'w1-metro-action')}
      </div>`;
  }
  return `
    <div class="mockup-unit w1-metro-interface-unit" data-preview-tab="hero">
      <header class="w1-metro-title">design moves</header>
      <div class="w1-metro-panorama"><section class="blue"><span>01</span><h2>content<br />before chrome</h2></section><section class="orange"><b>LIVE</b><p>Open work<br />Open motion</p></section><section class="slate"><span>→</span></section></div>
      ${action('PAN FORWARD', 'Metro panorama advanced', 'w1-metro-action')}
    </div>`;
}

export const WAVE_1_RENDERER_DEFINITIONS = Object.freeze([
  defineRenderer('bauhaus-geometry', renderBauhaus),
  defineRenderer('de-stijl', renderDeStijl),
  defineRenderer('flat-design', renderFlatDesign),
  defineRenderer('constructivist', renderConstructivist),
  defineRenderer('punk-zine', renderPunkZine),
  defineRenderer('material-design', renderMaterial),
  defineRenderer('liquid-glass', renderLiquidGlass),
  defineRenderer('art-deco', renderArtDeco),
  defineRenderer('psychedelic-poster', renderPsychedelic),
  defineRenderer('art-nouveau', renderArtNouveau),
  defineRenderer('risograph', renderRisograph),
  defineRenderer('metro-interface', renderMetro)
]);
