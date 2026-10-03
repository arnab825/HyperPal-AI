# 🛠️ HypePal AI — Technical Requirements Document (TRD)

**Project Name:** HypePal AI  
**System Type:** Offline-First Client-Side Single Page Application (SPA)  
**Core Framework:** React 19.2 + Vite 8  
**Styling Engine:** Tailwind CSS v4 (`@tailwindcss/vite`)  
**Deployment Target:** GitHub Pages via GitHub Actions CI/CD  

---

## 1. System Architecture & Tech Stack

```
├── UI / Presentation Layer: React 19.2 + Lucide React + Canvas Confetti
├── Styling & Tokens: Tailwind CSS v4 + Vanilla CSS Variables (Glassmorphism)
├── Audio Subsystem: HTML5 Web Speech Synthesis API + Web Audio API Synthesizer
├── State Management: React Hooks (useState, useMemo, useEffect) + LocalStorage Sync
├── AI Orchestration Layer: Multi-Provider Gateway (Ollama, Groq, Gemini, Edge)
└── DOM Elevation Layer: React createPortal for Modal Isolation
```

---

## 2. Data Schemas & State Management

All state is preserved client-side in the browser's `localStorage` under unique keys to ensure cross-session persistence with zero telemetry.

### 2.1 Victory Vault Win Schema (`hypepal_wins`)
```typescript
interface VictoryWin {
  id: string;              // Unique identifier (e.g., 'win-1727982000000')
  title: string;           // Brief milestone description (max 100 chars)
  content?: string;        // Detailed brag-sheet explanation
  category: 'coding' | 'career' | 'wellness' | 'life';
  date: string;            // Standardized date string (e.g., 'Oct 3, 2026')
  createdAt?: number;      // Unix timestamp in milliseconds
}
```

### 2.2 Friend Profile Schema (`hypepal_friend`)
```typescript
interface FriendProfile {
  name: string;            // Primary friend name (default: 'Alex')
  nickname?: string;       // Casual greeting moniker
  avatar: string;          // Emoji avatar character (e.g., '👩‍💻', '⚡')
  role: string;            // Current professional focus
  motivationStyle: 'hype' | 'empathy' | 'zen' | 'mentor';
  challenge: string;       // Current acute struggle quote
  tags: string[];          // Associated domain tags (e.g., ['#React', '#SystemDesign'])
}
```

### 2.3 AI Provider Settings Schema (`hypepal_settings`)
```typescript
interface AISettings {
  provider: 'gemini' | 'groq' | 'ollama' | 'offline';
  apiKey?: string;         // Ephemeral browser override key
  apiEndpoint?: string;    // Custom endpoint (default: http://localhost:11434 for Ollama)
  model?: string;          // Selected LLM model identifier
  soundEffects: boolean;   // Audio haptic feedback toggle (default: true)
}
```

---

## 3. Multi-Engine AI API Contracts

### 3.1 Local Ollama Protocol
- **Endpoint:** `POST http://localhost:11434/api/generate`
- **Payload:**
  ```json
  {
    "model": "llama3.2",
    "prompt": "<SYSTEM_PROMPT>\n\n<USER_THOUGHT>",
    "stream": false
  }
  ```
- **Error Handling:** If network request fails with `ECONNREFUSED`, automatically falls back to procedural edge engine with zero UI disruption.

### 3.2 Groq Open-Weights Protocol
- **Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`
- **Headers:** `Authorization: Bearer <API_KEY>`, `Content-Type: application/json`
- **Supported Models:** `llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`, `qwen-2.5-32b`
- **Response Handling:** Strict JSON schema extraction with regex bracket matching.

### 3.3 Google Gemini Protocol
- **Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}`
- **Supported Models:** `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`

---

## 4. Deterministic Algorithms & Mathematical Formulas

### 4.1 Calendar-Day Midnight Normalization
To prevent time-of-day bias where consecutive entries logged at 11:00 PM and 1:00 AM falsely register as 2 separate days or break streaks:
```javascript
export function parseDateToMidnight(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
```

### 4.2 Consecutive Streak Differencing Formula
$$\Delta t_i = \frac{\text{Midnight}_i - \text{Midnight}_{i-1}}{86{,}400{,}000\text{ ms}}$$
- If $\Delta t_i == 1$: $\text{Streak}_{\text{current}} = \text{Streak}_{\text{current}} + 1$
- If $\Delta t_i > 1$: $\text{Streak}_{\text{current}} = 1$; $\text{Streak}_{\text{longest}} = \max(\text{Streak}_{\text{longest}}, \text{Streak}_{\text{current}})$

### 4.3 Mindset Armor Index Formula
$$\text{Defense Index} = \begin{cases} 
98\%, & \text{Wins} \ge 5 \text{ (Diamond Tier)} \\
85\%, & \text{Wins} \ge 3 \text{ (Gold Tier)} \\
65\%, & \text{Wins} \ge 1 \text{ (Silver Tier)} \\
30\%, & \text{Wins} == 0 \text{ (Bronze Tier)}
\end{cases}$$

---

## 5. UI Architecture: Stacking Context & Scrollbar Management

### 5.1 React Portal Elevation
All modal components (`TotalWinsModal`, `StreakModal`, `RankModal`, `ArmorModal`, `LogWinModal`, `InspectWinModal`) are elevated to `document.body` via `createPortal`:
```javascript
createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden">
    <div className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-[#0a0f1d] border border-amber-500/40 shadow-2xl relative overflow-hidden">
      {/* Fixed Header */}
      {/* Scrollable Body: overscroll-contain */}
      {/* Fixed Footer */}
    </div>
  </div>,
  document.body
);
```

### 5.2 Background Scroll Locking Hook
```javascript
useEffect(() => {
  if (isAnyModalOpen) {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }
}, [isAnyModalOpen]);
```
*Result:* Eliminates browser scrollbar collision on Windows and prevents the double scrollbar (`||`) visual defect.

---

## 6. Build & Bundle Optimization Metrics

- **Production Bundler:** Vite 8 (Rollup 4)
- **CSS Strategy:** Tailwind CSS v4 with unified single CSS entrypoint (`@import "tailwindcss";`)
- **Bundle Metrics:**
  - `dist/index.html`: 1.22 kB (gzip: 0.71 kB)
  - `dist/assets/index.css`: 108.32 kB (gzip: 14.31 kB)
  - `dist/assets/index.js`: 445.55 kB (gzip: 126.08 kB)
- **Build Speed:** ~350–500ms on modern multicore CPUs.
