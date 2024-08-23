import { Cognito, EventBus, Queue, Stack, Table } from 'sst/constructs';
import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CfnWebACLAssociation, CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { BRANDS } from '@blc-mono/core/types/brands.enum';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { LOGIN_CLIENT_TYPE } from '../identity/src/models/loginAudits';
import { Role } from 'aws-cdk-lib/aws-iam';
import {
  createExternalClient,
  createClient,
  createRoleForHostedUi,
  createE2EClient,
} from '../identity/src/helpers/cognitoClients';
import {
  buildCognitoCdkProps,
  buildEnvForMigrationLambda,
  buildEnvForPostAuthLambda,
  buildEnvForPreTokenGenerationLambda,
  buildEnvironmentVarsForPreAuthLambda,
} from '../identity/src/helpers/cognitoClientVars';
import { createAuditLogFunction, createAuditLogFunctionPre } from '../identity/src/helpers/cognitoLogsFilters';
import {
  buildCognitoCdkPropsOld,
  buildEnvForPostAuthLambdaOld,
  createWebClientOld,
  logAndFilterPostAuthOld,
  logAndFilterPreTokenOld,
} from '../identity/src/helpers/cognitoClientHelperOld';

const getBlcShineCertificateArn = (appSecret: ISecret) =>
  appSecret.secretValueFromJson('blc_shine_certificate_arn').toString();
const getAuSuffix = (region: REGIONS) => (region === REGIONS.AP_SOUTHEAST_2 ? '-au' : '');
const getBrandPrefix = (isDDS: boolean) => isDDS ? 'dds' : 'blc';

const getAuthCustomDomainName = (
  stage: STAGES,
  region: REGIONS,
  brandName: BRANDS = BRANDS.BLC_UK,
) => {
  const domainPrefix = brandName === BRANDS.DDS_UK ? 'auth-dds' : 'auth';

  const authCustomDomainNameLookUp: Record<string, string> = {
    [REGIONS.EU_WEST_2]: `${domainPrefix}.blcshine.io`,
    [REGIONS.AP_SOUTHEAST_2]: `${domainPrefix}${getAuSuffix(region)}.blcshine.io`,
  };

  const customDomainName =
    stage === STAGES.PRODUCTION
      ? authCustomDomainNameLookUp[region]
      : `${stage}-${authCustomDomainNameLookUp[region]}`;

  return customDomainName;
};

export function createOldCognito(
  stack: Stack,
  unsuccessfulLoginAttemptsTable: Table,
  appSecret: ISecret,
  webACL: CfnWebACL,
  identityTable: Table,
  role: Role,
  isDds: boolean = false,
) {
  const logLevel = process.env.POWERTOOLS_LOG_LEVEL ?? 'INFO';
  const region = stack.region as REGIONS;
  const brandPrefix = getBrandPrefix(isDds);
  const cognito = new Cognito(stack, isDds ? 'cognito_dds' : 'cognito', {
    login: ['email'],
    triggers: {
      postAuthentication: {
        handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
        environment: buildEnvForPostAuthLambdaOld(
          region,
          unsuccessfulLoginAttemptsTable,
          identityTable,
          logLevel,
        ),
        role,
      },
      preTokenGeneration: {
        handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
        environment: buildEnvForPreTokenGenerationLambda(
          appSecret,
          region,
          identityTable,
          logLevel,
          brandPrefix,
        ),
        role,
      },
    },
    cdk: buildCognitoCdkPropsOld(),
  });

  const domainPrefix = `${brandPrefix}${
    stack.stage === STAGES.PRODUCTION ? '' : `-${stack.stage}`
  }${getAuSuffix(stack.region as REGIONS)}-old`;

  cognito.cdk.userPool.addDomain(`${isDds ? 'DDS' : 'BLC'}OldCognitoDomain`, {
    cognitoDomain: {
      domainPrefix,
    },
  });

  const mobileClient = createClient(cognito, appSecret, brandPrefix, 'membersClient', 'app');
  const webClient = createWebClientOld(cognito, appSecret, brandPrefix, 'webClient', 'web');

  new CfnWebACLAssociation(stack, `${isDds ? 'Dds' : 'Blc'}WebAclAssociation`, {
    resourceArn: cognito.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });

  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    let dataStream;
    if (stack.region === REGIONS.AP_SOUTHEAST_2) {
      dataStream = isDds ? 'dwh-dds-production-login' : 'dwh-blc-p1-production-login';
    } else {
      dataStream = `dwh-${brandPrefix}-production-login`;
    }
    logAndFilterPostAuthOld(stack, cognito, dataStream, webClient, mobileClient, `${brandPrefix}AuditLogSignInOldPool`, isDds);
    logAndFilterPreTokenOld(stack, cognito, dataStream, webClient, mobileClient, `${brandPrefix}AuditLogSignInOldPoolPre`, isDds);
  }

  return { cognito, webClient };
}

