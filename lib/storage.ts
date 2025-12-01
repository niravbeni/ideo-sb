import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Slot, SlotMetadata, SlotSource } from "./types";
import { DEFAULT_SLOTS } from "./slots";

// IndexedDB Schema
interface SoundboardDB extends DBSchema {
  audioBlobs: {
    key: string;
    value: {
      blobId: string;
      blob: Blob;
      createdAt: number;
    };
  };
}

const DB_NAME = "soundboard-db";
const DB_VERSION = 1;
const STORE_NAME = "audioBlobs";

// localStorage keys
const SLOTS_METADATA_KEY = "soundboard-slots-metadata";
const VOLUME_KEY = "soundboard-volume";

let dbInstance: IDBPDatabase<SoundboardDB> | null = null;

// Initialize IndexedDB
async function getDB(): Promise<IDBPDatabase<SoundboardDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<SoundboardDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "blobId" });
      }
    },
  });

  return dbInstance;
}

// Audio Blob Storage (IndexedDB)
export async function saveAudioBlob(
  blobId: string,
  blob: Blob
): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, {
    blobId,
    blob,
    createdAt: Date.now(),
  });
}

export async function getAudioBlob(blobId: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    const record = await db.get(STORE_NAME, blobId);
    return record?.blob || null;
  } catch (error) {
    console.error("Error getting audio blob:", error);
    return null;
  }
}

export async function deleteAudioBlob(blobId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, blobId);
  } catch (error) {
    console.error("Error deleting audio blob:", error);
  }
}

export async function getAllBlobIds(): Promise<string[]> {
  try {
    const db = await getDB();
    const allRecords = await db.getAll(STORE_NAME);
    return allRecords.map((record) => record.blobId);
  } catch (error) {
    console.error("Error getting all blob IDs:", error);
    return [];
  }
}

// Slot Metadata Storage (localStorage)
export function saveSlotMetadata(slots: Slot[]): void {
  try {
    const metadata: SlotMetadata[] = slots.map((slot) => ({
      id: slot.id,
      currentSource: slot.currentSource,
    }));
    localStorage.setItem(SLOTS_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error("Error saving slot metadata:", error);
  }
}

export function loadSlotMetadata(): Slot[] {
  try {
    const stored = localStorage.getItem(SLOTS_METADATA_KEY);
    if (!stored) {
      return DEFAULT_SLOTS;
    }

    const metadata: SlotMetadata[] = JSON.parse(stored);
    
    // Merge stored metadata with default slots
    return DEFAULT_SLOTS.map((defaultSlot) => {
      const storedSlot = metadata.find((m) => m.id === defaultSlot.id);
      if (storedSlot) {
        return {
          ...defaultSlot,
          currentSource: storedSlot.currentSource,
        };
      }
      return defaultSlot;
    });
  } catch (error) {
    console.error("Error loading slot metadata:", error);
    return DEFAULT_SLOTS;
  }
}

export function resetSlotToDefault(slotId: string, slots: Slot[]): Slot[] {
  const defaultSlot = DEFAULT_SLOTS.find((s) => s.id === slotId);
  if (!defaultSlot || !defaultSlot.isPreset) {
    return slots;
  }

  return slots.map((slot) => {
    if (slot.id === slotId) {
      return {
        ...slot,
        currentSource: defaultSlot.currentSource,
      };
    }
    return slot;
  });
}

export async function clearCustomSlot(
  slotId: string,
  slots: Slot[]
): Promise<Slot[]> {
  const slot = slots.find((s) => s.id === slotId);
  if (!slot || slot.isPreset) {
    return slots;
  }

  // Delete associated blob if exists
  if (
    slot.currentSource.kind === "upload" ||
    slot.currentSource.kind === "recording"
  ) {
    await deleteAudioBlob(slot.currentSource.blobId);
  }

  return slots.map((s) => {
    if (s.id === slotId) {
      return {
        ...s,
        currentSource: { kind: "empty" },
      };
    }
    return s;
  });
}

// Volume Storage (localStorage)
export function getVolume(): number {
  try {
    const stored = localStorage.getItem(VOLUME_KEY);
    if (stored) {
      const volume = parseInt(stored, 10);
      return isNaN(volume) ? 70 : Math.max(0, Math.min(100, volume));
    }
    return 70; // Default volume
  } catch (error) {
    console.error("Error getting volume:", error);
    return 70;
  }
}

export function setVolume(volume: number): void {
  try {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    localStorage.setItem(VOLUME_KEY, clampedVolume.toString());
  } catch (error) {
    console.error("Error setting volume:", error);
  }
}

// Cleanup unused blobs (optional maintenance function)
export async function cleanupUnusedBlobs(slots: Slot[]): Promise<void> {
  try {
    const allBlobIds = await getAllBlobIds();
    const usedBlobIds = new Set<string>();

    slots.forEach((slot) => {
      if (
        slot.currentSource.kind === "upload" ||
        slot.currentSource.kind === "recording"
      ) {
        usedBlobIds.add(slot.currentSource.blobId);
      }
    });

    // Delete unused blobs
    for (const blobId of allBlobIds) {
      if (!usedBlobIds.has(blobId)) {
        await deleteAudioBlob(blobId);
      }
    }
  } catch (error) {
    console.error("Error cleaning up unused blobs:", error);
  }
}

