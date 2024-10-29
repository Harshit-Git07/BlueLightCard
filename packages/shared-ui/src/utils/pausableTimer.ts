export interface PausableTimer {
  pause: () => number;
  resume: () => number;
  getRemaining: () => number;
  getTimerId: () => ReturnType<typeof setTimeout> | undefined;
  start: number;
}

export const createTimer = (callback: () => void, delay: number): PausableTimer => {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let start: number = Date.now();
  let remain = delay;

  const pause = () => {
    clearTimeout(timerId);
    timerId = undefined;
    remain -= Date.now() - start;
    return remain;
  };

  const resume = () => {
    if (timerId) return getRemaining();

    start = Date.now();
    timerId = setTimeout(() => {
      timerId = undefined;
      callback();
    }, remain);
    return remain;
  };

  const getRemaining = () => {
    return timerId ? start + remain - Date.now() : remain;
  };

  const getTimerId = () => timerId;

  resume();

  return { pause, resume, getTimerId, getRemaining, start };
};
