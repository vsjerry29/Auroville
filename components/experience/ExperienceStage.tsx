"use client";

import EditorialCover from "@/components/scenes/EditorialCover";
import Chapter02PageOpens from "@/components/scenes/Chapter02PageOpens";
import Chapter03GoldenStructure from "@/components/scenes/Chapter03GoldenStructure";

interface ExperienceStageProps {
  progress: number; // Upper pinned stage progress (0.0 to 0.73)
  ch04EnterProgress?: number; // 0.0 -> 1.0 as Chapter 04 enters vertically below
}

export default function ExperienceStage({
  progress,
  ch04EnterProgress = 0,
}: ExperienceStageProps) {
  // Synchronized active ranges matching CH01, CH02, and horizontal CH03 inside the pinned viewport
  const isScene01Active = progress <= 0.24;
  const isScene02Active = progress >= 0.20 && progress <= 0.46;
  const isScene03Active = progress >= 0.44;

  return (
    <div className="relative w-full h-full overflow-hidden bg-paper text-ink selection:bg-terracotta selection:text-paper-light">
      <EditorialCover progress={progress} active={isScene01Active} />
      <Chapter02PageOpens progress={progress} active={isScene02Active} />
      <Chapter03GoldenStructure
        progress={progress}
        active={isScene03Active}
        exitProgress={ch04EnterProgress}
      />
    </div>
  );
}
