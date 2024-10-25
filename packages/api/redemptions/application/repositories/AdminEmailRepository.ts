import { SendEmailCommand, SendEmailCommandOutput } from '@aws-sdk/client-ses';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  vaultBatchCreatedBody,
  VaultBatchCreatedBodyParams,
} from '@blc-mono/redemptions/libs/Email/adminTemplates/vaultBatchCreated';
import { vaultThresholdCreatedBody } from '@blc-mono/redemptions/libs/Email/adminTemplates/vaultThreshold';
import { ISesClientProvider, SesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';

export type SendVaultThresholdEmailCommandParams = {
  recipient: string;
  alertBelow: number;
  remainingCodes: number;
  thresholdPercentage: number;
  companyName: string;
  offerId: string;
  offerName: string;
};

export type VaultBatchCreatedEmailParams = {
  adminEmail: string;
  vaultId: string;
  batchId: string;
  fileName: string;
  numberOfCodeInsertSuccesses: number;
  numberOfCodeInsertFailures: number;
  codeInsertFailArray: string[] | null;
  numberOfDuplicateCodes: number;
};

export interface IAdminEmailRepository {
  sendVaultThresholdEmail: (params: SendVaultThresholdEmailCommandParams) => Promise<void>;
  sendVaultBatchCreatedEmail: (params: VaultBatchCreatedEmailParams) => Promise<void>;
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

  public async sendVaultBatchCreatedEmail(params: VaultBatchCreatedEmailParams): Promise<void> {
    const source = `Blue Light Card <${this.sourceEmail}>`;
    const subject = 'BLC vault codes uploaded';
    const body = vaultBatchCreatedBody({
      subject: subject,
      vaultId: params.vaultId,
      batchId: params.batchId,
      fileName: params.fileName,
      numberOfCodeInsertSuccesses: params.numberOfCodeInsertSuccesses,
      numberOfCodeInsertFailures: params.numberOfCodeInsertFailures,
      codeInsertFailArray: params.codeInsertFailArray,
      numberOfDuplicateCodes: params.numberOfDuplicateCodes,
    } satisfies VaultBatchCreatedBodyParams);

    try {
      const client = this.sesClientProvider.getClient();
      const sendEmailCommand: SendEmailCommand = new SendEmailCommand({
        Source: source,
        Destination: {
          ToAddresses: [params.adminEmail],
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

      const result: SendEmailCommandOutput = await client.send(sendEmailCommand);

      if (result.$metadata.httpStatusCode === 200) {
        this.logger.info({
          message: 'Successfully sent BLC vault codes uploaded admin email',
          context: {
            vaultId: params.vaultId,
            batchId: params.batchId,
            fileName: params.fileName,
          },
        });
      } else {
        this.logger.error({
          message: 'Failed to send BLC vault codes uploaded admin email',
          context: {
            vaultId: params.vaultId,
            batchId: params.batchId,
            fileName: params.fileName,
            messageId: result.MessageId,
            httpStatusCode: result.$metadata.httpStatusCode,
            requestId: result.$metadata.requestId,
          },
        });
        throw new Error('Failed to send BLC vault codes uploaded admin email');
      }
    } catch (err) {
      this.logger.error({
        message: 'Failed to send BLC vault codes uploaded admin email',
        context: {
          vaultId: params.vaultId,
          batchId: params.batchId,
          fileName: params.fileName,
          error: err,
        },
      });
      throw new Error('Failed to send BLC vault codes uploaded admin email');
    }
  }
}
