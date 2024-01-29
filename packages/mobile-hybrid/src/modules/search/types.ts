export interface SearchModuleProps {
  variant: SearchVariant;
  showFilterButton: boolean;
  searchDomain: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export enum SearchVariant {
  Primary,
  Secondary,
}
