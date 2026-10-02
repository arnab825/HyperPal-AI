import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Plus, Trash2, Award, Sparkles, Filter, Copy, Check, Flame } from 'lucide-react';

export default function VictoryVault({ wins, onAddWin, onDeleteWin, friend }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('coding');
  const [filterCategory, setFilterCategory] = useState('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'All Wins' },
    { id: 'coding', label: '💻 Code & Tech' },
    { id: 'career', label: '💼 Career' },
    { id: 'wellness', label: '🌸 Wellness' },
    { id: 'life', label: '🌟 Life' },
  ];

  const handleCreateWin = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddWin({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
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

  const filteredWins = filterCategory === 'all'
    ? wins
    : wins.filter(w => w.category === filterCategory);

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
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
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
                placeholder="e.g. Finally fixed that multi-threading crash, or got out of bed & went to gym"
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

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === c.id
                ? 'bg-slate-200 text-slate-950 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Wins Grid */}
      {filteredWins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWins.map((win, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                    {win.category}
                  </span>
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
                  onClick={() => onDeleteWin(idx)}
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
        <div className="text-center py-12 px-4 rounded-3xl glass-card border-dashed border-slate-800 space-y-3">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No victories logged in this category yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Log a Win" or save a pep-talk to build up {friend.name}'s personal fortress of achievements!
          </p>
        </div>
      )}
    </div>
  );
}
