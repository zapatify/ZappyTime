import { Play, Pause, Square } from "lucide-react";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onStop,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {!isRunning || isPaused ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Play className="size-5" />
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Pause className="size-5" />
          Pause
        </button>
      )}
      <button
        onClick={onStop}
        disabled={!isRunning && !isPaused}
        className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Square className="size-5" />
        Stop
      </button>
    </div>
  );
}
