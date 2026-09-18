export type SoundProfile = 'wristwatch' | 'grandfather' | 'woodblock';

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentBpm: number = 60;
  private currentProfile: SoundProfile = 'wristwatch';
  private timerId: number | null = null;
  private nextTickTime: number = 0;
  private onTickCallback: (() => void) | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Synthesize a single tick sound with precise Web Audio API nodes
   */
  public playTick(profile: SoundProfile = this.currentProfile, time?: number): void {
    try {
      const ctx = this.getContext();
      const startTime = time !== undefined ? time : ctx.currentTime;

      if (profile === 'wristwatch') {
        // Mechanical Wristwatch: Crisp, high-frequency metallic click with bandpass noise & high sine transient
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(4200, startTime);
        osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.035);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3800, startTime);
        filter.Q.setValueAtTime(8, startTime);

        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.045);
      } else if (profile === 'grandfather') {
        // Grandfather Clock: Deep resonant wood-and-escapement swing with low wooden thud and metallic tick
        // 1. Wooden body resonance
        const oscWood = ctx.createOscillator();
        const gainWood = ctx.createGain();
        oscWood.type = 'sine';
        oscWood.frequency.setValueAtTime(480, startTime);
        oscWood.frequency.exponentialRampToValueAtTime(140, startTime + 0.08);

        gainWood.gain.setValueAtTime(0.45, startTime);
        gainWood.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.085);

        oscWood.connect(gainWood);
        gainWood.connect(ctx.destination);

        oscWood.start(startTime);
        oscWood.stop(startTime + 0.09);

        // 2. Escapement click transient
        const oscClick = ctx.createOscillator();
        const gainClick = ctx.createGain();
        oscClick.type = 'triangle';
        oscClick.frequency.setValueAtTime(2200, startTime);
        oscClick.frequency.exponentialRampToValueAtTime(600, startTime + 0.03);

        gainClick.gain.setValueAtTime(0.25, startTime);
        gainClick.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);

        oscClick.connect(gainClick);
        gainClick.connect(ctx.destination);

        oscClick.start(startTime);
        oscClick.stop(startTime + 0.04);
      } else if (profile === 'woodblock') {
        // Zen Woodblock: Organic, soft, low-resonance percussion sound with pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime);
        osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.07);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, startTime);
        filter.Q.setValueAtTime(4, startTime);

        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.09);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.095);
      }
    } catch (e) {
      console.error('Failed to play focus tick:', e);
    }
  }

  /**
   * Ambient Completion Gong / Tibetan Singing Bowl Chime
   */
  public playCompletionGong(time?: number): void {
    try {
      const ctx = this.getContext();
      const startTime = time !== undefined ? time : ctx.currentTime;
      const duration = 4.5;

      // Harmonic frequencies for rich ambient chime: 216Hz, 432Hz, 648Hz, 864Hz
      const harmonics = [
        { freq: 216, gain: 0.35 },
        { freq: 432, gain: 0.25 },
        { freq: 648, gain: 0.15 },
        { freq: 864, gain: 0.08 },
      ];

      harmonics.forEach(({ freq, gain: initialGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        // Slight subtle vibrato / pitch drift
        osc.frequency.exponentialRampToValueAtTime(freq * 0.995, startTime + duration);

        gain.gain.setValueAtTime(initialGain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });
    } catch (e) {
      console.error('Failed to play completion chime:', e);
    }
  }

  /**
   * High-precision lookahead scheduler running at 25ms intervals
   */
  private scheduleTicks(): void {
    if (!this.isRunning) return;

    const ctx = this.getContext();
    const lookahead = 0.1; // 100ms lookahead window
    const intervalSeconds = 60 / this.currentBpm;

    while (this.nextTickTime < ctx.currentTime + lookahead) {
      this.playTick(this.currentProfile, this.nextTickTime);

      if (this.onTickCallback) {
        // Trigger UI pulse slightly ahead or right on time
        const delayMs = Math.max(0, (this.nextTickTime - ctx.currentTime) * 1000);
        setTimeout(() => {
          if (this.isRunning && this.onTickCallback) {
            this.onTickCallback();
          }
        }, delayMs);
      }

      this.nextTickTime += intervalSeconds;
    }

    this.timerId = window.setTimeout(() => this.scheduleTicks(), 25);
  }

  /**
   * Start seamless continuous loop
   */
  public startLoop(bpm: number, profile: SoundProfile, onTick?: () => void): void {
    this.stopLoop();
    this.currentBpm = bpm;
    this.currentProfile = profile;
    this.onTickCallback = onTick || null;
    this.isRunning = true;

    const ctx = this.getContext();
    this.nextTickTime = ctx.currentTime + 0.05;
    this.scheduleTicks();
  }

  /**
   * Update BPM on the fly without resetting loop
   */
  public setBpm(bpm: number): void {
    this.currentBpm = bpm;
  }

  /**
   * Update Sound Profile on the fly
   */
  public setProfile(profile: SoundProfile): void {
    this.currentProfile = profile;
  }

  /**
   * Stop loop
   */
  public stopLoop(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

export const focusAudioEngine = new FocusAudioEngine();
