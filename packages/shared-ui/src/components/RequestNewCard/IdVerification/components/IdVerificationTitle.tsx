import { colours, fonts } from '../../../../tailwind/theme';
import { FC, ReactNode } from 'react';
import { conditionalStrings } from '../../../../utils/conditionalStrings';

interface IdVerificationTitleProps {
  hasTopPadding?: boolean;
  children: ReactNode;
}

const IdVerificationTitle: FC<IdVerificationTitleProps> = ({ children, hasTopPadding = false }) => {
  const classes = conditionalStrings({
    [`${fonts.bodySmallSemiBold} ${colours.textOnSurface} uppercase pb-1`]: true,
    'pt-[32px]': hasTopPadding,
  });

  return <h3 className={classes}>{children}</h3>;
};

export default IdVerificationTitle;
