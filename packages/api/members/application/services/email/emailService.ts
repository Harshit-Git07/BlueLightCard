import { SES } from '@aws-sdk/client-ses';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { Braze } from 'braze-api';
import {
  getEmailVerificationUrl,
  getToken,
  getUserAuth0IdByEmail,
  unverifyOrChangeEmail,
} from '@blc-mono/members/application/services/auth0/auth0Clients';
import { EmailPayload } from '@blc-mono/shared/models/members/emailModel';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { v4 as uuidv4 } from 'uuid';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { getEmailTemplatesBucketNameFromParameterStore } from '@blc-mono/members/application/providers/ParameterStore';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';
import { SecretsObject } from '@blc-mono/members/application/types/auth0types';
import {
  Auth0LinkReturn,
  emailFrom,
  EmailTemplate,
} from '@blc-mono/members/application/types/emailTypes';
import { emailChangeRequestBody } from '@blc-mono/members/application/services/email/templates/emailTemplates/emailChangeRequest';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';
import { getEmailTemplate } from '@blc-mono/members/application/services/email/templates/getEmailTemplates';

let emailServiceSingleton: EmailService;

const secrets: SecretsObject = {
  domain: getEnvOrDefault(MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_DOMAIN, ''),
  clientId: getEnvOrDefault(MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_ID, ''),
  clientSecret: getEnvOrDefault(
    MemberStackEnvironmentKeys.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET,
    '',
  ),
};

export class EmailService {
  private readonly sourceEmail = getEnvOrDefault(
    MemberStackEnvironmentKeys.MEMBERS_EMAIL_FROM,
    emailFrom,
  );
  private readonly brazeApiKey = getEnvOrDefault(
    MemberStackEnvironmentKeys.EMAIL_SERVICE_BRAZE_API_KEY,
    '',
  );
  private readonly brazeVerificationCampaignId = getEnvOrDefault(
    MemberStackEnvironmentKeys.EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID,
    '',
  );

  constructor(
    private readonly sesClient = new SES({ region: process.env.REGION ?? 'eu-west-2' }),
  ) {}

  public async sendEmailChangeRequest(newEmail: string) {
    try {
      // TODO: This needs to use the actual email, the original ticket is marked as done but isn't complete https://bluelightcard.atlassian.net/browse/MM-361
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
      logger.error({ message: 'Error sending changing email', error });
      throw error;
    }
  }

  public async sendTrustedDomainEmail(profile: ProfileModel, baseUrl: string): Promise<void> {
    const applicationId = profile.applications?.[0]?.applicationId;
    if (!applicationId) {
      throw new ValidationError('No application found on the profile');
    }

    const application = await applicationService().getApplication(profile.memberId, applicationId);
    if (!application.trustedDomainEmail) {
      throw new ValidationError('Trusted Domain not found - cannot send trusted domain email');
    }

    const trustedDomainVerificationUid = await this.addTrustedDomainUuidToApplication(
      profile.memberId,
      applicationId,
    );
    const emailPayload = this.generatePayloadFromTrustedDomainEmail(
      profile,
      application,
      trustedDomainVerificationUid,
      baseUrl,
    );

    await this.sendViaSes('trusted_domain_work_email', emailPayload);
  }

  private async addTrustedDomainUuidToApplication(
    memberId: string,
    applicationId: string,
  ): Promise<string> {
    const application = await applicationService().getApplication(memberId, applicationId);

    if (!application) {
      throw new ValidationError('Application not found');
    }
    const trustedDomainVerificationUid = uuidv4();
    application.trustedDomainVerificationUid = trustedDomainVerificationUid;

    await applicationService().updateApplication(memberId, applicationId, application);

    return trustedDomainVerificationUid;
  }

  private generatePayloadFromTrustedDomainEmail(
    profile: ProfileModel,
    application: ApplicationModel,
    trustedDomainVerificationUid: string,
    baseUrl: string,
  ): EmailPayload {
    return {
      email: profile.email,
      subject: 'Trusted Domain Verification Request',
      content: {
        F_Name: profile.firstName,
        Link: `${baseUrl}/members/${profile.memberId}/applications/${application.applicationId}/verifyTrustedDomain/${trustedDomainVerificationUid}`,
      },
    };
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

  private async verifyEmailSteps(payload: EmailPayload): Promise<Auth0LinkReturn> {
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
    const { email } = payload;
    const template = await getEmailTemplate(
      getEmailTemplatesBucketNameFromParameterStore(),
      emailType,
      payload,
    );
    if (!template) {
      logger.error({ message: 'no template found' });
      return;
    }

    try {
      await this.sesClient.sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: [email],
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

export function emailService(): EmailService {
  if (!emailServiceSingleton) {
    emailServiceSingleton = new EmailService();
  }

  return emailServiceSingleton;
}
