import { V5RequestOptions } from '../../../adapters';
import { sleep } from '../../../utils/sleep';
import { jsonOrNull } from '../../../utils/jsonUtils';
import { mockMemberProfileResponse } from './mockMemberProfileGet';
import { ApplicationSchema } from '../../CardVerificationAlerts/types';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';

export const mockMemberApplicationPut = async (options: V5RequestOptions) => {
  await sleep(500);
  const payload = jsonOrNull<Partial<ApplicationSchema>>(options?.body ?? '');

  const application = mockMemberProfileResponse.applications[0];
  if (!payload || !application) return { status: 404, data: {} };
  if (Array.isArray(payload.documents) && payload.documents) {
    mockMemberProfileResponse.applications[0].eligibilityStatus =
      EligibilityStatus.AWAITING_ID_APPROVAL;
  }

  mockMemberProfileResponse.applications[0] = { ...application, ...payload };

  return {
    status: 204,
    data: {},
  };
};
