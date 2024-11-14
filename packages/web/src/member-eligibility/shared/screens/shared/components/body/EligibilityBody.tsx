import React, { FC, ReactNode } from 'react';

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}

export const EligibilityBody: FC<MainContainerProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`flex flex-col flex-grow items-stretch gap-[24px] pt-[32px] mx-auto mobile:min-h-[100vh] mobile:w-full mobile:px-[18px] md:min-h-fit md:w-[500px] md:pt-[48px] md:px-0 ${className}`}
    >
      {children}
    </main>
  );
};
