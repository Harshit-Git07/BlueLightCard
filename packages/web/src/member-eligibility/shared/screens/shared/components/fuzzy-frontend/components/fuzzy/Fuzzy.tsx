import { useFuzzyFrontendListener } from '../fuzzy-frontend-buttons/hooks/UseFuzzyFrontendListener';
import { FC, ReactNode } from 'react';
import { colours } from '@bluelightcard/shared-ui/tailwind/theme';

interface FuzzyProps {
  children: ReactNode;
}

const Fuzzy: FC<FuzzyProps> = ({ children }) => {
  const isFuzzy = useFuzzyFrontendListener();
  if (!isFuzzy) return null;

  return (
    <div className={`absolute bottom-2 left-2 p-2 ${colours.backgroundSurface}`}>{children}</div>
  );
};

export default Fuzzy;
