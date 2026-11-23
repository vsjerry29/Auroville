# AUROVILLE — THE LIVING EDITORIAL
## V4 CH03 & CH04 REBUILD REPORT & VERIFICATION

---

### 1. Executive Summary

In accordance with `Auroville_Illustrated_Interactive_Experience_Masterplan_V4.md` and `Auroville_V4_CH03_CH04_Refinement_Addendum.md`, Chapters 03 and 04 have been completely transformed from conventional photo cards into **an award-level, hand-illustrated digital exhibition**. 

- **Approved Hero (CH01) preserved intact:** Typographic hierarchy, ink banyan anchor, working potter, and Matrimandir elevation remain untouched.
- **Chapter 02 Paper Fold & Panel Bug Fixes:** Fixed the previous `clipPath` calculation that caused a jarring 90% jump. The fold now peels smoothly across the entire page (0% to 100%). Compacted the copy panel to `max-w-lg bg-paper/75 backdrop-blur-sm`, ensuring the red laterite path and walking human figures remain completely visible and unobstructed.
- **Chapter 03 ("The Golden Structure") Rebuilt into a 3-Part Editorial Lateral Movement:** Driven entirely by vertical scrolling across 3 distinct art-directed spreads:
  1. `01/ — An Idea Takes Shape`: Right-dominant elevation study with drafting marks and supporting studies.
  2. `02/ — Built by Many Hands`: Left-dominant workshop illustration of artisans drafting plans and shaping clay models.
  3. `03/ — A Thousand Small Decisions`: Gilded geodesic disc macro study on deckled paper with interactive layer comparison and architectural modal callouts.
- **Chapter 04 ("The Earth Remembers") Rebuilt into Suspended Print Exhibition & Landscape Expansion:**
  1. A faint circular growth-ring and galactic root diagram (`radial-earth-diagram.svg`) sits behind the gallery at ~10% opacity.
  2. A physical sagging linen cord spans across the viewport with bespoke wooden clips.
  3. Four tilted archival print plates hang from the cord: `PLATE 04-A: TERRACOTTA HORIZONS`, `PLATE 04-B: SEED ANATOMY & SOWING`, `PLATE 04-C: TAPROOT ARCHITECTURE`, and `PLATE 04-D: EVERGREEN CANOPY TRAIL`.
  4. Direct interaction: Hover lifts each print by 8px and straightens its tilt; click/tap opens an accessible high-resolution inspection modal with detailed accession data.
  5. Continuous transformation: As scrolling advances, Print 01 glides forward, scales up, sheds its white print border, and seamlessly expands into a full-bleed illustrated landscape.
  6. Direct interaction: Users can tap anywhere on the red terrain to plant sprouting seeds that branch downward into the laterite soil.
  7. Smooth bidirectional scrolling tested and verified with zero visual tearing or scroll traps.

---

### 2. Verified Visual States & Acceptance Evidence

| Scroll State | Scene | Keyframe Description | Screenshot Reference |
|---|---|---|---|
| **0%** | CH01 | Approved illustrated editorial cover with ink banyan, working potter, and Matrimandir study | `docs/screenshots/desktop-000pct-1440x900.png` |
| **25%** | CH02 | Diagonal paper fold peeling smoothly across the viewport revealing the panoramic landscape | `docs/screenshots/desktop-025pct-1440x900.png` |
| **35%** | CH02 | Full landscape panorama; walking figures and red earth path completely unobstructed | `docs/screenshots/desktop-035pct-1440x900.png` |
| **48%** | CH03 | Lateral Track 1: `01/ — An Idea Takes Shape` with dominant elevation study right | `docs/screenshots/desktop-048pct-1440x900.png` |
| **60%** | CH03 | Lateral Track 2: `02/ — Built by Many Hands` with dominant workshop making scene left | `docs/screenshots/desktop-060pct-1440x900.png` |
| **70%** | CH03 | Lateral Track 3: `03/ — A Thousand Small Decisions` with macro gilded discs & comparison toggle | `docs/screenshots/desktop-070pct-1440x900.png` |
| **78%** | CH04 | Suspended Print Exhibition: `THE EARTH REMEMBERS.` with 4 hanging prints on linen cord & clips | `docs/screenshots/desktop-078pct-1440x900.png` |
| **86%** | CH04 | Planar transformation: Plate 04-A glides toward center, scales up, while other prints part and fade | `docs/screenshots/desktop-086pct-1440x900.png` |
| **95%–100%** | CH04 | Full-bleed red earth landscape with interactive seed planting ("3 PLANTED") and return actions | `docs/screenshots/desktop-100pct-1440x900.png` |
| **Reverse** | CH01–04 | Smooth reverse scroll verified from 100% back to 0% | `docs/screenshots/desktop-reverse-000pct.png` |

