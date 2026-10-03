class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
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
      this.currentUtterance = null;
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

    if (this.synth.paused) {
      this.synth.resume();
    }

    // Clean text of markdown characters or emojis for natural speech
    const cleanText = text
      .replace(/[*#_~>]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance; // Keep instance reference to prevent GC

    // Pick personality speech settings
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
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      this.currentUtterance = null;
      if (onError) onError(err);
    };

    this.synth.speak(utterance);
  }
}

export const speechService = new SpeechService();
