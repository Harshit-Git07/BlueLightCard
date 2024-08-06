import React, { FC, useContext } from 'react';
import { SearchDropDownProps } from './types';
import Link from '@/components/Link/Link';
import InputTypeSelect from '@/components/InputTypeSelect/InputTypeSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/pro-solid-svg-icons';
import { PillGroup } from '@bluelightcard/shared-ui';
import UserContext from '@/context/User/UserContext';
import useFetchCompaniesOrCategories, {
  CategoryType,
  CompanyType,
} from '@/hooks/useFetchCompaniesOrCategories';

type SearchDropDownPresenterProps = {
  onSearchCategoryChange: (categoryId: string, categoryName: string) => void;
  onSearchCompanyChange: (companyId: string, companyName: string) => void;
  categories: CategoryType[];
  companies: CompanyType[];
  isLoading: boolean;
};

export const SearchDropDownPresenter = ({
  categories,
  companies,
  isLoading,
  onSearchCategoryChange,
  onSearchCompanyChange,
}: SearchDropDownPresenterProps) => {
  const changeCategoryHandler = (categoryId: string, categoryName: string) => {
    onSearchCategoryChange(categoryId, categoryName);
  };

  const changeCompanyHandler = (companyId: string, companyName: string) => {
    onSearchCompanyChange(companyId, companyName);
  };

  return (
    <div className="mx-auto pt-[54px] pb-[100px] max-w-[1408px]">
      <div className="flex gap-2 px-4 py-[10px]">
        <Link href={`/nearme.php`} useLegacyRouting>
          <FontAwesomeIcon icon={faLocationDot} size="lg" className="mr-2" />
          <span className="font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body">
            Offers near you
          </span>
        </Link>
      </div>
      <div className="my-[22px] px-4">
        <PillGroup
          title={'Browse categories'}
          pillGroup={categories.map((cat) => ({
            id: Number(cat.id),
            label: cat.name,
          }))}
          onSelectedPill={(id) => {
            const selectedCategory = categories.find((cat) => cat.id === id.toString());
            if (selectedCategory) {
              changeCategoryHandler(selectedCategory.id, selectedCategory.name);
            }
          }}
        />
      </div>
      <div className="px-4">
        <p className="mb-2 font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large text-colour-onSurface-light dark:text-colour-onSurface-dark">
          Browse companies
        </p>
        <InputTypeSelect
          options={companies.map((cat) => ({
            id: cat.id,
            label: cat.name,
          }))}
          placeholder={'Select company'}
          onSelect={(id: string) => {
            const selectedCategory = companies.find((comp) => comp.id === id);
            if (selectedCategory) {
              changeCompanyHandler(selectedCategory.id, selectedCategory.name);
            }
          }}
        />
      </div>
    </div>
  );
};

const SearchDropDown: FC<SearchDropDownProps> = ({
  onSearchCategoryChange,
  onSearchCompanyChange,
}) => {
  const userCtx = useContext(UserContext);
  const { categories, companies, isLoading } = useFetchCompaniesOrCategories(userCtx);

  return (
    <SearchDropDownPresenter
      isLoading={isLoading}
      companies={companies}
      categories={categories}
      onSearchCategoryChange={onSearchCategoryChange}
      onSearchCompanyChange={onSearchCompanyChange}
    />
  );
};

export default SearchDropDown;
