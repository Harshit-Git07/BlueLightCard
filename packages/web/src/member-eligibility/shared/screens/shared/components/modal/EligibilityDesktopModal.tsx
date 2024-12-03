import React, { FC, PropsWithChildren } from 'react';
import { useMedia } from 'react-use';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';
import Image from 'next/image';

export interface Props extends PropsWithChildren {
  className?: string;
  imagePath: string;
  'data-testid'?: string;
}

export const EligibilityDesktopModal: FC<Props> = ({
  className = '',
  imagePath,
  children,
  ...props
}) => {
  const isPortraitTablet = useMedia('(orientation: portrait)');

  const modelStyles = computeValue(() => {
    const orientationStyles = computeValue(() => {
      return isPortraitTablet ? `flex-col` : 'flex-row';
    });

    return `${orientationStyles} flex justify-center align-stretch p-[48px] gap-[48px] w-[90vw] h-[90vh] bg-white rounded-lg overflow-y-hidden`;
  });

  const imageContainerStyles = computeValue(() => {
    const orientationStyles = isPortraitTablet ? `hidden` : 'grow basis-full h-full';

    return `${orientationStyles} flex`;
  });

  const imageStyles = computeValue(() => {
    const orientationStyles = isPortraitTablet ? `` : 'w-full h-full';

    return `${orientationStyles} object-center object-cover rounded-3xl`;
  });

  const contentStyles = computeValue(() => {
    const orientationStyles = isPortraitTablet ? `gap-[80px]` : 'gap-[60px]';

    return `${className} ${orientationStyles} flex flex-col items-center justify-center grow basis-full`;
  });

  return (
    <div
      className="flex flex-col justify-center items-center fixed h-[100vh] w-[100vw] z-50 inset-0 bg-black bg-opacity-[78%] backdrop-blur-sm"
      data-testid={props['data-testid']}
    >
      <div className={modelStyles}>
        <div className={imageContainerStyles}>
          <Image
            className={imageStyles}
            alt="Example of physical card"
            src={imagePath}
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>

        <div className={contentStyles}>{children}</div>
      </div>
    </div>
  );
};
