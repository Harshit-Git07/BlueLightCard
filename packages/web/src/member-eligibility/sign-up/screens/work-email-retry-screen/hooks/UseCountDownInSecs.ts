import { useEffect, useState, useCallback } from 'react';

export function useCountDownInSeconds(initialCountDownInSecs: number): {
  formattedTime: string;
  resetCountDown: () => void;
  countDownFinished: boolean;
  restartTimer: () => void;
} {
  const [countDownInSecs, setCountDownInSecs] = useState(initialCountDownInSecs);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountDownInSecs((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countDownInSecs]);

  const resetCountDown = useCallback(() => {
    setCountDownInSecs(initialCountDownInSecs);
  }, [initialCountDownInSecs]);

  const restartTimer = useCallback(() => {
    resetCountDown();
  }, [resetCountDown]);

  const minutes = Math.floor(countDownInSecs / 60);
  const seconds = countDownInSecs % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const countDownFinished = countDownInSecs === 0;

  return {
    formattedTime,
    resetCountDown,
    countDownFinished,
    restartTimer,
  };
}
