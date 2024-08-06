import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OFFERS_BRAND } from '@/global-vars';
import { companiesCategoriesQuery } from '../../graphql/homePageQueries';
import { makeNavbarQueryWithDislikeRestrictions } from '../../graphql/makeQuery';
import { redirectToLogin } from '@/hoc/requireAuth';

export type CompanyType = {
  id: string;
  name: string;
};

export type CategoryType = {
  id: string;
  name: string;
};

const sortByAlphabeticalOrder = (a: CategoryType | CompanyType, b: CategoryType | CompanyType) => {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
};

const useFetchCompaniesOrCategories = (userCtx: any) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
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
          const sortedCategories = [...categoriesData].sort(sortByAlphabeticalOrder);
          setCategories(sortedCategories);
        }

        if (companiesData.length > 1) {
          const sortedCompanies = [...companiesData].sort(sortByAlphabeticalOrder);
          setCompanies(sortedCompanies);
        }
        setIsLoading(false);
      } catch (error) {
        redirectToLogin(router);
      }
    };

    fetchData();
  }, [router, userCtx.user, userCtx.error, userCtx.dislikes, userCtx.isAgeGated]);

  return { categories, companies, isLoading };
};

export default useFetchCompaniesOrCategories;
