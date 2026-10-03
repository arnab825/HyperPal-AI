import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Copy, Check, BookmarkPlus, Sparkles, RefreshCw, Flame } from 'lucide-react';
import { PERSONAS, SITUATIONS, generateHypeSpeech } from '../services/aiService';
import { speechService } from '../services/speechService';
import AudioWaveVisualizer from './AudioWaveVisualizer';
import { soundService } from '../services/soundService';

export default function HypeGenerator({ friend, onSaveToVault, settings }) {
  const [selectedPersona, setSelectedPersona] = useState('hype');
  const [selectedSituation, setSelectedSituation] = useState(SITUATIONS[0].id);
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hypeSpeech, setHypeSpeech] = useState(
    `Listen to me right now, ${friend.name}: DROP whatever self-doubt just tried to whisper in your ear!\n\nDo you have any idea how much grit it took for you to even be in this arena? You are out here solving complex challenges while others are hesitating. You are resilient, relentless, and completely capable.\n\nTake a massive breath, square your shoulders, and walk into today like you own the blueprint. LFG, ${friend.name}! You are built for this! ⚡🔥`
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const activePersonaObj = PERSONAS[selectedPersona];

  const handleGenerate = async () => {
    setIsGenerating(true);
    speechService.stop();
    setIsSpeaking(false);
    setSaved(false);

    try {
      const situationObj = SITUATIONS.find(s => s.id === selectedSituation);
      const generated = await generateHypeSpeech({
        friendName: friend.name,
        persona: selectedPersona,
        situation: situationObj ? situationObj.label : '',
        notes: customNotes,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });

      setHypeSpeech(generated);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      speechService.speak(hypeSpeech, {
        persona: selectedPersona,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleCopy = () => {
    soundService.playPop();
    navigator.clipboard.writeText(hypeSpeech);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWin = () => {
    if (!saved) {
      soundService.playSuccess();
      onSaveToVault({
        title: `Hype Booster for ${friend.name}`,
        content: hypeSpeech,
        persona: selectedPersona,
        category: 'wellness',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      setSaved(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] sm:text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>Power Up {friend.name}'s Mindset</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
            Turn Doubts into Pure Momentum ⚡
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Everyone needs a dedicated hype squad. Select an AI personality, pick what {friend.name} is facing right now, and let HypePal craft an unforgettable boost.
          </p>
        </div>
      </div>

      {/* Persona Selection */}
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Choose the Hype Persona</span>
          </label>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Tailored voice & tone</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {Object.values(PERSONAS).map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  soundService.playPop();
                  setSelectedPersona(p.id);
                  if (isSpeaking) speechService.stop();
                  setIsSpeaking(false);
                }}
                className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `glass-panel border-2 ${p.borderColor} shadow-lg shadow-purple-500/10 scale-[1.01]`
                    : 'glass-card hover:border-slate-700/80 hover:bg-slate-900/60'
                }`}
                style={{
                  boxShadow: isSelected ? `0 10px 25px -5px ${p.bgGlow}` : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                      {p.avatar}
                    </span>
                    {isSelected && (
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-800 border ${p.borderColor} ${p.accentColor}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">{p.name}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 leading-snug line-clamp-2">{p.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Situation & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left: Quick chips & context */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              2. What is {friend.name} facing?
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SITUATIONS.map((s) => {
                const isSelected = selectedSituation === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSituation(s.id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="text-[11px] sm:text-xs">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              3. Specific details (optional)
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder={`e.g., "${friend.name} worked 12 hours debugging a memory leak and thinks they won't pass tomorrow's demo"`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950 shrink-0" />
                <span>Brewing High-Voltage Hype...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 shrink-0" />
                <span>Ignite Pep-Talk for {friend.name}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: The Speech Output Card */}
        <div className="lg:col-span-2">
          <div className="h-full flex flex-col rounded-2xl sm:rounded-3xl glass-panel border border-slate-800/80 overflow-hidden shadow-2xl relative">
            {/* Top card bar */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between flex-wrap gap-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{activePersonaObj.avatar}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                    {activePersonaObj.name}'s Dispatch
                  </h4>
                  <span className="text-[10px] text-slate-400 truncate block">Dedicated to {friend.name}</span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <AudioWaveVisualizer isPlaying={isSpeaking} accentColor="bg-amber-400" />
                <button
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud with AI voice'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Speech Body */}
            <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950/50">
              <blockquote className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-medium whitespace-pre-line tracking-wide font-['Plus_Jakarta_Sans']">
                {hypeSpeech}
              </blockquote>

              {/* Card Footer Actions */}
              <div className="pt-3.5 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSaveWin}
                    disabled={saved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      saved
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <BookmarkPlus className={`w-3.5 h-3.5 ${saved ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{saved ? 'Saved' : 'Save Win'}</span>
                  </button>
                </div>

                <div className="text-[10px] sm:text-[11px] text-slate-500">
                  <span>AI Powered Hype</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
