import eventBus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';
import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { AppStore } from '@/store/types';
import { render, screen } from '@testing-library/react';
import { AppContext } from '@/store';
import '@testing-library/jest-dom/extend-expect';
import Offers from '..';
import { NewsStoreProvider } from '@/modules/news/store';

describe('Offers', () => {
  let bus = eventBus();

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
  });

  describe('Streamlined homepage experiment', () => {
    it('should not render "News" when experiment is on', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'on',
      };

      whenOffersModuleIsRendered(experiments);

      const newsTitle = screen.queryByText('Latest news');
      expect(newsTitle).not.toBeInTheDocument();
    });

    it('should render "News" when experiment is off', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'off',
      };

      whenOffersModuleIsRendered(experiments);

      const newsTitle = screen.queryByText('Latest news');
      expect(newsTitle).toBeInTheDocument();
    });
  });

  const whenOffersModuleIsRendered = (experiments: Record<string, string>) => {
    const mockAppContext: Partial<AppStore> = {
      experiments: experiments,
      apiData: {
        [APIUrl.News]: {
          data: [],
        },
      },
    };

    render(
      <AppContext.Provider value={mockAppContext as AppStore}>
        <NewsStoreProvider>
          <Offers />
        </NewsStoreProvider>
      </AppContext.Provider>,
    );
  };
});
