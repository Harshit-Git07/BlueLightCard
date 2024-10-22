export interface PaginationControlsProps {
  onPageChange: (page: number) => void;
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
  disabled?: boolean;
}

export type usePaginationProps = {
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
};
