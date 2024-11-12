export interface SearchModuleProps {
  placeholder?: string;
  showOverlay?: boolean;
  children?: React.ReactNode;
}

export interface SearchProps {
  value?: string;
  showBackArrow?: boolean;
  onSearch: (searchTerm: string) => void;
  labelText?: string;
  onBackButtonClick?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  placeholderText?: string;
}
