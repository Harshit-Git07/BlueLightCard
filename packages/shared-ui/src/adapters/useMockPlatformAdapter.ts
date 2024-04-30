import { IPlatformAdapter } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export const useMockPlatformAdapter = (statusCode = 200, body = {}) => {
  const invokeV5Api = jest.fn().mockResolvedValue({ statusCode, body: JSON.stringify(body) });

  const logAnalyticsEvent = jest.fn();

  const navigate = jest.fn();

  const mockPlatformAdapter = {
    platform: PlatformVariant.Mobile,
    invokeV5Api,
    logAnalyticsEvent,
    navigate,
  } satisfies IPlatformAdapter;

  return mockPlatformAdapter;
};
