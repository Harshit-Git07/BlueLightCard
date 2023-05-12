import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { NavButtonLinkProps, NavLinkProps, NavigationProps } from './types';
import Icon from '@/components/Icon/Icon';
import Button from '../Button/Button';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';
import { ASSET_PREFIX } from 'global-vars';

const NavLink: FC<NavLinkProps> = ({ href, children, className }) => {
  const classes = cssUtil([
    'border-t border-t-navigation-border laptop:border-none',
    className ?? '',
  ]);
  return (
    <li className={classes}>
      <Link
        className="block p-3 laptop:px-0 text-navigation-navlink hover:underline hover:opacity-100"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
};

const NavButtonLink: FC<NavButtonLinkProps> = ({ href, variant, children, className }) => {
  const classes = cssUtil(['mr-2', className ?? '']);
  return (
    <div className={classes}>
      <Link href={href}>
        <Button variant={variant} alternate={true} slim={true} noFocusRing={true}>
          {children}
        </Button>
      </Link>
    </div>
  );
};

const Navigation: FC<NavigationProps> = ({
  logoImgSrc,
  navItems,
  loginLink,
  signUpLink,
  countries = [
    { key: 'uk', name: 'United Kingdom', link: '/' },
    { key: 'aus', name: 'Australia', link: '/' },
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
              className="relative block h-[40px] max-w-[170px] laptop:max-w-[200px] hover:opacity-100"
              href="/"
            >
              <Image
                className="object-contain"
                src={`${assetPrefix}/${logoImgSrc}`}
                alt="Logo"
                fill
              />
            </Link>
          </div>
          <nav
            className={`${
              navExpanded ? 'max-h-[400px] ' : 'max-h-0 '
            } w-full laptop:w-auto overflow-hidden transition-[max-height] duration-700 absolute left-0 top-full laptop:mr-2 laptop:relative laptop:top-0 laptop:max-h-none laptop:px-3.5 border-b border-b-navigation-border bg-navigation-bg-mobilenav-base laptop:bg-transparent laptop:border-b-0`}
          >
            <div className="laptop:container laptop:mx-auto">
              <ul className="laptop:flex laptop:gap-6">
                {navItems.map((navItem, index) => (
                  <NavLink key={`navItem_${index}`} href={navItem.link}>
                    {navItem.text}
                  </NavLink>
                ))}
                {loginLink && (
                  <NavLink className="laptop:hidden" href={loginLink}>
                    Login
                  </NavLink>
                )}
                {signUpLink && (
                  <NavLink className="laptop:hidden" href={signUpLink}>
                    Sign up
                  </NavLink>
                )}
              </ul>
            </div>
          </nav>
          {loginLink && (
            <NavButtonLink
              className="hidden laptop:block"
              href={loginLink}
              variant={ThemeVariant.Secondary}
            >
              Login
            </NavButtonLink>
          )}
          {signUpLink && (
            <NavButtonLink
              className="hidden laptop:block"
              href={signUpLink}
              variant={ThemeVariant.Primary}
            >
              Sign up
            </NavButtonLink>
          )}
          {!!(countries && selectedCountry) && (
            <div className="relative z-10">
              <button
                title={selectedCountry.name}
                className="flex gap-3 w-full items-center bg-navigation-bg-selector p-2.5 rounded-lg text-white"
                onClick={handleSelectorClick}
              >
                <div className="w-[30px] h-[15px] tablet:w-[35px] tablet:h-[20px]">
                  <Icon iconKey={selectedCountry.key} />
                </div>
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
                      <Link
                        className="flex gap-3 items-center text-white"
                        href={country.link}
                        title={country.name}
                      >
                        <div className="w-[30px] h-[15px] tablet:w-[35px] tablet:h-[20px]">
                          <Icon iconKey={country.key} />
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <button
            className="block laptop:hidden px-3 py-2 focus:bg-navigation-bg-mobilenav-btnfocus"
            onClick={handleMobileNavClick}
          >
            <FontAwesomeIcon icon={faBars} size="lg" color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
