import React, { useState, useEffect, useCallback } from 'react';
import './Timer.css';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ seconds, isRunning, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  // Reset timer when seconds prop changes
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);
  
  // Memoize the interval callback function to prevent unnecessary rerenders
  const timerCallback = useCallback(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        onTimerEnd();
        return 0;
      }
      return prevTime - 1;
    });
  }, [onTimerEnd]);
  
  // Handle the countdown
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(timerCallback, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeLeft, timerCallback]);
  
  // Calculate progress percentage
  const progressPercentage = (timeLeft / seconds) * 100;
  
  // Format time display
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Determine styling based on time left
  const getTimerClass = () => {
    if (timeLeft <= 5) return 'danger';
    if (timeLeft <= 10) return 'warning';
    return '';
  };
  
  return (
    <div className="timer-container">
      <div className="timer-bar">
        <div 
          className={`timer-progress ${getTimerClass()}`}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="timer-text" aria-live="polite">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default Timer;
