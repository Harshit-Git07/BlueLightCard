import React from 'react';
import Image from '@/components/Image/Image';
import Link from 'next/link';
import { logoProps } from './types';

const Logo: React.FC<logoProps> = (props) => {
  const { logoUrl } = props;

  return (
    <Link legacyBehavior href="/">
      <a className="relative block h-[40px] max-w-[197px] tablet:max-w-[226px] hover:opacity-100">
        <Image src={logoUrl} className="object-contain" alt="Logo" fill />
      </a>
    </Link>
  );
};

export default Logo;
