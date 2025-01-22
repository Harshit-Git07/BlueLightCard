import { V5RequestOptions } from '../../../adapters';
import { sleep } from '../../../utils/sleep';
import { jsonOrNull } from '../../../utils/jsonUtils';
import { mockMemberProfileResponse } from './mockMemberProfileGet';
import { ApplicationSchema } from '../../CardVerificationAlerts/types';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';

export const mockMemberApplicationPost = async (options: V5RequestOptions) => {
  await sleep(500);
  const payload = jsonOrNull<Partial<ApplicationSchema>>(options?.body ?? '');
  const { applicationReason = ApplicationReason.SIGNUP, memberId = 'abcd-1234' } =
    payload as Partial<ApplicationSchema>;

  const mockMemberApplicationPostResponse = {
    memberId,
    applicationId: '12345678-1234-1234-12345678',
    applicationReason,
  };

  const newApplication: ApplicationSchema = {
    memberId,
    applicationId: '12345678-1234-1234-12345678',
    applicationReason,
    documents: [],
  };

  mockMemberProfileResponse.applications = [newApplication];

  return {
    status: 200,
    data: mockMemberApplicationPostResponse,
  };
};
