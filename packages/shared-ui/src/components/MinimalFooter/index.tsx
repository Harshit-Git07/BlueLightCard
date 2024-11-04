import * as React from 'react';
import Link from 'next/link';
import { getCopyrightText, getNavigationItems } from './helper';

const MinimalFooter = () => {
  const copyrightText = getCopyrightText(),
    navigationItems = getNavigationItems();

  //changing the line height if uneven number of navigation items
  const lineHeight =
    navigationItems.length - (1 % 2) === 0 ? 'leading-[0.375rem]' : 'leading-[1px]';

  return (
    <div className="w-full flex flex-col items-center gap-2 px-2 pb-6 md:max-w-full md:px-4 lg:px-[56px] lg:flex-row lg:justify-between lg:items-center bg-colour-surface dark:bg-colour-surface-dark">
      <div className="w-fit border-t-[1px] border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark flex flex-col lg:flex-row lg:justify-between items-center w-full">
        <p
          className="mt-4 text-center text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark text-base font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light leading-7 tracking-tight whitespace-nowrap max-w-full"
          role="contentinfo"
          aria-label="Copyright Information"
        >
          {copyrightText}
        </p>
        <div className="grid grid-cols-2 justify-items-center w-full text-center md:grid-cols-none md:grid-rows-none md:flex md:flex-row md:justify-center lg:justify-end  md:gap-4">
          {navigationItems.map((item, index) => (
            <Link
              id={item.text + '-nav-item'}
              aria-label={item.text + ' footer link'}
              key={item.text}
              href={item.link}
              className={`mt-4 text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark text-base font-typography-body-light font-typography-body-light-weight tracking-typography-body-light leading-typography-body-light ${
                navigationItems.length % 2 !== 0 && index === navigationItems.length - 1
                  ? 'col-span-2 justify-self-center md:col-span-1'
                  : 'w-full md:w-auto'
              } ${lineHeight} lg:leading-normal last:pb-1 sm:last:pb-0`}
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
