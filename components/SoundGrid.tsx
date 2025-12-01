"use client";

import { Slot } from "@/lib/types";
import SoundButton from "./SoundButton";

interface SoundGridProps {
  slots: Slot[];
  playingStates: { [slotId: string]: boolean };
  onPlay: (slotId: string) => void;
  onUpload?: (slotId: string, file: File) => void;
}

export default function SoundGrid({
  slots,
  playingStates,
  onPlay,
  onUpload,
}: SoundGridProps) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-1 md:gap-2 w-full h-full p-1 md:p-2">
      {slots.map((slot) => (
        <SoundButton
          key={slot.id}
          slot={slot}
          isPlaying={playingStates[slot.id] || false}
          onPlay={onPlay}
          onUpload={onUpload}
        />
      ))}
    </div>
  );
}

