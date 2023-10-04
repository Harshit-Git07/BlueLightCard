import React from 'react';
import Image from '@/components/Image/Image';
import Link from '@/components/Link/Link';
import { logoProps } from './types';

const Logo: React.FC<logoProps> = (props) => {
  const { logoUrl } = props;

  return (
    <Link legacyBehavior href="/" data-testid="blc-logo">
      <a className="relative block h-[40px] max-w-[197px] tablet:max-w-[226px] hover:opacity-100">
        <Image src={logoUrl} className="object-contain" alt="Logo" fill />
      </a>
    </Link>
  );
};

export default Logo;
