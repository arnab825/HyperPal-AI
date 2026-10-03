import React from 'react';
import { X, Heart, Sparkles, CheckCircle2, Quote, ArrowRight, Trophy, Brain, Flame, Send } from 'lucide-react';
import { soundService } from '../services/soundService';

export default function FriendStoryModal({ isOpen, onClose, friend, onNavigateTab }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Heart className="w-5 h-5 fill-pink-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  The Story of {friend.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold">
                  Weekend Challenge
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Theme: Build for a Friend • Conquering Tech Interview Imposter Syndrome
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* The Real Dilemma */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>The Human Behind the Screen</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Software engineering has an unspoken epidemic: <strong>silent, suffocating imposter syndrome</strong>. My friend <strong>{friend.name}</strong> is one of the most tenacious aspiring developers I know, having spent the past six months coding late into the night preparing for technical interviews.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Yet despite demonstrable talent, {friend.name} was constantly gripped by catastrophic self-talk before every mock interview: <em>"I am going to freeze on system design and look like an absolute fraud."</em>
            </p>
          </div>

          {/* Quote Block */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900/60 border border-purple-500/20 relative italic text-xs sm:text-sm text-purple-200">
            <Quote className="w-6 h-6 text-purple-400/30 absolute top-2 right-2" />
            <p className="relative z-10 leading-relaxed">
              "{friend.name} did not need another checklist app bombarding them with red overdue alerts. They needed an emotionally intelligent safety net that could break down irrational cognitive distortions, physically prove their past capability, and hype them up with authentic empathy."
            </p>
          </div>

          {/* How HypePal Solved It */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              The 4 Pillars Built Specifically for {friend.name}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>1. Hype Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  4 tailored voices (Hype Beast, Bestie, Zen, Mentor) with Web Speech API audio for high-energy pre-interview momentum.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <Brain className="w-3.5 h-3.5" />
                  <span>2. CBT Distortion Buster</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Dissects spiraling panic into identifiable cognitive traps (Catastrophizing, Imposter Trap) with 2-minute dopamine actions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>3. Victory Vault Brag Sheet</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  An undeniable evidence locker of past solved bugs and conquered milestones that directly contradicts amnesia from panic.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                  <Send className="w-3.5 h-3.5" />
                  <span>4. Digital Hype Postcards</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Interactive cards sent over WhatsApp, Slack, or web link to remind {friend.name} that their team always has their back.
                </p>
              </div>
            </div>
          </div>

          {/* The Hand-Off Feedback */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>What {friend.name} Said When Testing the App:</span>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Seeing my chaotic thoughts broken down into actual identifiable cognitive distortions gave me an immediate sense of clarity. Instead of feeling like a failure, I realized I was just trapped in 'Mind Reading'. The Victory Vault is already pinned to my browser bookmarks."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Hacktoberfest Weekend Challenge: Build for a Friend
          </span>
          <button
            onClick={() => {
              soundService.playPop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}