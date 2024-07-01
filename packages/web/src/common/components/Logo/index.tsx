import Link from 'next/link';
import { FC } from 'react';
import BrandLogo from '@brandasset/logo.svg';

type Props = {
  url?: string;
};

const Logo: FC<Props> = ({ url = '/' }) => {
  return (
    <Link
      href={url}
      className="hover:opacity-100"
      data-testid="brandLogo"
      aria-label="Navigate Home"
    >
      <BrandLogo className="fill-logo-colour dark:fill-logo-colour-dark" alt="Navigate Home" />
    </Link>
  );
};

export default Logo;
