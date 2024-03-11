import { act, render, screen, waitFor } from '@testing-library/react';
import { AppStoreProvider } from '@/store/index';
import Spinner from '@/modules/Spinner';
import eventBus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';

let bus = eventBus();

describe('App Store Provider', () => {
  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
    jest.resetAllMocks();
  });

  describe('Spinner', () => {
    it('should show spinner when api calls loading', () => {
      whenAppStoreProviderIsRendered();

      thenTheSpinnerIsVisible();
    });

    it('should show spinner when an api call doesnt respond', () => {
      whenAppStoreProviderIsRendered();
      act(() => andNotAllApiCallsRespondSuccessfully());

      thenTheSpinnerIsVisible();
    });

    it('should not show spinner when api calls finished loading', async () => {
      whenAppStoreProviderIsRendered();
      act(() => andAllApiCallsRespondSuccessfully());

      await waitFor(() => thenTheSpinnerIsNotVisible());
    });
  });

  const andAllApiCallsRespondSuccessfully = () => {
    bus.broadcast(Channels.API_RESPONSE, { url: APIUrl.OfferPromos, response: { data: [] } });
    bus.broadcast(Channels.API_RESPONSE, { url: APIUrl.News, response: { data: [] } });
    bus.broadcast(Channels.API_RESPONSE, { url: APIUrl.FavouritedBrands, response: { data: [] } });
  };

  const andNotAllApiCallsRespondSuccessfully = () => {
    bus.broadcast(Channels.API_RESPONSE, { url: APIUrl.OfferPromos, response: { data: [] } });
    bus.broadcast(Channels.API_RESPONSE, { url: APIUrl.News, response: { data: [] } });
  };

  const whenAppStoreProviderIsRendered = () => {
    render(
      <AppStoreProvider>
        <Spinner />
      </AppStoreProvider>,
    );
  };

  const thenTheSpinnerIsVisible = () => {
    const spinnerComponent = screen.queryByRole('progressbar');
    expect(spinnerComponent).toBeTruthy();
  };

  const thenTheSpinnerIsNotVisible = () => {
    const spinnerComponent = screen.queryByRole('progressbar');
    expect(spinnerComponent).toBeFalsy();
  };
});
