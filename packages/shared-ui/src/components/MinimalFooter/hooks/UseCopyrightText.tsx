import { env } from '../../../env';
import { ReactNode } from 'react';

export function useCopyrightText(): ReactNode {
  const currentYear = new Date().getFullYear();

  if (env.APP_BRAND === 'dds-uk') {
    return (
      <div className="flex flex-col md:flex-row md:gap-[4px] lg:flex-col">
        <span>{`© Defence Discount Service 2012 - ${currentYear}`}</span>
        <span>Operated by Blue Light Card Ltd</span>
      </div>
    );
  }

  return `©Blue Light Card 2008 - ${currentYear}`;
}
