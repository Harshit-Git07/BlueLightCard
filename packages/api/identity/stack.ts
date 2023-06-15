import {StackContext, Api, Cognito, Table, use, Queue} from "sst/constructs";
import {StringAttribute} from "aws-cdk-lib/aws-cognito";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import {Shared} from "../../../stacks/stack";
import { passwordResetRule } from './src/eventRules/passwordResetRule';
import { userStatusUpdatedRule } from './src/eventRules/userStatusUpdated';
import { emailUpdateRule } from "src/eventRules/emailUpdateRule";

export function Identity({ stack }: StackContext) {
  //set tag service identity to all resources
  stack.tags.setTag("service", "identity");
  stack.tags.setTag("map-migrated", "d-server-017zxazumgiycz");
  //apis
  const api = new Api(stack, "identity", {
    routes: {
      "ANY /users": "packages/api/identity/src/user-management/lambda.handler",
      "ANY /eligibility":
        "packages/api/identity/src/eligibility/lambda.handler",
    },
  });

  //ssm parameters
  const stage = stack.stage;
  let ssmEnv = "staging";
  switch (stage) {
    case "staging":
      ssmEnv = "staging";
    case "production":
      ssmEnv = "production";
    default:
      ssmEnv = "staging";
  }
  const blcApiUrl = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/url`);
  const blcApiAuth = StringParameter.valueFromLookup(stack, `/identity/${ssmEnv}/blc-old/api/auth`);

  //db
  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: {
      gsi1: { partitionKey: "sk", sortKey: "pk" },
    },
  });

  //auth
  const cognito = new Cognito(stack, "cognito", {
    login: ['email'],
    triggers: {
      userMigration: {
        handler: 'packages/api/identity/src/cognito/migration.handler',
        environment: {SERVICE: 'identity', BLC_API_URL: blcApiUrl, BLC_API_AUTH: blcApiAuth}
      }
    },
    cdk: {
      userPool: {
        standardAttributes: {
            email: { required: true,mutable: true },
            phoneNumber: { required: true, mutable: true }
        },
        customAttributes: {
          blc_old_id: new StringAttribute({ mutable: true }),
          blc_old_uuid: new StringAttribute({ mutable: true }),
        }
      }
    }
  })
  cognito.cdk.userPool.addClient("membersClient", {
    authFlows: {
      userPassword: true,
    },
    generateSecret: true
  });
  stack.addOutputs({
    IdentityApiEndpoint: api.url,
    CognitoUserPool: cognito.userPoolId,
    Table: table.tableName
  });


  //add dead letter queue 
  const dlq = new Queue(stack, "DLQ");


  //add event bridge rules
  const { bus } = use(Shared);
  bus.addRules(stack, passwordResetRule(cognito.userPoolId,dlq.queueUrl));
  bus.addRules(stack, emailUpdateRule(cognito.userPoolId,dlq.queueUrl));
  bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl)); 
  
}
