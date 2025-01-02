import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { BallotDetails } from '@blc-mono/redemptions/application/services/redeem/strategies/IRedeemStrategy';
import { createVaultId } from '@blc-mono/redemptions/libs/database/schema';

export const ballotDetailsFactory = Factory.define<BallotDetails>(() => ({
  id: createVaultId(),
  offerName: faker.string.alphanumeric(10),
  totalTickets: faker.number.int(),
  eventDate: faker.date.future(),
  drawDate: faker.date.future(),
}));
