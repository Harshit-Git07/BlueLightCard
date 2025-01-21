import { useEffect, useRef } from 'react';

export const useClickAway = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('mouseup', handleClickAway);
    document.addEventListener('touchend', handleClickAway);
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('mouseup', handleClickAway);
      document.removeEventListener('touchend', handleClickAway);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [callback]);

  return ref;
};
