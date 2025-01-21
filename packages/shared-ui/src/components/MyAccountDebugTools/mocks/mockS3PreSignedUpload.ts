import { mockMemberProfileResponse } from './mockMemberProfileGet';
import { sleep } from '../../../utils/sleep';
import { ApplicationSchema } from '../../CardVerificationAlerts/types';

export const mockS3PreSignedUpload = async (path: string) => {
  await sleep(1500);

  const application = mockMemberProfileResponse.applications.at(-1) as ApplicationSchema;
  if (!application) return { status: 404, data: {} };
  if (!application.documents) application.documents = [];
  application.documents.push(path);

  return {
    status: 204,
    data: {},
  };
};
