import { applyEditorialReview } from './applyEditorialReview.js';

const CATEGORY_COPY = Object.freeze({
  swiss: Object.freeze({
    structure: 'Measured spacing, typographic scale, and alignment carry the hierarchy without decorative effects.',
    benefit: 'A restrained system keeps dense information calm and easy to scan.',
    paletteRoles: Object.freeze([
      'anchors the broadest page field',
      'provides the strongest text or structural contrast',
      'marks the primary signal or action',
      'supports secondary labels and dividers'
    ])
  }),
  brutalism: Object.freeze({
    structure: 'Exposed structure, blunt contrast, and deliberate friction make the interface feel direct rather than polished.',
    benefit: 'The uncompromising visual voice makes campaigns and cultural work immediately recognizable.',
    paletteRoles: Object.freeze([
      'sets the raw background field',
      'draws the heaviest text and outlines',
      'delivers the disruptive primary accent',
      'separates supporting blocks and labels'
    ])
  }),
  depth: Object.freeze({
    structure: 'Light, shadow, translucency, and edge treatment establish a consistent material hierarchy.',
    benefit: 'Material cues help people distinguish controls, containers, and content at a glance.',
    paletteRoles: Object.freeze([
      'establishes the surrounding environment',
      'defines the principal material surface',
      'highlights interactive edges and controls',
      'describes depth through shadow or reflected light'
    ])
  }),
  retro: Object.freeze({
    structure: 'Period-specific type, geometry, and print or screen artifacts shape the composition as one visual system.',
    benefit: 'A clear historical reference gives entertainment and cultural content a memorable point of view.',
    paletteRoles: Object.freeze([
      'sets the period-specific scene',
      'supports the main display surface or type',
      'carries the era-defining accent',
      'adds a secondary print, light, or interface signal'
    ])
  }),
  editorial: Object.freeze({
    structure: 'Type scale, image placement, captions, and whitespace create an intentional reading sequence.',
    benefit: 'The editorial hierarchy gives long-form material room to breathe without losing navigation cues.',
    paletteRoles: Object.freeze([
      'forms the page or gallery backdrop',
      'carries the primary reading surface or text',
      'highlights editorial emphasis and navigation',
      'supports captions, rules, and metadata'
    ])
  }),
  y2k: Object.freeze({
    structure: 'Gloss, pixel detail, chrome, and early-web interface cues are organized around a legible interaction path.',
    benefit: 'The familiar digital nostalgia gives playful products and event experiences an immediate identity.',
    paletteRoles: Object.freeze([
      'sets the nostalgic digital backdrop',
      'defines the main window, panel, or text contrast',
      'powers the brightest interactive accent',
      'adds a secondary glow, badge, or status signal'
    ])
  }),
  hypertech: Object.freeze({
    structure: 'Motion cues, live data, and luminous signals are constrained by a stable information grid.',
    benefit: 'The precise hierarchy makes complex tools feel responsive without hiding their operational state.',
    paletteRoles: Object.freeze([
      'sets the technical operating field',
      'defines the primary panel or data contrast',
      'marks active controls and urgent signals',
      'supports secondary telemetry and depth cues'
    ])
  }),
  soft3d: Object.freeze({
    structure: 'Rounded forms, tactile materials, and gentle motion create a friendly hierarchy with clear control states.',
    benefit: 'The approachable visual language lowers the barrier to everyday tools and playful interactions.',
    paletteRoles: Object.freeze([
      'sets the soft environmental backdrop',
      'defines the main card or tactile surface',
      'highlights the primary playful action',
      'supports secondary shapes, labels, and feedback'
    ])
  })
});

