import { Context, S3Event } from 'aws-lambda';
import { logger, s3Middleware } from '../../middleware';
import { ProfileService } from '../../services/profileService';

const profileService = new ProfileService();

export const unwrappedHandler = async (event: S3Event, context: Context): Promise<void> => {
  for (const record of event.Records) {
    const key = record.s3.object.key;
    const memberId = key.split('/')[1];

    try {
      await profileService.documentUploadComplete(memberId, key);
      logger.info('Document upload processing completed successfully', memberId);
    } catch (error: Error | any) {
      logger.error('Error processing ID upload', error);
      throw error;
    }
  }
};

export const handler = s3Middleware(unwrappedHandler);
