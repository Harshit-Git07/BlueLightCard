import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BRANDS } from '@blc-mono/core/constants/common';
import { VaultEventDetail } from '@blc-mono/redemptions/application/controllers/eventBridge/vault/VaultEventDetail';
import { RedemptionsDatasyncEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/datasync';

import { VaultCreatedEvent } from '../../../application/controllers/eventBridge/vault/VaultCreatedController';
import { VaultUpdatedEvent } from '../../../application/controllers/eventBridge/vault/VaultUpdatedController';

export const vaultEventDetailFactory = Factory.define<VaultEventDetail>(() => ({
  adminEmail: faker.helpers.maybe(() => faker.internet.email()),
  alertBelow: faker.number.int(500),
  brand: faker.company.name(),
  companyId: faker.string.uuid(),
  companyName: faker.company.name(),
  directCode: faker.helpers.maybe(() => faker.string.alphanumeric(10)),
  eeCampaignId: faker.string.uuid(),
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
  ucCampaignId: faker.string.uuid(),
  vaultId: faker.string.uuid(),
  vaultStatus: faker.datatype.boolean(),
}));

export const vaultCreatedEventFactory = Factory.define<VaultCreatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: vaultEventDetailFactory.build(),
  'detail-type': 'vault.created',
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: ['vault.created'],
  source: 'vault.created',
  time: faker.date.recent().toISOString(),
  version: '0',
}));

export const vaultUpdatedEventFactory = Factory.define<VaultUpdatedEvent>(() => ({
  account: faker.string.numeric(12),
  detail: vaultEventDetailFactory.build(),
  'detail-type': RedemptionsDatasyncEvents.VAULT_UPDATED,
  id: faker.string.uuid(),
  region: faker.helpers.arrayElement(['eu-west-1', 'ap-west-2', 'us-east-1']),
  resources: [RedemptionsDatasyncEvents.VAULT_UPDATED],
  source: RedemptionsDatasyncEvents.VAULT_UPDATED,
  time: faker.date.recent().toISOString(),
  version: '0',
}));
