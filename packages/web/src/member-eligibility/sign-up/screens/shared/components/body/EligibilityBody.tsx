import React, { FC, ReactNode } from 'react';

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}

export const EligibilityBody: FC<MainContainerProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`flex flex-col justify-start items-center flex-grow gap-[24px] md:min-h-[100vh] md:min-h-fit md:w-[500px] sm:w-full mx-auto md:pt-[48px] sm:pt-[32px] ${className}`}
    >
      {children}
    </main>
  );
};
