import React, { FC, useMemo } from 'react';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';

interface Props {
  className?: string;
  title: InterstitialScreenTitleProps;
}

export interface InterstitialScreenTitleProps {
  part1: string;
  part2: string;
  part3: string;
  lineBreakBeforeBrand?: boolean;
}

export const InterstitialScreenTitle: FC<Props> = ({ className = '', title }) => {
  const isMobile = useMobileMediaQuery();

  const titleStyles = useMemo(() => {
    const font = isMobile ? fonts.headline : fonts.displaySmallText;

    return `${className} ${font} text-center text-wrap md:text-nowrap`;
  }, [className, isMobile]);

  return (
    <div className={titleStyles}>
      {title.part1}

      {title.lineBreakBeforeBrand && <br />}

      <span className="bg-gradient-to-b from-colour-secondary-gradient-bright-fixed to-colour-secondary-gradient-centre-fixed bg-clip-text text-transparent">
        {title.part2}
      </span>

      {title.part3}
    </div>
  );
};
