'use client';

import Button from '@bluelightcard/shared-ui/components/Button-V2';
import NavBar, { Props as NavBarLinks } from '@bluelightcard/shared-ui/components/NavBar';
import { BRAND, ThemeVariant } from '@bluelightcard/shared-ui/types';
import { toClassNames } from '@bluelightcard/shared-ui/utils/cssUtil';
import { faBars, faClose } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Image from 'next/image';

type Props = Readonly<{
  links: NavBarLinks['links'];
  brand: keyof typeof BRAND;
}>;

export function Navigation({ links, brand }: Props) {
  const [navOpen, setNavOpen] = useState(false);

  const onMobileNavOpen = () => setNavOpen(!navOpen);

  return (
    <>
      {links.length > 0 && (
        <div
          className={toClassNames([
            'basis-full mb-3 order-3 tablet:mb-0 desktop:order-1 tablet:order-2 desktop:basis-auto desktop:mx-7',
            !navOpen ? 'hidden tablet:block' : null,
          ])}
        >
          <NavBar links={links} />
        </div>
      )}

      <div
        className={toClassNames([
          'gap-2 order-4 flex basis-full flex-col items-center px-4 pb-4 tablet:p-0 tablet:basis-auto tablet:flex-row tablet:order-1 desktop:order-2',
          !navOpen ? 'hidden tablet:flex' : null,
        ])}
      >
        <Button href="/" size="Large" className="w-full mb-2 tablet:w-auto tablet:mb-0">
          Log in
        </Button>
        <Button
          href="/"
          size="Large"
          variant={ThemeVariant.Secondary}
          className="w-full tablet:w-auto"
        >
          Sign up
        </Button>
        {brand === 'DDS_UK' && (
          <Image
            src="/dds-header-logos.svg"
            alt="DDS Support"
            width={270}
            height={60}
            className="ml-0 my-4 tablet:ml-2"
          />
        )}
      </div>

      <button className="order-2 mr-3 tablet:hidden" onClick={onMobileNavOpen}>
        <FontAwesomeIcon icon={navOpen ? faClose : faBars} width={24} height={24} />
      </button>
    </>
  );
}
