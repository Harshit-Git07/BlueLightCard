import { FC, useEffect, useState, useContext } from 'react';
import Button from '../Button/Button';
import Heading from '../Heading/Heading';
import InputSelectFieldWithRef from '../InputSelectField/InputSelectField';
import InputTextFieldWithRef from '../InputTextField/InputTextField';
import { SearchProps } from './types';
import { CategoryType, CompanyType } from '@/page-types/members-home';
import { BRAND } from '@/global-vars';
import { companiesCategoriesQuery } from '../../../graphql/homePageQueries';
import { makeNavbarQueryWithDislikeRestrictions, makeQuery } from '../../../graphql/makeQuery';
import { redirectToLogin } from '@/hoc/requireAuth';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/offers/components/LoadingSpinner/LoadingSpinner';
import UserContext from '@/context/User/UserContext';

const sortByAlphabeticalOrder = (a: CategoryType | CompanyType, b: CategoryType | CompanyType) => {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
};

const Search: FC<SearchProps> = ({
  onSearchCompanyChange,
  onSearchCategoryChange,
  onSearchTerm,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const userCtx = useContext(UserContext);

  const changeCompanyHandler = (event: any) => {
    const company =
      event?.target.value && companies && companies.find((comp) => comp.id == event?.target.value);
    if (!company) return;
    setIsSearching(true);
    onSearchCompanyChange(company.id, company.name);
  };

  const changeCategoryHandler = (event: any) => {
    const category =
      event?.target.value && categories && categories.find((cat) => cat.id == event?.target.value);
    if (!category) return;
    setIsSearching(true);
    onSearchCategoryChange(category.id, category.name);
  };

  const searchTermHandler = () => {
    if (!searchTerm) return;
    setIsSearching(true);
    onSearchTerm(searchTerm);
  };

  useEffect(() => {
    // This sets the isSearching flag to false when the user navigates away from the page and then comes back
    // on safari useEffect and useLayoutEffect don't retrigger when you navigate back to the page and states persist between these navigations
    window.addEventListener(
      'pageshow',
      function (event) {
        if (event.persisted) {
          setIsSearching(false);
        }
      },
      false
    );
  }, []);

  // Fetch Data on first load
  useEffect(() => {
    const fetchData = async () => {
      if (!userCtx.user || userCtx.error) return;

      try {
        setIsLoading(true);
        const companiesCategoriesQueryPromise = makeNavbarQueryWithDislikeRestrictions(
          companiesCategoriesQuery(BRAND, userCtx.isAgeGated),
          userCtx.dislikes
        );

        const companiesCategoriesQueryResponse = await companiesCategoriesQueryPromise;

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

  const loadingText = 'Loading...';
  const companyDefaultOption = isLoading ? loadingText : 'by company';
  const categoryDefaultOption = isLoading ? loadingText : 'by category';

  return (
    <div className="absolute px-[9%] w-full">
      <div className="border-t-[#c36] border-t border-solid bg-[#f8f8f8] rounded-[0_0_10px_10px] p-5 shadow-[0px_6px_12px_rgba(0,0,0,0.176)] mr-14 z-[100] relative">
        <Heading headingLevel="h2">Find offers</Heading>
        <div className="tablet:flex">
          <div className="w-[100%] desktop:flex tablet:w-[60%]">
            <div
              className="w-[100%] pb-5 desktop:w-[50%] tablet:w-[90%] tablet:pr-8"
              data-testid="byCompany"
            >
              <label>By company</label>
              <InputSelectFieldWithRef
                disabled={isLoading}
                defaultOption={companyDefaultOption}
                onChange={changeCompanyHandler}
                options={companies.map((comp) => ({
                  value: comp.id,
                  text: comp.name,
                }))}
              />
            </div>
            <div
              className="w-[100%] pb-5 desktop:w-[50%] tablet:w-[90%] tablet:pr-8"
              data-testid="byCategory"
            >
              <label>
                <i>or</i> by category
              </label>
              <InputSelectFieldWithRef
                disabled={isLoading}
                defaultOption={categoryDefaultOption}
                onChange={changeCategoryHandler}
                options={categories.map((cat) => ({
                  value: cat.id,
                  text: cat.name,
                }))}
              />
            </div>
          </div>
          <div className="tablet:w-[40%]">
            <div className="w-full pb-5 desktop:w-[50%]" data-testid="byPhrase">
              <label>
                <i>or </i> by phrase
              </label>
              <InputTextFieldWithRef
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    searchTermHandler();
                  }
                }}
              />
            </div>
            <div data-testid="searchNowBtn">
              <Button
                className="w-full text"
                onClick={searchTermHandler}
                disabled={isSearching || isLoading}
              >
                {isLoading || isSearching ? (
                  <LoadingSpinner
                    containerClassName="text-palette-white"
                    spinnerClassName="text-[1.5em]"
                  />
                ) : (
                  <>Search now</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
