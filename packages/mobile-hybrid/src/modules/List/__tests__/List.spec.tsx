import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import List from '../List';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ListProps, ListVariant } from '../types';
import '@testing-library/jest-dom';
import { APIUrl, Channels } from '@/globals';
import Spinner from '@/modules/Spinner';
import { FC, PropsWithChildren } from 'react';
import { offerListItemFactory } from '../__mocks__/factory';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { UserProfile, userProfile } from '@/components/UserProfileProvider/store';
import InvokeNativeAPICall from '@/invoke/apiCall';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import eventBus from '@/eventBus';

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
jest.mock('@/invoke/apiCall');

describe('ListModule', () => {
  let props: ListProps;
  let user: UserEvent;
  let userProfileValue: UserProfile | undefined;

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    props = {
      entityId: 0,
      listVariant: ListVariant.Types,
    };
    user = userEvent.setup();
    userProfileValue = { service: 'NHS' };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      whenListWithSpinnerIsRendered(props);
    });
  });

  describe('spinner', () => {
    it('should hide spinner on receiving api response', () => {
      eventBus.emit(Channels.API_RESPONSE, APIUrl.Search, {
        data: [],
      });

      whenListWithSpinnerIsRendered(props);

      const spinner = screen.queryByRole('progressbar');

      expect(spinner).toBeFalsy();
    });
  });

  describe('request data', () => {
    const requestDataMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestData')
      .mockImplementation(() => jest.fn());

    it('should not make request to api when "service" value is "undefined"', () => {
      userProfileValue = undefined;

      whenListWithSpinnerIsRendered(props);

      expect(requestDataMock).not.toHaveBeenCalled();
    });

    describe('"types" list', () => {
      beforeEach(() => {
        props = {
          entityId: 0,
          listVariant: ListVariant.Types,
        };
      });

      it('should make request to api when "service" value is set', () => {
        userProfileValue = { organisation: 'NHS' };

        whenListWithSpinnerIsRendered(props);

        expect(requestDataMock).toHaveBeenCalledWith(APIUrl.List, {
          typeid: '0',
          page: '1',
          service: userProfileValue.service,
        });
      });
    });

    describe('"categories" list', () => {
      beforeEach(() => {
        props = {
          entityId: 0,
          listVariant: ListVariant.Categories,
        };
      });

      it('should make request to api when "service" value is set', () => {
        userProfileValue = { organisation: 'NHS' };

        whenListWithSpinnerIsRendered(props);

        expect(requestDataMock).toHaveBeenCalledWith(APIUrl.List, {
          catid: '0',
          page: '1',
          service: userProfileValue.service,
        });
      });
    });
  });

  describe('render data', () => {
    it('should render list of results', async () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      whenListWithSpinnerIsRendered(props);

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: offerListItemFactory.buildList(2),
        });
      });

      const results = await screen.findAllByRole('listitem');

      expect(results).toHaveLength(2);
    });

    it('should display "No results found." message when no data is present', async () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      whenListWithSpinnerIsRendered(props);

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: [],
        });
      });

      const noResultsMessage = await screen.findByText('No results found.');
      expect(noResultsMessage).toBeInTheDocument();

      await waitFor(() => {
        const noListItem = screen.queryAllByRole('listitem');
        expect(noListItem).toHaveLength(0);
      });
    });
  });

  describe('"Load more" button ', () => {
    it('should change button text to "Loading..." when clicked', async () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      whenListWithSpinnerIsRendered(props);

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: offerListItemFactory.buildList(20),
        });
      });

      const loadMoreButton = await screen.findByText('Load More');

      fireEvent.click(loadMoreButton);

      expect(loadMoreButton).toHaveTextContent('Loading...');
    });

    it('should not show the button if there are no results', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: [],
        });
      });

      whenListWithSpinnerIsRendered(props);

      const loadMoreButton = screen.queryByText('Load More');

      expect(loadMoreButton).not.toBeInTheDocument();
    });

    it('should not show the button if number of results is less than pagesize(20)', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: offerListItemFactory.buildList(4),
        });
      });

      whenListWithSpinnerIsRendered(props);

      const loadMoreButton = screen.queryByText('Load More');

      expect(loadMoreButton).not.toBeInTheDocument();
    });

    it('should show the button if number of results match the pagesize(20)', async () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 0;

      whenListWithSpinnerIsRendered(props);

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
          data: offerListItemFactory.buildList(20),
        });
      });

      const loadMoreButton = await screen.findByText('Load More');

      expect(loadMoreButton).toBeInTheDocument();
    });
  });

  describe('heading', () => {
    it('should render categories heading that matches entityId', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 1;

      whenListWithSpinnerIsRendered(props);

      const heading = screen.getByText('Cat Two');

      expect(heading).toBeInTheDocument();
    });

    it('should render types heading that matches entityId', () => {
      props.listVariant = ListVariant.Types;
      props.entityId = 1;

      whenListWithSpinnerIsRendered(props);

      const heading = screen.getByText('Type Two');

      expect(heading).toBeInTheDocument();
    });

    it('should NOT render category heading that does NOT match entityId', () => {
      props.listVariant = ListVariant.Categories;
      props.entityId = 4;

      whenListWithSpinnerIsRendered(props);

      const heading = screen.queryByText('Cat Two');

      expect(heading).not.toBeInTheDocument();
    });
  });

  describe('log analytics events', () => {
    const analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    beforeEach(() => {
      eventBus.emit(Channels.API_RESPONSE, '/api/4/offer/list.php', {
        data: offerListItemFactory.buildList(5),
      });
    });

    describe('categories list', () => {
      it('should not log "type_list_viewed" analytic event on results returned', () => {
        props.listVariant = ListVariant.Categories;
        props.entityId = 0;

        whenListWithSpinnerIsRendered(props);

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

  const whenListWithSpinnerIsRendered = (props: ListProps): void => {
    render(
      <JotaiTestProvider initialValues={[[userProfile, userProfileValue]]}>
        <ListWithSpinner {...props} />
      </JotaiTestProvider>,
    );
  };
});
