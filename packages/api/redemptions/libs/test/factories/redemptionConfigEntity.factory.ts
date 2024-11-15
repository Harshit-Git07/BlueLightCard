import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import {
  CREDITCARD,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  REDEMPTION_TYPES,
  VAULT,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { affiliateEnum, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';

export const redemptionConfigEntityFactory = Factory.define<RedemptionConfigEntity>(
  ({ params: { redemptionType } }) => {
    const onlineRedemptionType = [GENERIC, GIFTCARD, PREAPPLIED, VAULT, CREDITCARD, VERIFY];
    const type = redemptionType ?? faker.helpers.arrayElement(REDEMPTION_TYPES);

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
