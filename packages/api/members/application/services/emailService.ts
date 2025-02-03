import { SES } from '@aws-sdk/client-ses';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { logger } from '../middleware';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { emailChangeRequestBody } from '@blc-mono/members/libs/emailTemplates/emailChangeRequest';
import { getEmailTemplate } from '@blc-mono/members/libs/getEmailTemplates';
import { Braze } from 'braze-api';
import { Config } from 'sst/node/config';
import {
  getEmailVerificationUrl,
  getToken,
  getUserAuth0IdByEmail,
  unverifyOrChangeEmail,
} from '../auth0/auth0Clients';
import { auth0LinkReturn, emailFrom, EmailTemplate } from '../types/emailTypes';
import { secretsObject } from '../types/auth0types';
import { EmailPayload } from '@blc-mono/shared/models/members/emailModel';

const secrets: secretsObject = {
  domain: getEnvOrDefault(MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_DOMAIN, ''),
  clientId: getEnvOrDefault(MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_ID, ''),
  clientSecret: getEnvOrDefault(
    MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET,
    '',
  ),
};

export class EmailService {
  private readonly sourceEmail: string;
  private readonly bucketName: string = Config['email-templates-bucket'];
  private readonly brazeApiKey: string = getEnvOrDefault(
    MemberStackEnvironmentKeys.EMAIL_SERVICE_BRAZE_API_KEY,
    '',
  );
  private readonly brazeVerificationCampaignId = getEnvOrDefault(
    MemberStackEnvironmentKeys.EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID,
    '',
  );

  constructor(private readonly sesClient = new SES({ region: process.env.REGION ?? 'eu-west-2' })) {
    this.sourceEmail = getEnvOrDefault(MemberStackEnvironmentKeys.MEMBERS_EMAIL_FROM, emailFrom);
  }

  public async sendEmail(emailType: EmailTemplate, payload: EmailPayload): Promise<void> {
    switch (emailType) {
      case 'auth0_verification':
        await this.triggerAuth0Email(payload);
        break;
      default: {
        const emailTypesVerification = [
          'activation_email_new_journey',
          'activation_email',
          'activation_reminder',
          'incorrect_addresss_reminder',
          'validate_renewal',
          'verify_new_email',
          'trusted_domain_work_email',
        ];
        if (emailTypesVerification.includes(emailType)) {
          const { url } = await this.verifyEmailSteps(payload);
          payload = {
            ...payload,
            content: {
              ...payload.content,
              Link: url,
            },
          };
        }
        await this.sendViaSes(emailType, payload);
        break;
      }
    }
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

  private async verifyEmailSteps(payload: EmailPayload): Promise<auth0LinkReturn> {
    const token = await getToken(secrets);
    const email = payload.email;
    const id = await getUserAuth0IdByEmail(email, token, secrets.domain);
    const url = await getEmailVerificationUrl(id, secrets);
    const memberId = await unverifyOrChangeEmail(payload, token, id, secrets.domain);
    return { memberId, url };
  }

  private async triggerAuth0Email(payload: EmailPayload): Promise<void> {
    const { url, memberId } = await this.verifyEmailSteps(payload);
    await this.sendViaBraze(url, memberId, this.brazeVerificationCampaignId);
  }

  private async sendViaSes(emailType: EmailTemplate, payload: EmailPayload): Promise<void> {
    const { email, workEmail } = payload;
    const emailToSendTo = workEmail ?? email;
    const template = await getEmailTemplate(this.bucketName, emailType, payload);
    if (!template) {
      logger.error({ message: 'no template found' });
      return;
    }

    try {
      await this.sesClient.sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: [emailToSendTo],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: template,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: payload.subject,
          },
        },
      });
    } catch (error) {
      logger.error({ message: 'Failed to send email', error });
      throw new Error('Failed to send email');
    }
  }

  private async sendViaBraze(url: string, memberId: string, campaignId: string): Promise<void> {
    if (!url || !memberId || !campaignId) {
      throw new Error(
        `Failed to send braze email: url:${url}, uuid:${memberId}, campaignId:${campaignId}`,
      );
    }
    const brazeUrl = 'https://rest.fra-02.braze.eu';
    const brazeApiKey = this.brazeApiKey;

    try {
      const braze = new Braze(brazeUrl, brazeApiKey);
      await braze.campaigns.trigger.send({
        campaign_id: campaignId,
        recipients: [{ external_user_id: memberId, trigger_properties: { url } }],
      });
    } catch (error) {
      throw new Error(`Failed to send verify email: ${error}`);
    }
  }
}
