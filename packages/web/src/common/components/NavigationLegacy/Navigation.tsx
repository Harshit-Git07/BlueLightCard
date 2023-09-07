/* eslint-disable @next/next/no-html-link-for-pages */
import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { NavButtonLinkProps, NavigationProps, NavLinkProps } from './types';
import Icon from '@/components/Icon/Icon';
import Button from '@/components/Button/Button';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';
import BrandLogo from '@brandasset/logo.svg';

const NavLink: FC<NavLinkProps> = ({ href, children, className }) => {
  const classes = cssUtil([
    'border-t border-t-palette-tertiary-on-base dark:border-t-palette-tertiary-on-dark laptop:border-none',
    className ?? '',
  ]);
  return (
    <li className={classes}>
      <a
        className="block p-3 laptop:px-0 text-palette-primary-on-base hover:underline hover:opacity-100"
        href={href}
      >
        {children}
      </a>
    </li>
  );
};

const NavButtonLink: FC<NavButtonLinkProps> = ({ href, variant, children, className }) => {
  const classes = cssUtil(['mr-2', className ?? '']);
  return (
    <div className={classes}>
      <a href={href}>
        <Button variant={variant} slim={true} invertColor={true}>
          {children}
        </Button>
      </a>
    </div>
  );
};

const Navigation: FC<NavigationProps> = ({
  navItems,
  loginLink,
  signUpLink,
  countries = [
    {
      key: 'uk',
      name: 'United Kingdom',
      link: '/',
    },
    {
      key: 'aus',
      name: 'Australia',
      link: '/',
    },
  ],
  countryKey = 'uk',
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
    <div className="relative z-10 w-full">
      <div className="bg-palette-primary-base dark:bg-palette-primary-dark py-3.5 mobile:px-3 tablet:px-[132px]">
        <div className="tablet:container tablet:mx-auto flex items-center">
          <div className="flex-1 mr-2">
            <a
              className="relative block h-[40px] max-w-[170px] laptop:max-w-[200px] hover:opacity-100"
              href="/"
              aria-label="Link to Blue Light Card home page"
            >
              <div className="text-palette-primary-base dark:text-palette-primary-dark">
                <BrandLogo />
              </div>
            </a>
          </div>
          <nav
            className={`${
              navExpanded ? 'max-h-[400px] ' : 'max-h-0 '
            } w-full laptop:w-auto overflow-hidden transition-[max-height] duration-700 absolute left-0 top-full laptop:mr-2 laptop:relative laptop:top-0 laptop:max-h-none laptop:px-3.5 bg-palette-primary-base dark:bg-palette-primary-dark laptop:bg-palette-transparent laptop:border-b-0`}
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
                className="flex gap-3 w-full items-center dark:bg-palette-tertiary-dark bg-palette-tertiary-base p-2.5 rounded-lg text-palette-tertiary-on-base"
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
                      className="dark:bg-palette-tertiary-dark bg-palette-tertiary-base p-2.5 rounded-lg"
                      key={country.key}
                    >
                      <a
                        className="flex gap-3 items-center text-palette-white"
                        href={country.link}
                        title={country.name}
                      >
                        <div className="w-[30px] h-[15px] tablet:w-[35px] tablet:h-[20px]">
                          <Icon iconKey={country.key} />
                        </div>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <button
            className="block laptop:hidden px-3 py-2 rounded-md focus:bg-palette-tertiary-base focus:dark:bg-palette-tertiary-dark text-palette-tertiary-on-base dark:text-palette-tertiary-on-dark"
            onClick={handleMobileNavClick}
            aria-label="Open mobile navigation menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-white" size="lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
