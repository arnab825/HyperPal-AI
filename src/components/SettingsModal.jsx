import React, { useState } from 'react';
import { X, Sparkles, Sliders, Shield, Check, Info, ExternalLink, CheckCircle2 } from 'lucide-react';
import { resolveCredentials } from '../services/aiService';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || '');
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects !== false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const creds = resolveCredentials(settings.apiKey, settings.apiEndpoint, settings.model);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      apiKey: apiKey.trim(),
      model: model.trim(),
      soundEffects,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  const handleClearCustomKey = () => {
    setApiKey('');
    onUpdateSettings({
      ...settings,
      apiKey: '',
    });
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
            <p className="text-xs text-slate-400">Configured with <strong>{creds.geminiModel}</strong></p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Current AI Engine:</span>
          {creds.isBrowserOverride ? (
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Browser Custom Key (Active)</span>
            </span>
          ) : creds.hasEnvGemini ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Default .env Key (Active)</span>
            </span>
          ) : (
            <span className="text-amber-400 font-medium">Built-in Offline Engine</span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Custom API Key (Optional)</span>
              </label>
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
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={creds.hasEnvGemini ? "Using .env key (Paste here to override)" : "AIzaSy... or sk-..."}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400 font-mono"
            />
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Stored locally in this browser only.
              </span>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearCustomKey}
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Model Name
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={`Default: ${creds.geminiModel}`}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Supports: <code>gemini-3.6-flash</code>, <code>gemini-2.5-flash</code>, <code>gemini-1.5-flash</code>
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
              <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
