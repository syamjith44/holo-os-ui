// Voice utilities and helpers
export interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export const defaultVoiceConfig: VoiceConfig = {
  rate: 0.9,
  pitch: 1,
  volume: 0.8,
};

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export function findRoboticVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  
  // Look for voices that sound more robotic/synthetic
  const roboticKeywords = ['robotic', 'computer', 'synthetic', 'digital', 'machine'];
  
  for (const keyword of roboticKeywords) {
    const voice = voices.find(v => v.name.toLowerCase().includes(keyword));
    if (voice) return voice;
  }
  
  // Fallback to any available voice
  return voices.length > 0 ? voices[0] : null;
}

export function createUtterance(text: string, config: Partial<VoiceConfig> = {}): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  const finalConfig = { ...defaultVoiceConfig, ...config };
  
  utterance.rate = finalConfig.rate;
  utterance.pitch = finalConfig.pitch;
  utterance.volume = finalConfig.volume;
  
  if (finalConfig.voice) {
    utterance.voice = finalConfig.voice;
  } else {
    const roboticVoice = findRoboticVoice();
    if (roboticVoice) {
      utterance.voice = roboticVoice;
    }
  }
  
  return utterance;
}

export function speakText(text: string, config?: Partial<VoiceConfig>): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    
    const utterance = createUtterance(text, config);
    
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
