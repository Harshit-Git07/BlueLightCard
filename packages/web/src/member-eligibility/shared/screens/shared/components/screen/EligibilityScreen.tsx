import MinimalFooter from '@bluelightcard/shared-ui/components/MinimalFooter';
import React, { FC, PropsWithChildren } from 'react';
import { EligibilityHeader } from './components/EligibilityHeader';

interface Props extends PropsWithChildren {
  className?: string;
  'data-testid'?: string;
}

export const EligibilityScreen: FC<Props> = ({ className = '', children, ...props }) => (
  <div
    className={`${className} min-h-screen flex flex-col justify-between`}
    data-testid={props['data-testid']}
  >
    <EligibilityHeader />

    {children}

    <MinimalFooter />
  </div>
);
