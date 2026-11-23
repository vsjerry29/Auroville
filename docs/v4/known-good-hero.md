# Known-Good Hero Specification (Scene 01 / CH01)

## 1. Overview
The V3 hero implemented in `components/scenes/EditorialCover.tsx` has been designated as the **approved visual foundation** for the Auroville digital experience. It establishes the editorial tone, typographic power, and physical paper atmosphere for the entire 12-chapter journey.

---

## 2. Preserved Elements & Structural Blueprint

### 2.1 Monumental Typography
- **Top Display Heading:** `AURO` in `Archivo Black`, tracking `-0.06em`, line-height `0.82`, text color `#191917` (Ink).
- **Secondary Display Heading:** `VILLE` right-aligned, interlocking with `AURO`.
- **Editorial Subtitle:** *"Where architecture becomes an inner inquiry"* in `Instrument Serif` italic.
- **Eyebrow Meta:** `01 / MONOGRAPH — AN EXPERIMENT IN HUMAN UNITY` and `EDITION · ARCHIVAL DIGITAL PUBLICATION` in `Manrope` monospace tracking `0.25em`.

### 2.2 Physical Paper Ground
- Warm paper background token `#F6F3EB` with subtle micro-grain paper texture.
- Zero harsh modern CSS dropshadows.
- Natural archival shadows (`rgba(25, 25, 23, 0.08)` to `0.14`).

### 2.3 Integrated Illustration Layers
1. **Centenary Banyan Tree (`banyan-tree.webp`):**
   - Anchors the lower-right quadrant under `VILLE`.
   - Ink linework featuring expansive canopy branches and aerial hanging roots.
   - Sized at `44vw` (max `720px`) with desktop pointer-proximity parallax.
2. **Artisan Potter (`potter.webp`):**
   - Anchors the lower-left negative space beneath the `U` and `R` of `AURO`.
   - Hand-drawn study of an artisan shaping terracotta on a wooden workbench.
   - Micro-caption: `MAKING & MATERIALITY · TERRACOTTA`.
3. **Central Architectural Portal (`matrimandir-study.webp`):**
   - Elevation line study of the Matrimandir geodesic dome nestled between `AURO` and `VILLE`.
   - Subtle golden acoustic discs hand-drawn on the dome.
   - Centered drafting compass arcs and radial lines rendered via SVG stroke path.

### 2.4 Grounding Editorial Statement
- Bottom-left editorial block:
  - Heading: *"A place still becoming."* (Instrument Serif italic, `text-3xl md:text-4xl`).
  - Paragraph: *"Founded in 1968 on a barren red plateau in southern India. An experimental township dedicated to human unity, architecture, and ecological regeneration."*
- Bottom-right invitation:
  - Terracotta indicator pulsing dot with `SCROLL TO ENTER ILLUSTRATION`.

---

## 3. V4 Handoff Connection to Chapter 02
To satisfy Interactions **I009** and **I010**:
- As the user scrolls from `0.00` to `0.22`, a precise pencil line emerges from the central architectural study.
- This line sweeps horizontally across the warm paper ground toward the right edge of the screen.
- At the transition boundary (`progress = 0.20 – 0.22`), this line aligns exactly with the folding paper edge of Chapter 02 (`The Page Opens`).
- This guarantees zero visual discontinuity or blank flash between scenes.
