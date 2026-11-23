# AUROVILLE — THE WORLD YOU DRAW
## V4 ADDENDUM A — Chapter 03 + Chapter 04 Creative Rebuild Using the Nón Lá Motion Reference

**Status:** Specific production change request for Google Antigravity.  
**Date:** 23 November 2026.  
**Source of truth:** Read `Auroville_Masterplan_V4.md` (or `Auroville_Illustrated_Interactive_Experience_Masterplan_V4.md`, whichever is present in the project) and the existing `docs/v4/` audit, known-good hero and art-system files. This addendum overrides the affected **CH03/CH04 design and sequencing** when there is a conflict, but does not replace the 12-chapter story or 120-item interaction catalogue.  
**Workspace:** Continue the current existing Next.js project. Preserve approved CH01 hero. Fix the already identified CH01→CH02 and CH02→CH03 problems. Do not reset the repository.  
**Task:** Rebuild CH03 and CH04 to achieve the **editorial image choreography + suspended-print gallery** seen in the newly supplied Nón Lá reference recording, translated into a distinctive **illustrated Auroville** visual language. The site is **illustration-led**, not a stock-photo gallery.

---

## A. What the actual reference video shows — verified visual observations

Reference recording supplied by the user: `Screen Recording 2026-11-23 132823.mp4`, 9 seconds, 1918×916 at 30 fps. A still-frame reference pack is included in `reference_frames/`. **These frames are for visual-study purposes only; do not publish, copy, or use them as website assets.**

| Recording time | Visible reference behavior | Distill the principle — do NOT copy the content |
|---|---|---|
| 0.0–~2.0 s | Ivory editorial canvas; one exceptionally large documentary image occupies a major portion of the composition; two smaller, deliberately cropped supporting images; small short copy and a chapter number. | Strong primary/secondary hierarchy, meaningful white space, few well-composed images. |
| ~2.0–~5.8 s | The visual canvas progresses laterally through numbered storytelling states. The dominant picture moves left and a new large picture arrives from the right; supporting images and accompanying copy shift to new positions. | A **continuous horizontal storytelling track controlled by vertical scroll**, not separate card grids or faded slides. |
| ~5.8–~6.8 s | A clear change of visual rhythm: photographic spread gives way to a quieter cream canvas and a large faint circular line illustration. A bold heading arrives. | A structural change of pace using an underlying recurring hand-drawn shape. |
| ~6.5–9.0 s | Four rectangular, print-like photographs appear clipped to a gently dipping cord, with slightly varied tilt and sizes. Very large faint radial artwork anchors the background. | Tactile, art-directed *suspended illustration prints*; an inviting interaction target with a strong graphic backdrop. |

**Important distinction:** The reference uses photographs of Vietnam and imagery of conical hats. Our production must use **new original Auroville-inspired illustrations**, including hand-drawn Matrimandir details, soil and plant studies, people engaged in making, red-earth textures, and artwork tied to our narrative. Do not copy the original photos, conical-hat imagery, exact text (`AND MORE...`), layout coordinates or artwork.

**What cannot be concluded from the recording:** the original site's exact HTML/CSS/JS, scroll library, hover behavior, mobile design, click functionality, image licenses, or exact easing curves. Build the proposed interaction behavior below and verify it locally rather than claiming to replicate unknown internals.

### Exact frame references in this pack

- `reference_frames/01_editorial_arrangement_a.jpg`: dominant image + supporting imagery + narrow editorial copy.
- `reference_frames/02_editorial_story_handoff.jpg`: lateral handoff into the next arrangement.
- `reference_frames/03_editorial_arrangement_c.jpg`: large right-side picture and small supporting pictures on paper.
- `reference_frames/04_arrangement_to_transition.jpg`: transition into the next compositional rhythm.
- `reference_frames/05_hanging_gallery_enter.jpg`: big faint circle + headline + hanging prints beginning to appear.
- `reference_frames/06_hanging_gallery_full.jpg`: completed four-print arrangement.

