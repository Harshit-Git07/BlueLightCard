// components/Layout.tsx
import Footer from '@/components/Footer/Footer';
import NavBarV2 from '@/components/NavBarV2/NavBar';
import NavBar from '../../components/NavBar/NavBar';
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
import { LayoutProps } from './types';
import { useContext } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import MetaData from '@/components/MetaData/MetaData';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';

const BaseLayout: React.FC<LayoutProps> = ({ seo, children, translationNamespace }) => {
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

  const modernMyAccountFlag = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_MY_ACCOUNT,
    'off'
  );

  return (
    <div>
      {seo && <MetaData seo={seo} translationNamespace={translationNamespace} />}
      {modernMyAccountFlag.data?.variantName === 'on' ? (
        <NavBar
          isAuthenticated={loggedIn}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchTerm={onSearchTerm}
        />
      ) : (
        <NavBarV2
          isAuthenticated={loggedIn}
          onSearchCompanyChange={onSearchCompanyChange}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchTerm={onSearchTerm}
        />
      )}
      <div>{children}</div>
      <ToastContainer
        transition={Slide}
        autoClose={4000}
        hideProgressBar
        className="!w-full !p-4"
        toastClassName="!bg-[#202125] !text-white !font-['MuseoSans'] !text-base !font-normal !rounded !px-4 !py-3.5"
        pauseOnHover={false}
      />
      <Footer isAuthenticated />;
    </div>
  );
};

export default BaseLayout;
