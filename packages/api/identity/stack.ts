import {ApiGatewayV1Api, Function, Queue, StackContext, Table, use} from 'sst/constructs';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {Shared} from '../../../stacks/stack';
import {passwordResetRule} from './src/eventRules/passwordResetRule';
import {userStatusUpdatedRule} from './src/eventRules/userStatusUpdated';
import {emailUpdateRule} from './src/eventRules/emailUpdateRule';
import {ApiGatewayModelGenerator} from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import {UserModel} from './src/models/user';
import {EcFormOutputDataModel} from './src/models/ecFormOutputDataModel';
import {GetUserByIdRoute} from './src/routes/getUserByIdRoute';
import {userSignInMigratedRule} from './src/eventRules/userSignInMigratedRule';
import {cardStatusUpdatedRule} from './src/eventRules/cardStatusUpdatedRule';
import {userProfileUpdatedRule} from './src/eventRules/userProfileUpdatedRule';
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {companyFollowsUpdatedRule} from "./src/eventRules/companyFollowsUpdatedRule";
import {AddEcFormOutputDataRoute} from './src/routes/addEcFormOutputDataRoute';
import {EcFormOutputDataTable} from './src/eligibility/constructs/tables';
import { UnsuccessfulLoginAttemptsTables } from 'src/cognito/tables';
import {Buckets} from './src/eligibility/constructs/buckets';
import {Lambda} from './src/common/lambda';
import {userGdprRule} from './src/eventRules/userGdprRule';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import getAllowedDomains from './src/utils/getAllowedDomains';
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { createNewCognito, createNewCognitoDDS, createOldCognito, createOldCognitoDDS } from './stackHelper';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '../core/src/identity/authorizer';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export function Identity({ stack }: StackContext) {
  const { certificateArn } = use(Shared);

  //set tag service identity to all resources
  stack.tags.setTag('service', 'identity');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  //Region
  const region = stack.region;

  const ecFormOutputDataTable = new EcFormOutputDataTable(stack)
  const buckets = new Buckets(stack, stack.stage)
  

  const stageSecret = stack.stage === STAGES.PROD || stack.stage === STAGES.STAGING ? stack.stage : STAGES.STAGING;
  const appSecret = Secret.fromSecretNameV2(stack, 'app-secret', `blc-mono-identity/${stageSecret}/cognito`);
  const identitySecret = Secret.fromSecretNameV2(stack,'identity-secret',`blc-mono-identity/${stageSecret}/secrets`);

  //db - identityTable
  const identityTable = new Table(stack, 'identityTable', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
    globalIndexes: {
      gsi1: { partitionKey: 'sk', sortKey: 'pk' },
    },
  });

  const idMappingTable = new Table(stack, 'identityIdMappingTable', {
    fields: {
      uuid: 'string',
      legacy_id: 'string',
    },
    primaryIndex: { partitionKey: 'legacy_id', sortKey: 'uuid' },
  });

const unsuccessfulLoginAttemptsTable = new UnsuccessfulLoginAttemptsTables(stack);

  const { bus, webACL } = use(Shared);

  //add dead letter queue
  const dlq = new Queue(stack, 'DLQ');

  const {oldCognito, oldWebClient} = createOldCognito(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret);
  const {oldCognitoDds, oldWebClientDds} = createOldCognitoDDS(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, identitySecret);
  const cognito = createNewCognito(stack,unsuccessfulLoginAttemptsTable.table ,appSecret, bus, dlq, region, webACL, oldCognito, oldWebClient, identitySecret);
  const cognito_dds = createNewCognitoDDS(stack,unsuccessfulLoginAttemptsTable.table, appSecret, bus, dlq, region, webACL, oldCognitoDds, oldWebClientDds, identitySecret);

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
          ecFormOutputDataTableName: ecFormOutputDataTable.table.tableName,
          service: 'identity',
          allowedDomains: getAllowedDomains(stack.stage),
          REGION: stack.region,
        },
        permissions: [identityTable, ecFormOutputDataTable.table],
      },
    },
    routes: {
      'ANY /eligibility': 'packages/api/identity/src/eligibility/lambda.handler',
      'POST /{brand}/organisation': 'packages/api/identity/src/eligibility/listOrganisation.handler',
      'POST /{brand}/organisation/{organisationId}': 'packages/api/identity/src/eligibility/listService.handler',
    },
    cdk: {
      restApi: {
        ...([STAGES.PROD, STAGES.STAGING].includes(stack.stage as STAGES) &&
          certificateArn && {
            domainName: {
              domainName:
                stack.stage === STAGES.PROD
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
  const agEcFormOutputDataModel = apiGatewayModelGenerator.generateModel(EcFormOutputDataModel);

  identityApi.addRoutes(stack, {
    'GET /user': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'POST /{brand}/formOutputData': new AddEcFormOutputDataRoute(
      apiGatewayModelGenerator,
      agEcFormOutputDataModel,
    ).getRouteDetails(),
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

  stack.addOutputs({
    CognitoUserPoolWebClient: cognito.userPoolId,
    CognitoDdsUserPoolWebClient: cognito_dds.userPoolId,
  });

  //Eligiblity checker Form output lambda rule schedule
  const eligibilityCheckerScheduleRule = new Rule(stack, 'ecOutputLambdaScheduleRule', {
    schedule: Schedule.cron({
      day: '28',
      hour: '00',
      minute: '00',
    }),
  });

  const lambdas = new Lambda(stack, ecFormOutputDataTable, buckets, stack.stage);

  eligibilityCheckerScheduleRule.addTarget(new LambdaFunction(lambdas.ecFormOutrputDataLambda));

  //add event bridge rules
  bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
  bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
  bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));
  bus.addRules(stack, userSignInMigratedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, cardStatusUpdatedRule(dlq.queueUrl, identityTable.tableName, region));
  bus.addRules(stack, userProfileUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, userGdprRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region, unsuccessfulLoginAttemptsTable.table.tableName, oldCognito.userPoolId, oldCognitoDds.userPoolId));

  return {
    identityApi,
    newCognito: cognito,
    cognito: oldCognito,
    authorizer: sharedAuthorizer,
  };
}

