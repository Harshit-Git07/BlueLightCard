import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Pagination/Pagination';
import { PaginationProps } from '@/components/Pagination/types';

describe('Pagination component', () => {
  let props: PaginationProps;

  beforeEach(() => {
    props = {
      totalPages: 10,
      page: 1,
      onChange: jest.fn(),
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Pagination {...props} data-testid="pagination-component" />);

      const pagination = screen.getByTestId('pagination-component');

      expect(pagination).toBeTruthy();
    });
  });

  describe('functionality tests', () => {
    it('should render the correct number of pages', () => {
      render(<Pagination {...props} />);

      const pageButtons = screen.getAllByRole('button');
      expect(pageButtons.length).toBe(props.totalPages + 2); // +2 for previous and next buttons
    });

    it('should call onChange with the correct page number when a page button is clicked', () => {
      render(<Pagination {...props} />);

      const pageButton = screen.getByText('2');
      fireEvent.click(pageButton);

      expect(props.onChange).toHaveBeenCalledWith(2);
    });

    it('should call onChange with the correct page number when the next button is clicked', () => {
      render(<Pagination {...props} />);

      const nextButton = screen.getByRole('button', { name: 'page-next' });
      fireEvent.click(nextButton);

      expect(props.onChange).toHaveBeenCalledWith(2);
    });

    it('should call onChange with the correct page number when the previous button is clicked', () => {
      props.page = 2;
      render(<Pagination {...props} />);

      const prevButton = screen.getByRole('button', { name: 'page-previous' });
      fireEvent.click(prevButton);

      expect(props.onChange).toHaveBeenCalledWith(1);
    });
  });
});
