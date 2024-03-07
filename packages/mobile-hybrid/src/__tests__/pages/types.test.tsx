import TypesPage from '@/pages/types';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, Channels } from '@/globals';
import eventBus from '@/eventBus';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { userService } from '@/components/UserServiceProvider/store';
import Spinner from '@/modules/Spinner';
import { FC, PropsWithChildren } from 'react';
import { offerListItemFactory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';

jest.mock('@/invoke/apiCall');
let mockRouter: Partial<NextRouter> = {
  query: {},
};
let userServiceValue: string | undefined;
let bus = eventBus();

describe('Types Page', () => {
  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
    jest.resetAllMocks();
  });

  beforeEach(() => {
    userServiceValue = 'NHS';
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      whenTypesPageIsRendered();
    });
  });

  describe('Query params', () => {
    const requestDataMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestData')
      .mockImplementation(() => jest.fn());

    it('should get the correct type id', () => {
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();

      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.List, {
        typeid: '5',
        page: '1',
        service: userServiceValue,
      });
    });

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
