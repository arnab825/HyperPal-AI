import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, Copy, Check, Heart, Sparkles, Share2, 
  Download, Link2, MessageCircle, Wand2, Loader2, 
  Palette, Type, Award, Smile, Flame, Shield, 
  Lightbulb, Zap, Coffee 
} from 'lucide-react';
import { generatePostcardAiMessage } from '../services/aiService';
import { soundService } from '../services/soundService';

const CARD_THEMES = [
  { id: 'cyber', name: 'Neon Cyber', bg: 'from-amber-500 via-rose-600 to-purple-700', border: 'border-amber-400/40', text: 'text-amber-300', dot: 'bg-gradient-to-r from-amber-400 to-rose-500' },
  { id: 'sunset', name: 'Golden Sunset', bg: 'from-orange-500 via-pink-500 to-red-600', border: 'border-pink-400/40', text: 'text-pink-200', dot: 'bg-gradient-to-r from-orange-400 to-pink-500' },
  { id: 'aurora', name: 'Emerald Aurora', bg: 'from-emerald-500 via-teal-600 to-blue-700', border: 'border-teal-400/40', text: 'text-teal-200', dot: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
  { id: 'galaxy', name: 'Deep Space', bg: 'from-indigo-600 via-purple-700 to-slate-900', border: 'border-purple-400/40', text: 'text-purple-200', dot: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
  { id: 'sakura', name: 'Sakura Bloom', bg: 'from-pink-400 via-rose-500 to-fuchsia-600', border: 'border-rose-400/40', text: 'text-rose-200', dot: 'bg-gradient-to-r from-pink-400 to-rose-400' },
  { id: 'solar', name: 'Solar Flare', bg: 'from-yellow-400 via-amber-500 to-red-600', border: 'border-yellow-400/40', text: 'text-yellow-200', dot: 'bg-gradient-to-r from-yellow-400 to-amber-500' },
  { id: 'ice', name: 'Glacial Ice', bg: 'from-cyan-400 via-sky-500 to-blue-700', border: 'border-cyan-400/40', text: 'text-cyan-200', dot: 'bg-gradient-to-r from-cyan-400 to-blue-500' },
  { id: 'obsidian', name: 'Midnight Obsidian', bg: 'from-slate-700 via-slate-800 to-zinc-950', border: 'border-amber-400/30', text: 'text-amber-200', dot: 'bg-gradient-to-r from-slate-600 to-zinc-800' },
];

const CARD_ICONS = ['⚡', '💖', '🚀', '🌟', '🎯', '🔥', '🏆', '💎'];

const BADGE_PRESETS = [
  'Official Hype',
  'Certified Legend',
  'Unstoppable Grit',
  'VIP Bestie',
  'Future Senior Staff',
  'Problem Solver',
];

const FONT_STYLES = [
  { id: 'sans', name: 'Modern Sans', class: "font-['Plus_Jakarta_Sans'] font-medium" },
  { id: 'serif', name: 'Luxury Serif', class: "font-serif italic font-normal tracking-wide" },
  { id: 'mono', name: 'Dev Mono', class: "font-mono text-emerald-300 font-normal" },
  { id: 'hand', name: 'Warm Script', class: "font-['Outfit'] italic font-semibold" },
];

const HEADER_TAGLINES = [
  'Special Delivery',
  'Direct Encouragement',
  'Mindset Armor',
  'Emergency Pep Talk',
];

const PRESET_MESSAGES = [
  "Just a quick reminder: you are 100x smarter and more capable than your anxious brain is letting you believe today. Keep moving forward! 🚀",
  "Dropping this in your inbox because you've been working tirelessly. Don't forget how far you've come. I'm rooting for you always! 💖",
  "Take a breath, grab a coffee, and remember: bugs and setbacks are temporary, but your grit is permanent. You got this! ⚡",
  "No matter how many review comments come back on that pull request, your growth is real and your courage to build matters. Keep shipping! 🐙",
];

const AI_OCCASIONS = [
  { id: 'interview', label: 'Tech Interview', icon: '💼', theme: 'cyber', defaultBadge: 'Interview Ready' },
  { id: 'bug', label: 'Stuck on Bug', icon: '🐛', theme: 'aurora', defaultBadge: 'Debugger Elite' },
  { id: 'imposter', label: 'Imposter Trap', icon: '🧠', theme: 'sunset', defaultBadge: 'Certified Legend' },
  { id: 'rejection', label: 'Post-Rejection', icon: '💔', theme: 'sakura', defaultBadge: 'Unstoppable Grit' },
  { id: 'celebrate', label: 'Shipped a Win', icon: '🎉', theme: 'solar', defaultBadge: 'Mission Complete' },
  { id: 'monday', label: 'Monday Blues', icon: '☕', theme: 'galaxy', defaultBadge: 'Fresh Momentum' },
  { id: 'deadline', label: 'Crunch Deadline', icon: '⏱️', theme: 'solar', defaultBadge: 'Focus Mode' },
  { id: 'first_pr', label: 'First Open Source PR', icon: '🐙', theme: 'sakura', defaultBadge: 'Open Source Rebel' },
];

const AI_TONES = [
  { id: 'hype', label: 'Hype Beast', icon: '⚡', tagline: 'High-octane swagger & explosive fire', border: 'border-amber-500/40', activeBg: 'bg-amber-500/20 text-amber-200' },
  { id: 'bestie', label: 'Empathetic Bestie', icon: '💖', tagline: 'Warm validation & unconditional support', border: 'border-pink-500/40', activeBg: 'bg-pink-500/20 text-pink-200' },
  { id: 'mentor', label: 'Strategic Mentor', icon: '🎯', tagline: 'High-agency tactical wisdom & reframing', border: 'border-blue-500/40', activeBg: 'bg-blue-500/20 text-blue-200' },
  { id: 'zen', label: 'Zen Stoic', icon: '🌊', tagline: 'Grounded calm, deep breaths & clarity', border: 'border-emerald-500/40', activeBg: 'bg-emerald-500/20 text-emerald-200' },
  { id: 'humor', label: 'Witty Dev Humor', icon: '🧪', tagline: 'Playful tech sarcasm & coder solidarity', border: 'border-purple-500/40', activeBg: 'bg-purple-500/20 text-purple-200' },
  { id: 'coach', label: 'Locker Room Coach', icon: '🏆', tagline: 'Halftime rally, discipline & zero excuses', border: 'border-orange-500/40', activeBg: 'bg-orange-500/20 text-orange-200' },
];

const PRESET_CONTEXT_CHIPS = [
  { label: '💼 Mock interview in 30 mins', text: 'Live mock technical interview in 30 minutes, feeling pre-interview adrenaline & panic.' },
  { label: '🐛 Stuck on state race condition', text: 'Spent 6 hours debugging a stubborn race condition in React, hitting a wall.' },
  { label: '🧠 PR had 14 review comments', text: 'Received 14 code review comments from senior dev, spiraling with imposter syndrome.' },
  { label: '💔 Rejected after final round', text: 'Got an automated rejection email after 4 rounds of intense interviews, feeling defeated.' },
  { label: '🚀 Merged first Hacktoberfest PR', text: 'First open source pull request just got approved and merged for Hacktoberfest!' },
  { label: '⏱️ Crunch deadline in 2 hours', text: 'Scrambling to finish project demo before deadline, need laser focus.' },
  { label: '☕ Monday morning backlog dread', text: 'Dreading the upcoming sprint workload and feeling overwhelmed by tickets.' },
  { label: '🧘 Reminder to drink water & breathe', text: 'Stuck behind screen for 8 hours without breaks, need reminder to pause.' },
];

export default function PepPostcard({ friend, sharedCard, onUpdateFriend, settings }) {
  const initialTheme = sharedCard?.theme 
    ? (CARD_THEMES.find(t => t.id === sharedCard.theme) || CARD_THEMES[0])
    : CARD_THEMES[0];

  const initialFont = sharedCard?.font
    ? (FONT_STYLES.find(f => f.id === sharedCard.font) || FONT_STYLES[0])
    : FONT_STYLES[0];

  const [theme, setTheme] = useState(initialTheme);
  const [fontStyle, setFontStyle] = useState(initialFont);
  const [cardIcon, setCardIcon] = useState(sharedCard?.icon || '⚡');
  const [badgeText, setBadgeText] = useState(sharedCard?.badge || 'Official Hype');
  const [tagline, setTagline] = useState('Special Delivery');
  const [message, setMessage] = useState(sharedCard?.msg || PRESET_MESSAGES[0]);
  const [signature, setSignature] = useState(sharedCard?.from || 'Your Biggest Cheerleader');

  const [includeAi, setIncludeAi] = useState(false);
  const [customTab, setCustomTab] = useState('text');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReceivedCard, setIsReceivedCard] = useState(Boolean(sharedCard?.isReceived));

  const [aiOccasion, setAiOccasion] = useState('interview');
  const [aiTone, setAiTone] = useState('hype');
  const [aiDetail, setAiDetail] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    if (sharedCard?.isReceived) {
      soundService.playSuccess();
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      if (sharedCard.to && onUpdateFriend && sharedCard.to !== friend.name) {
        onUpdateFriend(prev => ({ ...prev, name: sharedCard.to }));
      }
    }
  }, [sharedCard]);

  const handleGenerateAiMessage = async () => {
    setIsGeneratingAi(true);
    soundService.playPop();
    try {
      const generated = await generatePostcardAiMessage({
        friendName: friend.name,
        occasion: aiOccasion,
        vibe: aiTone,
        customDetail: aiDetail || friend.challenge,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });

      if (generated) {
        setMessage(generated);
        const matchedOccasion = AI_OCCASIONS.find(o => o.id === aiOccasion);
        if (matchedOccasion) {
          const matchedTheme = CARD_THEMES.find(t => t.id === matchedOccasion.theme);
          if (matchedTheme) setTheme(matchedTheme);
          if (matchedOccasion.defaultBadge) setBadgeText(matchedOccasion.defaultBadge);
          setCardIcon(matchedOccasion.icon);
        }
        soundService.playSuccess();
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e) {
      console.error('Failed to generate AI card message:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const generateShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams({
      to: friend.name,
      from: signature,
      theme: theme.id,
      font: fontStyle.id,
      icon: cardIcon,
      badge: badgeText,
      msg: message,
    });
    return origin + pathname + '?' + params.toString() + '#postcard';
  };

  const handleCopyLink = () => {
    soundService.playPop();
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleNativeShare = async () => {
    soundService.playPop();
    const url = generateShareUrl();
    const title = 'Hype Card for ' + friend.name + '!';
    const text = '"' + message + '" - Sent with heart on HypePal AI';

    if (navigator?.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err.name !== 'AbortError') handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    soundService.playPop();
    const url = generateShareUrl();
    const text = '💌 A Personal Hype Card for ' + friend.name + '!\n\n"' + message + '"\n\n- From ' + signature + '\nView interactive card: ' + url;
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
  };

  const handleTwitterShare = () => {
    soundService.playPop();
    const url = generateShareUrl();
    const text = '💌 Just built a personalized Hype Card for my friend ' + friend.name + ' with #HypePalAI!\n\n"' + message + '"\n\n#BuildForAFriend #Hacktoberfest';
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
  };
  const handleCopyTextCard = () => {
    soundService.playPop();
    const formattedCard = [
      '┌────────────────────────────────────────────────────────┐',
      '│ ⚡ A PERSONAL HYPE CARD FOR ' + friend.name.toUpperCase().padEnd(26) + ' │',
      '│ [' + badgeText.toUpperCase() + ']   From: ' + signature.padEnd(25) + ' │',
      '├────────────────────────────────────────────────────────┤',
      '│ "' + message + '"',
      '│',
      '│ ' + cardIcon + ' Created with HypePal AI • Built for a Friend!       │',
      '│ View interactive card: ' + generateShareUrl(),
      '└────────────────────────────────────────────────────────┘',
    ].join('\n');

    navigator.clipboard.writeText(formattedCard);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleDownloadImage = () => {
    soundService.playPop();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    } else if (theme.id === 'sakura') {
      bgGrad.addColorStop(0, '#f472b6');
      bgGrad.addColorStop(0.5, '#fb7185');
      bgGrad.addColorStop(1, '#c026d3');
    } else if (theme.id === 'solar') {
      bgGrad.addColorStop(0, '#facc15');
      bgGrad.addColorStop(0.5, '#f59e0b');
      bgGrad.addColorStop(1, '#dc2626');
    } else if (theme.id === 'ice') {
      bgGrad.addColorStop(0, '#22d3ee');
      bgGrad.addColorStop(0.5, '#0284c7');
      bgGrad.addColorStop(1, '#1d4ed8');
    } else if (theme.id === 'obsidian') {
      bgGrad.addColorStop(0, '#334155');
      bgGrad.addColorStop(0.5, '#1e293b');
      bgGrad.addColorStop(1, '#090d16');
    } else {
      bgGrad.addColorStop(0, '#4f46e5');
      bgGrad.addColorStop(0.5, '#7e22ce');
      bgGrad.addColorStop(1, '#090d16');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
    ctx.beginPath();
    ctx.roundRect(40, 40, 1120, 550, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.fillText(cardIcon + ' ' + tagline.toUpperCase(), 80, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText('FOR: ' + friend.name.toUpperCase(), 80, 140);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(900, 78, 220, 46, 23);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText.toUpperCase(), 1010, 107);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(80, 175);
    ctx.lineTo(1120, 175);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.font = 'italic 90px Georgia, serif';
    ctx.fillText('"', 75, 270);

    ctx.fillStyle = '#f8fafc';
    if (fontStyle.id === 'mono') {
      ctx.font = '500 24px monospace';
      ctx.fillStyle = '#6ee7b7';
    } else if (fontStyle.id === 'serif') {
      ctx.font = 'italic 500 28px Georgia, serif';
    } else {
      ctx.font = 'italic 500 28px system-ui, -apple-system, sans-serif';
    }

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
    ctx.fillText('#BuildForAFriend   HypePal AI', 1120, 545);

    const link = document.createElement('a');
    link.download = 'hype-card-' + friend.name.toLowerCase().replace(/\s+/g, '-') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {isReceivedCard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between gap-4 animate-pulse-glow">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">{cardIcon}</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                You received an official Hype Card from {signature}!
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300">
                Badge: <strong className="text-amber-400">{badgeText}</strong> • Personalized for you on HypePal AI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReceivedCard(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 cursor-pointer shrink-0"
          >
            Create Reply Card ✍️
          </button>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-pink-950/20 to-slate-950/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-pink-400/10 border border-pink-400/20 text-pink-300 text-[11px] sm:text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
            <span>Personalized Direct Delivery</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
            Digital Hype Postcard Studio 💌✨
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Customize every visual detail—from AI prompts, tones, and preset developer contexts to color gradients, mascot badges, and typography. Send an unforgettable token of belief to {friend.name}.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left: Customizer Controls (6 of 12 columns) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-card space-y-5">
            
            {/* Primary Method Switcher: Handcrafted (No AI) vs AI Magic Composer */}
            <div className={"p-4 rounded-2xl border transition-all duration-500 ease-out flex flex-col sm:flex-row items-center justify-between gap-3.5 " + (
              !includeAi
                ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/25 border-amber-500/40 shadow-lg shadow-amber-950/20'
                : 'bg-gradient-to-r from-purple-950/40 via-slate-900 to-pink-950/25 border-purple-500/40 shadow-lg shadow-purple-950/20'
            )}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold text-white font-['Outfit']">Creation Method</span>
                  <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-all duration-300 " + (
                    includeAi 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  )}>
                    {includeAi ? <Sparkles className="w-3 h-3 text-amber-400" /> : <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />}
                    <span>{includeAi ? 'AI Magic Co-pilot' : '100% Human (No AI)'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 transition-colors duration-300">
                  {includeAi 
                    ? "Co-pilot an emotional cheer with open weights or Gemini for " + friend.name + "."
                    : "Write personal words directly from the heart to " + friend.name + " with zero AI generation."}
                </p>
              </div>

              {/* Liquid Sliding Toggle Switch */}
              <div className="relative p-1 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center w-full sm:w-auto shrink-0 overflow-hidden shadow-inner">
                {/* Smooth Animated Sliding Indicator */}
                <div 
                  className={"absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out pointer-events-none " + (
                    !includeAi 
                      ? 'left-1 w-[calc(50%-4px)] sm:w-[155px] bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-500/30' 
                      : 'left-[calc(50%+2px)] sm:left-[161px] w-[calc(50%-4px)] sm:w-[138px] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 shadow-md shadow-purple-600/30'
                  )}
                />

                <button
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setIncludeAi(false);
                    setCustomTab('text');
                  }}
                  className={"relative z-10 flex-1 sm:w-[155px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                    !includeAi ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>✍️ Write My Own</span>
                  <span className={"text-[9px] font-extrabold px-1.5 py-0.2 rounded transition-colors " + (
                    !includeAi ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  )}>No AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setIncludeAi(true);
                    setCustomTab('ai');
                  }}
                  className={"relative z-10 flex-1 sm:w-[138px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                    includeAi ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <Wand2 className={"w-3.5 h-3.5 transition-transform duration-300 " + (includeAi ? 'rotate-12 scale-110 text-amber-300' : 'text-slate-400')} />
                  <span>✨ AI Composer</span>
                </button>
              </div>
            </div>

            {/* Context-Aware Navigation Tabs with Smooth Indicator */}
            <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800/90 rounded-2xl gap-1 shadow-inner transition-all duration-300">
              {includeAi ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setCustomTab('ai');
                    }}
                    className={"flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                      customTab === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/25 scale-[1.01]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Prompts & Vibe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setCustomTab('style');
                    }}
                    className={"flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                      customTab === 'style'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/25 scale-[1.01]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Theme & Stamps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setCustomTab('text');
                    }}
                    className={"flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                      customTab === 'text'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.01]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Edit & Fine-Tune</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setCustomTab('text');
                    }}
                    className={"flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                      customTab === 'text'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/25 scale-[1.01]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>✍️ Handcrafted Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setCustomTab('style');
                    }}
                    className={"flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer " + (
                      customTab === 'style'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.01]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    )}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Theme & Stamps</span>
                  </button>
                </>
              )}
            </div>

            {/* TAB 1: AI MAGIC WRITER */}
            {customTab === 'ai' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-pink-950/20 border border-purple-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      AI Emotional Tailoring
                    </span>
                    <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      Open Weights & Gemini Ready
                    </span>
                  </div>

                  {/* 1. Occasions */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      1. Select Friend's Current Situation (8 Occasions)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AI_OCCASIONS.map((occ) => (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => {
                            soundService.playPop();
                            setAiOccasion(occ.id);
                          }}
                          className={'px-2.5 py-2 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all text-left cursor-pointer ' + (
                            aiOccasion === occ.id
                              ? 'bg-purple-500/25 border-purple-400/80 text-white shadow-sm'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          )}
                        >
                          <span className="text-sm shrink-0">{occ.icon}</span>
                          <span className="truncate">{occ.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Emotional Frequency / Tone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        2. Choose Emotional Tone (6 Expressive Tones)
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {AI_TONES.find(t => t.id === aiTone)?.tagline}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {AI_TONES.map((tone) => {
                        const isSelected = aiTone === tone.id;
                        return (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => {
                              soundService.playPop();
                              setAiTone(tone.id);
                            }}
                            className={'p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ' + (
                              isSelected
                                ? tone.border + ' ' + tone.activeBg + ' shadow-sm'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{tone.icon}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
                            </div>
                            <span className="text-[11px] font-bold truncate text-white">{tone.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Preset Context Message Chips */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>3. Quick Preset Developer Context (1-Click Fill)</span>
                      </label>
                      {aiDetail && (
                        <button
                          type="button"
                          onClick={() => setAiDetail('')}
                          className="text-[10px] text-slate-500 hover:text-slate-400 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      {PRESET_CONTEXT_CHIPS.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            soundService.playPop();
                            setAiDetail(chip.text);
                          }}
                          className={'px-2 py-1 rounded-lg border text-[10px] transition-all cursor-pointer text-left ' + (
                            aiDetail === chip.text
                              ? 'bg-amber-500/20 border-amber-400/70 text-amber-300 font-bold'
                              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                          )}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      placeholder={'Type or click a preset above (e.g. ' + (friend.challenge || 'Mock system design interview at 2pm') + ')'}
                      value={aiDetail}
                      onChange={(e) => setAiDetail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleGenerateAiMessage}
                    disabled={isGeneratingAi}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Composing Personalized AI Card...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate Custom Card for {friend.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VISUAL STYLE & BADGES */}
            {customTab === 'style' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Card Visual Theme (8 Curated Gradients)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CARD_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setTheme(t);
                        }}
                        className={'p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center gap-2 ' + (
                          theme.id === t.id
                            ? 'border-amber-400 bg-slate-800/90 text-white shadow-sm'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        )}
                      >
                        <span className={'w-3.5 h-3.5 rounded-full shrink-0 ' + t.dot} />
                        <span className="truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Mascot Icon
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {CARD_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setCardIcon(icon);
                        }}
                        className={'w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ' + (
                          cardIcon === icon
                            ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Official Stamp / Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs mb-2 focus:outline-none focus:border-amber-400"
                    placeholder="Custom stamp text..."
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BADGE_PRESETS.map((bp) => (
                      <button
                        key={bp}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setBadgeText(bp);
                        }}
                        className={'px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all cursor-pointer ' + (
                          badgeText === bp
                            ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                        )}
                      >
                        {bp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Header Tagline
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {HEADER_TAGLINES.map((tl) => (
                      <button
                        key={tl}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setTagline(tl);
                        }}
                        className={'px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all text-left cursor-pointer ' + (
                          tagline === tl
                            ? 'bg-slate-800 border-amber-400/60 text-slate-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                        )}
                      >
                        {tl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MESSAGE CONTENT & FONTS */}
            {customTab === 'text' && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Card Typography Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_STYLES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setFontStyle(f);
                        }}
                        className={'p-2.5 rounded-xl border text-xs transition-all cursor-pointer text-left ' + (
                          fontStyle.id === f.id
                            ? 'border-amber-400 bg-slate-800/90 text-white font-bold'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                        )}
                      >
                        <span>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Message Quote
                    </label>
                    <span className="text-[10px] text-slate-500">Live preview on right</span>
                  </div>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-pink-400 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Quick Presets:</span>
                  <div className="flex flex-col gap-2">
                    {PRESET_MESSAGES.map((msg, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          soundService.playPop();
                          setMessage(msg);
                        }}
                        className={'w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ' + (
                          message === msg
                            ? 'bg-pink-500/10 border-pink-500/40 text-pink-200 shadow-sm'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs shrink-0 select-none">
                            {i === 0 ? '🚀' : i === 1 ? '💖' : i === 2 ? '⚡' : '🐙'}
                          </span>
                          <span className="text-xs truncate block min-w-0 flex-1 leading-normal">
                            "{msg}"
                          </span>
                        </div>
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
              </div>
            )}

            {/* Sharing Action Tray */}
            <div className="space-y-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={handleNativeShare}
                className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Share Card with {friend.name}</span>
              </button>

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

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={'py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ' + (
                    copiedLink
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
                  )}
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

        {/* Right: Live Card Visualizer (6 of 12 columns, sticky ONLY on lg screens) */}
        <div className="lg:col-span-6 flex justify-center w-full lg:sticky lg:top-6 z-10">
          <div className={'w-full max-w-lg rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-br ' + theme.bg + ' shadow-2xl shadow-purple-950/50 relative overflow-hidden transition-all duration-300'}>
            <div className="rounded-[18px] sm:rounded-[22px] bg-slate-950/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-[340px] sm:min-h-[380px] space-y-6 relative">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl sm:text-3xl shrink-0 select-none animate-float">{cardIcon}</span>
                  <div className="min-w-0">
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">{tagline}</h3>
                    <p className="text-xs sm:text-sm font-extrabold text-white truncate">For: {friend.name}</p>
                  </div>
                </div>

                <div className={'px-2.5 py-1 rounded-full border ' + theme.border + ' bg-slate-900/80 text-[10px] font-black uppercase tracking-wider ' + theme.text + ' shrink-0 shadow-sm'}>
                  {badgeText}
                </div>
              </div>

              <div className="relative my-auto py-2">
                <span className="text-4xl sm:text-5xl font-serif text-slate-700/40 absolute -top-5 sm:-top-6 -left-2 sm:-left-3 select-none">"</span>
                <p className={'text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed z-10 relative ' + fontStyle.class}>
                  {message}
                </p>
                <span className="text-4xl sm:text-5xl font-serif text-slate-700/40 absolute -bottom-8 sm:-bottom-10 right-2 select-none">"</span>
              </div>

              <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Sent with heart from:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 truncate block">{signature}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-400">
                    {includeAi ? '✨ AI Assisted' : '✍️ Handcrafted'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono hidden sm:inline">
                    #BuildForAFriend
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
