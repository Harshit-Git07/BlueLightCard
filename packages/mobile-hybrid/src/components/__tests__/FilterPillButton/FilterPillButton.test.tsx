import FilterPillButton from '@/components/FilterPillButton/FilterPillButton';
import { FilterPillButtonProps } from '@/components/FilterPillButton/types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('FilterPillButton component', () => {
  let props: FilterPillButtonProps;

  beforeEach(() => {
    props = {
      onSelected: jest.fn(),
      onDeselected: jest.fn(),
      selected: [],
      pills: [
        { text: 'Featured', value: 'featured' },
        { text: 'Recent', value: 'recent' },
      ],
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      const { container } = render(<FilterPillButton {...props} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onSelected when a deselected pill is clicked', async () => {
      render(<FilterPillButton {...props} />);
      const pillToSelect = props.pills[0].text;
      const filterButton = screen.getByText(pillToSelect);

      fireEvent.click(filterButton);

      expect(props.onSelected).toHaveBeenCalledWith('featured');
    });

    it('should invoke onDeselected when a selected pill is clicked', async () => {
      props.selected = ['featured'];
      render(<FilterPillButton {...props} />);
      const pillToDeselect = props.pills[0].text;
      const filterButton = screen.getByText(pillToDeselect);

      fireEvent.click(filterButton);

      expect(props.onDeselected).toHaveBeenCalledWith('featured');
    });

    it('should return the selected pills after clicking', async () => {
      props.selected = ['featured'];
      render(<FilterPillButton {...props} />);
      const pillToSelect = props.pills[1].text;
      const filterButton = screen.getByText(pillToSelect);

      fireEvent.click(filterButton);

      expect(props.onSelected).toHaveBeenCalledWith('recent');
    });
  });
});
