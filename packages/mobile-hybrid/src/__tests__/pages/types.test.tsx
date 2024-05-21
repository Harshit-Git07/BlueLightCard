import TypesPage from '@/pages/types';
import { NextRouter } from 'next/router';
import { act, render, screen, waitFor } from '@testing-library/react';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl, Channels } from '@/globals';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { userService } from '@/components/UserServiceProvider/store';
import Spinner from '@/modules/Spinner';
import { FC, PropsWithChildren } from 'react';
import { offerListItemFactory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';
import BrowseTypesData from '@/data/BrowseTypes';
import eventBus from '@/eventBus';

jest.mock('@/invoke/apiCall');
let mockRouter: Partial<NextRouter> = {
  query: {},
};
let userServiceValue: string | undefined;
let user: UserEvent;

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Types Page', () => {
  afterEach(() => {
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
      eventBus.emit(Channels.API_RESPONSE, APIUrl.List, {
        data: [offerData],
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

    it('should hide spinner on receiving api response', async () => {
      givenTypeQueryParamIs('5');

      whenTypesPageIsRendered();

      act(() => {
        eventBus.emit(Channels.API_RESPONSE, APIUrl.List, {
          data: [],
        });
      });

      await waitFor(() => {
        const spinner = screen.queryByRole('progressbar');
        expect(spinner).toBeFalsy();
      });
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
    <JotaiTestProvider initialValues={[[userService, userServiceValue]]}>
      <TypesPageWithSpinner />
    </JotaiTestProvider>,
  );
};
