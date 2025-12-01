"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ManageSlotCard from "@/components/ManageSlotCard";
import VolumeSlider from "@/components/VolumeSlider";
import Toast from "@/components/Toast";
import { Slot } from "@/lib/types";
import {
  loadSlotMetadata,
  saveSlotMetadata,
  getVolume,
  setVolume as saveVolume,
  saveAudioBlob,
  deleteAudioBlob,
  resetSlotToDefault,
  clearCustomSlot,
} from "@/lib/storage";
import { setGlobalVolume, decodeBlobToBuffer, removeAudioBuffer, preloadSound } from "@/lib/audio";

export default function ManagePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [volume, setVolume] = useState(70);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    // Load slots and volume
    const loadedSlots = loadSlotMetadata();
    setSlots(loadedSlots);

    const savedVolume = getVolume();
    setVolume(savedVolume);
  }, []);

  // Save slots when they change
  useEffect(() => {
    if (slots.length > 0) {
      saveSlotMetadata(slots);
    }
  }, [slots]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    saveVolume(newVolume);
    setGlobalVolume(newVolume);
  };

  const handleUpload = async (slotId: string, file: File) => {
    try {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot) return;

      // Delete old blob if exists
      if (
        slot.currentSource.kind === "upload" ||
        slot.currentSource.kind === "recording"
      ) {
        await deleteAudioBlob(slot.currentSource.blobId);
      }

      // Generate blob ID
      const blobId = `upload-${slotId}-${Date.now()}`;

      // Save to IndexedDB
      await saveAudioBlob(blobId, file);

      // Decode for playback
      await decodeBlobToBuffer(slotId, file);

      // Update slot
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? {
                ...s,
                currentSource: {
                  kind: "upload",
                  blobId,
                  fileName: file.name,
                },
              }
            : s
        )
      );

      showToast(`${file.name} uploaded successfully!`, "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("Upload failed", "error");
    }
  };

  const handleReset = async (slotId: string) => {
    try {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot || !slot.isPreset) return;

      // Delete custom blob if exists
      if (
        slot.currentSource.kind === "upload" ||
        slot.currentSource.kind === "recording"
      ) {
        await deleteAudioBlob(slot.currentSource.blobId);
      }

      // Remove from audio buffer cache
      removeAudioBuffer(slotId);

      // Reset to default
      const updatedSlots = resetSlotToDefault(slotId, slots);
      setSlots(updatedSlots);

      // Preload default sound
      const defaultSlot = updatedSlots.find((s) => s.id === slotId);
      if (defaultSlot && defaultSlot.currentSource.kind === "default") {
        await preloadSound(slotId, defaultSlot.currentSource.url);
      }

      showToast(`${slot.label} reset to default`, "success");
    } catch (error) {
      console.error("Error resetting slot:", error);
      showToast("Reset failed", "error");
    }
  };

  const handleClear = async (slotId: string) => {
    try {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot || slot.isPreset) return;

      // Clear custom slot
      const updatedSlots = await clearCustomSlot(slotId, slots);
      setSlots(updatedSlots);

      // Remove from audio buffer cache
      removeAudioBuffer(slotId);

      showToast(`${slot.label} cleared`, "success");
    } catch (error) {
      console.error("Error clearing slot:", error);
      showToast("Clear failed", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
            aria-label="Go back to soundboard"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-indigo-600">Settings</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content - Fill entire space */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Volume Control - Fixed height at top */}
        <section className="bg-white rounded-lg shadow-md p-3 md:p-4 m-2 md:m-4 flex-shrink-0">
          <VolumeSlider initialVolume={volume} onChange={handleVolumeChange} />
        </section>

        {/* Slot Management - Scrollable grid filling remaining space */}
        <section className="flex-1 overflow-y-auto px-2 md:px-4 pb-2 md:pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-max gap-2 md:gap-3">
            {slots.map((slot) => (
              <ManageSlotCard
                key={slot.id}
                slot={slot}
                onUpload={handleUpload}
                onReset={handleReset}
                onClear={handleClear}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

