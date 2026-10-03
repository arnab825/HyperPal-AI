import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, Copy, Check, Heart, Sparkles, Share2, 
  Download, Link2, MessageCircle, Wand2, Loader2, RefreshCw 
} from 'lucide-react';
import { generatePostcardAiMessage } from '../services/aiService';

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

const AI_OCCASIONS = [
  { id: 'interview', label: 'Tech Interview', icon: '💼', theme: 'cyber' },
  { id: 'bug', label: 'Stuck on Bug', icon: '🐛', theme: 'aurora' },
  { id: 'imposter', label: 'Imposter Trap', icon: '🧠', theme: 'sunset' },
  { id: 'rejection', label: 'Post-Rejection', icon: '💔', theme: 'sunset' },
  { id: 'celebrate', label: 'Shipped a Win', icon: '🎉', theme: 'cyber' },
  { id: 'monday', label: 'Monday Blues', icon: '☕', theme: 'galaxy' },
];

const AI_VIBES = [
  { id: 'hype', label: 'Hype Beast', icon: '⚡' },
  { id: 'bestie', label: 'Bestie Love', icon: '💖' },
  { id: 'mentor', label: 'Wise Mentor', icon: '🎯' },
  { id: 'zen', label: 'Zen Calm', icon: '🌊' },
];

