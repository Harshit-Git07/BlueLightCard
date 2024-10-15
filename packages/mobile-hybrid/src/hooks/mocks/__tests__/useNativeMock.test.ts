import { NextRouter } from 'next/router';
import useNativeMock from '../useNativeMock';
import * as globals from '@/globals';

const mockGlobals = globals as {
  IS_SSR: boolean;
  USE_NATIVE_MOCK: boolean;
};
jest.mock('@/globals', () => ({
  ...jest.requireActual('@/globals'),
  __esModule: true,
  IS_SSR: false,
  USE_NATIVE_MOCK: true,
}));

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

const globalState = window as GlobalState;
globalState.onResponse = jest.fn();
globalState.setExperiment = jest.fn();

describe('useNativeMock', () => {
  beforeEach(() => {
    mockGlobals.IS_SSR = false;
    mockGlobals.USE_NATIVE_MOCK = true;
  });

  describe('does not mock', () => {
    test('if mocks are not enabled', () => {
      mockGlobals.USE_NATIVE_MOCK = false;

      const result = useNativeMock();

      expect(result).toEqual(false);
      expect(globalState.webkit).not.toBeDefined();
    });

    test('if SSR', () => {
      mockGlobals.IS_SSR = true;

      const result = useNativeMock();

      expect(result).toEqual(false);
      expect(globalState.webkit).not.toBeDefined();
    });
  });

  describe('analytics requests', () => {
    test('are mocked', () => {
      useNativeMock();

      expect(globalState.webkit.messageHandlers.AnalyticsRequest.postMessage).toBeDefined();
    });
  });

  describe('data requests', () => {
    test('are mocked', () => {
      useNativeMock();

      expect(globalState.webkit.messageHandlers.DataRequest.postMessage).toBeDefined();
    });

    test('and throw an error if a mock is not defined for the request', () => {
      useNativeMock();

      const path = '/a/fake/request';

      const request = () =>
        globalState.webkit.messageHandlers.DataRequest.postMessage({
          message: 'requestData',
          parameters: { path, method: 'GET', body: '' },
        });

      expect(request).toThrow('No mock found for url /a/fake/request');
    });

    test('and return a response', () => {
      useNativeMock();

      const path = '/eu/redemptions/member/redemptionDetails';
      const response = Buffer.from(
        JSON.stringify({
          statusCode: 200,
          body: JSON.stringify({
            data: {
              redemptionType: 'preApplied',
            },
          }),
        }),
      ).toString('base64');

      globalState.webkit.messageHandlers.DataRequest.postMessage({
        message: 'requestData',
        parameters: { path, method: 'GET', body: '' },
      });

      expect(globalState.onResponse).toHaveBeenCalledWith(path, response);
    });
  });

  describe('experiment requests', () => {
    test('are mocked', () => {
      useNativeMock();

      expect(globalState.webkit.messageHandlers.ExperimentRequest.postMessage).toBeDefined();
    });

    test('and return a response', () => {
      useNativeMock();

      globalState.webkit.messageHandlers.ExperimentRequest.postMessage({
        message: 'experiment',
        parameters: { keys: [] },
      });

      expect(globalState.setExperiment).toHaveBeenCalled();
    });
  });

  describe('navigation requests', () => {
    test('are mocked', () => {
      useNativeMock();

      expect(globalState.webkit.messageHandlers.NavigationRequest.postMessage).toBeDefined();
    });

    test('and do a redirect', () => {
      useNativeMock();

      globalState.webkit.messageHandlers.NavigationRequest.postMessage({
        message: 'navigate',
        parameters: { internalUrl: '/a-page.php' },
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/a-page.php');
    });

    test('and do a redirect for legacy searches', () => {
      useNativeMock();

      globalState.webkit.messageHandlers.NavigationRequest.postMessage({
        message: 'navigate',
        parameters: { internalUrl: '/offers.php?type=1&opensearch=1&q=nike' },
      });

      expect(mockRouter.push).toHaveBeenCalledWith('/searchresults?search=nike');
    });
  });
});
