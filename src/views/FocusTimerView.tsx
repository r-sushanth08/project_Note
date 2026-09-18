import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Watch, Clock, Bell } from 'lucide-react';
import { useEntries } from '../context/EntryContext';
import { focusAudioEngine, SoundProfile } from '../utils/focusAudioEngine';

// Duration options: 1-15m in 1m steps, 20-60m in 5m steps
const DURATION_OPTIONS = [
  ...Array.from({ length: 15 }, (_, i) => ({ value: (i + 1) * 60, label: `${i + 1}m` })),
  ...Array.from({ length: 9 }, (_, i) => ({ value: (20 + i * 5) * 60, label: `${20 + i * 5}m` })),
];

const PROFILES: { id: SoundProfile; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: 'wristwatch',
    label: 'Wristwatch',
    description: 'Crisp metallic escapement click',
    icon: Watch,
  },
  {
    id: 'grandfather',
    label: 'Grandfather Clock',
    description: 'Resonant wood-and-escapement swing',
    icon: Clock,
  },
  {
    id: 'woodblock',
    label: 'Zen Woodblock',
    description: 'Soft, organic percussion tone',
    icon: Bell,
  },
];

export const FocusTimerView: React.FC = () => {
  const { setCurrentView } = useEntries();

  // Configuration state
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60); // Default 25 min
  const [bpm, setBpm] = useState<number>(60); // Default 60 BPM (resting heartbeat)
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('wristwatch');

  // Timer execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [tickPulse, setTickPulse] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Background accurate timestamp tracking refs
  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(25 * 60);
  const pulseTimeoutRef = useRef<number | null>(null);

  // Handle Tick Visual Pulse
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

    const durationToRun = remainingSeconds > 0 ? remainingSeconds : totalSeconds;
    endTimeRef.current = Date.now() + durationToRun * 1000;
    setIsRunning(true);

    focusAudioEngine.startLoop(bpm, soundProfile, handleAudioTick);
  };

  // Pause Timer
  const handlePause = () => {
    setIsRunning(false);
    focusAudioEngine.stopLoop();
    if (endTimeRef.current) {
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
    // Play preview tick
    focusAudioEngine.playTick(profile);
  };

  // Accurate Countdown Timer effect with requestAnimationFrame / setInterval
  useEffect(() => {
    let intervalId: number | null = null;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        if (!endTimeRef.current) return;
        const now = Date.now();
        const diffMs = endTimeRef.current - now;
        const leftSeconds = Math.max(0, Math.ceil(diffMs / 1000));

        setRemainingSeconds(leftSeconds);

        if (leftSeconds <= 0) {
          // Session Completed!
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
  }, [isRunning]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      focusAudioEngine.stopLoop();
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  // Format Time Display (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate SVG Progress Ring parameters
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // BPM descriptive label
  const bpmMoodLabel = useMemo(() => {
    if (bpm <= 50) return 'Deep Hypnotic Pulse';
    if (bpm <= 70) return 'Resting Heartbeat';
    if (bpm <= 90) return 'Steady Flow Pace';
    if (bpm <= 110) return 'Active Focus';
    return 'High-Alert Cadence';
  }, [bpm]);

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col px-4 sm:px-6 pb-28 pt-2 overflow-y-auto">
      {/* 1. Header with Enlarge Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white flex items-center justify-center text-2xl font-bold shadow-lg transition-all"
            title="Back to Home"
          >
            ‹
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Rhythmic Focus
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-300 bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Entrainment
              </span>
            </div>
            <p className="text-xs text-slate-400">Auditory rhythmic entrainment for deep concentration</p>
          </div>
        </div>
      </div>

      {/* 2. Main Visual Center: Circular Progress Ring & Timer Display */}
      <div className="flex flex-col items-center justify-center my-auto py-2 flex-shrink-0">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              tickPulse
                ? 'bg-orange-500/25 blur-2xl scale-105'
                : isRunning
                ? 'bg-orange-500/10 blur-xl scale-100'
                : 'bg-transparent'
            }`}
          />

          {/* SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="text-slate-800/80 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="text-orange-500 stroke-current transition-all duration-300"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                filter: isRunning ? 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.7))' : 'none',
              }}
            />
          </svg>

          {/* Inner Content Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {isCompleted ? (
              <div className="animate-scale-in flex flex-col items-center gap-1">
                <Sparkles className="w-8 h-8 text-orange-400 animate-bounce" />
                <span className="text-xl font-serif font-bold text-orange-300">Session Complete</span>
                <span className="text-xs text-slate-300">Mindful rest achieved</span>
              </div>
            ) : (
              <>
                <span
                  className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white transition-transform duration-100 ${
                    tickPulse ? 'scale-105 text-orange-300' : 'scale-100'
                  }`}
                >
                  {formatTime(remainingSeconds)}
                </span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      tickPulse ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,1)]' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-xs font-medium text-slate-300">
                    {bpm} BPM &bull; {bpmMoodLabel}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Primary Playback Action Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={isRunning ? handlePause : handleStart}
            className={`px-8 py-3.5 rounded-full flex items-center gap-2.5 font-semibold text-base transition-all shadow-float cursor-pointer ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 stroke-[2.5]" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current stroke-[2.5]" />{' '}
                {remainingSeconds < totalSeconds && !isCompleted ? 'Resume Focus' : 'Start Focus'}
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

      {/* 4. Settings Card (Duration, BPM, Sound Profiles) */}
      <div className="bg-slate-900/70 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 mt-4 flex flex-col gap-5 flex-shrink-0">
        {/* Total Duration Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Total Session Duration
            </label>
            <span className="text-xs font-bold text-orange-400">
              {Math.floor(totalSeconds / 60)} minutes
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleDurationChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  totalSeconds === opt.value
                    ? 'bg-orange-500/25 border border-orange-400 text-orange-300 font-bold shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tick Frequency Control (BPM Slider) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tick Frequency (Cadence)
              </label>
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-xs font-bold text-orange-400">{bpm} BPM</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">40</span>
            <input
              type="range"
              min="40"
              max="120"
              step="1"
              value={bpm}
              onChange={(e) => handleBpmChange(Number(e.target.value))}
              className="flex-1 accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[11px] text-slate-400">120</span>
          </div>

          {/* Quick BPM Presets */}
          <div className="grid grid-cols-5 gap-1.5 mt-2.5">
            {[
              { val: 40, label: '40 Hypnotic' },
              { val: 60, label: '60 Heartbeat' },
              { val: 80, label: '80 Steady' },
              { val: 100, label: '100 Active' },
              { val: 120, label: '120 Alert' },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => handleBpmChange(preset.val)}
                className={`py-1 px-1 rounded text-[10px] text-center transition-all truncate cursor-pointer ${
                  bpm === preset.val
                    ? 'bg-orange-500/25 border border-orange-400 text-orange-300 font-bold'
                    : 'bg-slate-800/40 hover:bg-slate-800 border border-slate-700/30 text-slate-400'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Profile Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Acoustic Sound Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PROFILES.map((prof) => {
              const Icon = prof.icon;
              const isSelected = soundProfile === prof.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => handleProfileChange(prof.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-400/80 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                      : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/50 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {prof.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 leading-tight mt-0.5">
                      {prof.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
