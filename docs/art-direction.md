# ART DIRECTION SPECIFICATION — V3
## AUROVILLE — A PLACE STILL BECOMING

### 1. Vision & Mixed-Media Identity
This experience is conceived as an independent fine-art and architectural digital publication. Rather than defaulting to a luxury serif or a standard architecture portfolio, the art direction combines:
- **Massive Graphic Typography**: Ultra-bold, confident display lettering (`Archivo Black`) inspired by editorial monograph benchmarks such as *Nón Lá (Vietnamese Conical Hat)*.
- **Original Observational Illustrations**: Archival black ink and graphite cross-hatching drawings produced specifically for this theme (Centenary Banyan tree, artisans at work, technical Matrimandir elevation studies, and galaxy plan drawings).
- **Authentic Documentary Photography**: Restrained, architectural and ecological photography depicting Auroville's genuine landscape, crafted terracotta, modern architecture, and peace area.
- **Tactile Materiality**: Unbleached warm paper (`#F6F3EB`), aged drafting parchment (`#EDE6D8`), mineral ink (`#191917`), and accents of raw terracotta laterite (`#B75E3F`) and forest canopy (`#435A45`).

---

### 2. Typographic System & Hierarchy
- **Primary Display Wordmark & Headlines**: `Archivo Black` (Google Font)
  - Character: Heavy, geometric, commanding, immediate visual punch.
  - Scale: `clamp(72px, 18vw, 240px)` for the opening `AUROVILLE` cover composition.
- **Editorial Statements & Literary Accents**: `Instrument Serif` (Google Font, Italic)
  - Character: Poetic, refined, humanist contrast to the monumental grotesque.
  - Scale: `clamp(24px, 3.5vw, 48px)`.
- **Interface, Captions & Data**: `Manrope` (Google Font)
  - Character: Clean, highly legible, engineered spacing for micro-labels.
  - Scale: `10px–12px` (uppercase, letter-spacing `0.22em`), `14px–16px` for body copy.

---

### 3. Color Token System

| Token | Hex | Role | Physical Reference |
|---|---|---|---|
| **Paper Base** | `#F6F3EB` | Primary background canvas | Fine unbleached cotton rag print stock |
| **Paper Alt** | `#EDE6D8` | Archival well & under-layers | Aged drafting board parchment |
| **Ink** | `#191917` | Primary typography & line art | Mineral carbon printing ink |
| **Muted Ink** | `#6B6960` | Captions, metadata, guidelines | 2B graphite pencil annotations |
| **Terracotta** | `#B75E3F` | Primary cultural accent | Raw laterite soil of the Auroville plateau |
| **Forest** | `#435A45` | Secondary ecological accent | Indigenous tropical dry evergreen canopy |
| **Warm Gold** | `#C39B57` | Architectural detail accent | Gilded acoustic discs of Matrimandir |
| **Border** | `#DFD9CC` | Hairline dividers & sheet trim | Precision draftsperson rules |

---

### 4. Illustration System & Role Allocation

| Illustration Asset | Source File | Placement | Visual Role |
|---|---|---|---|
| **Centenary Banyan Tree** | `public/art/botanical/banyan-tree.webp` | Scene 01 (Right) | Massive botanical anchor interacting naturally with `AUROVILLE` typography |
| **Artisan / Potter** | `public/art/people/potter.webp` | Scene 01 (Lower-Left) | Hand-shaping clay, grounding the philosophical premise in human making |
| **Matrimandir Architectural Study** | `public/art/architecture/matrimandir-study.webp` | Scene 01 Portal → Scene 02 | Accurate geometric elevation with compass arcs, transforming into real photography |
| **Architect / Draftsperson** | `public/art/people/architect.webp` | Scene 03 (Margin) | Observational drawing of architect studying plans, reinforcing documentary atmosphere |
| **Galaxy Plan Concept Study** | `public/art/architecture/galaxy-plan.webp` | Scene 03 (Archive) | Original conceptual drawing of Roger Anger's galaxy spiral urban plan |
| **Botanical & Drafting Specimens** | `public/art/details/*.webp` | Scene 03 & Scene 04 | Banyan leaves, neem branches, and drafting protractor framing negative space |

---

### 5. Transition & Interaction Matrix
1. **Scene 01 (The Beginning)**:
   - Primary: Illustrated editorial cover with subtle mouse parallax (6–14px).
   - Scroll Transition: Typography shifts outward; architectural drawing smoothly scales into the opening frame of Scene 02.
2. **Scene 02 (Into the Frame)**:
   - Primary: Drawing-into-reality reveal. Real photography expands through the sketch silhouette while drafting axes remain as subtle structural details.
   - Second Interaction: Photograph contracts into an editorial print on warm paper; supporting detail photo enters to balance the spread.
3. **Scene 03 (Fragments of Time)**:
   - Primary: Tactile layered-document reveal. Visitor drags an upper archival print aside (mouse, touch, or arrow keys) to reveal the 2004 concrete framing document beneath.
   - Realignment: Prints return to 0° rotation and transition cleanly into the Scene 04 spread.
4. **Scene 04 (Perspectives)**:
   - Primary: 3-state shifting editorial layout (State A → State B → State C Finale).
   - Secondary: Click-to-focus curatorial inspection dialog with full provenance metadata.
   - Finale: Hero expands into an intentional closing composition with "Return to Beginning" navigation.
