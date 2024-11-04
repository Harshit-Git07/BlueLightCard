import React, { FC } from 'react';
import Logo from '@/components/Logo';
import { navLinks } from '@/data/headerConfig';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

const Header: FC = () => {
  const brandSpecificWidth =
    BRAND === BRANDS.DDS_UK ? ' min-w-28 sm:pt-2 md:w-40' : 'min-w-40 md:w-60';

  return (
    <header
      className="min-h-[50px] md:h-[70px] bg-white flex items-center justify-center w-full"
      data-testid="app-header"
    >
      <div className={`flex justify-center ${brandSpecificWidth} `}>
        <Logo url={navLinks.homeUrl} className="w-full  h-full" />
      </div>
    </header>
  );
};

export default Header;
