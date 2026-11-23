# Reference Study & Transferable Interaction Principles

## 1. Editorial Storytelling References

### Reference A: Vietnamese Conical Hat (*Nón Lá*) — `vnconicalhat.site`
- **What to study:** 
  - Dynamic interplay between large-scale editorial typography and delicate hand-drawn figure illustrations.
  - Generous negative space that allows illustrations to breathe without feeling sparse.
  - The avoidance of repetitive SaaS card grids; every section feels like a newly turned page of a high-end publication.
- **Transferable Principle:** 
  - Treat each chapter as a custom editorial spread. Use hand-drawn elements as structural anchors and let typography align with architectural or natural contours.
- **What to Reject:** 
  - Do not reproduce Vietnamese cultural motifs, exact layouts, or color palettes.

### Reference B: The Boat — Matt Huynh (`matthuynh.com/stories/theboat-9rw43`)
- **What to study:** 
  - Somber, tactile ink washes and dynamic calligraphic linework.
  - Pacing that uses the momentum of scroll to advance graphic novel panels and atmospheric mood.
- **Transferable Principle:** 
  - Use ink weight and line density to convey structural weight. A line can start delicate like a pencil guide and thicken into ink as human activity or water enters.

### Reference C: Ten Years Away (`ten.375.studio/en`)
- **What to study:** 
  - Smooth chapter transitions and comic-book panel layout transitions that respond smoothly to wheel input.
- **Transferable Principle:** 
  - Maintain a persistent journey controller where chapters lock into authoritative scroll bounds and reverse scrolling is completely deterministic.

---

## 2. Technical Demonstrations Mapped to Chapters

| Ref ID | Demo / Tutorial | Core Mechanic | Auroville V4 Application |
|---|---|---|---|
| **R01** | Codrops *OnScrollPathAnimations* | SVG `stroke-dashoffset` linked to scroll progress | The continuous hand-drawn pencil line connecting CH01 → CH02 → CH03. |
| **R03** / **R04** | Codrops *SVGMaskScrollTransition* | Responsive SVG clip-path driven by GSAP ScrollTrigger | The paper fold opening in CH02 and botanical canopy reveals in CH05. |
| **R05** / **R12** | Codrops *PageFlipLayout* | Physical page-turn geometry rendered in flat 2D | Tactile paper-tab and page-edge peel in CH02 and CH07. |
| **R06** | Codrops *Organic Shape Morph* | Smooth SVG path interpolation between geometry | Concentric architectural circles morphing into topographic earth contours (CH03 → CH04). |
| **R08** | Codrops *ImageRevealHover* | Localized mask reveals beneath the pointer | Graphite cross-hatching inspection in CH01 (I001) and dust-wipe in CH04 (I032). |
| **R11** | Codrops *FullImageReveal* | Discrete item-to-focus expansion | Click-to-focus inspection modal without layout thrashing. |

---

## 3. Interaction Quality Rules
1. **No Scroll-Jacking:** Standard document scroll must remain fluid and reversible.
2. **Deterministic Reversibility:** Scrolling backward must precisely undo forward animation states.
3. **Restrained Parallax:** Background and foreground layers must never drift by more than 4%–8% of the viewport; avoid dizzying motion.
4. **Touch & Keyboard Parity:** Every draggable slider or hotspot must have an accessible arrow-key and tap equivalent.
