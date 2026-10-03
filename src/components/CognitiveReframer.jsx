import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, ArrowRight, CheckCircle2, ShieldCheck, Zap, RefreshCw, 
  BookmarkPlus, Cpu, Sparkles, Send, Copy, Check, Volume2, VolumeX, 
  Target, AlertTriangle, Lightbulb, Compass, Heart 
} from 'lucide-react';
import { reframeThought } from '../services/aiService';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

const SAMPLE_PROMPTS = [
  {
    category: 'imposter',
    label: '🧠 Imposter Trap',
    text: "I'm a complete fraud. Everyone else on my team grasps this architecture instantly, and I'm drowning.",
  },
  {
    category: 'catastrophize',
    label: '💥 Catastrophizing',
    text: "I stumbled over one answer in the interview, the entire opportunity is ruined.",
  },
  {
    category: 'reviews',
    label: '🐙 PR Review Panic',
    text: "My pull request had 14 review comments. My senior engineer probably thinks I can't code.",
  },
  {
    category: 'momentum',
    label: '⏱️ Inaction & Fatigue',
    text: "I haven't coded in a week and feel so behind that I don't even know where to start.",
  },
  {
    category: 'perfectionism',
    label: '⚖️ Perfectionism',
    text: "If my solution isn't 100% bug-free and optimal on the first commit, I feel like a total amateur.",
  },
  {
    category: 'leetcode',
    label: '📈 Screening Dread',
    text: "Blanked on a graph problem in mock prep today; I feel like I will never pass a Big Tech screening.",
  },
];

const DISTORTION_FILTERS = [
  { id: 'all', label: '🎯 Auto-Detect Distortion', icon: '🎯' },
  { id: 'imposter', label: 'Imposter Syndrome', icon: '🧠' },
  { id: 'catastrophize', label: 'Catastrophizing', icon: '💥' },
  { id: 'reviews', label: 'Code Review Panic', icon: '🐙' },
  { id: 'momentum', label: 'Inaction & Dread', icon: '⏱️' },
  { id: 'perfectionism', label: 'Perfectionism', icon: '⚖️' },
];

