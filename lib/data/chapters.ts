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
    title: "The Cover",
    subtitle: "Monumental Typography & Architectural Portal",
    range: [0.0, 0.22],
    targetProgress: 0.0,
  },
  {
    id: "frame",
    number: "02",
    title: "The Frame",
    subtitle: "Photographic Immersion to Archival Print",
    range: [0.22, 0.45],
    targetProgress: 0.25,
  },
  {
    id: "archive",
    number: "03",
    title: "The Archive",
    subtitle: "Historical Fragments & Draggable Study",
    range: [0.45, 0.73],
    targetProgress: 0.50,
  },
  {
    id: "composition",
    number: "04",
    title: "The Composition",
    subtitle: "The Living Grid & Evolving Perspectives",
    range: [0.73, 1.0],
    targetProgress: 0.78,
  },
];
