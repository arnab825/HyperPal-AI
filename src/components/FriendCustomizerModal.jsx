import React, { useState } from 'react';
import { X, Heart, Sparkles, UserCheck } from 'lucide-react';

export default function FriendCustomizerModal({ isOpen, onClose, friend, onUpdateFriend }) {
  const [name, setName] = useState(friend.name);
  const [role, setRole] = useState(friend.role || 'Fellow Developer & Friend');
  const [challenge, setChallenge] = useState(friend.challenge || 'Tackling complex code & overcoming imposter syndrome');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateFriend({
      name: name.trim(),
      role: role.trim(),
      challenge: challenge.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400/30" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">Who are you building for?</h3>
            <p className="text-xs text-slate-400">Personalize HypePal for your specific friend</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Friend's Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Maya, Jordan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Their Role / Relationship
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Junior Developer, Design Partner, Roommate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Their Current Biggest Challenge
            </label>
            <textarea
              rows={2}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g. Struggling with async state bugs & feeling stressed before sprint demo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Update Dedicated Friend</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
