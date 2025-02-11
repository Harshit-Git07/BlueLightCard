import { useCallback, useEffect, useRef, useState } from 'react';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { AuthenticatedNavBarProps } from '../../types';
import { SearchBar, usePlatformAdapter } from '@bluelightcard/shared-ui';
import AccountButton from '../atoms/AccountButton';
import DesktopNavigation from './DesktopNavigation';
import Logo from '@/components/Logo';
import MobileNavigation from './MobileNavigation';
import MobileNavToggleButton from '../atoms/MobileNavToggleButton';
import SearchDropDown from '@/page-components/SearchDropDown/SearchDropDown';

const AuthenticatedNavBar = ({
  navigationItems,
  isSticky,
  onSearchTerm,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onAccountClick,
}: AuthenticatedNavBarProps) => {
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState<boolean>(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState<boolean>(false);
  const [term, setTerm] = useState('');

  const navBarRef = useRef<HTMLDivElement>(null);
  const platformAdapter = usePlatformAdapter();

  const modernMyAccountFlag = platformAdapter.getAmplitudeFeatureFlag(
    AmplitudeExperimentFlags.MODERN_MY_ACCOUNT
  );
  const useModernAccountNavigation =
    modernMyAccountFlag === 'treatment' || modernMyAccountFlag === 'on';

  const onAccountButtonClick = () => {
    if (onAccountClick) {
      onAccountClick();
      return;
    }

    if (useModernAccountNavigation) {
      platformAdapter.navigate('/your-card');
      return;
    }
  };

  const onMobileNavButtonClick = () => {
    setMobileOverlayOpen((isOpen) => !isOpen);
  };

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
          isSticky
            ? 'border-b border-b-colour-onSurface-outline dark:border-b-colour-onSurface-outline-dark'
            : ''
        }`}
      >
        <div className="pt-4 tablet:pt-0 h-auto px-4 laptop:container laptop:mx-auto flex flex-wrap desktop:flex-nowrap content-center items-center">
          <div className="h-[35px] tablet:h-[42px] desktop:h-[55px] inline-block grow">
            <Logo className="inline-block h-full" url="/members-home" />
          </div>

          {!useModernAccountNavigation && (
            <div className="w-auto hidden tablet:block tablet:w-full h-[72px] desktop:w-auto order-none tablet:order-last desktop:order-none mx-0 mx-4 2xl:mx-7 grow 2xl:grow-0">
              <DesktopNavigation navigationItems={navigationItems} />
            </div>
          )}

          <div className="w-full tablet:w-[343px] order-last tablet:order-none">
            <SearchBar
              className={!useModernAccountNavigation ? 'px-0 desktop:px-4' : 'px-0 tablet:px-4'}
              onFocus={onSearchInputFocus}
              onBackButtonClick={onBack}
              onClear={onClear}
              placeholderText="Search for offers or companies"
              value={term}
              onSearch={onSubmitSearch}
              showBackArrow={searchOverlayOpen}
            />
          </div>

          <div className="flex gap-4">
            <div className={!useModernAccountNavigation ? 'hidden' : ''}>
              <AccountButton
                isToggled={!useModernAccountNavigation && mobileOverlayOpen}
                onClick={onAccountButtonClick}
              />
            </div>

            <div className={!useModernAccountNavigation ? 'tablet:hidden' : 'hidden'}>
              <MobileNavToggleButton
                isMenuOpen={mobileOverlayOpen}
                onIconClick={onMobileNavButtonClick}
              />
            </div>

            {!useModernAccountNavigation && mobileOverlayOpen && (
              <MobileNavigation navigationItems={navigationItems} />
            )}
          </div>
        </div>
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
