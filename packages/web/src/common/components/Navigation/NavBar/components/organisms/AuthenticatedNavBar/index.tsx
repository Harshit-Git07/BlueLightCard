import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '@/components/Logo';
import SearchDropDown from '@/page-components/SearchDropDown/SearchDropDown';
import DesktopNavigation from '../DesktopNavigation';
import MobileNavigation from '../MobileNavigation';
import MobileNavToggleButton from '../../atoms/MobileNavToggleButton';
import { AuthenticatedNavBarProps } from '../../../types';
import MyAccountButton from '../../atoms/MyAccountButton';
import { colours, SearchBar } from '@bluelightcard/shared-ui/index';

const AuthenticatedNavBar = ({
  navigationItems,
  isSticky,
  onSearchTerm,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onToggleMobileSideBar,
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
    <nav ref={navBarRef} data-testid="authenticated-navbar" aria-label="Main navigation">
      <div
        className={`mobile:px-[16px] mobile:py-[8px] tablet:px-[56px] desktop:px-[160px] desktop:py-0 
          ${colours.backgroundSurface} ${colours.textOnSurface} ${
          isSticky && !showMobileMenu
            ? 'border-b border-b-colour-onSurface-outline dark:border-b-colour-onSurface-outline-dark'
            : ''
        }`}
      >
        <div className="flex justify-between items-center mobile:h-[51px] tablet:h-[72px]">
          <Logo className="mobile:h-[35px] tablet:h-[72px] tablet:-ml-4" url="/members-home" />

          <div className="flex grow items-center justify-end">
            <div className={`hidden laptop:block h-[72px]`}>
              <DesktopNavigation navigationItems={navigationItems} onBack={onBack} />
            </div>
            <div className={`hidden laptop:block flex grow max-w-[343px] tablet:ml-[56px]`}>
              <SearchBar
                onFocus={onSearchInputFocus}
                onBackButtonClick={onBack}
                onClear={onClear}
                placeholderText="Search for offers or brands"
                value={term}
                onSearch={onSearchTerm}
                showBackArrow={searchOverlayOpen}
              />
            </div>

            <div className="flex ml-[16px] gap-[16px]">
              <MyAccountButton href="/your-card" onClick={onToggleMobileSideBar} />
              <div className="laptop:hidden">
                <MobileNavToggleButton
                  onIconClick={onShowMobileMenuClick}
                  isMenuOpen={showMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`laptop:hidden w-full mobile:p-[16px] mobile:pt-[8px] tablet:px-[56px] tablet:py-[12px] ${colours.backgroundSurface}`}
      >
        <SearchBar
          onFocus={onSearchInputFocus}
          onBackButtonClick={onBack}
          onClear={onClear}
          placeholderText="Search for offers or brands"
          value={term}
          onSearch={onSubmitSearch}
          showBackArrow={searchOverlayOpen}
        />
      </div>

      {showMobileMenu ? <MobileNavigation navigationItems={navigationItems} /> : null}

      <SearchDropDown
        isOpen={searchOverlayOpen}
        onSearchCategoryChange={onClickCategory}
        onSearchCompanyChange={onClickCompany}
        onClose={onBack}
      />
    </nav>
  );
};

export default AuthenticatedNavBar;
