import axios from 'axios';
import { MarketingPreferencesEnvironment } from '@blc-mono/members/application/types/marketingPreferencesEnvironment';
import {
  BrazeUpdateAttributeValue,
  BrazeUpdateModel,
} from '@blc-mono/shared/models/members/brazeUpdateModel';
import { brazeServiceJson } from '@blc-mono/members/application/services/braze/providers/brazeServiceJson';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import { logger } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

export interface CheckListResponse {
  users: CheckListResponseUser[];
  message: string;
}

interface CheckListResponseUser {
  [key: string]: string | Record<string, unknown>;
}

export class BrazeClient {
  constructor(private readonly instanceUrl: string = 'rest.fra-02.braze.eu') {}

  async getAttributes(memberId: string, attributes: string[]): Promise<Record<string, unknown>> {
    const brazeJson = await brazeServiceJson();

    if (!brazeJson) {
      throw new Error(
        'Braze service is not configured on this environment, update secrets manager',
      );
    }

    const checkListUrl = `https://${this.instanceUrl}/users/export/ids`;
    const body = {
      external_ids: [memberId],
      fields_to_export: attributes,
    };
    const headers = {
      Authorization: `Bearer ${brazeJson.BRAZE_SERVICE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await axios.post<CheckListResponse>(checkListUrl, body, { headers });
      if (data.users[0] === undefined) {
        throw new NotFoundError('Braze user not found');
      }

      attributes[attributes.length] = 'custom_attributes';

      return Object.entries(data.users[0]).reduce<Record<string, unknown>>(
        (options, [key, value]) => {
          if (!attributes.includes(key)) return options;

          if (typeof value === 'string') {
            options[key] = value;
            return options;
          }

          for (const customAttributeKey in value) {
            if (!value[customAttributeKey] || !attributes.includes(customAttributeKey)) continue;

            options[customAttributeKey] =
              value[customAttributeKey] !== 'unsubscribed' &&
              value[customAttributeKey] !== undefined
                ? value[customAttributeKey]
                : 'unsubscribed';
          }
          return options;
        },
        {},
      );
    } catch (error) {
      logger.error({ message: 'Error getting attributes', error });
      throw error;
    }
  }

  async getMarketingPreferences(
    memberId: string,
    environment: MarketingPreferencesEnvironment,
  ): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    try {
      const brazeJson = await brazeServiceJson();
      if (!brazeJson) {
        throw new Error(
          'Braze service is not configured on this environment, update secrets manager',
        );
      }

      const checkListUrl = `https://${this.instanceUrl}/users/export/ids`;
      const body = {
        external_ids: [memberId],
        fields_to_export: ['email_subscribe', 'push_subscribe', 'custom_attributes'],
      };
      const headers = {
        Authorization: `Bearer ${brazeJson.BRAZE_SERVICE_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const { data } = await axios.post<CheckListResponse>(checkListUrl, body, { headers });
      if (data.users[0] === undefined) {
        throw new NotFoundError('Braze user not found');
      }

      const options = Object.entries(data.users[0]).reduce<Record<string, unknown>>(
        (options, [key, value]) => {
          if (typeof value === 'string') {
            if (
              key !== 'push_opted_in_at' &&
              key !== 'email_opted_in_at' &&
              key !== 'email_unsubscribed_at' &&
              key !== 'push_unsubscribed_at'
            ) {
              options[key] = value !== 'subscribed' && value !== undefined ? value : 'unsubscribed';
            }

            return options;
          }

          options.sms_subscribe =
            value.sms_subscribe === 'opted_in' && value.sms_subscribe != null
              ? value.sms_subscribe
              : 'unsubscribed';
          options.analytics =
            value.analytics !== 'subscribed' && value.analytics != null
              ? value.analytics
              : 'unsubscribed';
          options.personalised_offers =
            value.personalised_offers !== 'subscribed' && value.personalised_offers != null
              ? value.personalised_offers
              : 'unsubscribed';

          return options;
        },
        {},
      );

      if (environment === 'mobile') {
        return this.extendForMobile(options);
      }

      return options;
    } catch (error) {
      logger.error({ message: 'Error fetching marketing status', error });
      throw error;
    }
  }

  private extendForMobile(attributes: Record<string, unknown>): Record<string, unknown>[] {
    return MARKETING_BRAZE_OPTIONS.map((option) => ({
      ...option,
      status: attributes[option.brazeAlias] === 'opted_in' ? 1 : 0,
    }));
  }

  async updateBraze(memberId: string, attributes: BrazeUpdateModel['attributes']): Promise<void> {
    const brazeJson = await brazeServiceJson();
    if (!brazeJson) {
      throw new Error(
        'Braze service is not configured on this environment, update secrets manager',
      );
    }

    const checkListUrl = `https://${this.instanceUrl}/users/track`;
    const body = {
      attributes: [attributes],
    };
    const headers = {
      Authorization: `Bearer ${brazeJson.BRAZE_SERVICE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      await axios.post(checkListUrl, body, { headers });

      const containsSmsSubscribe = attributes['sms_subscribe'] !== undefined;
      if (!containsSmsSubscribe) return;

      //update subscription group
      if (
        brazeJson.BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID !== undefined &&
        brazeJson.BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID !== ''
      ) {
        try {
          await this.updateSubscriptionGroup(
            memberId,
            brazeJson.BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID,
            attributes['sms_subscribe'],
          );
        } catch (error) {
          logger.error({ message: 'Error updating Braze subscription group', error });
          throw error;
        }
      }
    } catch (error) {
      logger.error({ message: 'Error updating Braze', error });
      throw error;
    }
  }

  async updateSubscriptionGroup(
    memberId: string,
    groupId: string,
    value: BrazeUpdateAttributeValue,
  ): Promise<void> {
    const brazeJson = await brazeServiceJson();
    if (!brazeJson) {
      throw new Error(
        'Braze service is not configured on this environment, update secrets manager',
      );
    }

    const checkListUrl = `https://${this.instanceUrl}/subscription/status/set`;
    const subGroupStatus = value === 'opted_in' ? 'subscribed' : 'unsubscribed';
    const body = {
      external_id: memberId,
      subscription_group_id: groupId,
      subscription_state: subGroupStatus,
    };
    const headers = {
      Authorization: `Bearer ${brazeJson.BRAZE_SERVICE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      await axios.post(checkListUrl, body, { headers });
    } catch (error) {
      logger.error({ message: 'Error updating Braze', error });
      throw error;
    }
  }
}

const MARKETING_BRAZE_OPTIONS = [
  //email
  {
    optionId: '1',
    displayName: 'Email marketing',
    brand: 'BLC',
    alias: 'emailNews',
    brazeAlias: 'email_subscribe',
    description:
      "We'd like to send you regular email updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
    link: '',
    category: 'email',
    events: [],
  },
  //push
  {
    optionId: '2',
    displayName: 'Push notifications',
    brand: 'BLC',
    alias: 'pushNotifications',
    brazeAlias: 'push_subscribe',
    description:
      "We'd like to send you regular push updates about Blue Light Card as well as offers, promotions and competitions by our brand partners.",
    link: '',
    category: '',
    events: [],
  },
  //sms
  {
    optionId: '3',
    displayName: 'SMS Marketing',
    brand: 'BLC',
    alias: 'sms',
    brazeAlias: 'sms_subscribe',
    description:
      "We'd like to send you regular SMS updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
    link: '',
    category: '',
    events: [],
  },
  //analytics
  {
    optionId: '4',
    displayName: 'Analytics',
    brand: 'BLC',
    alias: 'analytics',
    brazeAlias: 'analytics',
    description:
      'We use cookies and similar technologies to monitor how you use our service, the effectiveness of our content and of retailers featured on our sites.',
    link: '',
    category: '',
    events: [],
  },
  //personalised offers
  {
    optionId: '5',
    displayName: 'Personalised offers',
    brand: 'BLC',
    alias: 'personalisedOffers',
    brazeAlias: 'personalised_offers',
    description:
      'We use cookies and similar technologies to make our service more personal for you, we want to be able to show you offers that we think you will like based on how you use our website and app.',
    link: '',
    category: '',
    events: [],
  },
];
