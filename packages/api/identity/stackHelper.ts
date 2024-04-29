import { Cognito, Config, EventBus, Function, Queue, Table } from 'sst/constructs';
import { BooleanAttribute, Mfa, OAuthScope, StringAttribute, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { Duration } from 'aws-cdk-lib'
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2'
import { FilterPattern, ILogGroup } from 'aws-cdk-lib/aws-logs'
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations'
import { Stack } from 'sst/constructs'
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager'
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2'
import path from 'path'
import { BRANDS } from '@blc-mono/core/types/brands.enum'
import { STAGES } from '@blc-mono/core/types/stages.enum'
import { REGIONS } from  '@blc-mono/core/types/regions.enum'
import { CognitoHostedUICustomization } from './src/constructs/CognitoHostedUICustomization';
import externalClientProvidersUk from "../identity/src/cognito/resources/externalCognitoPartners-eu-west-2.json";
import externalClientProvidersAus from "../identity/src/cognito/resources/externalCognitoPartners-ap-southeast-2.json";

const cognitoHostedUiAssets = path.join('packages', 'api', 'identity', 'assets');
const getBlcShineCertificateArn = (appSecret: ISecret) =>
  appSecret.secretValueFromJson('blc_shine_certificate_arn').toString();
const getAuSuffix = (region: REGIONS) => (region === REGIONS.AP_SOUTHEAST_2 ? '-au' : '');

const getAuthCustomDomainName = (brandName: BRANDS = BRANDS.BLC_UK, stage: STAGES, region: REGIONS) => {
  const domainPrefix = brandName === BRANDS.DDS_UK ? 'auth-dds' : 'auth';

  const authCustomDomainNameLookUp: Record<string, string> = {
    [REGIONS.EU_WEST_2]: `${domainPrefix}.blcshine.io`,
    [REGIONS.AP_SOUTHEAST_2]: `${domainPrefix}${getAuSuffix(region)}.blcshine.io`,
  };

  const customDomainName =
    stage === STAGES.PRODUCTION ? authCustomDomainNameLookUp[region] : `${stage}-${authCustomDomainNameLookUp[region]}`;

  return customDomainName;
};

export function createOldCognito(
  stack: Stack,
  unsuccessfulLoginAttemptsTable: Table,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  identitySecret: ISecret,
  identityTable: Table
) {
  const cognito = new Cognito(stack, 'cognito', {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {
          SERVICE: 'identity',
          API_URL: appSecret.secretValueFromJson('blc_url').toString(),
          API_AUTH: appSecret.secretValueFromJson('blc_auth').toString(),
          EVENT_BUS: bus.eventBusName,
          EVENT_SOURCE: 'user.signin.migrated',
          DLQ_URL: dlq.queueUrl,
          REGION: region,
        },
        permissions: [bus],
      },
      postAuthentication: {
        handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
        environment: {
          SERVICE: 'identity',
          TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
        },
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
          REGION: region,
          IDENTITY_TABLE_NAME: identityTable.tableName
        },
        permissions: ['dynamodb:*']
      }
    },
    cdk: {
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
    },
  });

  const blcOldDomainPrefix = `blc${stack.stage === STAGES.PRODUCTION ? '' : `-${stack.stage}`}${getAuSuffix(
    stack.region as REGIONS,
  )}-old`;

  cognito.cdk.userPool.addDomain('BLCOldCognitoDomain', {
    cognitoDomain: {
      domainPrefix: blcOldDomainPrefix,
    },
  });

  const mobileClient = cognito.cdk.userPool.addClient('membersClient', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('blc_callback_app').toString()],
      logoutUrls: [appSecret.secretValueFromJson('blc_logout_app').toString()],
    },
  });
  const webClient = cognito.cdk.userPool.addClient('webClient', {
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
      callbackUrls: [appSecret.secretValueFromJson('blc_callback_web').toString()],
      logoutUrls: [appSecret.secretValueFromJson('blc_logout_web').toString()],
    },
  });

  new CfnWebACLAssociation(stack, 'BlcWebAclAssociation', {
    resourceArn: cognito.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });

  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    const blcAuditLogFunction = new Function(stack, 'blcAuditLogSignInOldPool', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-blc-production-login',
        WEB_CLIENT_ID: webClient.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const postAuthenticationLogGroup: ILogGroup | undefined = cognito.getFunction('postAuthentication')?.logGroup;
    postAuthenticationLogGroup?.addSubscriptionFilter('auditLogSignIn', {
      destination: new LambdaDestination(blcAuditLogFunction),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
    const blcAuditLogFunctionPre = new Function(stack, 'blcAuditLogSignInOldPoolPre', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-blc-production-login',
        WEB_CLIENT_ID: webClient.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const preTokenGenerationLogGroup: ILogGroup | undefined =
      cognito.getFunction('preTokenGeneration')?.logGroup;
      preTokenGenerationLogGroup?.addSubscriptionFilter('auditLogSignInPre', {
      destination: new LambdaDestination(blcAuditLogFunctionPre),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
  }

  return { oldCognito: cognito, oldWebClient: webClient };
}

export function createOldCognitoDDS(
  stack: Stack,
  unsuccessfulLoginAttemptsTable: Table,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  identitySecret: ISecret,
  identityTable: Table
) {
  //auth - DDS
  const cognito_dds = new Cognito(stack, 'cognito_dds', {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {
          SERVICE: 'identity',
          API_URL: appSecret.secretValueFromJson('dds_url').toString(),
          API_AUTH: appSecret.secretValueFromJson('dds_auth').toString(),
          EVENT_BUS: bus.eventBusName,
          EVENT_SOURCE: 'user.signin.migrated',
          DLQ_URL: dlq.queueUrl,
          REGION: region,
        },
        permissions: [bus],
      },
      postAuthentication: {
        handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
        environment: {
          SERVICE: 'identity',
          TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes']
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
          REGION: region,
          IDENTITY_TABLE_NAME: identityTable.tableName
        },
        permissions: ['dynamodb:*']
      }
    },
    cdk: {
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
    },
  });

  const ddsOldDomainPrefix = `dds${stack.stage === STAGES.PRODUCTION ? '' : `-${stack.stage}`}${getAuSuffix(
    stack.region as REGIONS,
  )}-old`;

  cognito_dds.cdk.userPool.addDomain('DDSOldCognitoDomain', {
    cognitoDomain: {
      domainPrefix: ddsOldDomainPrefix,
    },
  });

  const mobileClientDds = cognito_dds.cdk.userPool.addClient('membersClient', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('dds_callback_app').toString()],
      logoutUrls: [appSecret.secretValueFromJson('dds_logout_app').toString()],
    },
  });
  const webClientDds = cognito_dds.cdk.userPool.addClient('webClient', {
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
      callbackUrls: [appSecret.secretValueFromJson('dds_callback_web').toString()],
      logoutUrls: [appSecret.secretValueFromJson('dds_logout_web').toString()],
    },
  });

  // Associate WAF WebACL with cognito
  new CfnWebACLAssociation(stack, 'DdsWebAclAssociation', {
    resourceArn: cognito_dds.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });

  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    const ddsAuditLogFunction = new Function(stack, 'ddsAuditLogSignInOldPool', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-dds-production-login',
        WEB_CLIENT_ID: webClientDds.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClientDds.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const postAuthenticationLogGroupDds: ILogGroup | undefined =
      cognito_dds.getFunction('postAuthentication')?.logGroup;
    postAuthenticationLogGroupDds?.addSubscriptionFilter('auditLogDdsSignIn', {
      destination: new LambdaDestination(ddsAuditLogFunction),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
    const ddsAuditLogFunctionPre = new Function(stack, 'ddsAuditLogSignInOldPoolPre', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-dds-production-login',
        WEB_CLIENT_ID: webClientDds.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClientDds.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const preTokenGenerationLogGroupDds: ILogGroup | undefined =
      cognito_dds.getFunction('preTokenGeneration')?.logGroup;
      preTokenGenerationLogGroupDds?.addSubscriptionFilter('auditLogDdsSignInPre', {
      destination: new LambdaDestination(ddsAuditLogFunctionPre),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
  }

  return { oldCognitoDds: cognito_dds, oldWebClientDds: webClientDds };
}

export function createNewCognito(
  stack: Stack,
  unsuccessfulLoginAttemptsTable: Table,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  oldCognito: Cognito,
  oldCognitoWebClient: UserPoolClient,
  identitySecret: ISecret,
  identityTable: Table
) {
  const blcHostedUiCSSPath = path.join(cognitoHostedUiAssets, 'blc-hosted-ui.css');
  const blcLogoPath = path.join(cognitoHostedUiAssets, 'blc-logo.png');

  const cognito = new Cognito(stack, 'cognitoNew', {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {
          OLD_USER_POOL_ID: oldCognito.userPoolId,
          OLD_CLIENT_ID: oldCognitoWebClient.userPoolClientId,
          OLD_CLIENT_SECRET: oldCognitoWebClient.userPoolClientSecret.toString(),
          SERVICE: 'identity',
          API_URL: appSecret.secretValueFromJson('blc_url').toString(),
          API_AUTH: appSecret.secretValueFromJson('blc_auth').toString(),
          EVENT_BUS: bus.eventBusName,
          EVENT_SOURCE: 'user.signin.migrated',
          DLQ_URL: dlq.queueUrl,
          REGION: region,
        },
        permissions: [bus, 'cognito-idp:AdminInitiateAuth', 'cognito-idp:AdminGetUser'],
      },
      postAuthentication: {
        handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
        environment: {
          SERVICE: 'identity',
          TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
          OLD_USER_POOL_ID: oldCognito.userPoolId,
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes', unsuccessfulLoginAttemptsTable]
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
          REGION: region,
          IDENTITY_TABLE_NAME: identityTable.tableName
        },
        permissions: ['dynamodb:*', identityTable],
      },
      preAuthentication: {
        handler: 'packages/api/identity/src/cognito/preAuthentication.handler',
        environment: buildEnvironmentVarsForPreAuthLambda(unsuccessfulLoginAttemptsTable, identitySecret, false),
        permissions: [unsuccessfulLoginAttemptsTable]
      }
    },
    cdk: {
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
          migrated_old_pool: new BooleanAttribute({mutable: true}),
          'e2e': new StringAttribute({ mutable: true }),
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
    },
  });
  const mobileClient = cognito.cdk.userPool.addClient('mobileClientNew', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('blc_callback_app').toString()],
      logoutUrls: [appSecret.secretValueFromJson('blc_logout_app').toString()],
    },
  });
  const webClient = cognito.cdk.userPool.addClient('webClientNew', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('blc_callback_web').toString()],
      logoutUrls: [appSecret.secretValueFromJson('blc_logout_web').toString()],
    },
  });

  // For non-production stages, create a client for E2E testing. This client is
  // used to issue tokens. We don't want to use the web client for this as it
  // would couple the E2E tests for other stacks to the configuration of the
  // web client.
  if (stack.stage !== STAGES.PRODUCTION) {
    const e2eClient = cognito.cdk.userPool.addClient('e2eClientNew', {
      authFlows: {
        adminUserPassword: true,
      },
    });
    new Config.Parameter(stack, 'IDENTITY_COGNITO_E2E_CLIENT_ID', {
      value: e2eClient.userPoolClientId,
    });
  }

  // Create Cognito domains
  if (stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING) {
    cognito.cdk.userPool.addDomain('BLCCognitoCustomDomain', {
      customDomain: {
        domainName: getAuthCustomDomainName(BRANDS.BLC_UK, stack.stage, stack.region as REGIONS),
        certificate: Certificate.fromCertificateArn(
          stack,
          'BLCAuthDomainCertificate',
          getBlcShineCertificateArn(appSecret),
        ),
      },
    });
  } else {
    const blcDomainPrefix = `${stack.stage}-blc${getAuSuffix(stack.region as REGIONS)}`;

    cognito.cdk.userPool.addDomain('BLCCognitoDomain', {
      cognitoDomain: {
        domainPrefix: blcDomainPrefix,
      },
    });
  }

  new CognitoHostedUICustomization(
    stack,
    stack.region === REGIONS.AP_SOUTHEAST_2 ? BRANDS.BLC_AU : BRANDS.BLC_UK,
    cognito.cdk.userPool,
    [webClient, mobileClient],
    blcHostedUiCSSPath,
    blcLogoPath,
  );

  // Associate WAF WebACL with cognito
  new CfnWebACLAssociation(stack, 'BlcWebAclAssociationNew', {
    resourceArn: cognito.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });
  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    const dataStream = (region === REGIONS.AP_SOUTHEAST_2) ? 'dwh-blc-p1-production-login' : 'dwh-blc-production-login';
    const blcAuditLogFunction = new Function(stack, 'blcAuditLogSignIn', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: dataStream,
        WEB_CLIENT_ID: webClient.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const postAuthenticationLogGroup: ILogGroup | undefined = cognito.getFunction('postAuthentication')?.logGroup;
    postAuthenticationLogGroup?.addSubscriptionFilter('auditLogSignIn', {
      destination: new LambdaDestination(blcAuditLogFunction),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
    const blcAuditLogFunctionPre = new Function(stack, 'blcAuditLogSignInPre', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: dataStream,
        WEB_CLIENT_ID: webClient.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const preAuthenticationLogGroup: ILogGroup | undefined = cognito.getFunction('preTokenGeneration')?.logGroup;
    preAuthenticationLogGroup?.addSubscriptionFilter('auditLogSignInPre', {
      destination: new LambdaDestination(blcAuditLogFunctionPre),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });

    createExternalClient(stack, cognito, false);
  }
  return cognito;
}

export function createNewCognitoDDS(
  stack: Stack,
  unsuccessfulLoginAttemptsTable: Table,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  oldCognito: Cognito,
  oldCognitoWebClient: UserPoolClient,
  identitySecret: ISecret,
  identityTable: Table
) {
  const ddsHostedUiCSSPath = path.join(cognitoHostedUiAssets, 'dds-hosted-ui.css');
  const ddsLogoPath = path.join(cognitoHostedUiAssets, 'dds-logo.png');

  //auth - DDS
  const cognito_dds = new Cognito(stack, 'cognito_ddsNew', {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {
          OLD_USER_POOL_ID: oldCognito.userPoolId,
          OLD_CLIENT_ID: oldCognitoWebClient.userPoolClientId,
          OLD_CLIENT_SECRET: oldCognitoWebClient.userPoolClientSecret.toString(),
          SERVICE: 'identity',
          API_URL: appSecret.secretValueFromJson('dds_url').toString(),
          API_AUTH: appSecret.secretValueFromJson('dds_auth').toString(),
          EVENT_BUS: bus.eventBusName,
          EVENT_SOURCE: 'user.signin.migrated',
          DLQ_URL: dlq.queueUrl,
          REGION: region,
        },
        permissions: [bus, 'cognito-idp:AdminInitiateAuth', 'cognito-idp:AdminGetUser'],
      },
      postAuthentication: {
        handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
        environment: {
          SERVICE: 'identity',
          TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
          OLD_USER_POOL_ID: oldCognito.userPoolId,
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes', unsuccessfulLoginAttemptsTable]
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
          REGION: region,
          IDENTITY_TABLE_NAME: identityTable.tableName
        },
        permissions: ['dynamodb:*', identityTable],
      },
      preAuthentication: {
        handler: 'packages/api/identity/src/cognito/preAuthentication.handler',
        environment: buildEnvironmentVarsForPreAuthLambda(unsuccessfulLoginAttemptsTable, identitySecret, true),
        permissions: [unsuccessfulLoginAttemptsTable]
      }
    },
    cdk: {
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
          migrated_old_pool: new BooleanAttribute({mutable: true})
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
    },
  });

  if (stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING) {
    cognito_dds.cdk.userPool.addDomain('DDSCognitoCustomDomain', {
      customDomain: {
        domainName: getAuthCustomDomainName(BRANDS.DDS_UK, stack.stage, stack.region as REGIONS),
        certificate: Certificate.fromCertificateArn(
          stack,
          'DDSAuthDomainCertificate',
          getBlcShineCertificateArn(appSecret),
        ),
      },
    });
  } else {
    const ddsDomainPrefix = `${stack.stage}-dds${getAuSuffix(stack.region as REGIONS)}`;

    cognito_dds.cdk.userPool.addDomain('DDSCognitoDomain', {
      cognitoDomain: {
        domainPrefix: ddsDomainPrefix,
      },
    });
  }

  const mobileClientDds = cognito_dds.cdk.userPool.addClient('mobileClientNew', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('dds_callback_app').toString()],
      logoutUrls: [appSecret.secretValueFromJson('dds_logout_app').toString()],
    },
  });
  const webClientDds = cognito_dds.cdk.userPool.addClient('webClientNew', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    oAuth: {
      flows: {
        authorizationCodeGrant: true,
      },
      scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
      callbackUrls: [appSecret.secretValueFromJson('dds_callback_web').toString()],
      logoutUrls: [appSecret.secretValueFromJson('dds_logout_web').toString()],
    },
  });

  new CognitoHostedUICustomization(
    stack,
    BRANDS.DDS_UK,
    cognito_dds.cdk.userPool,
    [webClientDds, mobileClientDds],
    ddsHostedUiCSSPath,
    ddsLogoPath,
  );

  // Associate WAF WebACL with cognito
  new CfnWebACLAssociation(stack, 'DdsWebAclAssociationNew', {
    resourceArn: cognito_dds.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });

  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    const ddsAuditLogFunction = new Function(stack, 'ddsAuditLogSignIn', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-dds-production-login',
        WEB_CLIENT_ID: webClientDds.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClientDds.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const postAuthenticationLogGroupDds: ILogGroup | undefined =
      cognito_dds.getFunction('postAuthentication')?.logGroup;
    postAuthenticationLogGroupDds?.addSubscriptionFilter('auditLogDdsSignIn', {
      destination: new LambdaDestination(ddsAuditLogFunction),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
    const ddsAuditLogFunctionPre = new Function(stack, 'ddsAuditLogSignInPre', {
      handler: 'packages/api/identity/src/audit/audit.handler',
      environment: {
        SERVICE: 'identity',
        DATA_STREAM: 'dwh-dds-production-login',
        WEB_CLIENT_ID: webClientDds.userPoolClientId,
        MOBILE_CLIENT_ID: mobileClientDds.userPoolClientId,
      },
      permissions: ['firehose:PutRecord'],
    });
    const preAuthenticationLogGroupDds: ILogGroup | undefined =
      cognito_dds.getFunction('preTokenGeneration')?.logGroup;
      preAuthenticationLogGroupDds?.addSubscriptionFilter('auditLogDdsSignInPre', {
      destination: new LambdaDestination(ddsAuditLogFunctionPre),
      filterPattern: FilterPattern.booleanValue('$.audit', true),
    });
    
    createExternalClient(stack, cognito_dds, true);
  }
  
  return cognito_dds;
}

function buildEnvironmentVarsForPreAuthLambda(unsuccessfulLoginAttemptsTable: Table, identitySecret: ISecret, isDds: boolean) {
  const API_AUTHORISER_USER = isDds ? 'DDS_API_AUTHORISER_USER' : 'BLC_API_AUTHORISER_USER';
  const API_AUTHORISER_PASSWORD = isDds ? 'DDS_API_AUTHORISER_PASSWORD' : 'BLC_API_AUTHORISER_PASSWORD';
  const RESET_PASSWORD_API_URL = isDds ? 'DDS_RESET_PASSWORD_API_URL' : 'BLC_RESET_PASSWORD_API_URL';

  return {
    SERVICE: 'identity',
    TABLE_NAME: unsuccessfulLoginAttemptsTable.tableName,
    API_AUTHORISER_USER: identitySecret.secretValueFromJson(API_AUTHORISER_USER).toString(),
    API_AUTHORISER_PASSWORD: identitySecret.secretValueFromJson(API_AUTHORISER_PASSWORD).toString(),
    RESET_PASSWORD_API_URL: identitySecret.secretValueFromJson(RESET_PASSWORD_API_URL).toString(),
    WRONG_PASSWORD_ENTER_LIMIT: identitySecret.secretValueFromJson('WRONG_PASSWORD_ENTER_LIMIT').toString(),
    WRONG_PASSWORD_RESET_TRIGGER_MINUTES: identitySecret.secretValueFromJson('WRONG_PASSWORD_RESET_TRIGGER_MINUTES').toString(),
  }
}

const createExternalClient = (stack: Stack, cognito: Cognito, isDds: boolean) => {
  const providerList = stack.region === REGIONS.AP_SOUTHEAST_2 ? externalClientProvidersAus: externalClientProvidersUk
  const providers = isDds? providerList.DDS : providerList.BLC;

  providers.map((clients: { partnersName: string; callBackUrl: string; signoutUrl: string; }) => {
        cognito.cdk.userPool.addClient(clients.partnersName, {
        authFlows: {
          userPassword: true,
        },
        generateSecret: true,
        oAuth: {
          flows: {
            authorizationCodeGrant: true,
          },
          scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE, OAuthScope.COGNITO_ADMIN],
          callbackUrls: [clients.callBackUrl],
          logoutUrls: [clients.signoutUrl],
        },
      });
    })
}