import { useMockPlatformAdapter } from '../../adapters';
import { getRedemptionDetails, redeemOffer, RedeemResultKind } from '../redemptions';
import { undefined } from 'zod';

describe('getRedemptionDetails', () => {
  test('getRedemptionDetails calls the redemption details endpoint', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

    const result = await getRedemptionDetails(mockPlatformAdapter, 123);

    expect(result).toEqual({ data: { redemptionType: 'vault' } });
    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
      '/eu/redemptions/member/redemptionDetails',
      {
        method: 'GET',
        queryParameters: { offerId: '123' },
      },
    );
  });

  test('getRedemptionDetails throws an error if the redemption details endpoint does not return a 200', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);

    const result = getRedemptionDetails(mockPlatformAdapter, 123);

    expect(result).rejects.toThrow('Unable to retrieve redemption details');
  });
});

describe('redeemOffer', () => {
  test('redeemOffer calls the redeem endpoint', async () => {
    const mockedResponseData = {
      statusCode: 200,
      data: {
        kind: RedeemResultKind.OK,
        redemptionType: 'vault',
        redemptionDetails: {
          url: 'https://example.com',
          code: '123456',
        },
      },
    };

    const expectedResponse = {
      data: mockedResponseData.data,
      state: RedeemResultKind.OK,
    };

    const mockPlatformAdapter = useMockPlatformAdapter(200, mockedResponseData);

    const result = await redeemOffer(mockPlatformAdapter, 123, 'offerName', 'companyName');

    expect(result).toEqual(expectedResponse);

    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/eu/redemptions/member/redeem', {
      method: 'POST',
      body: JSON.stringify({ offerId: 123, offerName: 'offerName', companyName: 'companyName' }),
    });
  });

  test('redeemOffer throws an error if the user has reached limit of code for offer', async () => {
    const mockResponseData = {
      statusCode: 403,
      data: { kind: RedeemResultKind.MaxPerUserReached, message: 'max reached' },
    };

    const expectedResponse = {
      data: mockResponseData.data,
      state: RedeemResultKind.MaxPerUserReached,
    };

    const mockPlatformAdapter = useMockPlatformAdapter(403, mockResponseData);
    const result = await redeemOffer(mockPlatformAdapter, 123, 'offerName', 'companyName');
    expect(result).toEqual(expectedResponse);
  });

  test('redeemOffer throws an error if the redeem endpoint does not return a 200', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500, {
      statusCode: 500,
      data: { message: 'error' },
    });

    const result = redeemOffer(mockPlatformAdapter, 123, 'offerName', 'companyName');

    expect(result).rejects.toThrow('Unable to redeem offer');
  });
});
