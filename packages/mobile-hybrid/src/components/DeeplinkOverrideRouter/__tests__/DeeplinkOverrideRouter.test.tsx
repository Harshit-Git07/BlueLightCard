import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import { PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import InvokeNativeNavigation from '@/invoke/navigation';
import DeeplinkOverrideRouter from '../DeeplinkOverrideRouter';

const invokeNavigation = new InvokeNativeNavigation();

jest.mock('@bluelightcard/shared-ui');

const viewOfferMock = jest.fn();
(useOfferDetails as jest.Mock).mockImplementation(() => ({
  viewOffer: viewOfferMock,
}));

const globalState = window as GlobalState;
const navigationMessageHandlerMock = jest.fn();
Object.assign(globalState, {
  webkit: {
    messageHandlers: {
      NavigationRequest: {
        postMessage: navigationMessageHandlerMock,
      },
    },
  },
});

describe('Deeplink Override Router', () => {
  const whenRendered = async () => {
    return act(() =>
      render(
        <DeeplinkOverrideRouter>
          <p>Hello World!</p>
        </DeeplinkOverrideRouter>,
      ),
    );
  };

  it('renders the given children', () => {
    whenRendered();

    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });

  it('overrides offer details navigation', () => {
    whenRendered();

    invokeNavigation.navigate('/offerdetails.php?oid=123&cid=456', true);

    expect(viewOfferMock).toHaveBeenCalledWith({
      offerId: 123,
      companyId: 456,
      companyName: '',
      platform: PlatformVariant.MobileHybrid,
    });
  });

  describe('it falls back to native navigation', () => {
    test('when the allowOverride parameter is not provided', () => {
      whenRendered();

      invokeNavigation.navigate('/foo.php');

      expect(navigationMessageHandlerMock).toHaveBeenCalledWith({
        message: 'navigate',
        parameters: { internalUrl: '/foo.php' },
      });
    });

    test('when using a path that has not been overriden', () => {
      whenRendered();

      invokeNavigation.navigate('/bar.php', true);

      expect(navigationMessageHandlerMock).toHaveBeenCalledWith({
        message: 'navigate',
        parameters: { internalUrl: '/bar.php' },
      });
    });

    test('when an override throws an error', () => {
      viewOfferMock.mockImplementation(() => {
        throw new Error('Fake error');
      });

      whenRendered();

      invokeNavigation.navigate('/offerdetails.php?oid=123&cid=456', true);

      expect(navigationMessageHandlerMock).toHaveBeenCalledWith({
        message: 'navigate',
        parameters: { internalUrl: '/offerdetails.php?oid=123&cid=456' },
      });
    });
  });
});
