import React, { useEffect, useState } from 'react';
import AuthenticatedNavBar from './components/organisms/AuthenticatedNavBar';
import UnauthenticatedNavBar from './components/organisms/UnauthenticatedNavBar';
import getDeviceFingerprint from '@/utils/amplitude/getDeviceFingerprint';
import { getNavigationItems } from './helpers/getNavigationItems';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { NavBarProps } from './types';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';

const NavBar = ({
  isAuthenticated,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onSearchTerm,
  onToggleMobileSideBar,
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

  const zendeskExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.ZENDESK_V1_BLCUK,
    'off'
  );

  const isZendeskV1BlcUkEnabled = zendeskExperiment.data?.variantName === 'on';

  const cognitoUIExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.IDENTITY_COGNITO_UI_ENABLED,
    'control',
    getDeviceFingerprint()
  );

  const isCognitoUIEnabled = cognitoUIExperiment.data?.variantName === 'treatment';

  const auth0Experiment = useAmplitudeExperiment(
    getAuth0FeatureFlagBasedOnBrand(BRAND),
    'off',
    getDeviceFingerprint()
  );

  const isAuth0LoginLogoutWebEnabled = auth0Experiment.data?.variantName === 'on';

  const navigationItems = getNavigationItems(
    BRAND as BRANDS,
    isAuthenticated,
    isZendeskV1BlcUkEnabled,
    { isAuth0LoginLogoutWebEnabled, isCognitoUIEnabled }
  );

  return (
    <header className="sticky top-0 z-20">
      {isAuthenticated ? (
        <AuthenticatedNavBar
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchTerm={onSearchTerm}
          onToggleMobileSideBar={onToggleMobileSideBar}
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
