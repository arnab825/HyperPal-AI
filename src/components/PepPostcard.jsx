import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Copy, Check, Heart, Sparkles, Wand2 } from 'lucide-react';

const CARD_THEMES = [
  { id: 'cyber', name: 'Neon Cyber', bg: 'from-amber-500 via-rose-600 to-purple-700', border: 'border-amber-400/40', text: 'text-amber-300' },
  { id: 'sunset', name: 'Golden Sunset', bg: 'from-orange-500 via-pink-500 to-red-600', border: 'border-pink-400/40', text: 'text-pink-200' },
  { id: 'aurora', name: 'Emerald Aurora', bg: 'from-emerald-500 via-teal-600 to-blue-700', border: 'border-teal-400/40', text: 'text-teal-200' },
  { id: 'galaxy', name: 'Deep Space', bg: 'from-indigo-600 via-purple-700 to-slate-900', border: 'border-purple-400/40', text: 'text-purple-200' },
];

const PRESET_MESSAGES = [
  "Just a quick reminder: you are 100x smarter and more capable than your anxious brain is letting you believe today. Keep moving forward! 🚀",
  "Dropping this in your inbox because you've been working tirelessly. Don't forget how far you've come. I'm rooting for you always! 💖",
  "Take a breath, grab a coffee, and remember: bugs and setbacks are temporary, but your grit is permanent. You got this! ⚡",
];

export default function PepPostcard({ friend }) {
  const [theme, setTheme] = useState(CARD_THEMES[0]);
  const [message, setMessage] = useState(PRESET_MESSAGES[0]);
  const [signature, setSignature] = useState('Your Biggest Cheerleader');
  const [copied, setCopied] = useState(false);

  const handleCopyCard = () => {
    const formattedCard = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💌 A PERSONAL HYPE CARD FOR ${friend.name.toUpperCase()}
From: ${signature}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${message}"

⚡ Created with HypePal AI — Built for a Friend!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(formattedCard);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-pink-950/20 to-slate-950/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-400/10 border border-pink-400/20 text-pink-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Direct Friend Delivery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Send a Digital Hype Card 💌
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Craft a personalized high-energy postcard to text, Slack, or DM to {friend.name}. One thoughtful message can completely flip someone's day around.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customizer controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Card Theme Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CARD_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center gap-2 ${
                      theme.id === t.id
                        ? 'border-amber-400 bg-slate-800/90 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${t.bg}`} />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Message Content
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-pink-400 resize-none leading-relaxed"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Quick Presets:</span>
              <div className="flex flex-col gap-1.5">
                {PRESET_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(msg)}
                    className="text-left text-xs p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/60 text-slate-300 transition-all truncate"
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Your Signature / From:
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-pink-400"
              />
            </div>

            <button
              onClick={handleCopyCard}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Card Text!' : `Copy Card to Send to ${friend.name}`}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Card Visualizer */}
        <div className="lg:col-span-7 flex justify-center">
          <div className={`w-full max-w-lg rounded-3xl p-1 bg-gradient-to-br ${theme.bg} shadow-2xl shadow-purple-950/50 relative overflow-hidden transition-all duration-300`}>
            <div className="rounded-[22px] bg-slate-950/90 backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between min-h-[380px] space-y-8 relative">
              {/* Decorative elements */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Special Delivery</h3>
                    <p className="text-sm font-extrabold text-white">For: {friend.name}</p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full border ${theme.border} bg-slate-900/80 text-[10px] font-black uppercase tracking-wider ${theme.text}`}>
                  Official Hype
                </div>
              </div>

              {/* Message quote */}
              <div className="relative my-auto">
                <span className="text-5xl font-serif text-slate-700/40 absolute -top-6 -left-3 select-none">“</span>
                <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed italic z-10 relative">
                  {message}
                </p>
                <span className="text-5xl font-serif text-slate-700/40 absolute -bottom-10 right-2 select-none">”</span>
              </div>

              {/* Footer / Signature */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sent with heart from:</span>
                  <span className="text-xs font-bold text-slate-200">{signature}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  #BuildForAFriend • 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
