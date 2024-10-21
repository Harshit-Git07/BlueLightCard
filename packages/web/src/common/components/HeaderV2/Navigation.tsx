import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';

// Original Header imports
import MobileNavigation from '../Header/MobileNavigation';
import DesktopNavigation from '../Header/DesktopNavigation';

// New imports
import { NavProp } from './types';
import SearchInputField from '../SearchInputField/SearchInputField';
import { getNavItems } from '@/data/headerConfig';
import { getOffersBySearchTermUrl } from '../../utils/externalPageUrls';
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment/hooks';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';
import getDeviceFingerprint from '../../utils/amplitude/getDeviceFingerprint';
import { useLogGlobalNavigationOffersClicked } from '@/hooks/useLogGlobalNavigation';
import { getAuth0FeatureFlagBasedOnBrand } from '@/utils/amplitude/getAuth0FeatureFlagBasedOnBrand';
import { BRAND } from '@/global-vars';

const Navigation: FC<NavProp> = ({ authenticated }) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const cognitoUIExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.IDENTITY_COGNITO_UI_ENABLED,
    'control',
    getDeviceFingerprint()
  );

  const auth0Experiment = useAmplitudeExperiment(
    getAuth0FeatureFlagBasedOnBrand(BRAND),
    'off',
    getDeviceFingerprint()
  );

  const zendeskExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.ZENDESK_V1_BLCUK,
    'off'
  );

  const isZendeskV1BlcUkEnabled = zendeskExperiment.data?.variantName === 'on';

  const isCognitoUIEnabled = cognitoUIExperiment.data?.variantName === 'treatment';

  const isAuth0LoginLogoutWebEnabled = auth0Experiment.data?.variantName === 'on';

  const router = useRouter();
  const { q } = router.query;
  const searchTerm = q ? q.toString() : '';

  function dropdownMenuHandler() {
    setDropdownMenu(!dropdownMenu);
  }

  const { logOffersClicked, logBrowseCategoriesClicked, logMyCardClicked, logMyAccountClicked } =
    useLogGlobalNavigationOffersClicked();

  const { loggedIn, loggedOut } = getNavItems(
    { isAuth0LoginLogoutWebEnabled, isCognitoUIEnabled },
    logOffersClicked,
    logBrowseCategoriesClicked,
    logMyCardClicked,
    logMyAccountClicked,
    isZendeskV1BlcUkEnabled
  );
  const menu = authenticated ? loggedIn : loggedOut;

  const onSearch = (query: string) => {
    const searchRoute = getOffersBySearchTermUrl(query, 'serp');
    router.push(searchRoute);
  };

  return (
    <>
      <nav className="border-b border-slate-100 bg-shade-greyscale-white" data-testid="navigation">
        <div className="laptop:container laptop:mx-auto flex justify-between">
          <div
            className="bg-[#252525] text-shade-greyscale-white w-[52px] h-[52px] leading-[52px] text-center p-3 overflow-hidden cursor-pointer flex desktop:hidden desktop:px-0 items-center"
            onClick={dropdownMenuHandler}
          >
            <FontAwesomeIcon icon={faBars} className="fa-solid fa-bars w-full h-full text-center" />
          </div>

          <DesktopNavigation menu={menu} />

          <div className="py-1">
            <SearchInputField
              iconLocation={'left'}
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
              onSubmit={onSearch}
              prefillData={searchTerm}
            />
          </div>
        </div>
        {dropdownMenu && <MobileNavigation menu={menu} />}
      </nav>
    </>
  );
};

export default Navigation;
