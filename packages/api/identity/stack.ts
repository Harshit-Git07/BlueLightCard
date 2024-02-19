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
import {Tables} from './src/eligibility/constructs/tables';
import {Buckets} from './src/eligibility/constructs/buckets';
import {Lambda} from './src/common/lambda';
import {userGdprRule} from './src/eventRules/userGdprRule';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import {LambdaFunction} from 'aws-cdk-lib/aws-events-targets';
import getAllowedDomains from './src/utils/getAllowedDomains';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { STAGES } from '@blc-mono/core/types/stages.enum';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { createNewCognito, createNewCognitoDDS, createOldCognito, createOldCognitoDDS } from './stackHelper'

export function Identity({stack}: StackContext) {
  const {certificateArn} = use(Shared);
  const documentationVersion = '1.0.0';

  //set tag service identity to all resources
  stack.tags.setTag('service', 'identity');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  //Region
  const region = stack.region;

  const tables = new Tables(stack)
  const buckets = new Buckets(stack, stack.stage)

  const stageSecret = stack.stage === STAGES.PROD || stack.stage === STAGES.STAGING ? stack.stage : STAGES.STAGING;
  const appSecret = Secret.fromSecretNameV2(stack, 'app-secret', `blc-mono-identity/${stageSecret}/cognito`);

  //db - identityTable
  const identityTable = new Table(stack, 'identityTable', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: {partitionKey: 'pk', sortKey: 'sk'},
    globalIndexes: {
      gsi1: {partitionKey: 'sk', sortKey: 'pk'},
    }
  });

  const idMappingTable = new Table(stack, 'identityIdMappingTable', {
    fields: {
      uuid: 'string',
      legacy_id: 'string',
    },
    primaryIndex: {partitionKey: 'legacy_id', sortKey: 'uuid'},
  });

  const {webACL} = use(Shared);
  const {bus} = use(Shared);
  //add dead letter queue
  const dlq = new Queue(stack, 'DLQ');

  const {oldCognito, oldWebClient} = createOldCognito(stack, appSecret, bus, dlq, region, webACL);
  const {oldCognitoDds, oldWebClientDds} = createOldCognitoDDS(stack, appSecret, bus, dlq, region, webACL);
  const cognito = createNewCognito(stack, appSecret, bus, dlq, region, webACL, oldCognito, oldWebClient);
  const cognito_dds = createNewCognitoDDS(stack, appSecret, bus, dlq, region, webACL, oldCognitoDds, oldWebClientDds);

  const customDomainNameLookUp: Record<string, string> = {
    [REGIONS.EU_WEST_2]: 'identity.blcshine.io',
    [REGIONS.AP_SOUTHEAST_2]: 'identity-au.blcshine.io'
  }

  //apis
  const identityApi = new ApiGatewayV1Api(stack, 'identity', {
    authorizers: {
      identityAuthorizer: {
        type: 'lambda_request',
        function: new Function(stack, 'Authorizer', {
          handler:
            './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.handler',
          environment: {
            USER_POOL_ID: cognito.userPoolId,
            USER_POOL_ID_DDS: cognito_dds.userPoolId,
          },
        }),
        identitySources: [apigateway.IdentitySource.header('Authorization')],
      },
    },
    defaults: {
      function: {
        timeout: 20,
        environment: {
          identityTableName: identityTable.tableName,
          ecFormOutputDataTableName: tables.ecFormOutputDataTable.tableName,
          service: 'identity',
          allowedDomains: getAllowedDomains(stack.stage),
          REGION: stack.region,
        },
        permissions: [identityTable, tables.ecFormOutputDataTable],
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
    'POST /{brand}/formOutputData': new AddEcFormOutputDataRoute(apiGatewayModelGenerator, agEcFormOutputDataModel).getRouteDetails(),
  });

  stack.addOutputs({
    CognitoUserPooMembersClient: cognito.userPoolId,
    CognitoDdsUserPooMembersClient: cognito_dds.userPoolId,
    Table: identityTable.tableName,
    IdentityApiEndpoint: identityApi.url,
  });

  //API Key and Usage Plan
  const apikey = identityApi.cdk.restApi.addApiKey("identity-api-key");

  const usagePlan = identityApi.cdk.restApi.addUsagePlan("identity-api-usage-plan", {
    throttle: {
      rateLimit: 1,
      burstLimit: 2,
    },
    apiStages: [
      {
        api: identityApi.cdk.restApi,
        stage: identityApi.cdk.restApi.deploymentStage
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

  const lambdas = new Lambda(stack, tables, buckets, stack.stage);

  eligibilityCheckerScheduleRule.addTarget(new LambdaFunction(lambdas.ecFormOutrputDataLambda));

  //add event bridge rules
  bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region));
  bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region));
  bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region));
  bus.addRules(stack, userSignInMigratedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, cardStatusUpdatedRule(dlq.queueUrl, identityTable.tableName, region));
  bus.addRules(stack, userProfileUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName, region));
  bus.addRules(stack, userGdprRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId, region));

  return {
    identityApi,
    cognito
  };
}
