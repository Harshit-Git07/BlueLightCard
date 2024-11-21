import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { RedemptionBallotConfig } from '@blc-mono/redemptions/application/transformers/RedemptionBallotConfigTransformer';

export const redemptionBallotConfigFactory = Factory.define<RedemptionBallotConfig>(() => {
  return {
    id: 'faker.string.uuid()',
    redemptionId: faker.string.uuid(),
    drawDate: faker.date.recent(),
    totalTickets: faker.number.int(),
    eventDate: faker.date.recent(),
    offerName: faker.string.uuid(),
    created: faker.date.recent(),
  };
});
