import { PutObjectCommand } from '@aws-sdk/client-s3';
import { logger, s3Client } from '../instances';
import { getTestDataFiles } from '../utils';

export async function uploadTestFilesS3(bucket: string) {
  const files = getTestDataFiles();

  logger.info({ message: `Uploading test data files to s3 bucket '${bucket}'` });

  await Promise.all(
    files.map((file) => {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Body: file.content,
        Key: file.key,
      });
      return s3Client.send(command);
    }),
  );

  logger.info({ message: `Successfully uploaded ${files.length} test files` });
}
