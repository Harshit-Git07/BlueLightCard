import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PaginationControls from './index';
import { usePagination, DOTS } from './usePagination';
import { PaginationControlsProps, usePaginationProps } from './types';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: jest.fn(() => <span>Icon</span>),
}));

describe('usePagination', () => {
  const renderPaginationHook = (props: usePaginationProps) => {
    return renderHook(() => usePagination(props));
  };

  it('returns the correct pagination range with left dots', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 1,
      currentPage: 18,
    });

    expect(result.current).toEqual([1, DOTS, 16, 17, 18, 19, 20]);
  });

  it('returns the correct pagination range with right dots', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 1,
      currentPage: 3,
    });

    expect(result.current).toEqual([1, 2, 3, 4, 5, DOTS, 20]);
  });

  it('returns the correct pagination range with both left and right dots', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 1,
      currentPage: 10,
    });

    expect(result.current).toEqual([1, DOTS, 9, 10, 11, DOTS, 20]);
  });

  it('returns the correct pagination range when sibling count is 0', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 0,
      currentPage: 10,
    });

    expect(result.current).toEqual([1, DOTS, 10, DOTS, 20]);
  });

  it('returns the correct pagination range when current page is the first page', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 1,
      currentPage: 1,
    });

    expect(result.current).toEqual([1, 2, 3, 4, 5, DOTS, 20]);
  });

  it('returns the correct pagination range when current page is the last page', () => {
    const { result } = renderPaginationHook({
      totalPages: 20,
      siblingCount: 1,
      currentPage: 20,
    });

    expect(result.current).toEqual([1, DOTS, 16, 17, 18, 19, 20]);
  });
});

describe('PaginationControls component', () => {
  const mockOnPageChange = jest.fn();
  const mockTotalPages = 50;

  const renderComponent = (props: PaginationControlsProps) => {
    return render(
      <PaginationControls
        currentPage={props.currentPage}
        totalPages={mockTotalPages}
        onPageChange={mockOnPageChange}
        disabled={props.disabled}
      />,
    );
  };

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = renderComponent({
      currentPage: 1,
      totalPages: mockTotalPages,
      disabled: false,
      onPageChange: mockOnPageChange,
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onPageChange with the next page number when onNext is called', () => {
    renderComponent({
      currentPage: 1,
      totalPages: mockTotalPages,
      disabled: false,
      onPageChange: mockOnPageChange,
    });

    const nextButton = screen.getAllByRole('button', { name: /Icon/i })[1];
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with the previous page number when onPrevious is called', () => {
    renderComponent({
      currentPage: 1,
      totalPages: mockTotalPages,
      disabled: false,
      onPageChange: mockOnPageChange,
    });

    const prevButton = screen.getAllByRole('button', { name: /Icon/i })[0];
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});
