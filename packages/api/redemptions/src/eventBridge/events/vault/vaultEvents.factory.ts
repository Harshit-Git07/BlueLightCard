import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { VaultCreatedEvent, VaultCreatedEventDetail } from './vaultEvents';

export const vaultCreatedEventDetailFactory = Factory.define<VaultCreatedEventDetail>(() => ({
  adminEmail: faker.helpers.maybe(() => faker.internet.email()),
  alertBelow: faker.number.int(500),
  brand: faker.company.name(),
  companyId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
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
  offerId: faker.number.int({
    min: 1,
    max: 1_000_000,
  }),
  platform: faker.helpers.arrayElement(['BLC_UK', 'BLC_AU', 'DDS_UK']),
  showQR: faker.datatype.boolean(),
  terms: faker.lorem.paragraph(),
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
