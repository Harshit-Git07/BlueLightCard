import { FC } from 'react';
import { SharedProps, PlatformVariant } from '../../types';
import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';
import Heading from '../Heading';

export type Props = SharedProps & {
  CompanyDescription: string;
  CompanyName?: string;
};

const CompanyAbout: FC<Props> = ({ CompanyName, CompanyDescription, platform }) => {
  const dynHeadingCss = useCSSConditional({
    '!text-base !leading-5 font-normal': platform === PlatformVariant.Mobile,
    '!text-5xl !leading-[56px] font-bold': platform === PlatformVariant.Desktop,
  });

  const dynDescriptionCss = useCSSConditional({
    '!text-sm leading-5': platform === PlatformVariant.Mobile,
    '!text-base leading-6': platform === PlatformVariant.Desktop,
  });

  const cssHeading = useCSSMerge(`!text-black`, dynHeadingCss);
  const cssDescription = useCSSMerge(
    `text-[#1c1d22] font-['MuseoSans'] font-light`,
    dynDescriptionCss,
  );

  return (
    <div>
      <Heading headingLevel={'h1'} className={cssHeading}>
        {CompanyName}
      </Heading>

      <p className={cssDescription}>{CompanyDescription}</p>
    </div>
  );
};

export default CompanyAbout;
