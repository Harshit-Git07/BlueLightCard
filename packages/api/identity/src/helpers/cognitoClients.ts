import externalClientProvidersAus from '../cognito/resources/externalCognitoPartners-ap-southeast-2.json';
import externalClientProvidersUk from '../cognito/resources/externalCognitoPartners-eu-west-2.json';
import { CognitoHostedUICustomization } from '../constructs/CognitoHostedUICustomization';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { BRANDS } from '@blc-mono/core/types/brands.enum';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { OAuthScope, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Cognito, Config, Stack } from 'sst/constructs';
import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import path from 'path';

const cognitoHostedUiAssets = path.join('..', '..', 'assets');
const blcHostedUiCSSPath = path.join(cognitoHostedUiAssets, 'blc-hosted-ui.css');
const blcLogoPath = path.join(cognitoHostedUiAssets, 'blc-logo.png');
const ddsHostedUiCSSPath = path.join(cognitoHostedUiAssets, 'dds-hosted-ui.css');
const ddsLogoPath = path.join(cognitoHostedUiAssets, 'dds-logo.png');

export const createExternalClient = (
  stack: Stack,
  cognito: Cognito,
  isDds: boolean,
  uiCustomizationRole: Role,
) => {
  const providerList =
    stack.region === REGIONS.AP_SOUTHEAST_2
      ? externalClientProvidersAus
      : externalClientProvidersUk;
  const providers = isDds ? providerList.DDS : providerList.BLC;
  let loginClientIdMap: any = {};

  providers.map(
    (clients: {
      partnersName: string;
      callBackUrl: string;
      signoutUrl: string;
      partnerUniqueId: string;
      generateSecret?: boolean;
    }) => {
      const blcBrand = stack.region === REGIONS.AP_SOUTHEAST_2 ? BRANDS.BLC_AU : BRANDS.BLC_UK;
      const externalClient = cognito.cdk.userPool.addClient(clients.partnersName, {
        authFlows: {
          userPassword: true,
        },
        generateSecret: clients.generateSecret ?? true,
        oAuth: {
          flows: {
            authorizationCodeGrant: true,
          },
          scopes: [
            OAuthScope.EMAIL,
            OAuthScope.OPENID,
            OAuthScope.PROFILE,
            OAuthScope.COGNITO_ADMIN,
          ],
          callbackUrls: [clients.callBackUrl],
          logoutUrls: [clients.signoutUrl],
        },
      });
      new CognitoHostedUICustomization(
        stack,
        isDds ? 'dds' : 'blc',
        isDds ? BRANDS.DDS_UK : blcBrand,
        cognito.cdk.userPool,
        [externalClient],
        isDds ? ddsHostedUiCSSPath : blcHostedUiCSSPath,
        isDds ? ddsLogoPath : blcLogoPath,
        uiCustomizationRole,
      );
      // partnerUniqueId key should match with LOGIN_CLIENT_TYPE
      loginClientIdMap[externalClient.userPoolClientId] = clients.partnerUniqueId;
    },
  );
  return loginClientIdMap;
};

export const createClient = (
  cognito: Cognito,
  appSecret: ISecret,
  brandPrefix: string,
  type: string,
  client: string,
) => {
  return cognito.cdk.userPool.addClient(type, {
    authFlows: {
      userPassword: true,
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

export const createRoleForHostedUi = (
  stack: Stack,
  [cognito, webClient, mobileClient]: [Cognito, UserPoolClient, UserPoolClient],
  roleName: string,
  cognitoPoolArn: string,
  brandName: string,
  isDDS: boolean,
) => {
  const uiCustomizationRole = new Role(stack, roleName, {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
    inlinePolicies: {
      cognitoPolicy: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:SetUICustomization', 'cognito-idp:DescribeUserPool'],
            effect: Effect.ALLOW,
            resources: [cognitoPoolArn],
          }),
          // Note that the resource for DescribeUserPoolDomain needs to be "*" since we can't get an ARN for the cognitoDomain.
          new PolicyStatement({
            actions: ['cognito-idp:DescribeUserPoolDomain'],
            effect: Effect.ALLOW,
            resources: ['*'],
          }),
        ],
      }),
    },
  });
  new CognitoHostedUICustomization(
    stack,
    isDDS ? 'dds' : 'blc',
    brandName,
    cognito.cdk.userPool,
    [webClient, mobileClient],
    isDDS ? ddsHostedUiCSSPath : blcHostedUiCSSPath,
    isDDS ? ddsLogoPath : blcLogoPath,
    uiCustomizationRole,
  );
  return uiCustomizationRole;
};

export const createE2EClient = (stack: Stack, cognito: Cognito) => {
  const e2eClient = cognito.cdk.userPool.addClient('e2eClientNew', {
    authFlows: {
      adminUserPassword: true,
    },
  });
  return new Config.Parameter(stack, 'IDENTITY_COGNITO_E2E_CLIENT_ID', {
    value: e2eClient.userPoolClientId,
  });
};
