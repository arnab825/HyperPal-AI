import React, { useState, useMemo } from 'react';
import { X, Sparkles, Sliders, Shield, Check, Info, ExternalLink, CheckCircle2, Zap, Cpu, Edit3 } from 'lucide-react';
import { resolveCredentials, GROQ_MODELS, GEMINI_MODELS } from '../services/aiService';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
  const creds = resolveCredentials(settings.apiKey, settings.apiEndpoint, settings.model, settings.provider);

  const [provider, setProvider] = useState(settings.provider || creds.provider || 'gemini');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || creds.activeModel || 'gemini-3.8-flash');
  const [isCustomModelInput, setIsCustomModelInput] = useState(false);
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects !== false);
  const [saved, setSaved] = useState(false);

  // Dynamic Gemini models list with .env model included
  const geminiList = useMemo(() => {
    const envModel = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash').trim();
    const existing = GEMINI_MODELS.find(m => m.id === envModel);
    if (!existing) {
      return [{ id: envModel, name: `${envModel} (From .env)`, tag: 'Active' }, ...GEMINI_MODELS];
    }
    return GEMINI_MODELS.map(m => m.id === envModel ? { ...m, tag: 'Active Default' } : m);
  }, []);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setIsCustomModelInput(false);
    if (newProvider === 'groq') {
      const defaultGroq = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
      setModel(defaultGroq);
    } else if (newProvider === 'gemini') {
      const defaultGemini = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash';
      setModel(defaultGemini);
    } else if (newProvider === 'ollama') {
      setModel('llama3.2');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      provider,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl glass-panel border border-slate-700/80 p-5 sm:p-7 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 text-white shrink-0 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-['Outfit']">AI Provider & Model Settings</h3>
            <p className="text-xs text-slate-400">Gemini (Free Default) or Open-Source via Groq / Local</p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs gap-2">
          <span className="text-slate-400 shrink-0">Active Status:</span>
          {creds.isBrowserOverride ? (
            <span className="flex items-center gap-1.5 text-blue-400 font-bold truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Browser Custom Key ({model})</span>
            </span>
          ) : creds.hasEnvGemini ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold truncate">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Default Free Gemini ({model})</span>
            </span>
          ) : (
            <span className="text-amber-400 font-medium">Built-in Offline Engine</span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Gemini Button */}
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  provider === 'gemini'
                    ? 'bg-blue-500/15 border-blue-400 text-blue-300 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Google Gemini</span>
                <span className="text-[9px] font-normal text-emerald-400">Free / Default</span>
              </button>

              {/* Groq Button */}
              <button
                type="button"
                onClick={() => handleProviderChange('groq')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  provider === 'groq'
                    ? 'bg-orange-500/15 border-orange-400 text-orange-300 shadow-md shadow-orange-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Groq (Open AI)</span>
                <span className="text-[9px] font-normal text-orange-300">Llama & Mixtral</span>
              </button>

              {/* Ollama Button */}
              <button
                type="button"
                onClick={() => handleProviderChange('ollama')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  provider === 'ollama'
                    ? 'bg-purple-500/15 border-purple-400 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Local Ollama</span>
                <span className="text-[9px] font-normal text-purple-300">100% Offline</span>
              </button>
            </div>
          </div>

          {/* Model Selector based on Provider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {provider === 'groq' ? 'Groq Open Model' : provider === 'gemini' ? 'Gemini Model' : 'Local Model'}
              </label>

              <button
                type="button"
                onClick={() => setIsCustomModelInput(!isCustomModelInput)}
                className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isCustomModelInput ? 'Select from list' : 'Type custom model ID'}</span>
              </button>
            </div>

            {isCustomModelInput ? (
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. gemini-3.8-flash, llama-3.3-70b-versatile"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400 font-mono"
              />
            ) : provider === 'groq' ? (
              <select
                value={model || 'llama-3.3-70b-versatile'}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-orange-400"
              >
                {GROQ_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} [{m.tag}]
                  </option>
                ))}
              </select>
            ) : provider === 'gemini' ? (
              <select
                value={model || geminiList[0]?.id || 'gemini-3.8-flash'}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400"
              >
                {geminiList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} [{m.tag}]
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={model || 'llama3.2'}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. llama3.2, mistral, gemma2"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            )}
          </div>

          {/* API Key Input */}
          {provider !== 'ollama' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {provider === 'groq' ? 'Groq API Key' : 'Gemini API Key'}
                </label>
                <a
                  href={provider === 'groq' ? 'https://console.groq.com/keys' : 'https://aistudio.google.com/app/apikey'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-300 hover:underline flex items-center gap-0.5"
                >
                  <span>Get free {provider === 'groq' ? 'Groq' : 'Gemini'} key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'gemini' && creds.hasEnvGemini
                    ? 'Using host free key (Paste here to override)'
                    : provider === 'groq'
                    ? 'gsk_...'
                    : 'AIzaSy... or sk-...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-400 font-mono"
              />
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400 shrink-0" /> Kept in your local browser only.
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
          )}

          {/* Confetti checkbox */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-slate-300">Celebration Confetti</span>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400 bg-slate-900 border-slate-700 cursor-pointer"
            />
          </div>

          {/* Action buttons */}
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
