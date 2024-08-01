import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, Config, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';
import { Shared } from '@blc-mono/shared/stack';

import { Identity } from '../../identity/stack';
import { DatabaseConnectionType, SecretsManagerDatabaseCredentials } from '../libs/database/connection';

import { RedemptionsStackConfigResolver } from './config/config';
import { RedemptionsStackEnvironmentKeys } from './constants/environment';
import { RedemptionsDatabase } from './database/database';
import { createDomainEmailIdentity } from './email/createDomainEmailIdentity';
import { EventBridge } from './eventBridge/eventBridge';
import {
  createOfferRule,
  createPromotionUpdatedRule,
  createVaultUpdatedRule,
  updateOfferRule,
} from './eventBridge/rules';
import { createDwhMemberRedeemIntentRule } from './eventBridge/rules/dwhMemberRedeemIntentRule';
import { createDwhMemberRedemptionRule } from './eventBridge/rules/dwhMemberRedemptionRule';
import { createDwhMemberRetrievedRedemptionDetailsRule } from './eventBridge/rules/dwhMemberRetrievedRedemptionDetailsRule';
import { createRedemptionPushNotificationRule } from './eventBridge/rules/redemptionPushNotificationRule';
import { createRedemptionTransactionalEmailRule } from './eventBridge/rules/redemptionTransactionalEmail';
import { createVaultBatchCreatedRule } from './eventBridge/rules/vaultBatchCreatedRule';
import { createVaultCodesUploadRule } from './eventBridge/rules/vaultCodesUploadRule';
import { createVaultCreatedRule } from './eventBridge/rules/VaultCreatedRule';
import { createVaultThresholdEmailRule } from './eventBridge/rules/VaultThresholdEmailRule';
import { Route } from './routes/route';
import { VaultCodesUpload } from './s3/vaultCodesUpload';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

export async function Redemptions({ app, stack }: StackContext) {
  const { certificateArn, vpc, bus, dwhKenisisFirehoseStreams, bastionHost } = use(Shared);
  const { authorizer } = use(Identity);

  // set tag service identity to all resources
  stack.tags.setTag('service', 'redemptions');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = RedemptionsStackConfigResolver.for(stack);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      service: 'redemptions',
    },
  });

  // Create Database
  const database = await new RedemptionsDatabase(app, stack, vpc, bastionHost).setup();

  const api = new ApiGatewayV1Api(stack, 'redemptions', {
    authorizers: {
      redemptionsAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'redemptionsAuthorizer',
    },
    cdk: {
      restApi: {
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
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

  //set up S3 bucket for vault code files uploaded to S3
  const vaultCodesUpload = new VaultCodesUpload(stack);

  //params: stack, custom EventBus rule sets, default EventBus rule sets
  new EventBridge(
    stack,
    {
      vaultCreatedRule: createVaultCreatedRule(stack, database),
      vaultUpdatedRule: createVaultUpdatedRule(stack, database),
      promotionUpdatedRule: createPromotionUpdatedRule(stack, database, config),
      offerCreatedRule: createOfferRule(stack, database),
      emailTransactionalRule: createRedemptionTransactionalEmailRule(stack, config),
      offerUpdatedRule: updateOfferRule(stack, database),
      dwhMemberRedemptionDetails: createDwhMemberRetrievedRedemptionDetailsRule(stack, dwhKenisisFirehoseStreams),
      dwhMemberRedeemIntentRule: createDwhMemberRedeemIntentRule(stack, dwhKenisisFirehoseStreams),
      dwhMemberRedemptionRule: createDwhMemberRedemptionRule(stack, dwhKenisisFirehoseStreams),
      vaultBatchCreatedRule: createVaultBatchCreatedRule(stack),
      vaultThresholdEmailRule: createVaultThresholdEmailRule(stack, config, database),
      redemptionPushNotificationRule: createRedemptionPushNotificationRule(stack, config),
    },
    {
      vaultCodesUploadRule: createVaultCodesUploadRule(stack, vaultCodesUpload, database),
    },
  );

  // Create permissions
  // TODO: Specify the resource for the secrets manager from Secret.fromSecretCompleteArn (It was not getting the final 6 characters as expected, need to investigate further)
  const getSecretValueSecretsManagerPolicy = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const publishRedemptionsEventBusPolicy = new PolicyStatement({
    actions: ['events:PutEvents'],
    effect: Effect.ALLOW,
    resources: [bus.eventBusArn],
  });

  // functionName is automatically appended with the stage name

  api.addRoutes(stack, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      permissions: [publishRedemptionsEventBusPolicy],
      environment: {
        // Event Bus
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: bus.eventBusName,
      },
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH]:
          config.redemptionsLambdaScriptsViewVaultBatchesPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH]:
          config.redemptionsLambdaScriptsCheckVaultStockPath,
        // Event Bus
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: bus.eventBusName,
      },
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [
        // Common
        publishRedemptionsEventBusPolicy,
        // Legacy Vault Service
        getSecretValueSecretsManagerPolicy,
      ],
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      permissions: [getSecretValueSecretsManagerPolicy],
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

  // To avoid TypeScript errors, we set the secret name to 'DISABLED' if the
  // database credentials are not stored in Secrets Manager
  const databaseCredentials = database.connectionConfig.credentials;
  const databaseCredentialsSecretName =
    databaseCredentials instanceof SecretsManagerDatabaseCredentials ? databaseCredentials.secretName : 'DISABLED';
  new Config.Parameter(stack, 'REDEMPTIONS_DATABASE_CREDENTIALS_SECRET_NAME', {
    value: databaseCredentialsSecretName,
  });

  // Datadog instrumentation
  new Config.Parameter(stack, 'DD_VERSION', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_VERSION, ''),
  });

  new Config.Parameter(stack, 'DD_ENV', {
    value: process.env?.SST_STAGE || 'undefined',
  });

  new Config.Parameter(stack, 'DD_API_KEY', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_API_KEY, ''),
  });

  new Config.Parameter(stack, 'DD_GIT_COMMIT_SHA', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
  });

  new Config.Parameter(stack, 'DD_GIT_REPOSITORY_URL', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
  });

  new Config.Parameter(stack, 'USE_DATADOG_AGENT', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.USE_DATADOG_AGENT, ''),
  });

  new Config.Parameter(stack, 'DATADOG_API_KEY_ARN', {
    value: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DATADOG_API_KEY_ARN, ''),
  });

  new Config.Parameter(stack, 'DD_SERVICE', {
    value: 'redemptions',
  });

  // Create domain email identity
  await createDomainEmailIdentity(config.redemptionsEmailDomain, stack.region);
  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
  });

  return {
    api,
  };
}
