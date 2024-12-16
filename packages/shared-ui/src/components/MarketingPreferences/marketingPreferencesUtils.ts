import {
  MarketingPreferencesBlazeData,
  MarketingPreferencesData,
  marketingPreferencesDefault,
  MarketingPreferencesGetBlazeResponse,
  MarketingPreferencesGetResponse,
  MarketingPreferencesPutPayload,
  MarketingPreferencesPutResponse,
  preferenceDefinitions,
} from './MarketingPreferencesTypes';
import { jsonOrNull } from '../../utils/jsonUtils';
import { compareStringsAlphabetically } from '../../utils/compareStringsWithLocale';
import { V5_API_URL } from '../../constants';

export const marketingPreferencesQueryKey = 'members/preferences/memberUuid';

export const getMarketingPreferencesUrl = (memberUuid: string) => {
  return `${V5_API_URL.MarketingPreferences}/${memberUuid}`;
};

export const getBooleanPrefsFromBlaze = (data: MarketingPreferencesBlazeData) => {
  const preferences = marketingPreferencesDefault();
  Object.keys(preferenceDefinitions).forEach((id) => {
    const key = id as keyof MarketingPreferencesData;
    if (data[key] === 'opted_in') preferences[key] = true;
  });
  return preferences;
};

export const getStringyPrefsForBlaze = (data: MarketingPreferencesData) => {
  const blazePrefs: MarketingPreferencesPutPayload = {
    preferences: Object.keys(preferenceDefinitions).map((id) => {
      const name = id as keyof MarketingPreferencesData;
      return { name, value: data[name] ? 'opted_in' : 'unsubscribed' };
    }),
  };
  return blazePrefs;
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

export const covertPutResponseToJson = (
  status: number,
  data: string,
): MarketingPreferencesPutResponse => {
  const json = jsonOrNull<MarketingPreferencesPutResponse>(data);
  if (!json) return { status, data: { errors: [] } };

  return {
    status,
    data: json,
  } as MarketingPreferencesPutResponse;
};

export const optedInKeys = (data: MarketingPreferencesData | undefined) => {
  if (!data) return 'ERROR';
  return Object.entries(data)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .sort(compareStringsAlphabetically)
    .join(' ');
};
