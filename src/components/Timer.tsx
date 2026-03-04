import { useState, useEffect, useRef } from "react";

interface TimerProps {
  isRunning: boolean;
  isPaused: boolean;
  onTimeUpdate: (seconds: number) => void;
}

export function Timer({ isRunning, isPaused, onTimeUpdate }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (!isRunning && !isPaused) {
      setSeconds(0);
    }
  }, [isRunning, isPaused]);

  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(seconds);

  return (
    <div className="flex items-center justify-center gap-2 text-8xl font-mono text-white">
      <span>{time.hours}</span>
      <span className="text-gray-500">:</span>
      <span>{time.minutes}</span>
      <span className="text-gray-500">:</span>
      <span>{time.seconds}</span>
    </div>
  );
}
