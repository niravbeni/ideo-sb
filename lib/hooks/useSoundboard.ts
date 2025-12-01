"use client";

import { useState, useEffect, useCallback } from "react";
import { Slot } from "@/lib/types";
import {
  loadSlotMetadata,
  saveSlotMetadata,
  getVolume,
  saveAudioBlob,
  getAudioBlob,
} from "@/lib/storage";
import {
  initAudioContext,
  preloadSound,
  playSound,
  setGlobalVolume,
  getAudioBuffer,
  decodeBlobToBuffer,
} from "@/lib/audio";

export function useSoundboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load slots from storage
        const loadedSlots = loadSlotMetadata();
        setSlots(loadedSlots);

        // Initialize audio context and volume
        initAudioContext();
        const volume = getVolume();
        setGlobalVolume(volume);

        // Preload default sounds
        const preloadPromises = loadedSlots
          .filter((slot) => slot.currentSource.kind === "default")
          .map((slot) => preloadSound(slot.id, slot.currentSource.url));

        await Promise.all(preloadPromises);

        // Load and decode custom sounds (uploads/recordings)
        for (const slot of loadedSlots) {
          if (slot.currentSource.kind === "upload" || slot.currentSource.kind === "recording") {
            const blob = await getAudioBlob(slot.currentSource.blobId);
            if (blob) {
              await decodeBlobToBuffer(slot.id, blob);
            }
          }
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing soundboard:", err);
        setError("Failed to initialize soundboard");
      }
    };

    initialize();
  }, []);

  // Save slots when they change
  useEffect(() => {
    if (isInitialized && slots.length > 0) {
      saveSlotMetadata(slots);
    }
  }, [slots, isInitialized]);

  const handlePlay = useCallback(
    (slotId: string) => {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot || slot.currentSource.kind === "empty") {
        return;
      }

      // Initialize audio context on first interaction (iOS requirement)
      initAudioContext();

      const buffer = getAudioBuffer(slotId);
      if (!buffer) {
        throw new Error("Sound not loaded yet");
      }

      // Set playing state
      setPlayingStates((prev) => ({ ...prev, [slotId]: true }));

      // Play sound
      playSound(slotId, buffer, () => {
        setPlayingStates((prev) => ({ ...prev, [slotId]: false }));
      });
    },
    [slots]
  );

  return {
    slots,
    setSlots,
    playingStates,
    isInitialized,
    error,
    handlePlay,
  };
}

