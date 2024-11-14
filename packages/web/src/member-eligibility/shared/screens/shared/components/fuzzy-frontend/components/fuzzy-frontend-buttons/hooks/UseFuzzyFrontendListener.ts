import { useCallback, useEffect, useState } from 'react';

export function useFuzzyFrontendListener(): boolean {
  const [showFuzzyFrontend, setShowFuzzyFrontend] = useState(false);

  const listener = useCallback(
    (event: KeyboardEvent): void => {
      if (!correctKeyIsHeld(event) || !correctKeyIsPressed(event)) return;

      setShowFuzzyFrontend(!showFuzzyFrontend);
    },
    [showFuzzyFrontend]
  );

  useEffect(() => {
    addEventListener('keydown', listener);

    return () => {
      removeEventListener('keydown', listener);
    };
  });

  return showFuzzyFrontend;
}

function correctKeyIsHeld(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey;
}

function correctKeyIsPressed(event: KeyboardEvent): boolean {
  return event.key === '.';
}
