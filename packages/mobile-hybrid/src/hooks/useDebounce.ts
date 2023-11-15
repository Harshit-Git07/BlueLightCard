import { useCallback, useState } from 'react';

// returns function to trigger debounce effect
export default function useDebounce(fn: () => void, wait: number) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>();

  const throttle = useCallback(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        fn();
        setTimeoutId(null);
      }, wait),
    );
  }, [fn, setTimeoutId, timeoutId, wait]);

  return throttle;
}
