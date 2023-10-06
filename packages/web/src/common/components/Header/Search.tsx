import { FC, useState } from 'react';
import Button from '../Button/Button';
import Heading from '../Heading/Heading';
import InputSelectFieldWithRef from '../InputSelectField/InputSelectField';
import InputTextFieldWithRef from '../InputTextField/InputTextField';
import { SearchProps } from './types';

const Search: FC<SearchProps> = ({
  onSearchCompanyChange,
  onSearchCategoryChange,
  onSearchTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const changeCompanyHandler = (event: any) => {
    const company = companyData.find((comp) => comp.companyId == event?.target.value);
    if (!company) {
      return;
    }
    onSearchCompanyChange(company.companyId, company.companyName);
  };

  const changeCategoryHandler = (event: any) => {
    const category = categoryData.find((cat) => cat.categoryId == event.target.value);
    if (!category) {
      return;
    }
    onSearchCategoryChange(category.categoryId, category.categoryName);
  };

  const searchTermHandler = () => {
    onSearchTerm(searchTerm);
  };

  const companyData: { companyName: string; companyId: number }[] = [
    { companyName: 'ASDA', companyId: 25147 },
    { companyName: '11 DEGRESS', companyId: 15939 },
  ];

  const categoryData: { categoryName: string; categoryId: number }[] = [
    { categoryName: 'Children and toys', categoryId: 11 },
    { categoryName: 'Days out', categoryId: 3 },
  ];
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
                  options={companyData.map((comp) => ({
                    value: comp.companyId,
                    text: comp.companyName,
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
                  options={categoryData.map((cat) => ({
                    value: cat.categoryId,
                    text: cat.categoryName,
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
