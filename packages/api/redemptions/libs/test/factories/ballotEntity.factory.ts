import { add, set, sub } from 'date-fns';
import { Factory } from 'fishery';

import { BallotEntity, NewBallotEntity } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { createBallotsId, createRedemptionsId } from '@blc-mono/redemptions/libs/database/schema';

export const ballotActiveEntityFactory = () => {
  const date = new Date();
  const timeOptions = { hours: 21, minutes: 30, seconds: 0, milliseconds: 0 };
  const eventDate = set(date, timeOptions);

  return Factory.define<BallotEntity>(() => ({
    id: createBallotsId(),
    redemptionId: createRedemptionsId(),
    totalTickets: 10,
    offerName: 'offer one',
    drawDate: add(set(date, timeOptions), { weeks: 1 }),
    eventDate: eventDate,
    created: eventDate,
  }));
};

export const ballotEndedEntityFactory = () => {
  const date = new Date();
  const timeOptions = { hours: 21, minutes: 30, seconds: 0, milliseconds: 0 };
  const eventDate = set(date, timeOptions);

  return Factory.define<BallotEntity>(() => ({
    id: createBallotsId(),
    redemptionId: createRedemptionsId(),
    totalTickets: 10,
    offerName: 'offer one',
    drawDate: sub(set(date, timeOptions), { days: 1 }),
    eventDate: eventDate,
    created: eventDate,
  }));
};

export const newBallotEntityFactory = Factory.define<NewBallotEntity>(() => ({
  id: createBallotsId(),
  redemptionId: createRedemptionsId(),
  totalTickets: 10,
  offerName: 'offer one',
  drawDate: new Date(),
  eventDate: new Date(),
  created: new Date(),
}));

export const singleBallotEntityFactory = Factory.define<BallotEntity>(() => ({
  id: createBallotsId(),
  redemptionId: createRedemptionsId(),
  totalTickets: 10,
  offerName: 'offer one',
  drawDate: new Date(),
  eventDate: new Date(),
  created: new Date(),
}));
