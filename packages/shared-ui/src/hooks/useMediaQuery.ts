import { useEffect, useState } from 'react';

/**
 * Hook wrapper for `window.matchMedia`. Use this to detect screen size
 * if your component needs between different sizes.
 * @param query CSS media query to use for breakpoint
 * @returns true if the media query is matched, false if not
 */
export const useMediaQuery = (query: string): boolean => {
  const [match, setMatch] = useState<boolean>(false);

  const canMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';

  useEffect(() => {
    let mounted = true;

    if (!canMatchMedia) {
      return () => {
        mounted = false;
      };
    }

    const mediaQuery = window.matchMedia(query);

    const onChange = () => {
      if (!mounted) return;
      setMatch(Boolean(mediaQuery.matches));
    };

    mediaQuery.addEventListener('change', onChange);
    setMatch(mediaQuery.matches);

    return () => {
      mounted = false;
      mediaQuery.removeEventListener('change', onChange);
    };
  }, [query]);

  if (!canMatchMedia) {
    return false;
  }

  return match;
};

/**
 * Hook wrapper for `useMediaQuery` with a pre-defined CSS media query
 * provided for a mobile breakpoint. Use this to detect mobile screen sizes.
 * @returns true if the media query is matched, false if not
 */
export const useMobileMediaQuery = () => useMediaQuery('(max-width: 500px)');
