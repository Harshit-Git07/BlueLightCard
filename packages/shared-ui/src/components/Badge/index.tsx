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
    'desktop:top-2 desktop:left-2': platform === PlatformVariant.Web,
  });
  const commonCss = `w-fit rounded-tl-lg rounded-br-lg flex items-center justify-center font-badge-large-label-font text-badge-label-colour-light dark:text-badge-label-colour-dark`;

  const largeCss = useCSSMerge(
    'absolute top-0 left-0 mobile:px-3 mobile:py-1 laptop:px-6 laptop:py-2 mobile:text-badge-small-label-font laptop:text-badge-large-label-font mobile:font-badge-small-label-font-weight mobile:tracking-badge-small-label-font mobile:leading-badge-small-label-font laptop:font-badge-large-label-font-weight laptop:tracking-badge-large-label-font laptop:leading-badge-large-label-font',
    commonCss,
    dynCss,
  );
  const smallCss = useCSSMerge(
    'px-2 py-0.5 text-badge-small-label-font font-badge-small-label-font-weight tracking-badge-small-label-font leading-badge-small-label-font',
    commonCss,
  );

  return (
    <div
      className={`${color.includes('bg-') ? color : ''} ${size === 'large' ? largeCss : smallCss}`}
    >
      {label}
    </div>
  );
};

export default Badge;
