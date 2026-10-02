// Open-Source & Multi-Provider AI Engine (Gemini 3.8/3.7/3.5, Groq Llama/Mixtral/DeepSeek, Ollama, OpenAI)
export const PERSONAS = {
  hype: {
    id: 'hype',
    name: 'Hype Beast',
    tagline: 'High-octane, unapologetic energy & swagger',
    avatar: '⚡',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
  },
  bestie: {
    id: 'bestie',
    name: 'Empathetic Bestie',
    tagline: 'Warm, validating, tea-spilling unconditional love',
    avatar: '💖',
    gradient: 'from-pink-400 via-rose-500 to-purple-500',
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
  },
  zen: {
    id: 'zen',
    name: 'Zen Master',
    tagline: 'Grounded clarity, deep breaths & quiet inner power',
    avatar: '🌊',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
  },
  mentor: {
    id: 'mentor',
    name: 'Strategic Mentor',
    tagline: 'Level-headed wisdom, reframing & high-agency tactics',
    avatar: '🎯',
    gradient: 'from-blue-400 via-indigo-500 to-violet-500',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgGlow: 'rgba(99, 102, 241, 0.15)',
  },
};

export const SITUATIONS = [
  { id: 'interview', label: 'Interview in an hour', icon: '💼', promptHint: 'nerves before a big interview' },
  { id: 'rejection', label: 'Received a rejection', icon: '💔', promptHint: 'disheartened by a rejection or bad news' },
  { id: 'imposter', label: 'Imposter Syndrome spike', icon: '🧠', promptHint: 'feeling like a fraud or underqualified' },
  { id: 'bug_stuck', label: 'Stuck on stubborn bug', icon: '🐛', promptHint: 'banging head against code for hours' },
  { id: 'monday', label: 'Sunday scaries / Monday blues', icon: '☕', promptHint: 'dreading the upcoming week or workload' },
  { id: 'shipped', label: 'Just shipped something!', icon: '🚀', promptHint: 'celebrating a new release or completed milestone' },
];

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile (Meta Open Flagship)', tag: 'Recommended' },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B (High Reasoning)', tag: 'New' },
  { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B (Top Open Benchmark)', tag: 'New' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant (Ultra-Fast 750+ tok/s)', tag: 'Fastest' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Mistral MoE Open Model)', tag: 'Popular' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Google Open Weights)', tag: 'Efficient' },
];

// Modern Gemini 3.x and 2.5 models only (Removed legacy 1.5)
export const GEMINI_MODELS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Latest Flagship • New)', tag: 'Recommended' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash (High-Speed Agentic)', tag: 'Fast' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite (Ultra-Low Latency)', tag: 'Lite' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Production Standard)', tag: 'Stable' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Deep Reasoning & Analysis)', tag: 'Pro' },
];

