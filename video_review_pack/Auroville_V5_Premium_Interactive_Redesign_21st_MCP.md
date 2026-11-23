# AUROVILLE — V5: THE QUIETLY ALIVE CANVAS
## Premium Interactive Redesign + 21st MCP Integration Blueprint

**Version:** 5.0 · **Date:** 23 November 2026 · **Project:** Existing Auroville V4 Next.js/TypeScript interactive site  
**Purpose:** Correct the actual defects visible in `Screen Recording 2026-11-23 203307.mp4`; refine rather than discard the hero; rebuild the visual interaction language of chapters 02–04; utilize the connected **21st MCP** intelligently; and establish a coherent foundation for chapters 05–12.

> **Source of truth priority:** (1) user's latest feedback and actual video, (2) this V5 addendum for visual and interaction changes, (3) V4 masterplan for narrative and 120-interaction inventory, (4) existing functioning code. Where V5 conflicts with V4, use V5. **Do not reset the project.**

---

# 01 — The desired experience

The site should not read like a presentation deck, design-system demo, or portfolio template. Build an exceptional *illustrated digital environment* with a coherent artist's hand: oversized confident typography; high-fidelity original drawings; material-like backgrounds that **respond to movement**; a small number of delightful direct interactions; and precise, uninterrupted transitions.

**Visual definition:** bold and quiet at the same time. Large typographic and illustrated statements in the foreground. Delicate graphite/earth/topographic behavior in the background. Space should feel intentional, never simply empty. A visitor should be able to scroll smoothly without interacting, but should discover added depth through the cursor, dragging, focus, and touch.

**Not allowed:** excessive dot grids; concentric targeting rings; random decorative plus signs; pointless coordinate labels; repetitive miniature captions; generic glass panels; stock UI animation packs copied verbatim; dashboard cards; forceful 3D; overly large text over landscape; a page in which 100 interactions are all animated at once.

**Acceptance philosophy:** make every finished frame visually compelling. Then make its movement better. The design must be attractive with animations paused.

---

# 02 — Actual current-site audit (grounded in uploaded ~21.87-second video)

Timings below are approximate *video playback positions*, not guaranteed scroll percentages. They help locate the visible symptom; inspect source code and live browser to identify root causes.

| Video | Current visual | Specific issue | Required outcome |
|---|---|---|---|
| `00:00–00:01.6` | Two-line huge **AURO / VILLE**, banyan illustration, seated artisan, Matrimandir study | Strong concept, but cramped by tiny descriptive text, footers, dotted microtexture, oversized concentric construction circles | Keep bold type + authentic drawings; refine hierarchy and spacing; reduce ornamental lines, labels, and duplicated brand copy |
| `00:01.6–00:03.2` | Headline clears; small central building with large radial guide rings | The composition loses its anchor; excessive near-blank cream around a too-small central drawing; concentric guides dominate | Enlarge the meaningful building/illustration and create an unfolding linework-to-landscape transformation; no visual dead zone |
| `00:03.2–00:04.8` | Very narrow image sliver opens along the page edge | Paper reveal begins too abruptly and at a weak scale; first visible opening has overly much empty canvas | Make peel/fold legible: edge, underside, paper thickness/shadow; smoothly expand an illustration while remaining artfully composed |
| `00:04.8–00:06.5` | Illustrated forest and red-earth road with Matrimandir at distance | Art itself is stronger, but largely static after entrance; a big white opaque title panel blocks the landscape | Keep artwork; split into 4–6 usable layers with subtle responsive interactions; replace overlay with small integrated caption; avoid obscuring subject |
| `00:07.2–00:09.6` | CH03 framed architectural plate, smaller thumbnails and paragraph | Looks like technical slides/cards, small main artwork and huge empty areas; small copy and thumbnails compete | Rebuild CH03 as one immersive structural drawing transforming through *three spatial states*; clear graphic hierarchy |
| `00:09.6–00:12.0` | Three horizontal story states with makers drawing and golden disc close-up | Images change but still framed as presentation slides, disconnected from each other | Connect through shared outlines/geometric paths; let graphic drawings grow out of each other, with accurate restrained annotation |
| `00:12.0–00:13.2` | CH03 fades/lightens into CH04 | Transition looks like a pale wash, not a continuous meaningful transformation | Make a visible shared subject: concentric golden-disc outline unrolls into the hanging line, then becomes a topographic contour |
| `00:13.6–00:19.2` | CH04 huge heading and four suspended printed cards | Visually interesting reference but too static for many seconds; oversized title; decorative background circles; four prints act like ordinary cards | Preserve the *idea* of tactile suspended artwork, but recompose and animate the physical relationship, change focal imagery and integrate environmental response |
| `00:19.2–00:21.8` | Soil profile suddenly enlarges full-screen | Zoom/crop is abrupt; no strong new composition or interactive layer after reveal | Use a continuous printed-plate → soil-strata transition, maintain consistent focal geometry and reveal roots/contours with cursor and scroll |

