export interface AtlasLocation {
  id: "matrimandir" | "bharat-nivas" | "solar-kitchen" | "visitors-centre";
  number: "01" | "02" | "03" | "04";
  name: string;
  zone: string;
  description: string;
  illustrationSrc: string;
  illustrationAlt: string;
  /** Exact calibrated coordinates in 1200x896 auroville-atlas-base.jpg space */
  pin: { x: number; y: number };
  /** Clean label anchor positioned in calm ivory/garden pocket inside view */
  labelPos: { x: number; y: number; align: "left" | "right" };
  /** Architectural leader line path from pinpoint to label tag */
  leaderPath: string;
  /** Highlighted route path drawn into view when visiting this stop */
  routePath: string;
  /** Authoritative progress target within Chapter 10 timeline (0.00 -> 1.00) */
  stopProgress: number;
  /** Safe camera transform targeting this destination on desktop (tx%, ty%, scale) */
  camera: { tx: number; ty: number; scale: number };
  /** Landmark-focused camera framing for portrait mobile viewports (< 768px) */
  mobileCamera: { tx: number; ty: number; scale: number };
}

/**
 * Calibrated directly onto the 1200x896 illustrated base plate (public/illustrated/ch10-atlas/auroville-atlas-base.jpg)
 * generated from verified OpenStreetMap landmark bearings:
 * - Matrimandir: Peace Area center (696, 398)
 * - Bharat Nivas: Due west along the horizontal avenue (331, 397)
 * - Solar Kitchen: Southern Crown spur with 15m rooftop solar bowl (698, 745)
 * - Visitors Centre: Southwest arrival along footpath into Peace Area (284, 594)
 */
export const ATLAS_LOCATIONS: AtlasLocation[] = [
  {
    id: "matrimandir",
    number: "01",
    name: "Matrimandir",
    zone: "Peace Area",
    description:
      "Golden geodesic chamber at Auroville’s center, encircled by twelve named gardens, an oval amphitheatre, and the Banyan Tree.",
    illustrationSrc: "/illustrated/ch02-page/matrimandir-illustrated.jpg",
    illustrationAlt:
      "Hand-drawn watercolor and graphite architectural illustration of Matrimandir golden sphere and sandstone ramps",
    pin: { x: 696, y: 398 },
    labelPos: { x: 912, y: 196, align: "left" },
    leaderPath: "M 696 398 L 826 196 L 906 196",
    // Inner Peace Area sanctuary ring & cardinal approach lines
    routePath: "M 538 398 L 696 398 M 696 292 A 106 106 0 1 1 695.9 292 Z",
    stopProgress: 0.08,
    camera: { tx: 0, ty: 0, scale: 1.0 },
    mobileCamera: { tx: -3, ty: 5, scale: 1.08 },
  },
  {
    id: "bharat-nivas",
    number: "02",
    name: "Bharat Nivas",
    zone: "International Zone",
    description:
      "Pavilion of India west of the Crown loop, housing stepped laterite auditoriums, exhibition galleries, and shaded courtyards.",
    illustrationSrc: "/illustrated/ch10-atlas/bharat-nivas.jpg",
    illustrationAlt:
      "Watercolor and graphite architectural drawing of Bharat Nivas stepped red laterite pavilions and colonnade courtyards",
    pin: { x: 331, y: 397 },
    labelPos: { x: 256, y: 204, align: "right" },
    leaderPath: "M 331 397 L 288 204 L 262 204",
    // Straight horizontal avenue connecting Crown West directly to Bharat Nivas dome
    routePath: "M 668 398 L 462 396 L 348 397",
    stopProgress: 0.37,
    camera: { tx: 12, ty: 2.5, scale: 1.13 },
    mobileCamera: { tx: 26, ty: 12, scale: 1.36 },
  },
  {
    id: "solar-kitchen",
    number: "03",
    name: "Solar Kitchen",
    zone: "Southern Crown",
    description:
      "Community dining hall along the southern Crown avenue crowned by a 15-meter roof solar bowl concentrator for daily meals.",
    illustrationSrc: "/illustrated/ch10-atlas/solar-kitchen.jpg",
    illustrationAlt:
      "Watercolor and graphite architectural illustration of Auroville Solar Kitchen with its rooftop 15-meter solar bowl dish",
    pin: { x: 698, y: 745 },
    labelPos: { x: 786, y: 726, align: "left" },
    leaderPath: "M 698 745 L 746 726 L 780 726",
    // Sweeping southern Crown Loop arc descending down the terrace spur to Solar Bowl
    routePath: "M 462 396 A 228 221 0 0 0 695 617 L 698 725",
    stopProgress: 0.67,
    camera: { tx: -3, ty: -13, scale: 1.14 },
    mobileCamera: { tx: -15, ty: -36, scale: 1.36 },
  },
  {
    id: "visitors-centre",
    number: "04",
    name: "Visitors Centre",
    zone: "Southwest Entry Hub",
    description:
      "Hassan Fathy Award-winning compressed-earth complex of vaulted arches welcoming visitors onto the footpath into the Peace Area.",
    illustrationSrc: "/illustrated/ch10-atlas/visitors-centre.jpg",
    illustrationAlt:
      "Watercolor and graphite architectural illustration of the Auroville Visitors Centre brick arches, Nubian vaults, and earthen courtyard",
    pin: { x: 284, y: 594 },
    labelPos: { x: 432, y: 696, align: "left" },
    leaderPath: "M 284 594 L 364 696 L 426 696",
    // Arrival path winding into the Visitors Centre gate and onward along the Viewpoint footpath
    routePath:
      "M 76 674 Q 124 584 224 544 L 294 522 L 284 594 M 294 522 Q 380 478 462 436 Q 508 408 566 398",
    stopProgress: 0.93,
    camera: { tx: 13, ty: -7.5, scale: 1.14 },
    mobileCamera: { tx: 24, ty: -22, scale: 1.38 },
  },
];

/** Neighboring woodland canopy centers for gentle proximity ink detail reveal (Layer 02b) */
export const WOODLAND_ACCENTS = [
  { x: 582, y: 244, d: "M -28 -8 Q -8 -24 14 -10 M -16 4 Q 4 -6 22 8 M -8 -18 Q 2 -6 -4 14" },
  { x: 400, y: 312, d: "M -26 -4 Q -4 -20 18 -6 M -14 10 Q 6 0 24 12 M 4 -16 Q 10 -2 0 12" },
  { x: 256, y: 318, d: "M -26 -6 Q -6 -20 14 -8 M -18 8 Q 0 -2 18 10 M -6 -16 Q 6 -4 -2 10" },
  { x: 224, y: 454, d: "M -22 -4 Q -2 -16 14 -4 M -12 8 Q 4 0 18 8" },
  { x: 386, y: 616, d: "M -24 -6 Q -4 -18 16 -6 M -14 8 Q 6 0 20 10 M 0 -16 Q 8 -2 2 10" },
  { x: 584, y: 696, d: "M -28 -8 Q -6 -22 16 -8 M -18 6 Q 4 -4 22 8" },
  { x: 766, y: 694, d: "M -24 -4 Q -2 -18 16 -4 M -12 10 Q 6 0 20 10" },
  { x: 866, y: 492, d: "M -26 -6 Q -4 -20 18 -6 M -16 8 Q 6 -2 22 10" },
  { x: 882, y: 318, d: "M -24 -6 Q -2 -18 16 -6 M -12 10 Q 6 0 20 10" },
];