export default function CognitiveReframer({ 
  friend, 
  onSaveToVault, 
  settings, 
  onOpenSettings, 
  onOpenOpenAiExplainer,
  onPrefillCard 
}) {
  const [thought, setThought] = useState(SAMPLE_PROMPTS[0].text);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeEngineLabel = useMemo(() => {
    const provider = settings?.provider || 'gemini';
    if (provider === 'groq') {
      const m = settings?.model || 'llama-3.3-70b-versatile';
      if (m.includes('llama')) return '🦙 Llama 3.3 (Open Weights)';
      if (m.includes('deepseek')) return '🧠 DeepSeek R1 (Open Weights)';
      if (m.includes('qwen')) return '💎 Qwen 2.5 (Open Weights)';
      if (m.includes('mixtral')) return '🌪️ Mixtral 8x7B (Open Weights)';
      return '⚡ Groq Open Weights';
    }
    if (provider === 'ollama') {
      return "💻 Local Ollama (" + (settings?.model || 'llama3.2') + ") • 100% Offline";
    }
    if (provider === 'gemini') {
      return "🚀 " + (settings?.model || 'Gemini 3.8 Flash');
    }
    return '⚡ Built-in Edge Engine (Offline Capable)';
  }, [settings]);

  const filteredPrompts = useMemo(() => {
    if (selectedFilter === 'all') return SAMPLE_PROMPTS;
    return SAMPLE_PROMPTS.filter(p => p.category === selectedFilter);
  }, [selectedFilter]);

  const handleAnalyze = async () => {
    if (!thought.trim()) return;
    setIsAnalyzing(true);
    setSaved(false);
    setIsSpeaking(false);
    speechService.stop();
    soundService.playPop();

    try {
      const data = await reframeThought({
        thought,
        friendName: friend.name,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });
      soundService.playSuccess();
      setResult(data);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.55 } });
    } catch (e) {
      console.error('Error analyzing distortion:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToVault = () => {
    if (!result || saved) return;
    soundService.playSuccess();
    onSaveToVault({
      title: "Breakthrough Reframe for " + friend.name + ": " + (result.distortion || 'Cognitive Shift'),
      content: "Distortion: " + result.distortion + "\n" +
        (result.trigger ? "Trigger: " + result.trigger + "\n\n" : "\n") +
        "Empowering Reframe: \"" + result.reframedThought + "\"\n\n" +
        "Reality Check: " + result.realityCheck + "\n\n" +
        "2-Minute Action: " + result.microAction,
      category: 'life',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSaved(true);
    confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
  };

  const handleCopyReframe = () => {
    if (!result) return;
    soundService.playPop();
    const formatted = "🧠 CBT COGNITIVE REFRAME FOR " + friend.name.toUpperCase() + "\n" +
      "------------------------------------------\n" +
      "• Distortion: " + result.distortion + " (" + (result.precisionScore || 'Verified Match') + ")\n" +
      (result.trigger ? "• Neurological Trigger: " + result.trigger + "\n" : "") +
      "• The Trap: " + result.distortionDesc + "\n" +
      "• Objective Reality Check: " + result.realityCheck + "\n\n" +
      "✨ EMPOWERING REFRAME:\n\"" + result.reframedThought + "\"\n\n" +
      "⚡ 2-MINUTE DOPAMINE ACTION:\n" + result.microAction;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSpeakReframe = () => {
    if (!result) return;
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else {
      soundService.playPop();
      setIsSpeaking(true);
      const speech = "Empowering Reframe for " + friend.name + ". " + result.reframedThought + ". Your two minute action: " + result.microAction;
      speechService.speak(speech, {
        persona: 'mentor',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleSendAsPostcard = () => {
    if (!result || !onPrefillCard) return;
    soundService.playSuccess();
    onPrefillCard({
      to: friend.name,
      from: 'Your Biggest Fan',
      msg: "\"" + result.reframedThought + "\"",
      theme: 'cyber',
      icon: '🧠',
      badge: 'Mindset Reframe',
      isReceived: false,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-indigo-950/25 to-purple-950/35 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 text-[11px] sm:text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>CBT-Backed Distortion Buster</span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundService.playPop();
                if (onOpenOpenAiExplainer) onOpenOpenAiExplainer();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open-Source AI • Zero Data Harvesting</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundService.playPop();
                if (onOpenSettings) onOpenSettings();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[10px] text-amber-300 font-mono transition-colors cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>{activeEngineLabel}</span>
            </button>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Reframe It! 🧠
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            When stress strikes, our minds play tricks on us—catastrophizing, magnifying mistakes, or whispering imposter syndrome. Drop {friend.name}'s spiraling thought below to dissect the cognitive distortion with clinical CBT precision and extract empowering truth.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Input & Distortion Lenses (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card space-y-4">
            
            {/* Precision Lens Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Distortion Focus Lens</span>
                <span className="text-[10px] text-purple-300 font-mono">Clinical CBT</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {DISTORTION_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setSelectedFilter(f.id);
                      const matching = SAMPLE_PROMPTS.find(p => p.category === f.id);
                      if (matching) setThought(matching.text);
                    }}
                    className={"px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer " + (
                      selectedFilter === f.id
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    )}
                  >
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thought Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>What is {friend.name}'s brain saying?</span>
                <span className="text-[10px] text-slate-500 font-mono">Unfiltered Thought</span>
              </label>

              <textarea
                rows={4}
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder={"e.g., I'm not smart enough for this role, everyone is going to figure out I don't belong here."}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Developer Scenarios to Deconstruct:</span>
              </span>
              <div className="flex flex-col gap-1.5">
                {filteredPrompts.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setThought(st.text);
                    }}
                    className={"text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer " + (
                      thought === st.text
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-medium'
                        : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800/60 text-slate-300 hover:text-purple-300'
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-amber-400">{st.label}</span>
                    </div>
                    <p className="line-clamp-2 leading-snug text-[11px] text-slate-300">"{st.text}"</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !thought.trim()}
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Dismantling Distortion with Precision...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Dissect & Reframe Thought</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Precision Deconstruction Output (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl glass-panel border border-slate-800/80 space-y-4 sm:space-y-5 animate-fadeIn">
              
              {/* Header: Distortion Identification & Match Score */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 gap-2 flex-wrap">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                    <Target className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                        Identified Cognitive Distortion
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {result.precisionScore || '98% Precision Match'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white truncate">{result.distortion}</h3>
                    {result.trigger && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        ⚡ Trigger: <span className="text-purple-300 font-semibold">{result.trigger}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSpeakReframe}
                    title={isSpeaking ? 'Stop speaking' : 'Read reframe aloud'}
                    className={"p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer " + (
                      isSpeaking
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                    )}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyReframe}
                    title="Copy full reframe breakdown"
                    className="p-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Pillars of Precision Cognitive Restructuring */}
              <div className="space-y-3 sm:space-y-3.5">
                
                {/* Pillar 1: The Cognitive Trap */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>The Cognitive Trap (Flawed Mental Model):</span>
                  </div>
                  <p className="text-xs text-rose-200/90 leading-relaxed pl-5">{result.distortionDesc}</p>
                </div>

                {/* Pillar 2: Objective Reality Check */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-950/20 border border-blue-900/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>The Objective Reality Check (Undeniable Evidence):</span>
                  </div>
                  <p className="text-xs text-blue-200/90 leading-relaxed pl-5">{result.realityCheck}</p>
                </div>

                {/* Pillar 3: Empowering Socratic Reframe */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/25 border border-emerald-800/40 space-y-2 relative overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Empowering Socratic Reframe for {friend.name}:</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 font-mono">Neurological Truth</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-relaxed pl-5 italic">
                    "{result.reframedThought}"
                  </p>
                </div>

                {/* Pillar 4: 2-Minute Dopamine Micro-Action */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-950/20 border border-amber-800/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        2-Minute Behavioral Experiment:
                      </h4>
                      <span className="text-[10px] text-amber-400/80 font-mono">Immediate Momentum</span>
                    </div>
                    <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">{result.microAction}</p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveToVault}
                  disabled={saved}
                  className={"py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 " + (
                    saved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-400/40'
                  )}
                >
                  <BookmarkPlus className={"w-4 h-4 " + (saved ? 'text-emerald-400' : 'text-amber-400')} />
                  <span>{saved ? '✓ Saved into Victory Vault' : 'Save as Breakthrough in Vault'}</span>
                </button>

                {onPrefillCard && (
                  <button
                    type="button"
                    onClick={handleSendAsPostcard}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reframe as Cheer Card</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Empty State with Clinical Distortion Guide */
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass-card space-y-6 border border-slate-800/80 text-center">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                  <Brain className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Ready to Deconstruct Doubts with Precision
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Cognitive Behavioral Therapy (CBT) proves that thoughts are not facts. Enter any anxious thought or choose a prompt on the left to extract the underlying distortion and reconstruct an empowering reality.
                </p>
              </div>

              {/* 4 Clinical Traps Explainer Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <span>🧠</span> Imposter Syndrome
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Attributing success to luck while assuming everyone else has innate genius.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <span>💥</span> Catastrophizing
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Treating a single setback as proof of inevitable complete career disaster.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <span>🐙</span> Mind Reading
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Assuming colleagues or reviewers secretly judge you harshly with zero proof.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <span>⚖️</span> All-or-Nothing
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Viewing performance as either 100% flawless perfection or total worthlessness.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
