import React, { FC, PropsWithChildren, useMemo } from 'react';
import '../../../../../public/modalPlaceholder.png';
import DefaultImage from '@assets/modalPlaceholder.svg';
import { useMedia } from 'react-use';

export interface Props extends PropsWithChildren {
  image?: string;
  'data-testid'?: string;
  classname?: string;
}

export const EligibilityModalTemplate: FC<Props> = ({
  classname = '',
  image,
  children,
  ...props
}) => {
  // This can be a https link or a local image stored in the web/public folder
  const Image = image ?? DefaultImage;

  const isPadPro = useMedia(
    '(min-width: 1024px) and (max-width: 1024px) and (orientation: portrait)'
  );

  const ipadProStyles = useMemo(() => {
    if (!isPadPro) return 'lg:flex-row';

    return 'lg:flex-col';
  }, [isPadPro]);

  return (
    <article
      className={`${classname} z-50 fixed inset-0 bg-black bg-opacity-[78%] backdrop-blur-sm flex flex-col justify-center items-center`}
      data-testid={props['data-testid']}
    >
      <div
        className={`${ipadProStyles} bg-white md:portrait:w-[616px] md:portrait:h-[992px] mx-[48px] flex md:flex-col sm:flex-col-reverse rounded-lg`}
      >
        <div className="ml-[48px] mt-[48px] mb-[48px] md:portrait:mb-[0px] md:portrait:w-[520px] md:portrait:h-[324px] md:landscape:w-[434px] md:landscape:h-[700px] md:portrait:mr-[0px] md:landscape:mr-[-50px] ">
          <Image className="w-full h-full" alt="Hero image" />
        </div>

        <div className="m-[48px]">
          <div className="flex flex-col items-center justify-center">{children}</div>
        </div>
      </div>
    </article>
  );
};
