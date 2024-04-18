import { SharedProps, PlatformVariant } from '../../types';
import { FC, PropsWithChildren } from 'react';
import MobileDynamicSheet from './components/MobileDynamicSheet';
import DesktopDynamicSheet from './components/DesktopDynamicSheet';
import { useCSSMerge, useCSSConditional } from '../../hooks/useCSS';

export type Props = SharedProps &
  PropsWithChildren & {
    showCloseButton?: boolean;
    containerClassName?: string;
    height?: string;
  };

const DynamicSheet: FC<Props> = ({ platform = PlatformVariant.Mobile, ...props }) => {
  const dynCss = useCSSConditional({
    'w-full h-full': platform === PlatformVariant.Mobile,
  });
  const css = useCSSMerge('fixed top-0 left-0 z-50', dynCss);

  return (
    <div className={css}>
      {platform === PlatformVariant.Mobile ? (
        <MobileDynamicSheet {...props} />
      ) : (
        <DesktopDynamicSheet {...props} />
      )}
    </div>
  );
};

export default DynamicSheet;
