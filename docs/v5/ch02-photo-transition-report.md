# Auroville — Chapter 02 Rebuild: Illustrated to Real Photo Transition
## Master Creative & Technical Verification Report

**Date:** November 24, 2026  
**Scope:** Chapter 02 (The Page Opens / Drawing into Reality) Rebuild  
**Core Target Asset:** Real Matrimandir sunlit photograph (`public/photos/matrimandir-real.jpg`)  
**Illustrated Counterpart:** Master architectural watercolor and fine ink line art (`public/illustrated/ch02-page/matrimandir-illustrated.jpg`)  

---

## 1. Creative Concept & Narrative Arc

Chapter 02 represents a signature storytelling moment: **the imagined Auroville drawing becomes the real Matrimandir**.

The experience achieves a 3-stage evolution:
1. **The Architectural Dream (Chapter 01):** Pure graphite elevation drafting study with radial compass axes and baseline.
2. **The Living Illustrated Vision (Chapter 02 Phase A & B):** Full hand-drawn watercolor and black ink artwork with manicured green lawn, framing tree canopy, terracotta ramps, and watercolor golden discs.
3. **The Physical Reality (Chapter 02 Phase C & D):** The real sunlit photograph reveals progressively outward from the golden dome, through the ramps and lotus petals, to the dense forest and radiant afternoon sky.

---

## 2. Technical Architecture & Transition Choreography

### 2.1 1:1 Compositional Matching
- **Dome Geometry:** The golden geodesic sphere is centered horizontally at `50.5%` and vertically at `42%`, matching within 1–2% between illustration and photograph.
- **Ramps & Amphitheater:** Four terracotta sandstone ramps and the central entrance align directly with the marble lotus petal plaza floor.
- **Framing:** The upper-left overhanging tree canopy and background forest tree line maintain identical perspective.

### 2.2 Radial Mask Light Wave
- The transition is driven by a localized radial mask expanding from the golden dome center `(50.5%, 42%)`:
  ```css
  mask-image: radial-gradient(circle at 50.5% 42%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${maskRadius}%, rgba(0,0,0,0) ${maskRadius + feather}%)
  ```
- **Phase A (0%–22% local):** Illustrated reveal. Pure hand-drawn artwork with subtle pointer parallax.
- **Phase B (22%–42% local):** Alignment & living detail. Composition settles into the exact photographic framing; Chapter 01 drawn baseline guides the eye into the central lotus petals.
- **Phase C (42%–78% local):** Progressive transformation:
  - **42%–55%:** Photographic color and light emerge in the dome area, revealing concave golden discs reflecting afternoon sun.
  - **55%–68%:** Photographic texture sweeps down the sandstone ramps and reveals the white marble lotus petals and lawn.
  - **68%–78%:** Surrounding trees and sky resolve into the photograph.
  - **Architectural Linework Overlay:** A fine graphite linework layer (`mix-blend-mode: multiply`) floats over the emerging photo before smoothly dissolving.
- **Phase D (78%–100% local):** Full photographic hold in sunlit clarity, accompanied by a subtle camera push-in (`scale(1.06)` -> `scale(1.085)`).

---

## 3. Required Review Deliverables (Screenshots & Video)

| State | Milestone | Screenshot Path | Verified Composition & Narrative State |
| :--- | :--- | :--- | :--- |
| **01** | CH01 Final Transition Frame | [01_ch01_final_transition_frame.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/01_ch01_final_transition_frame.png) | AURO VILLE parted outward in solid black ink; centered Matrimandir elevation drawing commands viewport center. |
| **02** | CH02 Illustrated Start | [02_ch02_illustrated_start.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/02_ch02_illustrated_start.png) | Full hand-drawn watercolor & ink illustration of Matrimandir in landscape, centered dome and ramps matching State 01. |
| **03** | CH02 Aligned Illustrated Composition | [03_ch02_aligned_illustrated_composition.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/03_ch02_aligned_illustrated_composition.png) | Composition settles into exact photographic framing; baseline path connects to central lotus petals; quiet margin caption established. |
| **03b** | Interactive Discovery Inspection | [03b_ch02_dome_discovery_card.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/03b_ch02_dome_discovery_card.png) | Clicking the dome opens the archival "Geodesic Sphere · 1,415 Gilded Discs" card; margin caption yields with zero overlap. |
| **04** | Mid-Transition (Dome Photo / Ramps Illustrated) | [04_ch02_mid_transition_dome_photo.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/04_ch02_mid_transition_dome_photo.png) | **The Key Moment:** Golden discs in the dome are sunlit real photo, ramps and trees remain illustrated, delicate drafting linework lingers over dome. |
| **05** | CH02 Nearly-Complete Transition | [05_ch02_nearly_complete_transition.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/05_ch02_nearly_complete_transition.png) | Sandstone ramps, marble lotus petals, lawn, and sky transition into photograph; caption updates to `MATRIMANDIR · 1971–2008 · PEACE AREA`. |
| **06** | CH02 Final Full-Photo Frame | [06_ch02_final_full_photo_frame.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/06_ch02_final_full_photo_frame.png) | Full photographic hold in pristine clarity with archival plaque in margin. Zero bleed from Chapter 03. |
| **07** | Reconstituted Reverse Scroll | [07_reverse_scroll_hero_reconstituted.png](file:///d:/Auroville/docs/v5/screenshots/ch02_photo_transition/07_reverse_scroll_hero_reconstituted.png) | Reversible scrolling back from 44% to 0% reconstitutes Chapter 01 hero without glitch or layout shift. |

### Video Screen Recording
- **File Link:** [ch01_to_ch02_photo_transition.webm](file:///d:/Auroville/docs/v5/recordings/ch01_to_ch02_photo_transition.webm)
- **Format:** Native Playwright recording at 1440x900, 60fps capturing the complete forward and reverse scroll sweep from Chapter 01 through the photo transition into the final hold.

---

## 4. Prohibited Tells & AI Slop Checklist

- [x] **Zero Blank Wipes:** The transformation takes place directly within the artwork itself; no blank white/ivory sheets.
- [x] **Zero Permanent Hotspot Circles:** No pulsating button dots or target rings over the dome or landscape. Subjects are directly interactive.
- [x] **Zero Red CAD Vector Arcs:** Replaced with delicate hand-drawn pencil stippled trail that connects Chapter 01 into the lotus petals.
- [x] **Zero Text Collisions:** Archival plaques are pinned cleanly in margins and automatically yield when discovery dialogs open.
- [x] **Zero Abrupt Jump Cuts:** Compositional 1:1 alignment between Chapter 01 elevation drawing, Chapter 02 illustration, and Chapter 02 photograph ensures seamless visual continuity.
