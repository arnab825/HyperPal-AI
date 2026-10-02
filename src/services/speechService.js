class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    return this.voices;
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  speak(text, { persona = 'hype', onStart, onEnd, onError } = {}) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();

    // Clean text of markdown characters or emojis for natural speech
    const cleanText = text
      .replace(/[*#_~>]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick personality settings
    if (persona === 'hype') {
      utterance.rate = 1.15;
      utterance.pitch = 1.15;
    } else if (persona === 'zen') {
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
    } else if (persona === 'bestie') {
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    // Try finding an English natural voice
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    const englishVoice = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) 
      || this.voices.find(v => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      if (onError) onError(err);
    };

    this.synth.speak(utterance);
  }
}

export const speechService = new SpeechService();
