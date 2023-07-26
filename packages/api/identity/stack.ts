import { StackContext, Cognito, Table, use, Queue, ApiGatewayV1Api } from 'sst/constructs';
import { StringAttribute } from 'aws-cdk-lib/aws-cognito';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Shared } from '../../../stacks/stack';
import { passwordResetRule } from './src/eventRules/passwordResetRule';
import { userStatusUpdatedRule } from './src/eventRules/userStatusUpdated';
import { emailUpdateRule } from './src/eventRules/emailUpdateRule';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { UserModel } from './src/models/user';
import { GetUserByIdRoute } from './src/routes/getUserByIdRoute';
import { PostUserRoute } from './src/routes/postUserRoute';
import { PutUserByIdRoute } from './src/routes/putUserByIdRoute';
import { DeleteUserByIdRoute } from './src/routes/deleteUserByIdRoute';

export function Identity({ stack }: StackContext) {
  //set tag service identity to all resources
  stack.tags.setTag('service', 'identity');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  //ssm parameters
  const stage = stack.stage;
  let ssmEnv = 'staging';
  switch (stage) {
    case 'staging':
      ssmEnv = 'staging';
    case 'production':
      ssmEnv = 'production';
    default:
      ssmEnv = 'staging';
  }
  const blcApiUrl = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/url`);
  const blcApiAuth = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/auth`);

  //db
  const identityTable = new Table(stack, 'identityTable', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
    globalIndexes: {
      gsi1: { partitionKey: 'sk', sortKey: 'pk' },
    }
  });

  //apis
  const identityApi = new ApiGatewayV1Api(stack, 'identity', {
    defaults: {
      function: {
        timeout: 20,
        environment: { tableName: identityTable.tableName, service: 'identity' },
        permissions: [identityTable],
      },
    },
    routes: {
      'ANY /eligibility': 'packages/api/identity/src/eligibility/lambda.handler',
      'POST /{brand}/organisation': 'packages/api/identity/src/eligibility/listOrganisation.handler',
      'POST /{brand}/organisation/{organisationId}': 'packages/api/identity/src/eligibility/listService.handler',
    },
  });

  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(identityApi.cdk.restApi);
  const agUserModel = apiGatewayModelGenerator.generateModel(UserModel);

  identityApi.addRoutes(stack, {
    'GET /users/{id}': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'POST /users': new PostUserRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'PUT /users/{id}': new PutUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'DELETE /users/{id}': new DeleteUserByIdRoute(apiGatewayModelGenerator).getRouteDetails(),
  });

  //auth
  const cognito = new Cognito(stack, 'cognito', {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {
          SERVICE: 'identity',
          BLC_API_URL: blcApiUrl,
          BLC_API_AUTH: blcApiAuth,
        },
      },
    },
    cdk: {
      userPool: {
        standardAttributes: {
          email: { required: true, mutable: true },
          phoneNumber: { required: true, mutable: true },
        },
        customAttributes: {
          blc_old_id: new StringAttribute({ mutable: true }),
          blc_old_uuid: new StringAttribute({ mutable: true }),
        },
      },
    },
  });
  cognito.cdk.userPool.addClient('membersClient', {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true,
  });
  stack.addOutputs({
    CognitoUserPool: cognito.userPoolId,
    Table: identityTable.tableName,
    IdentityApiEndpoint: identityApi.url,
  });

  //add dead letter queue
  const dlq = new Queue(stack, 'DLQ');

  //add event bridge rules
  const { bus } = use(Shared);
  bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl));
  bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl));
  bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl));

  return {
    identityApi,
    cognito
  };
}

