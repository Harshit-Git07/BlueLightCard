import { useEffect, useState } from 'react';

const LIGHT_MODE = 'LIGHT';
const DARK_MODE = 'dark';

const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onSelectMode = (mode: string) => {
    setIsDarkMode(mode === DARK_MODE ? true : false);
  };

  useEffect(() => {
    const prefersDarkColorScheme = `(prefers-color-scheme: ${DARK_MODE})`;

    window
      .matchMedia(prefersDarkColorScheme)
      .addEventListener('change', (e) => onSelectMode(e.matches ? DARK_MODE : LIGHT_MODE));

    onSelectMode(window.matchMedia(prefersDarkColorScheme).matches ? DARK_MODE : LIGHT_MODE);

    return () => {
      window.matchMedia(prefersDarkColorScheme).removeEventListener('change', () => {});
    };
  }, []);

  return isDarkMode;
};

export default useIsDarkMode;
