import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { FilterPattern, ILogGroup } from 'aws-cdk-lib/aws-logs';
import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Cognito, Function, Stack } from 'sst/constructs';

export const createAuditLogFunction = (
  stack: Stack,
  cognito: Cognito,
  dataStream: string,
  webClient: UserPoolClient,
  mobileClient: UserPoolClient,
  name: string,
  isDDS: boolean,
) => {
  const auditLogFunction = new Function(stack, name, {
    handler: 'packages/api/identity/src/audit/audit.handler',
    environment: {
      SERVICE: 'identity',
      DATA_STREAM: dataStream,
      WEB_CLIENT_ID: webClient.userPoolClientId,
      MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
    },
    permissions: ['firehose:PutRecord'],
  });
  const postAuthenticationLogGroup: ILogGroup | undefined =
    cognito.getFunction('postAuthentication')?.logGroup;
  postAuthenticationLogGroup?.addSubscriptionFilter(`auditLog${isDDS ? 'Dds' : ''}SignIn`, {
    destination: new LambdaDestination(auditLogFunction),
    filterPattern: FilterPattern.booleanValue('$.audit', true),
  });
  return auditLogFunction;
};

export const createAuditLogFunctionPre = (
  stack: Stack,
  cognito: Cognito,
  dataStream: string,
  webClient: UserPoolClient,
  mobileClient: UserPoolClient,
  name: string,
  isDDS: boolean,
) => {
  const auditLogFunctionPre = new Function(stack, name, {
    handler: 'packages/api/identity/src/audit/audit.handler',
    environment: {
      SERVICE: 'identity',
      DATA_STREAM: dataStream,
      WEB_CLIENT_ID: webClient.userPoolClientId,
      MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
    },
    permissions: ['firehose:PutRecord'],
  });
  const preAuthenticationLogGroup: ILogGroup | undefined =
    cognito.getFunction('preTokenGeneration')?.logGroup;
  preAuthenticationLogGroup?.addSubscriptionFilter(`auditLog${isDDS ? 'Dds' : ''}SignInPre`, {
    destination: new LambdaDestination(auditLogFunctionPre),
    filterPattern: FilterPattern.booleanValue('$.audit', true),
  });
  return auditLogFunctionPre;
};