Use these stills in conjunction with the original recording, if accessible in your workspace. If the original `.mp4` is not copied into the Antigravity workspace, study the included frame set. Do not claim to have examined unprovided source material.

---

## B. Review decisions and design boundaries

**Preserve:** The approved illustrated AURO / VILLE hero, its banyan tree, artisan figure, high-impact typography, core layout, and usable drawing assets. The CH02 colored-pencil panorama can be retained as *source art* if it is genuinely sharp.

**Repair before proceeding:** The CH01→CH02 paper fold currently reads like an abrupt picture replacement; CH02 is too static and has an overly opaque copy panel; CH03 currently resembles a technical/specification board; CH04 is still too close to an inherited rectangular photo gallery. Visible blank tiles, chapter-label drift, poor crop and overly small interface typography remain unacceptable.

**Rebuild:** CH03 as a **three-part illustrated editorial movement**, CH04 as a **suspended illustrated-prints experience that opens into the red-earth landscape**. Treat the two scenes as one extended choreographed sequence, not two unrelated React sections.

**Do not add:** random Google imagery, a generic 3D sphere, Three.js, excessive particle effects, glassmorphism, stock illustration icons, standard card sliders, default masonry grids, simulated 3D cloth physics or scroll-jacking.

**Design language:** Black/dark-graphite editorial typography on warm ivory; limited terracotta and gold accents; rich hand-drawn graphite/ink with colored-pencil washes and detailed hatching; deliberately composed illustrations and legible captions. No full-viewport empty periods.

---

## C. A new continuous story linking CH02 → CH03 → CH04 → CH05

Our narrative motif is **the same line transforming across materials**.

1. CH02: The drawn path winds across the layered illustrated landscape.
2. Handoff CH02→CH03: The landscape path curves into a **structural arc**; the line becomes a drafting contour framing the Matrimandir illustration.
3. CH03: The arc becomes an architectural study, then a set of editorial illustration panels describing **form, making, and detail**. The viewer scrolls through these states *without hard cuts*.
4. Handoff CH03→CH04: The final architectural contour stretches outward into a **fine line across the page**, while the chosen illustration contracts into a print attached to that line. This must be a visual metamorphosis with a stable shared element; do not kill CH03 and fade in CH04.
5. CH04: The fine line becomes a **lightly sagging suspension cord** holding illustrations of land, seeds, roots, and community life. Underneath, a faint circular drawing of **soil strata, plant growth rings, or a radial landscape study** builds a distinctive Auroville-specific background (not a conical-hat drawing).
6. Handoff CH04→CH05: The red-earth print becomes the whole viewport. Its illustrated surface grows beyond the print boundary, turns into a full-scale landscape, and the first root passes into the forest chapter.

**The imagery and text must be changed to suit these mechanics**; do not keep inaccurate archive labels or move old photographic card content into a new layout.

---

## D. CH03 — THE GOLDEN STRUCTURE: detailed replacement

**Goal:** Take an architectural subject that is currently presented like a specifications dashboard and turn it into a **bold illustrated editorial performance**. This is an Auroville-inspired architectural interpretation; do not invent documentary facts or call generated drawings historical plans.

### D1. Static design before animation

Create three full-quality static keyframe compositions at **1440×900**. All three must look like beautiful standalone editorial spreads.

**Frame A — FORM / `01 — AN IDEA TAKES SHAPE`**
- Dominant illustration: detailed Matrimandir architectural elevation/sketch occupying approximately 52–60% of viewport width, primarily right or slightly beyond center.
- Background: ivory paper, extremely subtle grain and fine drafting strokes.
- Supporting illustration A: small grayscale cross-section or radial construction study, positioned high on the left.
- Supporting illustration B: a small terracotta-colored architectural material study near the bottom-left.
- Text: 3–6 words of bold editorial heading, max 2 lines; 1–2 short supporting sentences, not technical metadata.
- Number: `01/` as part of the three-part internal sequence; separate from actual chapter navigation label `03`.
- Do not use a white card, frosted box or UI callout background around copy.

