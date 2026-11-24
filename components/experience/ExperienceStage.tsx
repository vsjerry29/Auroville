"use client";

import EditorialCover from "@/components/scenes/EditorialCover";
import Chapter02PageOpens from "@/components/scenes/Chapter02PageOpens";
import Chapter03GoldenStructure from "@/components/scenes/Chapter03GoldenStructure";
import Chapter04RedEarth from "@/components/scenes/Chapter04RedEarth";
import ChapterNavigation from "@/components/experience/ChapterNavigation";
import ProgressIndicator from "@/components/experience/ProgressIndicator";

interface ExperienceStageProps {
  progress: number; // 0.0 to 1.0
  onNavigate: (targetProgress: number) => void;
}

export default function ExperienceStage({ progress, onNavigate }: ExperienceStageProps) {
  // Synchronized active ranges matching CHAPTERS ranges exactly
  const isScene01Active = progress <= 0.24;
  const isScene02Active = progress >= 0.20 && progress <= 0.46;
  const isScene03Active = progress >= 0.44 && progress <= 0.75;
  const isScene04Active = progress >= 0.72;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-paper text-ink selection:bg-terracotta selection:text-paper-light">
      {/* Chapter Navigation Header & Modal */}
      <ChapterNavigation currentProgress={progress} onNavigate={onNavigate} />

      {/* Persistent Scene Layering */}
      <div className="relative w-full h-full">
        <EditorialCover progress={progress} active={isScene01Active} />
        <Chapter02PageOpens progress={progress} active={isScene02Active} />
        <Chapter03GoldenStructure progress={progress} active={isScene03Active} />
        <Chapter04RedEarth
          progress={progress}
          active={isScene04Active}
          onNavigateStart={() => onNavigate(0.0)}
        />
      </div>

      {/* Global Scroll Progress Indicator */}
      <ProgressIndicator progress={progress} />
    </div>
  );
}