**Additional global audit observations:**

- UI is crowded with plate numbers, chapter IDs, "ACT/SCENE", tiny instructional phrases, the top-right chapter box, brand copy at top, a bottom-left circular `N` marker, progress bar, percentage and bottom-right `SCROLL TO DISCOVER` on essentially every frame. Remove duplicates and make navigation recede.
- Faint dotted field, circular measurement guides and crosshairs are frequent. These look like stock drafting decoration because they do not truly influence the visitor or story. Do **not** replace the dots with a different uniform dotted grid.
- Too many images are presented in white frames with matching shadows/borders. Give each chapter a strong dominant illustration, with smaller details only when necessary.
- The overall implementation is still **chapter-by-chapter slides**. Transitions must be conceived as **one shape changing identity**, not a whole-scene opacity swap.
- The video does not verify direct drag, keyboard interaction, touch, full backward scroll or asset licensing. Do not claim those pass until tested.

---

# 03 — 21st MCP: capabilities, workflow and correct boundaries

The user has connected **21st MCP (formerly Magic MCP)** in **Google Antigravity**. Do not assume the connector is broken or reconnect it unnecessarily. The current official server and documentation are:

- Official overview: <https://21st.dev/mcp>
- Official MCP docs: <https://docs.21st.dev/mcp>
- Official skill guide: <https://github.com/21st-dev/magic-mcp/blob/main/skills/21st-ui/SKILL.md>
- Official install/migration: <https://github.com/21st-dev/magic-mcp/blob/main/llms-install.md>
- MCP HTTP endpoint (only if troubleshooting existing setup): `https://21st.dev/api/mcp`

## 03.1 Mandatory discovery in Antigravity

1. Inspect the **already connected** 21st MCP. Invoke MCP discovery (`tools/list` through the client) and list what **this account** exposes. Do not assume all tools are available on this plan.
2. Check the account's `get_usage`, particularly `aiGenerationEnabled`, **before hosted generation**. If unavailable/disabled, use `search` and `get_component`; do the custom composition coding in Antigravity without circumventing the limit.
3. Prefer current tool names when available: `search`, `get_component`, `get_inspiration`, `generate`, `get_generation`, `get_take`, `get_usage`, `search_logo`. There may be more; trust actual `tools/list`. Old Magic names are compatibility aliases, not additional capabilities.
4. Take inventory of component candidates with screenshots/preview URLs, license, source, dependencies and performance cost. **Search first; do not install every candidate.**
5. Only call `generate` if AI generation is enabled in the account and it appears on `tools/list`; use it for **alternative component compositions** (e.g., navigation overlay or illustrated media reveal), not for unrelated SaaS templates or raster artwork.
6. Use `get_component` to fetch exact, complete component source plus setup requirements before adapting. Keep licensing/attribution where required. Inspect unfamiliar dependencies before installing.
7. If tool supports design exploration (`get_inspiration` or 21st UI explore skill), generate/retrieve **2–3 different art-direction approaches** for *one selected interaction* before choosing; compare previews as real pixels.
8. If the project uses GitHub PRs, optionally investigate **Design Bug Bot** as an additional UI-review gate; it is a separate GitHub workflow and not proof of visual excellence. Do not imply it runs automatically through every MCP call.
9. Do not use `search_logo`, publication tools, components for billing/login, or shader generation unless a real need exists. "Use all features" means **explore and apply every relevant capability**, not clutter the app with the entire catalog.
10. Save all findings to `docs/v5/21st-mcp-evaluation.md`: tool discovery, entitlement checks, candidates, preview links, chosen/rejected components, implementation changes, measured impact, and actual calls made. Never record API keys or secrets.

### Suggested 21st search queries

- `scroll linked svg line drawing interactive background`
- `editorial hero typography subtle cursor responsive background`
- `topographic contour lines cursor reactive react`
- `svg clipping mask hero image transition`
- `scroll morphing illustration background`
- `paper texture animated subtle react`
- `image reveal hover editorial gallery`
- `accessible chapter navigation overlay minimalist`
- `interactive illustration drag to reveal touch`
- `responsive image comparison slider accessible`

## 03.2 Verified 21st components to inspect, not copy blindly

