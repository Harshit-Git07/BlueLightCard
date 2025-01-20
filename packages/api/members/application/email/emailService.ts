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
      MemberStackEnvironmentKeys.SERVICE_LAYER_EMAIL_FROM,
      'noreply@bluelightcard.co.uk',
    );
  }

  public async sendEmailChangeRequest(emailAddress: string): Promise<void> {
    const subject = 'Change Email Request';
    // TODO - stick below function into the this.getEmailBody()
    //  generic template lookup... at some point...
    const body = emailChangeRequestBody({ subject: subject });

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailSignup(emailAddress: string): Promise<void> {
    const subject = 'Welcome to Blue Light Card';
    const body = this.getEmailBody('signup-email');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailTrustedDomain(emailAddress: string): Promise<void> {
    const subject = 'Trusted Domain Verification Request';
    const body = this.getEmailBody('trusted-domain');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailPromoPayment(emailAddress: string): Promise<void> {
    const subject = 'Promo Code Payment Accepted';
    const body = this.getEmailBody('promo-code-payment');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailPaymentMade(emailAddress: string): Promise<void> {
    const subject = 'Payment Made';
    const body = this.getEmailBody('payment-made');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailMembershipLive(emailAddress: string): Promise<void> {
    const subject = 'Membership Live';
    const body = this.getEmailBody('membership-live');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailCardCreated(emailAddress: string): Promise<void> {
    const subject = 'Card Created';
    const body = this.getEmailBody('card-created');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailCardPosted(emailAddress: string): Promise<void> {
    const subject = 'Card Posted';
    const body = this.getEmailBody('card-posted');

    await this.sendEmail(emailAddress, subject, body);
  }

  public async sendEmailRenewal(emailAddress: string): Promise<void> {
    const subject = 'Renewal Notice/Completion';
    const body = this.getEmailBody('renewal-notice');

    await this.sendEmail(emailAddress, subject, body);
  }

  private async sendEmail(emailAddress: string, subject: string, body: string): Promise<void> {
    try {
      await this.sesClient.sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: [emailAddress],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: body,
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

  private getEmailBody(template: string): string {
    // TODO - this function will need to go read the email
    //  templates from an S3 bucket - pending template
    //  load definition and implementation
    switch (template) {
      case 'signup-email':
        return 'signup-email body';
      case 'trusted-domain':
        return 'trusted-domain body';
      case 'promo-code-payment':
        return 'promo-code-payment body';
      case 'payment-made':
        return 'payment-made body';
      case 'membership-live':
        return 'membership-live body';
      case 'card-created':
        return 'card-created body';
      case 'card-posted':
        return 'card-posted body';
      case 'renewal-notice':
        return 'renewal-notice body';
      default:
        return 'default email body';
    }
  }
}
