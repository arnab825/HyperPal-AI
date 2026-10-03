import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Heart, Trophy, Brain, Send, Settings, 
  UserCheck, ChevronDown, Edit3, Volume2, VolumeX, 
  ShieldCheck, Flame, Award, User, RefreshCw, X 
} from 'lucide-react';
import { soundService } from '../services/soundService';

const SAMPLE_FRIENDS = [
  {
    name: 'Alex',
    nickname: 'Future Tech Lead',
    avatar: '👩‍💻',
    role: 'Frontend Dev & Close Friend',
    motivationStyle: 'hype',
    challenge: 'Overcoming imposter syndrome before the technical interview demo',
    tags: ['React', 'System Design', 'Junior Dev'],
  },
  {
    name: 'Maya',
    nickname: 'Algorithm Queen',
    avatar: '🚀',
    role: 'Backend Dev & Study Buddy',
    motivationStyle: 'mentor',
    challenge: 'Feeling overwhelmed by graph & dynamic programming problems',
    tags: ['Python', 'Algorithms', 'Backend'],
  },
  {
    name: 'Jordan',
    nickname: 'Open Source Rebel',
    avatar: '🦁',
    role: 'Full-Stack Contributor',
    motivationStyle: 'bestie',
    challenge: 'Nervous about public PR feedback and contributing to open source',
    tags: ['TypeScript', 'Full-Stack', 'Open Source'],
  },
];

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  friend, 
  onOpenFriendModal, 
  onOpenSettings,
  vaultCount = 0,
  streakCount,
  settings,
  onUpdateSettings,
  onUpdateFriend,
  onOpenOpenAiExplainer,
  onOpenStoryModal
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const navItems = [
    { id: 'hype', label: 'Hype Engine', shortLabel: 'Hype', icon: Sparkles },
    { id: 'reframe', label: 'Reframe It', shortLabel: 'Reframe', icon: Brain },
    { id: 'vault', label: `Victory Vault (${vaultCount})`, shortLabel: `Vault (${vaultCount})`, icon: Trophy },
    { id: 'postcard', label: 'Cheer Card', shortLabel: 'Postcard', icon: Send },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleToggleSound = () => {
    soundService.playPop();
    if (onUpdateSettings) {
      const nextSound = settings?.soundEffects === false ? true : false;
      soundService.setEnabled(nextSound);
      onUpdateSettings({ ...settings, soundEffects: nextSound });
    }
  };

  const handleSwitchFriend = (f) => {
    soundService.playSuccess();
    if (onUpdateFriend) {
      onUpdateFriend(f);
    }
    setIsProfileOpen(false);
  };

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
                <button
                  type="button"
                  onClick={() => {
                    soundService.playPop();
                    if (onOpenOpenAiExplainer) onOpenOpenAiExplainer();
                  }}
                  className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer group/open"
                  title="Why Open-Source AI Matters • Hacktoberfest Weekend Challenge"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Open-Source AI Core</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden xs:block">
                Dedicated Cheerleader for <strong className="text-slate-200">{friend.name}</strong>
              </p>
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
                  onClick={() => {
                    soundService.playPop();
                    setActiveTab(item.id);
                  }}
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

          {/* Right: Modern Profile Avatar Pill with Embedded Settings Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Profile Avatar Pill / Dropdown Trigger */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  soundService.playPop();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border transition-all cursor-pointer group select-none ${
                  isProfileOpen
                    ? 'bg-slate-800 border-amber-400/60 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Avatar with Status indicator */}
                <div className="relative">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-sm sm:text-base shadow-sm shrink-0">
                    {friend.avatar || '👩‍💻'}
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                </div>

                {/* Friend Name & Nickname */}
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {friend.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                    {friend.nickname || 'View Profile'}
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180 text-amber-400' : ''
                }`} />
              </button>

              {/* MODERN PROFILE DROPDOWN MENU (Just like GitHub / Linear / Notion) */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-88 rounded-3xl bg-[#090e17] border border-slate-700/90 ring-1 ring-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-4 sm:p-5 space-y-4 animate-fadeIn z-50 backdrop-blur-2xl">
                  
                  {/* Profile Header */}
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-800/80">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0 select-none animate-float">
                      {friend.avatar || '👩‍💻'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-extrabold text-white truncate">
                          {friend.name}
                        </h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          Active Friend
                        </span>
                      </div>
                      <p className="text-xs text-amber-300/90 font-medium truncate">
                        {friend.nickname || 'Dedicated Buddy'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {friend.role || 'Partner in Code'}
                      </p>
                    </div>
                  </div>

                  {/* Current Challenge Quote */}
                  {friend.challenge && (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-300 italic flex items-start">
                      <span className="text-slate-500 font-serif text-sm mr-1 shrink-0 select-none">“</span>
                      <span className="flex-1">{friend.challenge}</span>
                      <span className="text-slate-500 font-serif text-sm ml-1 shrink-0 select-none">”</span>
                    </div>
                  )}

                  {/* Mini Stats Row */}
                  <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Wins</span>
                      <span className="text-sm font-extrabold text-white">{vaultCount}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Streak</span>
                      <span className="text-sm font-extrabold text-orange-400">{(streakCount !== undefined ? streakCount : Math.max(vaultCount, 1))}d 🔥</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Armor</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {vaultCount >= 5 ? 'Diamond' : vaultCount >= 3 ? 'Gold' : 'Silver'}
                      </span>
                    </div>
                  </div>

                  {/* Action Menu Items */}
                  <div className="space-y-1 pt-1">
                    {/* Why Open-Source AI Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        if (onOpenOpenAiExplainer) onOpenOpenAiExplainer();
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-all cursor-pointer group/openai"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover/openai:scale-110 transition-transform" />
                        <span>Why Open-Source AI?</span>
                      </span>
                      <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        Offline & Private
                      </span>
                    </button>

                    {/* Story of Friend Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        if (onOpenStoryModal) onOpenStoryModal();
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-all cursor-pointer group/story"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20 group-hover/story:scale-110 transition-transform" />
                        <span>Story: Why We Built for {friend.name}</span>
                      </span>
                      <span className="text-[10px] text-pink-300 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded">
                        story
                      </span>
                    </button>
                    {/* Settings & AI Configuration Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-all cursor-pointer group/set"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-amber-400 group-hover/set:rotate-45 transition-transform" />
                        <span>AI Model & API Settings</span>
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="truncate max-w-[85px] capitalize">{settings?.provider || 'Gemini'}</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        onOpenFriendModal();
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Edit Friend Profile & Challenges</span>
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        setActiveTab('vault');
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span>View Victory Vault ({vaultCount})</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundService.playPop();
                        setIsProfileOpen(false);
                        setActiveTab('postcard');
                      }}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 text-pink-400" />
                        <span>Send Digital Hype Card 💌</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleSound}
                      className="w-full p-2.5 rounded-xl text-left text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {settings?.soundEffects === false ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
                        <span>Audio Sound Effects</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        settings?.soundEffects === false ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {settings?.soundEffects === false ? 'OFF' : 'ON'}
                      </span>
                    </button>
                  </div>

                  {/* Switch Friend Quick Bar */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Quick Switch Profile
                    </span>
                    <div className="flex items-center gap-1.5">
                      {SAMPLE_FRIENDS.map((sf) => (
                        <button
                          key={sf.name}
                          type="button"
                          onClick={() => handleSwitchFriend(sf)}
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            friend.name === sf.name
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>{sf.avatar}</span>
                          <span className="truncate">{sf.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundService.playPop();
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
