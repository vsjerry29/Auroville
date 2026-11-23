# AUROVILLE — THE WORLD YOU DRAW
## Illustrated Interactive Experience — Master Creative, Storytelling & Production Blueprint (V4)

**Document status:** Production planning specification  
**Date:** 23 November 2026  
**Audience:** Google Antigravity implementation team / creative-development agent  
**Supersedes:** V1, V2, and V3 concept prompts wherever they conflict with this document  
**Existing project:** Continue the current V3 codebase; do **not** initialize a replacement project  
**Document owner:** Project creative direction  

---

## 0. Read this before touching the website

This is a **creative specification**, not a command to implement 120 effects in one pass. Read the whole file, inspect the existing local code, and follow the phase gates in §15. The 120-item interaction register (§9) is the full experience inventory: **every item must have a planned owner and validation criterion, but only the approved milestone's items should be built at that milestone**. Avoid rushing through all 12 chapters at low quality.

### Decisions already made

1. **Preserve the existing V3 hero's successful core composition.** Improve only what is needed to connect it to the new experience. Do not throw away the hero and start from a generic blank landing page.
2. **Rebuild Scene 02 completely.** Its current background imagery is poor resolution, the Matrimandir crop has been problematic, and the handoff is not convincing. Use a multi-layer, high-resolution original illustration rather than upscaling that background.
3. **The final experience is illustration-led throughout.** No Google-sourced visitor-facing photographs and no random stock photos in the finished 12-chapter experience. Original illustrations may be informed by reference photography, but must not masquerade as documentary photography.
4. **Not everything should look like monochrome pencil.** Use a unified mixed-technique illustration family: graphite, fine ink, selective colored-pencil/earth pigments, controlled wash, paper relief, editorial typography, and large-scale illustrated environments.
5. **The website is mainly about interaction, not primarily an information site about Auroville.** Auroville provides the visual and conceptual foundation. Every major interaction must advance the underlying illustrated story.
6. **No forced 3D, shiny spheres, arbitrary particle effects, default 3D cards, chaotic physics or generic demo gimmicks.** CSS, SVG, Canvas 2D, and GSAP are the foundation. Add specialized rendering only if a measured and compelling visual requirement genuinely demands it.
7. **Art direction before animation.** Approve a static keyframe for each major scene and three key frames for each signature transition before orchestrating motion.
8. **Natural scrolling must stay natural.** No scroll-jacking, mandatory snapping, excessive empty pin distances, or interactions that trap a user.
9. **Local implementation is the source of truth.** Inspect the current Antigravity workspace, local screenshots and recordings. Do not assume a publicly deployed site contains the latest work.
10. **Never claim a tool generated an image, a test passed, or a build completed unless the tool actually did so.** Record limitations explicitly.

### The one-line creative brief
> A single hand-drawn mark escapes the page, grows into an illustrated living world, and invites each visitor to leave a mark of their own.

**Success is not “120 animations present.” Success is a memorable, polished, coherent experience with many discoverable interactions, deliberate visual rhythm, and exceptional illustration quality.**

---

## 1. Current-project baseline and corrective audit

The existing V3 implementation was reported by Antigravity to have four scenes, generated artwork, documentation, Playwright captures, and a local build. That report is **not visual approval**. The user approved the general hero direction but disliked low-quality image assets and especially the second scene's blurry/poor background. Preserve the locally functioning code and investigate existing asset provenance before replacing it.

### Problems carried forward from the prior screen-recording review

| ID | Observed problem / risk | Correction required in V4 | Verification |
|---|---|---|---|
| A01 | Former hero type was too thin / ordinary | Retain the stronger V3 illustrated hero; do not regress to the old thin-serif cover | Opening screenshot at 1440×900 and 390×844 |
| A02 | No distinctive artwork in early V2 direction | Maintain a consistent custom illustration language throughout | Compare hero + all chapter keyframes |
| A03 | Hero image briefly vanished into an empty rectangle | Audit layer/mask/opacity logic and eliminate any asset blanks | Scrub 0→100→0 at slow and fast speeds |
| A04 | Image overlaid on letters like a standard card | Make graphics, drawn forms and type part of one composition | Transition keyframe review |
| A05 | Matrimandir cropped into trees | Use a deliberately art-directed illustration and controlled crop bounds | 1440/1280/tablet/mobile screenshots |
| A06 | Same image repeated without new visual story | New illustrated visual world and distinct chapter compositions | Chapter contact sheet |
| A07 | Scene handoffs felt unrelated | Persistent motifs and measured shared-element geometry | Boundary screenshots, no flash |
| A08 | Archive became ordinary image cards | Replace with illustration-native panels, annotated layers and tactile pages | Scene 03/08 keyframes |
| A09 | A map was mislabeled as a different historical plan | Audit all factual captions; distinguish accurate references from interpretive drawings | Content provenance sheet |
| A10 | Before/after compared unrelated pictures | No unverified then/now claim; use layered conceptual illustration instead | Inspect labels and source notes |
| A11 | Large near-empty interval before gallery | Ensure each scroll state has a deliberately complete composition | Contact sheet at 5–10% scroll intervals |
| A12 | Chapter nav and visible scene index drifted | One authoritative chapter/progress state | Forward/reverse/direct-nav tests |
| A13 | Gallery looked like ordinary cards | Replace with art-directed illustrated interaction rather than grid UI | Static composition review |
| A14 | Headline was accidentally hidden behind images | Explicit stacking hierarchy and readable type zones | Resize and overlap QA |
| A15 | Multiple images became washed-out | Stop using blanket opacity as a transition workaround | Mid-transition screenshots |
| A16 | Ending left one image stranded in blank space | Finish with a composed illustration that leads naturally onward / loops | Last frame review |
| A17 | Developer text appeared in visitor interface | Remove implementation labels, debug tags and milestone language | Full UI text audit |
| A18 | Overall identity felt like disconnected demos | Consistent illustration DNA, line motif, editorial voice and pacing | View full scroll recording without pausing |
| A19 | **New V3 issue:** low-quality Google-sourced visual assets | Replace externally collected final illustrations with locally stored original generated assets | Asset audit: origin, dimensions, rights |
| A20 | **New V3 issue:** Scene 02 background noticeably low resolution | Regenerate in layered high-resolution source artwork, not a resized single image | Examine at native resolution, 100% zoom, 1440/4K |

