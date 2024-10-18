import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BRANDS } from '@blc-mono/core/constants/common';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import {
  VaultCreatedEvent,
  VaultCreatedEventDetail,
} from '../../../application/controllers/eventBridge/vault/VaultCreatedController';
import {
  VaultUpdatedEvent,
  VaultUpdatedEventDetail,
} from '../../../application/controllers/eventBridge/vault/VaultUpdatedController';

export const vaultCreatedEventDetailFactory = Factory.define<VaultCreatedEventDetail>(() => ({
  adminEmail: faker.helpers.maybe(() => faker.internet.email()),
  alertBelow: faker.number.int(500),
  brand: faker.company.name(),
  companyId: faker.string.uuid(),
  companyName: faker.company.name(),
  directCode: faker.helpers.maybe(() => faker.string.alphanumeric(10)),
  eeCampaignId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  link: faker.helpers.maybe(() => faker.internet.url()),
  linkId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  managerId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  maxPerUser: faker.number.int(500),
  offerId: faker.string.uuid(),
  platform: faker.helpers.arrayElement(BRANDS),
  showQR: faker.datatype.boolean(),
  ucCampaignId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  vaultId: faker.string.uuid(),
  vaultStatus: faker.datatype.boolean(),
}));
export const vaultCreatedEventFactory = Factory.define<VaultCreatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: vaultCreatedEventDetailFactory.build(),
  'detail-type': 'vault.created',
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: ['vault.created'],
  source: 'vault.created',
  time: faker.date.recent().toISOString(),
  version: '0',
}));
export const vaultUpdatedEventDetailFactory = Factory.define<VaultUpdatedEventDetail>(() => ({
  sk: faker.string.sample(),
  alertBelow: faker.number.int(500),
  brand: faker.company.name(),
  companyId: faker.string.uuid(),
  companyName: faker.company.name(),
  eeCampaignId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  link: faker.helpers.maybe(() => faker.internet.url()),
  linkId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  email: faker.helpers.maybe(() => faker.internet.email()),
  maxPerUser: faker.number.int(500),
  offerId: faker.string.uuid(),
  showQR: faker.datatype.boolean(),
  ucCampaignId: faker.helpers.maybe(() =>
    faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
  ),
  vaultStatus: faker.datatype.boolean(),
  platform: faker.helpers.arrayElement(BRANDS),
}));
export const vaultUpdatedEventFactory = Factory.define<VaultUpdatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: vaultUpdatedEventDetailFactory.build(),
  'detail-type': RedemptionsDatasyncEvents.VAULT_UPDATED,
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsDatasyncEvents.VAULT_UPDATED],
  source: RedemptionsDatasyncEvents.VAULT_UPDATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));
