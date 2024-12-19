import React, { FC, PropsWithChildren } from 'react';
import Image from 'next/image';

export interface Props extends PropsWithChildren {
  className?: string;
  imagePath: string;
  'data-testid'?: string;
}

export const EligibilityMobileModal: FC<Props> = ({
  className = '',
  imagePath,
  children,
  ...props
}) => (
  <div
    className="flex flex-col justify-start items-center gap-[24px] fixed top-0 left-0 h-[100vh] w-[100vw] z-50 p-[18px] bg-white overflow-y-scroll"
    data-testid={props['data-testid']}
    onScroll={(event) => event.stopPropagation()}
  >
    <div className={`${className} flex flex-col justify-center align-center gap-[24px] grow`}>
      {children}
    </div>

    <Image
      className="w-full h-auto shrink object-center object-cover rounded-3xl"
      alt="Example of physical card"
      src={imagePath}
      width={0}
      height={0}
    />
  </div>
);
