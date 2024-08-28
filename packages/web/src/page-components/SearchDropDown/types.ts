export type SearchDropDownProps = {
  isOpen?: boolean;
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, categoryName: string) => void;
  onClose: () => void;
};