### First audit deliverables
- `docs/v4/current-site-audit.md`: existing components, scroll states, defects, cause hypotheses, screenshots and proposed repairs.
- `docs/v4/asset-inventory.csv`: existing files, dimensions, source, rights, used-by, keep/replace decision.
- `docs/v4/known-good-hero.md`: exactly what is to be preserved (markup, artwork, typographic placement and interactions).
- A Git branch / checkpoint before major replacement; do not overwrite the only functioning version.

---

## 2. Audience, promise and experience design

**Audience:** design-conscious visitors, people who enjoy visual storytelling and interactive art, and curious visitors unfamiliar with Auroville. No prior knowledge should be required.

**Visitor promise:** the site can be experienced in a straightforward guided scroll, or explored as a playful illustrated world. Interactive moments reward curiosity but are never gates.

**Core metaphor:** One continuous hand-drawn line. It can be a margin rule, a pencil mark, a tree root, a contour, a watercourse, a tool stroke, a path between people, an architectural route, or the visitor's own mark. It is not a permanent thick line following the mouse; it reappears when meaningful.

**Narrative arc:**
1. A mark appears on paper.
2. The paper opens into a world.
3. An idea finds architectural form.
4. The earth becomes fertile.
5. Nature grows.
6. Lines become flowing water.
7. Human hands begin making.
8. The drawings become stories of people.
9. Their connections become a city concept.
10. The concept becomes an atlas to explore.
11. Visitors imagine alternatives.
12. Visitors add a personal line and return to the beginning.

**Copy principles:** fewer words, better chosen. Use scene titles as visual punctuation. No technical buzzwords such as “CHOREOGRAPHY,” “STATE,” “PORTAL ACTIVE,” or “MILESTONE.” Do not fabricate Auroville quotations or invented historical facts. A design interpretation should be labeled as an artistic interpretation where material accuracy matters.

---

## 3. Research references — curated and actionable

### 3.1 Art direction and story experiences
- Vietnamese Conical Hat (https://vnconicalhat.site/)
- The Boat — Matt Huynh (https://www.matthuynh.com/stories/theboat-9rw43)
- Ten Years Away (https://ten.375.studio/en)
- Ponpon Mania (https://ponpon-mania.com/)
- The Symphony of Vines (https://symphonyofvines.unseen.co/)

### 3.2 Technical demonstrations mapped to scenes
- R01: https://tympanus.net/Tutorials/OnScrollPathAnimations/ (Scroll-linked paths)
- R02: https://tympanus.net/Tutorials/ScrollMap/ (SVG map path, directional movement)
- R03: https://tympanus.net/Tutorials/SVGMaskScrollTransition/ (Scroll-driven mask)
- R04: https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
- R05: https://tympanus.net/Development/PageFlipLayout/ (Flat page-turn layout)
- R06: https://tympanus.net/codrops/2017/09/19/organic-shape-morph-ideas/
- R08: https://tympanus.net/Development/ImageRevealHover/
- R09: https://tympanus.net/codrops/2024/04/02/on-scroll-expanding-image-animation-within-typography/
- R11: https://tympanus.net/Development/FullImageReveal/
- R12: https://tympanus.net/codrops/2018/11/12/page-flip-layout/

---

## 4. Art direction bible — fully illustrated, never monotonous

### 4.1 Visual identity
- **Overall feel:** handcrafted editorial illustration, architectural drawing precision, vibrant ecological artwork, playful paper mechanics and elegant typesetting.
- **Illustration consistency:** a coherent drawing hand and texture family across every chapter, with the medium evolving to suit the scene.
- **No photo-as-design shortcuts:** final visible environmental art should be created as original illustration. Reference photos may be used internally for architectural accuracy and composition only.
- **Core palette tokens:**
  - Paper: `#F6F3EB`
  - Warm paper: `#EDE6D8`
  - Ink: `#191917`
  - Graphite: `#5B5751`
  - Earth: `#B75E3F`
  - Forest: `#435A45`
  - Leaf: `#82926A`
  - Gold: `#C39B57`
  - Deep night: `#1F2520`
  - Water: `#718B89`

---

## 5. 120-Item Interaction Register Summary
- 12 Chapters × 10 Interactions each = 120 planned interactions.
- Prioritized: 42 P0 (critical/signature), 43 P1 (supporting), 35 P2 (discoverable).
- Phase 1 focus: CH01–CH03 P0 & P1 interactions.

---

## 6. Implementation Roadmap
- **Phase 0:** Baseline audit, asset inventory, known-good hero, style lock, interaction tracker.
- **Phase 1:** Priority rebuild of CH01–CH03 with multi-layer high-resolution illustrated panorama for CH02.
- **Phase 2:** Illustrated nature (CH04–CH06).
- **Phase 3:** Human & urban chapters (CH07–CH09).
- **Phase 4:** Atlas, visitor creation, finale (CH10–CH12).
- **Phase 5:** Richness pass & full validation.
