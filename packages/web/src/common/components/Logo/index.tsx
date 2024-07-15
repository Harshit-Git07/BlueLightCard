import Link from 'next/link';
import { FC } from 'react';
import BrandLogo from '@brandasset/logo.svg';

type Props = {
  url?: string;
  className?: string;
};

const Logo: FC<Props> = ({ url = '/', className }) => {
  return (
    <Link
      href={url}
      className={`${className} hover:opacity-100`}
      data-testid="brandLogo"
      aria-label="Navigate Home"
    >
      <BrandLogo
        className="fill-logo-colour dark:fill-logo-colour-dark h-full"
        alt="Navigate Home"
      />
    </Link>
  );
};

export default Logo;
