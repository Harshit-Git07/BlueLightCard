import * as React from 'react';
import Link from 'next/link';
import { getCopyrightText, getNavigationItems } from './helper';

const MinimalFooter = () => {
  const copyrightText = getCopyrightText(),
    navigationItems = getNavigationItems();

  return (
    <div className="w-full max-w-[374px] flex flex-col items-center gap-4 px-4 pb-4 md:max-w-full md:px-4 lg:px-[56px] lg:flex-row lg:justify-between lg:items-center lg:max-w-[1728px] bg-colour-surface dark:bg-colour-surface-dark">
      <div className="w-fit border-t-[1px] border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark flex flex-col lg:flex-row lg:justify-between items-center w-full">
        <p
          className="mt-6 text-center text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark text-base font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light leading-7 tracking-tight whitespace-nowrap max-w-full"
          role="contentinfo"
          aria-label="Copyright Information"
        >
          {copyrightText}
        </p>
        <div className="grid grid-cols-2 gap-4 justify-items-center w-full text-center md:grid-cols-none md:grid-rows-none md:flex md:flex-row md:justify-center lg:justify-end lg:gap-[16px]">
          {navigationItems.map((item, index) => (
            <Link
              id={item.text + '-nav-item'}
              aria-label={item.text + ' footer link'}
              key={item.text}
              href={item.link}
              className={`mt-6 text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark text-base font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light ${
                navigationItems.length % 2 !== 0 && index === navigationItems.length - 1
                  ? 'col-span-2 justify-self-center md:col-span-1'
                  : 'w-full md:w-auto'
              }`}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalFooter;
