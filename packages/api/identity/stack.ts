import {
  ApiGatewayV1Api,
  Config,
  Function,
  Queue,
  Stack,
  StackContext,
  Table,
  use,
} from 'sst/constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Shared } from '../../../stacks/stack';
import { userStatusUpdatedRule } from './src/eventRules/userStatusUpdated';
import { emailUpdateRule } from './src/eventRules/emailUpdateRule';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { UserModel } from './src/models/user';
import { GetUserByIdRoute } from './src/routes/getUserByIdRoute';
import { userSignInMigratedRule } from './src/eventRules/userSignInMigratedRule';
import { cardStatusUpdatedRule } from './src/eventRules/cardStatusUpdatedRule';
import { userProfileUpdatedRule } from './src/eventRules/userProfileUpdatedRule';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { companyFollowsUpdatedRule } from './src/eventRules/companyFollowsUpdatedRule';
import { userGdprRule } from './src/eventRules/userGdprRule';
import getAllowedDomains from './src/utils/getAllowedDomains';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { createNewCognito, createOldCognito } from './stackHelper';
import { IdentitySource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '../core/src/identity/authorizer';
import {
  Effect,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { UnsuccessfulLoginAttemptsTables } from './src/cognito/tables';
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { userEmailUpdatedRule } from './src/eventRules/userEmailUpdated';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import {
  getCognitoUserPoolIdStackOutputName,
  getNewCognitoUserPoolIdStackOutputName,
} from '@blc-mono/core/identity/identityStackOutputs';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from 'src/utils/IdentityStackEnvironmentKeys';

const SERVICE_NAME = 'identity';

const USE_DATADOG_AGENT: string = getEnvOrDefault(
  IdentityStackEnvironmentKeys.USE_DATADOG_AGENT,
  'false',
).toLowerCase();

export function Identity({ stack }: StackContext) {
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const { certificateArn, bus, webACL } = use(Shared);

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT === 'true' && stack.region
      ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
      : undefined;

  //set tag service identity to all resources
  stack.tags.setTag('service', SERVICE_NAME);
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  stack.setDefaultFunctionProps({
    environment: {
      service: SERVICE_NAME,
      DD_VERSION: getEnvOrDefault(IdentityStackEnvironmentKeys.DD_VERSION, ''),
      DD_ENV: getEnv(IdentityStackEnvironmentKeys.SST_STAGE),
      DD_API_KEY: getEnvOrDefault(IdentityStackEnvironmentKeys.DD_API_KEY, ''),
      DD_GIT_COMMIT_SHA: getEnvOrDefault(IdentityStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(
        IdentityStackEnvironmentKeys.DD_GIT_REPOSITORY_URL,
        '',
      ),
      USE_DATADOG_AGENT,
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
      DEBUG_LOGGING_ENABLED: `${!isProduction(stack.stage)}`,
    },
    layers,
  });

  if (isDdsUkBrand()) {
    // Only specific resources allowed to deploy to DDS due to dependency with BLC UK Identity stack
    return deployDdsSpecificResources(stack);
  } else {
    //Region
    const region = stack.region;

    const unsuccessfulLoginAttemptsTable = new UnsuccessfulLoginAttemptsTables(stack);

    const stageSecret =
      stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING
        ? stack.stage
        : STAGES.STAGING;
    const appSecret = Secret.fromSecretNameV2(
      stack,
      'app-secret',
      `blc-mono-identity/${stageSecret}/cognito`,
    );
    const identitySecret = Secret.fromSecretNameV2(
      stack,
      'identity-secret',
      `blc-mono-identity/${stageSecret}/secrets`,
    );

    // the role used for identity services to carry out admin actions
    const identityAdministratorRole = new Role(stack, 'IdentityAdministrator', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        xray: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        cognito: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: [
                'cognito-idp:AdminInitiateAuth',
                'cognito-idp:AdminDeleteUser',
                'cognito-idp:AdminGetUser',
                'cognito-idp:AdminUpdateUserAttributes',
              ],
              // TODO: Restrict to Cognito User Pool for this stack
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        sqs: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['sqs:SendMessage'],
              // TODO: Restrict to DLQ for this stack
              resources: ['*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        dynamodb: new PolicyDocument({
          statements: [
            new PolicyStatement({
              // TODO: Tighten up * role (from preTokenGeneration handler)
              actions: [
                'dynamodb:*',
                'dynamodb:DeleteItem',
                'dynamodb:UpdateItem',
                'dynamodb:PutItem',
                'dynamodb:Query',
              ],
              // TODO: Restrict to tables from this stack
              // `unsuccessfulLoginAttemptsTable.table.tableArn` is added as a resource for posterity
              // This Policy grants access to all DynamoDB resources, it still needs to be restricted
              resources: [unsuccessfulLoginAttemptsTable.table.tableArn, '*'],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        eventBridge: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['events:PutEvents'],
              resources: [bus.eventBusArn],
              effect: Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    //db - identityTable
    const identityTable = new Table(stack, 'identityTable', {
      fields: {
        pk: 'string',
        sk: 'string',
        spare_email: 'string',
      },
      primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
      globalIndexes: {
        gsi1: { partitionKey: 'sk', sortKey: 'pk' },
        spareEmailIndex: { partitionKey: 'spare_email', sortKey: 'pk' },
      },
    });

    const idMappingTable = new Table(stack, 'identityIdMappingTable', {
      fields: { uuid: 'string', legacy_id: 'string' },
      primaryIndex: { partitionKey: 'legacy_id', sortKey: 'uuid' },
    });

    //add dead letter queue
    const dlq = new Queue(stack, 'DLQ');

    const oldCognitoBlc = createOldCognito(
      stack,
      unsuccessfulLoginAttemptsTable.table,
      appSecret,
      webACL,
      identityTable,
      identityAdministratorRole,
    );
    const oldCognitoDds = createOldCognito(
      stack,
      unsuccessfulLoginAttemptsTable.table,
      appSecret,
      webACL,
      identityTable,
      identityAdministratorRole,
      true,
    );
    const cognito = createNewCognito(
      [stack, bus, dlq],
      [unsuccessfulLoginAttemptsTable.table, identityTable],
      [appSecret, identitySecret],
      webACL,
      [oldCognitoBlc.cognito, oldCognitoBlc.webClient],
      identityAdministratorRole,
    );
    const cognito_dds = createNewCognito(
      [stack, bus, dlq],
      [unsuccessfulLoginAttemptsTable.table, identityTable],
      [appSecret, identitySecret],
      webACL,
      [oldCognitoDds.cognito, oldCognitoDds.webClient],
      identityAdministratorRole,
      true,
    );

    const customDomainNameLookUp: Record<string, string> = {
      [REGIONS.EU_WEST_2]: 'identity.blcshine.io',
      [REGIONS.AP_SOUTHEAST_2]: 'identity-au.blcshine.io',
    };

    const identityCustomAuthenticatorLambda = new Function(stack, 'Authorizer', {
      handler:
        './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.handler',
      environment: {
        OLD_USER_POOL_ID: oldCognitoBlc.cognito.userPoolId,
        OLD_USER_POOL_ID_DDS: oldCognitoDds.cognito.userPoolId,
        USER_POOL_ID: cognito.userPoolId,
        USER_POOL_ID_DDS: cognito_dds.userPoolId,
      },
    });

    identityCustomAuthenticatorLambda.addPermission('invokeLambda', {
      action: 'lambda:InvokeFunction',
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    const sharedAuthorizer: SharedAuthorizer = {
      functionArn: identityCustomAuthenticatorLambda.functionArn,
      type: 'lambda_request',
      identitySources: [IdentitySource.header('Authorization')],
    };

    //apis
    const identityApi = new ApiGatewayV1Api(stack, SERVICE_NAME, {
      authorizers: {
        identityAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', sharedAuthorizer),
      },
      defaults: {
        function: {
          timeout: 20,
          environment: {
            IDENTITY_TABLE_NAME: identityTable.tableName,
            SERVICE: SERVICE_NAME,
            ALLOWED_DOMAINS: getAllowedDomains(stack.stage),
            REGION: stack.region,
            ZENDESK_JWT_SECRET: appSecret.secretValueFromJson('zendesk_jwt_secret').toString(),
            ZENDESK_REDIRECT_URI: appSecret.secretValueFromJson('zendesk_redirect_uri').toString(),
            USER_POOL_DOMAIN: appSecret.secretValueFromJson('user_pool_domain').toString(),
            ZENDESK_SUBDOMAIN: appSecret.secretValueFromJson('zendesk_subdomain').toString(),
            ZENDESK_APP_CLIENT_ID: appSecret
              .secretValueFromJson('zendesk_app_client_id')
              .toString(),
          },
          permissions: [identityTable],
        },
      },
      routes: {
        'POST /{brand}/organisation':
          'packages/api/identity/src/eligibility/listOrganisation.handler',
        'POST /{brand}/organisation/{organisationId}':
          'packages/api/identity/src/eligibility/listService.handler',
        'GET /zendesk/login': 'packages/api/identity/src/external-provider/zendesk/login.handler',
        'GET /zendesk/logout': 'packages/api/identity/src/external-provider/zendesk/logout.handler',
        'GET /zendesk/callback':
          'packages/api/identity/src/external-provider/zendesk/callback.handler',
      },
      cdk: {
        restApi: {
          endpointTypes: globalConfig.apiGatewayEndpointTypes,
          ...([STAGES.PRODUCTION, STAGES.STAGING].includes(stack.stage as STAGES) &&
            certificateArn && {
              domainName: {
                domainName:
                  stack.stage === STAGES.PRODUCTION
                    ? customDomainNameLookUp[stack.region]
                    : `${stack.stage}-${customDomainNameLookUp[stack.region]}`,
                certificate: Certificate.fromCertificateArn(
                  stack,
                  'DomainCertificate',
                  certificateArn,
                ),
              },
            }),
        },
      },
    });

    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(identityApi.cdk.restApi);
    const agUserModel = apiGatewayModelGenerator.generateModelFromZodEffect(UserModel);

    identityApi.addRoutes(stack, {
      'GET /user': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    });

    stack.addOutputs({
      BlcUkCognitoUserPoolId: cognito.userPoolId,
      BlcUkOldCognitoUserPoolId: oldCognitoBlc.cognito.userPoolId,
      DdsUkCognitoUserPoolId: cognito_dds.userPoolId,
      DdsUkOldCognitoUserPoolId: oldCognitoDds.cognito.userPoolId,
      Table: identityTable.tableName,
      IdentityApiEndpoint: identityApi.url,
      IdentityApiId: identityApi.cdk.restApi.restApiId,
    });

    // Output the identity table names as config parameters so that they can be used in E2E tests.
    new Config.Parameter(stack, 'IDENTITY_TABLE_NAME', {
      value: identityTable.tableName,
    });
    new Config.Parameter(stack, 'ID_MAPPING_TABLE_NAME', {
      value: idMappingTable.tableName,
    });
    new Config.Parameter(stack, 'UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME', {
      value: unsuccessfulLoginAttemptsTable.table.tableName,
    });

    //API Key and Usage Plan
    const apikey = identityApi.cdk.restApi.addApiKey('identity-api-key');

    const usagePlan = identityApi.cdk.restApi.addUsagePlan('identity-api-usage-plan', {
      throttle: {
        rateLimit: 1,
        burstLimit: 2,
      },
      apiStages: [
        {
          api: identityApi.cdk.restApi,
          stage: identityApi.cdk.restApi.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apikey);

    // Output the Cognito User Pool ID as a config parameter so that it can be
    // used in E2E tests.
    new Config.Parameter(stack, 'IDENTITY_COGNITO_USER_POOL_ID', {
      value: cognito.userPoolId,
    });
    stack.addOutputs({
      CognitoUserPoolWebClient: cognito.userPoolId,
      CognitoDdsUserPoolWebClient: cognito_dds.userPoolId,
    });

    exportUserPoolIdsAsStackOutputs(stack, oldCognitoBlc.cognito.userPoolId, cognito.userPoolId);

    //add event bridge rules
    bus.addRules(
      stack,
      emailUpdateRule(
        cognito.userPoolId,
        dlq.queueUrl,
        cognito_dds.userPoolId,
        region,
        unsuccessfulLoginAttemptsTable.table.tableName,
        oldCognitoBlc.cognito.userPoolId,
        oldCognitoDds.cognito.userPoolId,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      userStatusUpdatedRule(
        cognito.userPoolId,
        dlq.queueUrl,
        cognito_dds.userPoolId,
        region,
        unsuccessfulLoginAttemptsTable.table.tableName,
        oldCognitoBlc.cognito.userPoolId,
        oldCognitoDds.cognito.userPoolId,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      userSignInMigratedRule(
        dlq.queueUrl,
        identityTable.tableName,
        idMappingTable.tableName,
        region,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      cardStatusUpdatedRule(
        dlq.queueUrl,
        identityTable.tableName,
        region,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      userProfileUpdatedRule(
        dlq.queueUrl,
        identityTable.tableName,
        idMappingTable.tableName,
        region,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      companyFollowsUpdatedRule(
        dlq.queueUrl,
        identityTable.tableName,
        idMappingTable.tableName,
        region,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      userGdprRule(
        cognito.userPoolId,
        dlq.queueUrl,
        cognito_dds.userPoolId,
        region,
        unsuccessfulLoginAttemptsTable.table.tableName,
        oldCognitoBlc.cognito.userPoolId,
        oldCognitoDds.cognito.userPoolId,
        identityAdministratorRole,
      ),
    );
    bus.addRules(
      stack,
      userEmailUpdatedRule(
        cognito.userPoolId,
        cognito_dds.userPoolId,
        region,
        oldCognitoBlc.cognito.userPoolId,
        oldCognitoDds.cognito.userPoolId,
        identityAdministratorRole,
      ),
    );

    return {
      identityApi,
      authorizer: sharedAuthorizer,
    };
  }
}

function deployDdsSpecificResources(stack: Stack) {
  // All user pools currently in use until authorizer is split by brand
  const BLC_UK_COGNITO_USER_POOL_ID = getEnv(
    IdentityStackEnvironmentKeys.BLC_UK_COGNITO_USER_POOL_ID,
  );
  const BLC_UK_OLD_COGNITO_USER_POOL_ID = getEnv(
    IdentityStackEnvironmentKeys.BLC_UK_OLD_COGNITO_USER_POOL_ID,
  );
  const DDS_COGNITO_USER_POOL_ID = getEnv(IdentityStackEnvironmentKeys.DDS_COGNITO_USER_POOL_ID);
  const DDS_OLD_COGNITO_USER_POOL_ID = getEnv(
    IdentityStackEnvironmentKeys.DDS_OLD_COGNITO_USER_POOL_ID,
  );
  const BLC_UK_IDENTITY_API_ID = getEnv(IdentityStackEnvironmentKeys.BLC_UK_IDENTITY_API_ID);

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
      ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
      : undefined;

  // DDS Cognito User Pools retrieved from BLC UK Identity stack
  const oldCognitoUserPool = UserPool.fromUserPoolId(
    stack,
    'oldCognitoUserPool',
    DDS_OLD_COGNITO_USER_POOL_ID,
  );
  const cognitoUserPool = UserPool.fromUserPoolId(
    stack,
    'cognitoUserPool',
    DDS_COGNITO_USER_POOL_ID,
  );

  const identityCustomAuthenticatorLambda = new Function(stack, 'Authorizer', {
    handler:
      './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.handler',
    environment: {
      OLD_USER_POOL_ID: BLC_UK_OLD_COGNITO_USER_POOL_ID,
      OLD_USER_POOL_ID_DDS: DDS_OLD_COGNITO_USER_POOL_ID,
      USER_POOL_ID: BLC_UK_COGNITO_USER_POOL_ID,
      USER_POOL_ID_DDS: DDS_COGNITO_USER_POOL_ID,
    },
  });

  identityCustomAuthenticatorLambda.addPermission('invokeLambda', {
    action: 'lambda:InvokeFunction',
    principal: new ServicePrincipal('apigateway.amazonaws.com'),
  });

  const sharedAuthorizer: SharedAuthorizer = {
    functionArn: identityCustomAuthenticatorLambda.functionArn,
    type: 'lambda_request',
    identitySources: [IdentitySource.header('Authorization')],
  };

  //apis
  const identityApi = new ApiGatewayV1Api(stack, SERVICE_NAME, {
    cdk: {
      restApi: RestApi.fromRestApiId(stack, 'IdentityApi', BLC_UK_IDENTITY_API_ID),
    },
  });

  stack.addOutputs({
    CognitoUserPoolMembersClient: cognitoUserPool.userPoolId,
    IdentityApiEndpoint: identityApi.url,
  });

  // Output the Cognito User Pool ID as a config parameter so that it can be
  // used in E2E tests.
  new Config.Parameter(stack, 'IDENTITY_COGNITO_USER_POOL_ID', {
    value: cognitoUserPool.userPoolId,
  });

  stack.addOutputs({
    CognitoUserPoolWebClient: cognitoUserPool.userPoolId,
  });

  exportUserPoolIdsAsStackOutputs(stack, oldCognitoUserPool.userPoolId, cognitoUserPool.userPoolId);

  return {
    identityApi,
    authorizer: sharedAuthorizer,
  };
}

function exportUserPoolIdsAsStackOutputs(
  stack: Stack,
  cognitoUserPoolId: string,
  cognitoUserPoolIdNew: string,
) {
  stack.exportValue(cognitoUserPoolId, {
    name: getCognitoUserPoolIdStackOutputName(stack),
  });
  stack.exportValue(cognitoUserPoolIdNew, {
    name: getNewCognitoUserPoolIdStackOutputName(stack),
  });
}
