import React, { FC, PropsWithChildren } from 'react';

export const InterstitialScreenCardContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col self-center md:w-[450px] sm:w-[400px] gap-[24px]">{children}</div>
);