| Component | Verified source | What to take | What to change / reject |
|---|---|---|---|
| **Luminous Topography** | <https://21st.dev/@rmahammad/components/luminous-topography> | SVG/CSS-like contour field that drifts, reacts to pointer and pauses offscreen; lightweight and appropriate | Convert blue neon-on-navy demo to almost imperceptible graphite/terracotta lines on ivory. Use fewer, hand-composed contours, not wallpaper. **Top candidate.** |
| **SVG Follow Scroll** | <https://21st.dev/@reuno-ui/components/svg-follow-scroll> | Scroll-following line/tracer concept; useful for chapter-to-chapter path continuity | Replace default art with our bespoke paths; no always-visible guide line over all content |
| **SVG Clip Path Mask** | <https://21st.dev/@reuno-ui/components/svg-clip-path-mask> | Mask/reveal engineering for the panorama and illustrated plates | Use our silhouettes and masks, not the demo imagery or timing |
| **SVG Shapes (cult/ui)** | <https://21st.dev/@cult-ui/components/svg-shapes> | A technical basis for clean custom vector shapes and controlled linework | Avoid default sacred-geometry wireframes, circles and unrelated diagrams |
| **Background Paper Shaders** | <https://21st.dev/@reuno-ui/components/background-paper-shaders> | Research texture/material behavior if it adds tangible quality | Avoid dark gradients, glossy animation and unnecessary shaders. Static fine-paper texture may be better |
| **Paper Texture** | <https://21st.dev/@paper-design/components/paper-texture> | Optional tactile surface treatment, especially subtle paper variation | Benchmark rendering cost; do not turn the site into a visibly moving shader canvas |
| **Interactive Waves** | <https://21st.dev/@dhileepkumargm/components/interactive-waves> | Interaction mechanics and pointer interpolation | Reject ocean-wave default styling; only adapt gentle contour motion if needed |
| **Spotlight (motion primitives)** | <https://21st.dev/community/components/motion-primitives/spotlight> | Pointer locality/falloff logic | Do not add an obvious glowing circular spotlight |

**Do not select** Dot Grid, Kinetic Grid, Grid Pattern Spotlight, ASCII Wake, random particles, neon waves, or glittering shader effects merely because they are popular. The user explicitly dislikes unnecessary dots, decorative UI and cheap-looking effects.

## 03.3 Limits and integration standards

Search can be available without paid AI generation. Official docs say free tiers have limited source retrievals per day, and hosted generation consumes separate AI credits. Report plan/tool blockers accurately, rather than repeatedly retrying. The MCP/CLI generates **React components**, not necessarily high-quality hand-drawn environment illustrations. Continue producing original image assets with the image generator available in the project, and use SVG/pointer systems for interactivity.

Do **not** replace the app's theme, global layout or existing router with a 21st template. Extract and adapt the *mechanism*, restyle it completely with our design tokens, and verify bundle size, hydration, accessibility and cleanup.

---

# 04 — Design references for subtle interactive backgrounds (actual resources)

Each item must be previewed, studied, then interpreted for the project. They are not UI templates to copy.

1. **Luminous Topography, 21st** — <https://21st.dev/@rmahammad/components/luminous-topography>  
   *Why:* organic contour lines that brighten near the pointer and gracefully pause offscreen.  
   *Our translation:* a warm graphite **land contour / drafting trace** on ivory, low opacity, shaped around empty editorial spaces. This should visually belong to Auroville's terrain and drawing history.

2. **SVG Follow Scroll, 21st** — <https://21st.dev/@reuno-ui/components/svg-follow-scroll>  
   *Why:* paths controlled by scroll position.  
   *Our translation:* a single meaningful line changes from Matrimandir elevation to earth contour to tree root. Do not draw random paths behind every scene.

3. **SVG Clip Path Mask, 21st** — <https://21st.dev/@reuno-ui/components/svg-clip-path-mask>  
   *Why:* controlled outline-to-environment reveals.  
   *Our translation:* the silhouette of a sketch becomes a precise mask revealing the next artwork, without a global opacity wash.

4. **Codrops: On-Scroll Morphing Background Shapes** — <https://tympanus.net/codrops/2017/05/23/on-scroll-morphing-background-shapes/>  
   Source: <https://github.com/codrops/MorphingBackgroundShapes>  
   *Why:* large SVG forms morph with scroll.  
   *Our translation:* keep the background quiet but let one meaningful composition change outline from architecture to geology, never turn it into random blobs.

5. **Codrops: Building Responsive, Scroll-Triggered Curved Path Animations** — <https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/>  
   *Why:* robust measured path curves across responsive layouts.  
   *Our translation:* the single story path follows a precise handoff between hero / CH02 / CH03 rather than a generic progress path.

