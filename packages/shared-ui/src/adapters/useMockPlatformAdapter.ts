import { IPlatformAdapter } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export const useMockPlatformAdapter = (statusCode = 200, body = {}) => {
  const invokeV5Api = jest.fn().mockResolvedValue({ statusCode, body: JSON.stringify(body) });
  const logAnalyticsEvent = jest.fn();
  const navigate = jest.fn();
  const navigateExternal = jest.fn();
  const writeTextToClipboard = jest.fn().mockReturnValue(Promise.resolve());

  const mockPlatformAdapter = {
    platform: PlatformVariant.MobileHybrid,
    invokeV5Api,
    logAnalyticsEvent,
    navigate,
    navigateExternal,
    writeTextToClipboard,
  } satisfies IPlatformAdapter;

  return mockPlatformAdapter;
};
