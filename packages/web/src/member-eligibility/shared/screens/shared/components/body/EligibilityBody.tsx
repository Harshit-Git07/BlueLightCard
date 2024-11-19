import React, { FC, PropsWithChildren } from 'react';

interface MainContainerProps extends PropsWithChildren {
  className?: string;
}

export const EligibilityBody: FC<MainContainerProps> = ({ className = '', children }) => {
  return (
    <main
      className={`${className} flex flex-col flex-grow items-stretch pt-[32px] pb-[64px] mx-auto mobile:min-h-[100vh] mobile:w-full mobile:px-[18px] md:min-h-fit md:w-[500px] md:pt-[48px] md:px-0`}
    >
      {children}
    </main>
  );
};
