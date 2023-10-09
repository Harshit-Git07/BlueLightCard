import { FC, useEffect, useState } from 'react';
import Button from '../Button/Button';
import Heading from '../Heading/Heading';
import InputSelectFieldWithRef from '../InputSelectField/InputSelectField';
import InputTextFieldWithRef from '../InputTextField/InputTextField';
import { SearchProps } from './types';
import { CategoryType, CompanyType } from '@/page-types/members-home';
import { BRAND } from '@/global-vars';
import { companiesCategoriesQuery } from '../../../graphql/homePageQueries';
import makeQuery from '../../../graphql/makeQuery';
import { redirectToLogin } from '@/hoc/withAuth';
import { useRouter } from 'next/router';

const sortByAlphabeticalOrder = (a: CategoryType | CompanyType, b: CategoryType | CompanyType) => {
  if (a.name < b.name) return -1;
  else if (a.name > b.name) return 1;
  return 0;
};

const companyPlaceholder = { id: '0', name: 'by company' };
const categoryPlaceholder = { id: '0', name: 'by category' };

const Search: FC<SearchProps> = ({
  onSearchCompanyChange,
  onSearchCategoryChange,
  onSearchTerm,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState<CategoryType[]>([categoryPlaceholder]);
  const [companies, setCompanies] = useState<CompanyType[]>([companyPlaceholder]);

  const changeCompanyHandler = (event: any) => {
    const company = companies && companies.find((comp) => comp.id == event?.target.value);
    if (!company) return;
    onSearchCompanyChange(company.id, company.name);
  };

  const changeCategoryHandler = (event: any) => {
    const category = categories && categories.find((cat) => cat.id == event.target.value);
    if (!category) return;
    onSearchCategoryChange(category.id, category.name);
  };

  const searchTermHandler = () => {
    if (!searchTerm) return;
    onSearchTerm(searchTerm);
  };

  // Fetch Data on first load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesCategoriesQueryPromise = makeQuery(companiesCategoriesQuery(BRAND));

        const companiesCategoriesQueryResponse = await companiesCategoriesQueryPromise;

        const {
          data: {
            response: { categories: categoriesData, companies: companiesData },
          },
        } = companiesCategoriesQueryResponse;

        if (categoriesData.length > 1) {
          const sortedCategories = [...categoriesData].sort(sortByAlphabeticalOrder);
          setCategories([categoryPlaceholder, ...sortedCategories]);
        }

        if (companiesData.length > 1) {
          const sortedCompanies = [...companiesData].sort(sortByAlphabeticalOrder);
          setCompanies([companyPlaceholder, ...sortedCompanies]);
        }
      } catch (error) {
        redirectToLogin(router);
      }
    };

    fetchData();
  }, []);

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
              <form action={'/'} method="GET">
                <InputSelectFieldWithRef
                  onChange={changeCompanyHandler}
                  options={companies.map((comp) => ({
                    value: comp.id,
                    text: comp.name,
                  }))}
                />
              </form>
            </div>
            <div
              className="w-[100%] pb-5 desktop:w-[50%] tablet:w-[90%] tablet:pr-8"
              data-testid="byCategory"
            >
              <label>
                <i>or</i> by category
              </label>
              <form action={'/'} method="GET">
                <InputSelectFieldWithRef
                  onChange={changeCategoryHandler}
                  options={categories.map((cat) => ({
                    value: cat.id,
                    text: cat.name,
                  }))}
                />
              </form>
            </div>
          </div>
          <div className="tablet:w-[40%]">
            <form action={'/'} method="GET">
              <div className="w-full pb-5 desktop:w-[50%]" data-testid="byPhrase">
                <label>
                  <i>or </i> by phrase
                </label>
                <InputTextFieldWithRef
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
              </div>
              <div data-testid="searchNowBtn">
                <Button className="w-full text" onClick={searchTermHandler}>
                  Search now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
