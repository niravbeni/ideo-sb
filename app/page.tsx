"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SoundGrid from "@/components/SoundGrid";
import Toast from "@/components/Toast";
import { Slot } from "@/lib/types";
import { loadSlotMetadata, saveSlotMetadata, getVolume, saveAudioBlob, getAudioBlob, deleteAudioBlob } from "@/lib/storage";
import {
  initAudioContext,
  preloadSound,
  playSound,
  setGlobalVolume,
  getAudioBuffer,
  decodeBlobToBuffer,
  ensureAudioContextRunning,
} from "@/lib/audio";

export default function Home() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load slots from storage
        const loadedSlots = loadSlotMetadata();
        setSlots(loadedSlots);

        // Initialize audio context early (but it will be suspended until first user interaction)
        initAudioContext();
        const volume = getVolume();
        setGlobalVolume(volume);

        // Preload default sounds
        const preloadPromises = loadedSlots
          .filter((slot) => slot.currentSource.kind === "default")
          .map((slot) => {
            if (slot.currentSource.kind === "default") {
              return preloadSound(slot.id, slot.currentSource.url);
            }
            return Promise.resolve(null);
          });

        const results = await Promise.allSettled(preloadPromises);
        
        // Log any preload failures for debugging
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.warn(`Failed to preload sound ${index}:`, result.reason);
          }
        });

        // Load and decode custom sounds (uploads/recordings)
        for (const slot of loadedSlots) {
          if (slot.currentSource.kind === "upload" || slot.currentSource.kind === "recording") {
            const blob = await getAudioBlob(slot.currentSource.blobId);
            if (blob) {
              try {
                await decodeBlobToBuffer(slot.id, blob);
              } catch (error) {
                // If decoding fails, that's OK - we'll use HTMLAudio fallback on playback
                console.log(`Will use HTMLAudio for ${slot.id}`);
              }
            }
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing soundboard:", error);
        setIsInitialized(true); // Still allow UI to show
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

      const buffer = getAudioBuffer(slotId);
      
      if (!buffer) {
        showToast("Sound not loaded yet", "error");
        return;
      }

      // Update visual state BEFORE playing for instant feedback
      setPlayingStates((prev) => ({ ...prev, [slotId]: true }));

      // Play sound INSTANTLY - no async!
      playSound(slotId, buffer, () => {
        setPlayingStates((prev) => ({ ...prev, [slotId]: false }));
      });
    },
    [slots]
  );


  const handleUpload = useCallback(
    async (slotId: string, file: File) => {
      try {
        const slot = slots.find((s) => s.id === slotId);
        if (!slot || slot.isPreset) return;

        // Delete old blob if exists
        if (slot.currentSource.kind === "upload") {
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

        showToast(`${file.name} uploaded!`, "success");
      } catch (error) {
        console.error("Error uploading file:", error);
        showToast("Upload failed", "error");
      }
    },
    [slots]
  );

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Unlock audio IMMEDIATELY on first user interaction (required for iOS/Safari)
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioReady) {
        // Synchronous unlock - no await
        const ctx = initAudioContext();
        if (ctx.state === "suspended") {
          ctx.resume().then(() => {
            console.log("Audio unlocked and ready");
          });
        }
        setAudioReady(true);
      }
    };

    // Listen for any user interaction to unlock audio
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, [audioReady]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-lg text-gray-600">Loading soundboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Soundboard</h1>
          <Link
            href="/manage"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
            aria-label="Go to settings page"
          >
            ⚙️ Settings
          </Link>
        </div>
      </header>

      {/* Main Content - Fill entire remaining space */}
      <main className="flex-1 overflow-hidden">
        <SoundGrid
          slots={slots}
          playingStates={playingStates}
          onPlay={handlePlay}
          onUpload={handleUpload}
        />
      </main>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

