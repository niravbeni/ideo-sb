// Core type definitions for the soundboard

export type SlotSource =
  | { kind: "default"; url: string }
  | { kind: "upload"; blobId: string; fileName: string }
  | { kind: "recording"; blobId: string; createdAt: number }
  | { kind: "empty" };

export type Slot = {
  id: string;
  label: string;
  emoji: string;
  defaultUrl?: string;
  currentSource: SlotSource;
  isPreset: boolean;
};

export type SlotMetadata = {
  id: string;
  currentSource: SlotSource;
};

export type RecordingState = "idle" | "recording" | "saved";

export type PlayingState = {
  [slotId: string]: boolean;
};

