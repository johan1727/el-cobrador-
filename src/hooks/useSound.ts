import { useState, useCallback, useEffect } from 'react';

// Simple beep sounds using Web Audio API
const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export function useSound() {
  // Sonidos desactivados por defecto (opt-in)
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('el-cobrador-sound');
    // Si no hay configuración guardada, mantener desactivado (false)
    // Solo activar si el usuario explícitamente lo activó
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
  }, []);

  const playGenerate = useCallback(() => {
    if (!enabled) return;
    // Success sound: ascending tones
    createBeep(523.25, 0.1); // C5
    setTimeout(() => createBeep(659.25, 0.1), 100); // E5
    setTimeout(() => createBeep(783.99, 0.2), 200); // G5
  }, [enabled]);

  const playCopy = useCallback(() => {
    if (!enabled) return;
    // Quick confirmation beep
    createBeep(880, 0.08); // A5
  }, [enabled]);

  const playShare = useCallback(() => {
    if (!enabled) return;
    // Whoosh-like sound
    createBeep(440, 0.05);
    setTimeout(() => createBeep(554, 0.05), 50);
    setTimeout(() => createBeep(659, 0.1), 100);
  }, [enabled]);

  const playFlip = useCallback(() => {
    if (!enabled) return;
    // Flip sound: reverse sweep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [enabled]);

  const playError = useCallback(() => {
    if (!enabled) return;
    // Error buzz
    createBeep(200, 0.3, 'sawtooth');
  }, [enabled]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    // Subtle click
    createBeep(800, 0.03);
  }, [enabled]);

  const toggleSound = useCallback(() => {
    setEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('el-cobrador-sound', String(newValue));
      return newValue;
    });
  }, []);

  return {
    enabled,
    playGenerate,
    playCopy,
    playShare,
    playFlip,
    playError,
    playClick,
    toggleSound
  };
}
