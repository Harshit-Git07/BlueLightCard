import { FC, PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import SearchResultsContainer from '@/modules/SearchResults/components/SearchResultsContainer';
import Spinner from '@/modules/Spinner';
import eventBus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';
import { SearchResults } from '../../types';

const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
      <Spinner />
    </div>
  );
};

const SearchResults = () => {
  return (
    <WithSpinner>
      <SearchResultsContainer />
    </WithSpinner>
  );
};

describe('Search results', () => {
  let bus = eventBus();

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

  describe('spinner', () => {
    it('should hide spinner on receiving api response', () => {
      bus.broadcast(Channels.API_RESPONSE, {
        url: `${APIUrl.Search}?term=nike`,
        response: {
          data: [],
        },
      });

      render(<SearchResults />);

      const spinner = screen.queryByRole('progressbar');

      expect(spinner).toBeFalsy();
    });
  });

  describe('render results', () => {
    it('should render list of results', () => {
      bus.broadcast(Channels.API_RESPONSE, {
        url: `${APIUrl.Search}?term=nike`,
        response: {
          data: [
            { id: 123, companyname: '', offername: '', s3logos: '' },
            { id: 124, companyname: '', offername: '', s3logos: '' },
          ] as SearchResults,
        },
      });

      render(<SearchResults />);

      const results = screen.getAllByRole('listitem');

      expect(results).toHaveLength(2);
    });
  });
});
