import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { NavigationProps } from './types';
import { ASSET_PREFIX } from 'global-vars';

const Navigation: FC<NavigationProps> = ({
  logoImgSrc,
  navItems,
  countries = [
    { key: 'uk', name: 'United Kingdom', imageSrc: '/assets/uk_flag.webp' },
    { key: 'aus', name: 'Australia', imageSrc: '/assets/aus_flag.webp' },
  ],
  countryKey = 'uk',
  assetPrefix = ASSET_PREFIX,
}) => {
  const selectedCountry = countries?.find((country) => country.key === countryKey);
  const [expanded, setExpanded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  const handleSelectorClick = () => {
    setExpanded(!expanded);
  };

  const handleMobileNavClick = () => {
    setNavExpanded(!navExpanded);
  };

  return (
    <div className="relative">
      <div className="bg-navigation-bg-base py-3.5 px-3">
        <div className="laptop:container laptop:mx-auto flex items-center">
          <div className="flex-1 mr-2">
            <Link
              className="relative block h-[40px] max-w-[170px] tablet:max-w-[200px] hover:opacity-100"
              href="/"
            >
              <Image className="object-contain" src={logoImgSrc} alt="Logo" fill />
            </Link>
          </div>
          {!!(countries && selectedCountry) && (
            <div className="relative z-10 tablet:w-full tablet:max-w-[230px]">
              <button
                className="flex gap-3 w-full items-center bg-navigation-bg-selector p-2.5 rounded-lg text-white"
                onClick={handleSelectorClick}
              >
                <div className="relative w-[30px] h-[15px] tablet:w-[40px] tablet:h-[20px]">
                  <Image
                    className="object-contain"
                    src={`${assetPrefix}/${selectedCountry.imageSrc}`}
                    fill
                    alt=""
                  />
                </div>
                <span className="hidden tablet:block flex-1 text-left">{selectedCountry.name}</span>
                <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} size="sm" />
              </button>
              <ul className={`${!expanded ? 'hidden ' : ''}absolute top-12 w-full`}>
                {countries
                  .filter((country) => country.key !== countryKey)
                  .map((country) => (
                    <li
                      className="bg-navigation-bg-selector p-2.5 rounded-lg text-white"
                      key={country.key}
                    >
                      <Link className="flex gap-3 items-center text-white" href="/">
                        <div className="relative w-[30px] h-[15px] tablet:w-[40px] tablet:h-[20px]">
                          <Image
                            className="object-contain"
                            src={`${assetPrefix}/${country.imageSrc}`}
                            fill
                            alt=""
                          />
                        </div>
                        <span className="hidden tablet:block">{country.name}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <button className="block tablet:hidden pl-4" onClick={handleMobileNavClick}>
            <FontAwesomeIcon icon={faBars} size="lg" color="white" />
          </button>
        </div>
      </div>
      <nav
        className={`${
          navExpanded ? 'max-h-[400px] ' : 'max-h-0 '
        } w-full overflow-hidden transition-[max-height] duration-700 absolute top-full tablet:relative tablet:top-0 tablet:max-h-none tablet:px-3.5 border-b border-b-navigation-border bg-navigation-bg-mobilenav tablet:bg-white`}
      >
        <div className="tablet:container tablet:mx-auto">
          <ul className="tablet:flex laptop:gap-9 tablet:gap-6">
            {navItems.map((navItem, index) => (
              <li
                className="border-t border-t-navigation-border tablet:border-none"
                key={`navItem_${index}`}
              >
                <Link
                  className="block p-3 tablet:px-0 text-navigation-navlink hover:text-link hover:underline hover:opacity-100"
                  href={navItem.link}
                >
                  {navItem.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
