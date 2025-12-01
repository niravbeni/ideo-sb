"use client";

import { Slot } from "@/lib/types";
import { useRef } from "react";

interface ManageSlotCardProps {
  slot: Slot;
  onUpload: (slotId: string, file: File) => void;
  onReset: (slotId: string) => void;
  onClear: (slotId: string) => void;
}

export default function ManageSlotCard({
  slot,
  onUpload,
  onReset,
  onClear,
}: ManageSlotCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(slot.id, file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getSourceDescription = () => {
    switch (slot.currentSource.kind) {
      case "default":
        return "Default sound";
      case "upload":
        return `Uploaded: ${slot.currentSource.fileName}`;
      case "recording":
        const date = new Date(slot.currentSource.createdAt);
        return `Recorded: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      case "empty":
        return "Empty slot";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200 flex flex-col justify-between h-full w-full">
      {/* Emoji - Large and centered */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <span className="text-3xl md:text-4xl lg:text-5xl" role="img" aria-label={slot.label}>
          {slot.emoji}
        </span>
      </div>

      {/* Label and Status */}
      <div className="text-center mb-1 flex-shrink-0">
        <h3 className="font-bold text-xs truncate">{slot.label}</h3>
        <p className="text-xs text-gray-500 truncate">{getSourceDescription()}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-1 justify-center flex-shrink-0">
        {/* Upload/Replace Button */}
        <button
          onClick={handleUploadClick}
          className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors font-medium flex-1 min-w-[50px]"
          aria-label={`Upload sound for ${slot.label}`}
        >
          {slot.currentSource.kind === "empty" ? "Upload" : "Replace"}
        </button>

        {/* Reset Button (Presets Only) */}
        {slot.isPreset && slot.currentSource.kind !== "default" && (
          <button
            onClick={() => onReset(slot.id)}
            className="px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors font-medium flex-1 min-w-[50px]"
            aria-label={`Reset ${slot.label} to default`}
          >
            Reset
          </button>
        )}

        {/* Clear Button (Custom Slots Only) */}
        {!slot.isPreset && slot.currentSource.kind !== "empty" && (
          <button
            onClick={() => onClear(slot.id)}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium flex-1 min-w-[50px]"
            aria-label={`Clear ${slot.label}`}
          >
            Clear
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}