6. **Codrops: SVG Mask Transitions on Scroll** — <https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/>  
   *Why:* predictable full-screen reveals without conventional fades.  
   *Our translation:* smooth page-fold, print-to-soil, and image-to-drawing transitions with accurate cropping.

7. **Codrops: Scroll-Driven SVG Map Animations** — <https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/>  
   *Why:* progressive path drawings, camera-following and labeled zones.  
   *Our translation:* Auroville-inspired paths/landmarks that respond to exploration, useful later for CH09 and CH10.

8. **Codrops: On-scroll SVG Shapes** — <https://tympanus.net/codrops/2022/06/08/how-to-animate-svg-shapes-on-scroll/>  
   *Why:* scroll-linked vector shape adjustments.  
   *Our translation:* fine graphite elevation/soil-line morphs.

9. **21st.dev Design Bug Bot** — <https://21st.dev/blog/introducing-design-bug-bot>  
   *Why:* catches inconsistent components, typography and mobile design regressions in a GitHub workflow; supplemental QA only.

**The reference library is deliberately not a catalog of neon mouse trails.** Build the backdrop around illustration, depth and story, not gadgets.

---

# 05 — The V5 visual system

## 05.1 Typography

- Keep **AURO / VILLE** as the signature hero, but do not repeat the complete brand wordmark at several locations in the same frame.
- Use bold, well-tracked display lettering and one contrasting small editorial serif for intentional short sentences. Eliminate highly technical/marketing microcopy.
- Max two **meaningful** text elements beyond the major wordmark per opening viewport: one concise main statement and one navigational hint, when needed. Navigation label itself may remain.
- The little line “Where architecture becomes an inner inquiry” is too precious/generic. Replace with a clear short line if one is needed: e.g. `A place still becoming.` or leave the image to speak.
- Remove `ACT I • SCENE 04/04`, `PLATE 04`, `FOUR PLATES HUNG ON LINEN CORD`, `SCROLL TO DISCOVER`, chapter percentages and unexplained `50 YRS` stamps except where genuinely sourced and informative. Never use invented documentary details.
- Hero typography and illustrations should dominate. Never bury readable words behind art.

## 05.2 Backgrounds

**Replace generic dotted/radial decoration with chapter-sensitive interactive backgrounds**:

- **Hero:** faint irregular graphite contour lines inspired by terrain and architectural drafting. A few curves react 2–6px to pointer proximity, and on scroll those lines lead toward the actual building illustration. No grids, dots or giant targeting rings.
- **CH02:** atmospheric illustration layers with genuine foreground/midground motion; very subtle hatching displacement follows the pointer near the main path. Preserve neutral paper space where text needs readability.
- **CH03:** precise structural outlines that progress with scroll from a cutaway drawing to golden surface detail, changing the artwork itself rather than creating another decorative frame.
- **CH04:** soil contour bands and thin roots enter behind/among the main illustrations, then become the actual focal landscape. No faint radial rings behind hanging prints.

For any animated backdrop, keep contrast gentle; it should be barely perceived when idle and clear only during interaction. Avoid distracting motion in peripheral vision. Respect `prefers-reduced-motion`. Pause rendering when offscreen.

## 05.3 Layout materials

| Material | Use | Limitations |
|---|---|---|
| Ivory paper | Editorial open spaces, positive canvas | No blanket dot textures; texture mostly imperceptible |
| Graphite ink | Main illustrations, contours, outlines | No fake always-visible crosshairs or target rings |
| Deep terracotta | Soil and occasional callouts | Not every label and button |
| Forest green | Botanical depth | Only in nature compositions |
| Warm gold | Architectural detail | Keep non-glowing, illustrated and tactile |
| Real paper-like print edges | When genuinely depicting printed artwork | Not a universal card component |

---

# 06 — Detailed redesign by chapter

## CH01 — Hero: preserve the best, remove the noise

**Starting composition:** large `AURO / VILLE` lettering, hand-drawn potter at lower left, banyan at right and recognizable building illustration. This is still the strongest visual area. Keep those real assets and signature hierarchy.

### Hero design changes

1. Reduce permanent metadata to the minimum: modest brand mark at top-left; compact, quiet chapter navigation at top-right. Remove duplicated brand copy at bottom-left, bottom percentage and redundant progress bar if the chapter system already signals progression.
2. Remove near-uniform paper dot/grid pattern. Replace with a hand-authored 4–7-curve **topographic / construction-line field** behind the artwork; no arbitrary concentric circles.
3. Scale and position the Matrimandir study so it remains recognizable before and after the headline starts moving. In the reference video, after the letters clear, the small building sits isolated in too much empty canvas; avoid that.
4. Rebalance the figures: the potter should be part of the typography composition, not a floating sticker; the banyan should help frame the letterforms without consuming half the screen. Evaluate two complete static hero compositions at 1440×900 and mobile 390×844, then implement the stronger one.
5. Replace the tiny generic upper-right editorial tagline with a simple phrase only if needed. Avoid more than one sentence in the hero.

