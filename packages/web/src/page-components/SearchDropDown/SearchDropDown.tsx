import React, { FC, useContext, useEffect, useRef } from 'react';
import { SearchDropDownProps } from './types';
import { Dropdown, PillGroup } from '@bluelightcard/shared-ui';
import UserContext from '@/context/User/UserContext';
import useFetchCompaniesOrCategories, { CompanyType } from '@/hooks/useFetchCompaniesOrCategories';
import { PillProps } from '@bluelightcard/shared-ui/components/PillGroup/types';
import { isCategorySelected } from './helpers/isCategorySelected';

type SearchDropDownPresenterProps = {
  onSearchCategoryChange: (categoryId: string, categoryName: string) => void;
  onSearchCompanyChange: (companyId: string, companyName: string) => void;
  onClose: () => void;
  isOpen: boolean;
  categoriesForPillGroup: PillProps[];
  companies: CompanyType[];
};

export const SearchDropDownPresenter = ({
  categoriesForPillGroup,
  companies,
  isOpen,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onClose,
}: SearchDropDownPresenterProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) return <></>;

  const onCompanyDropdownOpen = () => {
    if (!dialogRef.current) return;

    // Ensure that dropdown listbox is scrolled into view when opened
    dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
  };

  return (
    <div className="w-full">
      <div
        id="search-dropdown-overlay"
        data-testid="search-dropdown-overlay"
        className="w-full h-[100vh] bg-black/50 absolute backdrop-blur-sm"
        onClick={onClose}
        aria-hidden={true}
      />

      <dialog
        className="w-full h-auto max-h-[80vh] bg-colour-surface dark:bg-colour-surface-dark block absolute z-10 overflow-y-auto"
        ref={dialogRef}
        onClose={onClose}
        onCancel={onClose}
      >
        <div className="mx-auto tablet:pt-[54px] pb-[100px] max-w-[1408px]">
          <div className="mb-[22px] px-4">
            <PillGroup
              title={'Browse categories'}
              pillGroup={categoriesForPillGroup}
              onSelectedPill={(pill) => {
                if (pill) {
                  onSearchCategoryChange(pill.id.toString(), pill.label);
                }
              }}
            />
          </div>

          <div className="px-4">
            <p className="mb-2 font-typography-title-large font-typography-title-large-weight text-typography-title-large leading-typography-title-large tracking-typography-title-large text-colour-onSurface-light dark:text-colour-onSurface-dark">
              Browse companies
            </p>

            <Dropdown
              customClass="max-h-[240px]"
              options={companies.map((cat) => ({
                id: cat.id,
                label: cat.name,
              }))}
              placeholder="Search for a company"
              searchable
              onSelect={(option) => {
                if (option) {
                  onSearchCompanyChange(option.id, option.label);
                }
              }}
              onOpen={onCompanyDropdownOpen}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
};

const SearchDropDown: FC<SearchDropDownProps> = ({
  isOpen = false,
  onSearchCategoryChange,
  onSearchCompanyChange,
  onClose,
}) => {
  const userCtx = useContext(UserContext);
  const { categories, companies } = useFetchCompaniesOrCategories(userCtx);

  const categoriesForPillGroup = categories.map((cat) => ({
    id: Number(cat.id),
    label: cat.name,
    selected: isCategorySelected(cat.id, window.location.pathname),
  }));

  return isOpen ? (
    <SearchDropDownPresenter
      isOpen={isOpen}
      companies={companies}
      categoriesForPillGroup={categoriesForPillGroup}
      onSearchCategoryChange={onSearchCategoryChange}
      onSearchCompanyChange={onSearchCompanyChange}
      onClose={onClose}
    />
  ) : null;
};

export default SearchDropDown;
