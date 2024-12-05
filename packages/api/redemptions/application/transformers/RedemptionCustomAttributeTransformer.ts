import { BallotEntryStatus } from '../../libs/database/schema';
import { BallotEntriesEntityWithMemberId } from '../repositories/BallotEntriesRepository';
import { UserWithAttribute } from '../services/email/EmailService';

export class RedemptionCustomAttributeTransformer {
  static readonly key = 'RedemptionCustomAttributeTransformer';

  public transformToUsersWithCustomAttributes(
    ballotId: string,
    entries: BallotEntriesEntityWithMemberId[],
    status: BallotEntryStatus,
  ): UserWithAttribute[] {
    const attribute = `${ballotId}-ballot-${status}`;
    return entries.map((entry: { memberId: string }) => {
      return { external_id: entry.memberId, [attribute]: true };
    });
  }
}
