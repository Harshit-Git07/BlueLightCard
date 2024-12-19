import { useContext } from 'react';
import NavBarV2 from './NavBarV2/NavBar';
import NavBar from './NavBar';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment';
import AuthContext from '../../context/Auth/AuthContext';
import {
  logSearchCategoryEvent,
  logSearchCompanyEvent,
  logSearchTermEvent,
} from '../../utils/amplitude';
import {
  getCompanyOfferDetailsUrl,
  getOffersByCategoryUrl,
  getOffersBySearchTermUrl,
} from '../../utils/externalPageUrls';

type NavigationProps = {
  onToggleMobileSideBar?: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onToggleMobileSideBar }) => {
  const authContext = useContext(AuthContext);
  const loggedIn = authContext.isUserAuthenticated();

  const onSearchCompanyChange = async (companyId: string, company: string) => {
    await logSearchCompanyEvent(companyId, company);
    window.location.href = getCompanyOfferDetailsUrl(companyId);
  };

  const onSearchCategoryChange = async (categoryId: string, categoryName: string) => {
    await logSearchCategoryEvent(categoryId, categoryName);
    window.location.href = getOffersByCategoryUrl(categoryId);
  };

  const onSearchTerm = async (searchTerm: string) => {
    await logSearchTermEvent(searchTerm);
    window.location.href = getOffersBySearchTermUrl(searchTerm);
  };
  const modernMyAccountFlag = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_MY_ACCOUNT,
    'off'
  );

  return (
    <>
      {modernMyAccountFlag.data?.variantName === 'on' ? (
        <NavBar
          isAuthenticated={loggedIn}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchTerm={onSearchTerm}
          onToggleMobileSideBar={onToggleMobileSideBar}
        />
      ) : (
        <NavBarV2
          isAuthenticated={loggedIn}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchTerm={onSearchTerm}
        />
      )}
    </>
  );
};

export default Navigation;
