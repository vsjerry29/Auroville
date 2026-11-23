export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  range: [number, number];
  targetProgress: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "cover",
    number: "01",
    title: "The Beginning",
    subtitle: "A Place Still Becoming",
    range: [0.0, 0.22],
    targetProgress: 0.0,
  },
  {
    id: "frame",
    number: "02",
    title: "Into the Frame",
    subtitle: "Drawing into Reality",
    range: [0.22, 0.45],
    targetProgress: 0.25,
  },
  {
    id: "archive",
    number: "03",
    title: "Fragments of Time",
    subtitle: "The Living Archive",
    range: [0.45, 0.73],
    targetProgress: 0.50,
  },
  {
    id: "composition",
    number: "04",
    title: "Perspectives",
    subtitle: "The Editorial Photo Experience",
    range: [0.73, 1.0],
    targetProgress: 0.78,
  },
];
