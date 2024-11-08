import { FC } from 'react';
import { PortableText } from '@portabletext/react';
import { SharedProps, PlatformVariant } from '../../types';
import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';
import Heading from '../Heading';

export type Props = SharedProps & {
  CompanyDescription: any;
  CompanyName?: string;
};

const CompanyAbout: FC<Props> = ({ CompanyName, CompanyDescription, platform }) => {
  const dynHeadingCss = useCSSConditional({
    '!text-typography-body-semibold !leading-typography-body-semibold !font-typography-body-semibold-weight !font-typography-body-semibold !tracking-typography-body-semibold':
      platform === PlatformVariant.MobileHybrid,
    '!text-typography-display-small !leading-typography-display-small !font-typography-display-small-weight !font-typography-display-small !tracking-typography-display-small':
      platform === PlatformVariant.Web,
  });

  const dynDescriptionCss = useCSSConditional({
    '!text-typography-body-light leading-typography-body-light !font-typography-body-light !font-typography-body-light-weight !tracking-typography-body-light':
      platform === PlatformVariant.MobileHybrid,
    '!text-typography-body !leading-typography-body !font-typography-body !font-typography-body-weight !tracking-typography-body':
      platform === PlatformVariant.Web,
  });

  const cssHeading = useCSSMerge(
    `!text-colour-onSurface dark:!text-colour-onSurface-dark`,
    dynHeadingCss,
  );
  const cssDescription = useCSSMerge(
    `text-colour-onSurface dark:text-colour-onSurface-dark`,
    dynDescriptionCss,
  );

  return (
    <div>
      {CompanyName && (
        <Heading headingLevel={'h1'} className={cssHeading}>
          {CompanyName}
        </Heading>
      )}

      <div className={cssDescription}>
        <PortableText value={CompanyDescription.content} />
      </div>
    </div>
  );
};

export default CompanyAbout;
