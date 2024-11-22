import { faAt, faEnvelope, faMobileScreenButton } from '@fortawesome/pro-solid-svg-icons';

export const preferenceDefinitions = {
  email_subscribe: {
    icon: faAt,
    title: 'Email updates',
    description: 'Receive updates on Blue Light Card, offers, promotions, and competitions.',
  },
  sms_subscribe: {
    icon: faEnvelope,
    title: 'SMS updates',
    description: 'Receive SMS updates on Blue Light Card, offers, promotions, and competitions.',
  },
  push_subscribe: {
    icon: faMobileScreenButton,
    title: 'Push notifications',
    description: 'Receive push updates on Blue Light Card, offers, promotions, and competitions.',
  },
  // personalised_offers: {
  //   icon: faUser,
  //   title: 'Personalise offers',
  //   description: 'We use cookies to show you offers tailored to your website and app usage.',
  // },
  // feedback: {
  //   icon: faComments,
  //   title: 'Feedback request',
  //   description: 'Get occasional emails asking for your feedback to improve our marketing.',
  // },
  // analytics: {
  //   icon: faChartSimple,
  //   title: 'Analytics',
  //   description: 'We monitor usage to improve content and retailer effectiveness.',
  // },
};

export type MarketingPreferencesOptInOut = 'opted_in' | 'unsubscribed';

export type MarketingPreferencesData = Record<keyof typeof preferenceDefinitions, boolean>;

export type MarketingPreferencesBlazeData = Record<
  keyof typeof preferenceDefinitions,
  MarketingPreferencesOptInOut
>;
export const marketingPreferencesDefault = (): MarketingPreferencesData => {
  // all preferences to default to false
  const entries = Object.keys(preferenceDefinitions).map((key) => [key, false]);
  return Object.fromEntries(entries) as MarketingPreferencesData;
};

export const defaultPrefBlazeData: MarketingPreferencesBlazeData = Object.fromEntries(
  Object.keys(preferenceDefinitions).map((key) => [key, 'unsubscribed']),
) as MarketingPreferencesBlazeData;

interface MarketingPreferencesGetBaseResponse {
  status: number;
  success: boolean;
  message?: string;
}

export interface MarketingPreferencesGetResponse extends MarketingPreferencesGetBaseResponse {
  data?: MarketingPreferencesData;
}

export interface MarketingPreferencesGetBlazeResponse extends MarketingPreferencesGetBaseResponse {
  data?: MarketingPreferencesBlazeData;
}

export interface MarketingPreferencesPutPayload {
  preferences: MarketingPreferencesPutPayloadNameValue[];
}

export interface MarketingPreferencesPutPayloadNameValue {
  name: keyof typeof preferenceDefinitions;
  value: MarketingPreferencesOptInOut;
}

export interface MarketingPreferencesPutResponseMessage {
  code: string;
  detail: string;
}

export interface MarketingPreferencesPutResponse {
  status: number;
  data: {
    messages?: MarketingPreferencesPutResponseMessage[];
    errors?: MarketingPreferencesPutResponseMessage[];
  };
}
