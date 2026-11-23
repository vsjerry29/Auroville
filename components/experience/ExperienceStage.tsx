"use client";

import EditorialCover from "@/components/scenes/EditorialCover";
import InsidePhotograph from "@/components/scenes/InsidePhotograph";
import ArchiveScene from "@/components/scenes/ArchiveScene";
import LivingGrid from "@/components/scenes/LivingGrid";
import ChapterNavigation from "@/components/experience/ChapterNavigation";
import ProgressIndicator from "@/components/experience/ProgressIndicator";

interface ExperienceStageProps {
  progress: number; // 0.0 to 1.0
  onNavigate: (targetProgress: number) => void;
}

export default function ExperienceStage({ progress, onNavigate }: ExperienceStageProps) {
  // Determine which scenes are active based on global progress
  const isScene01Active = progress <= 0.26;
  const isScene02Active = progress >= 0.18 && progress <= 0.48;
  const isScene03Active = progress >= 0.40 && progress <= 0.76;
  const isScene04Active = progress >= 0.68;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-paper text-ink selection:bg-terracotta selection:text-paper-light">
      {/* Chapter Navigation Header & Modal */}
      <ChapterNavigation currentProgress={progress} onNavigate={onNavigate} />

      {/* Persistent Scene Layering */}
      <div className="relative w-full h-full">
        <EditorialCover progress={progress} active={isScene01Active} />
        <InsidePhotograph progress={progress} active={isScene02Active} />
        <ArchiveScene progress={progress} active={isScene03Active} />
        <LivingGrid progress={progress} active={isScene04Active} />
      </div>

      {/* Global Scroll Progress Indicator */}
      <ProgressIndicator progress={progress} />
    </div>
  );
}
