import React, { FC, ReactNode } from 'react';

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}

export const EligibilityBody: FC<MainContainerProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`flex-grow flex flex-col justify-start items-center md:w-[500px] sm:w-full mx-auto pt-[32px] md:pt-12 ${className}`}
    >
      {children}
    </main>
  );
};