**Frame B — MAKING / `02 — BUILT BY MANY HANDS`**
- Dominant illustration: large, carefully drawn hands/people involved in craft, architectural assembly, or material work; show plausible activity without inventing a named historical scene.
- Supporting studies: small detailed radial pattern, a layered architectural fragment, a graphite tool/material study.
- Composition flips its emphasis from right-dominant to left-dominant; text moves to the opposite side.
- Accent: slight terracotta/ochre wash in one large subject; maintain graphite line quality.

**Frame C — DETAIL / `03 — A THOUSAND SMALL DECISIONS`**
- Dominant artwork: close-up of Matrimandir-inspired circular exterior surface geometry with rich hatching and limited gold accents. This is a clearly labeled artistic study, not an exact construction specification.
- Support: smaller botanical/woven detail and one mini drawing of the full spherical form.
- Text: concise artistic statement and an optional verified fact linked to a cited source, without calling exterior golden discs “acoustic discs.”
- Ending composition: choose one circular illustrated detail to persist through the handoff into CH04.

**Contrast is essential:** Each state needs a different composition while staying inside one design system. Do not make three identical templates with images swapped.

### D2. Motion choreography: vertical scroll → lateral visual movement

Design a stable, clipped full-viewport editorial stage for CH03. Vertical scrolling scrubs a horizontal progression of these three visually connected compositions.

Proposed normalized CH03 progress:

| Progress | What the visitor sees | Exact animation intent |
|---|---|---|
| 0–0.16 | CH02 path curves into the architectural arc; Frame A establishes | An existing line transforms into CH03 motif; the first dominant illustration is already present; no blank page. |
| 0.16–0.34 | Frame A gets its quiet hold | Let viewers read and observe. Tiny detail can respond to pointer but should not wobble constantly. |
| 0.34–0.51 | Frame A → Frame B lateral transformation | Main art translates toward the left edge, new large drawing enters from the right; supporting illustrations travel at different but carefully restrained distances; headings hand off in clearly bounded type areas. |
| 0.51–0.63 | Frame B hold | Major visual is stable; active illustration interaction available. |
| 0.63–0.80 | Frame B → Frame C lateral transformation | Another fully choreographed horizontal composition shift; no blanket opacity fade, no card slider arrows. |
| 0.80–0.89 | Frame C hold | Final architectural detail remains crisp and legible. |
| 0.89–1.00 | Frame C → CH04 illustrated print | A selected detail retains identity, shrinks into one hanging print; the architectural arc extends into an actual cord and the large, faint circular background appears. |

These intervals are starting points; tune them to natural scroll distance. Keep movement reversible. The user must be able to scroll freely; do not hijack wheel input or force scroll snapping.

**Motion specifics:** Animate transform positions and masks; never stretch raster artwork. Each large image requires a carefully art-directed crop, and its actual asset must stay visible at every midpoint. Use concise editorial copy (not opaque floating panels), precise clipping and z-index rules.

### D3. Direct interactions in CH03

Build a small number with real quality; do not cram 10 prominent controls into the main composition.

- **Required — illustrated comparison:** retain the existing accessible linework-vs-colored-shading drag reveal, but move it into a thoughtfully placed expandable close-up in Frame C, not as the entire full-screen chapter. Mouse, touch, keyboard arrows.
- **Required — detail inspection:** hover/focus a gold-surface detail to reveal a fine annotation and closer linework; touch activation opens the equivalent state.
- **Required — drawings follow scroll:** architectural contour/reveal paths must respond to progress. Use simplified SVG paths layered over a high-resolution raster drawing, not fake raster-to-SVG conversion.
- **Optional — paper sample pull:** gently pull out one smaller study from the composition and return it to its assigned placement. Use only if it makes the design better.