### Hero interaction: **Ink tension**

- Pointer near background contour shifts a local segment *slightly*; other curves remain anchored. On pointer leave, it eases back.
- Moving over the banyan canopy lightly uncovers fine cross-hatching/shading; it should not bounce or waggle.
- Scrolling causes a specific graphite contour to trace the building's edge. That same path becomes the **first meaningful edge of CH02**.
- The hero lasts just long enough to establish the identity; the title disappears only while the image is simultaneously changing into the next rich composition. No long dead middle state.
- Mobile: use scroll/touch progression; no hover-only requirement, no cursor followers.

### Hero exit: non-negotiable continuity

At the end of CH01, one illustrated edge grows and becomes the boundary of a **paper leaf**. This is the actual CH02 layer, not a white fade revealing a separate component. On reverse scroll the fold closes smoothly and `AURO / VILLE` returns to the original composed state.

## CH02 — The illustrated page: from nice static art to living environment

**Current retained material:** high-resolution panorama and its original art style; keep if actual source resolution is sufficient at the rendered crop. Rebuild if blurry; do not upscale an inadequate source and call it fixed.

### Composition

- Maintain the red-earth pathway as the main line that leads the eye toward the structure.
- Partition into source-backed asset layers: sky; far horizon; canopy; primary building; foreground trees/road; 2–3 interactive details. Where single raster art cannot be accurately segmented, generate matching independent layers from the same style sheet and do not invent mismatched perspectives.
- The building should remain visible and identifiable at every scroll state.
- Text must *not* sit in a huge solid cream rectangle over the vegetation. Integrate one compact statement at a naturally quiet part of the composition, or in a true margin outside the image.
- Remove floating generic hotspot circles if they feel like UI chrome; use intentional illustrated clues (for instance a tiny graphite locator or path branch) and accessible hitboxes.

### Interactive narrative states

1. **Opening leaf (entry)** — The physical page edge exposes a substantial colored landscape early; no prolonged tiny slit with empty off-white space.
2. **Pull into landscape** — Foreground branches move subtly separately from distant architecture; an elongated horizon guides the eye, not a video-game camera.
3. **The trail answers** — Cursor near the red-earth path causes a drawn edge/hatching to appear along a small local stretch. Moving away restores a natural illustration. A touch/tap can trigger the same detail.
4. **Discover a detail** — Selecting one of at most three illustrated visual cues reveals an *integrated* nearby detail drawing (not a big pop-up modal) and one sentence of information.
5. **Departure** — The road line straightens/changes into an architectural drafting line that draws CH03's geometry. Preserve subject/color continuity as the composition transforms.

### Motion limits

- Keep depth translations deliberately restrained: a few pixels for far layers and up to a small percent of viewport for front details; visually test to avoid stretching/cut-out artifacts.
- No idle bouncing. Avoid independent animation loops on every leaf. Scroll should produce the primary movement.
- Actual generated illustration layers must share lineweight, texture, light direction and scale.

## CH03 — The Golden Structure: not a technical slideshow

**Current issue:** three serial framed prints / cards arranged across a horizontal scroll strip with tiny headings and spare thumbnail boxes. Replace this scene architecture, not only its CSS.

### New concept: **From a Line to a Building**

One large illustration continuously evolves through three designed states, rather than swapping framed slides.

**State A — Unbuilt Geometry**

- Keep a near-full-height structural elevation positioned off-center, legible and richly detailed.
- Graphite contours unfold from the inherited line coming out of CH02.
- A small chapter title and 1–2 verified labels, no metadata soup.
- Pointer proximity reveals one architectural construction layer, which fades back when the pointer leaves.

**State B — Constructed by Hands**

- With scroll, the building illustration expands into a new drawing composition. A craft/human figure can overlap the structure, tied by a single fine pencil path.
- The large image itself reconfigures: a panel slides from the building's edges, a small cropped workshop detail emerges, and the structure remains visible behind it.
- The visitor may pull a paper corner to reveal how the illustration was constructed (outline vs shaded study). This is a true controlled interaction, not generic before/after photographs.
- Avoid large framed slides, 01/02/03 status banners or tiny repeated thumbnails.

**State C — Golden Detail**

