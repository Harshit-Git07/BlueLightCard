export type SearchInputFieldProps = {
  iconLocation: 'left' | 'right';
  icon?: React.ReactNode;
  prefillData?: string;
  onSubmit?: (searchTerm: string) => void;
};
