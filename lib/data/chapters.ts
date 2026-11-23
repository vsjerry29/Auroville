export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  act: "ACT I" | "ACT II" | "ACT III" | "ACT IV";
  range: [number, number];
  targetProgress: number;
}

export const CHAPTERS: Chapter[] = [
  // ACT I — THE DRAWING AWAKENS
  {
    id: "ch01",
    number: "01",
    title: "The First Mark",
    subtitle: "A Place Still Becoming",
    act: "ACT I",
    range: [0.0, 0.22],
    targetProgress: 0.0,
  },
  {
    id: "ch02",
    number: "02",
    title: "The Page Opens",
    subtitle: "Drawing into Reality",
    act: "ACT I",
    range: [0.22, 0.45],
    targetProgress: 0.25,
  },
  {
    id: "ch03",
    number: "03",
    title: "The Golden Structure",
    subtitle: "The Architectural Study",
    act: "ACT I",
    range: [0.45, 0.73],
    targetProgress: 0.50,
  },
  {
    id: "ch04",
    number: "04",
    title: "The Earth Remembers",
    subtitle: "Suspended Print Exhibition",
    act: "ACT I",
    range: [0.73, 1.01],
    targetProgress: 0.78,
  },
  // ACT II — NATURE TAKES OVER (Planned Roadmap)
  {
    id: "ch05",
    number: "05",
    title: "Red Earth",
    subtitle: "Soil & Strata",
    act: "ACT II",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  {
    id: "ch06",
    number: "06",
    title: "The Growing Forest",
    subtitle: "Ecosystem & Canopy",
    act: "ACT II",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  {
    id: "ch07",
    number: "07",
    title: "The Water Story",
    subtitle: "Flow & Contours",
    act: "ACT II",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  // ACT III — PEOPLE, MAKING AND PLAN
  {
    id: "ch08",
    number: "08",
    title: "The Maker's Table",
    subtitle: "Craft & Materiality",
    act: "ACT III",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  {
    id: "ch09",
    number: "09",
    title: "A Thousand Stories",
    subtitle: "Human Vignettes",
    act: "ACT III",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  {
    id: "ch10",
    number: "10",
    title: "The Galaxy Blueprint",
    subtitle: "Radial Planning",
    act: "ACT III",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  // ACT IV — THE WORLD RESPONDS
  {
    id: "ch11",
    number: "11",
    title: "The Secret Atlas",
    subtitle: "Exploration & Landmarks",
    act: "ACT IV",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
  {
    id: "ch12",
    number: "12",
    title: "The Mark You Leave",
    subtitle: "Poster & Final Mark",
    act: "ACT IV",
    range: [1.0, 1.0],
    targetProgress: 1.0,
  },
];
