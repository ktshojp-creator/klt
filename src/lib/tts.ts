/**
 * Web Speech API (TTS) helper for speaking Korean text.
 */
export function speakKorean(text: string, onStart?: () => void, onEnd?: () => void, onError?: (err: string) => void, rate: number = 0.85): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError('Speech synthesis is not supported in this browser.');
    return;
  }

  try {
    // Cancel any current utterance
    window.speechSynthesis.cancel();

    // Clean up text (remove parenthesis or extra non-Korean symbols if any)
    const cleanText = text.replace(/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/g, '').trim();

    if (!cleanText) {
      if (onError) onError('No speakable text found.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = rate; // Custom rate for learners (default 0.85)

    // Find a Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => voice.lang.startsWith('ko-KR') || voice.lang === 'ko_KR');
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      if (onError) onError(`Speech error: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  } catch (error: any) {
    console.error('TTS execution error:', error);
    if (onError) onError(error?.message || 'Failed to play audio.');
  }
}

// Pre-load voices for Safari / Chrome where voices are loaded asynchronously
if (typeof window !== 'undefined' && window.speechSynthesis) {
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      // Just fetching voices so they are cached in memory
      window.speechSynthesis.getVoices();
    };
  }
}
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
