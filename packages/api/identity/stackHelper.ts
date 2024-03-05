import { Cognito, EventBus, Function, Queue } from 'sst/constructs';
import { BooleanAttribute, Mfa, OAuthScope, StringAttribute, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { Duration } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
import { FilterPattern, ILogGroup } from 'aws-cdk-lib/aws-logs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { Stack } from 'sst/constructs';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import path from 'path';
import { BRANDS } from '@blc-mono/core/types/brands.enum';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { CognitoHostedUICustomization } from './src/constructs/CognitoHostedUICustomization';

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
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
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
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes']
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
        },
        permissions: ['dynamodb:*'],
      },
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
    refreshTokenValidity: Duration.hours(1),
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
  if (stack.stage === 'production') {
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
  }

  return { oldCognito: cognito, oldWebClient: webClient };
}

export function createOldCognitoDDS(
  stack: Stack,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
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
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes']
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
        },
        permissions: ['dynamodb:*'],
      },
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
    refreshTokenValidity: Duration.hours(1),
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
  if (stack.stage === 'production') {
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
  }

  return { oldCognitoDds: cognito_dds, oldWebClientDds: webClientDds };
}

export function createNewCognito(
  stack: Stack,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  oldCognito: Cognito,
  oldCognitoWebClient: UserPoolClient,
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
          OLD_USER_POOL_ID: oldCognito.userPoolId,
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes']
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
        },
        permissions: ['dynamodb:*'],
      },
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
          blc_old_id: new StringAttribute({mutable: true}),
          blc_old_uuid: new StringAttribute({mutable: true}),
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
  const mobileClient = cognito.cdk.userPool.addClient('mobileClientNew', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
    refreshTokenValidity: Duration.hours(1),
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
  if (stack.stage === 'production') {
    const blcAuditLogFunction = new Function(stack, 'blcAuditLogSignIn', {
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
  }
  return cognito;
}

export function createNewCognitoDDS(
  stack: Stack,
  appSecret: ISecret,
  bus: EventBus,
  dlq: Queue,
  region: string,
  webACL: CfnWebACL,
  oldCognito: Cognito,
  oldCognitoWebClient: UserPoolClient,
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
          OLD_USER_POOL_ID: oldCognito.userPoolId,
        },
        permissions: ['cognito-idp:AdminUpdateUserAttributes']
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: {
          SERVICE: 'identity',
          REGION: region,
        },
        permissions: ['dynamodb:*'],
      },
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
          blc_old_id: new StringAttribute({mutable: true}),
          blc_old_uuid: new StringAttribute({mutable: true}),
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
    refreshTokenValidity: Duration.hours(1),
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
  if (stack.stage === 'production') {
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
  }
  
  return cognito_dds;
}
