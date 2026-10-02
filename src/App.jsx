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
    title: 'Crushed the Complex System Bug',
    content: 'Spent 8 hours stuck on a race condition. Took a walk, reset my mindset, and nailed the fix with a clean mutex lock.',
    category: 'coding',
    date: 'Oct 2, 2026',
  },
  {
    title: 'Completed Live Tech Screening',
    content: 'Felt intense pre-interview anxiety, used HypePal AI to reframe the panic, and had an engaging conversation with the engineering lead.',
    category: 'career',
    date: 'Sep 28, 2026',
  },
  {
    title: 'First Open Source PR Merged',
    content: 'Shipped a documentation fix and UI polish to an open source repo for Hacktoberfest.',
    category: 'coding',
    date: 'Sep 25, 2026',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('hype');
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

  // Victory Vault entries with localStorage persistence
  const [wins, setWins] = useState(() => {
    try {
      const saved = localStorage.getItem('hypepal_wins');
      return saved ? JSON.parse(saved) : INITIAL_WINS;
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
    setWins([newWin, ...wins]);
  };

  const handleDeleteWin = (index) => {
    setWins(wins.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-amber-400 selection:text-slate-950">
      {/* Background ambient glowing orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        friend={friend}
        onOpenFriendModal={() => setIsFriendModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        vaultCount={wins.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
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
          />
        )}

        {activeTab === 'postcard' && (
          <PepPostcard
            friend={friend}
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

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/70 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