V4 register mapping: I021–I030 still apply conceptually. Re-map them to the redesigned presentation in `docs/v4/interaction-tracker.csv` rather than silently dropping them. The core structural-gold comparison I023 and detail I024 remain reachable.

### D4. Accessibility and factual correctness

- Main animated content is represented as readable HTML/SVG, not flattened AI-generated text.
- Avoid historical claims that the drawing literally reproduces a 1968 Roger Anger original unless verified. Prefer `Architectural interpretation / drawn for this experience`.
- Verify any technical facts from reliable documentation. If unsure, use nontechnical design language and record uncertainty.
- Match touch and keyboard exploration. Provide reduced-motion state with each illustration visibly accessible.

---

## E. CH04 — RED EARTH: detailed replacement inspired by the hanging-print sequence

**Goal:** Replace the inherited conventional photographic grid with an **original hand-illustrated hanging-story exhibition**, then transform one print into the opening of the red-earth landscape. The user should feel they are exploring an illustrated physical page, not browsing cards.

### E1. What to borrow from the provided video

The 6–9-second section shows: large black heading, quiet cream background, faint large circular drawn form, a long suspended string crossing the viewport, and approximately four pinned photo prints with independent tilts. **Borrow the hierarchy and tactile invitation**, not the photographs, conical-hat silhouette or exact headline.

### E2. Our original Auroville transformation

- Heading (proposed): **`THE EARTH REMEMBERS.`** Use an expressive condensed black display type. Alternative: `BEYOND THE BLUEPRINT` if it reads better after CH03.
- Background: large, faint **circular tree-growth ring / root-system / topographic soil diagram**, derived from original Auroville-themed illustration. Keep it readable as graphic art but behind the prints at roughly 5–12% darkness depending on contrast.
- Suspension line: natural, imperfect graphite/ochre stroke spanning past the viewport edges, with a gentle central sag. Must plausibly connect to the last arc from CH03.
- Clips: 4–5 individually drawn small wooden clips or paper fasteners; not default UI icons.
- Prints: 4 large, beautiful original illustration cards with *print-like* paper borders, each depicting a distinct mini-story. Variations should be subtle and art-directed, not random rotations.
- Print themes (minimum): `RED EARTH` (detailed terracotta terrain), `THE SEED` (hand + seed study), `THE ROOT` (botanical cross-section), `THE PATH` (human-scale landscape walkway), optional `THE FIRST GREEN` (emerging foliage).
- Each print has a short handwritten/typographic caption placed within a clean print margin. Text must be HTML or artwork prepared accurately, not mangled generated text.

### E3. Desktop composition

At 1440×900, aim for:
- Main heading in upper 10–18% (not a repeated centered subheading above a grid).
- Background circle at approximately 55–70vw diameter, slightly offset from center.
- Cord travels from left edge to right edge around upper-mid viewport, with a soft sag and small imperfections.
- Four prints hang at slightly varied vertical positions under the cord. Use medium-large, detailed illustrations (e.g. 230–330px wide on 1440px view, according to final composition).
- Paper-white or warm-white margin around illustrations, precise subtle shadow, varied rotations within about ±4 degrees.
- Enough whitespace to see the cord, each illustration, and the large radial drawing behind it.
- Ensure the full composition is visible at the intended scroll hold. Do not place half the images permanently below the fold unintentionally.

### E4. CH04 scroll choreography

| Progress | Visual state | Interaction and continuity |
|---|---|---|
| 0–0.18 | CH03 circular detail settles behind the scene; outline enlarges into faint radial art; CH03's selected detail contracts into the first paper print. | One genuinely continuous artwork handoff. |
| 0.18–0.38 | Suspension cord draws from left to right; prints attach in a restrained stagger; heading becomes legible. | No generic falling-card animation; paper settles only slightly. |
| 0.38–0.57 | Illustrated hanging prints form a complete, still, readable exhibition. | Invite optional hover/tap/drag exploration; natural scroll remains available. |
| 0.57–0.78 | One selected red-earth print comes forward through a controlled planar transformation; other prints move along the cord to make room. | Avoid zooming and unzooming repeatedly; preserve crop geometry. |
| 0.78–1.00 | The red-earth illustration expands, loses its print margin naturally, becomes a full illustrated landscape; one drawn root/contour crosses toward CH05. | Exact shared artwork should occupy both sides of the transition; no white flash or empty frame. |

