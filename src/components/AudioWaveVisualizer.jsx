import React from 'react';

export default function AudioWaveVisualizer({ isPlaying = false, accentColor = 'bg-amber-400' }) {
  if (!isPlaying) return null;

  return (
    <div className="flex items-center gap-1.5 h-6 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50">
      <span className="text-xs text-slate-300 font-medium mr-1.5 animate-pulse">Voice Active</span>
      {[40, 90, 60, 100, 50, 80, 45, 95].map((height, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${accentColor}`}
          style={{
            height: `${height}%`,
            animation: `soundWave 1.2s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes soundWave {
          0% { height: 20%; transform: scaleY(0.4); }
          100% { height: 100%; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
