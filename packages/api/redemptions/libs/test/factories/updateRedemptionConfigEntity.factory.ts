import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { GENERIC, GIFTCARD, PREAPPLIED, REDEMPTION_TYPES, VAULT } from '@blc-mono/core/constants/redemptions';
import { UpdateRedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { affiliateEnum, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';

export const updateRedemptionConfigEntityFactory = Factory.define<UpdateRedemptionConfigEntity>(
  ({ params: { redemptionType } }) => {
    const type = redemptionType ?? faker.helpers.arrayElement(REDEMPTION_TYPES);
    const onlineRedemptionType = [GENERIC, GIFTCARD, PREAPPLIED, VAULT];

    return {
      id: createRedemptionsId(),
      companyId: faker.string.uuid(),
      offerId: faker.string.uuid(),
      affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
      connection: faker.helpers.arrayElement(['affiliate', 'direct', 'spotify', 'none']),
      redemptionType: type,
      ...(onlineRedemptionType.includes(type)
        ? { offerType: 'online', url: faker.internet.url() }
        : { offerType: 'in-store', url: null }),
    };
  },
);