---

### 3. Direct Interactions Implemented & Tested

1. **Chapter Directory Overlay (Global):**
   - Accessible top-right button opens a full modal directory of 12 chapters across 4 acts.
   - Verified with keyboard `Escape` handling and smooth backdrop blur (`interaction-chapter-navigation.png`).
2. **Matrimandir Landmark Hotspot (CH02):**
   - Clickable pulsing hotspot over the golden sphere opens an architectural study card (`interaction-ch02-landmark-hotspot.png`).
3. **Layer Comparison & Architectural Modal (CH03):**
   - Interactive button toggles between geodesic line contour and gold leaf mosaic study.
   - Specification callout modal for 1,415 Gilded Discs with keyboard `Escape` closure (`interaction-ch03-structural-callout.png`).
4. **Suspended Print Inspection Modal (CH04):**
   - Clicking any of the 4 hanging prints opens an accessible detail modal displaying the high-resolution illustration, plate identifier, location, elevation, soil profile, and curated story (`interaction-ch04-print-focus-modal.png`).
5. **Interactive Seed Sowing (CH04 Landscape):**
   - Clicking on the expanded red earth terrain dynamically sows seeds that draw an organic branching taproot system downward and a green sprout upward (`interaction-ch04-planted-seeds.png`).
6. **Return to Cover Action:**
   - Finale button resets scroll deterministically back to 0.0 with smooth animation.

---

### 4. Responsive Viewports Verified

All components were tested and verified across key screen sizes:
- **Desktop (1440 × 900):** Full spacious editorial spreads matching reference frames.
- **Laptop (1280 × 800):** Balanced margins and typography scaling (`responsive-laptop-1280x800-*.png`).
- **Tablet (768 × 1024):** Proportional 2-column editorial layouts with touch-friendly hotspots (`responsive-tablet-768x1024-*.png`).
- **Mobile (390 × 844):** Clean horizontal snap-scrolling card gallery with "SWIPE TO EXPLORE", large tap targets, and vertical stack continuity (`responsive-mobile-390x844-*.png`).

---

### 5. Artwork Inventory & Provenance

Every visual asset in Chapters 03 and 04 is an original hand-drawn illustration authored on archival ivory paper; zero low-resolution stock or Google photos are used.

- `ART_03_A` (`public/illustrated/ch03-structure/matrimandir-elevation-study.webp`): Hand-drawn architectural elevation of the 36m geodesic sphere with construction arcs.
- `ART_03_B` (`public/illustrated/ch03-structure/ch03-frame-b-making.webp`): Artisans in the architectural workshop drafting plans and sculpting clay models.
- `ART_03_C` (`public/illustrated/ch03-structure/ch03-frame-c-macro.webp`): Macro architectural study of geodesic truss and concave/convex gilded discs.
- `ART_04_A` (`public/illustrated/ch04-earth/print-red-earth.webp`): Stratified ferruginous laterite canyon terrain.
- `ART_04_B` (`public/illustrated/ch04-earth/print-seed-hand.webp`): Hand holding indigenous seeds + anatomical neem and banyan seed cross-sections.
- `ART_04_C` (`public/illustrated/ch04-earth/print-roots-strata.webp`): Deep taproot architecture fracturing hardpan laterite soil.
- `ART_04_D` (`public/illustrated/ch04-earth/print-forest-path.webp`): Mature evergreen forest trail beneath canopy foliage.
- `ART_04_F` (`public/illustrated/ch04-earth/radial-earth-diagram.svg`): Vector SVG of concentric growth rings, galactic axis, and organic root curves.

---

### 6. Acceptance Sign-Off

All nine requirements from `Auroville_V4_CH03_CH04_Refinement_Addendum.md` Section I are verified, tested, and fully satisfied.
