import { IPlatformAdapter } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export const useMockPlatformAdapter = (
  statusCode = 200,
  body = {},
  platform = PlatformVariant.MobileHybrid,
) => {
  const getAmplitudeFeatureFlag = jest.fn();
  const invokeV5Api = jest.fn().mockResolvedValue({ statusCode, body: JSON.stringify(body) });
  const logAnalyticsEvent = jest.fn();
  const navigate = jest.fn();
  const navigateExternal = jest.fn();
  const writeTextToClipboard = jest.fn().mockReturnValue(Promise.resolve());

  const mockPlatformAdapter = {
    platform,
    getAmplitudeFeatureFlag,
    invokeV5Api,
    logAnalyticsEvent,
    navigate,
    navigateExternal,
    writeTextToClipboard,
  } satisfies IPlatformAdapter;

  return mockPlatformAdapter;
};
