import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, Heart, Sparkles, UserCheck, Tag, Zap, Shield, 
  Smile, Plus, Check 
} from 'lucide-react';
import { soundService } from '../services/soundService';

const AVATAR_OPTIONS = ['👩‍💻', '👨‍💻', '🚀', '⚡', '💖', '🦊', '🦁', '☕', '🎧', '🌟'];

const PRESET_TAGS = [
  'React', 'TypeScript', 'Frontend', 'Backend', 
  'System Design', 'Algorithms', 'Junior Dev', 'Career Switcher', 'Open Source'
];

const PRESET_CHALLENGES = [
  'Overcoming imposter syndrome before the technical interview demo',
  'Stuck in a stubborn async debugging hole for hours',
  'Bouncing back after a tough interview rejection',
  'Feeling overwhelmed and burnt out by the upcoming sprint',
  'Hesitant to contribute to their first major open-source repository'
];

const MOTIVATION_STYLES = [
  { id: 'hype', label: 'High-Octane Hype', icon: '⚡', desc: 'Explosive energy & confidence' },
  { id: 'bestie', label: 'Warm Empathy', icon: '💖', desc: 'Validating unconditional love' },
  { id: 'mentor', label: 'Tactical Strategy', icon: '🎯', desc: 'Facts, agency & logic' },
  { id: 'zen', label: 'Stoic Zen', icon: '🌊', desc: 'Deep breaths & clarity' },
];

export default function FriendCustomizerModal({ isOpen, onClose, friend, onUpdateFriend }) {
  const [name, setName] = useState(friend.name || 'Alex');
  const [nickname, setNickname] = useState(friend.nickname || 'Future Tech Lead');
  const [avatar, setAvatar] = useState(friend.avatar || '👩‍💻');
  const [role, setRole] = useState(friend.role || 'Frontend Dev & Close Friend');
  const [motivationStyle, setMotivationStyle] = useState(friend.motivationStyle || 'hype');
  const [challenge, setChallenge] = useState(friend.challenge || PRESET_CHALLENGES[0]);
  const [selectedTags, setSelectedTags] = useState(friend.tags || ['React', 'System Design', 'Junior Dev']);
  const [newTagInput, setNewTagInput] = useState('');

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    soundService.playPop();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!selectedTags.includes(tag)) {
      soundService.playPop();
      setSelectedTags([...selectedTags, tag]);
    }
    setNewTagInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundService.playSuccess();
    onUpdateFriend({
      ...friend,
      name: name.trim(),
      nickname: nickname.trim(),
      avatar,
      role: role.trim(),
      motivationStyle,
      challenge: challenge.trim(),
      tags: selectedTags,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 p-5 sm:p-7 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400/40" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit']">Friend Profile Studio 💖</h3>
            <p className="text-xs text-slate-400">Deeply tailor HypePal's AI, tone, and advice for your friend</p>
          </div>
        </div>

        {/* Live Profile Card Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-purple-500/30 flex items-start gap-3.5 shadow-inner">
          <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0 select-none animate-float">
            {avatar}
          </span>
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-white truncate flex items-center gap-1.5">
                <span>{name || 'Friend'}</span>
                {nickname && <span className="text-xs text-amber-400 font-semibold">({nickname})</span>}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                {MOTIVATION_STYLES.find(s => s.id === motivationStyle)?.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">{role}</p>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {selectedTags.slice(0, 5).map(tag => (
                  <span key={tag} className="text-[9px] px-2 py-0.2 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    #{tag}
                  </span>
                ))}
                {selectedTags.length > 5 && (
                  <span className="text-[9px] text-slate-500">+{selectedTags.length - 5} more</span>
                )}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              1. Choose {name}'s Avatar / Mascot
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setAvatar(em);
                  }}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-all cursor-pointer ${
                    avatar === em
                      ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Friend's Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Nickname / Shout-out Tag
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Future Tech Lead"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Role & Relationship
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Junior Frontend Dev & Tenacious Problem Solver"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Preferred Motivation Love Language */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              Preferred Encouragement Vibe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOTIVATION_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setMotivationStyle(style.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    motivationStyle === style.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                    <span>{style.icon}</span>
                    <span className={motivationStyle === style.id ? 'text-amber-300' : 'text-slate-300'}>{style.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack / Domain Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Focus Areas / Tech Stack Tags
              </label>
              <span className="text-[10px] text-slate-400">Personalizes AI answers</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomTag(e);
                }}
                placeholder="Add custom tag (e.g. Next.js, Docker)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Current Challenge with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Their Current Biggest Challenge
              </label>
              <span className="text-[10px] text-slate-500">Pick a preset or edit below</span>
            </div>

            <div className="flex flex-col gap-1 mb-2">
              {PRESET_CHALLENGES.map((pc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    setChallenge(pc);
                  }}
                  className={`text-left text-[11px] p-2 rounded-xl border transition-all truncate cursor-pointer ${
                    challenge === pc
                      ? 'bg-purple-500/10 border-purple-400 text-purple-200 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  "{pc}"
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g. Overcoming imposter syndrome before the technical interview demo"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:scale-[1.01] active:scale-[0.99] text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Save & Personalize App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
