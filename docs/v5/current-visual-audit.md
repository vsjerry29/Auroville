# AUROVILLE V5 — CURRENT VISUAL AUDIT & PROBLEM DIAGNOSIS
**Date:** 23 November 2026  
**Source Material:** `Screen Recording 2026-11-23 203307.mp4`, extracted frames in `video_review_pack/video_review_frames/`, and live codebase inspection.

---

## 1. Frame-by-Frame Video Audit Findings

### 01. Hero Start (`00:00–00:01.6`, `01-hero-start_0.0s.jpg`)
- **Observed Strengths:** Bold, confident `AURO / VILLE` typography; high-fidelity hand-drawn banyan tree; authentic ink potter; detailed Matrimandir pencil study.
- **Critical Defects:**
  1. *Microtexture clutter:* Faint uniform dotted background (`.paper-texture`) applied as wallpaper across the entire screen.
  2. *Drafting decoration excess:* Oversized concentric dashed circles and crosshair lines around the Matrimandir sphere that mimic generic telemetry/target circles.
  3. *Redundant copy & labels:*
     - Eyebrow labels: `01 / MONOGRAPH — AN EXPERIMENT IN HUMAN UNITY` and `EDITION · ARCHIVAL DIGITAL PUBLICATION`.
     - Right annotation: `Where architecture becomes an inner inquiry`.
     - Figure label: `MAKING & MATERIALITY · TERRACOTTA`.
     - Botanical label: `BOTANICAL ANCHOR · FICUS BENGHALENSIS`.
     - Lower left prose: Paragraph + circular `N` widget + duplicated `A PLACE STILL BECOMING`.
     - Bottom bar: `01 ---- 04`, `SCROLL TO DISCOVER`, `0%`.
- **V5 Resolution:** Preserve the bold lettering and authentic drawings. Strip all decorative dots, crosshairs, concentric target rings, and redundant labels. Leave only the subtle top wordmark and clean chapter indicator. Replace the decorative dotted background with `LivingContourField`: subtle graphite/terracotta terrain contours that react gently (2–6px) to the cursor.

---

### 02. Hero Exit & Transition Dead Zone (`00:01.6–00:03.2`, `02-hero-gap-concentric-rings_2.4s.jpg`)
- **Critical Defects:**
  1. As the letters and figures fade out, the composition completely loses its anchor.
  2. The visitor is left looking at an isolated, small Matrimandir dome surrounded by empty cream canvas and dominant dashed concentric rings.
  3. It feels like an empty waiting screen or loading state.
- **V5 Resolution:** Keep the architectural study grounded and proportional. Enlarge its presence and directly unroll its structural linework into the opening page peel of Chapter 02. The transition becomes an unbroken, continuous linework-to-landscape expansion with zero dead zones.

---

### 03. Chapter 02 Paper Reveal (`00:03.2–00:04.8`, `03-paper-unfold-midpoint_4.8s.jpg`)
- **Critical Defects:**
  1. The opening begins as a narrow, awkward vertical sliver on the left edge with a small "PEEL PAGE" button.
  2. The right 60% of the viewport is completely blank off-white paper.
  3. The fold lacks physical depth (paper shadow, curled edge, back-of-page texture).
- **V5 Resolution:** Ensure the paper fold reveals a substantial, richly colored landscape early in the scroll progression. Enhance the fold line with subtle cast shadow and genuine paper texture.

---

### 04. Chapter 02 Panorama & Opaque Text Panel (`00:04.8–00:06.5`, `04-panorama-text-panel_6.4s.jpg`)
- **Critical Defects:**
  1. A large solid cream text panel (`From a single mark, AN ILLUSTRATED WORLD`) sits over the lower-left landscape, blocking the red path and walking human figures.
  2. An arbitrary red arc curves through the air above the trees.
  3. The landscape is mostly static once revealed.
- **V5 Resolution:** Remove the opaque panel. Integrate a small, compact caption into a naturally quiet margin. Split the panorama into responsive foreground/midground depth layers. Introduce interactive responsiveness where moving the cursor near the red-earth trail illuminates fine ink hatching along the pathway.

---

### 05. Chapter 03 Technical Slideshow Appearance (`00:07.2–00:12.0`, `05-chapter03-first-frame_7.2s.jpg`, `06-chapter03-makers-state_10.4s.jpg`)
- **Critical Defects:**
  1. The chapter presents as three framed print cards arranged across a horizontal scroll track, resembling a presentation deck or portfolio slider.
  2. Dominant illustrations are constrained within heavy grey card borders.
  3. Competing thumbnails, large numbers (`01/`, `02/`, `03/`), and status banners clutter the viewport.
- **V5 Resolution:** Rebuild Chapter 03 as **one continuous, evolving architectural drawing**. The elevation study expands directly into the workshop making scene, which then resolves into the macro gold disc study. Seamless outlines and shared compass arcs connect the three states without slide borders.

---

### 06. Transition to Chapter 04 (`00:12.0–00:13.2`, `contact_sheet_2.jpg` at 12.8s)
- **Critical Defects:**
  1. A pale, washed-out opacity cross-fade washes over the scene.
  2. Visual elements disconnect rather than transforming into the next environment.
- **V5 Resolution:** The curved perimeter of the geodesic discs physically unrolls to become the suspension cord and earth horizon for Chapter 04.

---

### 07. Chapter 04 Static Hold & Abrupt Soil Zoom (`00:13.6–00:21.8`, `08-chapter04-hanging-prints_13.6s.jpg`, `10-chapter04-soil-zoom_20.0s.jpg`)
- **Critical Defects:**
  1. The four hanging print cards remain almost completely static across 5+ seconds of scroll.
  2. Giant heading `THE EARTH REMEMBERS.` dominates disproportionately.
  3. Faint decorative concentric circles sit behind the prints.
  4. At the end, the soil profile card suddenly snaps/zooms to fill the screen with awkward portrait-crop borders.
- **V5 Resolution:**
  - Balance typography: Replace oversized heading with an expressive, elegant headline integrated into the landscape.
  - Eliminate decorative background rings; replace with organic subterranean root and soil contours.
  - Active physical interaction: As scrolling progresses, the hanging prints smoothly glide and peel away while Plate 04-A expands through a continuous mask into a full-bleed panoramic red earth geological terrain.
  - Interactive seed planting: Visitors click/tap on the living red earth to plant seeds, sprouting green shoots and branching roots into the laterite.
