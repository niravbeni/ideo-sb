"use client";

import { useState, useEffect } from "react";
import { formatDuration } from "@/lib/recorder";

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  duration: number;
}

export default function RecordButton({
  isRecording,
  onStart,
  onStop,
  duration,
}: RecordButtonProps) {
  const [displayDuration, setDisplayDuration] = useState(duration);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setDisplayDuration(Date.now() - duration);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayDuration(0);
    }
  }, [isRecording, duration]);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isRecording ? onStop : onStart}
        className={`
          px-6 py-3 rounded-lg font-semibold text-white transition-all
          ${
            isRecording
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "bg-indigo-600 hover:bg-indigo-700"
          }
        `}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <>
            <span className="inline-block mr-2">⏹️</span>
            Stop Recording
          </>
        ) : (
          <>
            <span className="inline-block mr-2">🎤</span>
            Start Recording
          </>
        )}
      </button>

      {isRecording && (
        <span className="text-lg font-mono text-red-600">
          {formatDuration(displayDuration)}
        </span>
      )}
    </div>
  );
}

