import React from 'react';
import BrandLogo from '@brandasset/logo.svg';
import Link from '@/components/Link/Link';

interface LogoProps {
  url: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ url = '/', className }) => {
  return (
    <Link
      href={url}
      className={`flex relative block h-11 max-w-[197px] tablet:max-w-[226px] hover:opacity-100 ${className}`}
      data-testid="brandLogo"
      aria-label="Navigate Home"
    >
      <BrandLogo className="fill-colour-onPrimary" alt="Navigate Home" />
    </Link>
  );
};

export default Logo;