- The architectural study resolves into a large artwork focusing on the discs: graphite linework and restrained warm gold move together.
- An accurate close-up is revealed through the corresponding drawn geometry.
- A subtle interactive focus tool lets the visitor inspect the patterned surface (magnification should remain crisp; use a high-res asset or separate detail art, not CSS scaling beyond source quality).
- The golden contours draw outward to become the suspension contour/soil transition for CH04.

### CH03 transition into CH04

No white-to-white opacity wash. Make the continuous line physically change role: curved disc edge / drafted arc → a fine suspended line or earth horizon; then introduce the first CH04 illustration within that shape. If the hanging line motif is retained, it must have a *visual reason* and lead to earth rather than remain a generic clothesline gallery.

## CH04 — Red Earth: transform hanging prints into a true environment

**Current issue:** four suspended image cards remain static for ~6 seconds; sudden extreme crop of a soil card fills the screen at the end. This is a static illustration exhibition rather than an interactive world.

### New concept: **The Earth Remembers**

The earth itself becomes the interactive canvas; the four studies are *steps toward that environment*, not the final scene.

**State A — Illustrated strata**

- Begin with a full-width, beautifully drawn soil profile as the primary form, integrated with a thin horizon line. Remove giant `THE EARTH REMEMBERS.` if it consumes disproportionate space; choose a compelling but balanced title, and delete "FOUR PLATES HUNG ON LINEN CORD", "PLATE 04-A/B/C", fake `50 YRS`, "TAP TO INSPECT" repetitions.
- Smaller soil/seed/root/tree drawings emerge *from within* this landscape rather than four identical heavy cards.

**State B — The ground opens**

- The visitor's scroll reveals a cross-section with ground layers and roots. SVG/hatching masks slowly expose the image's true detail; restrained pointer interaction shifts only the nearby soil contours, not a blanket parallax on the entire picture.
- A seed detail can be clicked to animate a grounded, hand-drawn root path. Interaction is optional; scrolling never gets stuck waiting for clicks.

**State C — Living root transition**

- Root lines fan out into a few illustrated plant forms on the page. One principal root travels across the viewport and becomes the CH05 forest path. This links CH04 to planned Chapter 05 without a hard reset.
- Use a high-resolution **cross-section plus independently controlled linework**. Do not zoom a small card image to 200% and expose pixel blur.

**Alternative retained-hanging-prints version (only if visually stronger):** Keep at most two or three irregular art prints; on scroll one becomes dominant, its crop and print boundary dissolve through a precise mask into the full soil world; other prints peel away and are not left hanging static. Cursor gently bends the shared line, but keep motion below the level of a bouncing clothesline. Compare both static storyboards and select one.

---

# 07 — Interactive background specification (the new signature)

**Name:** `LivingContourField` — not a universal full-screen widget glued behind every section. It should share a visual grammar while changing meaning with the chapter.

## Parameters

- `variant`: `'hero-draft' | 'landscape-topography' | 'structure-elevation' | 'earth-strata'`
- `active`: false when offscreen and when a modal traps focus.
- `scrollProgress`: controlled by the master narrative timeline, normalized per chapter.
- `pointerPosition`: normalized; used only when the pointer is over the experience stage and hover is supported.
- `reducedMotion`: if true, show the best *static* composition with no pointer drift.
- `density`: low — use about 4–12 significant paths per scene, not 300 repeated lines.
- `tone`: graphite, ochre, terracotta; opacity typically low, increase only locally around interactive reveal.

## Pointer physics

- Local influence with a smooth falloff around the cursor; unaffected segments remain stable.
- Typical maximum displacement about 2–8 CSS px, tuned for viewport scale; spring back on pointer leave.
- Avoid painting a glowing orb around the cursor. The response should be visible mainly **on close observation**.
- Do not create extra DOM nodes or React rerenders on every pointer event; use refs and RAF/GSAP quickSetter or equivalent.

## Scroll choreography

- Use `ScrollTrigger` to drive meaningful authored transformations between path states.
- Morph only compatible paths or use opacity/mask handoffs where geometry is incompatible. Always preserve the visual endpoint on reverse scrolling.
- Keep backgrounds beneath drawings but above the paper texture where appropriate. Ensure text contrast remains stable.
- Render at devicePixelRatio appropriate to the device if a canvas is chosen. For pure path art, prefer SVG.
- Mobile: fewer paths and no continuous pointer input; preserve the silhouette and story through scroll progression.

## Candidate prototypes (choose one primary, one optional)

