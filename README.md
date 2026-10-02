# ⚡ HypePal AI — Personal Cheerleader & Mindset Coach

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-Weekend%20Challenge-orange?style=for-the-badge&logo=github)](https://dev.to/challenges)
[![React 19](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](./LICENSE)

> **Dedicated to a Friend battling imposter syndrome, pre-interview anxiety, or burnout.**  
> Built for the **Hacktoberfest Weekend Challenge: Build for a Friend**.

---

## 💡 The Inspiration & Story

When deadlines loom, technical interviews approach, or complex bugs refuse to yield, self-doubt creeps in. Traditional task managers and calendars treat us like machines—throwing red badges and overdue alarms at our faces.

**HypePal AI** is built differently: it treats engineers and creators like **human beings**.

Designed as a personal hype squad, HypePal gives your friend an emotional safety net:
- High-voltage, personalized encouragement delivered with realistic AI voices.
- CBT-informed distortion reframing to dismantle spiraling thoughts in seconds.
- A permanent **Victory Vault** to remind them of every hard thing they have previously overcome.
- Shareable digital pep-postcards to drop straight into their inbox, Slack, or WhatsApp.

---

## 🌟 Core Features

### 1. 🚀 Instant Hype Generator (With Voice Synthesis)
- **4 Distinct Personas:**
  - ⚡ **Hype Beast:** Unapologetic high-energy motivation and swagger.
  - 💖 **Empathetic Bestie:** Warm, validating, tea-spilling unconditional love.
  - 🌊 **Zen Master:** Grounded clarity, breath resets, and quiet inner resilience.
  - 🎯 **Strategic Mentor:** High-agency tactical perspective and evidence-based framing.
- **Web Speech API Read-Aloud:** Browser-native Text-to-Speech (TTS) with an animated real-time audio waveform visualizer.
- **Micro-Interactions:** Celebration confetti bursts and instant copy-to-clipboard.

### 2. 🧠 "Reframe It!" (Cognitive Distortion Buster)
- Based on Cognitive Behavioral Therapy (CBT) principles.
- Automatically diagnoses negative thinking traps:
  - *Catastrophizing*
  - *All-or-Nothing Thinking*
  - *Imposter Trap*
  - *Mind Reading*
- Formulates an objective reality check, an empowering reframe, and a **2-Minute Dopamine Micro-Action**.

### 3. 🏆 Victory Vault (The Brag Sheet)
- An evidence locker against imposter syndrome.
- Categorize wins across *Tech/Code*, *Career*, *Wellness*, and *Life*.
- Streak tracker & dynamic rank milestones (*Spark Starter* ➔ *Rising Warrior* ➔ *Unstoppable Titan*).
- One-click **Markdown Export** to paste into performance reviews, 1-on-1s, or brag sheets.

### 4. 💌 Digital Cheer Postcards
- Design a personalized cyber/sunset/aurora themed digital postcard.
- One-click copy format ready to text or DM directly to your friend.

### 5. ⚙️ Zero-Friction & Universal Compatibility
- **100% Offline-Ready:** Works immediately with high-quality built-in procedural synthesis.
- **Custom LLM Ready:** Optional setting to plug in an OpenAI / Groq / Gemini API key for live streaming completions. All keys remain safe in your local browser storage.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19 (Latest)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool:** Vite 8
- **Icons:** Lucide React
- **Animations & FX:** Canvas Confetti & custom CSS Glassmorphism
- **Speech Engine:** HTML5 Web Speech Synthesis API
- **Data Persistence:** Browser LocalStorage

---

## 🚀 Quickstart Guide

### 1. Clone the repository
```bash
git clone https://github.com/your-username/HyperPal-AI.git
cd "HyperPal AI"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser!

### 4. Build for production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel or Netlify (1-Click)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for HypePal AI"
   git branch -M main
   git remote add origin https://github.com/<your-username>/HyperPal-AI.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. The default Vite settings (`npm run build` ➔ `dist`) will automatically deploy in under 60 seconds!

---

## 🏆 Hacktoberfest Weekend Challenge Submission

Submit your project on the [DEV Hacktoberfest Challenge](https://dev.to/challenges) portal with:
- **Title:** HypePal AI — Personal Cheerleader & Mindset Coach (Built for a Friend)
- **Tags:** `#devchallenge`, `#hacktoberfest`, `#ai`, `#webdev`
- **Backstory:** Tell the judges about the friend you built this for!

---

## 📄 License
This project is open source and available under the [MIT License](./LICENSE).
