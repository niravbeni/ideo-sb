"use client";

import { Slot } from "@/lib/types";
import { useState, useRef } from "react";

interface SoundButtonProps {
  slot: Slot;
  isPlaying: boolean;
  onPlay: (slotId: string) => void;
  onUpload?: (slotId: string, file: File) => void;
}

export default function SoundButton({
  slot,
  isPlaying,
  onPlay,
  onUpload,
}: SoundButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEmpty = slot.currentSource.kind === "empty";
  const isCustomSlot = !slot.isPreset;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent any default behavior that might cause delay
    e.preventDefault();
    e.stopPropagation();
    
    if (isEmpty && isCustomSlot && onUpload) {
      // Trigger file upload for empty custom slots
      fileInputRef.current?.click();
    } else if (!isEmpty) {
      // Play sound if slot has content
      onPlay(slot.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(slot.id, file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
  };
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);
  
  // For touch devices - fire immediately on touch
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent 300ms tap delay on mobile
    setIsPressed(true);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(false);
    
    if (isEmpty && isCustomSlot && onUpload) {
      // Trigger file upload for empty custom slots
      fileInputRef.current?.click();
    } else if (!isEmpty) {
      // Play sound if slot has content
      onPlay(slot.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsPressed(true);
      handleClick();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsPressed(false);
    }
  };

  // Determine button state classes
  let stateClasses = "bg-gradient-to-br from-indigo-500 to-purple-600 text-white";
  
  if (isEmpty && isCustomSlot) {
    // Empty custom slots - show as uploadable
    stateClasses = "bg-gradient-to-br from-blue-400 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-600";
  } else if (isEmpty) {
    // Empty presets - disabled
    stateClasses = "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 opacity-50";
  } else if (isPlaying) {
    stateClasses = "bg-gradient-to-br from-green-500 to-emerald-600 text-white ring-4 ring-green-300 animate-pulse";
  } else if (isPressed) {
    stateClasses = "bg-gradient-to-br from-indigo-600 to-purple-700 text-white scale-95";
  }

  const ariaLabel = isEmpty && isCustomSlot
    ? `Upload sound for ${slot.label}`
    : isEmpty
    ? `Empty slot - ${slot.label}`
    : `Play ${slot.label} sound`;

  return (
    <>
      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        aria-label={ariaLabel}
        disabled={isEmpty && !isCustomSlot}
      className={`
        relative
        w-full
        h-full
        rounded-md md:rounded-lg
        shadow-lg
        transition-all
        duration-150
        flex flex-col
        items-center
        justify-center
        gap-0.5 md:gap-1
        p-2 md:p-3
        focus:outline-none
        focus:ring-2 md:focus:ring-4
        focus:ring-indigo-300
        disabled:opacity-40
        disabled:cursor-not-allowed
        ${stateClasses}
      `}
    >
      {/* Emoji - Large and centered */}
      <span className="text-5xl md:text-7xl lg:text-8xl" role="img" aria-hidden="true">
        {isEmpty && isCustomSlot ? "📤" : slot.emoji}
      </span>

      {/* Upload indicator (for uploaded custom sounds) */}
      {slot.currentSource.kind === "upload" && (
        <span className="absolute top-1 right-1 text-xs md:text-sm" aria-hidden="true">
          📁
        </span>
      )}
    </button>
    
    {/* Hidden file input for uploads */}
    {isCustomSlot && onUpload && (
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    )}
  </>
  );
}

