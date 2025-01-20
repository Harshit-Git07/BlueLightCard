import { S3Event } from 'aws-lambda';
import { logger, s3Middleware } from '../../middleware';
import { ProfileService } from '../../services/profileService';

const profileService = new ProfileService();

export const unwrappedHandler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const key = record.s3.object.key;
    const memberId = key.split('/')[1];

    try {
      await profileService.documentUploadComplete(memberId);
      logger.info('Document upload processing completed successfully', memberId);
    } catch (error) {
      logger.error('Error processing ID upload', error as Error);
      throw error;
    }
  }
};

export const handler = s3Middleware(unwrappedHandler);
