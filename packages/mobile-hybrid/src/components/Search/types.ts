export interface SearchProps {
  value?: string;
  onSearch: (searchTerm: string) => void;
  labelText?: string;
  onBackButtonClick?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  placeholderText?: string;
}