export function createNewCognito(
  [stack, bus, dlq]: [Stack, EventBus, Queue],
  [unsuccessfulLoginAttemptsTable, identityTable]: [Table, Table],
  [appSecret, identitySecret]: [ISecret, ISecret],
  webACL: CfnWebACL,
  [oldCognito, oldCognitoWebClient]: [Cognito, UserPoolClient],
  adminRole: Role,
  isDDS: boolean = false,
) {
  const logLevel = process.env.POWERTOOLS_LOG_LEVEL ?? 'INFO';
  const region = stack.region as REGIONS;
  const brandPrefix = getBrandPrefix(isDDS);
  const blcBrand = region === REGIONS.AP_SOUTHEAST_2 ? BRANDS.BLC_AU : BRANDS.BLC_UK;
  const cognito = new Cognito(stack, isDDS ? 'cognito_ddsNew' : 'cognitoNew', {
    login: ['email'],
    triggers: buildTriggers(
      [stack.region as REGIONS, bus, dlq],
      [appSecret, identitySecret],
      [unsuccessfulLoginAttemptsTable, identityTable],
      [oldCognito, oldCognitoWebClient],
      logLevel,
      adminRole,
      isDDS,
    ),
    cdk: buildCognitoCdkProps(isDDS),
  });

  const mobileClient = createClient(cognito, appSecret, brandPrefix, 'mobileClientNew', 'app');
  const webClient = createClient(cognito, appSecret, brandPrefix, 'webClientNew', 'web');

  // For non-production stages, create a client for E2E testing. This client is
  // used to issue tokens. We don't want to use the web client for this as it
  // would couple the E2E tests for other stacks to the configuration of the
  // web client.
  if (stack.stage !== STAGES.PRODUCTION && !isDDS) {
    createE2EClient(stack, cognito);
  }
  const brandName = isDDS ? BRANDS.DDS_UK : blcBrand;
  createDomain(stack, cognito, region, appSecret, brandName, brandPrefix);

  // Associate WAF WebACL with cognito
  associateWebACL(stack, cognito, webACL, isDDS);

  //audit
  if (stack.stage === STAGES.PRODUCTION) {
    const dataStream = isDDS ? 'dwh-dds-production-login' :
      region === REGIONS.AP_SOUTHEAST_2
        ? `dwh-${brandPrefix}-p1-production-login`
        : `dwh-${brandPrefix}-production-login`;
    const functionPost = createAuditLogFunction(
      stack,
      cognito,
      dataStream,
      webClient,
      mobileClient,
      `${brandPrefix}AuditLogSignIn`,
      isDDS,
    );
    const functionPre = createAuditLogFunctionPre(
      stack,
      cognito,
      dataStream,
      webClient,
      mobileClient,
      `${brandPrefix}AuditLogSignInPre`,
      isDDS,
    );

    const uiCustomizationRole = createRoleForHostedUi(
      stack,
      [cognito, webClient, mobileClient],
      `UICustomizationRole${isDDS ? '-DDS' : ''}`,
      cognito.userPoolArn,
      brandName,
      isDDS,
    );

    let loginClientIdMap = createExternalClient(stack, cognito, isDDS, uiCustomizationRole);
    // add extra env parameter to already created function.
    loginClientIdMap[webClient.userPoolClientId] = LOGIN_CLIENT_TYPE.WEB_HOSTEDUI;
    loginClientIdMap[mobileClient.userPoolClientId] = LOGIN_CLIENT_TYPE.APP_HOSTEDUI;
    functionPost.addEnvironment('LOGIN_CLIENT_IDS', JSON.stringify(loginClientIdMap));
    functionPre.addEnvironment('LOGIN_CLIENT_IDS', JSON.stringify(loginClientIdMap));
  }

  return cognito;
}

