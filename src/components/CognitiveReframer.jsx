import React, { useState } from 'react';
import { Brain, ArrowRight, CheckCircle2, ShieldCheck, Zap, RefreshCw, BookmarkPlus } from 'lucide-react';
import { reframeThought } from '../services/aiService';

const SAMPLE_THOUGHTS = [
  "I'm a complete fraud. Everyone else on my team grasps this architecture instantly, and I'm drowning.",
  "I stumbled over one answer in the interview, the entire opportunity is ruined.",
  "My pull request had 14 review comments. My senior engineer probably thinks I can't code.",
  "I haven't coded in a week and feel so behind that I don't even know where to start.",
];

export default function CognitiveReframer({ friend, onSaveToVault, settings }) {
  const [thought, setThought] = useState(SAMPLE_THOUGHTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleAnalyze = async () => {
    if (!thought.trim()) return;
    setIsAnalyzing(true);
    setSaved(false);

    try {
      const data = await reframeThought({
        thought,
        friendName: friend.name,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToVault = () => {
    if (!result || saved) return;
    onSaveToVault({
      title: `Breakthrough Reframe for ${friend.name}`,
      content: `Distortion: ${result.distortion}\n\nReframe: ${result.reframedThought}\n\nMicro-Action: ${result.microAction}`,
      category: 'life',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-purple-950/30 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 text-[11px] sm:text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>CBT-Backed Distortion Buster</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Reframe It! 🧠
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            When stress strikes, our minds play tricks on us—catastrophizing, magnifying mistakes, or whispering imposter syndrome. Drop {friend.name}'s spiraling thought below to dissect the distortion and extract empowering truth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>What is {friend.name}'s brain saying?</span>
              <span className="text-[10px] text-slate-500">Unfiltered thought</span>
            </label>

            <textarea
              rows={4}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="e.g., I'm not smart enough for this role, everyone is going to figure out I don't belong here."
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none"
            />

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">Quick Prompts to Try:</span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_THOUGHTS.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setThought(st)}
                    className="text-left text-xs p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/60 text-slate-300 transition-all hover:text-purple-300 line-clamp-2 leading-snug cursor-pointer"
                  >
                    "{st}"
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !thought.trim()}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Dismantling Cognitive Distortion...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Bust This Distortion</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl glass-panel border border-slate-800/80 space-y-5 sm:space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 gap-2 flex-wrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs uppercase font-bold text-rose-400 tracking-wider">Identified Distortion</h3>
                    <p className="text-sm sm:text-base font-bold text-white truncate">{result.distortion}</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveToVault}
                  disabled={saved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shrink-0 ${
                    saved
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <BookmarkPlus className={`w-3.5 h-3.5 ${saved ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{saved ? 'Saved' : 'Save Reframe'}</span>
                </button>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {/* The Trap */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">The Trap:</span>
                  <p className="text-xs text-rose-200/90 leading-relaxed">{result.distortionDesc}</p>
                </div>

                {/* Reality Check */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-950/20 border border-blue-900/30 space-y-1">
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">The Objective Reality Check:</span>
                  <p className="text-xs text-blue-200/90 leading-relaxed">{result.realityCheck}</p>
                </div>

                {/* Empowering Reframe */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/20 border border-emerald-800/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>The Empowering Reframe for {friend.name}:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-relaxed">
                    "{result.reframedThought}"
                  </p>
                </div>

                {/* Micro-Action */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">2-Minute Dopamine Action:</h4>
                    <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">{result.microAction}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[250px] sm:min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass-card text-center space-y-3 border-dashed border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-300">Ready to Deconstruct Doubts</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Enter an anxious thought or tap one of the quick prompts to see the cognitive distortion broken down in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
