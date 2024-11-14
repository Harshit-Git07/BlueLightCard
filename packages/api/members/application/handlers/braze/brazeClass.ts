// @ts-nocheck
//fixing ^ this in the update ticket
import axios from 'axios';
import * as AWS from 'aws-sdk';
import { Logger } from '@aws-lambda-powertools/logger';

//error messages
const USER_NOT_FOUND_ERROR_MESSAGE = 'user not found';
const SET_API_KEY_ERROR_MESSAGE = 'failed to set api key';
const GET_MARKETING_PREFERENCES_ERROR_MESSAGE = 'Error fetching marketing status: (EC01)';
const UPDATE_BRAZE_ATTRIBUTES_ERROR_MESSAGE = 'Error updating braze: (EC02)';
const GET_BRAZE_ATTRIBUTES_ERROR_MESSAGE = 'Error getting attributes: (EC03)';
const UPDATE_SUBSCRIPTION_GROUP_ERROR_MESSAGE = 'Error updating braze: (EC04)';

export default class Braze {
  private apiKey = '';
  private instanceUrl = 'rest.fra-02.braze.eu';
  constructor() {}

  async setApiKey(dev: boolean, brand: string) {
    try {
      const response = JSON.parse(await this.getSecret(dev));
      let result;
      switch (brand) {
        case 'BLC_UK':
          result = dev ? response.BLC_UK_DEV_API_KEY : response.BLC_UK_API_KEY;
          this.apiKey = result;
          break;
        case 'DDS':
          result = dev ? response.DDS_DEV_API_KEY : response.DDS_API_KEY;
          this.apiKey = result;
          break;
        case 'BLC_AU':
          result = dev ? response.BLC_AU_DEV_API_KEY : response.BLC_AU_API_KEY;
          this.apiKey = result;
          break;
        default:
          return '';
      }
    } catch (error) {
      //handle this more gracefully
      console.log(error);
      return SET_API_KEY_ERROR_MESSAGE;
    }
  }

  async RetrieveApiKey() {
    return this.apiKey;
  }

  async retrieveMarketingPreferences(uuid: string) {
    const externalId = uuid;
    const apiKey = await this.RetrieveApiKey();
    const instanceUrl = this.instanceUrl;
    const checkListUrl = `https://${instanceUrl}/users/export/ids`;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const arrayOfFieldsToExport = ['email_subscribe', 'push_subscribe', 'custom_attributes'];

    const body = {
      external_ids: [externalId],
      fields_to_export: arrayOfFieldsToExport,
    };

    try {
      const { data } = await axios.post(checkListUrl, body, { headers });
      if (data.users[0] !== undefined) {
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
        return options;
      } else {
        return this.getUserNotFoundString();
      }
    } catch (error) {
      console.error(GET_MARKETING_PREFERENCES_ERROR_MESSAGE + error);
      throw error;
    }
  }

  async updateBrazeStuff(uuid: string, attributes: any) {
    const apiKey = this.apiKey;
    const instanceUrl = this.instanceUrl;
    const checkListUrl = `https://${instanceUrl}/users/track`;

    const options = attributes;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const attributesArray = {
      external_id: uuid,
    };

    for (const [key, value] of Object.entries(options)) {
      attributesArray[key] = value;
    }

    const body = {
      attributes: [attributesArray],
    };

    try {
      await axios.post(checkListUrl, body, { headers });
      return true;
    } catch (error) {
      console.error(UPDATE_BRAZE_ATTRIBUTES_ERROR_MESSAGE + error);
      throw error;
    }
  }

  async getAttributes(uuid: string, arrayOfFieldsToExport: string[]) {
    const externalId = uuid;
    const apiKey = this.apiKey;
    const instanceUrl = this.instanceUrl;
    const checkListUrl = `https://${instanceUrl}/users/export/ids`;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    arrayOfFieldsToExport[arrayOfFieldsToExport.length] = 'custom_attributes';

    const body = {
      external_ids: [externalId],
      fields_to_export: arrayOfFieldsToExport,
    };

    try {
      const { data } = await axios.post(checkListUrl, body, { headers });
      if (data.users[0] !== undefined) {
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
      } else {
        return this.getUserNotFoundString();
      }
    } catch (error) {
      logger.error({ message: `${GET_BRAZE_ATTRIBUTES_ERROR_MESSAGE}: ` + error });
      throw error;
    }
  }

  async updateSubscriptionGroup(uuid: string, groupId: string, value: string) {
    const apiKey = this.apiKey;
    const instanceUrl = this.instanceUrl;
    const checkListUrl = `https://${instanceUrl}/subscription/status/set`;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };

    const attributesArray = {
      external_id: uuid,
      subscription_group_id: groupId,
      subscription_state: value,
    };

    const body = {
      attributes: [attributesArray],
    };

    try {
      await axios.post(checkListUrl, body, { headers });
      return true;
    } catch (error) {
      console.error(UPDATE_SUBSCRIPTION_GROUP_ERROR_MESSAGE + error);
      throw error;
    }
  }

  async getSecret(dev: boolean) {
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
      if (response.SecretString !== undefined) {
        return response.SecretString;
      } else {
        return 'Could not retrieve secret';
      }
    } catch (err) {
      console.error('Error fetching secret:', err);
      throw err;
    }
  }

  getUserNotFoundString() {
    return USER_NOT_FOUND_ERROR_MESSAGE;
  }
}
