import { Slot } from "./types";

// Default slot definitions - 12 presets + 4 custom slots
export const DEFAULT_SLOTS: Slot[] = [
  // Row 1
  {
    id: "dog",
    label: "Dog",
    emoji: "🐶",
    defaultUrl: "/sounds/dog.mp3",
    currentSource: { kind: "default", url: "/sounds/dog.mp3" },
    isPreset: true,
  },
  {
    id: "cat",
    label: "Cat",
    emoji: "🐱",
    defaultUrl: "/sounds/cat.mp3",
    currentSource: { kind: "default", url: "/sounds/cat.mp3" },
    isPreset: true,
  },
  {
    id: "cow",
    label: "Cow",
    emoji: "🐮",
    defaultUrl: "/sounds/cow.mp3",
    currentSource: { kind: "default", url: "/sounds/cow.mp3" },
    isPreset: true,
  },
  {
    id: "duck",
    label: "Duck",
    emoji: "🦆",
    defaultUrl: "/sounds/duck.mp3",
    currentSource: { kind: "default", url: "/sounds/duck.mp3" },
    isPreset: true,
  },
  // Row 2
  {
    id: "sheep",
    label: "Sheep",
    emoji: "🐑",
    defaultUrl: "/sounds/sheep.mp3",
    currentSource: { kind: "default", url: "/sounds/sheep.mp3" },
    isPreset: true,
  },
  {
    id: "pig",
    label: "Pig",
    emoji: "🐷",
    defaultUrl: "/sounds/pig.mp3",
    currentSource: { kind: "default", url: "/sounds/pig.mp3" },
    isPreset: true,
  },
  {
    id: "rooster",
    label: "Rooster",
    emoji: "🐓",
    defaultUrl: "/sounds/rooster.mp3",
    currentSource: { kind: "default", url: "/sounds/rooster.mp3" },
    isPreset: true,
  },
  {
    id: "chicken",
    label: "Chicken",
    emoji: "🐔",
    defaultUrl: "/sounds/chicken.mp3",
    currentSource: { kind: "default", url: "/sounds/chicken.mp3" },
    isPreset: true,
  },
  // Row 3
  {
    id: "horse",
    label: "Horse",
    emoji: "🐴",
    defaultUrl: "/sounds/horse.mp3",
    currentSource: { kind: "default", url: "/sounds/horse.mp3" },
    isPreset: true,
  },
  {
    id: "frog",
    label: "Frog",
    emoji: "🐸",
    defaultUrl: "/sounds/frog.mp3",
    currentSource: { kind: "default", url: "/sounds/frog.mp3" },
    isPreset: true,
  },
  {
    id: "lion",
    label: "Lion",
    emoji: "🦁",
    defaultUrl: "/sounds/lion.mp3",
    currentSource: { kind: "default", url: "/sounds/lion.mp3" },
    isPreset: true,
  },
  {
    id: "owl",
    label: "Owl",
    emoji: "🦉",
    defaultUrl: "/sounds/owl.mp3",
    currentSource: { kind: "default", url: "/sounds/owl.mp3" },
    isPreset: true,
  },
  // Row 4 - Custom slots
  {
    id: "custom-1",
    label: "Custom 1",
    emoji: "🎤",
    currentSource: { kind: "empty" },
    isPreset: false,
  },
  {
    id: "custom-2",
    label: "Custom 2",
    emoji: "🎤",
    currentSource: { kind: "empty" },
    isPreset: false,
  },
  {
    id: "custom-3",
    label: "Custom 3",
    emoji: "🎤",
    currentSource: { kind: "empty" },
    isPreset: false,
  },
  {
    id: "custom-4",
    label: "Custom 4",
    emoji: "🎤",
    currentSource: { kind: "empty" },
    isPreset: false,
  },
];

export function getDefaultSlots(): Slot[] {
  return JSON.parse(JSON.stringify(DEFAULT_SLOTS));
}

export function getSlotById(slots: Slot[], id: string): Slot | undefined {
  return slots.find((slot) => slot.id === id);
}

