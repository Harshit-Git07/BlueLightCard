import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { affiliateEnum, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';

export const redemptionConfigEntityFactory = Factory.define<RedemptionConfigEntity>(
  ({ params: { redemptionType } }) => {
    const onlineRedemptionType = ['vault', 'preApplied', 'generic'];
    const type =
      redemptionType ?? faker.helpers.arrayElement(['showCard', 'vaultQR', 'vault', 'preApplied', 'generic', 'ballot']);

    return {
      id: createRedemptionsId(),
      offerId: faker.string.uuid(),
      companyId: faker.string.uuid(),
      connection: faker.helpers.arrayElement(['affiliate', 'direct', 'spotify', 'none']),
      affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
      redemptionType: type,
      ...(onlineRedemptionType.includes(type)
        ? { offerType: 'online', url: faker.internet.url() }
        : { offerType: 'in-store', url: null }),
    };
  },
);
