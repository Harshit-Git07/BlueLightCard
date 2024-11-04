import React, { FC, ReactNode } from 'react';

interface MainContainerProps {
  className?: string;
  children: ReactNode;
}

const MainContainer: FC<MainContainerProps> = ({ children, className = '' }) => {
  return (
    <main
      className={`flex-grow flex flex-col justify-start items-center w-full sm:w-2/3 lg:w-1/3 mx-auto ${className}`}
    >
      {children}
    </main>
  );
};

export default MainContainer;
