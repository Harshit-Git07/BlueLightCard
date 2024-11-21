import Link from 'next/link';
import Navigation from './Navigation';
import CTAList from '@/ui/CTAList';
import Toggle from './Toggle';
import { cn } from '@/lib/utils';
import css from './Header.module.css';
import Img from '../Img';
import Wrapper from './Wrapper';
import { getSite } from '@/lib/sanity/queries';
import BrandSwitcher from './BrandSwitcher';

interface HeaderProps {
  brand: string;
}

export default async function Header({ brand }: HeaderProps) {
  const { title, ctas, logo } = await getSite(brand);
  // #032341
  return (
    <Wrapper className="frosted-glass sticky top-0 z-10 border-b bg-canvas max-md:header-open:shadow-lg">
      <div className="bg-blue-900 dds:bg-[#032341] h-2"></div>
      <div className="bg-blue-900 dds:bg-[#032341] h-12 dds:h-32 flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <Img
            className="h-10 w-64 dds:w-64 dds:h-20 dds:mr-auto dds:ml-10"
            image={logo.image.default as Sanity.Image}
          />
        </div>
        <div className="ml-auto">
          <BrandSwitcher />
        </div>
      </div>
      <div className={cn(css.header, 'mx-auto grid max-w-screen-xl items-center gap-x-6 p-4')}>
        <div className="[grid-area:logo]">
          <Link className="font-bold" href="/">
            {title}
          </Link>
        </div>

        <Navigation brand={brand} />

        <CTAList
          ctas={ctas}
          className="[grid-area:ctas] max-md:*:w-full max-md:header-closed:hidden md:ml-auto"
        />

        <Toggle />
      </div>
    </Wrapper>
  );
}