export default function PepPostcard({ friend, sharedCard, onUpdateFriend, settings }) {
  const initialTheme = sharedCard?.theme 
    ? (CARD_THEMES.find(t => t.id === sharedCard.theme) || CARD_THEMES[0])
    : CARD_THEMES[0];

  const [theme, setTheme] = useState(initialTheme);
  const [message, setMessage] = useState(sharedCard?.msg || PRESET_MESSAGES[0]);
  const [signature, setSignature] = useState(sharedCard?.from || 'Your Biggest Cheerleader');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReceivedCard, setIsReceivedCard] = useState(Boolean(sharedCard?.isReceived));

  // AI Composer states
  const [aiOccasion, setAiOccasion] = useState('interview');
  const [aiVibe, setAiVibe] = useState('hype');
  const [aiDetail, setAiDetail] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiComposer, setShowAiComposer] = useState(true);

  // Trigger celebration confetti when opened via a shared link
  useEffect(() => {
    if (sharedCard?.isReceived) {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (sharedCard.to && onUpdateFriend && sharedCard.to !== friend.name) {
        onUpdateFriend(prev => ({ ...prev, name: sharedCard.to }));
      }
    }
  }, [sharedCard]);

  // AI Generation Handler
  const handleGenerateAiMessage = async () => {
    setIsGeneratingAi(true);
    try {
      const generated = await generatePostcardAiMessage({
        friendName: friend.name,
        occasion: aiOccasion,
        vibe: aiVibe,
        customDetail: aiDetail || friend.challenge,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });

      if (generated) {
        setMessage(generated);
        // Automatically set theme based on selected occasion
        const matchedOccasion = AI_OCCASIONS.find(o => o.id === aiOccasion);
        if (matchedOccasion) {
          const matchedTheme = CARD_THEMES.find(t => t.id === matchedOccasion.theme);
          if (matchedTheme) setTheme(matchedTheme);
        }

        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (e) {
      console.error('Failed to generate AI card message:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Generate public interactive share URL
  const generateShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams();
    params.set('to', friend.name);
    params.set('from', signature);
    params.set('theme', theme.id);
    params.set('msg', message);
    return `${origin}${pathname}?${params.toString()}#postcard`;
  };

  // 1. Copy Live Web Link
  const handleCopyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // 2. Native Web Share API (WhatsApp, iMessage, Slack, etc.)
  const handleNativeShare = async () => {
    const shareUrl = generateShareUrl();
    const shareData = {
      title: `⚡ A Personal Hype Card for ${friend.name}!`,
      text: `"${message}" — From ${signature}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // 3. Share to WhatsApp
  const handleWhatsAppShare = () => {
    const shareUrl = generateShareUrl();
    const text = `💌 *A Personal Hype Card for ${friend.name}!*\n\n"${message}"\n\n— *From ${signature}*\n\nOpen interactive card: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 4. Share to X / Twitter
  const handleTwitterShare = () => {
    const shareUrl = generateShareUrl();
    const tweet = `Sending a personal digital hype card to ${friend.name} with #HypePalAI! ⚡\n\n"${message.slice(0, 100)}..."\n\n#BuildForAFriend #Hacktoberfest\n${shareUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  // 5. Copy Formatted ASCII / Markdown Text
  const handleCopyTextCard = () => {
    const formattedCard = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💌 A PERSONAL HYPE CARD FOR ${friend.name.toUpperCase()}
From: ${signature}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"${message}"

⚡ Created with HypePal AI — Built for a Friend!
View live: ${generateShareUrl()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(formattedCard);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  // 6. Download as High-Resolution PNG Image (1200x630 Social / HD)
  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Theme background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    if (theme.id === 'cyber') {
      bgGrad.addColorStop(0, '#f59e0b');
      bgGrad.addColorStop(0.5, '#e11d48');
      bgGrad.addColorStop(1, '#7e22ce');
    } else if (theme.id === 'sunset') {
      bgGrad.addColorStop(0, '#f97316');
      bgGrad.addColorStop(0.5, '#ec4899');
      bgGrad.addColorStop(1, '#dc2626');
    } else if (theme.id === 'aurora') {
      bgGrad.addColorStop(0, '#10b981');
      bgGrad.addColorStop(0.5, '#0d9488');
      bgGrad.addColorStop(1, '#1d4ed8');
    } else {
      bgGrad.addColorStop(0, '#4f46e5');
      bgGrad.addColorStop(0.5, '#7e22ce');
      bgGrad.addColorStop(1, '#090d16');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Dark glass inner container
    ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
    ctx.beginPath();
    ctx.roundRect(40, 40, 1120, 550, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Top Header info
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('⚡ SPECIAL DELIVERY', 80, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(`FOR: ${friend.name.toUpperCase()}`, 80, 140);

    // Official Hype Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(930, 80, 190, 44, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL HYPE', 1025, 107);
    ctx.textAlign = 'left';

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(80, 175);
    ctx.lineTo(1120, 175);
    ctx.stroke();

    // Big Quotes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.font = 'italic 90px Georgia, serif';
    ctx.fillText('“', 75, 270);

    // Message text wrapping
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 500 28px system-ui, -apple-system, sans-serif';
    const words = message.split(' ');
    let line = '';
    let y = 260;
    const maxWidth = 960;
    const lineHeight = 44;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 100, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // Footer signature
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(80, 480);
    ctx.lineTo(1120, 480);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('SENT WITH HEART FROM:', 80, 520);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(signature, 80, 552);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('#BuildForAFriend • HypePal AI', 1120, 545);

    // Trigger download
    const link = document.createElement('a');
    link.download = `hype-card-${friend.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Received Card Celebration Banner */}
      {isReceivedCard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between gap-4 animate-pulse-glow">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">💌</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                You received an official Hype Card from {signature}!
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300">
                This personalized card was crafted just for you on HypePal AI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReceivedCard(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer shrink-0"
          >
            Create Reply Card ⚡
          </button>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-pink-950/20 to-slate-950/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-pink-400/10 border border-pink-400/20 text-pink-300 text-[11px] sm:text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
            <span>Direct Friend Delivery</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Send a Digital Hype Card 💌
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Craft an AI-personalized high-energy postcard to text, WhatsApp, Slack, or DM to {friend.name}. One thoughtful gesture can completely flip someone's day around.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Customizer controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card space-y-4">
            
            {/* AI Magic Card Composer Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-amber-950/20 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Magic Card Composer</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiComposer(!showAiComposer)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  {showAiComposer ? 'Hide' : 'Expand'}
                </button>
              </div>

              {showAiComposer && (
                <div className="space-y-3 pt-1">
                  {/* Occasion / Use Case Selector */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      1. Select Occasion / Use Case
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AI_OCCASIONS.map((occ) => (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => setAiOccasion(occ.id)}
                          className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                            aiOccasion === occ.id
                              ? 'bg-purple-500/20 border-purple-400/60 text-purple-200 shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-xs shrink-0">{occ.icon}</span>
                          <span className="truncate">{occ.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibe Selector */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      2. Tone & Voice Vibe
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AI_VIBES.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setAiVibe(v.id)}
                          className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                            aiVibe === v.id
                              ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <span className="text-xs shrink-0">{v.icon}</span>
                          <span className="truncate">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Friend Note */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      3. Specific Context (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${friend.challenge || 'System design interview at 2pm'}`}
                      value={aiDetail}
                      onChange={(e) => setAiDetail(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  {/* AI Generate Button */}
                  <button
                    type="button"
                    onClick={handleGenerateAiMessage}
                    disabled={isGeneratingAi}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Crafting Personalized AI Card...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate with AI for {friend.name}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Visual Theme Style */}
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
                        ? 'border-amber-400 bg-slate-800/90 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-br shrink-0 ${t.bg}`} />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Message Content
                </label>
                <span className="text-[10px] text-slate-500">Editable preview text</span>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-pink-400 resize-none leading-relaxed"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Quick Presets:</span>
              <div className="flex flex-col gap-2">
                {PRESET_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(msg)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      message === msg
                        ? 'bg-pink-500/10 border-pink-500/40 text-pink-200 shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs shrink-0 select-none">
                        {i === 0 ? '🚀' : i === 1 ? '💖' : '☕'}
                      </span>
                      <span className="text-xs truncate block min-w-0 flex-1 leading-normal">
                        "{msg}"
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Input */}
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

            {/* Main Primary Share Action */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <button
                onClick={handleNativeShare}
                className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share Card with {friend.name}</span>
              </button>

              {/* Quick 1-Click Platform Channels */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleTwitterShare}
                  className="py-2.5 px-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post on X</span>
                </button>
              </div>

              {/* Utility Exports: Copy Link & Download PNG */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    copiedLink
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Save Image (PNG)</span>
                </button>
              </div>

              {/* Copy Plain Text for Slack / Discord */}
              <button
                type="button"
                onClick={handleCopyTextCard}
                className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-3 h-3 text-pink-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedText ? 'Copied ASCII text!' : 'Copy formatted text for Slack / Discord'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Card Visualizer */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <div className={`w-full max-w-lg rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-br ${theme.bg} shadow-2xl shadow-purple-950/50 relative overflow-hidden transition-all duration-300`}>
            <div className="rounded-[18px] sm:rounded-[22px] bg-slate-950/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] space-y-6 relative">
              {/* Card top */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl sm:text-2xl shrink-0">⚡</span>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">Special Delivery</h3>
                    <p className="text-xs sm:text-sm font-extrabold text-white truncate">For: {friend.name}</p>
                  </div>
                </div>

                <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${theme.border} bg-slate-900/80 text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${theme.text} shrink-0`}>
                  Official Hype
                </div>
              </div>

              {/* Message quote */}
              <div className="relative my-auto py-2">
                <span className="text-4xl sm:text-5xl font-serif text-slate-700/40 absolute -top-5 sm:-top-6 -left-2 sm:-left-3 select-none">“</span>
                <p className="text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed italic z-10 relative">
                  {message}
                </p>
                <span className="text-4xl sm:text-5xl font-serif text-slate-700/40 absolute -bottom-8 sm:-bottom-10 right-2 select-none">”</span>
              </div>

              {/* Footer / Signature */}
              <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Sent with heart from:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 truncate block">{signature}</span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono shrink-0">
                  #BuildForAFriend
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}