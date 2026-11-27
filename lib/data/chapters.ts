export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  act: "ACT I" | "ACT II" | "ACT III";
  range: [number, number];
  targetProgress: number;
  previewSrc: string;
  previewAlt: string;
  status?: "built" | "upcoming";
}

export const CHAPTERS: Chapter[] = [
  {
    id: "ch01",
    number: "01",
    title: "The First Mark",
    subtitle: "A Place Still Becoming",
    act: "ACT I",
    range: [0.0, 0.058],
    targetProgress: 0.0,
    previewSrc: "/matrimandir-sequence/00-hero-study-aligned.png",
    previewAlt: "Architectural elevation study drawing of the Matrimandir dome",
    status: "built",
  },
  {
    id: "ch02",
    number: "02",
    title: "The Page Opens",
    subtitle: "Drawing into Reality",
    act: "ACT I",
    range: [0.058, 0.13],
    targetProgress: 0.082,
    previewSrc: "/matrimandir-sequence/01-sketch-aligned.jpg",
    previewAlt: "Detailed graphite study of the Matrimandir and surrounding gardens",
    status: "built",
  },
  {
    id: "ch03",
    number: "03",
    title: "The Golden Structure",
    subtitle: "Architectural Stories",
    act: "ACT I",
    range: [0.13, 0.29],
    targetProgress: 0.15,
    previewSrc: "/illustrated/ch03-structure/ch03-frame-b-making.webp",
    previewAlt: "Illustrated workshop study of Matrimandir geodesic construction",
    status: "built",
  },
  {
    id: "ch04",
    number: "04",
    title: "The Earth Remembers",
    subtitle: "Suspended Field Study",
    act: "ACT I",
    range: [0.29, 0.43],
    targetProgress: 0.34,
    previewSrc: "/illustrated/ch04-earth/print-seed-hand.webp",
    previewAlt: "Botanical study of indigenous seeds cupped in hand",
    status: "built",
  },
  {
    id: "ch05",
    number: "05",
    title: "The Growing Forest",
    subtitle: "From Roots to Canopy",
    act: "ACT II",
    range: [0.43, 0.595],
    targetProgress: 0.48,
    previewSrc: "/illustrated/ch05-forest/ch05-forest-master.jpg",
    previewAlt: "Illustrated dry-evergreen forest canopy and banyan aerial roots",
    status: "built",
  },
  {
    id: "ch06",
    number: "06",
    title: "The Water Story",
    subtitle: "Flow & Contours",
    act: "ACT II",
    range: [0.595, 0.745],
    targetProgress: 0.65,
    previewSrc: "/illustrated/ch06-water/ch06-water-master.jpg",
    previewAlt: "Hand-illustrated earthen contour bund and catchment basin",
    status: "built",
  },
  {
    id: "ch07",
    number: "07",
    title: "The Interactive Atlas",
    subtitle: "Explore Auroville",
    act: "ACT III",
    range: [0.745, 1.05],
    targetProgress: 0.785,
    previewSrc: "/illustrated/ch10-atlas/auroville-atlas-base.jpg",
    previewAlt: "Watercolor and graphite cartographic atlas of Auroville landmarks",
    status: "built",
  },
];
