import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Moon,
  ShieldAlert,
  Sliders,
  Radio,
  Volume2,
  Infinity as InfinityIcon,
  Headphones,
} from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import {
  focusAudioEngine,
  BrainwaveState,
  SoundProfile,
  COGNITIVE_MATRIX,
} from '../utils/focusAudioEngine';

// Duration options for Beta & Alpha (Max 30m to prevent mental overstimulation)
const SHORT_DURATIONS = [
  { value: 1 * 60, label: '1m' },
  { value: 3 * 60, label: '3m' },
  { value: 5 * 60, label: '5m' },
  { value: 10 * 60, label: '10m' },
  { value: 15 * 60, label: '15m' },
  { value: 20 * 60, label: '20m' },
  { value: 25 * 60, label: '25m' },
  { value: 30 * 60, label: '30m' },
];

// Extended duration options for Theta & Delta (Deep sleep & recovery)
const EXTENDED_DURATIONS = [
  { value: 15 * 60, label: '15m' },
  { value: 30 * 60, label: '30m' },
  { value: 45 * 60, label: '45m' },
  { value: 60 * 60, label: '1h' },
  { value: 90 * 60, label: '1.5h' },
  { value: 120 * 60, label: '2h' },
  { value: 240 * 60, label: '4h' },
  { value: 480 * 60, label: '8h' },
  { value: -1, label: 'Continuous' }, // -1 denotes infinite continuous play
];

const SOUND_INFO: Record<SoundProfile, { label: string; description: string }> = {
  metronome: { label: 'Fast Metronome', description: 'Sharp wooden mechanical beat' },
  temple_blocks: { label: 'Temple Blocks', description: 'Rapid, hollow wood resonance' },
  wristwatch: { label: 'Wristwatch Clock', description: 'Crisp metallic second click' },
  wood_chimes: { label: 'Wood Chimes', description: 'Steady organic chime tone' },
  hand_drums: { label: 'Hand Drums', description: 'Warm acoustic tribal percussive thud' },
  singing_bowl: { label: 'Singing Bowl', description: 'Deep Tibetan brass harmonic strike' },
  shamanic_drum: { label: 'Shamanic Drum', description: 'Distant low-frequency frame drum' },
  gong_ambient: { label: '528Hz Solfeggio Gong', description: 'Deep ambient tone & spaced strikes' },
};

const STATE_ICONS: Record<BrainwaveState, React.ComponentType<{ className?: string }>> = {
  beta: Zap,
  alpha: Activity,
  theta: Sparkles,
  delta: Moon,
};

const STATE_COLORS: Record<
  BrainwaveState,
  {
    border: string;
    bg: string;
    glow: string;
    text: string;
    badge: string;
    accent: string;
  }
> = {
  beta: {
    border: 'border-amber-400',
    bg: 'bg-amber-500/20',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    text: 'text-amber-300',
    badge: 'bg-amber-500/25 border-amber-400/60 text-amber-300',
    accent: 'accent-amber-500',
  },
  alpha: {
    border: 'border-orange-400',
    bg: 'bg-orange-500/20',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    text: 'text-orange-300',
    badge: 'bg-orange-500/25 border-orange-400/60 text-orange-300',
    accent: 'accent-orange-500',
  },
  theta: {
    border: 'border-indigo-400',
    bg: 'bg-indigo-500/20',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    text: 'text-indigo-300',
    badge: 'bg-indigo-500/25 border-indigo-400/60 text-indigo-300',
    accent: 'accent-indigo-500',
  },
  delta: {
    border: 'border-cyan-400',
    bg: 'bg-cyan-500/20',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/25 border-cyan-400/60 text-cyan-300',
    accent: 'accent-cyan-500',
  },
};

