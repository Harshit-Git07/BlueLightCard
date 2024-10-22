import { useMemo } from 'react';
import { usePaginationProps } from './types';

export const DOTS = '...';

const range = (start: any, end: any) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const calculateItemCount = (siblingCount: number): number => {
  return 3 + 2 * siblingCount;
};

export const usePagination = ({
  totalPages,
  siblingCount = 1,
  currentPage,
}: usePaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = totalPages;
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // siblingCount is the number of sibling pages to show on either side of the current page
    // this condition checks if the pagination should show right DOTS but no left DOTS, case where currentPage is close to the beginning
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = calculateItemCount(siblingCount);
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    // this condition checks if the pagination should show left DOTS but no right DOTS, case where currentPage is close to the end
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = calculateItemCount(siblingCount);
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};
