import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Plus, Trash2, Award, Sparkles, Filter, Copy, Check, 
  Flame, Search, X, Volume2, VolumeX, Send, ArrowRight, ShieldCheck, Heart,
  Calendar, Zap, TrendingUp, CheckCircle2, Shield, Info, Wand2, Loader2
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';
import { polishVictoryMilestone } from '../services/aiService';

const RANK_TIERS = [
  { wins: 1, name: 'Spark Starter', badge: '🌱', desc: 'Took the first brave step to log proof of capability' },
  { wins: 3, name: 'Rising Warrior', badge: '⚔️', desc: 'Overcoming self-doubt with persistent evidence' },
  { wins: 5, name: 'Unstoppable Titan', badge: '⚡', desc: 'Formidable track record of technical resilience' },
  { wins: 10, name: 'Mythic Architect', badge: '👑', desc: 'Total mastery and immunity over imposter syndrome' },
];

export function parseDateToMidnight(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function calculateStreakStats(wins = []) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayMidnight = todayMidnight - ONE_DAY_MS;

  const uniqueTimestamps = Array.from(new Set(
    wins
      .map(w => parseDateToMidnight(w.date || w.createdAt))
      .filter(Boolean)
  )).sort((a, b) => a - b);

  if (uniqueTimestamps.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      isStreakActive: false,
      isTodayLogged: false,
      isYesterdayLogged: false,
      uniqueDaysList: [],
      recentWeekMatrix: [],
      consistencyRate: 0,
    };
  }

  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < uniqueTimestamps.length; i++) {
    const diff = Math.round((uniqueTimestamps[i] - uniqueTimestamps[i - 1]) / ONE_DAY_MS);
    if (diff === 1) {
      tempStreak += 1;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else if (diff > 1) {
      tempStreak = 1;
    }
  }

  const isTodayLogged = uniqueTimestamps.includes(todayMidnight);
  const isYesterdayLogged = uniqueTimestamps.includes(yesterdayMidnight);

  let currentStreak = 0;
  if (isTodayLogged || isYesterdayLogged) {
    const anchor = isTodayLogged ? todayMidnight : yesterdayMidnight;
    currentStreak = 1;
    let expected = anchor - ONE_DAY_MS;
    for (let i = uniqueTimestamps.length - 1; i >= 0; i--) {
      const t = uniqueTimestamps[i];
      if (t === anchor) continue;
      if (t === expected) {
        currentStreak += 1;
        expected -= ONE_DAY_MS;
      } else if (t < expected) {
        break;
      }
    }
  }

  const recentWeekMatrix = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(todayMidnight - offset * ONE_DAY_MS);
    const dayMidnight = d.getTime();
    const hasWin = uniqueTimestamps.includes(dayMidnight);
    recentWeekMatrix.push({
      dayName: dayNames[d.getDay()],
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hasWin,
      isToday: offset === 0,
    });
  }

  const fourteenDaysAgo = todayMidnight - 13 * ONE_DAY_MS;
  const activeLast14 = uniqueTimestamps.filter(t => t >= fourteenDaysAgo).length;
  const consistencyRate = Math.min(100, Math.round((activeLast14 / 14) * 100));

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays: uniqueTimestamps.length,
    isStreakActive: currentStreak > 0,
    isTodayLogged,
    isYesterdayLogged,
    uniqueDaysList: uniqueTimestamps.map(t => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
    recentWeekMatrix,
    consistencyRate,
  };
}

