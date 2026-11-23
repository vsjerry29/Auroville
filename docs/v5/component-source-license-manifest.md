# 21ST MCP COMPONENT SOURCE & LICENSE MANIFEST
**Date:** 23 November 2026

---

## 1. Retrieved & Adapted Components

### A. Luminous Topography
- **Author:** rmahammad (Motiq - https://motiq.dev)
- **Catalog ID:** 23412
- **License:** MIT License
- **Copyright:** (c) 2026 Motiq / rmahammad
- **Source Module:** `https://21st.dev/r/rmahammad/luminous-topography`
- **Adapted File in Project:** `components/experience/LivingContourField.tsx`
- **Integration Notes:**
  - Inlined deterministic Catmull-Rom cubic bezier algorithm.
  - Zero runtime dependencies (`clsx`, `tailwind-merge` already in project).
  - Modified colors to Auroville graphite (`#3A3834`), terracotta (`#B75E3F`), and ochre on ivory.
  - Added chapter-aware focal points and scroll-progress morphing.

### B. SVG Follow Scroll
- **Author:** reuno-ui / larsen66 (Skiper UI)
- **Catalog ID:** 7288
- **License:** MIT License
- **Copyright:** (c) 2025 reuno-ui
- **Source Module:** `https://21st.dev/r/reuno-ui/svg-follow-scroll`
- **Adapted File in Project:** `components/interactions/SvgStrokePath.tsx` & `components/experience/LivingContourField.tsx`
- **Integration Notes:**
  - Extracted scroll-linked `pathLength` and `strokeDashoffset` mechanics.
  - Replaced demo paths with custom Auroville narrative arcs.
