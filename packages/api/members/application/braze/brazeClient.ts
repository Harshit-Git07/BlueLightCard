// @ts-nocheck
import axios from 'axios';
import * as AWS from 'aws-sdk';
import { logger } from '../middleware';

export default class BrazeClient {
  private apiKey: string = '';

  constructor(
    dev: boolean = false,
    brand: string = 'BLC_UK',
    private readonly instanceUrl: string = 'rest.fra-02.braze.eu',
  ) {
    this.setApiKey(false, brand);
  }

  async setApiKey(dev: boolean, brand: string) {
    try {
      const secret = (await this.getApiKeySecrets(dev)) || '';
      const apiKeys = JSON.parse(secret);
      let result;
      switch (brand) {
        case 'DDS':
          result = dev ? apiKeys.DDS_DEV_API_KEY : apiKeys.DDS_API_KEY;
          this.apiKey = result;
          break;
        case 'BLC_AU':
          result = dev ? apiKeys.BLC_AU_DEV_API_KEY : apiKeys.BLC_AU_API_KEY;
          this.apiKey = result;
          break;
        default:
          result = dev ? apiKeys.BLC_UK_DEV_API_KEY : apiKeys.BLC_UK_API_KEY;
          this.apiKey = result;
          break;
      }
    } catch (error) {
      logger.error({ message: 'Error setting api key', error });
      throw error;
    }
  }

  async getAttributes(memberId: string, attributes: string[]): Promise<Record<string, string>> {
    const checkListUrl = `https://${this.instanceUrl}/users/export/ids`;

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    attributes[attributes.length] = 'custom_attributes';

    const body = {
      external_ids: [memberId],
      fields_to_export: attributes,
    };

    try {
      const { data } = await axios.post(checkListUrl, body, { headers });
      if (data.users[0] === undefined) {
        throw new NotFoundError('Braze user not found');
      }

      const options = Object.entries(data.users[0]).reduce((array, [key, value]) => {
        if (key === 'custom_attributes') {
          for (const customAttributeKey in value) {
            if (value.hasOwnProperty(customAttributeKey)) {
              array[customAttributeKey] =
                value[customAttributeKey] !== 'unsubscribed' &&
                value[customAttributeKey] !== undefined
                  ? value[customAttributeKey]
                  : 'unsubscribed';
            }
          }
        } else {
          array[key] = value;
        }
        let array2 = {};
        for (let i = 0; i < Object.keys(array).length; i++) {
          for (let z = 0; z < arrayOfFieldsToExport.length; z++) {
            array2[arrayOfFieldsToExport[z]] = array[arrayOfFieldsToExport[z]];
            delete array2['custom_attributes'];
          }
        }

        return array2;
      }, {});

      return options;
    } catch (error) {
      logger.error({ message: 'Error getting attributes', error });
      throw error;
    }
  }

  async getMarketingPreferences(memberId: string, environment: 'web' | 'mobile') {
    const checkListUrl = `https://${this.instanceUrl}/users/export/ids`;

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const arrayOfFieldsToExport = ['email_subscribe', 'push_subscribe', 'custom_attributes'];

    const body = {
      external_ids: [memberId],
      fields_to_export: arrayOfFieldsToExport,
    };

    try {
      const { data } = await axios.post(checkListUrl, body, { headers });
      if (data.users[0] === undefined) {
        throw new NotFoundError('Braze user not found');
      }

      const options = Object.entries(data.users[0]).reduce(
        (array, [key, value]): [string, string] => {
          if (key === 'custom_attributes') {
            array.sms_subscribe =
              value.sms_subscribe !== 'subscribed' && value.sms_subscribe != undefined
                ? value.sms_subscribe
                : 'unsubscribed';
            array.analytics =
              value.analytics !== 'subscribed' && value.analytics != undefined
                ? value.analytics
                : 'unsubscribed';
            array.personalised_offers =
              value.personalised_offers !== 'subscribed' && value.personalised_offers != undefined
                ? value.personalised_offers
                : 'unsubscribed';
          } else {
            if (
              key !== 'push_opted_in_at' &&
              key !== 'email_opted_in_at' &&
              key !== 'email_unsubscribed_at' &&
              key !== 'push_unsubscribed_at'
            ) {
              array[key] = value !== 'subscribed' && value !== undefined ? value : 'unsubscribed';
            }
          }
          return array;
        },
        {},
      );

      if (environment === 'mobile') {
        return this.extendForMobile(options);
      } else {
        return options;
      }
    } catch (error) {
      logger.error({ message: 'Error fetching marketing status', error });
      throw error;
    }
  }

  private extendForMobile(attributes: any) {
    return MARKETING_BRAZE_OPTIONS.map((option) => ({
      ...option,
      status: attributes[option.brazeAlias] === 'opted_in' ? 1 : 0,
    }));
  }

  async enableTracking(memberId: string, attributes: any): Promise<void> {
    const checkListUrl = `https://${this.instanceUrl}/users/track`;

    const options = attributes;

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const attributesArray = {
      external_id: memberId,
    };

    for (const [key, value] of Object.entries(options)) {
      attributesArray[key] = value;
    }

    const body = {
      attributes: [attributesArray],
    };

    try {
      await axios.post(checkListUrl, body, { headers });
    } catch (error) {
      logger.error({ message: 'Error updating Braze', error });
      throw error;
    }
  }

  async updateSubscriptionGroup(memberId: string, groupId: string, value: string): Promise<void> {
    const checkListUrl = `https://${this.instanceUrl}/subscription/status/set`;

    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const attributesArray = {
      external_id: memberId,
      subscription_group_id: groupId,
      subscription_state: value,
    };

    const body = {
      attributes: [attributesArray],
    };

    try {
      await axios.post(checkListUrl, body, { headers });
    } catch (error) {
      logger.error({ message: 'Error updating Braze', error });
      throw error;
    }
  }

  // Can we use SST bindings to inject this and avoid hard coded ARNs?
  private async getApiKeySecrets(dev: boolean): Promise<string | undefined> {
    const secretArn =
      dev === true
        ? 'arn:aws:secretsmanager:eu-west-2:314658777488:secret:develop/brazeV2-W2QONL'
        : 'arn:aws:secretsmanager:eu-west-2:676719682338:secret:production/braze-QpyePT';
    const secretsManager = new AWS.SecretsManager();

    const params = {
      SecretId: secretArn,
    };

    try {
      const response = await secretsManager.getSecretValue(params).promise();
      return response.SecretString;
    } catch (error) {
      logger.error({ message: 'Error fetching secret:', error });
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
