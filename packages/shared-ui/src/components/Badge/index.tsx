import { FC } from 'react';
import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';
import { PlatformVariant, SharedProps } from '../../types';

export type BgColorString = `bg-${string}`;

export type Props = SharedProps & {
  label: string;
  color: BgColorString;
  size: 'small' | 'large';
};

const Badge: FC<Props> = ({ label, color, size, platform }) => {
  const dynCss = useCSSConditional({
    'desktop:top-2 desktop:left-2': platform === PlatformVariant.Desktop,
  });

  /* 
    Tailwind is purging the background color with arbitrary value and rounded corners of the Badge component on web package.
    Since these classes do not exist in the web package, the classes are not rendering as expected.

    We need to use inline styling or create our own classes for arbitrary values 
    that don't exist in the other packages.

    i.e. font-['MuseoSans'] works, because we have this class in the web package already in use.
  */
  // Custom style classes for tailwind purged classes on web or mobile-hybrid
  const customStyleClasses = 'badge-rounded-corners';

  // Dynamic class for background color must be inline styled
  const backgroundColor = color.includes('bg-') ? color.replace('bg-[', '').replace(']', '') : '';

  /*----- END of tailwind purged classes handling -----*/

  const commonCss = `w-fit flex items-center justify-center font-semibold font-['MuseoSans'] text-[#202125] ${customStyleClasses}`;

  const largeCss = useCSSMerge('absolute top-0 left-0 px-6 py-2 text-base', commonCss, dynCss);
  const smallCss = useCSSMerge('px-2 py-0.5 text-xs', commonCss);

  return (
    <div className={`${size === 'large' ? largeCss : smallCss}`} style={{ backgroundColor }}>
      {label}
    </div>
  );
};

export default Badge;
