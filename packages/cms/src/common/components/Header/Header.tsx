import { FC } from 'react';
import Image from '@/components/Image/Image';
import Link from 'next/link';

const Header: FC = () => (
  <div
    data-testid="app-header"
    className="bg-palette-primary-base dark:bg-palette-primary-dark py-3.5 px-3"
  >
    <div className="flex-1 mr-2">
      <Link
        className="relative block h-[40px] max-w-[170px] laptop:max-w-[200px] hover:opacity-100"
        href="/"
      >
        <Image className="object-contain" src="/blc_logo.webp" alt="Logo" fill />
      </Link>
    </div>
  </div>
);

export default Header;
