import { sleep } from '../../../utils/sleep';

export const mockMemberApplicationUploadDocument = async () => {
  await sleep(500);
  const documentId = new Date().toJSON();
  return {
    status: 200,
    data: {
      documentId,
      preSignedUrl: `http://localhost:3999/s3uploads/${documentId}`,
    },
  };
};
