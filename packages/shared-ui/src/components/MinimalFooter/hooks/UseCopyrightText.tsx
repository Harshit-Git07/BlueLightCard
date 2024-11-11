import { env } from '../../../env';
import { ReactNode } from 'react';

export function useCopyrightText(): ReactNode {
  const currentYear = new Date().getFullYear();

  if (env.APP_BRAND === 'dds-uk') {
    return (
      <>
        <span className="block">{`© Defence Discount Service 2012 - ${currentYear}`}</span>
        <span className="block">Operated by Blue Light Card Ltd</span>
      </>
    );
  }

  return `©Blue Light Card 2008 - ${currentYear}`;
}
