import TypesPage from '@/pages/types';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, Channels } from '@/globals';
import userEvent, { UserEvent } from '@testing-library/user-event';
import eventBus from '@/eventBus';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { userService } from '@/components/UserServiceProvider/store';
import Spinner from '@/modules/Spinner';
import { FC, PropsWithChildren } from 'react';
import { offerListItemFactory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';
import BrowseTypesData from '@/data/BrowseTypes';

jest.mock('@/invoke/apiCall');
let mockRouter: Partial<NextRouter> = {
  query: {},
};
let userServiceValue: string | undefined;
let bus = eventBus();
let user: UserEvent;

describe('Types Page', () => {
  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
    jest.resetAllMocks();
  });

  beforeEach(() => {
    userServiceValue = 'NHS';
    user = userEvent.setup();
    mockRouter = {
      push: jest.fn(),
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      givenTypeQueryParamIs('5');
      whenTypesPageIsRendered();
    });
  });

  describe('Query params', () => {
    const requestDataMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestData')
      .mockImplementation(() => jest.fn());

    it.each(BrowseTypesData.map((type) => type.id))(
      'should request types for type: %s',
      (typeId) => {
        givenTypeQueryParamIs(typeId.toString());

        whenTypesPageIsRendered();

        expect(requestDataMock).toHaveBeenCalledWith(APIUrl.List, {
          typeid: typeId.toString(),
          page: '1',
          service: userServiceValue,
        });
      },
    );

    it('should display types variant list module', async () => {
      const offerData = offerListItemFactory.build();
      bus.broadcast(Channels.API_RESPONSE, {
        url: APIUrl.List,
        response: {
          data: [offerData],
        },
      });
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();
      const offer = await screen.findByText('Highstreet');

      expect(offer).toBeInTheDocument();
    });

    it('should NOT request data when there are no query params', () => {
      givenTypeQueryParamIs(undefined);

      whenTypesPageIsRendered();

      expect(requestDataMock).not.toHaveBeenCalled();
    });

    it('should NOT request data when type query param is not within type list', () => {
      givenTypeQueryParamIs('27');

      whenTypesPageIsRendered();

      expect(requestDataMock).not.toHaveBeenCalled();
    });

    it('should direct user to "search" page when type query param is not within type list', () => {
      givenTypeQueryParamIs('27');

      whenTypesPageIsRendered();

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
    });
  });

  describe('Spinner', () => {
    it('should set the spinner on type query params', () => {
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();
      const spinner = screen.queryByRole('progressbar');

      expect(spinner).toBeTruthy();
    });

    it('should hide spinner on receiving api response', () => {
      bus.broadcast(Channels.API_RESPONSE, {
        url: APIUrl.List,
        response: {
          data: [],
        },
      });
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();
      const spinner = screen.queryByRole('progressbar');

      expect(spinner).toBeFalsy();
    });
  });

  describe('Back button', () => {
    it('should take user to search page when the back button is clicked', async () => {
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();
      const backButton = screen.getByRole('button', { name: /back button/i });
      await user.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/search');
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

const TypesPageWithSpinner: FC = () => {
  return (
    <WithSpinner>
      <TypesPage />
    </WithSpinner>
  );
};

const givenTypeQueryParamIs = (queryParam?: string) => {
  if (queryParam) {
    mockRouter = {
      ...mockRouter,
      query: {
        type: queryParam,
      },
    };
  } else {
    mockRouter = {
      query: {},
    };
  }
};
const whenTypesPageIsRendered = () => {
  render(
    <RouterContext.Provider value={mockRouter as NextRouter}>
      <JotaiTestProvider initialValues={[[userService, userServiceValue]]}>
        <TypesPageWithSpinner />
      </JotaiTestProvider>
    </RouterContext.Provider>,
  );
};
