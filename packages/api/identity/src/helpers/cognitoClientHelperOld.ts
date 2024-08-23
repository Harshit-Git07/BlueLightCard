import { Mfa, OAuthScope, StringAttribute, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { FilterPattern, ILogGroup } from 'aws-cdk-lib/aws-logs';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Cognito, Table, Stack, Function } from 'sst/constructs';

export const buildEnvForPostAuthLambdaOld = (
  region: REGIONS,
  unsuccessfulTable: Table,
  identityTable: Table,
  logLevel: string,
) => {
  return {
    SERVICE: 'identity',
    UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME: unsuccessfulTable.tableName,
    IDENTITY_TABLE_NAME: identityTable.tableName,
    POWERTOOLS_LOG_LEVEL: logLevel,
  };
};

export const buildCognitoCdkPropsOld = () => {
  return {
    userPool: {
      mfa: Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
      standardAttributes: {
        email: { required: true, mutable: true },
        phoneNumber: { required: true, mutable: true },
      },
      customAttributes: {
        blc_old_id: new StringAttribute({ mutable: true }),
        blc_old_uuid: new StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
      },
      selfSignUpEnabled: false,
    },
  };
};

export const createWebClientOld = (
  cognito: Cognito,
  appSecret: ISecret,
  brandPrefix: string,
  type: string,
  client: string,
) => {
  return cognito.cdk.userPool.addClient(type, {
    authFlows: {
      userPassword: true,
      adminUserPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson(`${brandPrefix}_callback_${client}`).toString()],
      logoutUrls: [appSecret.secretValueFromJson(`${brandPrefix}_logout_${client}`).toString()],
    },
  });
};

export const logAndFilterPostAuthOld = (
  stack: Stack,
  cognito: Cognito,
  stream: string,
  webClient: UserPoolClient,
  mobileClient: UserPoolClient,
  name: string,
  isDds: boolean,
) => {
  const auditLogFunctionPost = new Function(stack, name, {
    handler: '../audit/audit.handler',
    environment: {
      SERVICE: 'identity',
      DATA_STREAM: stream,
      WEB_CLIENT_ID: webClient.userPoolClientId,
      MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
    },
    permissions: ['firehose:PutRecord'],
  });
  const postAuthenticationLogGroup: ILogGroup | undefined =
    cognito.getFunction('postAuthentication')?.logGroup;
  postAuthenticationLogGroup?.addSubscriptionFilter(`auditLog${isDds ? 'Dds' : ''}SignIn`, {
    destination: new LambdaDestination(auditLogFunctionPost),
    filterPattern: FilterPattern.booleanValue('$.audit', true),
  });

  return auditLogFunctionPost;
};

export const logAndFilterPreTokenOld = (
  stack: Stack,
  cognito: Cognito,
  stream: any,
  webClient: UserPoolClient,
  mobileClient: UserPoolClient,
  name: string,
  isDds: boolean,
) => {
  const auditLogFunctionPre = new Function(stack, name, {
    handler: '../audit/audit.handler',
    environment: {
      SERVICE: 'identity',
      DATA_STREAM: stream,
      WEB_CLIENT_ID: webClient.userPoolClientId,
      MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
    },
    permissions: ['firehose:PutRecord'],
  });
  const preTokenGenerationLogGroup: ILogGroup | undefined =
    cognito.getFunction('preTokenGeneration')?.logGroup;
  preTokenGenerationLogGroup?.addSubscriptionFilter(`auditLog${isDds ? 'Dds' : ''}SignInPre`, {
    destination: new LambdaDestination(auditLogFunctionPre),
    filterPattern: FilterPattern.booleanValue('$.audit', true),
  });

  return auditLogFunctionPre;
};
