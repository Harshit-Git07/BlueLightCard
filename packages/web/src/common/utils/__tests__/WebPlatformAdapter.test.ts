import { Amplitude } from '../amplitude/amplitude';
import { WebPlatformAdapter } from '../WebPlatformAdapter';
import { amplitudeServiceAtom, experimentsAndFeatureFlags } from '../amplitude/store';
import { amplitudeStore } from '../../context/AmplitudeExperiment';
import Router from 'next/router';

jest.mock('@/root/global-vars', () => ({
  ...jest.requireActual('@/root/global-vars'),
  BRAND_URL: 'https://bluelightcard.co.uk',
}));

import { BRANDS } from '@/types/brands.enum';
import { mockBrand } from '@/root/src/common/test-utils/BrandMocker';

jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: jest.fn(),
  },
}));

describe('Web Platform Adapter', () => {
  let platformAdapter: WebPlatformAdapter;

  beforeEach(() => {
    platformAdapter = new WebPlatformAdapter();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('invokeV5Api', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          status: 200,
          text: () => Promise.resolve(JSON.stringify({ foo: 'bar' })),
        } as Response)
      );
    });

    it.each([
      [BRANDS.BLC_UK, 'BLC_UK'],
      [BRANDS.DDS_UK, 'DDS_UK'],
      [BRANDS.BLC_AU, 'BLC_AU'],
    ])('should map brand: %s to x-brand header %s', async (brand, header) => {
      mockBrand(brand);

      // Need to re-import the module to get the updated brand from the global vars
      const platformAdapter = new (require('../WebPlatformAdapter').WebPlatformAdapter)();
      await platformAdapter.invokeV5Api('/mock-endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/mock-endpoint'), {
        body: undefined,
        headers: {
          Authorization: 'Bearer null',
          'Content-Type': 'application/json',
          'x-brand': header,
        },
        method: 'GET',
      });
    });

    it('makes a fetch request', async () => {
      await platformAdapter.invokeV5Api('/mock-endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/mock-endpoint'), {
        body: undefined,
        headers: {
          Authorization: 'Bearer null',
          'Content-Type': 'application/json',
          'x-brand': expect.any(String),
        },
        method: 'GET',
      });
    });

    it('appends query parameters', async () => {
      await platformAdapter.invokeV5Api('/mock-endpoint', {
        method: 'GET',
        queryParameters: { id: 'test-id' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/mock-endpoint?id=test-id'),
        {
          body: undefined,
          headers: {
            Authorization: 'Bearer null',
            'Content-Type': 'application/json',
            'x-brand': expect.any(String),
          },
          method: 'GET',
        }
      );
    });

    it('returns the response', async () => {
      const response = await platformAdapter.invokeV5Api('/mock-endpoint', { method: 'GET' });

      expect(response.status).toEqual(200);
      expect(response.data).toEqual(JSON.stringify({ foo: 'bar' }));
    });
  });

  describe('logAnalyticsEvent', () => {
    it('sends analytics events via the amplitude service', () => {
      const amplitudeService = new Amplitude();
      const trackEventSpy = jest.spyOn(amplitudeService, 'trackEventAsync').mockImplementation();
      amplitudeStore.set(amplitudeServiceAtom, amplitudeService);

      platformAdapter.logAnalyticsEvent('test_event', { id: 'test-id' });

      expect(trackEventSpy).toHaveBeenCalledWith('test_event', { id: 'test-id' });
    });
  });

  describe('navigate', () => {
    it('pushes to Next Router', () => {
      platformAdapter.navigate('/test-page');

      expect(Router.push).toHaveBeenCalledWith('/test-page');
    });
  });

  describe('navigateExternal', () => {
    it('opens a new tab when target = blank', () => {
      window.open = jest.fn().mockReturnValue({ closed: false });
      const result = platformAdapter.navigateExternal('/test-page', { target: 'blank' });

      expect(window.open).toHaveBeenCalledWith('/test-page', '_blank');
      expect(result.isOpen()).toEqual(true);
    });

    it('changes the current tab when target = self', () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost',
        },
        writable: true,
      });
      const result = platformAdapter.navigateExternal('/test-page', { target: 'self' });

      expect(window.location.href).toEqual('/test-page');
      expect(result.isOpen()).toEqual(true);
    });
  });

  describe('writeTextToClipboard', () => {
    it('writes the given text to the clipboard', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
      });
      platformAdapter.writeTextToClipboard('test text');

      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    });
  });

  describe('getAmplitudeFeatureFlag', () => {
    it('returns the state of the given flag', () => {
      amplitudeStore.set(experimentsAndFeatureFlags, { 'test-flag': 'variant' });
      const result = platformAdapter.getAmplitudeFeatureFlag('test-flag');

      expect(result).toEqual('variant');
    });
  });

  describe('getBrandURL', () => {
    it('returns the brand URL from globals', () => {
      const result = platformAdapter.getBrandURL();

      expect(result).toEqual('https://bluelightcard.co.uk');
    });
  });
});
