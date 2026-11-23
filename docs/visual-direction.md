# VISUAL DIRECTION & ART SYSTEM
## AUROVILLE — THE ART OF INTERACTION (Milestone 01)

### 1. Creative Concept & Atmosphere
- **Core Premise**: An experimental editorial website where visual design responds directly to scrolling and user touch/pointer interaction.
- **Identity**: A digital exhibition, architectural monograph, and high-craft publication combined.
- **Atmospheric Keywords**: Editorial · Tactile · Architectural · Minimal · Expressive · Cinematic · Refined · Unexpected.
- **Deliberate Avoidance**: No SaaS tropes, no generic card carousels, no purple glows, no floating glassmorphism blobs, no unprompted continuous 3D drift, no template grids.

---

### 2. Color System & Materiality
The color palette draws directly from the physical geography, architecture, and archival documents of Auroville:

| Token | Hex | Role | Physical Reference |
|---|---|---|---|
| **Paper** | `#F0EADF` | Primary background surface | Warm unbleached archival drawing paper |
| **Paper Light** | `#F8F4EB` | Elevated editorial layers & prints | Fresh archival cotton rag stock |
| **Paper Dark** | `#E6DFD2` | Recessed stage & subtle wells | Aged drafting board parchment |
| **Ink** | `#1B1D19` | Primary typography & deep values | Deep mineral black ink (warm undertone) |
| **Muted Ink** | `#79766C` | Editorial metadata, rules, captions | Archival letterpress pencil/graphite |
| **Faint Ink** | `#A5A196` | Micro-coordinates, structural ticks | Faded stamp / registration marks |
| **Terracotta** | `#B65F42` | Primary cultural accent | Auroville's legendary red laterite soil |
| **Forest** | `#3D5642` | Secondary ecological accent | Matrimandir peace area banyan & forest belt |
| **Gold** | `#C59A46` | Minimal architectural detail | Matrimandir gold-leaf acoustic discs |
| **Border** | `#D7D0C3` | Fine hairline rules (1px) | Archival sheet trim & framing guidelines |

---

### 3. Typographic System & Hierarchy
- **Display Serif**: `Cormorant Garamond` (Google Font)
  - Characteristics: High contrast, elegant sharp serifs, noble architectural proportions.
  - Role: Monumental hero wordmark (`AUROVILLE`), scene titles, statement editorial quotes.
- **Editorial Sans / Interface**: `Manrope` (Google Font)
  - Characteristics: Geometric yet humanist, crisp readability at micro scales (10px–12px), clear tabular numbers.
  - Role: Chapter numbers, microtypography, coordinate labels, image captions, interactive controls.

#### Scale Hierarchy (Desktop Reference 1440 × 900)
- **Cover Display**: `clamp(110px, 13vw, 220px)` — Monumental, tracking `-0.03em`.
- **Scene Display**: `clamp(64px, 8vw, 130px)` — Editorial titles, tracking `-0.02em`.
- **Editorial Statements**: `clamp(24px, 2.5vw, 42px)` — Serif italic / Roman paired, line-height `1.2`.
- **Body Text**: `16px–18px` — Clean, line-height `1.6`, maximum 68 characters per measure.
- **Captions & Metadata**: `11px–13px` — Medium weight, tracking `+0.05em`.
- **Interface / Micro Labels**: `10px–12px` — Uppercase, tracking `+0.25em`.

#### Mobile Scale Hierarchy (390 × 844)
- **Cover Display**: `clamp(56px, 16vw, 84px)` — Two-line broken editorial lockup `AURO` / `VILLE`.
- **Scene Display**: `clamp(36px, 10vw, 48px)`.
- **Body & Captions**: `14px–15px` body, `11px–12px` metadata.

---

### 4. Layout Architecture & Spatial Grid
- **Desktop System**: 12-column editorial grid.
  - Outer margins: `clamp(32px, 4vw, 64px)`.
  - Column gutters: `clamp(16px, 1.5vw, 24px)`.
  - Baseline rhythm: `8px`.
- **Asymmetry as Intent**: The compositions deliberately avoid centering every image and title. Large photographic assets break grid boundaries while metadata adheres strictly to hairline guides.
- **Physical Print Realism**: Archival imagery in Scene 02 and 03 utilizes a 1px border (`#D7D0C3`), subtle paper drop-shadow (`0 16px 40px -10px rgba(27,29,25,0.08)`), and dedicated archival indexing badges.

---

### 5. Motion Direction & Choreography
- **Principle**: All motion serves structural transformation; no decorative hovering for its own sake.
- **Deterministic Scroll-Link**: Transitions are scrubbed directly against master scroll progress (0.00 to 1.00), ensuring seamless forward and reverse navigation.
- **Persistent Visual Stage**: The Matrimandir image acts as the continuous visual protagonist connecting Scene 01, Scene 02, Scene 03, and leading into Scene 04.
- **Reduced-Motion Fallback**: When `prefers-reduced-motion: reduce` is active, animations snap cleanly to progressive scene states without disorientation.