### E5. Direct interactions in CH04

- **P0 — lift a print:** pointer hover gently lifts or straightens one illustrated print by a few pixels/degrees; touch taps open its story. It returns naturally and does not throw neighboring prints around.
- **P0 — inspect a story:** click/tap/focus opens a close-up with more of the illustration and a two-sentence caption; Escape/outside close returns it to the same coordinates; readable and keyboard navigable.
- **P1 — move along the line:** in the stationary gallery phase, permit dragging one clipped print a limited distance along the cord, constrained between neighbors and supporting touch; release snaps gently into an allowed slot. Optional if reliable.
- **P1 — uncover a detail:** user sweeps a controllable reveal over one illustration to expose fine graphite roots or a second ink layer. No sandstorm particle simulation.
- **P1 — plant a seed:** when the red-earth art has filled the viewport, allow placement of a small illustrated seed that draws a root on a bounded path. This becomes the first meaningful input leading toward CH05.
- **P2 — multiple discoveries:** mini captions, folded-paper corners, and subtle hatching reveals only if they do not reduce clarity.

V4 register mapping: I031–I040 correspond to earth, soil, roots and the seed. Keep their intent; several can activate in the latter half of CH04, after the print-to-landscape transformation. Do not treat the hanging-print stage as a replacement for the entire `Red Earth` story.

### E6. Mobile composition

At 390×844, do not squeeze four tiny prints onto one thin horizontal cord. Use a deliberately composed **two-print focus** with an accessible horizontal exploration strip or carefully sequenced vertical compositions; communicate that more drawings are available. The circular background drawing adapts to the portrait crop; the same red-earth print expands into a portrait-first landscape. All interactions must work by touch; no hover dependency.

---

## F. Artwork generation requirements — no Google photos as final assets

Before implementation, make a contact sheet of planned artwork. Use the image-generation functionality actually available in the workspace, and maintain one coherent style sheet. The initial CH03 + CH04 asset pack should contain at least:

| ID | Artwork | Intended use | Suggested structure |
|---|---|---|---|
| ART-03-A | Matrimandir-inspired elevation with detailed graphite shading | CH03 Frame A dominant | High-resolution isolated artwork + simple outline SVG |
| ART-03-B | Hands / making / construction-material scene, expertly drawn | CH03 Frame B dominant | Layered transparent raster |
| ART-03-C | Macro architectural circular disc/ring detail with gold accent | CH03 Frame C dominant; CH04 handoff | Isolated raster + separate circular mask |
| ART-03-D | Small drafting and material studies | CH03 two supporting images per state | 3–5 individual transparent images |
| ART-04-A | Detailed red-earth terrain illustrated print | CH04 first print, later landscape | Full master layered environment + print crop |
| ART-04-B | Seed and hand study | CH04 print | Transparent ink illustration + warm wash |
| ART-04-C | Roots and botanical cross-section | CH04 print and interaction | Raster shading + simple root paths |
| ART-04-D | Human-scale landscape/path illustration | CH04 print | Distinct landscape art |
| ART-04-E | First green / emerging plant illustration | CH04 optional fifth print | Ink + colored-pencil leaves |
| ART-04-F | Fine radial root/tree-ring/topographic diagram | CH04 background circle | Genuine authored SVG or detailed vector-like raster |
| ART-04-G | Cord, clips, subtle paper textures | CH04 layout details | SVG line + 4–5 small clip assets |

