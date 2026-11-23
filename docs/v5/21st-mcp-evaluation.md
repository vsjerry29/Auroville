# 21ST.DEV MCP EVALUATION & COMPONENT INTEGRATION MANIFEST
**Date:** 23 November 2026  
**Environment:** Google Antigravity with connected 21st MCP Server

---

## 1. Discovery & Entitlement Audit

1. **Tool Discovery:**
   - Evaluated registered tools: `search`, `get_component`, `get_inspiration`, `get_usage`, `search_picker`, `search_logo`, `get_theme`, `bookmark`, etc.
   - Entitlement status: Free tier quota verified. 2 full component retrievals completed (`Luminous Topography` #23412 and `Svg follow scroll` #7288). Unlimited metadata search is active.
2. **Usage & Limits Strategy:**
   - Component retrieval completed for primary interaction candidates.
   - Full TypeScript source inspected and adapted directly into the Auroville codebase.
   - No unnecessary generic template installs; all mechanisms are restyled to the custom Auroville design system.

---

## 2. Component Candidate Evaluation

### A. Selected Component 01: Luminous Topography (Motiq / rmahammad)
- **Catalog ID:** `23412`
- **Preview:** `https://cdn.21st.dev/rmahammad/luminous-topography/default/preview.1785414427410-6a3af5f4-ba4c-419a-bdee-dfb6e7d462b9.png`
- **License:** MIT (Zero runtime dependencies)
- **Mechanism Extracted:**
  - Deterministic Catmull-Rom cubic bezier algorithm calculating organic elevation contours around focal coordinates.
  - Performance: Pointer tracking writes CSS variables (`--lt-cx`, `--lt-cy`, `--lt-cursor`) via `requestAnimationFrame` with zero React state updates or re-renders.
  - Battery/Tab Optimization: `useVisibilityPause` hook pausing calculations when offscreen or when tab is hidden.
  - Safe Area Masking: Radial safe zone where contour density thins so editorial typography remains legible.
  - Accessibility: Synchronous `useReducedMotion` support.
- **Auroville Customization:**
  - Replaced blue neon/dark theme with warm graphite (`rgba(58, 56, 52, 0.14)`), burnt terracotta (`#B75E3F`), and drafting ochre on archival ivory paper (`#F8F5EE`).
  - Reduced line density to 6–10 intentional terrain and architectural drafting curves.
  - Integrated into `LivingContourField.tsx` as a chapter-aware background with variants: `hero-draft`, `landscape-topography`, `structure-elevation`, and `earth-strata`.

---

### B. Selected Component 02: SVG Follow Scroll (reuno-ui / larsen66)
- **Catalog ID:** `7288`
- **Preview:** `https://cdn.21st.dev/larsen66/svg-follow-scroll/default/preview.1757692770066.png`
- **License:** MIT
- **Mechanism Extracted:**
  - Scroll-linked SVG path tracer using `strokeDashoffset` and `pathLength` mapped to scroll progress.
- **Auroville Customization:**
  - Replaced the arbitrary zigzag doodle with a single continuous narrative trace: from the Matrimandir elevation geometry in CH01 → the winding red earth trail in CH02 → the geodesic disc perimeter in CH03 → the subterranean taproot in CH04.
  - Eliminates visual breaks and replaces cross-fades with real graphic continuity.

---

### C. Rejected Component Candidates & Reasons

| Component | Catalog ID | Reason for Rejection |
|---|---|---|
| **Dot Grid / Kinetic Grid** | #18420 | Explicitly prohibited by User and V5 spec ("The user explicitly dislikes unnecessary dots, decorative UI and cheap-looking effects"). |
| **Topo Field (WebGL iframe)** | #25632 | Sandboxed WebGL iframe causes heavy GPU overhead and fails crisp print rendering on high-DPI displays. Pure SVG is superior. |
| **Grid Pattern Spotlight** | #31024 | Fabricates generic SaaS card aesthetics with glowing circle pointer trails. Unsuitable for organic editorial craft. |
| **Background Paper Shaders** | #14220 | Heavy WebGL shader creates battery drain and unnatural sheen. Fine SVG vector grain and CSS paper texture provide better tactile authenticity. |
