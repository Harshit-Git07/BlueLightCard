import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Stack } from 'sst/constructs';
import { DATABASE_PROPS, ENVIRONMENTS, EPHEMERAL_PR_REGEX } from '../utils/global-constants';

/**
 * The ISecretManager interface provides the necessary methods for managing secrets.
 */
export interface ISecretManager {
  get appSyncCertificateArn(): string;
  get databaseSecret(): ISecret;
}

/**
 * The SecretsManager class provides a centralized and efficient way to manage and access secrets
 * across the entire infrastructure as code (IaC) application. It utilizes the singleton pattern
 * to ensure a single instance of the class is created and used throughout the application.
 */
export class SecretManager implements ISecretManager {
  private readonly _appSyncCertificateArn: string;
  private readonly APPSYNC_CERTIFICATE_ARN_KEY: string;
  private readonly _databaseSecret?: ISecret;

  /**
   * Constructor for setting up initial values and creating necessary secrets.
   */
  constructor(private stack: Stack) {
    this.APPSYNC_CERTIFICATE_ARN_KEY = this.composeAppSyncArnKey();
    this._appSyncCertificateArn = this.fetchAppSyncCertificateArn();

    if ([ENVIRONMENTS.PRODUCTION.valueOf(), ENVIRONMENTS.STAGING.valueOf()].includes(this.stack.stage)) {
      this._databaseSecret = this.createDatabaseSecret('OffersDatabaseSecret', 'offers-database-secret');
    } else if (EPHEMERAL_PR_REGEX.test(this.stack.stage)) {
      this._databaseSecret = this.createDatabaseSecret('OffersPrDatabaseSecret', 'offers-Pr-database-secret');
    }
  }

  /**
   * Get the appSync certificate ARN.
   *
   * @return {string} the appSync certificate ARN
   */
  get appSyncCertificateArn(): string {
    return this._appSyncCertificateArn;
  }

  /**
   * Get the database secret.
   *
   * @return {ISecret} The dev database secret
   */
  get databaseSecret(): ISecret {
    return this._databaseSecret!;
  }

  /**
   * Composes the AppSync ARN key.
   *
   * @return {string} the composed AppSync ARN key
   */
  private composeAppSyncArnKey(): string {
    return `${this.stack.stage}-appSyncCertificateArn`;
  }

  /**
   * Fetches the AppSync certificate ARN from the secret manager.
   *
   * @return {string} The certificate ARN
   */
  private fetchAppSyncCertificateArn(): string {
    try {
      const certificateArnSecret: ISecret = Secret.fromSecretNameV2(
        this.stack,
        'appSyncCertificateArn',
        this.APPSYNC_CERTIFICATE_ARN_KEY,
      );
      return certificateArnSecret.secretValueFromJson(this.APPSYNC_CERTIFICATE_ARN_KEY).toString();
    } catch (e) {
      console.log('error fetching certificate arn from secrets manager');
      throw new Error('Failed to fetch certificate arn from secrets manager');
    }
  }

  /**
   * Creates a secret object for Database.
   *
   * @param {string} id the id of the secret
   * @param {string} name the name of the secret
   * @return {ISecret} the created Aurora Serverless V2 secret object
   */
  private createDatabaseSecret(id: string, name: string): ISecret {
    return new Secret(this.stack, id, {
      secretName: `${this.stack.stage}-${name}`,
      description: `Offers database credentials for ${this.stack.stage} environment`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: DATABASE_PROPS.USERNAME.valueOf() }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 20,
      },
    });
  }
}
