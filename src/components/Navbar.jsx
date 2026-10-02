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
    { id: 'hype', label: 'Hype Engine', icon: Sparkles },
    { id: 'reframe', label: 'Reframe It', icon: Brain },
    { id: 'vault', label: `Victory Vault (${vaultCount})`, icon: Trophy },
    { id: 'postcard', label: 'Cheer Card', icon: Send },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse-glow">
            <span className="text-xl font-black text-white">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-purple-300 bg-clip-text text-transparent font-['Outfit']">
                HypePal AI
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Hacktoberfest '26
              </span>
            </div>
            <button
              onClick={onOpenFriendModal}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors group cursor-pointer"
            >
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400/50 group-hover:scale-110 transition-transform" />
              <span>Dedicated to: <strong className="text-slate-200 underline decoration-dotted underline-offset-2">{friend.name}</strong></span>
              <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 rounded">change</span>
            </button>
          </div>
        </div>

        {/* Center Navigation Tabs */}
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
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFriendModal}
            title="Customize Friend"
            className="flex md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings & API Key"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 transition-all cursor-pointer hover:rotate-45"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 border-t border-slate-800/60 bg-slate-950/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-all ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.id === 'vault' ? 'Vault' : item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
