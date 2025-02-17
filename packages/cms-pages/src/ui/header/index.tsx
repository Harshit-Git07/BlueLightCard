import { getBrand } from '@/app/actions';
import { getSite } from '@/lib/sanity/queries';
import Img from '../Img';
import Link from 'next/link';
import { Navigation } from './navigation';
import { mapToNavLinks } from './utils';

export default async function Header() {
  const brand = await getBrand();
  const { logo, headerMenu } = await getSite(brand);

  const navLinks = mapToNavLinks(headerMenu?.items);

  return (
    <header className="sticky top-0 z-20">
      <div className="dark:bg-NavBar-bg-colour-dark bg-NavBar-bg-colour text-NavBar-item-text-colour dark:text-NavBar-item-text-colour-dark">
        <div className="p-0 flex items-center flex-wrap tablet:gap-4 tablet:p-4 desktop:py-0 desktop:flex-nowrap laptop:container laptop:mx-auto">
          {logo.image.default && (
            <div className="order-1 grow px-4 py-5 tablet:p-0">
              <Link href="/">
                <Img
                  image={logo.image.default as Sanity.Image}
                  className="h-full max-h-[74px] max-w-[160px] tablet:max-w-[220px]"
                />
              </Link>
            </div>
          )}

          <Navigation links={navLinks} brand={brand} />
        </div>
      </div>
    </header>
  );
}
