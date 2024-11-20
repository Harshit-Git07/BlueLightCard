import React, { FC, PropsWithChildren } from 'react';

export const InterstitialScreenCardContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col self-center gap-[16px]">{children}</div>
);
