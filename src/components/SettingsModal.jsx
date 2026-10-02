import React, { useState } from 'react';
import { X, Sparkles, Sliders, Shield, Check, Info, ExternalLink } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || '');
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects !== false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateSettings({
      apiKey: apiKey.trim(),
      apiEndpoint: apiEndpoint.trim(),
      soundEffects,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 border border-blue-400/30 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">Google Gemini & AI Settings</h3>
            <p className="text-xs text-slate-400">Powered by the latest <strong>Gemini 2.5 Flash</strong></p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5 text-xs text-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Google Gemini API
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-300 hover:underline flex items-center gap-0.5"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-blue-200/80 leading-relaxed">
              Paste your Gemini API key below or save it in your <code>.env</code> file as <code>VITE_GEMINI_API_KEY</code>.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1 flex items-center gap-1.5">
              <span>Gemini API Key (or OpenAI / Groq)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... or sk-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Stored locally in your browser storage only.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-slate-300">Celebration Confetti</span>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 bg-slate-900 border-slate-700"
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              <span>{saved ? 'Saved!' : 'Save Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
