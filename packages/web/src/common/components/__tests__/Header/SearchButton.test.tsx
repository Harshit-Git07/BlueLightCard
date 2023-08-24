import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchButton from '@/components/Header/SearchButton';

describe('SearchButton component', () => {
  describe('smoke test', () => {
    it('should render component without error', () => {
      render(
        <SearchButton
          displaySearch={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      );
      const searchBtn = screen.findByDisplayValue('faMagnifyingGlass');
      expect(searchBtn).toBeTruthy();
    });
  });

  it('should call the displaySearch prop when clicked', () => {
    // Create a mock function for the displaySearch prop
    const mockDisplaySearch = jest.fn();

    // Render the SearchButton component with the mock function
    const { getByTestId } = render(<SearchButton displaySearch={mockDisplaySearch} />);

    // Find the search button by its data-testid attribute
    const searchButton = getByTestId('searchBtn');

    // Simulate a click event on the search button
    fireEvent.click(searchButton);

    // Check if the mock function was called exactly once
    expect(mockDisplaySearch).toHaveBeenCalledTimes(1);
  });
});
