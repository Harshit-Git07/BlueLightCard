import { sleep } from '../../../utils/sleep';

export const mockMemberApplicationUploadDocument = async () => {
  await sleep(500);
  return {
    status: 200,
    data: {
      preSignedUrl: `http://localhost:3999/s3uploads/${new Date().toJSON()}`,
    },
  };
};
