import { FC } from 'react';
import { MinimalFooterProps } from './types';
import * as React from 'react';
import Link from 'next/link';
import { env } from '../../env';
const MinimalFooter: FC<MinimalFooterProps> = ({ navItems }) => {
  const copyrightText =
    env.APP_BRAND === 'dds-uk'
      ? `© Defence Discount Service 2012 - ${new Date().getFullYear()} Operated by Blue Light Card Ltd`
      : `©Blue Light Card 2008 - ${new Date().getFullYear()}`;
  console.log('env.APP_BRAND', env.APP_BRAND);
  return (
    <div className="w-[1728px] self-stretch justify-between items-center gap-[16px] px-[160px] pb-[24px] inline-flex bg-colour-surface dark:bg-colour-surface-dark">
      <p className="text-center text-slate-600 text-lg font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light leading-7 tracking-tight">
        {copyrightText}
      </p>

      <div className="justify-start items-center gap-[35.56px] flex">
        {navItems.map((item) => (
          <Link
            id={item.text + '-nav-item'}
            aria-label={item.text + ' footer link'}
            key={item.text}
            href={item.link}
            className="text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark font-typography-body-light font-typography-body-light-weight text-typography-body-light tracking-typography-body-light leading-typography-body-light"
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MinimalFooter;
