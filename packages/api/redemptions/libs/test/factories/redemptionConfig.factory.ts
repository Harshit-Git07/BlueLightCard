import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionConfig } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { affiliateEnum, createRedemptionsId, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

export const redemptionConfigFactory = Factory.define<RedemptionConfig>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  redemptionType: faker.helpers.arrayElement(redemptionsTable.redemptionType.enumValues),
  url: faker.internet.url(),
}));

export const genericRedemptionConfigFactory = Factory.define<RedemptionConfig>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  redemptionType: 'generic',
  url: faker.internet.url(),
  generic: {
    code: faker.string.alphanumeric(),
    id: faker.string.uuid(),
  },
}));

export const vaultRedemptionConfigFactory = Factory.define<RedemptionConfig>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  redemptionType: faker.helpers.arrayElement(['vault', 'vaultQR']),
  url: faker.internet.url(),
  vault: {
    alertBelow: faker.number.int(),
    status: faker.helpers.arrayElement(['active', 'in-active']),
    maxPerUser: faker.number.int(),
    integrationId: faker.string.uuid(),
    createdAt: faker.date.past.toString(),
    email: faker.internet.email(),
    integration: faker.helpers.arrayElement(['eagleeye', 'uniqodo']),
    id: faker.string.uuid(),
    batches: [],
  },
}));

export const ballotRedemptionConfigFactory = Factory.define<RedemptionConfig>(() => ({
  id: createRedemptionsId(),
  offerId: faker.string.uuid(),
  companyId: faker.string.uuid(),
  connection: 'affiliate',
  affiliate: faker.helpers.arrayElement(affiliateEnum.enumValues),
  offerType: 'online',
  redemptionType: 'ballot',
  url: faker.internet.url(),
  ballot: {
    id: faker.string.uuid(),
    redemptionId: faker.string.uuid(),
    totalTickets: faker.number.int(),
    drawDate: faker.date.future(),
    eventDate: faker.date.future(),
    offerName: faker.string.alphanumeric(),
    created: faker.date.past(),
    status: 'pending',
  },
}));
