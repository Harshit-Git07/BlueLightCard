import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, Config, StackContext, use } from 'sst/constructs';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { createRedemptionTransactionalEmailRule } from '@blc-mono/redemptions/infrastructure/eventBridge/rules/redemptionTransactionalEmail';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';

import { Shared } from '../../../../stacks/stack';
import { Identity } from '../../identity/stack';
import { DatabaseConnectionType, SecretsManagerDatabaseCredentials } from '../libs/database/connection';

import { RedemptionsStackConfigResolver } from './config/config';
import { RedemptionsStackEnvironmentKeys } from './constants/environment';
import { RedemptionsDatabase } from './database/database';
import { EventBridge } from './eventBridge/eventBridge';
import {
  createLinkRule,
  createOfferRule,
  createPromotionUpdatedRule,
  createVaultUpdatedRule,
  updateOfferRule,
} from './eventBridge/rules';
import { createVaultCreatedRule } from './eventBridge/rules/VaultCreatedRule';
import { Route } from './routes/route';

export async function Redemptions({ app, stack }: StackContext) {
  const { certificateArn, vpc, bus, dwhKenisisFirehoseStreams } = use(Shared);
  const { authorizer } = use(Identity);

  // set tag service identity to all resources
  stack.tags.setTag('service', 'redemptions');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = RedemptionsStackConfigResolver.for(stack);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      service: 'redemptions',
    },
  });

  // Create Database
  const database = await new RedemptionsDatabase(app, stack, vpc).setup();

  const api = new ApiGatewayV1Api(stack, 'redemptions', {
    authorizers: {
      redemptionsAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'redemptionsAuthorizer',
    },
    cdk: {
      restApi: {
        ...(['production', 'staging'].includes(stack.stage) &&
          certificateArn && {
            domainName: {
              domainName:
                stack.stage === 'production' ? 'redemptions.blcshine.io' : `${stack.stage}-redemptions.blcshine.io`,
              certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
            },
          }),
        deployOptions: {
          stageName: 'v1',
        },
        // IMPORTANT: If you need to update these settings, remember to also
        //            update them in APIGatewayController
        defaultCorsPreflightOptions: {
          allowOrigins: config.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });
  const restApi = api.cdk.restApi;

  // Create API Models
  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
  const postAffiliateModel = apiGatewayModelGenerator.generateModel(PostAffiliateModel);
  const postRedeemModel = apiGatewayModelGenerator.generateModel(PostRedeemModel);

  new EventBridge(stack, {
    linkRule: createLinkRule(stack),
    vaultCreatedRule: createVaultCreatedRule(stack, database),
    vaultUpdatedRule: createVaultUpdatedRule(stack, database),
    promotionUpdatedRule: createPromotionUpdatedRule(stack, database, config),
    offerCreatedRule: createOfferRule(stack, database),
    emailTransactionalRule: createRedemptionTransactionalEmailRule(stack, config),
    offerUpdatedRule: updateOfferRule(stack, database),
  });

  // Create permissions
  // TODO: Specify the resource for the secrets manager from Secret.fromSecretCompleteArn (It was not getting the final 6 characters as expected, need to investigate further)
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const publishRedemptionsEventBus = new PolicyStatement({
    actions: ['events:PutEvents'],
    effect: Effect.ALLOW,
    resources: [bus.eventBusArn],
  });
  const publishDwhCompViewStream = dwhKenisisFirehoseStreams.compViewStream.getPutRecordPolicyStatement();
  const publishDwhCompClickStream = dwhKenisisFirehoseStreams.compClickStream.getPutRecordPolicyStatement();
  const publishDwhCompAppViewStream = dwhKenisisFirehoseStreams.compAppViewStream.getPutRecordPolicyStatement();
  const publishDwhCompAppClickStream = dwhKenisisFirehoseStreams.compAppClickStream.getPutRecordPolicyStatement();
  const publishDwhVaultStream = dwhKenisisFirehoseStreams.vaultStream.getPutRecordPolicyStatement();

  // functionName is automatically appended with the stage name
  api.addRoutes(stack, {
    'GET /member/redemptionDetails': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetRedemptionDetailsHandler',
      restApi,
      database,
      handler:
        'packages/api/redemptions/application/handlers/apiGateway/redemptionDetails/getRedemptionDetails.handler',
      requestValidatorName: 'GetRedemptionDetailsValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [
        // Data Warehouse
        publishDwhCompViewStream,
        publishDwhCompAppViewStream,
      ],
      environment: {
        // Data Warehouse
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME]:
          dwhKenisisFirehoseStreams.compViewStream.getStreamName(),
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME]:
          dwhKenisisFirehoseStreams.compAppViewStream.getStreamName(),
      },
    }),
    'POST /member/redeem': Route.createRoute({
      model: postRedeemModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostRedeemHandler',
      restApi,
      database,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/redeem/postRedeem.handler',
      requestValidatorName: 'PostRedeemValidator',
      environment: {
        // Lambda Script Integration
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME]:
          config.redemptionsLambdaScriptsSecretName,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
          config.redemptionsLambdaScriptsEnvironment,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: config.redemptionsLambdaScriptsHost,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]:
          config.redemptionsLambdaScriptsRetrieveAllVaultsPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]:
          config.redemptionsLambdaScriptsCodeRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
          config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
          config.redemptionsLambdaScriptsCodeAmountIssuedPath,
        // Event Bus
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: bus.eventBusName,
        // Data Warehouse
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME]:
          dwhKenisisFirehoseStreams.compClickStream.getStreamName(),
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME]:
          dwhKenisisFirehoseStreams.compAppClickStream.getStreamName(),
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME]:
          dwhKenisisFirehoseStreams.vaultStream.getStreamName(),
      },
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [
        // Common
        publishRedemptionsEventBus,
        // Legacy Vault Service
        getSecretValueSecretsManager,
        // Data Warehouse
        publishDwhCompClickStream,
        publishDwhCompAppClickStream,
        publishDwhVaultStream,
      ],
    }),
    'POST /member/connection/affiliate': Route.createRoute({
      model: postAffiliateModel,
      apiGatewayModelGenerator,
      functionName: 'PostAffiliateHandler',
      stack,
      restApi,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/affiliate/postAffiliate.handler',
      requestValidatorName: 'PostAffiliateValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
    }),
    'POST /member/online/single-use/custom/spotify': Route.createRoute({
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostSpotifyHandler',
      restApi,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/proxy/postSpotify.handler',
      requestValidatorName: 'PostSpotifyValidator',
      environment: {
        // Lambda Script Integration
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_NAME]:
          config.redemptionsLambdaScriptsSecretName,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
          config.redemptionsLambdaScriptsEnvironment,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: config.redemptionsLambdaScriptsHost,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH]:
          config.redemptionsLambdaScriptsRetrieveAllVaultsPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH]:
          config.redemptionsLambdaScriptsCodeRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
          config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
          config.redemptionsLambdaScriptsCodeAmountIssuedPath,
      },
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [getSecretValueSecretsManager],
    }),
  });

  const databaseReadOnlyHost = database.connectionConfig.endpoint.getHost(DatabaseConnectionType.READ_ONLY);
  const databaseReadWriteHost = database.connectionConfig.endpoint.getHost(DatabaseConnectionType.READ_WRITE);
  new Config.Parameter(stack, 'REDEMPTIONS_DATABASE_READ_ONLY_HOST', {
    value: databaseReadOnlyHost,
  });
  new Config.Parameter(stack, 'REDEMPTIONS_DATABASE_READ_WRITE_HOST', {
    value: databaseReadWriteHost,
  });

  // To avoid TypeScript errors, we set the instance ID to 'DISABLED' if there
  // is no bastion host
  const bastionHost = database.getBastionHost();
  const instanceId = bastionHost ? bastionHost.instanceId : 'DISABLED';
  new Config.Parameter(stack, 'REDEMPTIONS_BASTION_HOST_INSTANCE', {
    value: instanceId,
  });

  // To avoid TypeScript errors, we set the secret name to 'DISABLED' if the
  // database credentials are not stored in Secrets Manager
  const databaseCredentials = database.connectionConfig.credentials;
  const databaseCredentialsSecretName =
    databaseCredentials instanceof SecretsManagerDatabaseCredentials ? databaseCredentials.secretName : 'DISABLED';
  new Config.Parameter(stack, 'REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME', {
    value: databaseCredentialsSecretName,
  });

  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
  });

  return {
    api,
  };
}
