// MediaRecorder wrapper for in-browser audio recording

export type RecorderState = "idle" | "recording" | "error";

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private state: RecorderState = "idle";
  private startTime: number = 0;

  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately, we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Determine the best mime type for the browser
      const mimeType = this.getSupportedMimeType();
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      });

      this.audioChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.state = "recording";
      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      this.state = "error";
      this.cleanup();
      return false;
    }
  }

  async stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.state !== "recording") {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || "audio/webm";
        const blob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanup();
        this.state = "idle";
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  getState(): RecorderState {
    return this.state;
  }

  isRecording(): boolean {
    return this.state === "recording";
  }

  getDuration(): number {
    if (this.state !== "recording") {
      return 0;
    }
    return Date.now() - this.startTime;
  }

  private getSupportedMimeType(): string {
    // Try different mime types in order of preference
    // Prioritize formats that work well across browsers
    const mimeTypes = [
      "audio/webm",  // Simplified - Chrome/Firefox
      "audio/mp4",   // Safari
      "audio/ogg",   // Firefox fallback
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        console.log(`Using audio format: ${mimeType}`);
        return mimeType;
      }
    }

    // Fallback to default (browser will choose)
    console.warn("No explicit format supported, using browser default");
    return "";
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // Cancel recording without saving
  cancel(): void {
    if (this.mediaRecorder && this.state === "recording") {
      this.mediaRecorder.stop();
    }
    this.cleanup();
    this.state = "idle";
  }
}

// Singleton instance for convenience
let globalRecorder: AudioRecorder | null = null;

export function getRecorder(): AudioRecorder {
  if (!globalRecorder) {
    globalRecorder = new AudioRecorder();
  }
  return globalRecorder;
}

// Check if recording is supported
export function isRecordingSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder === 'function'
  );
}

// Format duration in MM:SS
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

