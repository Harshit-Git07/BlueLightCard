import React, { FC, ReactNode } from 'react';

const StandardPadding: FC<{ children: ReactNode | ReactNode[]; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`${className} px-2 tablet:px-4 laptop:px-32 w-full`}>{children}</div>;
};

export default StandardPadding;