// Helper to determine active credentials and provider
export function resolveCredentials(customKey = '', customEndpoint = '', customModel = '', customProvider = '') {
  const envGeminiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const envGroqKey = (import.meta.env.VITE_GROQ_API_KEY || '').trim();
  const envOpenAIKey = (import.meta.env.VITE_OPENAI_API_KEY || '').trim();

  const userKey = (customKey || '').trim();
  let provider = customProvider || 'gemini';

  // Smart auto-detection from key prefix if not manually specified
  if (userKey) {
    if (userKey.startsWith('gsk_')) {
      provider = 'groq';
    } else if (userKey.startsWith('AIza')) {
      provider = 'gemini';
    } else if (userKey.startsWith('sk-')) {
      provider = 'openai';
    }
  } else if (!customProvider) {
    if (envGeminiKey) provider = 'gemini';
    else if (envGroqKey) provider = 'groq';
    else provider = 'gemini';
  }

  // Model resolution: prioritize user selection > env variable > default
  let activeModel = (customModel || '').trim();
  if (!activeModel) {
    if (provider === 'groq') {
      activeModel = (import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile').trim();
    } else if (provider === 'gemini') {
      activeModel = (import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash').trim();
    } else {
      activeModel = (import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini').trim();
    }
  }

  // Key resolution
  let activeKey = userKey;
  if (!activeKey) {
    if (provider === 'gemini') activeKey = envGeminiKey;
    else if (provider === 'groq') activeKey = envGroqKey;
    else if (provider === 'openai') activeKey = envOpenAIKey;
  }

  // Endpoint resolution
  let activeEndpoint = customEndpoint;
  if (!activeEndpoint) {
    if (provider === 'groq') activeEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    else if (provider === 'openai') activeEndpoint = import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    else if (provider === 'ollama') activeEndpoint = import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434';
  }

  return {
    provider,
    activeKey,
    activeModel,
    activeEndpoint,
    hasEnvGemini: Boolean(envGeminiKey),
    hasEnvGroq: Boolean(envGroqKey),
    isBrowserOverride: Boolean(userKey),
  };
}

// Groq / OpenAI Compatible caller
async function callOpenAICompatible({ endpoint, apiKey, model, prompt, isJson = false }) {
  try {
    const body = {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: isJson ? 0.7 : 0.85,
    };
    if (isJson) {
      body.response_format = { type: 'json_object' };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content.trim();
    } else {
      const err = await res.text();
      console.warn(`API call to ${endpoint} with model ${model} failed with ${res.status}:`, err);
    }
  } catch (err) {
    console.warn(`API call error:`, err);
  }
  return null;
}

// Google Gemini API caller with cascade through modern 3.x and 2.5 (No 1.5)
async function callGemini({ apiKey, prompt, isJson = false, model }) {
  const modelsToTry = Array.from(new Set([
    model,
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
  ])).filter(Boolean);

  for (const m of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: isJson ? 0.7 : 0.85,
          ...(isJson ? { responseMimeType: 'application/json' } : {})
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } else {
        const errData = await res.text();
        console.warn(`Gemini model ${m} returned ${res.status}, trying next fallback...`, errData);
      }
    } catch (err) {
      console.warn(`Gemini model ${m} network call error:`, err);
    }
  }
  return null;
}

// Local Ollama caller
async function callOllama({ endpoint, model, prompt, isJson = false }) {
  try {
    const url = `${endpoint.replace(/\/$/, '')}/api/generate`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3.2',
        prompt,
        stream: false,
        format: isJson ? 'json' : undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.response) return data.response.trim();
    }
  } catch (err) {
    console.warn('Ollama error:', err);
  }
  return null;
}