- **Prototype A (preferred):** Adapt 21st **Luminous Topography** to the site's graphite-paper look, only in the hero and CH04; test latency and minimal motion.
- **Prototype B:** Custom SVG contour field using 21st SVG Follow Scroll principles and authored paths, with no ambient drift. Better when directional path handoffs matter.
- **Prototype C (only if clear value):** restrained Paper Texture / shader displacement in a single quiet scene, never behind the full website. Reject if it looks glossy or is too expensive.

Capture 3 matching screenshots and 5-second desktop/touch clips per prototype; select the most visually refined. Do not blend three effects into one busy background.

---

# 08 — UI / text cleanup specification

## Keep

- Main `AURO / VILLE` title.
- Small, restrained site identity.
- One compact 12-chapter navigation mechanism that appears consistently when requested.
- One concise narrative statement when needed.
- Real, sourced labels for optional detail views.

## Remove or demote

- Bottom-left circular `N` widget / duplicate brand tag, unless it genuinely operates an essential control; if functional, replace with clear minimal iconography.
- Permanent progress percentage and redundant bottom progress line; if needed, consolidate to a single slim, quiet chapter progress affordance.
- Persistent `SCROLL TO DISCOVER` after the first chapter.
- `ACT`, `SCENE`, `PLATE`, invented dates, repetitive print captions and generic `TAP TO INSPECT` labels. Keep explicit guidance only for unfamiliar interaction modes, shown once at point of need.
- Dotted paper background and large faint concentric circles/crosshairs used as decoration.
- Default card borders, heavy paper shadows, generic frosted panels and identical container boxes.
- Repeated prose about being an illustrated world or architectural inquiry. Let the site demonstrate that visually.

**Text editing rule:** every line must answer one question: What am I looking at? What can I do? Why does it matter? If none applies, remove it.

---

# 09 — Build architecture and safe implementation sequence

## Existing project

Use current Next.js, TypeScript, Tailwind and GSAP architecture. Inspect components and preserve reliable behavior. Do not initialize a fresh application. Keep V4 masterplan present.

## Suggested reusable systems

```text
components/experience/
  LivingContourField.tsx          # authored, chapter-aware interactive background
  ChapterNavigation.tsx           # simplified single navigation system
  ExperienceStage.tsx             # stable stacking and scroll state
components/scenes/
  EditorialCover.tsx              # preserved and refined
  Chapter02PageOpens.tsx          # refactored art layers and interactions
  Chapter03GoldenStructure.tsx    # spatial transformation not cards
  Chapter04RedEarth.tsx           # soil world, not static print gallery
components/interactions/
  IllustratedDetailReveal.tsx     # accessible focus/hover/touch detail
  SharedIllustrationTransition.tsx
  LocalContourResponse.tsx
lib/animation/
  chapterTimelines.ts
  authoredPathMorphs.ts
  pointerInfluence.ts
lib/data/
  verifiedCaptions.ts
public/illustrated/v5/
  hero-contour-guides.svg
  ch02-panorama-{sky,mid,front}.webp
  ch03-structural-{outline,shade,detail}.webp
  ch04-{soil,roots,forest}.webp
```

**Structure is illustrative, not a mandate to recreate functioning files.** Prefer whatever works in the existing repo and prevents duplicate layers/timelines.

## Phase sequence (do not skip visual reviews)

**V5-A — Audit and art-direction exploration**

1. Extract representative video frames at hero start, intermediate blank state, opening page, full panorama, CH03 states, CH04 prints and full soil.
2. Audit actual code against the defects described in Section 02.
3. Discover and test the connected 21st MCP; record capabilities and actual tool calls.
4. Produce 2 hero static designs and 2 CH04 static redesigns; choose the strongest visual direction, do not blindly implement the first candidate.
5. Produce a slim UI text deletion map and a new layering design.

**V5-B — Hero and interactive background foundation**

1. Refine hero spacing and artwork balance; remove text/dot clutter.
2. Prototype `LivingContourField` with 21st MCP source or handcrafted SVG inspired by evaluated components.
3. Ensure the existing hero transition still works both ways and is visually rich at midpoint.
4. Test desktop + portrait mobile.

**V5-C — CH02 living panorama**

1. Prepare independent clean illustration layers or improve the existing artwork.
2. Remove the large opaque text panel.
3. Implement at least **three different meaningful states** while scrolling.
4. Add 1–3 responsive discoveries with accessible touch equivalents.
5. Repair paper-fold handoff and road-to-architecture continuation.

**V5-D — CH03 and CH04 redesign**

1. Replace serial frames/cards with a continuous three-state Matrimandir illustration.
2. Replace or dramatically animate the static print exhibition into a world-centered earth story.
3. Replace pale fade with persistent path/shape handoff.
4. Prevent low-res full-screen zooms and crop mismatches.

