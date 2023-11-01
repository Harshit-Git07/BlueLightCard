import { Stack } from 'aws-cdk-lib';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class Secrets {
  readonly appSyncCertificateArn: string;
  private readonly APPSYNC_CERTIFICATE_ARN_ID: string = 'appSyncCertificateArn';
  private readonly APPSYNC_CERTIFICATE_ARN_KEY: string;

  constructor(private stack: Stack, private stage: string) {
    this.APPSYNC_CERTIFICATE_ARN_KEY = this.setAppSyncArnKey();
    this.appSyncCertificateArn = this.getAppSyncCertificateArn();
  }

  private setAppSyncArnKey(): string {
    return `${this.stage}-appSyncCertificateArn`;
  }

  private getAppSyncCertificateArn(): string {
    const certificateArnSecret: ISecret = Secret.fromSecretNameV2(
      this.stack,
      this.APPSYNC_CERTIFICATE_ARN_ID,
      this.APPSYNC_CERTIFICATE_ARN_KEY,
    );
    return certificateArnSecret.secretValueFromJson(this.APPSYNC_CERTIFICATE_ARN_KEY).toString();
  }
}
