import { useContext } from 'react';
import NavBar from './NavBar/NavBar';
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
  onAccountClick?: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ onAccountClick }) => {
  const authContext = useContext(AuthContext);
  const loggedIn = authContext.isUserAuthenticated();

  const onSearchCompanyChange = (companyId: string, company: string) => {
    logSearchCompanyEvent(companyId, company);
    window.location.href = getCompanyOfferDetailsUrl(companyId);
  };

  const onSearchCategoryChange = (categoryId: string, categoryName: string) => {
    logSearchCategoryEvent(categoryId, categoryName);
    window.location.href = getOffersByCategoryUrl(categoryId);
  };

  const onSearchTerm = (searchTerm: string) => {
    logSearchTermEvent(searchTerm);
    window.location.href = getOffersBySearchTermUrl(searchTerm);
  };

  return (
    <>
      <NavBar
        isAuthenticated={loggedIn}
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
        onAccountClick={onAccountClick}
      />
    </>
  );
};

export default Navigation;
