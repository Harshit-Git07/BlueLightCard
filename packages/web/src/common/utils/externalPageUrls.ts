import { amplitudeStore } from '../context/AmplitudeExperiment';
import { experimentsAndFeatureFlags } from '../utils/amplitude/store';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';

export const getCompanyOfferDetailsUrl = (companyId: string) => {
  return `/offerdetails.php?cid=${companyId}`;
};

export const getOffersByCategoryUrl = (categoryId: string) => {
  return `/offers.php?cat=true&type=${categoryId}`;
};

export const getOffersBySearchTermUrl = (searchTerm: string, issuer: string = '') => {
  let disableModernSearch = false;
  const amplitudeFlags = amplitudeStore.get(experimentsAndFeatureFlags);
  disableModernSearch = amplitudeFlags[AmplitudeExperimentFlags.DISABLE_MODERN_WEB_SEARCH] === 'on';

  return disableModernSearch
    ? `/offers.php?type=1&opensearch=1&search=${searchTerm}`
    : `/search?issuer=${issuer}&q=${searchTerm}`;
};
