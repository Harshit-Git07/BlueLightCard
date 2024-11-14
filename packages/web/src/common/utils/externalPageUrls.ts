import { amplitudeStore } from '../context/AmplitudeExperiment';
import { experimentsAndFeatureFlags } from '../utils/amplitude/store';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';

export const getCompanyOfferDetailsUrl = (companyId: string) => {
  const amplitudeFlags = amplitudeStore.get(experimentsAndFeatureFlags);
  const enableOffersCms = amplitudeFlags[AmplitudeExperimentFlags.CMS_OFFERS] === 'on';
  return enableOffersCms ? `/company?cid=${companyId}` : `/offerdetails.php?cid=${companyId}`;
};

export const getOffersByCategoryUrl = (categoryId: string) => {
  return `/offers.php?cat=true&type=${categoryId}`;
};

export const getOffersBySearchTermUrl = (searchTerm: string, issuer: string = '') => {
  let enableModernSearch = false;
  const amplitudeFlags = amplitudeStore.get(experimentsAndFeatureFlags);
  enableModernSearch = amplitudeFlags[AmplitudeExperimentFlags.ENABLE_MODERN_WEB_SEARCH] === 'on';

  return enableModernSearch
    ? `/search?issuer=${issuer}&q=${searchTerm}`
    : `/offers.php?type=1&opensearch=1&search=${searchTerm}`;
};
