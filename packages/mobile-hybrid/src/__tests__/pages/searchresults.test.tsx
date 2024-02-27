import SearchResultsPage from '@/pages/searchresults';
import { render, screen } from '@testing-library/react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import '@testing-library/jest-dom/extend-expect';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl } from '@/globals';
import { FC, PropsWithChildren } from 'react';
import Spinner from '@/modules/Spinner';

jest.mock('@/invoke/apiCall');

const searchValue = 'test';
const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    search: searchValue,
  },
};

describe('Search Results', () => {
  describe('Feature Flags', () => {
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

  describe('Search query params', () => {
    it('should set the search term from the query params', async () => {
      const requestMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());

      whenPageIsRenderedWithFlags({});

      expect(requestMock).toHaveBeenCalledWith(APIUrl.Search, {
        term: searchValue,
      });
    });

    it('should show the spinner when search is made', async () => {
      whenPageIsRenderedWithFlags({});

      const spinner = screen.queryByRole('progressbar');
      expect(spinner).toBeTruthy();
    });
  });
});

const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
      <Spinner />
    </div>
  );
};

const whenPageIsRenderedWithFlags = (featureFlags: any) => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, featureFlags]]}>
        <WithSpinner>
          <SearchResultsPage />
        </WithSpinner>
      </JotaiTestProvider>
    </RouterContext.Provider>,
  );
};
