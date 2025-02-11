import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import Toaster from '../Toast/Toaster/index';
import MarketingPreferences from './index';
import { act } from 'react';
import {
  defaultPrefBlazeData,
  MarketingPreferencesBlazeData,
  preferenceDefinitions,
} from './types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import userEvent from '@testing-library/user-event';
import { createStore, Provider } from 'jotai';
import { initializeToastAtom, toastAtom } from '../Toast/toastState';
import { V5_API_URL } from '../../constants';
import { PlatformVariant } from '../../types';

const store = createStore();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const getMarketingPreferenceURL = V5_API_URL.MarketingPreferences('foobar', 'web');
const updateMarketingPreferencesURL = `${V5_API_URL.BrazePreferences('foobar')}/update`;

const testRender = (status = 200, body = { success: true, data: { ...defaultPrefBlazeData } }) => {
  const mockPlatformAdapter = useMockPlatformAdapter(status, body, PlatformVariant.Web);
  const updated = store.get(toastAtom);
  clearTimeout(updated.timer?.getTimerId());
  store.set(toastAtom, initializeToastAtom());
  render(
    <Provider store={store}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <QueryClientProvider client={createTestQueryClient()}>
          <Toaster />
          <MarketingPreferences memberUuid={'foobar'} />
        </QueryClientProvider>
      </PlatformAdapterProvider>
    </Provider>,
  );
  return mockPlatformAdapter;
};

const selectedPrefData: MarketingPreferencesBlazeData = {
  sms_subscribe: 'opted_in',
  push_subscribe: 'opted_in',
  email_subscribe: 'opted_in',
};

describe('MarketingPreferences', () => {
  beforeEach(() => {
    const updated = store.get(toastAtom);
    clearTimeout(updated.timer?.getTimerId());
  });

  it('should call the api', () => {
    const mockPlatformAdapter = testRender();
    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(getMarketingPreferenceURL, {
      method: 'GET',
    });
  });

  it.each(Object.keys(preferenceDefinitions))('should render checkbox %s unchecked', (id) => {
    testRender();
    const { title } = preferenceDefinitions[id as keyof typeof preferenceDefinitions];

    const titleText = screen.getByText(title);
    const label = titleText.closest('label') as HTMLElement;
    expect(label).toHaveAttribute('for', `marketing-preferences-${id}`);
    const input = within(label).getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it.each(Object.keys(preferenceDefinitions))('should render checkbox %s checked', async (id) => {
    testRender(200, { success: true, data: { ...selectedPrefData } });
    const { title } = preferenceDefinitions[id as keyof typeof preferenceDefinitions];
    const titleText = screen.getByText(title);
    const label = titleText.closest('label') as HTMLElement;
    const input = within(label).getByRole('checkbox');
    await waitFor(() => {
      expect(input).toBeChecked();
    });
  });

  describe('Happy path', () => {
    it('should submit the checkboxes that have been chosen', async () => {
      const mockPlatformAdapter = testRender();
      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(getMarketingPreferenceURL, {
          method: 'GET',
        });
      });

      mockPlatformAdapter.invokeV5Api.mockClear();

      const { title } = preferenceDefinitions.sms_subscribe;
      const titleText = screen.getByText(title);
      const label = titleText.closest('label') as HTMLElement;
      const input = within(label).getByRole('checkbox');
      const btn = screen.getByRole('button');
      const form = btn.closest('form');

      // wait for the thing to have stopped loading - otherwise test runs too fast
      await waitFor(() => {
        expect(form).toHaveAttribute('data-loading', 'false');
      });

      // btn is disabled until a checkbox has changed
      expect(btn).not.toBeEnabled();

      // change a checkbox
      await act(async () => {
        await userEvent.click(input);
      });

      // // state should update
      await waitFor(() => {
        expect(input).toBeChecked();
      });

      // btn should be enabled now because the form state has changed
      await waitFor(async () => {
        expect(btn).toBeEnabled();
      });

      // click submit
      await act(async () => {
        await userEvent.click(btn);
      });

      await waitFor(() => {
        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
          updateMarketingPreferencesURL,
          {
            method: 'POST',
            body: JSON.stringify({
              attributes: Object.fromEntries(
                Object.keys(preferenceDefinitions).map((key) => {
                  return [key, key === 'sms_subscribe' ? 'opted_in' : 'unsubscribed'];
                }),
              ),
            }),
          },
        );
      });

      // if success then the submit button should be disabled again - until something changes
      expect(btn).not.toBeEnabled();

      // expect toast
      await waitFor(() => {
        const txt = screen.getByText('All your changes have been updated');
        expect(txt).toBeInTheDocument();
      });
    });
  });

  describe('error path', () => {
    it('should show an error message when something goes wrong', async () => {
      const mockPlatformAdapter = testRender();

      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(getMarketingPreferenceURL, {
        method: 'GET',
      });

      mockPlatformAdapter.invokeV5Api.mockClear();
      mockPlatformAdapter.invokeV5Api.mockResolvedValue({
        status: 400,
        data: {
          success: false,
          message: 'foobar',
        },
      });

      const { title } = preferenceDefinitions.sms_subscribe;
      const titleText = screen.getByText(title);
      const label = titleText.closest('label') as HTMLElement;
      const input = within(label).getByRole('checkbox');
      const btn = screen.getByRole('button');
      const form = btn.closest('form');

      // wait for the thing to have stopped loading - otherwise test runs too fast
      await waitFor(() => {
        expect(form).toHaveAttribute('data-loading', 'false');
      });

      await waitFor(async () => {
        expect(btn).not.toBeEnabled();
      });

      await act(async () => {
        await userEvent.click(input);
      });

      await waitFor(() => {
        expect(input).toBeChecked();
      });

      await waitFor(async () => {
        expect(btn).toBeEnabled();
      });

      await act(async () => {
        await userEvent.click(btn);
      });

      await waitFor(() => {
        const txt = screen.getByText(
          'Your changes could not be saved for some reason. Try again later',
        );
        expect(txt).toBeInTheDocument();
      });
    });
  });
});
