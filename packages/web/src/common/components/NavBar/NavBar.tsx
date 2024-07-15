import React, { useEffect, useState } from 'react';
import AuthenticatedNavBar from './components/organisms/AuthenticatedNavBar';
import UnauthenticatedNavBar from './components/organisms/UnauthenticatedNavBar';
import { getNavigationItems } from './helpers/getNavigationItems';
import { BRAND } from '@/global-vars';
import { BRANDS } from '../../types/brands.enum';
import { NavBarProps } from './types';

const NavBar = ({
  isAuthenticated,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onSearchTerm,
}: NavBarProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigationItems = getNavigationItems(BRAND as BRANDS, isAuthenticated);

  return (
    <header className="sticky top-0 z-10">
      {isAuthenticated ? (
        <AuthenticatedNavBar
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchTerm={onSearchTerm}
          navigationItems={navigationItems}
          isSticky={isSticky}
        />
      ) : (
        <UnauthenticatedNavBar />
      )}
    </header>
  );
};

export default NavBar;
