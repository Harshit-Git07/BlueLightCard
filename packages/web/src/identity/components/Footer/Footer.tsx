import * as React from 'react';
import { FooterProps } from './Types';
import { FC } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cssUtil } from '@/utils/cssUtil';

const Footer: FC<FooterProps> = ({ navItems, mobileBreakpoint }) => {
  const [isMobile, setIsMobile] = useState(false);

  const copyrightText = `©Blue Light Card 2008 - ${new Date().getFullYear()}`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  return (
    <footer
      id="footer_nav"
      className={cssUtil([
        'w-full flex-col inline-flex',

        'mobile:h-[104px] mobile:px-[22px] mobile:py-[26px] mobile:justify-start mobile:items-start mobile:gap-y-3',

        'tablet:h-24 tablet:px-[132px] tablet:justify-center tablet:items-center',
      ])}
    >
      {isMobile ? (
        <>
          <div className="w-[328px] h-11 relative flex flex-wrap gap-[7px]">
            {navItems.map((item) => (
              <Link
                id={item.text + '-nav-item'}
                aria-label={item.text + ' footer link'}
                key={item.text}
                href={item.link}
                className="text-slate-600 text-sm font-normal leading-tight tracking-tight"
              >
                {item.text}
              </Link>
            ))}
          </div>

          <p className="text-center text-slate-600 text-sm font-normal leading-tight tracking-tight">
            {copyrightText}
          </p>
        </>
      ) : (
        <div className="self-stretch justify-between items-center gap-[100px] inline-flex">
          <p className="text-center text-slate-600 text-lg font-normal leading-7 tracking-tight">
            {copyrightText}
          </p>

          <div className="justify-start items-center gap-[35.56px] flex">
            {navItems.map((item) => (
              <Link
                id={item.text + '-nav-item'}
                aria-label={item.text + ' footer link'}
                key={item.text}
                href={item.link}
                className="text-slate-600 text-lg font-normal leading-7 tracking-tight"
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
