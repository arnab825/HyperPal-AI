import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Plus, Trash2, Award, Sparkles, Filter, Copy, Check, Flame, Search, X, ArrowRight } from 'lucide-react';

export default function VictoryVault({ wins = [], onAddWin, onDeleteWin, friend }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('coding');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'All Wins', emoji: '🏆', color: 'text-amber-400', activeStyle: 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 border-amber-400' },
    { id: 'coding', label: 'Code & Tech', emoji: '💻', color: 'text-cyan-400', activeStyle: 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 border-cyan-400' },
    { id: 'career', label: 'Career', emoji: '💼', color: 'text-indigo-400', activeStyle: 'bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 border-indigo-400' },
    { id: 'wellness', label: 'Wellness', emoji: '🌸', color: 'text-pink-400', activeStyle: 'bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/25 border-pink-400' },
    { id: 'life', label: 'Life', emoji: '🌟', color: 'text-emerald-400', activeStyle: 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 border-emerald-400' },
  ];

  // Calculate live counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: wins.length, coding: 0, career: 0, wellness: 0, life: 0 };
    wins.forEach((w) => {
      const cat = (w.category || '').toLowerCase();
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });
    return counts;
  }, [wins]);

  // Filtered and searched wins
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
    const markdown = `# 🏆 ${friend.name}'s Victory Vault & Brag Sheet\n\nGenerated with HypePal AI\n\n` +
      wins.map(w => `### ${w.title} (${w.date})\n*Category: ${w.category}*\n\n${w.content || 'Win recorded!'}\n`).join('\n---\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-slate-800/80 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Against Imposter Syndrome</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
              {friend.name}'s Victory Vault 🏆
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When imposter syndrome attacks, it gives us amnesia about our past accomplishments. This vault stores undeniable proof of {friend.name}'s capability, growth, and hard-earned wins.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (filterCategory !== 'all') setNewCategory(filterCategory);
              }}
              className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Log a Win</span>
            </button>
            {wins.length > 0 && (
              <button
                onClick={handleExportBragSheet}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
                title="Copy all wins formatted as Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Brag Sheet!' : 'Export'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Badges / Milestones Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Wins</span>
            <p className="text-lg font-black text-white">{wins.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Hype Streak</span>
            <p className="text-lg font-black text-white">{Math.max(wins.length, 1)} Days</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Rank</span>
            <p className="text-xs font-bold text-purple-300">
              {wins.length >= 5 ? 'Unstoppable Titan' : wins.length >= 2 ? 'Rising Warrior' : 'Spark Starter'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mindset Level</span>
            <p className="text-xs font-bold text-emerald-300">Diamond Tier</p>
          </div>
        </div>
      </div>

      {/* Add Win Form Modal/Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateWin} className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Record a New Victory for {friend.name}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">What did {friend.name} conquer?</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Fixed that stubborn race condition, or walked 3 miles to de-stress"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="coding">💻 Code & Tech</option>
                <option value="career">💼 Career</option>
                <option value="wellness">🌸 Wellness</option>
                <option value="life">🌟 Life</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 mb-1 block">Extra context or why it was hard (optional)</label>
            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g. Felt like giving up yesterday, but stuck with it and solved it this morning."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Save Win
            </button>
          </div>
        </form>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Chips with Live Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Filter:</span>
            </span>

            {categories.map((c) => {
              const count = categoryCounts[c.id] || 0;
              const isSelected = filterCategory === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? c.activeStyle
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-slate-950/20 text-current'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wins by keyword..."
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-500"
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

        {/* Filter status banner */}
        {isFiltered && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Showing <strong className="text-amber-400">{filteredWins.length}</strong> of {wins.length} wins
              {filterCategory !== 'all' && (
                <span> in <span className="text-slate-200 font-semibold">{categories.find(c => c.id === filterCategory)?.label}</span></span>
              )}
              {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
            </span>

            <button
              onClick={() => {
                setFilterCategory('all');
                setSearchQuery('');
              }}
              className="text-amber-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Wins Grid */}
      {filteredWins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWins.map((win) => (
            <div
              key={win.id || win.title}
              className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-3 relative"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setFilterCategory(win.category?.toLowerCase() || 'coding')}
                    title={`Click to filter by ${win.category}`}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer hover:scale-105 ${getCategoryBadgeStyle(win.category)}`}
                  >
                    {win.category}
                  </button>
                  <span className="text-[11px] text-slate-500">{win.date}</span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {win.title}
                </h4>

                {win.content && (
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {win.content}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end">
                <button
                  onClick={() => onDeleteWin(win)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove from vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
                ? `No wins matched "${searchQuery}". Try a different keyword or reset your search.`
                : `Nothing logged in this category yet. Record a new milestone to build up ${friend.name}'s armor!`
              }
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => {
                setFilterCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Show All Wins
            </button>
            <button
              onClick={() => {
                setShowAddForm(true);
                if (filterCategory !== 'all') setNewCategory(filterCategory);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log a Win Here</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
