import { IPlatformAdapter } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export function useMockPlatformAdapter(
  status = 200,
  data = {},
  platform = PlatformVariant.MobileHybrid,
) {
  const getAmplitudeFeatureFlag = jest.fn();
  const invokeV5Api = jest.fn().mockResolvedValue({ status, data: JSON.stringify(data) });
  const logAnalyticsEvent = jest.fn();
  const navigate = jest.fn();
  const navigateExternal = jest.fn();
  const writeTextToClipboard = jest.fn().mockReturnValue(Promise.resolve());
  const getBrandURL = jest.fn().mockReturnValue('https://bluelightcard.co.uk');

  return {
    platform,
    getAmplitudeFeatureFlag,
    invokeV5Api,
    logAnalyticsEvent,
    navigate,
    navigateExternal,
    writeTextToClipboard,
    getBrandURL,
  } satisfies IPlatformAdapter;
}
