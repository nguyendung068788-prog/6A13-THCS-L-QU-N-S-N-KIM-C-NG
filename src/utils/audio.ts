/**
 * Web Audio API synthesizer for victory fanfare and diamond celebration.
 * Works 100% offline without external audio files.
 * Only triggers upon explicit user interactions.
 */

class SoundPlayer {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Sound initialized lazily upon first interaction
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Sparkling diamond chime sound
   */
  public playDiamondChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Arpeggio of shimmering frequencies: C6, E6, G6, B6, C7
      const notes = [1046.5, 1318.5, 1567.98, 1975.53, 2093.0];

      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.36);
      });
    } catch {
      // Audio autoplay policy or hardware limitation gracefully handled
    }
  }

  /**
   * Victory Fanfare chord for Top 3 & Grand Podium Announcement
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Sequence: Major triad fanfare sequence C5 -> E5 -> G5 -> C6 held
      const sequence = [
        { freq: 523.25, time: 0, duration: 0.12 },
        { freq: 659.25, time: 0.12, duration: 0.12 },
        { freq: 783.99, time: 0.24, duration: 0.14 },
        { freq: 1046.5, time: 0.38, duration: 0.6 },
        { freq: 1318.51, time: 0.38, duration: 0.6 }, // Harmony chord
      ];

      sequence.forEach((note) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0.001, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.2, now + note.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.duration);
      });
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Subtle click / confirm feedback
   */
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore audio failure
    }
  }

  public playCoins() {
    this.playDiamondChime();
  }

  public playLevelUp() {
    this.playDiamondChime();
  }

  public playVictory() {
    this.playVictoryFanfare();
  }
}

export const soundManager = new SoundPlayer();
