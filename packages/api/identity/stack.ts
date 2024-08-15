import { ApiGatewayV1Api, Config, Function, Queue, Stack, StackContext, Table, use } from 'sst/constructs';
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
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { companyFollowsUpdatedRule } from "./src/eventRules/companyFollowsUpdatedRule";
import { userGdprRule } from './src/eventRules/userGdprRule';
import getAllowedDomains from './src/utils/getAllowedDomains';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { createNewCognito, createNewCognitoDDS, createOldCognito, createOldCognitoDDS } from './stackHelper';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '../core/src/identity/authorizer';
import { Effect, ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { UnsuccessfulLoginAttemptsTables } from './src/cognito/tables';
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { userEmailUpdatedRule } from './src/eventRules/userEmailUpdated';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

const SERVICE_NAME = 'identity'

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

export function Identity({ stack }: StackContext) {
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const { certificateArn, bus, webACL } = use(Shared);

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`] : undefined;

  //set tag service identity to all resources
  stack.tags.setTag('service', SERVICE_NAME);
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  stack.setDefaultFunctionProps({
    environment: {
      service: SERVICE_NAME,
      DD_VERSION: process.env.DD_VERSION || '',
      DD_ENV: process.env.SST_STAGE || 'undefined',
      DD_API_KEY: process.env.DD_API_KEY || '',
      DD_GIT_COMMIT_SHA: process.env.DD_GIT_COMMIT_SHA || '',
      DD_GIT_REPOSITORY_URL: process.env.DD_GIT_REPOSITORY_URL || '',
      USE_DATADOG_AGENT,
      DD_SERVICE: SERVICE_NAME,
    },
    layers,
  });

  if (isDdsUkBrand()) {
    // Resources able to be duplicated to DDS identity stack
    return deployDdsSpecificResources(stack);
  } else {
    //Region
    const region = stack.region;

    const unsuccessfulLoginAttemptsTable = new UnsuccessfulLoginAttemptsTables(stack);

    const stageSecret = stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING ? stack.stage : STAGES.STAGING;
    const appSecret = Secret.fromSecretNameV2(stack, 'app-secret', `blc-mono-identity/${stageSecret}/cognito`);
    const identitySecret = Secret.fromSecretNameV2(stack, 'identity-secret', `blc-mono-identity/${stageSecret}/secrets`);

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
              actions: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        cognito: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["cognito-idp:AdminInitiateAuth", "cognito-idp:AdminDeleteUser", "cognito-idp:AdminGetUser", "cognito-idp:AdminUpdateUserAttributes"],
              // TODO: Restrict to Cognito User Pool for this stack
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        sqs: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["sqs:SendMessage"],
              // TODO: Restrict to DLQ for this stack
              resources: ["*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        dynamodb: new PolicyDocument({
          statements: [
            new PolicyStatement({
              // TODO: Tighten up * role (from preTokenGeneration handler)
              actions: ["dynamodb:*", "dynamodb:DeleteItem", "dynamodb:UpdateItem", "dynamodb:PutItem", "dynamodb:Query"],
              // TODO: Restrict to tables from this stack
              // `unsuccessfulLoginAttemptsTable.table.tableArn` is added as a resource for posterity
              // This Policy grants access to all DynamoDB resources, it still needs to be restricted
              resources: [unsuccessfulLoginAttemptsTable.table.tableArn, "*"],
              effect: Effect.ALLOW,
            }),
          ],
        }),
        eventBridge: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["events:PutEvents"],
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
      fields: { uuid: 'string', legacy_id: 'string', },
      primaryIndex: { partitionKey: 'legacy_id', sortKey: 'uuid' },
    });

    //add dead letter queue
    const dlq = new Queue(stack, 'DLQ');

    const { oldCognito, oldWebClient } = createOldCognito(stack, unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret, identityTable, identityAdministratorRole);
    const { oldCognitoDds, oldWebClientDds } = createOldCognitoDDS(stack, unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret, identityTable, identityAdministratorRole);
    const cognito = createNewCognito(stack, unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, oldCognito, oldWebClient, identitySecret, identityTable, identityAdministratorRole);
    const cognito_dds = createNewCognitoDDS(stack, unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, oldCognitoDds, oldWebClientDds, identitySecret, identityTable, identityAdministratorRole);

    const customDomainNameLookUp: Record<string, string> = {
      [REGIONS.EU_WEST_2]: 'identity.blcshine.io',
      [REGIONS.AP_SOUTHEAST_2]: 'identity-au.blcshine.io',
    };

    const identityCustomAuthenticatorLambda = new Function(stack, 'Authorizer', {
      handler: './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.handler',
      environment: {
        OLD_USER_POOL_ID: oldCognito.userPoolId,
        OLD_USER_POOL_ID_DDS: oldCognitoDds.userPoolId,
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
            identityTableName: identityTable.tableName,
            service: SERVICE_NAME,
            allowedDomains: getAllowedDomains(stack.stage),
            REGION: stack.region,
            ZENDESK_JWT_SECRET: appSecret.secretValueFromJson('zendesk_jwt_secret').toString(),
            ZENDESK_REDIRECT_URI: appSecret.secretValueFromJson('zendesk_redirect_uri').toString(),
            USER_POOL_DOMAIN: appSecret.secretValueFromJson('user_pool_domain').toString(),
            ZENDESK_SUBDOMAIN: appSecret.secretValueFromJson('zendesk_subdomain').toString(),
            ZENDESK_APP_CLIENT_ID: appSecret.secretValueFromJson('zendesk_app_client_id').toString()
          },
          permissions: [identityTable],
        },
      },
      routes: {
        'POST /{brand}/organisation': 'packages/api/identity/src/eligibility/listOrganisation.handler',
        'POST /{brand}/organisation/{organisationId}': 'packages/api/identity/src/eligibility/listService.handler',
        'GET /zendesk/login' : 'packages/api/identity/src/external-provider/zendesk/login.handler',
        'GET /zendesk/logout' : 'packages/api/identity/src/external-provider/zendesk/logout.handler',
        'GET /zendesk/callback' : 'packages/api/identity/src/external-provider/zendesk/callback.handler',
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
                certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
              },
            }),
        },
      },
    });

    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(identityApi.cdk.restApi);
    const agUserModel = apiGatewayModelGenerator.generateModelFromZodEffect(UserModel);

    identityApi.addRoutes(stack, {
      'GET /user': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails()
    });

    stack.addOutputs({
      BlcUkCognitoUserPoolId: cognito.userPoolId,
      BlcUkOldCognitoUserPoolId: oldCognito.userPoolId,
      DdsUkCognitoUserPoolId: cognito_dds.userPoolId,
      DdsUkOldCognitoUserPoolId: oldCognitoDds.userPoolId,
      Table: identityTable.tableName,
      IdentityApiEndpoint: identityApi.url,
      IdentityApiId: identityApi.cdk.restApi.restApiId
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

    //add event bridge rules
    bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId, identityAdministratorRole));
    bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId, identityAdministratorRole));
    bus.addRules(stack, userSignInMigratedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region, identityAdministratorRole));
    bus.addRules(stack, cardStatusUpdatedRule(dlq.queueUrl, identityTable.tableName, region, identityAdministratorRole));
    bus.addRules(stack, userProfileUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region, identityAdministratorRole));
    bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region, identityAdministratorRole));
    bus.addRules(stack, userGdprRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId, identityAdministratorRole));
    bus.addRules(stack, userEmailUpdatedRule(cognito.userPoolId, cognito_dds.userPoolId, region, oldCognito.userPoolId, oldCognitoDds.userPoolId, identityAdministratorRole));

    return {
      identityApi,
      newCognito: cognito.cdk.userPool,
      cognito: oldCognito.cdk.userPool,
      authorizer: sharedAuthorizer,
    };
  }
}

function deployDdsSpecificResources(stack: Stack) {
  // All user pools currently in use until authorizer is split by brand
  const BLC_UK_COGNITO_USER_POOL_ID = process.env.BLC_UK_COGNITO_USER_POOL_ID ?? '';
  const BLC_UK_OLD_COGNITO_USER_POOL_ID = process.env.BLC_UK_OLD_COGNITO_USER_POOL_ID ?? '';
  const DDS_COGNITO_USER_POOL_ID = process.env.DDS_COGNITO_USER_POOL_ID ?? '';
  const DDS_OLD_COGNITO_USER_POOL_ID = process.env.DDS_OLD_COGNITO_USER_POOL_ID ?? '';
  const BLC_UK_IDENTITY_API_ID = process.env.BLC_UK_IDENTITY_API_ID ?? '';

  // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
  const layers =
    USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`] : undefined;

  // DDS Cognito User Pools retrieved from BLC UK Identity stack
  const oldCognitoUserPool = UserPool.fromUserPoolId(stack, 'oldCognitoUserPool', DDS_OLD_COGNITO_USER_POOL_ID);
  const cognitoUserPool = UserPool.fromUserPoolId(stack, 'cognitoUserPool', DDS_COGNITO_USER_POOL_ID);

  const identityCustomAuthenticatorLambda = new Function(stack, 'Authorizer', {
    handler: './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.handler',
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
      restApi: RestApi.fromRestApiId(stack, 'IdentityApi', BLC_UK_IDENTITY_API_ID)
    }
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

  return {
    identityApi,
    newCognito: cognitoUserPool,
    cognito: oldCognitoUserPool,
    authorizer: sharedAuthorizer,
  };
}

