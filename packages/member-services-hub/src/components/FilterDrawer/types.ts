import { Dispatch, SetStateAction } from 'react';

export interface FilterDrawerProps {
  heading: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  component: Array<{}>;
}

export interface FilterDrawerCheckboxProps {
  id: string;
  label: string;
}

export interface FilterDrawerSelectProps {
  id: string;
  placeHolder: string;
  values: Array<{}>;
}

export interface FilterDrawerOption {
  label?: string;
  value?: string;
}

export interface FilterDrawerChildren {
  title?: string;
  content?: Array<React.ReactElement>;
}
