import {ApiGatewayV1Api, Cognito, Function, Queue, StackContext, Table, use} from 'sst/constructs';
import {AdvancedSecurityMode, CfnUserPoolClient, Mfa, StringAttribute} from 'aws-cdk-lib/aws-cognito';
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
import {FilterPattern, ILogGroup} from "aws-cdk-lib/aws-logs";
import {LambdaDestination} from "aws-cdk-lib/aws-logs-destinations";
import {userGdprRule} from './src/eventRules/userGdprRule';
import {CfnWebACLAssociation} from 'aws-cdk-lib/aws-wafv2';

export function Identity({stack}: StackContext) {
    const {certificateArn} = use(Shared);
    const documentationVersion = '1.0.0';
    //set tag service identity to all resources
    stack.tags.setTag('service', 'identity');
    stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

    //Region
    const region = stack.region;
    let regionEnv = 'eu-west-2';
    if (region !== undefined || region !== null) {
        regionEnv = region;
    }

    const stageSecret = stack.stage === 'production' || stack.stage === 'staging' ? stack.stage : 'staging';
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

    //db - trackingDataTable
    const ecFormOutputData = new Table(stack, 'ecFormOutputDataTable', {
        fields: {
            pk: 'string',
            sk: 'string',
        },
        primaryIndex: {partitionKey: 'pk', sortKey: 'sk'},
    });

    const {bus} = use(Shared);
    //add dead letter queue
    const dlq = new Queue(stack, 'DLQ');


    //import webACL
    const {webACL} = use(Shared);
    //auth
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
                    REGION: region
                },
                permissions: [bus]
            },
            postAuthentication: {
                handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
                environment: {
                    SERVICE: 'identity',
                }
            }
        },
        cdk: {
            userPool: {
                mfa: Mfa.OPTIONAL,
                mfaSecondFactor: {
                    sms: true,
                    otp: true,
                },
                advancedSecurityMode: AdvancedSecurityMode.AUDIT,
                standardAttributes: {
                    email: {required: true, mutable: true},
                    phoneNumber: {required: true, mutable: true},
                },
                customAttributes: {
                    blc_old_id: new StringAttribute({mutable: true}),
                    blc_old_uuid: new StringAttribute({mutable: true}),
                },
            },
        },
    });
    const mobileClient = cognito.cdk.userPool.addClient('membersClient', {
        authFlows: {
            userPassword: true,
        },
        generateSecret: true,
    });
    const webClient = cognito.cdk.userPool.addClient('webClient', {
        authFlows: {
            userPassword: true,
        },
        generateSecret: true,
    });
    // Associate WAF WebACL with cognito
    new CfnWebACLAssociation(stack, 'BlcWebAclAssociation', {
        resourceArn: cognito.cdk.userPool.userPoolArn,
        webAclArn: webACL.attrArn
    });

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
                    REGION: region
                },
                permissions: [bus]
            },
            postAuthentication: {
                handler: 'packages/api/identity/src/cognito/postAuthentication.handler',
                environment: {
                    SERVICE: 'identity',
                },
            }
        },
        cdk: {
            userPool: {
                mfa: Mfa.OPTIONAL,
                mfaSecondFactor: {
                    sms: true,
                    otp: true,
                },
                advancedSecurityMode: AdvancedSecurityMode.AUDIT,
                standardAttributes: {
                    email: {required: true, mutable: true},
                    phoneNumber: {required: true, mutable: true},
                },
                customAttributes: {
                    blc_old_id: new StringAttribute({mutable: true}),
                    blc_old_uuid: new StringAttribute({mutable: true}),
                },
            },
        },
    });
    const mobileClientDds = cognito_dds.cdk.userPool.addClient('membersClient', {
        authFlows: {
            userPassword: true,
        },
        generateSecret: true,
    });
    const webClientDds = cognito_dds.cdk.userPool.addClient('webClient', {
        authFlows: {
            userPassword: true,
        },
        generateSecret: true,
    });
    // Associate WAF WebACL with cognito
    new CfnWebACLAssociation(stack, 'DdsWebAclAssociation', {
        resourceArn: cognito_dds.cdk.userPool.userPoolArn,
        webAclArn: webACL.attrArn
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

    //we audit dwh only in production
    if (stack.stage === 'production') {
        //audit log
        const blcAuditLogFunction = new Function(stack, 'blcAuditLogSignIn', {
            handler: 'packages/api/identity/src/audit/audit.handler',
            environment: {
                SERVICE: 'identity',
                DATA_STREAM: 'dwh-blc-production-login',
                WEB_CLIENT_ID: webClient.userPoolClientId,
                MOBILE_CLIENT_ID: mobileClient.userPoolClientId,
            },
            permissions: ['firehose:PutRecord']
        });
        const ddsAuditLogFunction = new Function(stack, 'ddsAuditLogSignIn', {
            handler: 'packages/api/identity/src/audit/audit.handler',
            environment: {
                SERVICE: 'identity',
                DATA_STREAM: 'dwh-dds-production-login',
                WEB_CLIENT_ID: webClientDds.userPoolClientId,
                MOBILE_CLIENT_ID: mobileClientDds.userPoolClientId,
            },
            permissions: ['firehose:PutRecord']
        });
        const postAuthenticationLogGroup: ILogGroup | undefined = cognito.getFunction('postAuthentication')?.logGroup;
        const postAuthenticationLogGroupDds: ILogGroup | undefined = cognito_dds.getFunction('postAuthentication')?.logGroup;
        postAuthenticationLogGroup?.addSubscriptionFilter('auditLogSignIn', {
            destination: new LambdaDestination(blcAuditLogFunction),
            filterPattern: FilterPattern.booleanValue('$.audit', true),
        });
        postAuthenticationLogGroupDds?.addSubscriptionFilter('auditLogDdsSignIn', {
            destination: new LambdaDestination(ddsAuditLogFunction),
            filterPattern: FilterPattern.booleanValue('$.audit', true),
        });
    }

    //API Key and Usage Plan
    const apikey = identityApi.cdk.restApi.addApiKey("identity-api-key");

    const usagePlan = identityApi.cdk.restApi.addUsagePlan("identity-api-usage-plan", {
        throttle: {
            rateLimit: 10,
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

    const cfnUserPoolClient = webClient.node.defaultChild as CfnUserPoolClient;
    cfnUserPoolClient.callbackUrLs = ['https://oauth.pstmn.io/v1/callback'];

    //add event bridge rules
    bus.addRules(stack, passwordResetRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId));
    bus.addRules(stack, emailUpdateRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId));
    bus.addRules(stack, userStatusUpdatedRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId));
    bus.addRules(stack, userSignInMigratedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
    bus.addRules(stack, cardStatusUpdatedRule(dlq.queueUrl, identityTable.tableName));
    bus.addRules(stack, userProfileUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
    bus.addRules(stack, companyFollowsUpdatedRule(dlq.queueUrl, identityTable.tableName, idMappingTable.tableName));
    bus.addRules(stack, userGdprRule(cognito.userPoolId, dlq.queueUrl, cognito_dds.userPoolId));
    return {
        identityApi,
        cognito
    };
}

