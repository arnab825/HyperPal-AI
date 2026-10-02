import React from 'react';
import { Sparkles, Heart, Trophy, Brain, Send, Settings, UserCheck } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  friend, 
  onOpenFriendModal, 
  onOpenSettings,
  vaultCount = 0 
}) {
  const navItems = [
    { id: 'hype', label: 'Hype Engine', shortLabel: 'Hype', icon: Sparkles },
    { id: 'reframe', label: 'Reframe It', shortLabel: 'Reframe', icon: Brain },
    { id: 'vault', label: `Victory Vault (${vaultCount})`, shortLabel: `Vault (${vaultCount})`, icon: Trophy },
    { id: 'postcard', label: 'Cheer Card', shortLabel: 'Postcard', icon: Send },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 animate-pulse-glow">
              <span className="text-lg sm:text-xl font-black text-white">⚡</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-purple-300 bg-clip-text text-transparent font-['Outfit'] truncate">
                  HypePal AI
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                  Hacktoberfest '26
                </span>
              </div>
              <button
                onClick={onOpenFriendModal}
                className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-amber-400 transition-colors group cursor-pointer truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none"
              >
                <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400 fill-pink-400/50 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">For: <strong className="text-slate-200 underline decoration-dotted underline-offset-2">{friend.name}</strong></span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 bg-slate-800/80 px-1 rounded shrink-0">edit</span>
              </button>
            </div>
          </div>

          {/* Desktop Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenFriendModal}
              title="Customize Friend"
              className="flex md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onOpenSettings}
              title="Settings & API Key"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 transition-all cursor-pointer hover:rotate-45"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (App-Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-bold transition-all cursor-pointer min-w-[64px] ${
                isActive
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400 scale-110' : 'text-slate-400'}`} />
              <span className="truncate">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
