export type BrainwaveState = 'beta' | 'alpha' | 'theta' | 'delta';

export type SoundProfile =
  | 'metronome'
  | 'temple_blocks'
  | 'wristwatch'
  | 'wood_chimes'
  | 'hand_drums'
  | 'singing_bowl'
  | 'shamanic_drum'
  | 'gong_ambient';

export interface CognitiveProfileConfig {
  state: BrainwaveState;
  name: string;
  symbol: string;
  frequencyRange: string;
  carrierBeatHz: number;
  baseCarrierHz: number;
  targets: string;
  whyUseIt: string;
  defaultBpm: number;
  bpmMin: number;
  bpmMax: number;
  recommendedSounds: SoundProfile[];
  goals: { id: string; label: string; description: string }[];
  isSafetyCapped: boolean; // Beta & Alpha max 30 mins
}

export const COGNITIVE_MATRIX: Record<BrainwaveState, CognitiveProfileConfig> = {
  beta: {
    state: 'beta',
    name: 'Beta',
    symbol: 'β',
    frequencyRange: '14–30 Hz',
    carrierBeatHz: 20,
    baseCarrierHz: 216,
    targets: 'High alertness, executive function',
    whyUseIt: 'Boosts logical thinking, complex problem solving, and processing speed.',
    defaultBpm: 100,
    bpmMin: 90,
    bpmMax: 120,
    recommendedSounds: ['metronome', 'temple_blocks', 'wristwatch'],
    goals: [
      { id: 'intense_study', label: 'Intense Study & Work', description: 'Maximum focus and analytical depth' },
      { id: 'fight_fog', label: 'Fight Fatigue & Brain Fog', description: 'High-alert cognitive surge' },
    ],
    isSafetyCapped: true,
  },
  alpha: {
    state: 'alpha',
    name: 'Alpha',
    symbol: 'α',
    frequencyRange: '8–13 Hz',
    carrierBeatHz: 10,
    baseCarrierHz: 432,
    targets: 'Calm focus, relaxed alertness',
    whyUseIt: 'Redesigns the mind for effortless absorption of information without stress or anxiety.',
    defaultBpm: 70,
    bpmMin: 60,
    bpmMax: 80,
    recommendedSounds: ['wristwatch', 'wood_chimes', 'hand_drums'],
    goals: [
      { id: 'creative_flow', label: 'Creative Flow & Reading', description: 'Effortless relaxed absorption' },
      { id: 'stress_reset', label: 'Post-Stress Reset', description: 'Calm mind, steady attention' },
    ],
    isSafetyCapped: true,
  },
  theta: {
    state: 'theta',
    name: 'Theta',
    symbol: 'θ',
    frequencyRange: '4–7 Hz',
    carrierBeatHz: 6,
    baseCarrierHz: 432,
    targets: 'Deep meditation, hypnagogia',
    whyUseIt: 'Accesses the subconscious mind, enhances vivid visualization, and relieves emotional blockages.',
    defaultBpm: 50,
    bpmMin: 40,
    bpmMax: 60,
    recommendedSounds: ['singing_bowl', 'shamanic_drum', 'wood_chimes'],
    goals: [
      { id: 'deep_meditation', label: 'Deep Meditation & Insight', description: 'Profound visualization & clarity' },
      { id: 'sleep_prep', label: 'Bedtime Sleep Prep', description: 'Smooth transition to deep rest' },
    ],
    isSafetyCapped: false,
  },
  delta: {
    state: 'delta',
    name: 'Delta',
    symbol: 'δ',
    frequencyRange: '0.5–4 Hz',
    carrierBeatHz: 2,
    baseCarrierHz: 528,
    targets: 'Deep sleep, physical healing',
    whyUseIt: 'Triggers cellular repair, complete mental detachment, and restorative overnight rest.',
    defaultBpm: 24,
    bpmMin: 20,
    bpmMax: 40,
    recommendedSounds: ['gong_ambient', 'singing_bowl', 'shamanic_drum'],
    goals: [
      { id: 'deep_sleep', label: 'Insomnia Relief & Deep Sleep', description: 'Complete restorative delta sleep' },
      { id: 'physical_recovery', label: 'Physical Exhaustion Recovery', description: 'Cellular repair & detachment' },
    ],
    isSafetyCapped: false,
  },
};

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentBpm: number = 60;
  private currentProfile: SoundProfile = 'wristwatch';
  private timerId: number | null = null;
  private nextTickTime: number = 0;
  private onTickCallback: (() => void) | null = null;

  // Carrier wave nodes
  private carrierGainNode: GainNode | null = null;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private carrierEnabled: boolean = true;
  private carrierVolume: number = 0.18; // Subtle background level

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Start or update the Binaural Brainwave Carrier Wave
   */
  public startCarrier(state: BrainwaveState): void {
    if (!this.carrierEnabled) {
      this.stopCarrier();
      return;
    }

    try {
      const ctx = this.getContext();
      const config = COGNITIVE_MATRIX[state];
      const baseFreq = config.baseCarrierHz;
      const beatFreq = config.carrierBeatHz;

      // Clean up previous carrier nodes if any
      this.stopCarrier();

      // Master carrier gain
      this.carrierGainNode = ctx.createGain();
      this.carrierGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.carrierGainNode.gain.exponentialRampToValueAtTime(this.carrierVolume, ctx.currentTime + 1.2);
      this.carrierGainNode.connect(ctx.destination);

      // Left Ear: Base Frequency
      this.leftOsc = ctx.createOscillator();
      const leftPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      this.leftOsc.type = 'sine';
      this.leftOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      if (leftPanner) {
        leftPanner.pan.setValueAtTime(-0.85, ctx.currentTime);
        this.leftOsc.connect(leftPanner);
        leftPanner.connect(this.carrierGainNode);
      } else {
        this.leftOsc.connect(this.carrierGainNode);
      }
      this.leftOsc.start();

      // Right Ear: Base Frequency + Delta Beat
      this.rightOsc = ctx.createOscillator();
      const rightPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      this.rightOsc.type = 'sine';
      this.rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);

      if (rightPanner) {
        rightPanner.pan.setValueAtTime(0.85, ctx.currentTime);
        this.rightOsc.connect(rightPanner);
        rightPanner.connect(this.carrierGainNode);
      } else {
        this.rightOsc.connect(this.carrierGainNode);
      }
      this.rightOsc.start();
    } catch (e) {
      console.error('Failed to start binaural carrier:', e);
    }
  }

  public stopCarrier(): void {
    if (this.carrierGainNode && this.ctx) {
      try {
        this.carrierGainNode.gain.setValueAtTime(this.carrierGainNode.gain.value, this.ctx.currentTime);
        this.carrierGainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      } catch (e) {
        // Fallback
      }
    }

    setTimeout(() => {
      if (this.leftOsc) {
        try {
          this.leftOsc.stop();
          this.leftOsc.disconnect();
        } catch (e) {
          // ignore
        }
        this.leftOsc = null;
      }
      if (this.rightOsc) {
        try {
          this.rightOsc.stop();
          this.rightOsc.disconnect();
        } catch (e) {
          // ignore
        }
        this.rightOsc = null;
      }
      this.carrierGainNode = null;
    }, 350);
  }

  public setCarrierEnabled(enabled: boolean, state: BrainwaveState): void {
    this.carrierEnabled = enabled;
    if (this.isRunning) {
      if (enabled) {
        this.startCarrier(state);
      } else {
        this.stopCarrier();
      }
    }
  }

  public setCarrierVolume(vol: number): void {
    this.carrierVolume = vol;
    if (this.carrierGainNode && this.ctx) {
      this.carrierGainNode.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Synthesize a single tick sound with distinct acoustic textures
   */
  public playTick(profile: SoundProfile = this.currentProfile, time?: number): void {
    try {
      const ctx = this.getContext();
      const startTime = time !== undefined ? time : ctx.currentTime;

      switch (profile) {
        case 'metronome': {
          // Fast Metronome: Sharp wooden/mechanical impulse with high attack
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1450, startTime);
          osc.frequency.exponentialRampToValueAtTime(220, startTime + 0.025);

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1800, startTime);
          filter.Q.setValueAtTime(5, startTime);

          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.03);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.035);
          break;
        }

        case 'temple_blocks': {
          // Rapid Wooden Temple Blocks: Hollow, bright organic percussive strike
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1120, startTime);
          osc.frequency.exponentialRampToValueAtTime(580, startTime + 0.045);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(950, startTime);
          filter.Q.setValueAtTime(9, startTime);

          gain.gain.setValueAtTime(0.45, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.05);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.055);
          break;
        }

        case 'wristwatch': {
          // Wristwatch: Sharp metallic escapement click
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
          break;
        }

        case 'wood_chimes': {
          // Steady Wood Chimes / Zen Woodblock: Mellow organic resonance
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, startTime);
          osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.07);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, startTime);
          filter.Q.setValueAtTime(4, startTime);

          gain.gain.setValueAtTime(0.45, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.085);
          break;
        }

        case 'hand_drums': {
          // Gentle Rhythmic Hand Drums: Warm, mid-low acoustic hand drum strike
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, startTime);
          osc.frequency.exponentialRampToValueAtTime(85, startTime + 0.09);

          gain.gain.setValueAtTime(0.5, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.1);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.11);
          break;
        }

        case 'singing_bowl': {
          // Slow Resonant Singing Bowl: Deep harmonic brass vibration
          const freqs = [320, 640, 960];
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, startTime);
            osc.frequency.exponentialRampToValueAtTime(f * 0.99, startTime + 0.8);

            const initialGain = (0.35 / (idx + 1));
            gain.gain.setValueAtTime(initialGain, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.9);
          });
          break;
        }

        case 'shamanic_drum': {
          // Distant Heavy Shamanic Drumbeat: Deep, low-frequency frame drum pulse
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, startTime);
          osc.frequency.exponentialRampToValueAtTime(45, startTime + 0.18);

          gain.gain.setValueAtTime(0.65, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.24);
          break;
        }

        case 'gong_ambient': {
          // Ambient 528Hz Solfeggio Gong Strike
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(528, startTime);
          osc.frequency.exponentialRampToValueAtTime(524, startTime + 1.2);

          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 1.35);
          break;
        }
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
   * Start seamless continuous loop with optional carrier wave
   */
  public startLoop(
    bpm: number,
    profile: SoundProfile,
    state: BrainwaveState = 'alpha',
    onTick?: () => void
  ): void {
    this.stopLoop();
    this.currentBpm = bpm;
    this.currentProfile = profile;
    this.onTickCallback = onTick || null;
    this.isRunning = true;

    // Start background binaural carrier wave
    this.startCarrier(state);

    const ctx = this.getContext();
    this.nextTickTime = ctx.currentTime + 0.05;
    this.scheduleTicks();
  }

  public setBpm(bpm: number): void {
    this.currentBpm = bpm;
  }

  public setProfile(profile: SoundProfile): void {
    this.currentProfile = profile;
  }

  public stopLoop(): void {
    this.isRunning = false;
    this.stopCarrier();
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

export const focusAudioEngine = new FocusAudioEngine();
