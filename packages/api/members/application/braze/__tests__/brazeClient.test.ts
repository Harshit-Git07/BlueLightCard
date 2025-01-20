import axios, { AxiosResponse } from 'axios';
import BrazeClient, { CheckListResponse } from '../brazeClient';
import { NotFoundError } from '../../errors/NotFoundError';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('axios');

beforeEach(() => {
  process.env.BRAZE_SERVICE_JSON =
    '{"BRAZE_SERVICE_API_KEY":"", "BRAZE_SERVICE_SERVICE_SMS_CAMPAIGN_ID":"", "BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID":""}';
});

describe('Braze class tests', () => {
  it('retrieving marketing preferences user not found - web', async () => {
    const mockResponse = {
      data: {
        users: [undefined],
        message: 'success',
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    const braze = new BrazeClient();

    try {
      await braze.getMarketingPreferences('invalidMemberId', 'web');
      fail('Expected NotFoundError');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('retrieving braze attributes user not found - web', async () => {
    const mockResponse = {
      data: {
        users: [undefined],
        message: 'success',
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    const braze = new BrazeClient();

    try {
      await braze.getAttributes('invalidMemberId', ['att1', 'att2']);
      fail('Expected NotFoundError');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('constructor works and returns correctly', async () => {
    const braze = new BrazeClient();
    expect(braze).toEqual({
      instanceUrl: 'rest.fra-02.braze.eu',
      brazeJson: {
        BRAZE_SERVICE_API_KEY: '',
        BRAZE_SERVICE_SERVICE_SMS_CAMPAIGN_ID: '',
        BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID: '',
      },
    });
  });

  it('retrieving marketing preferences - web', async () => {
    const data: CheckListResponse = {
      users: [
        {
          custom_attributes: {
            0: 'blank',
            card_holder: false,
            card_requested: '2024-04-15T10:31:22.000Z',
            card_status: 1,
            sign_up_date: '2024-04-15T10:31:22.000Z',
            marketing_opt_outs: ['Email marketing', 'SMS Marketing', 'Push notifications'],
            sms_subscribe: 'unsubscribed',
            county: 'Leicestershire',
            service: 'AMBU',
            trust: 'Air Ambulance',
            marketing_opt_ins: ['Analytics', 'NightwatchTests', 'Personalised offers'],
            analytics: 'opted_in',
            personalised_offers: 'opted_in',
            smsSubscriptionGroup: 'unused - was for testing',
          },
          push_subscribe: 'unsubscribed',
          push_unsubscribed_at: '2024-10-17T09:50:54.707Z',
          email_subscribe: 'unsubscribed',
          email_unsubscribed_at: '2024-11-22T12:12:24.712Z',
        },
      ],
      message: 'success',
    };
    const mockResponse = {
      data,
    } as unknown as AxiosResponse<CheckListResponse>;
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const braze = new BrazeClient();
    const result = await braze.getMarketingPreferences('correctMemberId', 'web');

    expect(result).toEqual({
      sms_subscribe: 'unsubscribed',
      analytics: 'opted_in',
      personalised_offers: 'opted_in',
      push_subscribe: 'unsubscribed',
      email_subscribe: 'unsubscribed',
    });
  });

  it('retrieving marketing preferences - mobile', async () => {
    const data: CheckListResponse = {
      users: [
        {
          custom_attributes: {
            0: 'blank',
            card_holder: false,
            card_requested: '2024-04-15T10:31:22.000Z',
            card_status: 1,
            sign_up_date: '2024-04-15T10:31:22.000Z',
            marketing_opt_outs: ['Email marketing', 'SMS Marketing', 'Push notifications'],
            sms_subscribe: 'unsubscribed',
            county: 'Leicestershire',
            service: 'AMBU',
            trust: 'Air Ambulance',
            marketing_opt_ins: ['Analytics', 'NightwatchTests', 'Personalised offers'],
            analytics: 'opted_in',
            personalised_offers: 'opted_in',
            smsSubscriptionGroup: 'unused - was for testing',
          },
          push_subscribe: 'unsubscribed',
          push_unsubscribed_at: '2024-10-17T09:50:54.707Z',
          email_subscribe: 'unsubscribed',
          email_unsubscribed_at: '2024-11-22T12:12:24.712Z',
        },
      ],
      message: 'success',
    };
    const mockResponse: AxiosResponse<CheckListResponse> = {
      data,
    } as unknown as AxiosResponse<CheckListResponse>;
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const braze = new BrazeClient();
    const result = await braze.getMarketingPreferences('correctMemberId', 'mobile');

    expect(result).toEqual([
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
        status: 0,
      },
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
        status: 0,
      },
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
        status: 0,
      },
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
        status: 1,
      },
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
        status: 1,
      },
    ]);
  });

  it('get attributes from braze', async () => {
    const data: CheckListResponse = {
      users: [
        {
          custom_attributes: {
            0: 'blank',
            card_holder: false,
            card_requested: '2024-04-15T10:31:22.000Z',
            card_status: 1,
            sign_up_date: '2024-04-15T10:31:22.000Z',
            marketing_opt_outs: ['Email marketing', 'SMS Marketing', 'Push notifications'],
            sms_subscribe: 'unsubscribed',
            county: 'Leicestershire',
            service: 'AMBU',
            trust: 'Air Ambulance',
            marketing_opt_ins: ['Analytics', 'NightwatchTests', 'Personalised offers'],
            analytics: 'opted_in',
            personalised_offers: 'opted_in',
            smsSubscriptionGroup: 'unused - was for testing',
          },
          push_subscribe: 'unsubscribed',
          push_unsubscribed_at: '2024-10-17T09:50:54.707Z',
          email_subscribe: 'unsubscribed',
          email_unsubscribed_at: '2024-11-22T12:12:24.712Z',
        },
      ],
      message: 'success',
    };
    const mockResponse = {
      data,
    } as unknown as AxiosResponse<CheckListResponse>;
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const braze = new BrazeClient();
    const result = await braze.getAttributes('correctMemberId', ['push_subscribe', 'analytics']);

    expect(result).toEqual({
      push_subscribe: 'unsubscribed',
      analytics: 'opted_in',
    });
  });

  it('update attributes to braze', async () => {
    const mockResponse = {
      data: {
        message: 'success',
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const braze = new BrazeClient();
    const result = await braze.updateBraze('correctMemberId', {
      push_subscribe: 'opted_in',
      analytics: 'unsubscribed',
    });

    expect(result).toEqual(undefined);
  });

  it('update attributes to braze and subscription group', async () => {
    const mockResponse = {
      data: {
        message: 'success',
      },
    };
    process.env.BRAZE_SERVICE_JSON =
      '{"BRAZE_SERVICE_API_KEY":"", "BRAZE_SERVICE_SERVICE_SMS_CAMPAIGN_ID":"", "BRAZE_SERVICE_MARKETING_SMS_CAMPAIGN_ID":"sms"}';
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    const braze = new BrazeClient();
    const result = await braze.updateBraze('correctMemberId', {
      sms_subscribe: 'opted_in',
      analytics: 'unsubscribed',
    });

    expect(result).toEqual(undefined);
  });
});