export const FocusTimerView: React.FC = () => {
  const { setCurrentView } = useEntries();

  // Cognitive State Configuration
  const [brainwaveState, setBrainwaveState] = useState<BrainwaveState>('alpha');
  const activeConfig = COGNITIVE_MATRIX[brainwaveState];
  const activeColors = STATE_COLORS[brainwaveState];

  // Parameters
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [bpm, setBpm] = useState<number>(activeConfig.defaultBpm);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(activeConfig.recommendedSounds[0]);
  const [carrierEnabled, setCarrierEnabled] = useState<boolean>(true);
  const [carrierVolume, setCarrierVolume] = useState<number>(0.2);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [tickPulse, setTickPulse] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Accurate timestamp refs
  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(25 * 60);
  const pulseTimeoutRef = useRef<number | null>(null);

  // Switch Brainwave Preset State
  const handleBrainwaveStateChange = (newState: BrainwaveState) => {
    const newConfig = COGNITIVE_MATRIX[newState];
    setBrainwaveState(newState);
    setBpm(newConfig.defaultBpm);
    setSoundProfile(newConfig.recommendedSounds[0]);

    // Safety duration check
    if (newConfig.isSafetyCapped) {
      if (totalSeconds > 30 * 60 || totalSeconds === -1) {
        setTotalSeconds(25 * 60);
        if (!isRunning) {
          setRemainingSeconds(25 * 60);
          pausedRemainingRef.current = 25 * 60;
        }
      }
    }

    if (isRunning) {
      focusAudioEngine.startLoop(newConfig.defaultBpm, newConfig.recommendedSounds[0], newState, handleAudioTick);
    }
  };

  // Switch Goal Preset
  const handleGoalPresetSelect = (state: BrainwaveState) => {
    handleBrainwaveStateChange(state);
  };

  // Audio Tick Pulse
  const handleAudioTick = () => {
    setTickPulse(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = window.setTimeout(() => {
      setTickPulse(false);
    }, 120);
  };

  // Start / Resume Timer
  const handleStart = () => {
    if (isCompleted) {
      setRemainingSeconds(totalSeconds);
      pausedRemainingRef.current = totalSeconds;
      setIsCompleted(false);
    }

    if (totalSeconds > 0) {
      const durationToRun = remainingSeconds > 0 ? remainingSeconds : totalSeconds;
      endTimeRef.current = Date.now() + durationToRun * 1000;
    } else {
      // Continuous mode
      endTimeRef.current = null;
    }

    setIsRunning(true);
    focusAudioEngine.startLoop(bpm, soundProfile, brainwaveState, handleAudioTick);
  };

  // Pause Timer
  const handlePause = () => {
    setIsRunning(false);
    focusAudioEngine.stopLoop();
    if (endTimeRef.current && totalSeconds > 0) {
      const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      pausedRemainingRef.current = left;
      setRemainingSeconds(left);
    }
  };

  // Reset Timer
  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    focusAudioEngine.stopLoop();
    setRemainingSeconds(totalSeconds);
    pausedRemainingRef.current = totalSeconds;
    endTimeRef.current = null;
  };

  // Duration selection change
  const handleDurationChange = (seconds: number) => {
    setTotalSeconds(seconds);
    if (!isRunning) {
      setRemainingSeconds(seconds);
      pausedRemainingRef.current = seconds;
      setIsCompleted(false);
    }
  };

  // BPM change
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    focusAudioEngine.setBpm(newBpm);
  };

  // Sound Profile change
  const handleProfileChange = (profile: SoundProfile) => {
    setSoundProfile(profile);
    focusAudioEngine.setProfile(profile);
    focusAudioEngine.playTick(profile);
  };

  // Carrier Wave Toggle & Volume
  const handleCarrierToggle = (enabled: boolean) => {
    setCarrierEnabled(enabled);
    focusAudioEngine.setCarrierEnabled(enabled, brainwaveState);
  };

  const handleCarrierVolumeChange = (vol: number) => {
    setCarrierVolume(vol);
    focusAudioEngine.setCarrierVolume(vol);
  };

  // Accurate Countdown Timer effect
  useEffect(() => {
    let intervalId: number | null = null;

    if (isRunning && totalSeconds > 0) {
      intervalId = window.setInterval(() => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const diffMs = endTimeRef.current - now;
        const leftSeconds = Math.max(0, Math.ceil(diffMs / 1000));

        setRemainingSeconds(leftSeconds);

        if (leftSeconds <= 0) {
          setIsRunning(false);
          setIsCompleted(true);
          focusAudioEngine.stopLoop();
          focusAudioEngine.playCompletionGong();
          if (intervalId) clearInterval(intervalId);
        }
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, totalSeconds]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      focusAudioEngine.stopLoop();
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  // Format Time Display (HH:MM:SS or MM:SS)
  const formatTime = (secs: number) => {
    if (secs === -1) return '∞ Continuous';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Progress Ring calculations
  const isContinuous = totalSeconds === -1;
  const progressRatio =
    !isContinuous && totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isContinuous ? 0 : circumference * (1 - progressRatio);

  const durationOptions = activeConfig.isSafetyCapped ? SHORT_DURATIONS : EXTENDED_DURATIONS;

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col px-4 sm:px-6 pb-28 pt-2 overflow-y-auto">
      {/* 1. Top Header with Back Button */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all cursor-pointer"
            title="Back to Home"
          >
            ‹
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Cognitive Audio Entrainment
              </h1>
              <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${activeColors.badge}`}>
                {activeConfig.symbol} {activeConfig.name} ({activeConfig.frequencyRange})
              </span>
            </div>
            <p className="text-xs text-slate-400">Auditory brainwave entrainment & rhythmic attention optimization</p>
          </div>
        </div>
      </div>

      {/* 2. Cognitive State Matrix Cards (Beta, Alpha, Theta, Delta) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 flex-shrink-0">
        {(Object.keys(COGNITIVE_MATRIX) as BrainwaveState[]).map((stateKey) => {
          const cfg = COGNITIVE_MATRIX[stateKey];
          const Icon = STATE_ICONS[stateKey];
          const isSelected = brainwaveState === stateKey;
          const colors = STATE_COLORS[stateKey];

          return (
            <button
              key={stateKey}
              onClick={() => handleBrainwaveStateChange(stateKey)}
              className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? `${colors.bg} ${colors.border} ${colors.glow}`
                  : 'bg-slate-900/60 hover:bg-slate-800/70 border-slate-800/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? colors.text : 'text-slate-400'}`} />
                  {cfg.name} <span className="text-[11px] opacity-75">({cfg.symbol})</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-300 border border-slate-700/50">
                  {cfg.carrierBeatHz}Hz
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-300 line-clamp-1">
                {cfg.targets}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1">
                {cfg.bpmMin}–{cfg.bpmMax} BPM
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Goal Presets Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none flex-shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
          Preset Goals:
        </span>
        {(Object.keys(COGNITIVE_MATRIX) as BrainwaveState[]).flatMap((s) =>
          COGNITIVE_MATRIX[s].goals.map((g) => {
            const isGoalActive = brainwaveState === s;
            return (
              <button
                key={g.id}
                onClick={() => handleGoalPresetSelect(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isGoalActive
                    ? `${STATE_COLORS[s].bg} border ${STATE_COLORS[s].border} ${STATE_COLORS[s].text} font-bold shadow-sm`
                    : 'bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300'
                }`}
                title={g.description}
              >
                {g.label}
              </button>
            );
          })
        )}
      </div>

      {/* 4. Central Countdown Progress Ring & Playback */}
      <div className="flex flex-col items-center justify-center my-auto py-1 flex-shrink-0">
        <div className="relative w-60 h-60 sm:w-68 sm:h-68 flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              tickPulse
                ? `${activeColors.bg} blur-2xl scale-105`
                : isRunning
                ? 'bg-slate-800/30 blur-xl scale-100'
                : 'bg-transparent'
            }`}
          />

          {/* SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="text-slate-800/80 stroke-current"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              className={`${activeColors.text} stroke-current transition-all duration-300`}
              strokeWidth="9"
              strokeLinecap="round"
              fill="transparent"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                filter: isRunning ? 'drop-shadow(0 0 8px currentColor)' : 'none',
              }}
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {isCompleted ? (
              <div className="animate-scale-in flex flex-col items-center gap-1">
                <Sparkles className={`w-8 h-8 ${activeColors.text} animate-bounce`} />
                <span className="text-xl font-serif font-bold text-white">Session Complete</span>
                <span className="text-xs text-slate-300">Cognitive state reset achieved</span>
              </div>
            ) : (
              <>
                <span
                  className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white transition-transform duration-100 ${
                    tickPulse ? `scale-105 ${activeColors.text}` : 'scale-100'
                  }`}
                >
                  {formatTime(remainingSeconds)}
                </span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      tickPulse ? `${activeColors.bg} ring-2 ${activeColors.border}` : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    {bpm} BPM &bull; {activeConfig.name} Entrainment
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 max-w-[180px] truncate">
                  {activeConfig.whyUseIt}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={isRunning ? handlePause : handleStart}
            className={`px-8 py-3.5 rounded-full flex items-center gap-2.5 font-semibold text-base transition-all shadow-float cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : `${activeColors.bg} border ${activeColors.border} ${activeColors.text} hover:scale-105 active:scale-95 shadow-lg`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 stroke-[2.5]" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current stroke-[2.5]" />{' '}
                {remainingSeconds < totalSeconds && !isCompleted && !isContinuous
                  ? 'Resume Session'
                  : 'Start Cognitive Audio'}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5. Configuration Panel (Duration, BPM, Sound Profile, Carrier Wave) */}
      <div className="bg-slate-900/70 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 mt-4 flex flex-col gap-4 flex-shrink-0">
        {/* Total Duration Selector with Smart Safety Notice */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Session Duration
              </label>
              {activeConfig.isSafetyCapped && (
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  <ShieldAlert className="w-3 h-3" /> 30m Safety Cap (Overstimulation Guard)
                </span>
              )}
            </div>
            <span className={`text-xs font-bold ${activeColors.text}`}>
              {totalSeconds === -1 ? 'Continuous Overnight' : `${Math.floor(totalSeconds / 60)} minutes`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {durationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDurationChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  totalSeconds === opt.value
                    ? `${activeColors.bg} border ${activeColors.border} ${activeColors.text} font-bold shadow-sm`
                    : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-slate-300'
                }`}
              >
                {opt.value === -1 ? (
                  <span className="flex items-center gap-1">
                    <InfinityIcon className="w-3 h-3" /> Continuous
                  </span>
                ) : (
                  opt.label
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tick Frequency Control (BPM Slider) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tempo (BPM Cadence)
              </label>
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className={`text-xs font-bold ${activeColors.text}`}>
              {bpm} BPM ({activeConfig.bpmMin}–{activeConfig.bpmMax} Recommended)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">{activeConfig.bpmMin}</span>
            <input
              type="range"
              min={activeConfig.bpmMin}
              max={activeConfig.bpmMax}
              step="1"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              className={`flex-1 ${activeColors.accent} cursor-pointer h-2 bg-slate-800 rounded-lg`}
            />
            <span className="text-[11px] text-slate-400">{activeConfig.bpmMax}</span>
          </div>
        </div>

        {/* Recommended Acoustic Sound Profile Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Recommended Rhythmic Texture ({activeConfig.name})
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {activeConfig.recommendedSounds.map((soundId) => {
              const info = SOUND_INFO[soundId];
              const isSelected = soundProfile === soundId;
              return (
                <button
                  key={soundId}
                  onClick={() => handleProfileChange(soundId)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? `${activeColors.bg} ${activeColors.border} ${activeColors.glow}`
                      : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/50 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isSelected ? activeColors.text : 'text-slate-300'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {info.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 leading-tight mt-0.5">
                      {info.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Binaural Carrier Wave Tone Generator Controls */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Headphones className={`w-4 h-4 ${activeColors.text}`} />
            <div>
              <span className="text-xs font-semibold text-white block">
                Binaural Carrier Wave ({activeConfig.baseCarrierHz}Hz + {activeConfig.carrierBeatHz}Hz Δ)
              </span>
              <span className="text-[11px] text-slate-400">
                Subtle brainwave synchronization tone underneath rhythmic percussion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={carrierEnabled}
                onChange={(e) => handleCarrierToggle(e.target.checked)}
                className={`w-4 h-4 ${activeColors.accent} rounded cursor-pointer`}
              />
              <span>Carrier Tone</span>
            </label>

            {carrierEnabled && (
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 text-slate-400" />
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.02"
                  value={carrierVolume}
                  onChange={(e) => handleCarrierVolumeChange(Number(e.target.value))}
                  className={`w-20 ${activeColors.accent} cursor-pointer h-1.5 bg-slate-800 rounded`}
                  title="Carrier Volume"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