function createDomain(stack: Stack, cognito:Cognito, region: REGIONS, appSecret : ISecret, brand: BRANDS, prefix:string) {
  if (stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING) {
    cognito.cdk.userPool.addDomain(`${prefix.toUpperCase()}CognitoCustomDomain`, {
      customDomain: {
        domainName: getAuthCustomDomainName(stack.stage, region, brand),
        certificate: Certificate.fromCertificateArn(
          stack,
          `${prefix.toUpperCase()}AuthDomainCertificate`,
          getBlcShineCertificateArn(appSecret),
        ),
      },
    });
  } else {
    const domainPrefix = `${stack.stage}-${prefix}${getAuSuffix(stack.region as REGIONS)}`;

    cognito.cdk.userPool.addDomain(`${prefix.toUpperCase()}CognitoDomain`, {
      cognitoDomain: {
        domainPrefix: domainPrefix,
      },
    });
  }
}

function associateWebACL(stack: Stack, cognito: Cognito, webACL: CfnWebACL, isDDS: boolean) {
  new CfnWebACLAssociation(stack, `${isDDS ? 'Dds' : 'Blc'}WebAclAssociationNew`, {
    resourceArn: cognito.cdk.userPool.userPoolArn,
    webAclArn: webACL.attrArn,
  });
}

function buildTriggers(
  [region, bus, dlq]: [REGIONS, EventBus, Queue],
  [appSecret, identitySecret]: [ISecret, ISecret],
  [unsuccessfulLoginAttemptsTable, identityTable]: [Table, Table],
  [oldCognito, oldCognitoWebClient]: [Cognito, UserPoolClient],
  logLevel: string,
  adminRole: Role,
  isDDS: boolean,
) {
  return {
    userMigration: {
      handler: 'packages/api/identity/src/cognito/migration.handler',
      environment: buildEnvForMigrationLambda(
        region,
        appSecret,
        [ bus, dlq ],
        [ oldCognito, oldCognitoWebClient ],
        identityTable,
        logLevel,
        isDDS,
      ),
      role: adminRole,
    },
    postAuthentication: {
      handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
      environment: buildEnvForPostAuthLambda(
        region,
        unsuccessfulLoginAttemptsTable,
        identityTable,
        logLevel,
        oldCognito,
      ),
      role: adminRole,
    },
    preTokenGeneration: {
      handler: 'packages/api/identity/src/cognito/preTokenGeneration.handler',
      environment: buildEnvForPreTokenGenerationLambda(
        appSecret,
        region,
        identityTable,
        logLevel,
        getBrandPrefix(isDDS),
      ),
      role: adminRole,
    },
    preAuthentication: {
      handler: 'packages/api/identity/src/cognito/preAuthentication.handler',
      environment: buildEnvironmentVarsForPreAuthLambda(
        unsuccessfulLoginAttemptsTable,
        identitySecret,
        isDDS,
      ),
      role: adminRole,
    },
  };
}