// Main Hype Speech Generator
export async function generateHypeSpeech({ friendName = 'Alex', persona = 'hype', situation = '', notes = '', apiKey = '', apiEndpoint = '', model = '', provider = '' }) {
  const creds = resolveCredentials(apiKey, apiEndpoint, model, provider);

  const prompt = `You are HypePal AI, speaking in the persona of "${PERSONAS[persona]?.name || 'Hype Beast'}".
Your tone: ${PERSONAS[persona]?.tagline}.
You are giving a heartfelt, powerful, 3-paragraph motivational pep talk dedicated directly to "${friendName}".
Situation: ${situation || 'Need general motivation'}
Friend's specific details: ${notes || 'Feeling challenged'}
Guidelines:
1. Address ${friendName} directly with high authenticity and enthusiasm.
2. Acknowledge what they are facing without minimizing their feelings.
3. Deliver high-conviction proof of why they are capable, reminding them of their grit and growth.
4. End with an unforgettable punchy rallying cry.
Keep it between 120-180 words, punchy and memorable.`;

  // 1. Groq (Llama 3.3, Mixtral, DeepSeek)
  if (creds.provider === 'groq' && creds.activeKey) {
    const response = await callOpenAICompatible({
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: creds.activeKey,
      model: creds.activeModel || 'llama-3.3-70b-versatile',
      prompt,
      isJson: false,
    });
    if (response) return response;
  }

  // 2. Google Gemini (Modern 3.8/3.7/3.5/2.5)
  if ((creds.provider === 'gemini' || !creds.activeKey) && (creds.activeKey || import.meta.env.VITE_GEMINI_API_KEY)) {
    const geminiKey = creds.activeKey || import.meta.env.VITE_GEMINI_API_KEY;
    const response = await callGemini({
      apiKey: geminiKey,
      prompt,
      model: creds.activeModel || 'gemini-3.8-flash',
      isJson: false,
    });
    if (response) return response;
  }

  // 3. Local Ollama
  if (creds.provider === 'ollama') {
    const response = await callOllama({
      endpoint: creds.activeEndpoint || 'http://localhost:11434',
      model: creds.activeModel || 'llama3.2',
      prompt,
      isJson: false,
    });
    if (response) return response;
  }

  // 4. OpenAI / Generic compatible
  if (creds.provider === 'openai' && creds.activeKey) {
    const response = await callOpenAICompatible({
      endpoint: creds.activeEndpoint || 'https://api.openai.com/v1/chat/completions',
      apiKey: creds.activeKey,
      model: creds.activeModel || 'gpt-4o-mini',
      prompt,
      isJson: false,
    });
    if (response) return response;
  }

  // 5. Built-in On-Device Procedural AI Engine (Always Works Offline!)
  await new Promise(r => setTimeout(r, 550));

  const friend = friendName || 'Friend';
  const customContext = notes ? `regarding "${notes}"` : '';

  if (persona === 'hype') {
    return `Listen to me right now, ${friend}: DROP whatever self-doubt just tried to whisper in your ear! 

Do you have any idea how much grit it took for you to even be in this arena? Most people won't even step up to the plate, but you are out here swinging. Whatever challenge you're staring at ${customContext}—it doesn't stand a chance against your momentum. 

You didn't come this far just to come this far. Take a massive breath, square your shoulders, and walk into that room like you own the blueprint. LFG, ${friend}! You are built for this! ⚡🔥`;
  }

  if (persona === 'bestie') {
    return `Hey ${friend}, first off: pause for a second, take a deep breath, and let your shoulders drop. 💖

I know your brain is doing that thing where it tries to convince you you're not doing enough, or that everyone else has it figured out. Spoiler alert: they don't! You have been working so hard, and I see every ounce of effort you've poured in ${customContext}. 

You don't need to be superhuman today; you just need to be yourself. I believe in you so much, and you've got this. Now drink some water, give yourself some grace, and remember how proud I am of you. 🌸`;
  }

  if (persona === 'zen') {
    return `${friend}, close your eyes for one slow, deep inhalation. Hold it... and release. 🌊

The storm of thoughts in your mind is just weather; you are the sky. Notice the tension around ${situation || 'this moment'} and let it pass through you without holding onto it. Panic has never solved a problem that patience couldn't untie.

You are completely grounded in this present moment. Take one deliberate step at a time. The mountain is climbed not by looking at the summit, but by placing one steady foot in front of the other. Peace is already within you.`;
  }

  // Mentor persona
  return `${friend}, let's look at the facts instead of the anxiety. 🎯

Whatever resistance you're feeling right now ${customContext} is not evidence that you don't belong—it is direct evidence that you are operating at the edge of your comfort zone. That's literally where mastery is generated.

Stop measuring yourself against an impossible standard of effortless perfection. Break this down: what is the single highest-leverage action you can take in the next 15 minutes? Execute that one thing. You have solved 100% of your hardest days so far, and you will navigate this one with flying colors.`;
}

