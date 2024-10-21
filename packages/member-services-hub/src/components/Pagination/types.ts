import { PropsWithChildren } from 'react';

export type PaginationProps = PropsWithChildren & {
  totalPages: number;
  page: number;
  onChange: (page: number) => void;
};
