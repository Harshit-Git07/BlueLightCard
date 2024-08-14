import { useCallback, useState } from 'react';
import DesktopNavigation from './DesktopNavigation';
import NotificationButton from '../atoms/NotificationButton';
import MobileNavToggleButton from '../atoms/MobileNavToggleButton';
import { AuthenticatedNavBarProps } from '../../types';
import MobileNavigation from './MobileNavigation';
import Logo from '@/components/Logo';
import { SearchBar } from '@bluelightcard/shared-ui';

const AuthenticatedNavBar = ({
  navigationItems,
  isSticky,
  onSearchTerm,
}: AuthenticatedNavBarProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [term, setTerm] = useState('');
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);

  const onSearchInputFocus = useCallback(() => {
    setSearchOverlayOpen(true);
  }, []);

  const onBack = useCallback(() => {
    setSearchOverlayOpen(false);
  }, []);

  const onSubmitSearch = (searchTerm: string) => {
    setSearchOverlayOpen(false);
    setTerm('');
    onSearchTerm(searchTerm);
  };

  const onClear = useCallback(() => {
    setTerm('');
  }, [setTerm]);

  const onShowMobileMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div data-testid="authenticated-navbar">
      <div
        className={`dark:bg-NavBar-bg-colour-dark bg-NavBar-bg-colour text-NavBar-item-text-colour dark:text-NavBar-item-text-colour-dark ${
          isSticky && !showMobileMenu
            ? 'border-b border-b-colour-onSurface-outline dark:border-b-colour-onSurface-outline-dark'
            : ''
        }`}
      >
        <div className="h-[72px] px-4 tablet:px-14 laptop:container laptop:mx-auto flex justify-between items-center">
          <Logo className="h-[35px] tablet:h-[42px] laptop:h-[55px]" url="/members-home" />
          <div className="flex gap-7 h-full items-center">
            <div className="hidden desktop:flex desktop:h-full">
              <DesktopNavigation navigationItems={navigationItems} />
            </div>
            <div className="flex gap-5 items-center">
              <div className="hidden tablet:block tablet:w-[343px] w-full">
                <SearchBar
                  onFocus={onSearchInputFocus}
                  onBackButtonClick={onBack}
                  onClear={onClear}
                  placeholderText="Search for offers or brands"
                  value={term}
                  onSearch={onSearchTerm}
                />
              </div>

              <NotificationButton href="/notifications.php" />
              <MobileNavToggleButton
                onIconClick={onShowMobileMenuClick}
                isMenuOpen={showMobileMenu}
              />
            </div>
          </div>
        </div>
        <div className="h-[72px] hidden tablet:px-14 tablet:flex desktop:hidden desktop:mx-auto">
          <DesktopNavigation navigationItems={navigationItems} />
        </div>
      </div>
      {showMobileMenu && <MobileNavigation navigationItems={navigationItems} />}
      <div className="tablet:hidden bg-colour-surface dark:bg-colour-surface-dark">
        <SearchBar
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          onClear={onClear}
          placeholderText="Search for offers or brands"
          value={term}
          onSearch={onSubmitSearch}
        />
      </div>
    </div>
  );
};

export default AuthenticatedNavBar;
