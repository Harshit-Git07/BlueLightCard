import {ApiGatewayV1Api, Cognito, Queue, StackContext, Table, use} from 'sst/constructs';
import {CfnUserPoolClient, StringAttribute} from 'aws-cdk-lib/aws-cognito';
import {StringParameter} from 'aws-cdk-lib/aws-ssm';
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

export function Identity({stack}: StackContext) {
  const {certificateArn} = use(Shared);
  const documentationVersion = '1.0.0';
  //set tag service identity to all resources
  stack.tags.setTag('service', 'identity');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  //ssm parameters
  const stage = stack.stage;
  let ssmEnv = 'staging';
  switch (stage) {
    case 'staging':
      ssmEnv = 'staging';
      break;
    case 'production':
      ssmEnv = 'production';
      break;
    default:
      ssmEnv = 'staging';
  }
  const blcApiUrl = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/url`);
  const blcApiAuth = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/auth`);

  //db - identityTable
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

  const idMappingTable = new Table(stack, 'identityIdMappingTable', {
    fields: {
      uuid: 'string',
      legacy_id: 'string',
    },
    primaryIndex: { partitionKey: 'legacy_id', sortKey: 'uuid' },
  });

  //db - trackingDataTable
    const ecFormOutputData = new Table(stack, 'ecFormOutputDataTable', {
      fields: {
        pk: 'string',
        sk: 'string',
      },
      primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
    });

  const { bus } = use(Shared);
  //add dead letter queue
  const dlq = new Queue(stack, 'DLQ');

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
          EVENT_BUS: bus.eventBusName,
          EVENT_SOURCE: 'user.signin.migrated',
          DLQ_URL: dlq.queueUrl,
          REGION: 'eu-west-2'
        },
        permissions: [bus]
      }
    },
    cdk: {
      userPool: {
        standardAttributes: {
          email: { required: true, mutable: true },
          phoneNumber: { required: true, mutable: true },
        },
        customAttributes: {
          blc_old_id: new StringAttribute({ mutable: true }),
          blc_old_uuid: new StringAttribute({ mutable: true })
        },
      },
    },
  });
  
    //apis
    const identityApi = new ApiGatewayV1Api(stack, 'identity', {
      authorizers: {
        identityAuthorizer: {
          type: "user_pools",
          userPoolIds: [cognito.userPoolId],
        },
      },
      defaults: {
        function: {
          timeout: 20,
          environment: {
            identityTableName: identityTable.tableName,
            ecFormOutputDataTableName: ecFormOutputData.tableName,
            service: 'identity'
          },
          permissions: [identityTable, ecFormOutputData],
        },
      },
      routes: {
        'ANY /eligibility': 'packages/api/identity/src/eligibility/lambda.handler',
        'POST /{brand}/organisation': 'packages/api/identity/src/eligibility/listOrganisation.handler',
        'POST /{brand}/organisation/{organisationId}': 'packages/api/identity/src/eligibility/listService.handler',
        // 'POST /{brand}/formOutputData': 'packages/api/identity/src/eligibility/ecFormOutputData.handler',
      },
      cdk: {
        restApi: {
          ...(['production', 'staging'].includes(stack.stage) && certificateArn && {
            domainName: {
              domainName: stack.stage === 'production' ? 'identity.blcshine.io' : `${stack.stage}-identity.blcshine.io`,
              certificate: Certificate.fromCertificateArn(stack, "DomainCertificate", certificateArn),
            },
          })
        }
      }
    });
    
  
    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(identityApi.cdk.restApi);
    const agUserModel = apiGatewayModelGenerator.generateModelFromZodEffect(UserModel);

    identityApi.addRoutes(stack, {
      'GET /user': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    });

    cognito.cdk.userPool.addClient('membersClient', {
      authFlows: {
        userPassword: true,
      },
      generateSecret: true,
    });
    stack.addOutputs({
      CognitoUserPooMembersClient: cognito.userPoolId,
      Table: identityTable.tableName,
      IdentityApiEndpoint: identityApi.url,
    });

    const webClient = cognito.cdk.userPool.addClient('webClient', {
      authFlows: {
        userPassword: true,
      },
      generateSecret: true,
    });
    
    stack.addOutputs({
      CognitoUserPoolWebClient: cognito.userPoolId,
    });

    const cfnUserPoolClient = webClient.node.defaultChild as CfnUserPoolClient;
    cfnUserPoolClient.callbackUrLs = ['https://oauth.pstmn.io/v1/callback'];

  
  //add event bridge rules
  bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl));
  bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl));
  bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl));
  bus.addRules(stack, userSignInMigratedRule(cognito.userPoolId, dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
  bus.addRules(stack, cardStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, identityTable.tableName));
  bus.addRules(stack, userProfileUpdatedRule(cognito.userPoolId, dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
  bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
  return {
    identityApi,
    cognito
  };
}

