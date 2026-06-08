import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import useAppStore from '../store';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const CIRCLE_RADIUS = 100;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const SVG_SIZE = 240;
const SVG_CENTER = SVG_SIZE / 2;
const SVG_VIEWBOX = `0 0 ${SVG_SIZE} ${SVG_SIZE}`;

const PomodoroTimer = () => {
  const selectedTaskId = useAppStore((s) => s.selectedTaskId);
  const selectedTask = useAppStore((s) => s.tasks.find((t) => t.id === s.selectedTaskId));
  const pomodoroDuration = useAppStore((s) => s.settings.pomodoroDuration);
  const shortBreakDuration = useAppStore((s) => s.settings.shortBreakDuration);
  const longBreakDuration = useAppStore((s) => s.settings.longBreakDuration);
  const addPomodoroSession = useAppStore((s) => s.addPomodoroSession);

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(pomodoroDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getTotalTime = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case 'focus':
          return pomodoroDuration;
        case 'shortBreak':
          return shortBreakDuration;
        case 'longBreak':
          return longBreakDuration;
      }
    },
    [pomodoroDuration, shortBreakDuration, longBreakDuration]
  );

  const totalTime = getTotalTime(mode);
  const progress = Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100));
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;

  const ensureAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch {
      return null;
    }
  }, []);

  const playNotification = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    try {
      const playTone = (frequency: number, startTime: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      };

      playTone(800, ctx.currentTime);
      playTone(1000, ctx.currentTime + 0.2);
      playTone(1200, ctx.currentTime + 0.4);
    } catch {
      console.log('Audio notification not available');
    }
  }, [ensureAudioContext]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus' && selectedTaskId) {
        addPomodoroSession(selectedTaskId, pomodoroDuration);
      }
      playNotification();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, selectedTaskId, pomodoroDuration, addPomodoroSession, playNotification]);

  useEffect(() => {
    setMode('focus');
    setTimeLeft(pomodoroDuration);
    setIsRunning(false);
  }, [selectedTaskId, pomodoroDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!selectedTaskId) return;
    ensureAudioContext();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getTotalTime(newMode));
    setIsRunning(false);
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      switchMode('shortBreak');
    } else {
      switchMode('focus');
    }
  };

  const getModeLabel = (m: TimerMode) => {
    switch (m) {
      case 'focus':
        return '专注时间';
      case 'shortBreak':
        return '短休息';
      case 'longBreak':
        return '长休息';
    }
  };

  const getModeColor = (m: TimerMode) => {
    switch (m) {
      case 'focus':
        return '#ef4444';
      case 'shortBreak':
        return '#22c55e';
      case 'longBreak':
        return '#3b82f6';
    }
  };

  if (!selectedTask) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🍅</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          选择一个任务开始专注
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          点击左侧任务列表中的任务来开始番茄钟
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {selectedTask.title}
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          <span>已完成</span>
          <span className="text-red-500 font-bold">{selectedTask.completedPomodoros}</span>
          <span>/</span>
          <span>{selectedTask.estimatedPomodoros}</span>
          <span>个番茄</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${
            mode === 'focus'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          专注
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${
            mode === 'shortBreak'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          短休息
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${
            mode === 'longBreak'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          长休息
        </button>
      </div>

      <div className="relative mb-6 sm:mb-8">
        <svg viewBox={SVG_VIEWBOX} className="pomodoro-circle w-60 h-60 sm:w-72 sm:h-72">
          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={CIRCLE_RADIUS}
            fill="none"
            strokeWidth="10"
            className="pomodoro-circle-bg"
          />
          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={CIRCLE_RADIUS}
            fill="none"
            stroke={getModeColor(mode)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            className="pomodoro-circle-progress"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white">
            {formatTime(timeLeft)}
          </span>
          <span className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {getModeLabel(mode)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={toggleTimer}
          className={`p-4 sm:p-5 rounded-full transition-colors ${
            mode === 'focus'
              ? 'bg-red-500 hover:bg-red-600'
              : mode === 'shortBreak'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isRunning ? <Pause className="w-7 h-7 sm:w-8 sm:h-8" /> : <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />}
        </button>
        <button
          onClick={skipTimer}
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