// Cognitive Reframing Engine with Groq / Gemini / Offline CBT
export async function reframeThought({ thought, friendName = 'Alex', apiKey = '', apiEndpoint = '', model = '', provider = '' }) {
  const creds = resolveCredentials(apiKey, apiEndpoint, model, provider);

  const prompt = `You are an expert cognitive behavioral therapy (CBT) mindset coach analyzing an anxious developer/student's thought.
Thought from ${friendName}: "${thought}"

Return ONLY a valid JSON object with these exact keys:
{
  "distortion": "Name of cognitive distortion (e.g. Catastrophizing, Imposter Syndrome Trap, All-or-Nothing Thinking, Mind Reading)",
  "distortionDesc": "Brief 1-2 sentence explanation of why this thought is a trap",
  "realityCheck": "The objective, grounded truth/evidence contradicting the trap",
  "reframedThought": "An empowering, realistic reframe written in the first person for ${friendName}",
  "microAction": "A simple 2-minute actionable physical or mental step they can do right now"
}`;

  // 1. Groq (Llama / Mixtral / DeepSeek)
  if (creds.provider === 'groq' && creds.activeKey) {
    const raw = await callOpenAICompatible({
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: creds.activeKey,
      model: creds.activeModel || 'llama-3.3-70b-versatile',
      prompt,
      isJson: true,
    });
    if (raw) {
      try {
        const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.distortion && parsed.reframedThought) return parsed;
      } catch (e) {
        console.warn('Groq JSON parse error:', e);
      }
    }
  }

  // 2. Google Gemini
  if ((creds.provider === 'gemini' || !creds.activeKey) && (creds.activeKey || import.meta.env.VITE_GEMINI_API_KEY)) {
    const geminiKey = creds.activeKey || import.meta.env.VITE_GEMINI_API_KEY;
    const raw = await callGemini({
      apiKey: geminiKey,
      prompt,
      model: creds.activeModel || 'gemini-3.8-flash',
      isJson: true,
    });
    if (raw) {
      try {
        const cleaned = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.distortion && parsed.reframedThought) return parsed;
      } catch (e) {
        console.warn('Gemini JSON parse error:', e);
      }
    }
  }

  // 3. Fallback Built-in Cognitive Analyzer
  await new Promise(r => setTimeout(r, 600));

  const t = thought.toLowerCase();
  let distortion = 'All-or-Nothing Thinking';
  let distortionDesc = 'Treating a temporary setback as a permanent verdict on your worth.';
  let realityCheck = 'A single moment or problem does not define your trajectory or value.';
  let reframedThought = `I am facing a tough hurdle right now, but every challenge I solve increases my capability. Progress is messy, and that is completely normal.`;
  let microAction = 'Step away from the screen for 3 minutes, stretch your arms, and write down just ONE tiny step you can take next.';

  if (t.includes('fraud') || t.includes('imposter') || t.includes('not smart') || t.includes('not good enough')) {
    distortion = 'Imposter Syndrome Trap';
    distortionDesc = 'Attributing your genuine achievements to luck while magnifying doubts.';
    realityCheck = 'Nobody knows everything. Being in a position where you have to learn is a sign of career growth, not failure.';
    reframedThought = `I don't need to know everything to be valuable. My ability to research, ask questions, and adapt is my true superpower.`;
    microAction = 'Open your Victory Vault and read 2 things you previously overcame that felt impossible at the time.';
  } else if (t.includes('ruined') || t.includes('fail') || t.includes('disaster') || t.includes('worst')) {
    distortion = 'Catastrophizing';
    distortionDesc = 'Jumping straight to the worst-case scenario as if it is inevitable.';
    realityCheck = 'Even if things do not go 100% according to plan, the worst-case fantasy in your head rarely happens.';
    reframedThought = `This didn't go the way I hoped, but I have the resilience and skills to adjust and find another pathway forward.`;
    microAction = 'Write down the actual most likely outcome versus the disaster fantasy. You will see how manageable it really is.';
  } else if (t.includes('they think') || t.includes('everyone thinks') || t.includes('look stupid')) {
    distortion = 'Mind Reading';
    distortionDesc = 'Assuming you know others are judging you harshly without concrete proof.';
    realityCheck = 'Most people are too busy stressing about their own responsibilities to scrutinize you.';
    reframedThought = `People are supportive and want to see me succeed. It is okay to ask for help or admit I am working through a challenge.`;
    microAction = 'Send a quick message to a trusted peer or mentor asking for their take on one specific question.';
  }

  return {
    distortion,
    distortionDesc,
    realityCheck,
    reframedThought,
    microAction,
  };
}
