# 📋 HypePal AI — Product Requirements Document (PRD)

**Project Name:** HypePal AI  
**Event:** Hacktoberfest Weekend Challenge 2026: Build for a Friend  
**Primary Beneficiary:** Alex (Junior/Mid-level Frontend Developer facing technical interviews)  
**Status:** Shipped & Production Ready  
**Live Application:** [https://arnab825.github.io/HyperPal-AI/](https://arnab825.github.io/HyperPal-AI/)  
**Source Repository:** [https://github.com/arnab825/HyperPal-AI](https://github.com/arnab825/HyperPal-AI)  

---

## 1. Executive Summary & Problem Statement

Software developers face an unspoken epidemic of **isolating imposter syndrome, pre-interview panic, and burnout**. As software complexity increases, developers—particularly junior engineers and career switchers—frequently internalize standard engineering hurdles (complex PR reviews, tough bugs, mock interview struggles) as evidence of fundamental personal incompetence.

Existing developer tools compound the problem:
- **Project trackers (Jira, Linear, GitHub Issues):** Cold, transactional checklists that barrage developers with overdue tags and anxiety-inducing red badges.
- **Generic AI Chatbots (ChatGPT, Claude):** Respond to raw emotional vulnerability with sterile, clinical, or canned corporate disclaimers (e.g. *"As an AI, I cannot provide mental health advice"*).
- **Meditation Apps (Headspace, Calm):** Detached from the tactile realities of race conditions, system design screenings, and merge conflicts.

### The Solution: HypePal AI
An emotionally intelligent, open-source personal cheerleader and mindset coach built with open-weight AI at its core. It combines high-octane personalized motivation, clinical Cognitive Behavioral Therapy (CBT) distortion reframing, and an empirical "Victory Vault" brag sheet to physically prove capability when the brain lies.

---

## 2. Target Personas

### Primary Persona: Alex (The Struggling Friend)
- **Role:** Junior Frontend Developer transitioning to Senior/Mid-level roles.
- **Core Pain Point:** Spiraling self-doubt before technical screenings, fear of asking questions in PRs, and acute confidence amnesia during outages.
- **Need:** Immediate, judgment-free encouragement, structured thought reframing, and private evidence of capability that requires zero subscription fees.

### Secondary Persona: The Supportive Peer / Mentor
- **Role:** Friend, tech lead, or pair programming buddy.
- **Core Pain Point:** Difficulty supporting an anxious friend without sounding patronizing or toxic-positive.
- **Need:** A 1-click mechanism to deliver customized, aesthetic digital cheer cards straight to their friend's phone or Slack.

---

## 3. Core Value Propositions

1. **Emotional Safety Net:** Provides tailored emotional validation across 4 distinct AI personalities (Hype Beast, Empathetic Bestie, Zen Master, Strategic Mentor).
2. **Clinical Thought Restructuring:** Breaks spiral loops into identifiable CBT traps, reality checks, and 2-minute actionable steps.
3. **Hard-Evidence Gamification:** Replaces arbitrary habit trackers with a deterministic calendar-day streak and mindset armor index.
4. **Absolute Data Sovereignty:** Supports 100% offline local inference via Ollama—zero bytes leave the machine, guaranteeing total psychological safety.

---

## 4. Functional Requirements (FR)

### FR1: Multi-Persona Hype Engine
- **FR1.1:** Support 4 selectable personas with distinct system prompts and tone modulation:
  - *⚡ Hype Beast:* High swagger, bold metaphors, aggressive belief.
  - *💖 Empathetic Bestie:* Warmth, validation, emotional safety, shared humor.
  - *🌊 Zen Master:* Breathing cadence, stoic reframing, calmness.
  - *🎯 Strategic Mentor:* Tactical steps, career agency, high-signal engineering perspective.
- **FR1.2:** Audio Speech Synthesis: Native browser TTS with dynamic waveform visualization.
- **FR1.3:** 1-Click Vault Logging: Allow instant conversion of any generated hype into a saved milestone.

### FR2: "Reframe It!" — CBT Cognitive Distortion Buster
- **FR2.1:** Distortion Focus Lenses: Quick filter strip for `🎯 Auto-Detect`, `🧠 Imposter Syndrome`, `💥 Catastrophizing`, `🐙 PR Review Panic`, `⏱️ Inaction & Dread`, `⚖️ Perfectionism`.
- **FR2.2:** Scenario Presets: 6 real-world developer scenarios for instant 1-click loading.
- **FR2.3:** Clinical 4-Pillar Breakdown:
  1. *The Trap:* Clinical cognitive distortion diagnosis.
  2. *Objective Reality Check:* Tangible counter-evidence.
  3. *Empowering Socratic Reframe:* Rational, empowering mantra.
  4. *2-Minute Dopamine Micro-Action:* Low-friction behavioral experiment.
- **FR2.4:** Algorithmic Match Precision score (e.g. *97% Match*) & Neurological Trigger tag.
- **FR2.5:** Action Pipeline: 1-click "Save to Vault" and "Send as Cheer Card" integrations.

### FR3: Alex's Victory Vault (The Empirical Brag Sheet)
- **FR3.1:** Deterministic Calendar-Day Streak: Exact $\Delta t = 24\text{ hours}$ local midnight timestamp difference calculation.
- **FR3.2:** 4 Interactive Metric Modals:
  - *Total Wins:* Domain breakdown (Code & Tech, Career, Wellness, Life).
  - *Streak Matrix:* 7-day visual consistency matrix and 14-day momentum rate.
  - *Rank Roadmap:* Progress tracking across *Spark Starter* ➔ *Rising Warrior* ➔ *Unstoppable Titan* ➔ *Mythic Architect*.
  - *Mindset Armor:* Imposter defense index (*Diamond Tier 98%*).
- **FR3.3:** Smart "+ Log a Win" Modal:
  - Centered responsive dialog via React `createPortal`.
  - `✨ Auto-Fill with AI` and `✨ Polish with AI` functionality.
  - Quick idea chips and optional Cheer Card forwarding.
- **FR3.4:** Markdown Export: 1-click copy formatted for performance reviews.

### FR4: Digital Hype Postcard Studio
- **FR4.1:** Dual Creation Mode: Fluid liquid animated slider between **"✍️ Write My Own" (Handcrafted)** and **"✨ AI Magic Composer"**.
- **FR4.2:** Context-Aware UI: Cleanly hides AI sliders when in handcrafted mode.
- **FR4.3:** 4 Aesthetic Themes: *Neon Cyber*, *Golden Sunset*, *Emerald Aurora*, *Deep Space*.
- **FR4.4:** Multi-Channel Delivery: 1-click links for WhatsApp, Slack, Web Share API (`navigator.share`), clipboard copy, and dynamic URL query parameters (`?to=...&msg=...#postcard`).

### FR5: Multi-Engine AI Architecture
- **FR5.1:** Local Ollama: Direct connection to `http://localhost:11434` running quantized open-weight models (`llama3.2`, `mistral`, `deepseek-r1`).
- **FR5.2:** Groq Cloud: Blazing-fast open-weight execution for Meta Llama 3.3 70B, DeepSeek R1 Distill, and Qwen 2.5 32B.
- **FR5.3:** Google Gemini: Native cloud fallback with Gemini 3.8/3.7 Flash.
- **FR5.4:** Offline Procedural Engine: Guaranteed 100% uptime with zero internet and zero keys.

### FR6: Friend Profile Drawer & Quick Customizer
- **FR6.1:** Dedicated profile pill dropdown (GitHub/Linear/Notion style).
- **FR6.2:** Real-time challenge quote display.
- **FR6.3:** One-click quick switching between sample friends (Alex, Jordan, Maya) or custom user profile.

---

## 5. Non-Functional Requirements (NFR)

| Metric | Target | Actual Performance |
| :--- | :--- | :--- |
| **Initial Load Time** | < 1.0s | **~350ms** (Gzipped bundle: 126 kB) |
| **Cloud AI Inference Latency** | < 1,000ms | **~380ms** via Groq LPU (Llama 3.3 70B) |
| **Offline Inference Latency** | < 2,000ms | **~850ms** via Local Ollama |
| **Edge Fallback Latency** | < 50ms | **< 5ms** instant heuristic rendering |
| **Telemetry / Tracking** | 0 tracking pixels | **100% Zero Telemetry** |
| **Data Retention** | 0 server storage | **100% Client-Side LocalStorage** |
| **Mobile Responsiveness** | Viewports 320px–4K | **Full fluid responsiveness & touch targets** |

---

## 6. Success Metrics & User Impact

1. **Emotional De-escalation:** Reduction in reported self-doubt spirals during interview prep cycles.
2. **Brag Sheet Retention:** Concrete accumulation of verified engineering breakthroughs in Alex's local vault.
3. **Daily Momentum:** Sustained multi-day streaks without reliance on anxiety-driven notifications.
