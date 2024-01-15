import Filter from '@/components/Filter/Filter';
import { FilterProps } from '@/components/Filter/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Filter component', () => {
  let props: FilterProps;

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
      filterCount: 0,
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<Filter {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onClick when user clicks filter', async () => {
      render(<Filter {...props} />);

      const filterButton = screen.getByRole('button');

      await act(async () => {
        await userEvent.click(filterButton);
      });
      expect(props.onClick).toHaveBeenCalled();
    });
  });
});
