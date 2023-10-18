import React from 'react';
import BrandLogo from '@brandasset/logo.svg';
import Link from '@/components/Link/Link';

interface LogoProps {
  url: string;
}

const Logo: React.FC<LogoProps> = ({ url = '/' }) => {
  return (
    <Link
      href={url}
      className="relative block h-[40px] max-w-[197px] tablet:max-w-[226px] hover:opacity-100"
      data-testid="blc-logo"
    >
      <BrandLogo alt="Blue Light Card Logo" />
    </Link>
  );
};

export default Logo;
