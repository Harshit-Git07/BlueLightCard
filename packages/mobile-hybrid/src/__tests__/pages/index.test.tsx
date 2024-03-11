import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '@/pages';
import { AppStore } from '@/store/types';
import { AppContext } from '@/store';
import '@testing-library/jest-dom';
import { APIUrl } from '@/globals';

describe('Home', () => {
  describe('Search Bar Experiment', () => {
    const placeholderText = 'Search stores or brands';
    it('should render when experiment enabled', () => {
      whenHomePageIsRendered({ 'homepage-searchbar': 'treatment' });

      const searchBar = screen.queryByPlaceholderText(placeholderText);

      expect(searchBar).toBeInTheDocument();
    });
    it('should not render when experiment disabled', () => {
      whenHomePageIsRendered({ 'homepage-searchbar': 'control' });

      const searchBar = screen.queryByPlaceholderText(placeholderText);

      expect(searchBar).not.toBeInTheDocument();
    });
  });
});

const whenHomePageIsRendered = (experiments: Record<string, string>) => {
  const mockAppContext: Partial<AppStore> = {
    experiments,
    apiData: {
      [APIUrl.FavouritedBrands]: [
        {
          cid: 1,
          companyname: 'Test Company',
          logos: 'test-logo.png',
        },
      ],
    },
  };

  render(
    <AppContext.Provider value={mockAppContext as AppStore}>
      <Home />
    </AppContext.Provider>,
  );
};
