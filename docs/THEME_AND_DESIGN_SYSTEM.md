# 🎨 HypePal AI — Theme, Aesthetics & Design System

A comprehensive specification of HypePal AI's design language, color tokens, glassmorphism physics, typography scales, and postcard themes.

---

## 1. Design Philosophy: "Empathetic Cyber-Resilience"

Software developers in distress do not respond well to clinical hospital whites or flat corporate gray dashboards. HypePal AI's design language is built on **Empathetic Cyber-Resilience**:
- **Deep Slate/Obsidian Canvas (`#090d16`):** Minimizes optical fatigue and sensory overload during late-night debugging spirals.
- **Vibrant Accent Hues:** Strategic use of warm amber, radiant cyan, electric purple, and emerald to trigger micro-dopamine rewards.
- **Glassmorphism Layering:** Subtle backdrop blurs (`blur(16px)`) and delicate luminous borders create a sense of tactile depth and emotional sanctuary.

---

## 2. Color System & Design Tokens

### 2.1 Core Palette

| Role | Color Name | Hex Token | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas** | Obsidian Void | `#090d16` | `bg-[#090d16]` | Root viewport background |
| **Surface Dark** | Deep Slate | `#0a0f1d` | `bg-[#0a0f1d]` | Modal panels & cards |
| **Primary Accent** | Radiant Amber | `#f59e0b` | `amber-500` | Primary CTAs, Victory Vault, trophies |
| **Energy / Hype** | Electric Orange | `#f97316` | `orange-500` | Streaks, momentum fires, hype beast |
| **Tech / Code** | Cyber Cyan | `#06b6d4` | `cyan-500` | Code & Tech category, system screening |
| **Career / Mind** | Royal Indigo | `#6366f1` | `indigo-500` | Career category, strategic mentor |
| **Distortion / CBT**| Vivid Purple | `#a855f7` | `purple-500` | CBT reframer, brain badges |
| **Wellness / Love** | Rose Pink | `#ec4899` | `pink-500` | Wellness category, empathetic bestie |
| **Armor / Proof** | Luminous Emerald | `#10b981` | `emerald-500` | Mindset armor, verified badges |

---

## 3. Typography Scale

HypePal AI combines modern geometric display fonts with ultra-legible modern grotesk body typography:

1. **Display & Headings:** `Outfit` (Google Fonts)
   - Heavy weights (700, 800, 900)
   - Tight letter-spacing (`tracking-tight`) for high-impact confidence.
2. **Body & UI Elements:** `Plus Jakarta Sans`
   - Clean, open apertures for maximum legibility at small sizes (10px–13px) on mobile displays.
3. **Metrics, Timestamps & Code:** `JetBrains Mono` / system monospace
   - Deterministic tabular data presentation for dates and streak calculations.

---

## 4. Glassmorphism & Elevation Physics

To prevent Chromium GPU compositor ghost slicing on Windows displays while maintaining frosted depth:

```css
/* Glassmorphism utility with isolated stacking contexts */
.glass-panel {
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card {
  background: rgba(22, 32, 50, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.glass-card:hover {
  border-color: rgba(168, 85, 247, 0.35);
}
```

---

## 5. Postcard Studio Theme Palettes

The **Digital Hype Postcard Studio** supports 4 distinct emotional themes:

### 1. ⚡ Neon Cyber
- **Gradient:** Deep Indigo to Midnight Slate (`from-indigo-950 via-slate-900 to-purple-950`)
- **Accent Border:** Cyan & Purple glow (`border-cyan-500/40`)
- **Badge:** Electric Cyber Stamp
- **Vibe:** High-energy coding flow, terminal hacking, relentless drive.

### 2. 🌅 Golden Sunset
- **Gradient:** Warm Amber to Crimson Rose (`from-amber-950 via-slate-900 to-rose-950`)
- **Accent Border:** Golden Amber glow (`border-amber-500/40`)
- **Badge:** Golden Hour Energy
- **Vibe:** Deep warmth, validation, post-rejection healing.

### 3. 🌲 Emerald Aurora
- **Gradient:** Dark Teal to Forest Slate (`from-emerald-950 via-slate-900 to-teal-950`)
- **Accent Border:** Emerald Aurora glow (`border-emerald-500/40`)
- **Badge:** Growth & Clarity
- **Vibe:** Grounded resilience, calm breath resets, long-term mastery.

### 4. 🌌 Deep Space
- **Gradient:** Obsidian Violet to Midnight Black (`from-purple-950 via-slate-950 to-slate-900`)
- **Accent Border:** Starlight Purple glow (`border-purple-500/40`)
- **Badge:** Cosmic Perspective
- **Vibe:** Stoic elevation, looking at obstacles from a 30,000-foot view.

---

## 6. Audio Haptic Sound Design

Tactile auditory feedback anchors psychological safety using the browser's native **Web Audio API**:

- **Pop Feedback (Selection / Toggle):** Sine oscillator sweeping from 300Hz down to 150Hz over 50ms with rapid exponential gain decay.
- **Success Chime (Victory Logged / Reframe Generated):** Polyphonic major triad chord (C5: 523Hz $\rightarrow$ E5: 659Hz $\rightarrow$ G5: 783Hz) with a 250ms decay envelope.
- **Flame Ignite (Streak Modal Opened):** Low-frequency rumble (80Hz $\rightarrow$ 160Hz) creating a warm auditory presence.
