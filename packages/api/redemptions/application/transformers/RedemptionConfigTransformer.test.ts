import { transformToRedemptionConfig } from './RedemptionConfigTransformer';

describe('Redemption Config Formatter', () => {
  it('returns the correct shape for Show Card config', () => {
    const showCard = {
      id: 'show-card-id',
      companyId: 1234,
      offerId: 4321,
      connection: 'none',
      offerType: 'in-store',
      redemptionType: 'showCard',
      affiliate: null,
      url: null,
    } as const;

    const showCardResponse = {
      id: showCard.id,
      companyId: showCard.companyId.toString(),
      offerId: showCard.offerId.toString(),
      connection: showCard.connection,
      offerType: showCard.offerType,
      redemptionType: showCard.redemptionType,
    };

    const result = transformToRedemptionConfig(showCard);

    expect(result).toStrictEqual(showCardResponse);
  });

  it('returns the correct shape for PreApplied config', () => {
    const preApplied = {
      id: 'pre-applied-id',
      companyId: 1234,
      offerId: 4321,
      connection: 'none',
      offerType: 'online',
      redemptionType: 'preApplied',
      affiliate: 'awin',
      url: 'some-url',
    } as const;

    const preAppliedResponse = {
      ...preApplied,
      companyId: preApplied.companyId.toString(),
      offerId: preApplied.offerId.toString(),
    };

    const result = transformToRedemptionConfig(preApplied);

    expect(result).toStrictEqual(preAppliedResponse);
  });
});
