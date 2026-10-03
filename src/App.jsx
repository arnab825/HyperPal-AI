import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HypeGenerator from './components/HypeGenerator';
import CognitiveReframer from './components/CognitiveReframer';
import VictoryVault from './components/VictoryVault';
import PepPostcard from './components/PepPostcard';
import FriendCustomizerModal from './components/FriendCustomizerModal';
import SettingsModal from './components/SettingsModal';
import { Heart, Sparkles, Code2 } from 'lucide-react';

const INITIAL_WINS = [
  {
    id: 'win-1',
    title: 'Crushed the Complex System Bug',
    content: 'Spent 8 hours stuck on a race condition. Took a walk, reset my mindset, and nailed the fix with a clean mutex lock.',
    category: 'coding',
    date: 'Oct 2, 2026',
  },
  {
    id: 'win-2',
    title: 'Completed Live Tech Screening',
    content: 'Felt intense pre-interview anxiety, used HypePal AI to reframe the panic, and had an engaging conversation with the engineering lead.',
    category: 'career',
    date: 'Sep 28, 2026',
  },
  {
    id: 'win-3',
    title: 'First Open Source PR Merged',
    content: 'Shipped a documentation fix and UI polish to an open source repo for Hacktoberfest.',
    category: 'coding',
    date: 'Sep 25, 2026',
  },
];

export default function App() {
  // Check if incoming URL has shared card query params
  const [sharedCard, setSharedCard] = useState(() => {
    try {
      const url = new URL(window.location.href);
      const to = url.searchParams.get('to');
      const msg = url.searchParams.get('msg');
      const from = url.searchParams.get('from');
      const theme = url.searchParams.get('theme');
      const icon = url.searchParams.get('icon');
      const badge = url.searchParams.get('badge');
      const font = url.searchParams.get('font');
      if (to || msg || from || url.hash === '#postcard') {
        return {
          to: to || '',
          from: from || '',
          msg: msg || '',
          theme: theme || 'cyber',
          icon: icon || '⚡',
          badge: badge || 'Official Hype',
          font: font || 'sans',
          isReceived: Boolean(to && msg),
        };
      }
    } catch (e) {
      console.error('Error reading shared card URL:', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('to') || url.searchParams.has('msg') || url.hash === '#postcard') {
        return 'postcard';
      }
    } catch {}
    return 'hype';
  });

  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Friend state with localStorage persistence
  const [friend, setFriend] = useState(() => {
    try {
      const saved = localStorage.getItem('hypepal_friend');
      return saved ? JSON.parse(saved) : {
        name: 'Alex',
        role: 'Frontend Dev & Close Friend',
        challenge: 'Overcoming imposter syndrome before the technical interview demo',
      };
    } catch {
      return { name: 'Alex', role: 'Friend', challenge: '' };
    }
  });

  // Victory Vault entries with localStorage persistence & id normalization
  const [wins, setWins] = useState(() => {
    try {
      const saved = localStorage.getItem('hypepal_wins');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((w, i) => ({
          ...w,
          id: w.id || win__,
          category: (w.category || 'coding').toLowerCase(),
        }));
      }
      return INITIAL_WINS;
    } catch {
      return INITIAL_WINS;
    }
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('hypepal_settings');
      return saved ? JSON.parse(saved) : { apiKey: '', apiEndpoint: '', soundEffects: true };
    } catch {
      return { apiKey: '', apiEndpoint: '', soundEffects: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('hypepal_friend', JSON.stringify(friend));
  }, [friend]);

  useEffect(() => {
    localStorage.setItem('hypepal_wins', JSON.stringify(wins));
  }, [wins]);

  useEffect(() => {
    localStorage.setItem('hypepal_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAddWin = (newWin) => {
    const winItem = {
      ...newWin,
      id: `win_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: (newWin.category || 'coding').toLowerCase(),
    };
    setWins([winItem, ...wins]);
  };

  const handleDeleteWin = (winToDelete) => {
    setWins(prevWins => prevWins.filter(w => {
      if (winToDelete?.id && w.id) return w.id !== winToDelete.id;
      return w.title !== winToDelete.title || w.date !== winToDelete.date;
    }));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Background ambient glowing orbs */}
      <div className="fixed top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-600/10 rounded-full blur-[100px] sm:blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-[100px] sm:blur-[128px] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        friend={friend}
        onOpenFriendModal={() => setIsFriendModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        vaultCount={wins.length}
      />

      {/* Main Content Area with mobile bottom padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-12 relative z-10">
        {activeTab === 'hype' && (
          <HypeGenerator
            friend={friend}
            onSaveToVault={handleAddWin}
            settings={settings}
          />
        )}

        {activeTab === 'reframe' && (
          <CognitiveReframer
            friend={friend}
            onSaveToVault={handleAddWin}
            settings={settings}
          />
        )}

        {activeTab === 'vault' && (
          <VictoryVault
            wins={wins}
            onAddWin={handleAddWin}
            onDeleteWin={handleDeleteWin}
            friend={friend}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'postcard' && (
          <PepPostcard
            friend={friend}
            sharedCard={sharedCard}
            onUpdateFriend={setFriend}
            settings={settings}
          />
        )}
      </main>

      {/* Global Modals */}
      <FriendCustomizerModal
        isOpen={isFriendModalOpen}
        onClose={() => setIsFriendModalOpen(false)}
        friend={friend}
        onUpdateFriend={setFriend}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Footer with mobile offset */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 relative z-10 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">⚡ HypePal AI</span>
            <span>—</span>
            <span>Dedicated with <Heart className="w-3.5 h-3.5 text-pink-400 inline fill-pink-400" /> to {friend.name}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-amber-400">
              Hacktoberfest Weekend Challenge 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}