export default function VictoryVault({ 
  wins = [], 
  onAddWin, 
  onDeleteWin, 
  friend, 
  onNavigateTab, 
  settings = {},
  onPrefillCard 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('coding');
  const [alsoSendPostcard, setAlsoSendPostcard] = useState(false);
  const [isPolishingAi, setIsPolishingAi] = useState(false);

  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Modals for deep interactivity
  const [selectedWin, setSelectedWin] = useState(null);
  const [showTotalWinsModal, setShowTotalWinsModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [showArmorModal, setShowArmorModal] = useState(false);

  const [speakingId, setSpeakingId] = useState(null);
  const [copiedWinId, setCopiedWinId] = useState(null);

  const streakStats = useMemo(() => calculateStreakStats(wins), [wins]);

  const categories = [
    { id: 'all', label: 'All Wins', emoji: '🏆', color: 'text-amber-400', activeStyle: 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 border-amber-400' },
    { id: 'coding', label: 'Code & Tech', emoji: '💻', color: 'text-cyan-400', activeStyle: 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 border-cyan-400' },
    { id: 'career', label: 'Career', emoji: '💼', color: 'text-indigo-400', activeStyle: 'bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 border-indigo-400' },
    { id: 'wellness', label: 'Wellness', emoji: '🌸', color: 'text-pink-400', activeStyle: 'bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/25 border-pink-400' },
    { id: 'life', label: 'Life', emoji: '🌟', color: 'text-emerald-400', activeStyle: 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 border-emerald-400' },
  ];

  const categoryCounts = useMemo(() => {
    const counts = { all: wins.length, coding: 0, career: 0, wellness: 0, life: 0 };
    wins.forEach((w) => {
      const cat = (w.category || '').toLowerCase();
      if (counts[cat] !== undefined) counts[cat] += 1;
    });
    return counts;
  }, [wins]);

  const currentRank = useMemo(() => {
    const count = wins.length;
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
      if (count >= RANK_TIERS[i].wins) return RANK_TIERS[i];
    }
    return RANK_TIERS[0];
  }, [wins.length]);

  const nextRank = useMemo(() => {
    return RANK_TIERS.find(t => t.wins > wins.length) || null;
  }, [wins.length]);

  const rankProgress = useMemo(() => {
    if (!nextRank) return 100;
    const prevWins = currentRank.wins;
    const needed = nextRank.wins - prevWins;
    const progress = wins.length - prevWins;
    return Math.min(100, Math.max(10, Math.round((progress / needed) * 100)));
  }, [wins.length, currentRank, nextRank]);

  const armorTier = useMemo(() => {
    if (wins.length >= 5) return { name: 'Diamond Tier 💎', rating: '98%', status: 'Impenetrable Imposter Defense' };
    if (wins.length >= 3) return { name: 'Gold Tier 🥇', rating: '85%', status: 'Robust Neurological Shield' };
    if (wins.length >= 1) return { name: 'Silver Tier 🥈', rating: '65%', status: 'Evidence Armor Forming' };
    return { name: 'Bronze Tier 🥉', rating: '30%', status: 'Awaiting Initial Evidence' };
  }, [wins.length]);

  const filteredWins = useMemo(() => {
    return wins.filter((win) => {
      const matchesCategory =
        filterCategory === 'all' ||
        (win.category || '').toLowerCase() === filterCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        win.title.toLowerCase().includes(query) ||
        (win.content && win.content.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [wins, filterCategory, searchQuery]);

  const handlePolishWithAi = async () => {
    setIsPolishingAi(true);
    soundService.playPop();

    // If user hasn't entered a title yet, choose a high-impact default title for the category
    const defaultTitles = {
      coding: 'Completed System Design Mock Screening',
      career: 'Passed Multi-Round Technical Interview',
      wellness: 'Protected Focus & Reset Mental Clarity',
      life: 'Overcame Imposter Syndrome & Shipped Today',
    };

    const activeTitle = newTitle.trim() || defaultTitles[newCategory] || 'Crushed Major Milestone';
    const activeDetails = newContent.trim();

    try {
      const polished = await polishVictoryMilestone({
        title: activeTitle,
        details: activeDetails,
        category: newCategory,
        friendName: friend.name,
        apiKey: settings?.apiKey,
        apiEndpoint: settings?.apiEndpoint,
        model: settings?.model,
        provider: settings?.provider,
      });

      if (!newTitle.trim()) {
        setNewTitle(activeTitle);
      }
      if (polished) {
        setNewContent(polished);
      } else {
        const fallbacks = {
          coding: 'Navigated tough architectural trade-offs, diagnosed the bottleneck, and shipped a clean mutex lock.',
          career: 'Articulated engineering trade-offs under evaluation, demonstrating clear senior competence and composure.',
          wellness: 'Recognized cognitive fatigue, took a deliberate recharge walk, and returned with restored stamina.',
          life: 'Refused to let inner doubts freeze progress, translating determination into hard evidence of growth.',
        };
        setNewContent(fallbacks[newCategory] || 'Demonstrated undeniable proof of capability and growth.');
      }
      soundService.playSuccess();
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error polishing win with AI:', err);
      if (!newTitle.trim()) setNewTitle(activeTitle);
      setNewContent(
        activeDetails ||
        (newCategory === 'coding'
          ? 'Navigated tough architectural trade-offs, diagnosed the bottleneck, and shipped a clean mutex lock.'
          : 'Articulated engineering trade-offs under evaluation, demonstrating clear senior competence and composure.')
      );
    } finally {
      setIsPolishingAi(false);
    }
  };

  const handleCreateWin = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundService.playSuccess();
    const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const winItem = {
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory.toLowerCase(),
      date: createdDate,
    };

    onAddWin(winItem);

    if (alsoSendPostcard && onPrefillCard) {
      onPrefillCard({
        to: friend.name,
        from: 'Your Biggest Fan',
        msg: "Huge congratulations on your breakthrough: \"" + newTitle.trim() + "\"! " + (newContent ? newContent.trim() : 'Undeniable proof that you belong in the arena.'),
        theme: newCategory === 'coding' ? 'cyber' : newCategory === 'career' ? 'solar' : 'sunset',
        icon: '🏆',
        badge: 'Victory Verified',
        isReceived: false,
      });
    }

    setNewTitle('');
    setNewContent('');
    setAlsoSendPostcard(false);
    setShowAddForm(false);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981'],
    });
  };

  const handleExportBragSheet = () => {
    soundService.playSuccess();
    const markdown = "# 🏆 " + friend.name + "'s Victory Vault & Brag Sheet\n\nGenerated with HypePal AI • Mathematical Evidence Against Imposter Syndrome\n\n" +
      "**Total Verified Breakthroughs:** " + wins.length + "\n" +
      "**Current Momentum Streak:** " + streakStats.currentStreak + " Days (Longest: " + streakStats.longestStreak + " Days)\n" +
      "**Mindset Armor Tier:** " + armorTier.name + "\n\n---\n\n" +
      wins.map(w => "### " + w.title + " (" + w.date + ")\n*Category: " + w.category + "*\n\n" + (w.content || 'Victory recorded in vault.') + "\n").join('\n---\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakWin = (e, win) => {
    e.stopPropagation();
    if (speakingId === win.id) {
      speechService.stop();
      setSpeakingId(null);
    } else {
      soundService.playPop();
      setSpeakingId(win.id);
      const textToSpeak = "Victory milestone: " + win.title + ". " + (win.content || '');
      speechService.speak(textToSpeak, {
        persona: 'mentor',
        onStart: () => setSpeakingId(win.id),
        onEnd: () => setSpeakingId(null),
        onError: () => setSpeakingId(null),
      });
    }
  };

  const handleCopySingleWin = (e, win) => {
    e.stopPropagation();
    soundService.playPop();
    const text = "🏆 " + win.title + " (" + win.date + ")\n" + (win.content || '');
    navigator.clipboard.writeText(text);
    setCopiedWinId(win.id);
    setTimeout(() => setCopiedWinId(null), 2000);
  };

  const getCategoryBadgeStyle = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'coding':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'career':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'wellness':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
      case 'life':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] sm:text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Against Imposter Syndrome</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              {friend.name}'s Victory Vault 🏆
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              When imposter syndrome attacks, it gives us amnesia about our past accomplishments. This vault stores undeniable proof of {friend.name}'s capability, growth, and hard-earned wins. Click any card below to inspect the mathematical breakdown.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                soundService.playPop();
                setShowAddForm(!showAddForm);
                if (filterCategory !== 'all') setNewCategory(filterCategory);
              }}
              className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Log a Win</span>
            </button>
            {wins.length > 0 && (
              <button
                onClick={handleExportBragSheet}
                className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                title="Copy all wins formatted as Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Export'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ALL 4 STAT CARDS FULLY CLICKABLE WITH DEEP MATHEMATICAL TRANSPARENCY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Total Wins */}
        <button
          type="button"
          onClick={() => {
            soundService.playPop();
            setShowTotalWinsModal(true);
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } });
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900/90 transition-all text-left group cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Total Wins</span>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono">View ↗</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{wins.length}</p>
          <span className="text-[10px] text-amber-400/80 group-hover:underline">Click for category analytics</span>
        </button>

        {/* Stat 2: Hype Streak (Mathematical Calendar Calculation) */}
        <button
          type="button"
          onClick={() => {
            soundService.playFlame();
            setShowStreakModal(true);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-orange-400/60 hover:bg-slate-900/90 transition-all text-left group cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Hype Streak</span>
            </div>
            <span className="text-[10px] text-orange-400/80 font-mono">Math ↗</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-400">
            {streakStats.currentStreak > 0 ? streakStats.currentStreak : streakStats.longestStreak} { (streakStats.currentStreak > 0 ? streakStats.currentStreak : streakStats.longestStreak) === 1 ? 'Day' : 'Days' }
          </p>
          <span className="text-[10px] text-orange-400/80 group-hover:underline">
            {streakStats.isStreakActive ? 'Active Momentum 🔥' : streakStats.longestStreak > 0 ? 'Best Streak (Log today to reignite)' : 'Start your streak today'}
          </span>
        </button>

        {/* Stat 3: Rank Tier */}
        <button
          type="button"
          onClick={() => {
            soundService.playChime();
            setShowRankModal(true);
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-purple-400/60 hover:bg-slate-900/90 transition-all text-left group cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Rank</span>
            </div>
            <span className="text-[10px] text-purple-400/80 font-mono">Roadmap ↗</span>
          </div>
          <p className="text-base sm:text-lg font-black text-purple-300 flex items-center gap-1.5 truncate">
            <span>{currentRank.badge}</span>
            <span>{currentRank.name}</span>
          </p>
          <span className="text-[10px] text-purple-400/80 group-hover:underline">Click to view roadmap</span>
        </button>

        {/* Stat 4: Mindset Armor (Clickable Modal) */}
        <button
          type="button"
          onClick={() => {
            soundService.playSuccess();
            setShowArmorModal(true);
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } });
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-emerald-400/60 hover:bg-slate-900/90 transition-all text-left group cursor-pointer hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Mindset Armor</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">Shield ↗</span>
          </div>
          <p className="text-base sm:text-lg font-black text-emerald-400 truncate">
            {armorTier.name}
          </p>
          <span className="text-[10px] text-emerald-400/80 group-hover:underline">
            {armorTier.rating} Imposter Defense • Details
          </span>
        </button>
      </div>

      {/* Add Win Form Collapsible with Optional AI Polish & Send Card to Friend */}
      {showAddForm && (
        <form onSubmit={handleCreateWin} className="p-5 sm:p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-white">Record a New Victory for {friend.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Completed System Design Mock Screening"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-1.5 pt-1.5 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-slate-500 text-[10px] shrink-0 font-medium">💡 Quick ideas:</span>
                {[
                  { t: 'Completed System Design Mock Screening', c: 'coding', d: 'Navigated tough architectural questions and kept composure under pressure.' },
                  { t: 'Solved Stubborn Race Condition Bug', c: 'coding', d: 'Persisted through 6 hours of debugging, isolated the race condition, and shipped a mutex lock.' },
                  { t: 'Passed Live Technical Phone Screen', c: 'career', d: 'Communicated clearly with engineering manager and solved live coding challenge.' },
                  { t: 'Protected Rest & Reset Mental Focus', c: 'wellness', d: 'Took a deliberate recharge break instead of burning out, returning with 2x clarity.' },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      soundService.playPop();
                      setNewTitle(preset.t);
                      setNewCategory(preset.c);
                      setNewContent(preset.d);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 text-[10px] whitespace-nowrap cursor-pointer transition-all"
                  >
                    {preset.t.split(' ').slice(0, 3).join(' ')}...
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="coding">💻 Code & Tech</option>
                  <option value="career">💼 Career & Interviews</option>
                  <option value="wellness">🌸 Wellness & Balance</option>
                  <option value="life">🌟 Life & Resilience</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Quick Details / Breakthrough
                  </label>
                  <button
                    type="button"
                    onClick={handlePolishWithAi}
                    disabled={isPolishingAi}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    title="Generate or polish victory breakthrough with AI"
                  >
                    {isPolishingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{newTitle.trim() ? '✨ Polish with AI' : '✨ Auto-Fill with AI'}</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Navigated tough questions and kept composure"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* User choice: Send to Friend as Cheer Card */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={alsoSendPostcard}
                  onChange={(e) => setAlsoSendPostcard(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                />
                <span>💌 Also send this victory as a Cheer Card to <strong>{friend.name}</strong></span>
              </label>
              <span className="text-[10px] text-slate-500">
                {alsoSendPostcard ? 'Will prefill card in Postcard studio' : 'Vault-only entry'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save into Vault</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl glass-card">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((c) => {
            const isActive = filterCategory === c.id;
            const count = categoryCounts[c.id] || 0;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundService.playPop();
                  setFilterCategory(c.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? c.activeStyle
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search victories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Wins Grid */}
      {filteredWins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWins.map((win) => {
            const isSpeaking = speakingId === win.id;
            const isCopied = copiedWinId === win.id;

            return (
              <div
                key={win.id || win.title}
                onClick={() => {
                  soundService.playChime();
                  setSelectedWin(win);
                }}
                className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group space-y-3 relative cursor-pointer hover:-translate-y-1 hover:shadow-xl shadow-slate-950/40"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.playPop();
                        setFilterCategory(win.category?.toLowerCase() || 'coding');
                      }}
                      title={"Filter by " + win.category}
                      className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer hover:scale-105 " + getCategoryBadgeStyle(win.category)}
                    >
                      {win.category}
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">{win.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {win.title}
                  </h4>

                  {win.content && (
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed line-clamp-4">
                      {win.content}
                    </p>
                  )}
                </div>

                {/* Card Quick Actions */}
                <div className="pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] text-amber-400/80 group-hover:underline flex items-center gap-1 font-medium">
                    <span>Click to inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleSpeakWin(e, win)}
                      title={isSpeaking ? 'Stop speaking' : 'Read victory aloud'}
                      className={"p-1.5 rounded-lg transition-colors cursor-pointer " + (
                        isSpeaking
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      )}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleCopySingleWin(e, win)}
                      title="Copy win"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.playPop();
                        onDeleteWin(win);
                      }}
                      title="Remove from vault"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl glass-card border-dashed border-slate-800 space-y-4 animate-fadeIn">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-200">
              No victories found {filterCategory !== 'all' ? ("in " + (categories.find(c => c.id === filterCategory)?.label || '')) : ''}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? ("No wins matched \"" + searchQuery + "\". Try a different keyword.")
                : ("Nothing logged in this category yet. Record a new milestone to build up " + friend.name + "'s armor!")
              }
            </p>
          </div>
          <button
            onClick={() => {
              setFilterCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Show All Wins
          </button>
        </div>
      )}

      {/* MODAL 1: TOTAL WINS & CATEGORY ANALYTICS MODAL */}
      {showTotalWinsModal && (
        <div 
          onClick={() => setShowTotalWinsModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl glass-panel border border-amber-500/30 p-5 sm:p-7 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Victory Vault Analytics
                </h3>
              </div>
              <button
                onClick={() => setShowTotalWinsModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-300 font-medium">Total Evidence Entries</p>
                <p className="text-3xl font-black text-white">{wins.length} Breakthroughs</p>
              </div>
              <span className="text-3xl">🏆</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Breakdown by Domain
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: 'Code & Tech', count: categoryCounts.coding, color: 'bg-cyan-500', text: 'text-cyan-400', id: 'coding', icon: '💻' },
                  { label: 'Career & Interviews', count: categoryCounts.career, color: 'bg-indigo-500', text: 'text-indigo-400', id: 'career', icon: '💼' },
                  { label: 'Wellness & Stamina', count: categoryCounts.wellness, color: 'bg-pink-500', text: 'text-pink-400', id: 'wellness', icon: '🌸' },
                  { label: 'Life & Resilience', count: categoryCounts.life, color: 'bg-emerald-500', text: 'text-emerald-400', id: 'life', icon: '🌟' },
                ].map((item) => {
                  const percent = wins.length > 0 ? Math.round((item.count / wins.length) * 100) : 0;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setFilterCategory(item.id);
                        setShowTotalWinsModal(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>{item.icon}</span>
                          <span className="group-hover:text-amber-300 transition-colors">{item.label}</span>
                        </span>
                        <span className="font-mono text-slate-400">
                          <strong className={item.text}>{item.count}</strong> ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={"h-full " + item.color + " rounded-full transition-all duration-500"}
                          style={{ width: percent + "%" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFilterCategory('all');
                  setShowTotalWinsModal(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                View All in Vault
              </button>
              <button
                type="button"
                onClick={handleExportBragSheet}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Brag Sheet Copied!' : 'Export Brag Sheet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MATHEMATICAL STREAK & MOMENTUM ENGINE MODAL */}
      {showStreakModal && (
        <div 
          onClick={() => setShowStreakModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl glass-panel border border-orange-500/30 p-5 sm:p-7 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Momentum & Streak Mathematics
                </h3>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Current Streak</span>
                <p className="text-3xl font-black text-white mt-1">
                  {streakStats.currentStreak} {streakStats.currentStreak === 1 ? 'Day' : 'Days'}
                </p>
                <span className="text-[10px] text-orange-300">
                  {streakStats.isStreakActive ? '🔥 Active consecutive streak' : '⚪ Grace period or paused'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">All-Time Longest</span>
                <p className="text-3xl font-black text-white mt-1">
                  {streakStats.longestStreak} {streakStats.longestStreak === 1 ? 'Day' : 'Days'}
                </p>
                <span className="text-[10px] text-amber-300">⚡ Peak resilience record</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider">Last 7 Calendar Days</span>
                <span className="text-slate-400 font-mono text-[11px]">{streakStats.consistencyRate}% active (14-day)</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                {streakStats.recentWeekMatrix.map((item, idx) => (
                  <div 
                    key={idx}
                    className={"flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all " + (
                      item.hasWin
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-md shadow-orange-500/20'
                        : item.isToday
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    )}
                  >
                    <span className="text-[10px] font-mono">{item.dayName}</span>
                    <span className="text-lg my-0.5">{item.hasWin ? '🔥' : '⚪'}</span>
                    <span className="text-[9px] font-mono text-slate-400">{item.dateLabel.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <Info className="w-3.5 h-3.5 text-orange-400" />
                <span>Deterministic Calculation Logic:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                • Standardized: Dates mapped to midnight timestamps <span className="text-amber-400 font-bold">Δt = 86,400,000 ms (24h)</span>.<br />
                • Continuity: Consecutive days increment streak; non-consecutive days preserve all-time best.<br />
                • Zero random generators. Every single day displayed is tied to actual recorded vault entries.
              </p>
            </div>

            {streakStats.uniqueDaysList.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recorded Milestone Dates ({streakStats.totalActiveDays} total active days):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {streakStats.uniqueDaysList.slice(-8).reverse().map((d, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                      ✓ {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowStreakModal(false)}
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Close Streak Matrix
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: RANK ROADMAP & PROGRESSION MODAL */}
      {showRankModal && (
        <div 
          onClick={() => setShowRankModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl glass-panel border border-purple-500/30 p-5 sm:p-7 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Resilience Rank Roadmap
                </h3>
              </div>
              <button
                onClick={() => setShowRankModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Current Status</span>
                  <h4 className="text-xl font-black text-white flex items-center gap-1.5">
                    <span>{currentRank.badge}</span>
                    <span>{currentRank.name}</span>
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-purple-500/30 text-purple-200">
                  {wins.length} Wins
                </span>
              </div>

              {nextRank && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-purple-200">
                    <span>Progress to {nextRank.name}</span>
                    <span className="font-mono">{wins.length} / {nextRank.wins} ({nextRank.wins - wins.length} left)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: rankProgress + "%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {RANK_TIERS.map((tier) => {
                const isCurrent = currentRank.name === tier.name;
                const isUnlocked = wins.length >= tier.wins;
                return (
                  <div
                    key={tier.name}
                    className={"p-3.5 rounded-2xl border transition-all flex items-center justify-between " + (
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-400/60 shadow-md'
                        : isUnlocked
                        ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                        : 'bg-slate-900/30 border-slate-900 text-slate-600'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.badge}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={"text-xs sm:text-sm font-bold " + (isCurrent ? 'text-purple-300' : isUnlocked ? 'text-white' : 'text-slate-500')}>
                            {tier.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200">
                              Active Tier
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{tier.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                      {tier.wins} {tier.wins === 1 ? 'win' : 'wins'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowRankModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Continue Conquering
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: MINDSET ARMOR & RESILIENCE MODAL */}
      {showArmorModal && (
        <div 
          onClick={() => setShowArmorModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl glass-panel border border-emerald-500/30 p-5 sm:p-7 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Mindset Armor & Imposter Defense
                </h3>
              </div>
              <button
                onClick={() => setShowArmorModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Current Armor Tier</span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">{armorTier.name}</p>
                <p className="text-xs text-emerald-300 font-medium">{armorTier.status}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{armorTier.rating}</span>
                <span className="block text-[10px] text-slate-400">Defense Index</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Psychological Anchors
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Hard Evidence Bias Defense</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Imposter syndrome thrives on subjective feelings of fraudulence. Having {wins.length} concrete logged artifacts gives the prefrontal cortex objective data to refute negative cognitive distortions.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Panic-Proof Recall Memory</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Under acute stress (interviews, outages), human working memory drops by 40%. The Victory Vault functions as externalized long-term memory proof that you have solved hard problems before.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <span className="text-lg">💎</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Agency & Resilience Armor</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Each logged victory rewires neural pathways through positive reinforcement, elevating self-efficacy and confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowArmorModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Armor Verified
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: "RELIVE THE VICTORY" DETAILED INSPECTION MODAL */}
      {selectedWin && (
        <div 
          onClick={() => setSelectedWin(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl glass-panel border border-amber-500/30 p-5 sm:p-7 space-y-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={"text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border " + getCategoryBadgeStyle(selectedWin.category)}>
                  {selectedWin.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">{selectedWin.date}</span>
              </div>
              <button
                onClick={() => setSelectedWin(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  🏆
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {selectedWin.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">Recorded for {friend.name}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 max-h-[300px] overflow-y-auto space-y-2">
                <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedWin.content || 'Victory recorded in vault.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={(e) => handleSpeakWin(e, selectedWin)}
                className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {speakingId === selectedWin.id ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                <span>{speakingId === selectedWin.id ? 'Stop Audio' : 'Listen with Voice'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopySingleWin(e, selectedWin)}
                  className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedWinId === selectedWin.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWinId === selectedWin.id ? 'Copied!' : 'Copy'}</span>
                </button>

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWin(null);
                      if (onPrefillCard) {
                        onPrefillCard({
                          to: friend.name,
                          from: 'Your Biggest Fan',
                          msg: "Celebrating your milestone: \"" + selectedWin.title + "\"! " + (selectedWin.content || 'Proof of your unstoppable momentum.'),
                          theme: selectedWin.category === 'coding' ? 'cyber' : selectedWin.category === 'career' ? 'solar' : 'sunset',
                          icon: '⚡',
                          badge: 'Victory Verified',
                          isReceived: false,
                        });
                      } else {
                        onNavigateTab('postcard');
                      }
                    }}
                    className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Postcard</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