**V5-E — Integrate/verify**

1. Review full 4-chapter scroll in one session and reverse.
2. Fix nav index/scroll synchronization and interaction conflict.
3. Perform responsive, motion-reduction and pointer/touch testing.
4. Run one meaningful production build; avoid repetitive build loops.
5. Document what was implemented and what remained aspirational.

**Do not start CH05–CH12** until V5-A through V5-E are visually approved. V4 interactions remain future inventory, not an instruction to ship 120 unpolished effects now.

---

# 10 — Detailed QA and acceptance gates

## Test viewports and states

- Desktop 1440×900, laptop 1280×800, tablet 768×1024, mobile 390×844 and 375×812.
- Capture 0%, 25%, 50%, 75%, 100% per *chapter*, plus transition midpoints.
- Compare each frame against source `203307.mp4` and the final approved style reference.
- Test **slow wheel scroll, fast trackpad scroll, upward reverse scroll, resize during each pinned state, direct chapter navigation**.
- Test pointer leave/re-enter; overlays and drag while the page scrolls; touch equivalents; reduced motion.

## Art direction gates

- Hero still immediately reads as `AUROVILLE`, but has fewer cluttered elements.
- No dot fields or concentric target decorations unless the diagram actually communicates content.
- Hero midpoint contains meaningful artwork rather than a small structure in dead space.
- CH02 panorama is sharp at the intended crop, with 3 or more visible composition states.
- CH03 genuinely transforms through 3 coherent structural states; it no longer looks like a row of framed slides.
- CH04 has an actual story and art interaction, not 6 seconds of static hanging cards.
- All visitor-facing text is intentional and legible; no repeated development labels or unexplained microcopy.
- The background interaction is restrained at rest, perceptible when engaged and never interferes with reading or tapping.

## Technical gates

- No sudden white/pale flashes at chapter boundaries.
- No low-resolution full-screen enlargements.
- Source-image identity, masks and object positioning survive reversals and resizing.
- No duplicate ScrollTriggers or competing transform writes.
- No pointer input trapped behind a decorative overlay.
- Reduce-motion mode retains useful composition and all content.
- No unsupported historical/caption claims; generated interpretations are labeled appropriately when necessary.
- Screenshot evidence and automated tests correspond to the *actual built version*.

## Required documentation

Update or create:

```text
docs/v5/current-visual-audit.md
docs/v5/21st-mcp-evaluation.md
docs/v5/art-direction-decisions.md
docs/v5/component-source-license-manifest.md
docs/v5/visual-verification.md
docs/v5/implementation-report.md
```

`implementation-report.md` must include exact files changed, tool calls used, original components adapted, interactions completed and tested, rejected candidates and reasons, screenshots, performance impact, actual build result, and outstanding defects. **Do not report an MCP capability as used if it was only researched.**

---

# 11 — The instruction to begin

Read this V5 addendum end-to-end along with the V4 masterplan and inspect the existing repo. Use the *connected* 21st MCP directly in Antigravity (discover tools, check account capabilities, search relevant components and retrieve/adapt source). Analyze the supplied recording snapshots. **Do not rebuild the working hero from scratch.** Remove the current dot/decorative clutter and excessive text, create one subtle interactive background design, refine the hero and then rework CH02–CH04 as connected illustrated environments rather than cards/slides.

Start with **V5-A and V5-B**, and finish with real side-by-side browser screenshots. Continue to CH02–CH04 only when the hero/interaction foundation is compelling. Keep this work faithful to the visual goal: **premium, illustrated, tactile, restrained, highly interactive and original.**

---

# Research bibliography

Official 21st MCP: <https://docs.21st.dev/mcp>  
Official skill guidance: <https://github.com/21st-dev/magic-mcp/blob/main/skills/21st-ui/SKILL.md>  
21st Luminous Topography: <https://21st.dev/@rmahammad/components/luminous-topography>  
21st SVG Follow Scroll: <https://21st.dev/@reuno-ui/components/svg-follow-scroll>  
21st SVG Clip Path Mask: <https://21st.dev/@reuno-ui/components/svg-clip-path-mask>  
21st Background Paper Shaders: <https://21st.dev/@reuno-ui/components/background-paper-shaders>  
Codrops Morphing Background: <https://tympanus.net/codrops/2017/05/23/on-scroll-morphing-background-shapes/>  
Codrops Curved Path: <https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/>  
Codrops SVG masks: <https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/>  
Codrops scroll-driven map: <https://tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap/>  
21st Design Bug Bot: <https://21st.dev/blog/introducing-design-bug-bot>
