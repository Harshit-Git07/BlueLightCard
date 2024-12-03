import React, { FC, useMemo } from 'react';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';

interface Props {
  className?: string;
  title: InterstitialScreenTitleProps;
}

export interface InterstitialScreenTitleProps {
  start: string;
  brand: string;
  end: string;
}

export const InterstitialScreenTitle: FC<Props> = ({ className = '', title }) => {
  const isMobile = useMobileMediaQuery();

  const titleStyles = useMemo(() => {
    // We are manually overriding the line-height here as the token seems to be broken
    const font = isMobile ? `${fonts.headline} !leading-[40px]` : fonts.displaySmallText;

    return `${className} ${font} text-center text-wrap`;
  }, [className, isMobile]);

  return (
    <div className={titleStyles}>
      {title.start}{' '}
      <span className="bg-gradient-to-b from-colour-secondary-gradient-bright-fixed to-colour-secondary-gradient-centre-fixed bg-clip-text text-transparent">
        {title.brand}{' '}
      </span>
      {title.end}
    </div>
  );
};
