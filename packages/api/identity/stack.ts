import { ApiGatewayV1Api, Config, Function, Queue, Stack, StackContext, Table, use } from 'sst/constructs'
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {Shared} from '../../../stacks/stack';
import {passwordResetRule} from './src/eventRules/passwordResetRule';
import {userStatusUpdatedRule} from './src/eventRules/userStatusUpdated';
import {emailUpdateRule} from './src/eventRules/emailUpdateRule';
import {ApiGatewayModelGenerator} from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import {UserModel} from './src/models/user';
import {GetUserByIdRoute} from './src/routes/getUserByIdRoute';
import {userSignInMigratedRule} from './src/eventRules/userSignInMigratedRule';
import {cardStatusUpdatedRule} from './src/eventRules/cardStatusUpdatedRule';
import {userProfileUpdatedRule} from './src/eventRules/userProfileUpdatedRule';
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {companyFollowsUpdatedRule} from "./src/eventRules/companyFollowsUpdatedRule";
import {userGdprRule} from './src/eventRules/userGdprRule';
import getAllowedDomains from './src/utils/getAllowedDomains';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { createNewCognito, createNewCognitoDDS, createOldCognito, createOldCognitoDDS } from './stackHelper';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '../core/src/identity/authorizer';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { UnsuccessfulLoginAttemptsTables } from './src/cognito/tables';
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config'
import { userEmailUpdatedRule } from './src/eventRules/userEmailUpdated';
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand'
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

export function Identity({ stack, app }: StackContext) {
  const globalConfig = GlobalConfigResolver.for(stack.stage);
  const { certificateArn, bus, webACL } = use(Shared);

  //set tag service identity to all resources
  stack.tags.setTag('service', 'identity');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  if (isDdsUkBrand()) {
    // Resources able to be duplicated to DDS identity stack
    return deployDdsSpecificResources(stack);
  } else {
    //Region
    const region = stack.region;

    const unsuccessfulLoginAttemptsTable = new UnsuccessfulLoginAttemptsTables(stack);

    const stageSecret = stack.stage === STAGES.PRODUCTION || stack.stage === STAGES.STAGING ? stack.stage : STAGES.STAGING;
    const appSecret = Secret.fromSecretNameV2(stack, 'app-secret', `blc-mono-identity/${stageSecret}/cognito`);
    const identitySecret = Secret.fromSecretNameV2(stack,'identity-secret',`blc-mono-identity/${stageSecret}/secrets`);

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
      fields: {
        uuid: 'string',
        legacy_id: 'string',
      },
      primaryIndex: { partitionKey: 'legacy_id', sortKey: 'uuid' },
    });

    //add dead letter queue
    const dlq = new Queue(stack, 'DLQ');

    const {oldCognito, oldWebClient} = createOldCognito(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret, identityTable);
    const {oldCognitoDds, oldWebClientDds} = createOldCognitoDDS(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret, identityTable);
    const cognito = createNewCognito(stack,unsuccessfulLoginAttemptsTable.table ,appSecret, bus, dlq, region, webACL, oldCognito, oldWebClient, identitySecret, identityTable);
    const cognito_dds = createNewCognitoDDS(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, oldCognitoDds, oldWebClientDds, identitySecret, identityTable);

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
    const identityApi = new ApiGatewayV1Api(stack, 'identity', {
      authorizers: {
        identityAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', sharedAuthorizer),
      },
      defaults: {
        function: {
          timeout: 20,
          environment: {
            identityTableName: identityTable.tableName,
            service: 'identity',
            allowedDomains: getAllowedDomains(stack.stage),
            REGION: stack.region,
          },
          permissions: [identityTable],
        },
      },
      routes: {
        'POST /{brand}/organisation': 'packages/api/identity/src/eligibility/listOrganisation.handler',
        'POST /{brand}/organisation/{organisationId}': 'packages/api/identity/src/eligibility/listService.handler',
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
      CognitoUserPooMembersClient: cognito.userPoolId,
      CognitoDdsUserPooMembersClient: cognito_dds.userPoolId,
      Table: identityTable.tableName,
      IdentityApiEndpoint: identityApi.url,
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
    bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
    bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
    bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
    bus.addRules(stack, userSignInMigratedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
    bus.addRules(stack, cardStatusUpdatedRule(dlq.queueUrl, identityTable.tableName, region));
    bus.addRules(stack, userProfileUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
    bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
    bus.addRules(stack, userGdprRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
    bus.addRules(stack, userEmailUpdatedRule(cognito.userPoolId, cognito_dds.userPoolId, region, oldCognito.userPoolId, oldCognitoDds.userPoolId));

    return {
      identityApi,
      newCognito: cognito.cdk.userPool,
      cognito: oldCognito.cdk.userPool,
      authorizer: sharedAuthorizer,
    };
  }
}

function deployDdsSpecificResources(stack: Stack) {
  const BLC_UK_COGNITO_USER_POOL_ID = process.env.BLC_UK_COGNITO_USER_POOL_ID ?? '';
  const BLC_UK_OLD_COGNITO_USER_POOL_ID = process.env.BLC_UK_OLD_COGNITO_USER_POOL_ID ?? '';
  const DDS_COGNITO_USER_POOL_ID = process.env.DDS_COGNITO_USER_POOL_ID ?? '';
  const DDS_OLD_COGNITO_USER_POOL_ID = process.env.DDS_OLD_COGNITO_USER_POOL_ID ?? '';
  const BLC_UK_IDENTITY_API_ID = process.env.BLC_UK_IDENTITY_API_ID ?? '';

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
  const identityApi = new ApiGatewayV1Api(stack, 'identity', {
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