**Art quality:** authentic-looking hand-drawn asymmetry, variable line weight, legible construction geometry, real hatching, selective color, no generic AI glow, no noisy/washed-out textures, no inaccurate pseudo-lettering. Use transparent assets when needed. Generated images should be checked at native resolution; do not enlarge a blurred ~1000px panorama to fill a wide screen and call it high resolution. Create separate high-resolution illustration plates when the full landscape requires greater real detail. Use local assets in `public/illustrated/` and update `docs/v4/asset-inventory.csv`.

**Accuracy:** Original inspired-by drawings of the Matrimandir are welcome, but check the recognizable geometry against reliable references. Generated conceptual maps are not official Roger Anger originals. No fake historical photo labels. Do not claim unverified building details.

---

## G. Engineering strategy (avoid brittle animation hacks)

**Existing tech preference:** Next.js + TypeScript, GSAP and ScrollTrigger, SVG, CSS transforms/masks, occasional Canvas 2D. No new 3D engine needed.

1. **Persist visual identity:** Reuse the selected illustration itself, or use source- and crop-matched artwork with accurately measured geometry, across CH03→CH04 and CH04→CH05. No separate components cross-fading unrelated assets during the handoff.
2. **One scroll authority:** Master chapter controller sets active chapter, progress bar and lateral scene progress; no stale `03` nav while CH04 is visible.
3. **Deterministic keyframes:** Define start/middle/end transforms and mask states. Recalculations after resize. One timeline owns each element's transform to avoid clashes.
4. **No scroll trap:** Vertical scrolling controls the lateral editorial movement, but the wheel is not hijacked. When a print close-up opens, manage focus and locking deliberately, then restore exact scroll state on close.
5. **Priority of layers:** background radial art → illustrated panels → small annotation overlays → interaction controls → accessible modal. Ensure type and artwork remain readable.
6. **Responsive composition:** Use separate geometric layout definitions for desktop/tablet/phone; don't scale a 1440px canvas down into a 390px strip.
7. **Performance:** Optimize raster assets, preload only immediately adjacent art, use right-sized responsive images, avoid expensive blur filters and continuous layout recalculation, clean up GSAP timelines on unmount/resize.
8. **Reduced motion:** Show coherent still illustrated states, available direct interactions and accessible navigation; no animation-dependent information.

**Implementation suggested component decomposition** (adapt to actual codebase):

```text
components/scenes/
  Chapter03GoldenStructure.tsx      # replace technical-board layout with 3-state editorial track
  Chapter04RedEarth.tsx             # replace inherited conventional gallery
components/interactions/
  EditorialTrack.tsx                # horizontal choreography under vertical scroll
  IllustratedPrintLine.tsx          # cord, clips, controlled hanging print positions
  PrintFocus.tsx                    # accessible detail modal/overlay
  LayerComparison.tsx               # retain CH03 accessible reveal
lib/animation/
  chapterKeyframes.ts               # responsive state definitions
  chapterSharedTransition.ts        # CH02→03, CH03→04, CH04→05 continuity
public/illustrated/ch03/
public/illustrated/ch04/
docs/v4/
  ch03-ch04-keyframes/
  verification/
```

---

## H. Build order — do not rush into 120 interactions

