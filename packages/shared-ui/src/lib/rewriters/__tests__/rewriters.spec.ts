/* eslint-disable @typescript-eslint/no-explicit-any */
import Response from '../__mocks__/Response';
import { Channels, PlatformVariant } from '../../../types';
import { fetch, useRouter } from '../';
import { invokeNative } from '../../invoke';
import eventBus from '../../eventBus';

jest.mock('../../../vars', () => ({
  FETCH_TIMEOUT: 100,
}));

jest.mock('../../invoke.ts', () => ({
  invokeNative: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('Rewriters', () => {
  const bus = eventBus();

  let invokeNativeMock: jest.Mock;

  beforeEach(() => {
    globalThis.Response = Response as any;
    invokeNativeMock = invokeNative as jest.Mock;

    (window as any).fetch = jest.fn();
  });

  afterEach(() => {
    bus.clearMessages(Channels.API_RESPONSE);
    jest.clearAllMocks();
  });

  describe('fetch rewriter', () => {
    describe('mobile platform', () => {
      it('should resolve with fetch response', async () => {
        bus.broadcast(Channels.API_RESPONSE, {
          url: 'http://mobile.example.com/',
          response: {},
        });
        const response = await fetch(
          'http://mobile.example.com/',
          {},
          PlatformVariant.MobileHybrid,
        );
        expect(response.status).toBe(200);
        expect(invokeNativeMock).toHaveBeenCalledWith('DataRequest', {
          message: 'requestData',
          parameters: {
            path: 'http://mobile.example.com/',
            method: 'GET',
          },
        });
      });

      it('should resolve fetch response with json', async () => {
        bus.broadcast(Channels.API_RESPONSE, {
          url: 'http://mobile.example.com/',
          response: {},
        });
        const response = await fetch(
          'http://mobile.example.com/',
          {},
          PlatformVariant.MobileHybrid,
        );
        const json = await response.json();
        expect(json).toEqual({});
      });

      it('should reject when fetch response time exceeds FETCH_TIMEOUT', async () => {
        expect.assertions(1);
        bus.broadcast(Channels.API_RESPONSE, {
          url: '',
          response: {},
        });
        try {
          await fetch('http://mobile.example.com/', {}, PlatformVariant.MobileHybrid);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });

    describe('desktop platform', () => {
      it('should call window.fetch', async () => {
        await fetch('http://desktop.example.com/', {}, PlatformVariant.Web);
        expect(window.fetch).toHaveBeenCalledWith('http://desktop.example.com/', {});
      });
    });
  });

  describe('useRouter rewriter', () => {
    describe('mobile platform', () => {
      it('it should not call invokeNative', () => {
        const router = useRouter(PlatformVariant.MobileHybrid);
        router.pushNative('/test', 'example.com');
        expect(invokeNative).toHaveBeenCalledTimes(1);
      });
    });

    describe('desktop platform', () => {
      it('it should not have invokeNative', () => {
        const router = useRouter(PlatformVariant.Web);
        router.pushNative('/test', 'example.com');
        expect(invokeNative).toHaveBeenCalledTimes(0);
      });
    });
  });
});
