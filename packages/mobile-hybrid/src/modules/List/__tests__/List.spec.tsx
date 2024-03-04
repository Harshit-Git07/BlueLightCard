import { render, screen } from '@testing-library/react';
import List from '../List';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ListProps, ListVariant } from '../types';
import eventBus from '@/eventBus';
import '@testing-library/jest-dom';
import { APIUrl, Channels } from '@/globals';
import Spinner from '@/modules/Spinner';
import { FC, PropsWithChildren } from 'react';
import { offerListItemFactory } from '../__mocks__/factory';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';

jest.mock('@/../data/index.ts', () => ({
  offerListDataMap: {
    categories: [
      { id: 0, text: 'Cat One' },
      { id: 1, text: 'Cat Two' },
      { id: 3, text: 'Cat Three' },
    ],
    types: [
      { id: 0, text: 'Type One' },
      { id: 1, text: 'Type Two' },
      { id: 3, text: 'Type Three' },
    ],
  },
}));

const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
      <Spinner />
    </div>
  );
};

const ListWithSpinner: FC<ListProps> = (props) => {
  return (
    <WithSpinner>
      <List {...props} />
    </WithSpinner>
  );
};

describe('ListModule', () => {
  let props: ListProps;
  let bus = eventBus();
  let user: UserEvent;

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
    jest.resetAllMocks();
  });

  beforeEach(() => {
    props = {
      entityId: 0,
      listVariant: ListVariant.Types,
    };
    user = userEvent.setup();
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<ListWithSpinner {...props} />);
    });
  });

  describe('spinner', () => {
    it('should hide spinner on receiving api response', () => {
      bus.broadcast(Channels.API_RESPONSE, {
        url: APIUrl.Search,
        response: {
          data: [],
        },
      });

      render(<ListWithSpinner {...props} />);

      const spinner = screen.queryByRole('progressbar');

      expect(spinner).toBeFalsy();
    });
  });
  describe('render data', () => {
    it('should render list of results', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: offerListItemFactory.buildList(2),
        },
      });

      render(<ListWithSpinner {...props} />);

      const results = screen.getAllByRole('listitem');

      expect(results).toHaveLength(2);
    });
    it('should display "No results found." message when no data is present', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: [],
        },
      });

      render(<ListWithSpinner {...props} />);

      const noResultsMessage = screen.getByText('No results found.');
      const noListItem = screen.queryAllByRole('listitem');

      expect(noResultsMessage).toBeInTheDocument();
      expect(noListItem).toHaveLength(0);
    });
  });

  describe('"Load more" button ', () => {
    it('should change button text to "Loading..." when clicked', async () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: offerListItemFactory.buildList(20),
        },
      });
      render(<ListWithSpinner {...props} />);
      const loadMoreButton = screen.getByText('Load More');

      await user.click(loadMoreButton);
      expect(loadMoreButton).toHaveTextContent('Loading...');
    });
    it('should not show the button if there are no results', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: [],
        },
      });

      render(<ListWithSpinner {...props} />);

      const loadMoreButton = screen.queryByText('Load More');

      expect(loadMoreButton).not.toBeInTheDocument();
    });
    it('should not show the button if number of results is less than pagesize(20)', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: offerListItemFactory.buildList(4),
        },
      });

      render(<ListWithSpinner {...props} />);

      const loadMoreButton = screen.queryByText('Load More');

      expect(loadMoreButton).not.toBeInTheDocument();
    });
    it('should show the button if number of results match the pagesize(20)', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: offerListItemFactory.buildList(20),
        },
      });

      render(<ListWithSpinner {...props} />);

      const loadMoreButton = screen.getByText('Load More');

      expect(loadMoreButton).toBeInTheDocument();
    });
  });

  describe('heading', () => {
    it('should render categories heading that matches entityId', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 1;

      render(<ListWithSpinner {...props} />);

      const heading = screen.getByText('Cat Two');

      expect(heading).toBeInTheDocument();
    });

    it('should render types heading that matches entityId', () => {
      props.listVariant = ListVariant.Types;
      props.entityId = 1;

      render(<ListWithSpinner {...props} />);

      const heading = screen.getByText('Type Two');

      expect(heading).toBeInTheDocument();
    });

    it('should NOT render category heading that does NOT match entityId', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 4;

      render(<ListWithSpinner {...props} />);

      const heading = screen.queryByText('Cat Two');

      expect(heading).not.toBeInTheDocument();
    });
  });

  describe('log analytics events', () => {
    const analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    beforeEach(() => {
      bus.broadcast(Channels.API_RESPONSE, {
        url: '/api/4/offer/list.php',
        response: {
          data: offerListItemFactory.buildList(5),
        },
      });
    });

    describe('types list', () => {
      it('should log "type_list_viewed" analytic event on results returned', () => {
        props.listVariant = ListVariant.Types;
        props.entityId = 0;

        render(<ListWithSpinner {...props} />);

        expect(analyticsMock).toHaveBeenCalledWith({
          event: AmplitudeEvents.TYPE_LIST_VIEWED,
          parameters: {
            type_name: 'Type One',
            number_of_results: 5,
          },
        });
      });
    });

    describe('categories list', () => {
      it('should not log "type_list_viewed" analytic event on results returned', () => {
        props.listVariant = ListVariant.Categories;
        props.entityId = 0;

        render(<ListWithSpinner {...props} />);

        expect(analyticsMock).not.toHaveBeenCalledWith({
          event: AmplitudeEvents.TYPE_LIST_VIEWED,
          parameters: {
            type_name: 'Type One',
            number_of_results: 5,
          },
        });
      });
    });
  });
});
