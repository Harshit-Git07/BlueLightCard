import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const unwrappedHandler = async (): Promise<void> => {
  // TODO: Implement handler, should implement retrieving all files currently on SFTP server and uploading them to S3 bucket
};

export const handler = middleware(unwrappedHandler);
