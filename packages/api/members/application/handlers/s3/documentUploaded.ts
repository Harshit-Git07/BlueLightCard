import { S3Event } from 'aws-lambda';
import { logger, s3Middleware } from '../../middleware';
import { ApplicationService } from '../../services/applicationService';

const applicationService = new ApplicationService();

export const unwrappedHandler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    try {
      const key = record.s3.object.key;
      const parts = key.split('/');
      const memberId = parts[1];
      const applicationId = parts[2];
      const documentId = parts[3];

      if (!documentId) {
        logger.error('Document ID is missing from the key');
        throw new Error('Invalid key format: Missing document ID');
      }
      await applicationService.documentUploadComplete(memberId, applicationId, documentId);
      logger.info('Document upload processing completed successfully', memberId);
    } catch (error) {
      logger.error('Error processing ID upload', error as Error);
      throw error;
    }
  }
};

export const handler = s3Middleware(unwrappedHandler);
