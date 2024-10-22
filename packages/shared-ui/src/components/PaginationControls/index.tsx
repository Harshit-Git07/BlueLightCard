import { usePagination, DOTS } from './usePagination';
import { PaginationControlsProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/pro-regular-svg-icons';
import { faker } from '@faker-js/faker';

const PaginationControls = (props: PaginationControlsProps) => {
  const { onPageChange, totalPages, siblingCount = 1, currentPage, disabled = false } = props;

  const paginationRange = usePagination({
    currentPage,
    totalPages,
    siblingCount,
  });

  if (currentPage === 0 || (paginationRange?.length ?? 0) < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange?.[paginationRange.length - 1];

  return (
    <section className="flex justify-center items-center gap-2">
      <button
        className={`border flex justify-center items-center rounded h-[35px] w-[35px] font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body ${currentPage === 1 ? 'text-colour-onSurface-disabled-light dark:text-colour-onSurface-disabled-dark border-colour-onSurface-disabled-light dark:border-colour-onSurface-disabled-dark cursor-pointer-none' : 'border-colour-onSurface-outline-light dark:boder-colour-onSurface-outline-dark text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark hover:bg-colour-surface-container-light hover:bg-colour-surface-container-dark'}`}
        onClick={!disabled && currentPage !== 1 ? onPrevious : undefined}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      {paginationRange?.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={faker.string.uuid()}
              className="border flex items-center justify-center rounded w-[35px] h-[35px] border-colour-onSurface-outline-light dark:boder-colour-onSurface-outline-dark text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark cursor-default font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body"
            >
              &#8230;
            </li>
          );
        }

        return (
          <button
            key={pageNumber}
            className={`border flex items-center justify-center rounded cursor-pointer w-[35px] h-[35px] font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body ${pageNumber === currentPage ? 'bg-colour-primary-light dark:bg-colour-primary-dark text-colour-onPrimary-light dark:text-colour-onPrimary-dark border-colour-primary-light dark:border-colour-primary-dark' : 'text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark hover:bg-colour-surface-container-light hover:bg-colour-surface-container-dark'} border-colour-onSurface-outline-light dark:border-colour-onSurface-outline-dark`}
            onClick={() => !disabled && onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        className={`border flex justify-center items-center rounded h-[35px] w-[35px] font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body ${currentPage === lastPage ? 'text-colour-onSurface-disabled-light dark:text-colour-onSurface-disabled-dark border-colour-onSurface-disabled-light dark:border-colour-onSurface-disabled-dark cursor-pointer-none' : 'border-colour-onSurface-outline-light dark:boder-colour-onSurface-outline-dark text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark hover:bg-colour-surface-container-light hover:bg-colour-surface-container-dark'}`}
        onClick={!disabled && currentPage !== lastPage ? onNext : undefined}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </section>
  );
};

export default PaginationControls;
