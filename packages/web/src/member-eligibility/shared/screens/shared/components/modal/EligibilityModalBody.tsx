import '@/root/public/modalPlaceholder.png';
import React, { FC, PropsWithChildren, SVGProps, useMemo } from 'react';

import { useMedia } from 'react-use';
import { useMediaQuery } from '@bluelightcard/shared-ui';
import { getModalImage } from '@/root/src/member-eligibility/shared/screens/success-screen/utils/GetModalImage';

export interface Props extends PropsWithChildren {
  className?: string;
  'data-testid'?: string;
}

export const EligibilityModalBody: FC<Props> = ({ className = '', children, ...props }) => {
  const Image = getModalImage();

  const isPadPro = useMedia(
    '(min-width: 1024px) and (max-width: 1024px) and (orientation: portrait)'
  );

  //Changing the dimensions of the image based on the screen size
  const imageProps: SVGProps<SVGSVGElement> = {
    viewBox: useMediaQuery('(max-width: 850px)') || isPadPro ? '50 350 900 500' : '60 500 900 500',
  };

  const ipadProStyles = useMemo(() => {
    if (!isPadPro) return 'lg:flex-row';

    return 'lg:flex-col';
  }, [isPadPro]);

  return (
    <article
      className={`${className} z-50 fixed inset-0 bg-black bg-opacity-[78%] backdrop-blur-sm flex flex-col justify-center items-center`}
      data-testid={props['data-testid']}
    >
      <div
        className={`${ipadProStyles} bg-white md:portrait:w-[616px] md:portrait:h-[992px] mx-[48px] flex md:flex-col sm:flex-col-reverse rounded-lg`}
      >
        <div className="ml-[48px] mt-[48px] mb-[48px] md:portrait:mb-[0px] md:portrait:w-[520px] md:portrait:h-[324px] md:landscape:w-[434px] md:landscape:h-[700px] md:portrait:mr-[0px] md:landscape:mr-[-50px]">
          <Image
            className="w-full h-full rounded-3xl"
            alt="Example of physical card"
            {...imageProps}
          />
        </div>

        <div className="m-[48px]">
          <div className="flex flex-col items-center justify-center">{children}</div>
        </div>
      </div>
    </article>
  );
};
