import SearchResultsPage from '@/pages/searchresults';
import { render, screen } from '@testing-library/react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import '@testing-library/jest-dom/extend-expect';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    searchTerm: 'test',
  },
};

describe('Search Results', () => {
  it('should show browse categories when feature enabled', () => {
    whenPageIsRenderedWithFlags({ [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'on' });

    expect(screen.queryByText('Browse Categories')).toBeInTheDocument();
  });

  it('should not show browse categories when feature disabled', () => {
    whenPageIsRenderedWithFlags({ [FeatureFlags.SEARCH_RESULTS_PAGE_CATEGORIES_LINKS]: 'off' });

    expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
  });

  it('should not show browse categories when feature flag not found', () => {
    whenPageIsRenderedWithFlags({});

    expect(screen.queryByText('Browse Categories')).not.toBeInTheDocument();
  });
});

const whenPageIsRenderedWithFlags = (featureFlags: any) => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <SearchResultsPage />
      </JotaiTestProvider>
    </RouterContext.Provider>,
  );
};
