import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TrendingSearches from '@/components/TrendingSearches/TrendingSearches';
import TrendingSearchesData from '@/data/TrendingSearches';

describe('TrendingSearches', () => {
  const mockProps = {
    trendingSearches: TrendingSearchesData,
    onTermClick: jest.fn(),
  };

  it('renders the component', () => {
    const { container } = render(<TrendingSearches {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('registers a user has interacted with a button', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<TrendingSearches {...mockProps} onTermClick={handleClick} />);

    const button = getByText(/LOOKFANTASTIC/i);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
