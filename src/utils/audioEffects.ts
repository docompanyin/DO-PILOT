// High-fidelity synthetic audio effect for point awards and achievements
export const playTwinkleSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    
    // Ascending magical arpeggio with bell-like envelope: C6, E6, G6, B6, C7, E7
    const notes = [1046.50, 1318.51, 1567.98, 1975.53, 2093.00, 2637.02];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      
      // Crisp bell chime envelope
      gain.gain.setValueAtTime(0, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.065 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.55);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.6);
    });
  } catch {
    // Graceful fallback if audio is not permitted by browser policy
  }
};
