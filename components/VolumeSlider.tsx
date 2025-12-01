"use client";

import { useState, useEffect } from "react";

interface VolumeSliderProps {
  initialVolume: number;
  onChange: (volume: number) => void;
}

export default function VolumeSlider({
  initialVolume,
  onChange,
}: VolumeSliderProps) {
  const [volume, setVolume] = useState(initialVolume);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    onChange(newVolume);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🔈</span>
        <div className="flex-1 relative py-2">
          {/* Track background */}
          <div className="relative h-2 bg-gray-200 rounded-full">
            {/* Filled portion with gradient */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-150 rounded-full"
              style={{ width: `${volume}%` }}
            />
            {/* Draggable pip/thumb with outline */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-indigo-600 rounded-full shadow-xl ring-2 ring-white transition-all duration-150 cursor-grab active:cursor-grabbing active:scale-110"
              style={{ left: `calc(${volume}% - 12px)` }}
            />
          </div>
          {/* Invisible input for interaction */}
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label={`Adjust global volume, currently ${volume}%`}
          />
        </div>
        <span className="text-2xl" aria-hidden="true">🔊</span>
        <span className="text-base font-bold text-indigo-600 min-w-[3rem] text-right">
          {volume}%
        </span>
      </div>
    </div>
  );
}

