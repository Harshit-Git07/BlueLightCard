export interface SearchProps {
  value?: string;
  showBackArrow?: boolean;
  onSearch: (searchTerm: string) => void;
  labelText?: string;
  onBackButtonClick?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  placeholderText?: string;
  experimentalSearchVariant?: string;
  className?: string;
}
