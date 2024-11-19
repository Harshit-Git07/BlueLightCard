import React, { FC, useMemo } from 'react';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';

interface Props {
  className?: string;
  numberOfStepsAsWord: string;
  status: 'start' | 'continue';
}

export const InterstitialSubTitle: FC<Props> = ({
  className = '',
  numberOfStepsAsWord,
  status,
}) => {
  const isMobile = useMobileMediaQuery();

  const subtitleStyles = useMemo(() => {
    const font = isMobile ? fonts.titleMedium : fonts.titleLarge;

    return `${className} ${font} text-center mt-4 mb-6 text-nowrap`;
  }, [className, isMobile]);

  return (
    <div className={`${subtitleStyles} mt-[-8px]`}>
      You have {numberOfStepsAsWord} steps to complete
      <br />
      before you can {status} saving
    </div>
  );
};