const EN_EDITORIAL_PROFILES = {
  swiss: {
    'swiss-grid': [
      'A precise 12-column grid and neutral sans-serif type organize information with the clarity of Swiss modernism.',
      'Asymmetric columns, strict baselines, and a single red signal create a disciplined reading order.',
      'It suits publications, portfolios, and data-rich products that need an unmistakable hierarchy.',
      'Rigid alignment can feel impersonal, and long labels need careful column planning.'
    ],
    'corporate-minimal': [
      'Trustworthy color, orderly cards, and generous spacing create a contemporary interface for technology and business services.',
      'Quiet blue accents and compact status blocks keep professional workflows composed without looking sterile.',
      'It suits dashboards, account areas, and service sites that must communicate reliability quickly.',
      'Overusing neutral cards can flatten priority and make the product feel interchangeable.'
    ],
    'high-contrast-mono': [
      'Monospaced type and stark contrast give developer tools and terminals a focused, exacting character.',
      'Aligned characters, compact metrics, and one green status color make technical output easy to compare.',
      'It suits consoles, diagnostics, and engineering tools where alignment and state visibility matter.',
      'Dense monospace text tires readers quickly unless line length and contrast are moderated.'
    ],
    'bauhaus-geometry': [
      'Circles, triangles, rectangles, and concise geometric type connect function and form directly.',
      'Primary shapes act as both navigation landmarks and structural modules rather than surface decoration.',
      'It suits cultural programs, learning tools, and product stories built around simple visual systems.',
      'Too many competing shapes can obscure labels and weaken the functional hierarchy.'
    ],
    'de-stijl': [
      'Horizontal and vertical black rules divide asymmetric fields of primary color into a tense but ordered composition.',
      'Red, blue, and yellow planes occupy deliberate proportions while typography stays subordinate to the grid.',
      'It suits portfolios, exhibitions, and focused landing pages that benefit from architectural rhythm.',
      'The restricted palette and rigid axes can constrain image-heavy or continuously changing content.'
    ],
    'flat-design': [
      'Flat color blocks and simple icons regain clear affordances through borders, underlines, and explicit state colors.',
      'Every interactive element changes through shape or contrast instead of relying on simulated material depth.',
      'It suits responsive products that need fast rendering and direct, consistent controls.',
      'Removing too many edge and state cues can make controls indistinguishable from static content.'
    ],
    'ulm-rationalism': [
      'Functional analysis tables and restrained blue-red signals make purpose visible before decoration.',
      'Numbered modules, product facts, and asymmetric blocks turn research into a repeatable interface system.',
      'It suits technical catalogs, public information, and products that must explain how decisions are made.',
      'An overly analytical presentation can distance people when the content needs warmth or emotion.'
    ],
    'swiss-poster': [
      'Oversized sans-serif type and one vivid color field compress event information into a forceful poster.',
      'Cropped headlines and a vertical guide bind dates, venue details, and calls to action into one axis.',
      'It suits launches, performances, and campaigns that need to communicate from a distance.',
      'Large type can crowd narrow screens and requires careful alternatives for long event names.'
    ],
    'dutch-total-design': [
      'Repeatable signs, numbers, and grids unify complex organizational information into one visual system.',
      'Square pictograms and serial identifiers create continuity across sections without relying on ornamental branding.',
      'It suits institutions, transit systems, and large service families that need consistent wayfinding.',
      'A strict identity system needs governance or small local variations will quickly erode its coherence.'
    ],
    'new-wave-typography': [
      'Shifted grids, changing type sizes, angled captions, and irregular spacing turn reading into a visual rhythm.',
      'Stepped headlines deliberately leave the baseline while small copy preserves enough order to recover orientation.',
      'It suits experimental publishing, music, and cultural work that can reward active reading.',
      'Rotated or fragmented text can harm scanning and must not carry essential instructions.'
    ],
    'modular-grid-system': [
      'Regular row and column modules preserve order even as the amount and shape of content changes.',
      'Numbered empty cells expose the layout logic while a key message is allowed to span modules.',
      'It suits dashboards, catalogs, and design systems that must absorb varied content predictably.',
      'A module that is too small creates cramped copy; one that is too large wastes useful space.'
    ],
    'functional-wayfinding': [
      'Directional arrows, route colors, and short verbs make the next action legible from a distance.',
      'Zone numbers and distance labels repeat across signs so people can confirm direction without rereading prose.',
      'It suits transport, campuses, venues, and complex products with location-like navigation.',
      'Color cannot carry direction alone, and translated labels must be tested at the intended viewing distance.'
    ],
    'japanese-ma-minimal': [
      'Empty intervals become hierarchy, giving a single phrase and action an unusually spacious cadence.',
      'A small offset title and a broad neutral field use asymmetry to frame attention rather than fill the screen.',
      'It suits contemplative portfolios, hospitality, and premium content with few competing actions.',
      'Sparse layouts can hide relationships when the product contains many simultaneous tasks.'
    ],
    'scandinavian-functional': [
      'Light wood tones and practical spacing create functionalism that feels useful without becoming cold.',
      'Straightforward cards and a loose shared axis balance domestic warmth with operational clarity.',
      'It suits home, wellness, and public-service products that need a calm and approachable structure.',
      'Muted colors require deliberate contrast checks, especially for secondary text and disabled controls.'
    ],
    'information-isotype': [
      'Repeated people and object symbols pair with fixed quantity units to explain data across language barriers.',
      'Equal-sized pictograms and direct numeric labels make proportions visible without decorative chart effects.',
      'It suits public information, education, and compact comparisons for broad audiences.',
      'Icons must be culturally tested, and large quantities need aggregation to avoid visual counting fatigue.'
    ]
  },
  brutalism: {
    'raw-brutalism': [
      'Default HTML controls, rough outlines, and primary-color clashes create a web design with an openly rebellious stance.',
      'Unstyled inputs, exposed links, and abrupt borders make the browser itself part of the visual language.',
      'It suits manifestos, artist sites, and campaigns that value immediacy over polish.',
      'Native controls vary by browser, and harsh contrast can overwhelm long reading sessions.'
    ],
    'neo-brutalism': [
      'Thick black outlines, bright pastel planes, and hard shadows make every control unmistakably tangible.',
      'Offset shadows and blocky labels turn cards and buttons into bold, toy-like objects.',
      'It suits youthful products, creator tools, and landing pages that need obvious interaction cues.',
      'Heavy borders and shadows become noisy when every element receives the same emphasis.'
    ],
    'cyber-brutalism': [
      'Neon color and system logs collide with rough wireframes to evoke the tension of hacker culture.',
      'Exposed coordinates, clipped panels, and cyan-magenta signals frame the interface as an unfinished machine.',
      'It suits games, music, and speculative technology experiences with a confrontational tone.',
      'Continuous glitch effects and small diagnostic text can reduce readability and motion comfort.'
    ],
    constructivist: [
      'Red, black, and cream diagonals combine with compressed type to form an action-driven poster interface.',
      'Wedges, bars, and cropped photographs direct the eye along a forceful diagonal axis.',
      'It suits campaigns, exhibitions, and editorial stories built around urgency and collective action.',
      'The propagandist tone can overpower neutral content and requires careful cultural context.'
    ],
    'punk-zine': [
      'Photocopier grain, cut-and-paste letters, and torn labels create the anti-authoritarian rhythm of an independent zine.',
      'Uneven baselines and taped fragments make each section feel physically assembled rather than digitally typeset.',
      'It suits music, activism, and personal publishing where a handmade voice matters.',
      'Irregular lettering must not be used for essential instructions or long passages.'
    ],
    'web-brutalism': [
      'Browser-default elements and visible boundaries put content and links ahead of ornamental interface styling.',
      'Blue links, plain buttons, and exposed document flow keep the construction of the page legible.',
      'It suits archives, experimental sites, and information services that prize speed and directness.',
      'Default styling differs across platforms and can look accidental without a deliberate hierarchy.'
    ],
    'anti-design': [
      'Clashing color and intentional imbalance challenge the conventions of smooth, predictable interfaces.',
      'Misaligned blocks, broken rhythm, and competing type scales turn visual discomfort into the central message.',
      'It suits cultural critique, art, and limited campaigns where disruption is the intended experience.',
      'Essential actions still need stable labels and focus order or provocation becomes simple unusability.'
    ],
    'dada-collage': [
      'Cut-out type, geometric scraps, and accidental gaps interrupt a linear reading sequence.',
      'Rotated fragments and abrupt scale changes create an editorial composition driven by chance and juxtaposition.',
      'It suits cultural publishing and storytelling that benefits from surprise and nonlinear discovery.',
      'Fragmented text and random placement can conceal sequence, authorship, and navigation.'
    ],
    'grunge-typography': [
      'Worn capitals and ink bleed build the rough, compact pressure of a music poster.',
      'Distressed letterforms sit against solid information rails so texture does not erase the event details.',
      'It suits concerts, streetwear, and editorial features that need physical grit.',
      'Texture must be reduced around small copy and interactive states to preserve legibility.'
    ],
    'industrial-stencil': [
      'Warehouse markings, hazard stripes, and stenciled numbers bring the discipline of a work site into the interface.',
      'Bolted sections and coded labels organize content like equipment, inventory, and safety instructions.',
      'It suits logistics, manufacturing, and technical storytelling with a rugged operational voice.',
      'Hazard colors should remain reserved for real priority or every panel will appear urgent.'
    ],
    'monochrome-xerox': [
      'Photocopier overexposure, coarse halftones, and black tape preserve the directness of independent print.',
      'One-bit images and uneven toner density separate sections without introducing extra color.',
      'It suits zines, archives, and campaign material that should feel inexpensive and immediate.',
      'Fine detail disappears quickly in photocopy texture, especially on small screens and low-quality displays.'
    ],
    'glitch-brutalism': [
      'Restricted RGB misregistration and broken scan lines disrupt otherwise solid black frames.',
      'Digital errors appear at selected edges and transitions while the content grid remains fixed.',
      'It suits music, games, and technology campaigns that need controlled instability.',
      'Persistent channel shifts can cause eye strain and must respect reduced-motion preferences.'
    ],
    'maximalist-chaos': [
      'Panels, badges, and competing typefaces fill the screen while one heavy action path stays fixed.',
      'Layered clusters use scale and outline weight to distinguish deliberate abundance from random clutter.',
      'It suits festivals, fan communities, and discovery experiences with a large volume of playful content.',
      'Without strict priority and keyboard order, the dense composition becomes difficult to navigate.'
    ],
    'black-metal-editorial': [
      'Black paper, white gothic marks, and sharp divisions create the tension of a dark music editorial.',
      'Dense emblems are contained within clear article bands so imagery and reading structure remain separate.',
      'It suits music releases, archives, and atmospheric cultural publishing.',
      'Decorative lettering and low-light imagery require plain-text alternatives and strong contrast checks.'
    ],
    'concrete-interface': [
      'Heavy gray planes and exposed construction joints translate architectural mass into an information panel.',
      'Recessed seams, stamped numbers, and load-bearing blocks make hierarchy feel physically assembled.',
      'It suits architecture, infrastructure, and industrial products that benefit from a durable tone.',
      'Large gray surfaces can feel oppressive unless spacing and tonal contrast clearly separate tasks.'
    ]
  },
  depth: {
    glassmorphism: [
      'Translucent glass panels and blurred background light reveal a gentle sense of foreground and depth.',
      'Frosted surfaces, thin highlights, and restrained blur separate controls without fully hiding their context.',
      'It suits media, finance, and ambient dashboards where layered context should remain visible.',
      'Text contrast changes with the background, so every panel needs a reliable fallback surface.'
    ],
    neumorphism: [
      'Light and dark shadows drawn from one background color make controls appear softly raised or pressed.',
      'Matched highlights and shadows create tactile states without visible borders or separate card colors.',
      'It suits focused controls, wellness tools, and small interfaces with a calm physical metaphor.',
      'Subtle edges often fail contrast requirements and must be reinforced for focus and disabled states.'
    ],
    skeuomorphism: [
      'Metal knobs, leather panels, and analog gauges are rebuilt with precision inside a contemporary screen layout.',
      'Recognizable physical controls pair with digital labels so the metaphor explains rather than disguises the action.',
      'It suits music, craft, and simulation tools whose real-world controls are already familiar.',
      'Decorative material detail can consume space and mislead people when the digital behavior differs from the object.'
    ],
    'material-design': [
      'Clear surface levels and state layers communicate priority and interaction feedback as a consistent design system.',
      'Cards, sheets, and controls use bounded elevation and motion to explain where content came from.',
      'It suits cross-platform products that need a broad, documented component vocabulary.',
      'Unnecessary elevation creates false hierarchy and makes a familiar system feel generic.'
    ],
    'liquid-glass': [
      'Refraction and lens highlights are limited to controls above content, preserving both depth and context.',
      'Curved translucent controls bend nearby color while the main content plane stays stable and readable.',
      'It suits media and spatial navigation where controls should feel present without covering the scene.',
      'Refraction must never distort labels, and unsupported devices need a simple opaque fallback.'
    ],
    'paper-cut-layers': [
      'Cut edges and stacked color sheets give a flat screen the depth of a small paper stage.',
      'Each layer carries one content level, with short shadows revealing the order of the stack.',
      'It suits education, storytelling, and event interfaces that benefit from handcrafted depth.',
      'Too many layers obscure reading order and increase the visual weight of simple controls.'
    ],
    'acrylic-ui': [
      'Translucent panels softly admit environmental color while opaque content surfaces preserve hierarchy.',
      'Acrylic navigation and flyouts use blur, noise, and edge light to remain distinct from the working canvas.',
      'It suits desktop tools and layered navigation that need context without visual interruption.',
      'Busy backgrounds can defeat the material effect, so contrast and transparency need bounded values.'
    ],
    'mica-surface': [
      'A broad backdrop that lightly reflects the environment organizes long-running work into calm, solid cards.',
      'The environmental tint stays behind content and changes slowly, reducing distraction during extended use.',
      'It suits desktop productivity and settings surfaces that need quiet continuity with the operating environment.',
      'The subtle material difference may disappear on low-quality displays and still needs structural boundaries.'
    ],
    'holographic-foil': [
      'Foil bands and metallic edges suggest color shifts as the viewing angle changes, creating a collectible surface.',
      'Iridescent highlights stay on selected labels and borders while the reading surface remains still.',
      'It suits collectibles, fashion, and premium launches that need a vivid material signature.',
      'Animated spectral color can reduce text contrast and should never be the only state indicator.'
    ],
    'chrome-metal-ui': [
      'Cold highlights, engraved ticks, and solid control knobs give the interface the precision of a metal instrument.',
      'Directional reflections describe curved hardware while flat labels keep measurements easy to read.',
      'It suits audio, automotive, and technical controls that benefit from an engineered feel.',
      'Realistic reflections can imply physical movement that the control does not actually support.'
    ],
    'iridescent-mesh': [
      'A flexible teal-violet mesh against a deep field suggests a digital material that changes with light.',
      'Curved grid lines provide depth and direction while quiet panels hold the operational content.',
      'It suits creative tools, identity work, and atmospheric data experiences.',
      'Complex gradients can band on modest displays and compete with small text or charts.'
    ],
    'isometric-depth': [
      'Blocks stacked at one angle unfold a complex service structure like a navigable map.',
      'Layer colors and consistent axes show containment and dependency without realistic perspective.',
      'It suits architecture, systems, and learning content where spatial relationships explain the model.',
      'Isometric scenes require alternatives when precise labels or keyboard order cannot follow the visual depth.'
    ],
    'low-poly-interface': [
      'A limited set of triangular planes and simple shading creates lightweight three-dimensional form.',
      'Faceted silhouettes carry depth with few tonal steps, leaving controls visually separate from the illustration.',
      'It suits games, maps, and branded tools that need spatial character without photorealism.',
      'Small facets produce noise quickly and can make interactive boundaries hard to distinguish.'
    ],
    'soft-plastic': [
      'Translucent flexible buttons and rounded container forms create friendly, product-like depth.',
      'Soft highlights and compressed edges suggest pliable material while state changes remain visible.',
      'It suits playful utilities, wellness, and consumer products that benefit from tactile reassurance.',
      'Excessive softness can make controls look disabled and must be balanced with firm focus cues.'
    ],
    'embossed-letterpress': [
      'Pressed type and fine paper shading recreate the depth and craft of restrained letterpress printing.',
      'Shallow impressions and ink edges reward close viewing without turning the page into a texture sample.',
      'It suits invitations, heritage brands, and editorial moments where material quality matters.',
      'Embossed detail disappears at small sizes, so essential text needs a clean high-contrast treatment.'
    ]
  },
  retro: {
    memphis: [
      'Bright pastel geometry, zigzags, and scattered shapes bring the playful energy of 1980s Memphis design to the screen.',
      'Triangles, dots, and squiggles float around a simple content block instead of forming a conventional grid.',
      'It suits youth culture, events, and creative products that need an upbeat visual identity.',
      'Uncontrolled decoration can hide controls and make repeated screens tiring.'
    ],
    synthwave: [
      'A neon grid, glowing sunset, and chrome type recreate the futuristic nostalgia of 1980s electronic music.',
      'Perspective lines pull attention toward a bright horizon while interface panels stay close to the foreground.',
      'It suits games, music, and nightlife experiences built around speed and cinematic atmosphere.',
      'Glow and saturated magenta can blur small text and should be reduced around operational content.'
    ],
    vaporwave: [
      'Classical statues, low-resolution scan lines, and 1990s desktop windows overlap in a hazy pastel internet dreamscape.',
      'Familiar computer fragments sit beside impossible scale and empty space to create deliberate dislocation.',
      'It suits music, art, and nostalgic digital stories that invite slow exploration.',
      'Irony and visual fragmentation can confuse practical tasks unless navigation remains conventional.'
    ],
    'art-deco': [
      'A central axis, stepped frames, and sunbursts in black, cream, and gold evoke the ornament of the machine age.',
      'Repeated vertical lines and fan geometry frame content with formal symmetry and controlled luxury.',
      'It suits hospitality, culture, and premium events that need theatrical elegance.',
      'Fine metallic rules lose clarity on small screens and can crowd long titles.'
    ],
    'psychedelic-poster': [
      'Warped display type, repeating optical curves, and intense complements reinterpret the density of counterculture posters.',
      'Letterforms merge with flowing fields while a plain information strip preserves dates and venue details.',
      'It suits festivals, exhibitions, and music releases that can reward visual immersion.',
      'Distorted type must not carry essential instructions, and vibrating colors need contrast checks.'
    ],
    'mid-century-modern': [
      'Simple organic shapes, muted furniture colors, and clear type express an optimistic culture of everyday living.',
      'Tapered forms and open composition balance playful illustration with practical product information.',
      'It suits home, food, and lifestyle products that need warmth without excess ornament.',
      'Period styling can become generic nostalgia if content and imagery do not support the reference.'
    ],
    'atomic-age': [
      'Starbursts, atomic orbits, and boomerang shapes turn postwar scientific optimism into a lively interface.',
      'Orbiting accents surround compact content modules without interrupting their reading order.',
      'It suits science education, entertainment, and retro-futurist campaigns with an upbeat tone.',
      'Small orbit lines and decorative particles can clutter responsive layouts.'
    ],
    'pop-art-halftone': [
      'Heavy outlines, print halftones, and speech-bubble messages create the immediacy of mass media and comics.',
      'Primary panels behave like comic frames, using scale and caption shapes to sequence actions.',
      'It suits campaigns, retail, and entertainment that need fast, expressive communication.',
      'Halftone texture can interfere with text and should stay away from dense information.'
    ],
    'op-art': [
      'Repeating black-and-white lines and one signal color create the tension of a moving flat plane.',
      'Optical patterns are confined to bounded fields while controls remain on stable backgrounds.',
      'It suits exhibitions, identity work, and focused experiments in visual perception.',
      'Dense patterns can trigger discomfort and require a low-motion, low-frequency alternative.'
    ],
    'space-age': [
      'Capsules, orbital paths, and domed panels imagine the optimistic domestic future of the space age.',
      'Rounded modules connect like a compact habitat, with status lights standing in for mechanical controls.',
      'It suits science, mobility, and playful product concepts that benefit from retro futurism.',
      'Too many rounded enclosures can blur grouping and make the layout feel like a themed prop.'
    ],
    'disco-glam': [
      'Reflections from a mirror ball and gold display type emphasize nightlife, performance, and spectacle.',
      'Radial light fragments converge on the primary event or product card while supporting copy stays dark and still.',
      'It suits fashion, music, and event promotions that need celebratory energy.',
      'Sparkle and reflection effects can overwhelm labels and must respect reduced-motion settings.'
    ],
    'seventies-groovy': [
      'Overlapping wave type and earthy orange and olive tones create a relaxed, rhythmic 1970s editorial mood.',
      'Soft bands and rounded letterforms connect headlines to image panels in a continuous flow.',
      'It suits food, music, and lifestyle stories that call for warmth and informality.',
      'Bulbous display type loses legibility quickly in long words and small controls.'
    ],
    'eighties-new-wave': [
      'Diagonals, waveforms, and broadcast captions recreate the fast asymmetric rhythm of 1980s graphics.',
      'Slanted blocks cross a stable caption rail, combining television energy with an editorial sequence.',
      'It suits media, music, and fashion content that needs a sharp, energetic cadence.',
      'Competing angles can disrupt scanning unless body copy and controls share one stable axis.'
    ],
    'retro-computing': [
      'A green CRT field, pixel windows, and memory addresses revive the tool-like character of early personal computers.',
      'Monospaced commands and bounded bitmap panels expose system state with minimal ornament.',
      'It suits developer culture, games, and interactive history where procedural feedback matters.',
      'Scan lines and phosphor glow reduce readability when applied to long text.'
    ],
    'pulp-comic': [
      'Strong primary colors, rough paper, and diagonal panels deliver the action and suspense of serialized pulp comics.',
      'Caption boxes and angled frames move the reader through a dramatic sequence of scenes.',
      'It suits games, entertainment, and narrative campaigns that need immediate momentum.',
      'Dramatic framing can exaggerate routine actions and leaves little room for dense explanatory copy.'
    ]
  },
  editorial: {
    'high-fashion': [
      'High-contrast serif headlines and black, ivory, and champagne tones create the controlled tension of a fashion editorial.',
      'Large image fields, narrow captions, and sharp changes in scale give each product a deliberate entrance.',
      'It suits fashion, beauty, and premium storytelling that depends on image-led pacing.',
      'Fine type and pale accents need stronger alternatives for small screens and low-contrast images.'
    ],
    'fluid-organic': [
      'Warm clay tones and soft organic curves give wellness and lifestyle content an easy, welcoming character.',
      'Rounded color fields guide the eye between text and imagery without enclosing every item in a card.',
      'It suits wellness, food, and community products that need warmth and gentle movement.',
      'Loose shapes can weaken alignment when the interface contains tables or precise comparisons.'
    ],
    'dark-minimal-glass': [
      'A deep navy field, fine blue edges, and restrained translucent panels sharpen focus in low-light settings.',
      'Glass is limited to navigation and summary panels while operational content remains opaque and stable.',
      'It suits media, monitoring, and premium tools designed for sustained nighttime use.',
      'Dim secondary text and thin borders must be tested on displays with weak black levels.'
    ],
    'art-nouveau': [
      'Whiplash curves drawn from plant stems wrap content in tall ornamental frames.',
      'Floral lines guide the reading path around a calm central article rather than filling every gap.',
      'It suits culture, hospitality, and heritage stories that benefit from graceful illustration.',
      'Intricate borders consume narrow-screen space and should never cross labels or focus outlines.'
    ],
    risograph: [
      'Two or three spot colors, halftone screens, and slight plate misregistration remain visible on a paper ground.',
      'Overprinted shapes create new colors at intersections while type stays on a clean ink layer.',
      'It suits independent publishing, posters, and cultural programs that value print character.',
      'Fine text and subtle images can disappear in coarse halftones or simulated ink overlap.'
    ],
    'newspaper-broadsheet': [
      'A heavy masthead, multi-column stories, breaking-news bands, and edition numbers form a dense digital broadsheet.',
      'Headlines, decks, bylines, and rules create a strict hierarchy across simultaneous stories.',
      'It suits newsrooms, research digests, and information hubs with frequent updates.',
      'Dense columns collapse poorly on narrow screens unless stories receive a clear mobile sequence.'
    ],
    'literary-journal': [
      'Long-form serif text, broad margins, and restrained footnotes keep attention on reading and reflection.',
      'A quiet title scale and measured line length allow essays and annotations to share one page.',
      'It suits essays, criticism, and archival writing that rewards sustained reading.',
      'Generous whitespace can make navigation feel distant when readers need to move between many sections.'
    ],
    'academic-modern': [
      'Abstracts, charts, and notes are divided into a clear hierarchy that exposes both findings and evidence.',
      'Numbered figures and direct labels connect claims to supporting material without decorative chart treatment.',
      'It suits research, policy, and technical publishing where traceability matters.',
      'Compressed citations and charts require responsive alternatives instead of simple scaling.'
    ],
    'archival-museum': [
      'Object numbers, dates, collection data, and a broad image field present historical context with restraint.',
      'Catalog labels stay visually separate from the artifact so provenance can be scanned without competing with the image.',
      'It suits museums, archives, and collection browsers that depend on precise metadata.',
      'Neutral presentation can conceal uncertainty unless missing dates and disputed attribution are stated explicitly.'
    ],
    'photobook-minimal': [
      'One photograph, a short caption, and a page number leave room for image sequence and pacing.',
      'Quiet navigation preserves the rhythm between full-bleed and bordered images without adding a card grid.',
      'It suits portfolios, travel stories, and visual essays where editing is more important than feature density.',
      'Minimal controls can be hard to discover and need clear keyboard and screen-reader labels.'
    ],
    'botanical-editorial': [
      'Pressed specimens, scientific names, collection dates, and seasonal color sit in a careful observation grid.',
      'Fine rules connect each plant image to its taxonomy and field note without turning the page into a table.',
      'It suits nature, education, and catalog content that combines visual beauty with evidence.',
      'Decorative scripts and pale greens can weaken legibility around scientific terms.'
    ],
    'wabi-sabi-paper': [
      'Uneven paper edges, ink-dark whitespace, and asymmetric text preserve material imperfection and quiet.',
      'Texture varies gently across the page while the reading column remains simple and deliberate.',
      'It suits craft, hospitality, and reflective editorial work that values restraint over precision.',
      'Simulated wear should not make controls appear damaged or reduce text contrast.'
    ],
    'collage-magazine': [
      'Photographs, handwritten notes, and torn color paper overlap like material on an editor’s desk.',
      'Pinned fragments and margin annotations create discovery while a consistent article rail preserves sequence.',
      'It suits culture, fashion, and personal storytelling with varied source material.',
      'Overlapping layers can hide ownership, captions, and interactive boundaries.'
    ],
    'typographic-poster': [
      'A single sentence becomes screen-sized type while compact event details restore balance and context.',
      'Cropped letters form the main image, with dates and venue information locked to a small stable block.',
      'It suits announcements and campaigns that can express one strong message at a time.',
      'Long translations can break the composition and require alternate line breaks rather than smaller type.'
    ],
    'luxury-serif-minimal': [
      'Fine serif headlines, small product numbers, and broad cream space create restrained luxury.',
      'Sparse labels and precise alignment let material photography carry most of the emotional weight.',
      'It suits premium retail, hospitality, and portfolios with carefully edited content.',
      'Very light rules and small capitals can become inaccessible when used for essential details.'
    ]
  },
  y2k: {
    'y2k-chrome': [
      'Silver chrome type, rainbow holograms, and oval capsules revive the glossy cyber-pop future imagined in the early 2000s.',
      'Metallic labels and lens-like controls float above a dark field with sharp digital highlights.',
      'It suits fashion, music, and launches that need an unmistakable millennium-era sheen.',
      'Chrome reflections can distort letterforms, and spectral color must not carry state by itself.'
    ],
    'frutiger-aero': [
      'Blue skies, green grass, and translucent water-drop buttons express the digital optimism of the mid-2000s.',
      'Natural imagery sits behind glossy navigation, combining environmental abundance with friendly technology.',
      'It suits sustainability, learning, and consumer experiences that call for cheerful familiarity.',
      'Busy photographic backgrounds and glossy controls need firm text contrast and modern focus states.'
    ],
    'pixel-arcade': [
      'Stepped pixel type, coin and health meters, and horizontal scan lines recreate the control language of an arcade cabinet.',
      'Score blocks and sprite-like buttons make progress and reward visible at a glance.',
      'It suits games, loyalty programs, and playful learning built around short feedback loops.',
      'Pixel fonts become tiring in paragraphs and scan-line effects can obscure small status values.'
    ],
    'early-web': [
      'Blue underlined links, gray rules, and a small visitor badge put information and connection ahead of presentation.',
      'Simple document flow and explicit link states recreate an early web page without hiding navigation.',
      'It suits archives, personal collections, and experimental sites that value direct access.',
      'Historical defaults still need responsive layout, semantic headings, and visible keyboard focus.'
    ],
    'geocities-maximal': [
      'Personal banners, star decorations, tiny link badges, and a guestbook overlap in a maximal fan-page composition.',
      'Independent modules advertise hobbies, updates, and affiliations with deliberately competing styles.',
      'It suits fan communities, personal archives, and playful portfolios with abundant small discoveries.',
      'Crowded decoration can overwhelm navigation and must be reordered into a clear mobile sequence.'
    ],
    'aqua-desktop': [
      'Water-drop buttons, vivid blue window frames, and striped toolbars restore the polished tactility of an early-2000s desktop.',
      'Gel controls and pinstriped chrome distinguish windows, tools, and active selections through material cues.',
      'It suits nostalgic utilities and demonstrations that benefit from obvious, physical controls.',
      'Glossy highlights can hide labels, and desktop window metaphors need adaptation on touch screens.'
    ],
    'luna-desktop': [
      'A blue title bar, green start control, and rounded task panels recreate a friendly personal-computer environment.',
      'Strong color coding separates navigation, active windows, and system actions in a familiar shell.',
      'It suits retro tools and interactive history that needs an approachable desktop metaphor.',
      'Platform-specific symbols can confuse people who do not share the reference.'
    ],
    'web2-gloss': [
      'Rounded action buttons with reflected light and service badges capture the bright optimism of the participatory web.',
      'Gloss and compact icons turn registration, sharing, and community status into prominent controls.',
      'It suits social retrospectives, playful services, and campaigns centered on participation.',
      'Reflection should not reduce button-label contrast or replace pressed and focus states.'
    ],
    'flash-portal': [
      'Radial menus, scene progress, and strong color changes reinterpret an immersive Flash portal as an accessible static structure.',
      'A central navigation hub reveals destinations and progress without requiring an animation timeline.',
      'It suits interactive stories, music, and exhibitions that benefit from spatial navigation.',
      'Radial order must also work linearly for keyboards, screen readers, and narrow screens.'
    ],
    'blogspot-collage': [
      'Sidebar widgets, date stamps, and scrapbook photographs turn personal taste and memory into a blog-like editorial page.',
      'Posts remain chronological while badges, links, and clippings build a recognizable personal environment.',
      'It suits journals, fandom, and creator archives with a strong individual voice.',
      'A crowded sidebar can bury the article and needs a deliberate collapse order on mobile.'
    ],
    'cyber-y2k': [
      'Chrome capsules, electric cyan signals, and wireframe stars on black capture millennium cyber-fashion.',
      'Thin orbital lines and hard metallic controls frame content like a wearable digital accessory.',
      'It suits fashion, games, and music experiences built around a sleek synthetic identity.',
      'Fine cyan lines can disappear on black and should not define controls alone.'
    ],
    'kawaii-pixel-web': [
      'Pixel characters, heart badges, and tiny status windows line up like bright digital stickers on a fan page.',
      'Compact widgets use faces and icons to supplement text without replacing the underlying status label.',
      'It suits communities, collectibles, and playful personal tools with frequent lightweight feedback.',
      'Tiny pixel controls and dense decoration need generous hit targets and plain-language labels.'
    ],
    'scene-core-web': [
      'Neon checks, handwritten headlines, and exaggerated online badges rebuild the fast energy of 2000s scene communities.',
      'Profile fragments and status graphics collide around a stable post and navigation column.',
      'It suits music, youth culture, and community stories that benefit from expressive self-presentation.',
      'High saturation and irregular lettering can overwhelm long reading and important controls.'
    ],
    'mcbling-gloss': [
      'Gold chrome, jewel decorations, and pink gloss express the conspicuous glamour of 2000s pop culture.',
      'Sparkling accessories frame a simple product or profile card as the center of attention.',
      'It suits fashion, entertainment, and celebratory campaigns that embrace visible excess.',
      'Decorative shine can make ordinary actions appear premium or urgent without a real distinction.'
    ],
    'tech-optimism-2000': [
      'Blue digital maps, connected nodes, and affirmative system copy imagine a 2000s future where everyone is online.',
      'Network diagrams and friendly status panels present connectivity as open, useful infrastructure.',
      'It suits technology history, education, and civic concepts that need a hopeful systems view.',
      'Optimistic diagrams should not conceal outages, privacy limits, or unavailable connections.'
    ]
  },
  hypertech: {
    'kinetic-type': [
      'Screen-spanning type bands, rotating and scaling letters, and lime signals create speed through typographic motion.',
      'Moving headlines follow a fixed reading rail so rhythm never removes the primary message.',
      'It suits launches, music, and editorial moments where type itself carries the event.',
      'Motion must stop on request, and essential text needs a stable readable state.'
    ],
    'bento-grid': [
      'Cards of different sizes align to a precise grid and combine mini charts, toggles, and profiles in one modular view.',
      'Large feature cells and compact utility cells share consistent spacing and control geometry.',
      'It suits product homes and dashboards that need to summarize several independent tools at once.',
      'Too many card sizes weaken priority and can produce an awkward reading order on mobile.'
    ],
    'acid-techno': [
      'Fluorescent green and yellow collide with distorted chrome spheres and smile symbols to channel an underground rave poster.',
      'Compressed labels and abrasive symbols orbit one dominant event message on a dark field.',
      'It suits nightlife, fashion, and music campaigns that demand immediate visual impact.',
      'Acid color and warped type must be isolated from schedules, prices, and safety information.'
    ],
    'metro-interface': [
      'Edge-to-edge type and square flat tiles connect in a horizontal panorama that places content before chrome.',
      'Tile size signals priority while typography and imagery occupy the full available surface.',
      'It suits media hubs and touch-first navigation with a limited set of broad destinations.',
      'Wide panoramic flow needs a clear vertical alternative for phones and keyboard navigation.'
    ],
    'cyberpunk-tactical-hud': [
      'Rectangular targeting frames and coordinate, distance, and hazard readings present a tactical scene in cyan and red.',
      'Critical signals attach directly to mapped objects while peripheral telemetry stays visually quieter.',
      'It suits games, simulation, and spatial monitoring where location and threat are central.',
      'Dense overlays can conceal the scene, and color-coded hazards need text and shape equivalents.'
    ],
    'sci-fi-fui': [
      'Segmented circular scanners and diagnostic rails use blue and orange signals to make fictional equipment readable.',
      'Concentric modules connect status, range, and device controls around one stable focal point.',
      'It suits film, games, and speculative prototypes that need an engineered fictional language.',
      'Decorative diagnostics must not imply real precision or obscure the actual control labels.'
    ],
    'terminal-matrix': [
      'Aligned command history, a fixed cursor, and one green signal expose both computation and current input.',
      'Columns preserve command, result, time, and status relationships without graphical containers.',
      'It suits developer tools and diagnostics where traceable text output is the primary interface.',
      'Long unwrapped lines and low-contrast green text quickly become difficult to read.'
    ],
    'data-dense-dashboard': [
      'Metric cards of varied sizes and directly labeled mini charts share a fixed grid for rapid operational comparison.',
      'Values, units, trend, and status appear in the same order across every module.',
      'It suits operations and analytics teams that must compare many live indicators at once.',
      'Density must not remove units, time ranges, or definitions, especially on small screens.'
    ],
    'real-time-monitor': [
      'Live waveforms, a severity-ranked incident queue, and the last update time combine on a calm teal operations screen.',
      'Current state, recent change, and unresolved events remain visible without opening separate panels.',
      'It suits service health, infrastructure, and safety monitoring with continuous updates.',
      'Animation and alerts need rate limits so constant change does not mask a genuinely urgent event.'
    ],
    'chromatic-aberration': [
      'Cyan and pink channel offsets touch only key edges and axes on monochrome data panels, suggesting digital error and speed.',
      'Misregistration highlights selected transitions while body text and values stay sharply aligned.',
      'It suits media and technical identities that need controlled visual distortion.',
      'Color offsets can mimic focus problems and should never affect small text or precise charts.'
    ],
    'generative-grid': [
      'A field of dots, lines, and cells changes density by rule and connects each selection to an explanatory panel.',
      'The visible system shows both its current pattern and the parameters that produced it.',
      'It suits creative coding, simulation, and exploratory data tools where rules are part of the content.',
      'Unbounded animation and dense cell fields can harm performance and keyboard discoverability.'
    ],
    'biometric-interface': [
      'A breathing central ring and orbiting heart rate, oxygen, and recovery values make body state calm and legible.',
      'Each vital sign pairs a number with range and trend instead of relying on an animated pulse alone.',
      'It suits wellness and health-adjacent monitoring where gradual change matters.',
      'Decorative biometric motion must not be mistaken for a medical diagnosis or emergency signal.'
    ],
    'spatial-glass-ui': [
      'A fixed central content window and three translucent control panels preserve focus within a layered spatial scene.',
      'Peripheral panels reveal depth and orientation while the active task remains on one stable plane.',
      'It suits immersive media and spatial prototypes that need persistent context around a focal task.',
      'Depth alone cannot define order; focus, labels, and occlusion behavior need explicit fallbacks.'
    ],
    'ai-native-gradient': [
      'A probability-cloud gradient is separated from evidence and approval panels to clarify generated state and suggested action.',
      'Confidence, source context, and human decision controls remain distinct from the generative visual field.',
      'It suits assisted creation and analysis tools that need to expose uncertainty and review.',
      'A fluid gradient must not imply confidence, completion, or truth without a labeled value.'
    ],
    'quantum-control': [
      'Three state orbits and a fixed measurement point visualize superposition and precise control in a speculative science interface.',
      'Layered paths distinguish possible states from the selected observation without pretending to show a physical object.',
      'It suits science communication and fictional control systems that explore abstract state spaces.',
      'Metaphorical orbital graphics require plain-language explanations to avoid overstating scientific accuracy.'
    ]
  },
  soft3d: {
    claymorphism: [
      'Peach clay cards, deep inner and outer shadows, and springy feedback create the feel of a soft toy.',
      'Rounded masses keep their volume through paired highlights and shadows while labels stay crisp on top.',
      'It suits onboarding, learning, and playful consumer tools that benefit from tactile reassurance.',
      'Heavy volume effects can make controls look decorative and increase visual weight on small screens.'
    ],
    'handcrafted-indie': [
      'Torn paper, translucent masking tape, handwritten notes, and stamps evoke the warm record of a personal studio.',
      'Layered scraps keep visible edges and slight misalignment while the main reading column remains clear.',
      'It suits portfolios, journals, and small brands that need an intimate handmade voice.',
      'Decorative handwriting and overlapping scraps should not carry essential navigation.'
    ],
    'solarpunk-eco': [
      'Golden sunlight, green leaves, and stained-glass energy panels imagine an optimistic future shared by nature and renewable technology.',
      'Organic growth and visible infrastructure occupy the same modular scene instead of appearing as separate themes.',
      'It suits climate education, community projects, and future-facing civic concepts.',
      'Optimistic imagery must not replace concrete impact data or hide environmental tradeoffs.'
    ],
    'inflatable-ui': [
      'Air-filled capsule buttons, soft reflections, and shapes that compress when pressed make actions feel friendly and immediate.',
      'Padded controls change silhouette and shadow together so their pressed state remains unmistakable.',
      'It suits playful utilities, events, and touch-first products with a small set of primary actions.',
      'Oversized inflated controls consume space quickly and need firm text contrast.'
    ],
    'toy-block-ui': [
      'Functional blocks of different colors and heights fit together around numbered studs, making the structure easy to understand.',
      'Each module looks independently movable while shared connection points reveal the larger system.',
      'It suits learning, planning, and modular tools where composition is part of the task.',
      'Block metaphors can imply drag-and-drop behavior that must either exist or be clearly avoided.'
    ],
    'kawaii-pastel': [
      'Small faces, star and heart badges, and pink-blue pastel cards make a personal tool feel calm and approachable.',
      'Expressions supplement status labels while rounded cards keep actions grouped and predictable.',
      'It suits journals, communities, and lightweight productivity tools with frequent positive feedback.',
      'Cute symbols can trivialize serious errors and must never replace explicit status text.'
    ],
    'sticker-book': [
      'Thick white borders, tilted category stickers, and a checked collection board turn choosing and collecting into play.',
      'Each sticker has a distinct silhouette while the board preserves categories and completion state.',
      'It suits collections, learning, and preference tools that reward visible progress.',
      'Tilted labels and overlapping stickers can reduce readability and hit-target clarity.'
    ],
    'doodle-interface': [
      'Hand-drawn arrows, circles, and short notes sit on a tidy input structure, making guidance feel close and personal.',
      'Doodles point toward real controls without replacing their labels, boundaries, or focus states.',
      'It suits tutorials, creative tools, and onboarding that benefits from an informal guide.',
      'Handwritten annotation can become visual noise when every field receives the same treatment.'
    ],
    'papercraft-ui': [
      'Layered color paper and folded corner tabs explain depth and assembly order between steps and functions.',
      'Cut edges and stacked tabs turn navigation into a visible sequence of paper layers.',
      'It suits learning, craft, and step-based flows that need a clear sense of progress.',
      'Complex folds can consume space and should not obscure the current step or back action.'
    ],
    'cozy-knit': [
      'Repeating yarn patterns, a knit-gauge progress bar, and patch-like information cards form a warm everyday dashboard.',
      'Stitch rhythm describes grouping while plain card interiors preserve numeric clarity.',
      'It suits home, wellness, and habit tools that benefit from a comforting material reference.',
      'Fine textile texture can shimmer on screen and should stay away from small copy.'
    ],
    'dreamcore-cloud': [
      'Misty cloud layers, floating door-shaped cards, and quiet direction signs create a familiar but unreal place to explore.',
      'Soft depth hides and reveals destinations gradually while one stable sign preserves orientation.',
      'It suits music, stories, and reflective discovery experiences with a slow pace.',
      'Low contrast and ambiguous signs can make practical navigation feel lost rather than dreamlike.'
    ],
    'kidcore-play': [
      'Primary-color shapes, thick crayon paths, and bouncing number blocks put discovery before rules.',
      'Large forms and direct labels create a playful route that remains understandable without decorative detail.',
      'It suits early learning, family activities, and creative prompts built around exploration.',
      'Bright colors and motion need calm alternatives, and age suitability must not be inferred from style alone.'
    ],
    'biomorphic-soft': [
      'Connected cards shaped like cells and droplets use pulsing selection rings to make data and actions feel as if they are growing.',
      'Organic modules join through visible relationships while each state retains a clear text label.',
      'It suits wellness, ecology, and exploratory data tools that benefit from a living-system metaphor.',
      'Irregular shapes can waste space and make touch targets difficult to predict.'
    ],
    'pastel-gradient': [
      'Broad low-saturation color transitions sit behind crisp single-color task cards and fixed status dots.',
      'Gradient fields provide atmosphere while information remains anchored to stable opaque surfaces.',
      'It suits contemporary productivity and lifestyle products that need softness without losing clarity.',
      'Pale transitions can weaken boundaries and should not encode status without labels.'
    ],
    'cartoon-dashboard': [
      'Bold metric cards, responsive small characters, and speech-bubble help turn everyday data into a short story.',
      'Characters react to labeled values while chart and control geometry stays consistent across states.',
      'It suits habits, finance education, and family tools that benefit from narrative feedback.',
      'Character reactions must not shame people or soften warnings that require direct language.'
    ]
  }
};

function lowercaseInitial(sentence) {
  return `${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
}

export function applyEnglishEditorialReview(catalog) {
  return applyEditorialReview(catalog, EN_EDITORIAL_PROFILES, CATEGORY_COPY, {
    label: 'English',
    characteristics: (record, characteristic, categoryCopy) => [
      characteristic,
      `In ${record.name}, ${lowercaseInitial(categoryCopy.structure)}`,
      `${record.name} keeps this visual grammar consistent across content, controls, and responsive states.`,
      `${record.name} documents its spacing and emphasis rules so the composition can be reproduced.`
    ],
    pros: (record, fit, categoryCopy) => [
      fit,
      `For ${record.name}, ${lowercaseInitial(categoryCopy.benefit)}`,
      `${record.name} can scale to broader production contexts when its hierarchy is preserved.`
    ],
    cons: (record, caution) => [
      caution,
      `Test ${record.name} with narrow viewports, longer copy, and reduced motion before release.`
    ],
    palette: (record, color, index, categoryCopy) => ({
      ...color,
      usage: `${color.name} ${categoryCopy.paletteRoles[index]} in ${record.name}.`
    })
  });
}
