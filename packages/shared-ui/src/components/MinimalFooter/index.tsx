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
  console.log('env.APP_BRAND', process.env.STORYBOOK_APP_BRAND);

  return (
    <div className="w-full max-w-[374px] flex flex-col items-center gap-4 px-4 pb-4 md:max-w-full md:px-4 lg:px-[56px] lg:flex-row lg:justify-between lg:items-center lg:max-w-[1728px] bg-colour-surface dark:bg-colour-surface-dark">
      <p className="text-center text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark text-lg font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light leading-7 tracking-tight whitespace-nowrap max-w-full">
        {copyrightText}
      </p>
      <div className="grid grid-cols-2 gap-4 justify-items-center w-full text-center md:grid-cols-none md:grid-rows-none md:flex md:flex-row md:justify-center lg:justify-end lg:gap-[16px]">
        {navItems.map((item, index) => (
          <Link
            id={item.text + '-nav-item'}
            aria-label={item.text + ' footer link'}
            key={item.text}
            href={item.link}
            className={`text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light ${
              navItems.length % 2 !== 0 && index === navItems.length - 1
                ? 'col-span-2 justify-self-center md:col-span-1'
                : 'w-full md:w-auto'
            }`}
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MinimalFooter;
