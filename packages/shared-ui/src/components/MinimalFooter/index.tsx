import * as React from 'react';
import Link from 'next/link';
import { useNavigationItems } from './hooks/UseNavigationItems';
import { useCopyrightText } from './hooks/UseCopyrightText';
import { colours, fonts } from '../../tailwind/theme';

const MinimalFooter = () => {
  const copyrightText = useCopyrightText();
  const navigationItems = useNavigationItems();

  return (
    <div
      className={`${colours.backgroundSurface} w-full flex flex-col items-center px-[8px] pb-[24px] md:px-[16px] md:max-w-full lg:px-[160px] `}
    >
      <div
        className={`${colours.borderOnSurfaceOutline} w-full border-t-[1px] flex flex-col items-center gap-[16px] pt-[16px] lg:flex-row lg:justify-between lg:items-center`}
      >
        <p
          className={`${colours.textOnSurfaceSubtle} ${fonts.bodyLight} text-base text-center tracking-tight whitespace-nowrap`}
          role="contentinfo"
          aria-label="Copyright Information"
        >
          {copyrightText}
        </p>

        <div className="flex flex-wrap justify-center w-full lg:justify-end gap-[16px]">
          {navigationItems.map((item) => (
            <Link
              id={`${item.text}-nav-item`}
              aria-label={`${item.text} footer link`}
              key={item.text}
              href={item.link}
              className={`${colours.textOnSurfaceSubtle} ${fonts.bodyLight} leading-normal whitespace-nowrap`}
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
