import {
  MarketingPreferencesBlazeData,
  MarketingPreferencesData,
  marketingPreferencesDefault,
  MarketingPreferencesGetBlazeResponse,
  MarketingPreferencesGetResponse,
  MarketingPreferencesOptInOut,
  MarketingPreferencesPostModel,
  MarketingPreferencesPostResponse,
  preferenceDefinitions,
} from './types';
import { jsonOrNull } from '../../utils/jsonUtils';
import { compareStringsAlphabetically } from '../../utils/compareStringsWithLocale';

export const marketingPreferencesQueryKey = 'members/memberUuid/marketing/braze';

export const getBooleanPrefsFromBlaze = (data: MarketingPreferencesBlazeData) => {
  const preferences = marketingPreferencesDefault();
  Object.keys(preferenceDefinitions).forEach((id) => {
    const key = id as keyof MarketingPreferencesData;
    if (data[key] === 'opted_in') preferences[key] = true;
  });
  return preferences;
};

export const getStringyPrefsForBraze = (
  data: MarketingPreferencesData,
): MarketingPreferencesPostModel => {
  const attributes: Record<string, MarketingPreferencesOptInOut> = Object.fromEntries(
    Object.keys(preferenceDefinitions).map((key) => {
      const attribute = key as keyof MarketingPreferencesData;
      return [attribute, data[attribute] ? 'opted_in' : 'unsubscribed'];
    }),
  );

  const brazePrefs: MarketingPreferencesPostModel = {
    attributes: attributes,
  };

  return brazePrefs;
};

export const convertGetResponseToJson = (
  status: number,
  data: string,
): MarketingPreferencesGetResponse => {
  const json = jsonOrNull<MarketingPreferencesGetBlazeResponse>(data);
  if (!json?.data) return { status, success: false, message: data };

  // convert strings of opted_in and unsubscribed to boolean
  return {
    status,
    success: json?.success ?? false,
    data: getBooleanPrefsFromBlaze(json.data),
    message: json?.message,
  };
};

export const covertPostResponseToJson = (
  status: number,
  data: string,
): MarketingPreferencesPostResponse => {
  const json = jsonOrNull<MarketingPreferencesPostResponse>(data);
  if (!json) return { status, data: { errors: [] } };

  return {
    status,
    data: json,
  } as MarketingPreferencesPostResponse;
};

export const optedInKeys = (data: MarketingPreferencesData | undefined) => {
  if (!data) return 'ERROR';
  return Object.entries(data)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .sort(compareStringsAlphabetically)
    .join(' ');
};
