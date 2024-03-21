// components/Layout.tsx
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import {
  logSearchCompanyEvent,
  logSearchCategoryEvent,
  logSearchTermEvent,
} from '@/utils/amplitude';
import {
  getCompanyOfferDetailsUrl,
  getOffersByCategoryUrl,
  getOffersBySearchTermUrl,
} from '@/utils/externalPageUrls';

import footerConfig from '@/data/footerConfig';
import { LayoutProps } from './types';
import { useContext } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import MetaData from '@/components/MetaData/MetaData';

const BaseLayout: React.FC<LayoutProps> = ({
  seo,
  children,
  translationNamespace,
  headerOverride = undefined,
  footerOverride = undefined,
}) => {
  // Converts brand codes to text using the brand translation file
  // Uses data from locales folder as data source
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

  return (
    <div>
      {seo && <MetaData seo={seo} translationNamespace={translationNamespace} />}

      {headerOverride ? (
        headerOverride
      ) : (
        <Header
          loggedIn={loggedIn}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchTerm={onSearchTerm}
        />
      )}
      <div>{children}</div>
      {footerOverride ? footerOverride : <Footer {...footerConfig} loggedIn={loggedIn} />}
    </div>
  );
};

export default BaseLayout;
