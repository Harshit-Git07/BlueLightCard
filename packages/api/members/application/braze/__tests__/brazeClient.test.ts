import axios from 'axios';
import BrazeClient from '../brazeClient';

//mocks
jest.mock('@aws-lambda-powertools/logger');
jest.mock('axios');

jest.mock('aws-sdk', () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    SecretsManager: jest.fn(() => {
      return {
        getSecretValue: jest.fn(({ SecretId }) => {
          return {
            promise: () => {
              return {
                SecretString: JSON.stringify({
                  BLC_UK_DEV_API_KEY: 'dev blc api key',
                  DDS_DEV_API_KEY: 'dev dds api key',
                  BLC_AU_DEV_API_KEY: 'dev blc au api key',
                  BLC_UK_API_KEY: 'blc api key',
                  DDS_API_KEY: 'dds api key',
                  BLC_AU_API_KEY: 'blc au api key',
                }),
              };
            },
          };
        }),
      };
    }),
  };
});

describe('Braze class tests', () => {
  it('setApi key function handles being passed an unknown brand for dev', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(false, 'BLC_CANADA');
    const result = await braze.getApiKey();

    expect(result).toEqual('');
  });

  it('setApi key function handles being passed an unknown brand for prod', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(true, 'BLC_CANADA');
    const result = await braze.getApiKey();

    expect(result).toEqual('');
  });
  //will be adding more in the update ticket

  //   it('try to retrieve marketing preferences', async () => {
  //     const uuid = 'correct uuid';
  //     const braze = new Braze();
  //     await braze.setApiKey(true, 'BLC_UK');
  //     const result = await braze.retrieveMarketingPreferences(uuid);
  //     console.log(result);
  //   });

  //   happy paths

  it('constructor works and returns correctly', async () => {
    const response = new BrazeClient();
    expect(response).toEqual({ apiKey: '', instanceUrl: 'rest.fra-02.braze.eu' });
  });

  it('setApi key function works for dev blc', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(true, 'BLC_UK');
    const result = await braze.getApiKey();

    expect(result).toEqual('dev blc api key');
  });

  it('setApi key function works for dev dds', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(true, 'DDS');
    const result = await braze.getApiKey();

    expect(result).toEqual('dev dds api key');
  });

  it('setApi key function works for dev blc au', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(true, 'BLC_AU');
    const result = await braze.getApiKey();

    expect(result).toEqual('dev blc au api key');
  });

  it('setApi key function works for prod blc', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(false, 'BLC_UK');
    const result = await braze.getApiKey();

    expect(result).toEqual('blc api key');
  });

  it('setApi key function works for prod dds', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(false, 'DDS');
    const result = await braze.getApiKey();

    expect(result).toEqual('dds api key');
  });

  it('setApi key function works for prod blc au', async () => {
    const braze = new BrazeClient();
    await braze.setApiKey(false, 'BLC_AU');
    const result = await braze.getApiKey();

    expect(result).toEqual('blc au api key');
  });
});
