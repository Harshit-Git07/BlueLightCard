import { SES } from '@aws-sdk/client-ses';

import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { logger } from '../middleware';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { emailChangeRequestBody } from '@blc-mono/members/libs/emailTemplates/emailChangeRequest';

export class EmailService {
  private readonly sesClient: SES;
  private readonly sourceEmail: string;

  constructor() {
    this.sesClient = new SES({ region: process.env.REGION ?? 'eu-west-2' });
    this.sourceEmail = getEnvOrDefault(
      MemberStackEnvironmentKeys.MEMBERS_EMAIL_FROM,
      'noreply@bluelightcard.co.uk',
    );
  }

  public async sendEmailChangeRequest(newEmail: string): Promise<void> {
    try {
      const subject = 'Change Email Request';
      await this.sesClient.sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: [newEmail],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: emailChangeRequestBody({ subject: subject }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      });
    } catch (error) {
      logger.error({ message: 'Failed to send email', error });
      throw error;
    }
  }
}
