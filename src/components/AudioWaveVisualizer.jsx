import React from 'react';

export default function AudioWaveVisualizer({ isPlaying = false, accentColor = 'bg-amber-400' }) {
  if (!isPlaying) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 h-6 px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 shrink-0">
      <span className="hidden sm:inline text-[11px] text-slate-300 font-medium mr-1 animate-pulse">
        Voice Active
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1 sm:hidden" />
      {[40, 90, 60, 100, 50, 80, 45, 95].map((height, i) => (
        <span
          key={i}
          className={`w-0.5 sm:w-1 rounded-full ${accentColor}`}
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
