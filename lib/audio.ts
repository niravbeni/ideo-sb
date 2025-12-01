// Web Audio API wrapper for low-latency sound playback

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
const audioBuffers = new Map<string, AudioBuffer>();
const activeSources = new Map<string, AudioBufferSourceNode>();

// Initialize audio context (must be called after user gesture on iOS)
export function initAudioContext(): AudioContext {
  if (audioContext) {
    return audioContext;
  }

  // Create audio context
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  // Create global gain node for volume control
  gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  return audioContext;
}

export function getAudioContext(): AudioContext | null {
  return audioContext;
}

export function getGainNode(): GainNode | null {
  return gainNode;
}

// Set global volume (0-100)
export function setGlobalVolume(volume: number): void {
  if (!gainNode) {
    return;
  }

  // Convert 0-100 to 0-1, with exponential curve for better perception
  const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;
  const gain = normalizedVolume * normalizedVolume; // Square for exponential curve
  
  gainNode.gain.setValueAtTime(gain, audioContext!.currentTime);
}

// Preload a sound file from URL
export async function preloadSound(
  slotId: string,
  url: string
): Promise<AudioBuffer | null> {
  try {
    if (!audioContext) {
      initAudioContext();
    }

    // Check if already loaded
    if (audioBuffers.has(slotId)) {
      return audioBuffers.get(slotId)!;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);

    audioBuffers.set(slotId, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error(`Error preloading sound for ${slotId}:`, error);
    return null;
  }
}

// Decode blob to audio buffer
export async function decodeBlobToBuffer(
  slotId: string,
  blob: Blob
): Promise<AudioBuffer | null> {
  try {
    if (!audioContext) {
      initAudioContext();
    }

    const arrayBuffer = await blob.arrayBuffer();
    
    // Try to decode - this might fail for some recorded formats
    try {
      const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
      audioBuffers.set(slotId, audioBuffer);
      return audioBuffer;
    } catch (decodeError) {
      console.warn(`Direct decode failed for ${slotId}, trying alternative method...`);
      
      // Fallback: Use HTMLAudioElement to load and decode
      return await decodeBlobViaAudioElement(slotId, blob);
    }
  } catch (error) {
    console.error(`Error decoding blob for ${slotId}:`, error);
    throw error; // Re-throw so caller knows it failed
  }
}

// Fallback method: decode via HTMLAudioElement
async function decodeBlobViaAudioElement(
  slotId: string,
  blob: Blob
): Promise<AudioBuffer | null> {
  // For recordings that can't be decoded by Web Audio API,
  // we'll just return null and use HTMLAudio playback instead
  console.log(`Recording ${slotId} will use HTMLAudio playback`);
  return null;
}

// Get cached audio buffer
export function getAudioBuffer(slotId: string): AudioBuffer | null {
  return audioBuffers.get(slotId) || null;
}

// Remove audio buffer from cache
export function removeAudioBuffer(slotId: string): void {
  audioBuffers.delete(slotId);
}

// Play sound with restart behavior - SYNCHRONOUS for instant playback
export function playSound(
  slotId: string,
  audioBuffer: AudioBuffer,
  onEnded?: () => void
): void {
  if (!audioContext || !gainNode) {
    console.error("Audio context not initialized");
    return;
  }

  // AudioContext MUST be running at this point (resumed on first interaction)
  if (audioContext.state === "suspended") {
    audioContext.resume(); // Don't await - let it resume async
  }

  // Stop any currently playing sound for this slot
  stopSound(slotId);

  // Create new source
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(gainNode);

  // Handle ended event
  source.onended = () => {
    activeSources.delete(slotId);
    if (onEnded) {
      onEnded();
    }
  };

  // Store reference and play immediately
  activeSources.set(slotId, source);
  source.start(0);
}

// Ensure AudioContext is running - call this once on first user interaction
export async function ensureAudioContextRunning(): Promise<void> {
  if (!audioContext) {
    initAudioContext();
  }
  
  if (audioContext && audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

// Stop a specific sound
export function stopSound(slotId: string): void {
  const source = activeSources.get(slotId);
  if (source) {
    try {
      source.stop();
      source.disconnect();
    } catch (error) {
      // Already stopped or disconnected
    }
    activeSources.delete(slotId);
  }
}

// Stop all sounds
export function stopAllSounds(): void {
  activeSources.forEach((source, slotId) => {
    try {
      source.stop();
      source.disconnect();
    } catch (error) {
      // Already stopped or disconnected
    }
  });
  activeSources.clear();
}

// Check if a sound is currently playing
export function isPlaying(slotId: string): boolean {
  return activeSources.has(slotId);
}

// Preload all default sounds
export async function preloadAllDefaultSounds(
  defaultUrls: Array<{ id: string; url: string }>
): Promise<void> {
  if (!audioContext) {
    initAudioContext();
  }

  const promises = defaultUrls.map(({ id, url }) => preloadSound(id, url));
  
  try {
    await Promise.all(promises);
    console.log(`Preloaded ${promises.length} default sounds`);
  } catch (error) {
    console.error("Error preloading default sounds:", error);
  }
}

// Get audio context state (useful for debugging)
export function getAudioContextState(): string {
  return audioContext?.state || "not initialized";
}

// Cleanup - release all resources
export function cleanup(): void {
  stopAllSounds();
  audioBuffers.clear();
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    gainNode = null;
  }
}

