import React, { useState } from 'react';
import { X, ShieldCheck, Laptop, Cpu, DollarSign, Sparkles, Check, Terminal, ExternalLink, Heart, ChevronRight, Zap } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function OpenAiExplainerModal({ isOpen, onClose, friend, onOpenSettings }) {
  const [activePillar, setActivePillar] = useState('offline');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const pillars = [
    {
      id: 'offline',
      icon: <Laptop className="w-5 h-5 text-cyan-400" />,
      title: '1. Runs on a Laptop with No Internet',
      subtitle: 'Zero Cloud Dependence & 100% Offline Edge Mode',
      accent: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      badge: '100% Offline Capable',
      description: 'Alex frequently studies for technical interviews in subway trains, parks, and coffee shops with spotty or nonexistent Wi-Fi. HypePal AI was engineered with open-source AI at its core so that it never leaves you stranded.',
      highlights: [
        'Local Ollama integration connects directly to http://localhost:11434 with zero network calls.',
        'Runs quantized open-weight models (Llama 3.2 3B, Mistral 7B, Gemma 2 2B) seamlessly on modest consumer laptops.',
        'Built-in procedural edge engine fallback ensures 100% uptime even if all network adapters are disabled in Airplane Mode.',
        'Web Speech API leverages device-native speech synthesis without sending audio streams to external servers.',
      ],
      codeSnippet: 'curl -fsSL https://ollama.com/install.sh | sh\nollama run llama3.2',
    },
    {
      id: 'privacy',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: '2. Complete Mental Health Data Sovereignty',
      subtitle: 'Zero Data Harvesting & Client-Side Isolation',
      accent: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      badge: 'Zero Data Leakage',
      description: 'When someone is spiraling with imposter syndrome, they are at their absolute most vulnerable. They type raw, unfiltered fears: "I am going to freeze on system design and get fired."',
      highlights: [
        'Proprietary cloud AI platforms log prompts, associate them with user IDs, and may retain data to train future models.',
        'With open-weight local inference, zero bytes leave Alex\'s physical machine. No third-party servers, no telemetry, no tracking.',
        'All Victory Vault brag sheet wins and custom challenges are stored strictly in client-side localStorage under user control.',
        'Alex can share deep emotional roadblocks with complete psychological safety, knowing their data cannot be breached or monetized.',
      ],
      codeSnippet: '// 100% Local Inference Endpoint in aiService.js\nconst res = await fetch(\'http://localhost:11434/api/generate\', {\n  method: \'POST\',\n  body: JSON.stringify({ model: \'llama3.2\', prompt })\n});',
    },
    {
      id: 'fine-tune',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: '3. Persona Tuning without Sterile Corporate Guardrails',
      subtitle: 'Unrestricted Empathetic Coaching & CBT Restructuring',
      accent: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      badge: 'Authentic Empathy',
      description: 'Closed proprietary models frequently suffer from hyper-sanitized guardrails. When someone expresses deep frustration like "I want to quit, I feel like a total failure," closed models often trigger robotic legal disclaimers.',
      highlights: [
        'Open models (Llama 3.3 70B, DeepSeek R1, Mistral) allow full system prompt steerability without corporate censorship.',
        'Enables raw, authentic brotherhood/sisterhood hype: passionate validation, playful slang, and high-energy encouragement.',
        'Allows exact Cognitive Behavioral Therapy (CBT) structural prompts to diagnose cognitive distortions without false refusals.',
        'Seamlessly swap models on the fly: Llama 3.3 for emotional resonance, DeepSeek R1 for rigorous analytical reasoning.',
      ],
      codeSnippet: '// System prompt customization without proprietary refusals\nconst prompt = "You are HypePal AI, speaking as " + persona + ". Address " + friendName + " with high conviction.";',
    },
    {
      id: 'cost',
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      title: '4. $0 Run Cost Forever (True Democratization)',
      subtitle: 'No Paywalls, No $20/Month SaaS Subscriptions',
      accent: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      badge: 'Permanently $0',
      description: 'Junior developers looking for their first break and career switchers under financial strain cannot afford $20/month AI subscription fees just to receive career encouragement and interview prep support.',
      highlights: [
        'Open weights cost exactly $0.00 to run on your own hardware indefinitely.',
        'Free Groq Cloud integration provides open-weight inference (Llama 3.3 70B, Qwen 2.5) at 750+ tokens/second at zero cost.',
        'Eliminates billing anxiety: no surprise monthly credit card charges, token exhaustion limits, or sudden tier deactivations.',
        'Anyone, anywhere in the world with a laptop can download HypePal AI and have a world-class cheer squad forever.',
      ],
      codeSnippet: '// Free Groq LPU Open-Weights Integration\nendpoint: \'https://api.groq.com/openai/v1/chat/completions\',\nmodel: \'llama-3.3-70b-versatile\' // Free open weights at 750 tok/s',
    },
  ];

  const currentPillar = pillars.find(p => p.id === activePillar) || pillars[0];

  const handleCopyCmd = (text) => {
    soundService.playPop();
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl glass-panel border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Why Open-Source AI Matters
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
                  Core Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Built for {friend.name} • Hacktoberfest Weekend Challenge 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Why Open Innovation Statement */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 border border-amber-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="font-bold text-amber-400">The Core Philosophy: </span>
            A true friend and mental health safety net cannot be a proprietary black box that mines your vulnerabilities or shuts off when you lose internet connection. Open-source AI transforms HypePal from a commercial service into a permanent, private companion.
          </div>

          {/* 4 Pillars Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pillars.map((pillar) => {
              const isSelected = activePillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => {
                    soundService.playPop();
                    setActivePillar(pillar.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? `${pillar.accent} shadow-md`
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {pillar.icon}
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                  </div>
                  <span className="text-[11px] font-bold truncate">{pillar.title.split('. ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Details Card */}
          <div className="p-5 rounded-2xl glass-card border border-slate-700/80 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1.5 border ${currentPillar.accent}`}>
                  {currentPillar.badge}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {currentPillar.title}
                </h4>
                <p className="text-xs text-slate-400">{currentPillar.subtitle}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPillar.description}
            </p>

            {/* Key Architectural Highlights */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Technical Execution:
              </span>
              <ul className="space-y-1.5">
                {currentPillar.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code / Command Example */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  <span>Architecture Verification:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCmd(currentPillar.codeSnippet)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-mono"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedCmd ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {currentPillar.codeSnippet}
              </pre>
            </div>
          </div>

          {/* Comparison Table: Open-Source AI vs Closed Proprietary */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Why Open Innovation Beats Closed AI for Alex:
            </h5>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5 font-semibold">Evaluation Metric</th>
                    <th className="p-2.5 font-semibold text-emerald-400">HypePal AI (Open-Source Core)</th>
                    <th className="p-2.5 font-semibold text-slate-400">Closed Commercial APIs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-medium text-white">Offline on Laptop</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">✅ 100% Functional (Ollama / Local Edge)</td>
                    <td className="p-2.5 text-rose-400">❌ Completely Inoperable</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">Mental Health Privacy</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">✅ 0 Bytes Leave Hard Drive</td>
                    <td className="p-2.5 text-rose-400">❌ Server Logging & Model Training</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">Prompt Steerability</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">✅ Deep CBT Structure & Persona Warmth</td>
                    <td className="p-2.5 text-amber-400">⚠️ Sterile Corporate Disclaimers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium text-white">Cost to Run</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">✅ $0.00 Forever</td>
                    <td className="p-2.5 text-slate-400">$20+/month Subscription / Pay-Per-Token</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>Built with open weights for real humans.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundService.playPop();
                onClose();
                if (onOpenSettings) onOpenSettings();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Configure Open Models</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundService.playPop();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}