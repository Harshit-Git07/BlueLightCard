import { set, sub } from 'date-fns';
import { Factory } from 'fishery';

import { BallotEntriesEntity } from '@blc-mono/redemptions/application/repositories/BallotEntriesRepository';
import {
  ballotEntryStatusEnum,
  createBallotEntriesId,
  createBallotsId,
} from '@blc-mono/redemptions/libs/database/schema';

export const ballotEntryFactory = () => {
  const date = new Date();
  const timeOptions = { hours: 20, minutes: 30, seconds: 0, milliseconds: 0 };
  const eventDate = set(date, timeOptions);

  return Factory.define<BallotEntriesEntity>(() => ({
    id: createBallotEntriesId(),
    ballotId: createBallotsId(),
    memberId: '122345',
    status: ballotEntryStatusEnum.enumValues[0],
    entryDate: sub(set(date, timeOptions), { days: 1 }),
    created: eventDate,
  }));
};
