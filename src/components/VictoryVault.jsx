import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Plus, Trash2, Award, Sparkles, Filter, Copy, Check, 
  Flame, Search, X, Volume2, VolumeX, Send, ArrowRight, ShieldCheck, Heart 
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { speechService } from '../services/speechService';

const RANK_TIERS = [
  { wins: 1, name: 'Spark Starter', badge: '🌱', desc: 'Took the first step to log a milestone' },
  { wins: 3, name: 'Rising Warrior', badge: '⚔️', desc: 'Overcoming doubts with repeated evidence' },
  { wins: 5, name: 'Unstoppable Titan', badge: '⚡', desc: 'Formidable track record of resilience' },
  { wins: 10, name: 'Mythic Architect', badge: '👑', desc: 'Mastery over imposter syndrome' },
];

export default function VictoryVault({ wins = [], onAddWin, onDeleteWin, friend, onNavigateTab }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('coding');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Modals for deep interactivity
  const [selectedWin, setSelectedWin] = useState(null);
  const [showRankModal, setShowRankModal] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [copiedWinId, setCopiedWinId] = useState(null);

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

  const handleCreateWin = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundService.playSuccess();
    onAddWin({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory.toLowerCase(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });

    setNewTitle('');
    setNewContent('');
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
    const markdown = `# 🏆 ${friend.name}'s Victory Vault & Brag Sheet\n\nGenerated with HypePal AI\n\n` +
      wins.map(w => `### ${w.title} (${w.date})\n*Category: ${w.category}*\n\n${w.content || 'Win recorded!'}\n`).join('\n---\n\n');

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
      const textToSpeak = `Victory milestone: ${win.title}. ${win.content || ''}`;
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
    const text = `🏆 ${win.title} (${win.date})\n${win.content || ''}`;
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

  const isFiltered = filterCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
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
              When imposter syndrome attacks, it gives us amnesia about our past accomplishments. This vault stores undeniable proof of {friend.name}'s capability, growth, and hard-earned wins. Click any card to relive the breakthrough.
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

      {/* Interactive Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Total Wins */}
        <button
          type="button"
          onClick={() => {
            soundService.playPop();
            setFilterCategory('all');
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } });
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-amber-400/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Total Wins</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{wins.length}</p>
          <span className="text-[10px] text-amber-400/80 group-hover:underline">Click to show all</span>
        </button>

        {/* Stat 2: Hype Streak */}
        <button
          type="button"
          onClick={() => {
            soundService.playFlame();
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.3 } });
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-orange-400/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Hype Streak</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-400">{Math.max(wins.length, 1)} Days</p>
          <span className="text-[10px] text-orange-400/80 group-hover:underline">Active Momentum 🔥</span>
        </button>

        {/* Stat 3: Rank Tier */}
        <button
          type="button"
          onClick={() => {
            soundService.playChime();
            setShowRankModal(true);
          }}
          className="p-4 rounded-2xl glass-card border border-slate-800 hover:border-purple-400/50 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Rank</span>
          </div>
          <p className="text-base sm:text-lg font-black text-purple-300 flex items-center gap-1.5 truncate">
            <span>{currentRank.badge}</span>
            <span>{currentRank.name}</span>
          </p>
          <span className="text-[10px] text-purple-400/80 group-hover:underline">Click to view roadmap</span>
        </button>

        {/* Stat 4: Mindset Armor */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-left">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mindset Armor</span>
          </div>
          <p className="text-base sm:text-lg font-black text-emerald-400">
            {wins.length >= 5 ? 'Diamond Tier 💎' : wins.length >= 3 ? 'Gold Tier 🥇' : 'Silver Tier 🥈'}
          </p>
          <span className="text-[10px] text-slate-500">Resilience Verified</span>
        </div>
      </div>

      {/* Add Win Form Collapsible */}
      {showAddForm && (
        <form onSubmit={handleCreateWin} className="p-5 sm:p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Record a New Victory for {friend.name}</span>
            </h3>
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
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Completed System Design Mock Screening"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Quick Details / Breakthrough
                </label>
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Navigated tough questions and kept composure"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Wins Grid with Deep Interactivity */}
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
                      title={`Filter by ${win.category}`}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer hover:scale-105 ${getCategoryBadgeStyle(win.category)}`}
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
                    {/* Speak Button */}
                    <button
                      type="button"
                      onClick={(e) => handleSpeakWin(e, win)}
                      title={isSpeaking ? 'Stop speaking' : 'Read victory aloud'}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopySingleWin(e, win)}
                      title="Copy win"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete Button */}
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
              No victories found {filterCategory !== 'all' ? `in ${categories.find(c => c.id === filterCategory)?.label}` : ''}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No wins matched "${searchQuery}". Try a different keyword.`
                : `Nothing logged in this category yet. Record a new milestone to build up ${friend.name}'s armor!`
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

      {/* MODAL 1: "Relive the Victory" Detailed Inspection Modal */}
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
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeStyle(selectedWin.category)}`}>
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

            {/* Modal Actions */}
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
                      onNavigateTab('postcard');
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

      {/* MODAL 2: Milestone Rank Progression Roadmap Modal */}
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
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">Resilience Rank Roadmap</h3>
              </div>
              <button
                onClick={() => setShowRankModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {RANK_TIERS.map((tier) => {
                const isCurrent = currentRank.name === tier.name;
                const isUnlocked = wins.length >= tier.wins;
                return (
                  <div
                    key={tier.name}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-400/60 shadow-md'
                        : isUnlocked
                        ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                        : 'bg-slate-900/30 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tier.badge}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-purple-300' : isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                            {tier.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200">
                              Current
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

            <p className="text-xs text-center text-slate-400">
              {friend.name} has recorded <strong className="text-amber-400">{wins.length}</strong> undeniable victories!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
