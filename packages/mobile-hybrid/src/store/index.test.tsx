import { act, render, screen, waitFor } from '@testing-library/react';
import { AppStoreProvider } from '@/store/index';
import Spinner from '@/modules/Spinner';
import bus from '@/eventBus';
import { APIUrl, Channels } from '@/globals';

describe('App Store Provider', () => {
  afterEach(() => {
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
    bus.emit(Channels.API_RESPONSE, APIUrl.OfferPromos, { data: [] });
    bus.emit(Channels.API_RESPONSE, APIUrl.News, { data: [] });
    bus.emit(Channels.API_RESPONSE, APIUrl.FavouritedBrands, { data: [] });
  };

  const andNotAllApiCallsRespondSuccessfully = () => {
    bus.emit(Channels.API_RESPONSE, APIUrl.OfferPromos, { data: [] });
    bus.emit(Channels.API_RESPONSE, APIUrl.News, { data: [] });
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
