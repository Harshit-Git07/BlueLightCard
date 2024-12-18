import { useCallback, useEffect, useRef, useState } from 'react';
import DesktopNavigation from './DesktopNavigation';
import MobileNavToggleButton from '../atoms/MobileNavToggleButton';
import { AuthenticatedNavBarProps } from '../../types';
import MobileNavigation from './MobileNavigation';
import Logo from '@/components/Logo';
import SearchDropDown from '@/page-components/SearchDropDown/SearchDropDown';
import { SearchBar } from '@bluelightcard/shared-ui';

const AuthenticatedNavBar = ({
  navigationItems,
  isSticky,
  onSearchTerm,
  onSearchCategoryChange,
  onSearchCompanyChange,
}: AuthenticatedNavBarProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [term, setTerm] = useState('');
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);

  const navBarRef = useRef<HTMLDivElement>(null);

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

  const onClickCategory = (catId: string, catName: string) => {
    setSearchOverlayOpen(false);
    onSearchCategoryChange(catId, catName);
  };

  const onClickCompany = (compId: string, company: string) => {
    setSearchOverlayOpen(false);
    onSearchCompanyChange(compId, company);
  };

  const onKeyDownListener = useCallback(
    (event: KeyboardEvent) => {
      if (!searchOverlayOpen) return;

      if (event.key === 'Escape') {
        onBack();
      }
    },
    [searchOverlayOpen, onBack]
  );

  const onFocusListener = useCallback(() => {
    if (!searchOverlayOpen) return;

    if (!navBarRef.current?.contains(document.activeElement)) {
      onBack();
    }
  }, [searchOverlayOpen, navBarRef, onBack]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDownListener);
    document.addEventListener('focusin', onFocusListener);

    return () => {
      document.removeEventListener('keydown', onKeyDownListener);
      document.removeEventListener('focusin', onFocusListener);
    };
  }, [onKeyDownListener, onFocusListener]);

  return (
    <div ref={navBarRef} data-testid="authenticated-navbar">
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
              <DesktopNavigation navigationItems={navigationItems} onBack={onBack} />
            </div>
            <div className="flex gap-5 items-center">
              <div className="hidden tablet:block tablet:w-[343px] w-full">
                <SearchBar
                  onFocus={onSearchInputFocus}
                  onBackButtonClick={onBack}
                  onClear={onClear}
                  placeholderText="Search for offers or companies"
                  value={term}
                  onSearch={onSearchTerm}
                  showBackArrow={searchOverlayOpen}
                />
              </div>

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
          placeholderText="Search for offers or companies"
          value={term}
          onSearch={onSubmitSearch}
          showBackArrow={searchOverlayOpen}
        />
      </div>

      <SearchDropDown
        isOpen={searchOverlayOpen}
        onSearchCategoryChange={onClickCategory}
        onSearchCompanyChange={onClickCompany}
        onClose={onBack}
      />
    </div>
  );
};

export default AuthenticatedNavBar;
