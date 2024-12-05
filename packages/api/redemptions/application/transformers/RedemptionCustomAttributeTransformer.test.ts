import { BallotEntryStatus } from '../../libs/database/schema';
import { UserWithAttribute } from '../services/email/EmailService';

import { RedemptionCustomAttributeTransformer } from './RedemptionCustomAttributeTransformer';

const redemptionCustomAttributeTransformer: RedemptionCustomAttributeTransformer =
  new RedemptionCustomAttributeTransformer();

describe('transformToUsersWithCustomAttributes', () => {
  it('should transform db select results, ballotID, and entry status to an array of users with a custom attribute', () => {
    const dummyBallotId = 'dummyBallotId';
    const dummyStatus = 'dummyStatus';
    const dummyMemberId1 = 'dummyMemberId1';
    const dummyMemberId2 = 'dummyMemberId2';
    const dummyMemberId3 = 'dummyMemberId3';
    const entries = [{ memberId: dummyMemberId1 }, { memberId: dummyMemberId2 }, { memberId: dummyMemberId3 }];
    const expectedCustomAttribute = `${dummyBallotId}-ballot-${dummyStatus}`;
    const expectedResult: UserWithAttribute[] = [
      {
        external_id: dummyMemberId3,
        [expectedCustomAttribute]: true,
      },
      {
        external_id: dummyMemberId2,
        [expectedCustomAttribute]: true,
      },
      {
        external_id: dummyMemberId1,
        [expectedCustomAttribute]: true,
      },
    ];

    const result = redemptionCustomAttributeTransformer.transformToUsersWithCustomAttributes(
      dummyBallotId,
      entries,
      dummyStatus as unknown as BallotEntryStatus,
    );

    expect(result).toStrictEqual(expect.arrayContaining(expectedResult));
    expect(result.length).toBe(3);
  });
});
