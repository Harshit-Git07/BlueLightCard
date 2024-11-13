import { UpdateRedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';

import { UpdateRedemptionConfigEntityBuilder } from './UpdateRedemptionConfigEntityBuilder';

const updateRedemptionConfigEntityBuilder = new UpdateRedemptionConfigEntityBuilder();

describe('buildUpdateRedemptionConfigEntity', () => {
  it('returns UpdateRedemptionConfigEntity with affiliate=null and url=null when link is null', () => {
    const result = updateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity(null);

    const expectedRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      redemptionType: 'vaultQR',
      connection: 'none',
      affiliate: null,
      url: null,
      offerType: 'in-store',
    };
    expect(result).toEqual(expectedRedemptionConfigEntity);
  });

  it('returns fully populated UpdateRedemptionConfigEntity when link is not null and affiliate is found', () => {
    const result = updateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity(
      'https://www.awin1.com/a/b?c=d',
    );

    const expectedRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      redemptionType: 'vault',
      connection: 'affiliate',
      affiliate: 'awin',
      url: 'https://www.awin1.com/a/b?c=d',
      offerType: 'online',
    };
    expect(result).toEqual(expectedRedemptionConfigEntity);
  });

  it('sets URL to null when link is not null but affiliate is not found', () => {
    const result = updateRedemptionConfigEntityBuilder.buildUpdateRedemptionConfigEntity('https://www.example.com');

    const expectedRedemptionConfigEntity: UpdateRedemptionConfigEntity = {
      redemptionType: 'vault',
      connection: 'direct',
      affiliate: null,
      url: 'https://www.example.com',
      offerType: 'online',
    };
    expect(result).toEqual(expectedRedemptionConfigEntity);
  });
});
