import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import Spinner from '@/modules/Spinner';
import NotificationsPage from '@/pages/notifications';
import InvokeNativeAPICall from '@/invoke/apiCall';
import useAPI from '@/hooks/useAPI';
import { faBell as faBellRegular } from '@fortawesome/pro-regular-svg-icons';
import { faBell as faBellSolid } from '@fortawesome/pro-solid-svg-icons';

jest.mock('@/invoke/apiCall');
jest.mock('@/hooks/useAPI');

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    iframeUrl: 'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f',
  },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Notifications Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenPageIsRendered = async (platformAdapter = mockPlatformAdapter) => {
    return render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <RouterContext.Provider value={mockRouter as NextRouter}>
          <JotaiTestProvider initialValues={[]}>
            <WithSpinner>
              <NotificationsPage />
            </WithSpinner>
          </JotaiTestProvider>
        </RouterContext.Provider>
      </PlatformAdapterProvider>,
    );
  };

  describe('it renders a loading state', () => {
    test('with a spinner', () => {
      whenPageIsRendered();

      const spinner = screen.getByRole('progressbar');

      expect(spinner).toBeInTheDocument();
    });

    test('with a native API call to retrieve the notifications', () => {
      whenPageIsRendered();

      expect(InvokeNativeAPICall.prototype.requestData).toHaveBeenCalledWith('contentcardsRequest');
    });
  });

  describe('it renders a list of notifications', () => {
    beforeEach(() => {
      (useAPI as jest.Mock).mockReturnValue([
        {
          id: 'test-notification-one',
          title: 'Test Notification 1',
          description: 'This is the first test notification',
          isClicked: 'false',
          href: '',
        },
        {
          id: 'test-notification-two',
          title: 'Test Notification 2',
          description: 'This is the second test notification',
          isClicked: 'true',
          href: '',
        },
      ]);

      whenPageIsRendered();
    });

    test('with titles', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');
      const notificationTwo = await screen.findByText('Test Notification 2');

      expect(notificationOne).toBeInTheDocument();
      expect(notificationTwo).toBeInTheDocument();
    });

    test('with descriptions', async () => {
      const notificationOne = await screen.findByText('This is the first test notification');
      const notificationTwo = await screen.findByText('This is the second test notification');

      expect(notificationOne).toBeInTheDocument();
      expect(notificationTwo).toBeInTheDocument();
    });

    test('with unread states', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');

      if (
        !notificationOne ||
        !notificationOne.parentElement ||
        !notificationOne.parentElement.parentElement
      )
        throw new Error('Notification 1 is not in the document');

      const notificationOneBell = within(notificationOne.parentElement.parentElement).getByRole(
        'img',
        {
          hidden: true,
        },
      );

      expect(notificationOneBell).toBeInTheDocument();
      expect(notificationOneBell).toHaveAttribute('data-icon', faBellSolid.iconName);
    });

    test('with read states', async () => {
      const notificationTwo = await screen.findByText('Test Notification 2');

      if (
        !notificationTwo ||
        !notificationTwo.parentElement ||
        !notificationTwo.parentElement.parentElement
      )
        throw new Error('Notification 2 is not in the document');

      const notificationTwoBell = within(notificationTwo.parentElement.parentElement).getByRole(
        'img',
        {
          hidden: true,
        },
      );

      expect(notificationTwoBell).toBeInTheDocument();
      expect(notificationTwoBell).toHaveAttribute('data-icon', faBellRegular.iconName);
    });
  });

  describe('it does not allow malformed notifications to be clicked', () => {
    beforeEach(() => {
      (useAPI as jest.Mock).mockReturnValue([
        {
          title: 'Test Notification 1',
        },
      ]);

      whenPageIsRendered();
    });

    test('and exits early if notification does not have an ID', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');

      await userEvent.click(notificationOne);

      expect(InvokeNativeAPICall.prototype.requestData).not.toHaveBeenCalledWith(
        'contentcardsLogClick',
      );
      expect(mockPlatformAdapter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('it allows notifications to be clicked', () => {
    beforeEach(() => {
      (useAPI as jest.Mock).mockReturnValue([
        {
          id: 'test-notification-one',
          title: 'Test Notification 1',
          description: 'This is the first test notification',
          isClicked: 'false',
          href: 'https://www.bluelightcard.co.uk/test-notification-path',
        },
        {
          id: 'test-notification-two',
          title: 'Test Notification 2',
          description: 'This is the second test notification',
          isClicked: 'false',
          href: '',
        },
      ]);

      whenPageIsRendered();
    });

    test('and logs the click', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');

      await userEvent.click(notificationOne);

      expect(InvokeNativeAPICall.prototype.requestData).toHaveBeenCalledWith(
        'contentcardsLogClick',
        { id: 'test-notification-one' },
      );
    });

    test('and refreshes the content cards request', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');

      await userEvent.click(notificationOne);

      expect(InvokeNativeAPICall.prototype.requestData).toHaveBeenCalledWith('contentcardsRequest');
    });

    test('and navigates to the notification href path', async () => {
      const notificationOne = await screen.findByText('Test Notification 1');

      await userEvent.click(notificationOne);

      expect(mockPlatformAdapter.navigate).toHaveBeenCalledWith('/test-notification-path', true);
    });

    test('and does not navigate if the notification does not have a href', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockPlatformAdapter.navigate.mockReset();

      const notificationTwo = await screen.findByText('Test Notification 2');

      await userEvent.click(notificationTwo);

      expect(mockPlatformAdapter.navigate).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Unable to navigate to notification href',
        new TypeError('Invalid URL'),
      );
    });
  });
});
