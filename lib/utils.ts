// Utility functions

/**
 * Generate a unique ID for blobs
 */
export function generateBlobId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if browser supports required features
 */
export function checkBrowserSupport(): {
  audioContext: boolean;
  mediaRecorder: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
} {
  return {
    audioContext: !!(typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)),
    mediaRecorder: !!(
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function' &&
      typeof window !== 'undefined' &&
      typeof window.MediaRecorder === 'function'
    ),
    indexedDB: !!(typeof window !== 'undefined' && window.indexedDB),
    serviceWorker: typeof navigator !== 'undefined' && "serviceWorker" in navigator,
  };
}

/**
 * Validate audio file type
 */
export function isValidAudioFile(file: File): boolean {
  const validTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
    "audio/m4a",
  ];

  return validTypes.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|webm|m4a)$/i) !== null;
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