1. **Inspect current workspace and fix critical earlier issues:** Confirm CH01 preserved; repair CH01→CH02 paper fold if abrupt; improve CH02 too-static single image and oversized opaque copy panel. Check chapter-state sync and blank media.
2. **Reference review:** Study the included video stills and the full 9-second clip if the `.mp4` is available. Record reference principles, never copy photo content.
3. **Produce artwork:** A shared style-contact sheet first. Then full-quality CH03 three dominant artworks, CH04 four/five illustrated prints, radial background, and red-earth master illustration. Reject low-quality or mismatched generations.
4. **Create static keyframes:** CH03 Frames A/B/C; CH04 suspended line, print focus, expanding-earth still; both desktop and mobile. Commit these without motion and inspect screenshots before animating.
5. **Build CH03 lateral-scroll timeline:** Keep the illustration dominant and other elements supporting. Ensure all intermediate frames are well-composed.
6. **Build CH03→CH04:** Make the architectural circular detail become the first print and its line become the cord. Screen-record this transition slowly forward and backward.
7. **Build CH04 line gallery and red-earth expansion:** Confirm all prints are interactive and the selected earth art expands into an original landscape. Provide a clean onward handoff to CH05 (don't implement full CH05 in this patch).
8. **Restore all existing useful direct interactions:** Accessible comparison reveal, detail inspection, modal close, touch alternatives; update tracker statuses honestly.
9. **Verify, correct, and document:** One meaningful production build after functional implementation; no repetitive compile/rebuild loops. Git commit only after actually verifying test results.

---

## I. Acceptance tests and screenshot evidence

**Mandatory desktop viewports:** 1440×900 and 1280×800. **Touch viewports:** 390×844, 375×812 and 768×1024.

Capture scene states at **0%, 15%, 30%, 45%, 60%, 75%, 90%, 100%** local CH03 and CH04 progress. Additionally capture the shared-element boundary frames at precise adjacent scroll positions. Test very slow scroll and fast scroll; then fully reverse (CH04→CH03→CH02).

**Pass conditions:**

- [ ] Current hero untouched in its successful essentials.
- [ ] CH01→CH02 fold reads as a visible continuous transformation, not an abrupt switch.
- [ ] CH02 text panel no longer blocks the illustrated panorama; layers have meaningful motion.
- [ ] CH03 has **three visibly distinct, excellent editorial states**, not a technical fact board.
- [ ] Dominant illustrations in CH03 have intentional hierarchy and remain crisp.
- [ ] CH03 progresses *laterally* under normal vertical scroll, without horizontal overflow or body scroll hijack.
- [ ] CH03 comparison slider and optional annotations remain fully accessible.
- [ ] CH03→CH04 has an identifiable shared art element (circle→print, line→cord), with no empty or black transition.
- [ ] CH04 includes **four strong original illustrated prints** on a believable, subtle suspended line over an Auroville-specific faint circular drawing.
- [ ] CH04 prints are interactive on desktop and touch; focus view returns exactly to the correct print location.
- [ ] CH04's earth print expands naturally into the red-earth illustration to prepare CH05.
- [ ] No Google photographs, stock illustrations, unlicensed images, stretched blurry raster assets, or copied Nón Lá photos in the final experience.
- [ ] No developer-facing UI words, incorrect “acoustic discs” wording, inaccurate archival/map claims, image blanking, accidental headline collisions, giant empty viewports or mismatched nav chapter state.
- [ ] All planned and tested interaction statuses are reflected in the V4 tracker; no unverified completion claims.
- [ ] Reduced-motion alternative, keyboard operation and touch behaviors work.
- [ ] Playwright screenshots inspected visually, not merely generated; actual remaining issues listed in report.

**Required report**: `docs/v4/ch03-ch04-rebuild-report.md` describing the new visual states, actual generated assets, changes to existing components, issues fixed, all remaining issues, reference frames consulted, and real tests run.

---

## J. Creative director's final rule

The 9-second reference is compelling because **the composition never stops being art-directed**. The large visual, small supporting studies, copy, chapter markers and image positions change together. The hanging sequence succeeds because it has a distinctive *spatial idea* and excellent restraint.

**Translate those principles into an original Auroville illustrated story.** Do not clone the Vietnam photos or its hat artwork. Don't bolt a clothesline component beneath the existing CH03 dashboard. The whole CH03→CH04 journey must be rebuilt around those visual relationships.

**The correct finished sequence is:**

**Existing approved illustrated hero → meaningful paper fold → living illustrated landscape → three-part Golden Structure editorial movement → circular drawing becomes a suspended illustrated story gallery → red-earth drawing expands into the next world.**

The animation must serve this transformation; the artwork must be strong enough to stand still.
