import { IPlatformAdapter } from 'src/adapters';
import { PlatformVariant } from 'src/types';

export const getMockInvoke = (redemptionType?: string) => {
  return (path: string) => {
    if (!redemptionType || redemptionType === 'error') {
      return Promise.resolve({ status: 500, data: '' });
    }
    if (path === `/eu/offers/offers/123`) {
      return Promise.resolve({
        status: 200,
        data: JSON.stringify({
          data: {
            id: 123,
            companyId: 123,
            companyLogo: 'https://cdn.bluelightcard.co.uk/companyimages/complarge/retina/5319.jpg',
            description: 'Offer Description',
            expiry: '12/10/1998',
            name: 'Test Offer',
            terms: 'Must be a Blue Light Card member in order to receive the discount.',
            type: 'Online',
          },
        }),
      });
    } else if (path === '/eu/redemptions/member/redeem') {
      if (redemptionType === 'unknown' || redemptionType === 'error') {
        return Promise.resolve({
          status: 404,
          data: '',
        });
      }
      return Promise.resolve({
        status: 200,
        data: JSON.stringify({
          kind: 'Ok',
          redemptionType: redemptionType,
          redemptionDetails: { code: 'test3-test321', url: '' },
        }),
      });
    } else {
      return Promise.resolve({
        status: 200,
        data: JSON.stringify({
          data: {
            redemptionType: redemptionType,
          },
        }),
      });
    }
  };
};

// Define the mock platform adapter
export const getMockPlatformAdapter = (
  redemptionType?: string,
  experimentBucket: string = 'treatment',
) => {
  const mockPlatformAdapter: IPlatformAdapter = {
    getAmplitudeFeatureFlag: () => experimentBucket,
    invokeV5Api: getMockInvoke(redemptionType ?? 'error'),
    logAnalyticsEvent: jest.fn(),
    navigate: jest.fn(),
    navigateExternal: jest.fn(),
    writeTextToClipboard: () => Promise.resolve(),
    getBrandURL: () => 'https://bluelightcard.co.uk',
    platform: PlatformVariant.Web,
  };

  return mockPlatformAdapter;
};
