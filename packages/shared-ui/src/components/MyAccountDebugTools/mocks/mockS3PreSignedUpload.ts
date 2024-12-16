import { mockMemberProfileResponse } from './mockMemberProfileGet';
import { sleep } from '../../../utils/sleep';
import { ApplicationSchema } from '../../CardVerificationAlerts/types';

export const mockS3PreSignedUpload = async (path: string) => {
  await sleep(1500);

  const application = mockMemberProfileResponse.applications[0] as ApplicationSchema;
  if (!application || !application.documents) return { status: 404, data: {} };
  application.documents.push(path);

  return {
    status: 204,
    data: {},
  };
};
