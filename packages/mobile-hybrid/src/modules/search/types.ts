export interface SearchModuleProps {
  variant: SearchVariant;
  showFilterButton: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}

export enum SearchVariant {
  Primary,
  Secondary,
}
