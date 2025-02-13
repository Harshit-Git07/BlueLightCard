import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OFFERS_BRAND } from '@/global-vars';
import { companiesCategoriesQuery } from '../../graphql/homePageQueries';
import { makeNavbarQueryWithDislikeRestrictions } from '../../graphql/makeQuery';
import { redirectToLogin } from '@/hoc/requireAuth';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { V5_API_URL } from '@/globals/apiUrl';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { AmplitudeExperimentFlags } from '../utils/amplitude/AmplitudeExperimentFlags';
import { UserContextType } from '@/context/User/UserContext';
import { WebPlatformAdapter } from '@/utils/WebPlatformAdapter';
import { CategoriesData, SimpleCategoryData, excludeEventCategory } from '@bluelightcard/shared-ui';

export type CompanyType = {
  id: string;
  legacyId?: string;
  name: string;
};

const sortByAlphabeticalOrder = (
  a: SimpleCategoryData | CompanyType,
  b: SimpleCategoryData | CompanyType
) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

const useFetchCompaniesOrCategories = (userCtx: UserContextType) => {
  const [categories, setCategories] = useState<CategoriesData>([]);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const modernCategoriesEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_CATEGORIES,
    'off'
  );
  const offersCmsExperiment = useAmplitudeExperiment('cms-offers', 'off');
  const useLegacyIds = offersCmsExperiment.data?.variantName !== 'on';

  const platformAdapter = usePlatformAdapter();

  useEffect(() => {
    if (modernCategoriesEnabled.status === 'pending' || offersCmsExperiment.status === 'pending')
      return;
    const currentFetchCompaniesAndCategories = async () => {
      if (!userCtx.user || userCtx.error) return;

      try {
        setIsLoading(true);
        const companiesCategoriesQueryResponse = await makeNavbarQueryWithDislikeRestrictions(
          companiesCategoriesQuery(OFFERS_BRAND, userCtx.isAgeGated),
          userCtx.dislikes
        );

        const {
          data: {
            response: { categories: categoriesData, companies: companiesData },
          },
        } = companiesCategoriesQueryResponse;

        if (categoriesData.length > 1) {
          setCategories(categoriesData);
        }

        if (companiesData.length > 1) {
          setCompanies(companiesData);
        }
        setIsLoading(false);
      } catch (error) {
        redirectToLogin(router);
      }
    };

    const experimentFetchCompaniesAndCategories = async () => {
      if (!userCtx.user || userCtx.error) return;

      try {
        setIsLoading(true);

        const [companies, categories] = await Promise.all([
          getCompanies(platformAdapter, useLegacyIds),
          getCategories(platformAdapter),
        ]);

        setCompanies(companies);
        setCategories(categories);

        setIsLoading(false);
      } catch (error) {
        redirectToLogin(router);
      }
    };

    if (modernCategoriesEnabled.data?.variantName === 'on') {
      experimentFetchCompaniesAndCategories();
    } else {
      currentFetchCompaniesAndCategories();
    }
  }, [
    router,
    userCtx.dislikes,
    userCtx.error,
    userCtx.isAgeGated,
    userCtx.user,
    modernCategoriesEnabled.data?.variantName,
    offersCmsExperiment.status,
    modernCategoriesEnabled.status,
    useLegacyIds,
    platformAdapter,
  ]);

  return { categories, companies, isLoading };
};

const getCompanies = async (platformAdapter: WebPlatformAdapter, useLegacyIds: boolean) => {
  const companiesResponse = await platformAdapter.invokeV5Api(V5_API_URL.Companies, {
    method: 'GET',
  });

  const companiesCollection = JSON.parse(companiesResponse.data);
  if (companiesCollection.data.length > 0) {
    const companies: CompanyType[] = mapCompanyResponse(companiesCollection.data, useLegacyIds);
    return [...companies].sort(sortByAlphabeticalOrder);
  }

  return [];
};

const getCategories = async (platformAdapter: WebPlatformAdapter) => {
  const categoriesResponse = await platformAdapter.invokeV5Api(V5_API_URL.Categories, {
    method: 'GET',
  });

  const shouldIncludeEvents =
    platformAdapter.getAmplitudeFeatureFlag(AmplitudeExperimentFlags.ENABLE_EVENTS_AS_OFFERS) ===
    'on';

  return excludeEventCategory(
    JSON.parse(categoriesResponse.data).data as CategoriesData,
    shouldIncludeEvents
  );
};

const mapCompanyResponse = (data: any[], useLegacyIds: boolean): CompanyType[] => {
  return data.map((company: any) => ({
    id:
      useLegacyIds && company.legacyCompanyID !== undefined
        ? company.legacyCompanyID?.toString()
        : company.companyID,
    legacyId: company.legacyCompanyID?.toString(),
    name: company.companyName,
  }));
};

export default useFetchCompaniesOrCategories;
