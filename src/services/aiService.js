// HypePal AI Intelligence Engine with Google Gemini & Multi-LLM Support
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

export const COGNITIVE_DISTORTIONS = [
  {
    name: 'Catastrophizing',
    desc: 'Assuming the worst possible outcome is guaranteed.',
  },
  {
    name: 'All-or-Nothing Thinking',
    desc: 'Viewing situations in black-and-white (if it\'s not perfect, it\'s a total failure).',
  },
  {
    name: 'Imposter Trap',
    desc: 'Attributing successes to luck and mistakes to personal inadequacy.',
  },
  {
    name: 'Mind Reading',
    desc: 'Assuming you know that others think poorly of you without real evidence.',
  },
];

// Google Gemini API caller
async function callGemini({ apiKey, prompt, isJson = false, model = 'gemini-2.5-flash' }) {
  const modelsToTry = [
    model,
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ];

  for (const m of Array.from(new Set(modelsToTry))) {
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
      }
    } catch (err) {
      console.warn(`Gemini model ${m} failed, trying next fallback...`, err);
    }
  }
  return null;
}

// Helper to determine AI provider (Gemini or OpenAI/Groq)
function resolveCredentials(customKey, customEndpoint) {
  const geminiKey = (customKey?.startsWith('AIza') ? customKey : '') || import.meta.env.VITE_GEMINI_API_KEY || (customKey?.length > 30 && !customKey?.startsWith('sk-') ? customKey : '');
  const openaiKey = (!customKey?.startsWith('AIza') ? customKey : '') || import.meta.env.VITE_OPENAI_API_KEY || '';
  const geminiModel = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  const openaiEndpoint = customEndpoint || import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  const openaiModel = import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini';

  return { geminiKey, openaiKey, geminiModel, openaiEndpoint, openaiModel };
}

// Generate Hype Speech using Gemini or OpenAI or Procedural fallback
export async function generateHypeSpeech({ friendName = 'Alex', persona = 'hype', situation = '', notes = '', apiKey = '', apiEndpoint = '' }) {
  const { geminiKey, openaiKey, geminiModel, openaiEndpoint, openaiModel } = resolveCredentials(apiKey, apiEndpoint);

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

  // 1. Try Gemini if Gemini key exists
  if (geminiKey) {
    try {
      const responseText = await callGemini({
        apiKey: geminiKey,
        prompt,
        model: geminiModel,
        isJson: false,
      });
      if (responseText) return responseText;
    } catch (e) {
      console.warn('Gemini call failed, checking fallback...', e);
    }
  }

  // 2. Try OpenAI/Groq if OpenAI key exists
  if (openaiKey) {
    try {
      const response = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.85,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content.trim();
      }
    } catch (e) {
      console.warn('OpenAI API call failed, falling back to local engine', e);
    }
  }

  // 3. Built-in On-Device Procedural AI Engine (Always Works!)
  await new Promise(r => setTimeout(r, 600));

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

// Cognitive Reframing Engine with Gemini / OpenAI / Built-in CBT
export async function reframeThought({ thought, friendName = 'Alex', apiKey = '', apiEndpoint = '' }) {
  const { geminiKey, openaiKey, geminiModel, openaiEndpoint, openaiModel } = resolveCredentials(apiKey, apiEndpoint);

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

  // 1. Try Gemini
  if (geminiKey) {
    try {
      const text = await callGemini({
        apiKey: geminiKey,
        prompt,
        model: geminiModel,
        isJson: true,
      });
      if (text) {
        const cleaned = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.distortion && parsed.reframedThought) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini reframe failed, using fallback', e);
    }
  }

  // 2. Try OpenAI
  if (openaiKey) {
    try {
      const response = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.distortion && parsed.reframedThought) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Live API reframe failed, using built-in CBT analysis', e);
    }
  }

  // 3. Built-in Cognitive Analyzer
  await new Promise(r => setTimeout(r, 650));

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
