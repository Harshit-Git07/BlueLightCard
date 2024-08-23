import {
  AccountRecovery,
  BooleanAttribute,
  Mfa,
  StringAttribute,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { Cognito, EventBus, Queue, Table } from 'sst/constructs';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';

export const buildEnvForPostAuthLambda = (
  region: REGIONS,
  unsuccessfulTable: Table,
  identityTable: Table,
  logLevel: string,
  oldCognito: Cognito,
) => {
  return {
    SERVICE: 'identity',
    UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME: unsuccessfulTable.tableName,
    IDENTITY_TABLE_NAME: identityTable.tableName,
    REGION: region,
    POWERTOOLS_LOG_LEVEL: logLevel,
    OLD_USER_POOL_ID: oldCognito.userPoolId,
  };
};

export const buildEnvForPreTokenGenerationLambda = (
  appSecret: ISecret,
  region: string,
  identityTable: Table,
  logLevel: string,
  brandPrefix: string,
) => {
  const AMPLITUDE_API_KEY = appSecret
    .secretValueFromJson(`${brandPrefix}_amplitude_api_key`)
    .toString();
  const POOL_INFO = region === REGIONS.AP_SOUTHEAST_2 ? `${brandPrefix}-au` : `${brandPrefix}-uk`;
  return {
    SERVICE: 'identity',
    REGION: region,
    IDENTITY_TABLE_NAME: identityTable.tableName,
    POWERTOOLS_LOG_LEVEL: logLevel,
    AMPLITUDE_API_KEY,
    POOL_INFO,
  };
};

export const buildEnvironmentVarsForPreAuthLambda = (
  unsuccessfulLoginAttemptsTable: Table,
  identitySecret: ISecret,
  isDds: boolean,
) => {
  const API_AUTHORISER_USER = isDds ? 'DDS_API_AUTHORISER_USER' : 'BLC_API_AUTHORISER_USER';
  const API_AUTHORISER_PASSWORD = isDds
    ? 'DDS_API_AUTHORISER_PASSWORD'
    : 'BLC_API_AUTHORISER_PASSWORD';
  const RESET_PASSWORD_API_URL = isDds
    ? 'DDS_RESET_PASSWORD_API_URL'
    : 'BLC_RESET_PASSWORD_API_URL';

  return {
    SERVICE: 'identity',
    UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
    API_AUTHORISER_USER: identitySecret.secretValueFromJson(API_AUTHORISER_USER).toString(),
    API_AUTHORISER_PASSWORD: identitySecret.secretValueFromJson(API_AUTHORISER_PASSWORD).toString(),
    RESET_PASSWORD_API_URL: identitySecret.secretValueFromJson(RESET_PASSWORD_API_URL).toString(),
    WRONG_PASSWORD_ENTER_LIMIT: identitySecret
      .secretValueFromJson('WRONG_PASSWORD_ENTER_LIMIT')
      .toString(),
    WRONG_PASSWORD_RESET_TRIGGER_MINUTES: identitySecret
      .secretValueFromJson('WRONG_PASSWORD_RESET_TRIGGER_MINUTES')
      .toString(),
  };
};

export const buildEnvForMigrationLambda = (
  region: REGIONS,
  appSecret: ISecret,
  [bus, dlq]: [EventBus, Queue],
  [oldCognito, oldCognitoWebClient]: [Cognito, UserPoolClient],
  identityTable: Table,
  logLevel: string,
  isDds: boolean,
) => ({
  OLD_USER_POOL_ID: oldCognito.userPoolId,
  OLD_CLIENT_ID: oldCognitoWebClient.userPoolClientId,
  OLD_CLIENT_SECRET: oldCognitoWebClient.userPoolClientSecret.toString(),
  SERVICE: 'identity',
  API_URL: appSecret.secretValueFromJson(`${isDds ? 'dds' : 'blc'}_url`).toString(),
  API_AUTH: appSecret.secretValueFromJson(`${isDds ? 'dds' : 'blc'}_auth`).toString(),
  EVENT_BUS: bus.eventBusName,
  EVENT_SOURCE: 'user.signin.migrated',
  DLQ_URL: dlq.queueUrl,
  REGION: region,
  IDENTITY_TABLE_NAME: identityTable.tableName,
  POWERTOOLS_LOG_LEVEL: logLevel,
});

export const buildCognitoCdkProps = (isDds: boolean) => {
  const cognitoBaseCdkProps = {
    userPool: {
      mfa: Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      standardAttributes: {
        email: { required: false, mutable: true },
        phoneNumber: { required: false, mutable: true },
      },
      customAttributes: {
        blc_old_id: new StringAttribute({ mutable: true }),
        blc_old_uuid: new StringAttribute({ mutable: true }),
        migrated_old_pool: new BooleanAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      selfSignUpEnabled: false,
    },
  };

  return isDds
    ? cognitoBaseCdkProps
    : {
        ...cognitoBaseCdkProps,
        userPool: {
          ...cognitoBaseCdkProps.userPool,
          customAttributes: {
            ...cognitoBaseCdkProps.userPool.customAttributes,
            e2e: new StringAttribute({ mutable: true }),
          },
        },
      };
};
