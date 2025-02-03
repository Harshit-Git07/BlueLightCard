import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EmailPayload } from '@blc-mono/shared/models/members/emailModel';
import {
  EmailTemplate,
  getEmailTemplateFileName,
} from '@blc-mono/members/application/types/emailTypes';

export async function getEmailTemplate(
  bucketName: string,
  emailType: EmailTemplate,
  payload: EmailPayload,
): Promise<string | undefined> {
  const s3 = new S3Client();

  try {
    const emailFileName = getEmailTemplateFileName(emailType);
    if (!emailFileName) return undefined;

    const command = new GetObjectCommand({ Bucket: bucketName, Key: emailFileName });
    const response = await s3.send(command);
    if (!response) return undefined;

    let processedTemplate = await response.Body?.transformToString();
    if (!processedTemplate) return undefined;

    for (const [key, value] of Object.entries(payload.content)) {
      processedTemplate = processedTemplate.replace(`{{${key}}}`, value);
    }
    return processedTemplate;
  } catch (error) {
    console.error('Error retrieving template:', error);
    return undefined;
  }
}
