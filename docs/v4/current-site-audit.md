# Current Site Audit & Baseline Analysis (V4)

## 1. Executive Summary
This audit evaluates the current Auroville interactive codebase against the **Master Creative, Storytelling & Production Blueprint (V4)**. 

The previous V3 implementation established a successful typographic and editorial foundation in Scene 01. However, Scene 02 relied on documentary photography (`cover-matrimandir.webp`), which created visual inconsistency with the hand-drawn cover, exhibited resolution softness when displayed full-bleed, and suffered from framing conflicts. 

Under V4, the website transitions to a **fully illustrated interactive experience**.

---

## 2. Component-by-Component Assessment

### 2.1 Scene 01: `components/scenes/EditorialCover.tsx`
- **Current State:** 
  - Monumental *Archivo Black* `AURO / VILLE` display typography.
  - Centered architectural study drawing of Matrimandir dome with vector compass drafting arcs.
  - Hand-drawn centenary banyan tree illustration (`public/art/botanical/banyan-tree.webp`) anchoring the right margin.
  - Hand-drawn artisan potter (`public/art/people/potter.webp`) anchoring the left margin.
  - Editorial statement: *"A place still becoming. Founded in 1968 on a barren red plateau in southern India..."*
- **Verdict: PRESERVE & REFINE**
  - Core composition is approved as the baseline for V4.
  - Required Refinement: Extend the main authored pencil line across the composition to meet the right paper edge, establishing the fold boundary for Scene 02 (Interactions I009 & I010).

### 2.2 Scene 02: `components/scenes/InsidePhotograph.tsx`
- **Current State:**
  - Employs `cover-matrimandir.webp` (a 2100×1400 photographic asset).
  - Transition attempted a sketch-to-photo reveal, but the photographic asset felt disconnected from the artisanal ink language of Scene 01.
  - Stretching to full-bleed (1440×900 and high-DPI viewports) revealed visible pixelation and compression artifacts.
  - In earlier iterations, the photo split 50% horizontally due to a flex-row container bug, which was resolved, but the fundamental artistic mismatch remains.
- **Verdict: COMPLETE REBUILD REQUIRED (Priority Phase 1)**
  - Discard the photographic background entirely.
  - Build `Chapter02PageOpens.tsx` with a multi-layer, high-resolution original illustrated panorama (far sky/distance, mid red-earth/architecture, foreground botanical contour, paper fold geometry, and interactive path vector).

### 2.3 Scene 03: `components/scenes/ArchiveScene.tsx`
- **Current State:**
  - Asymmetrical archival spread with Roger Anger Galaxy Plan concept study (`galaxy-plan.webp`), Plate 01 photo, and tactile layered document drag reveal.
- **Verdict: PROGRESSIVE EVOLUTION TO CH03 (The Golden Structure)**
  - Transition focus from documentary cards to a pure architectural structural study with fine contours, construction guides, and tactile comparison slider (I021–I030).

### 2.4 Scene 04: `components/scenes/LivingGrid.tsx`
- **Current State:**
  - 3-state magazine spread (`Exposure I`, `Exposure II`, `Finale`) with click-to-focus inspection modal.
- **Verdict: FOUNDATION FOR ACTS II, III, & IV**
  - Will be progressively expanded into the full 12-chapter narrative arc defined in V4.

---

## 3. Resolution Matrix for Identified Problems (A01–A20)

| ID | Issue | V4 Architectural Remedy |
|---|---|---|
| A01 | Thin/ordinary hero type | Retained powerful V3 *Archivo Black* display layout. |
| A02 | Missing distinctive artwork | Standardized on custom original illustrations across all scenes. |
| A03 | Hero asset disappearing | Guaranteed layer persistence; eliminated blanket opacity fades. |
| A04 | Image overlaid like standard card | Integrated type and drawing into one unified paper plane. |
| A05 | Matrimandir cropped into trees | Custom art-directed illustration with controlled focal coordinates. |
| A06 | Repeated imagery | 12 distinct chapters with unique visual compositions. |
| A07 | Disconnected handoffs | Continuous hand-drawn line motif connecting adjacent scenes. |
| A08 | Ordinary archive cards | Tactile illustrated layers, drafting plates, and paper-cut spreads. |
| A09 | Misattributed historical plans | Verified metadata; speculative concepts explicitly labeled. |
| A10 | Misleading before/after comparisons | Authentic layered drawings with deliberate state transitions. |
| A11 | Empty interval before scenes | Constant visual presence through overlapping boundary keyframes. |
| A12 | Navigation state drift | Unified `currentProgress` controller powering both nav and stages. |
| A13 | Conventional card grids | Asymmetrical editorial spreads and interactive illustrated atlases. |
| A14 | Headline obscured by images | Strict z-index hierarchy and responsive type bounding boxes. |
| A15 | Washed-out transitions | Mask reveals and vector draw-ons replace generic opacity wipes. |
| A16 | Stranded ending image | Circular narrative loop returning visitor's mark to the opening stroke. |
| A17 | Developer jargon in UI | Completely eliminated; replaced with poetic editorial copy. |
| A18 | Disconnected demo feel | Unified paper texture, consistent linework, and continuous line metaphor. |
| A19 | Low-res Google image assets | 100% replaced by locally generated high-resolution original artwork. |
| A20 | Scene 02 blurry background | Replaced by multi-layer 16:9 illustrated panorama with alpha separation. |
