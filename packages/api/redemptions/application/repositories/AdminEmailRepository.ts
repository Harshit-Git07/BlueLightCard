import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { vaultThresholdCreatedBody } from '@blc-mono/redemptions/libs/Email/adminTemplates/vaultThreshold';
import { ISesClientProvider, SesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';

export type SendVaultThresholdEmailCommandParams = {
  recipient: string;
  alertBelow: number;
  remainingCodes: number;
  thresholdPercentage: number;
  companyName: string;
  offerId: number;
  offerName: string;
};

export interface IAdminEmailRepository {
  sendVaultThresholdEmail: (params: SendVaultThresholdEmailCommandParams) => Promise<void>;
}

export class AdminEmailRepository implements IAdminEmailRepository {
  static key = 'AdminEmailRepository' as const;
  static inject = [Logger.key, SesClientProvider.key] as const;

  private sourceEmail = getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EMAIL_FROM);

  constructor(
    private logger: ILogger,
    private sesClientProvider: ISesClientProvider,
  ) {}

  public async sendVaultThresholdEmail(params: SendVaultThresholdEmailCommandParams): Promise<void> {
    const sesClient = this.sesClientProvider.getClient();
    const subject = 'Vault Threshold Status';
    await sesClient
      .sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: [params.recipient],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: vaultThresholdCreatedBody({
                alertBelow: params.alertBelow,
                companyName: params.companyName,
                offerId: params.offerId,
                offerName: params.offerName,
                remainingCodes: params.remainingCodes,
                thresholdPercentage: params.thresholdPercentage,
                subject,
              }),
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      })
      .catch((error) => {
        this.logger.error({
          message: 'Failed to send email',
          error,
        });
        throw error;
      });
  }
}
