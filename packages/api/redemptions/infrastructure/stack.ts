import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, Config, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { createRedemptionTransactionalEmailRule } from '@blc-mono/redemptions/infrastructure/eventBridge/rules/redemptionTransactionalEmail';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';
import { Shared } from '@blc-mono/shared/stack';

import { Identity } from '../../identity/stack';
import { DatabaseConnectionType, SecretsManagerDatabaseCredentials } from '../libs/database/connection';

import { createAdminApi } from './adminApi/createAdminApi';
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
import { createVaultBatchCreatedRule } from './eventBridge/rules/vaultBatchCreatedRule';
import { createVaultCodesUploadRule } from './eventBridge/rules/vaultCodesUploadRule';
import { createVaultCreatedRule } from './eventBridge/rules/VaultCreatedRule';
import { createVaultThresholdEmailRule } from './eventBridge/rules/VaultThresholdEmailRule';
import { Route } from './routes/route';
import { VaultCodesUpload } from './s3/vaultCodesUpload';

export async function Redemptions({ app, stack }: StackContext) {
  const { certificateArn, vpc, bus, dwhKenisisFirehoseStreams, bastionHost } = use(Shared);
  const { authorizer, identityApi } = use(Identity);
  const SERVICE_NAME = 'redemptions';

  // set tag service identity to all resources
  stack.tags.setTag('service', SERVICE_NAME);
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = RedemptionsStackConfigResolver.for(stack);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      BRAND: getBrandFromEnv(),
      service: SERVICE_NAME,
      DD_VERSION: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_VERSION, ''),
      DD_ENV: process.env?.SST_STAGE || 'undefined',
      DD_API_KEY: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_API_KEY, ''),
      DD_GIT_COMMIT_SHA: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_GIT_COMMIT_SHA, ''),
      DD_GIT_REPOSITORY_URL: getEnvOrDefault(RedemptionsStackEnvironmentKeys.DD_GIT_REPOSITORY_URL, ''),
      USE_DATADOG_AGENT: getEnvOrDefault(RedemptionsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false'),
      DD_SERVICE: SERVICE_NAME,
      DD_SITE: 'datadoghq.eu',
    },
  });

  // Create Database
  const database = await new RedemptionsDatabase(app, stack, vpc, bastionHost).setup();

  const domainNames = {
    BLC_UK: 'redemptions.blcshine.io', // TODO: Update this later to follow below format (backward compatibility required)
    DDS_UK: 'redemptions-dds-uk.blcshine.io',
    BLC_AU: 'redemptions-blc-au.blcshine.io',
  };

  const brand = getBrandFromEnv();
  const api = new ApiGatewayV1Api(stack, SERVICE_NAME, {
    authorizers: {
      redemptionsAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'redemptionsAuthorizer',
    },
    cdk: {
      restApi: {
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: isProduction(stack.stage) ? domainNames[brand] : `${stack.stage}-${domainNames[brand]}`,
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
      vaultBatchCreatedRule: createVaultBatchCreatedRule(stack, config, database),
      vaultThresholdEmailRule: createVaultThresholdEmailRule(stack, config, database),
      redemptionPushNotificationRule: createRedemptionPushNotificationRule(stack, config),
    },
    {
      vaultCodesUploadRule: createVaultCodesUploadRule(stack, database, vaultCodesUpload, bus.eventBusName),
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
        [RedemptionsStackEnvironmentKeys.USER_IDENTITY_ENDPOINT]: identityApi.url,
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

  // Create domain email identity
  await createDomainEmailIdentity(config.redemptionsEmailDomain, stack.region);

  const adminApi = createAdminApi(stack, globalConfig, certificateArn, database);

  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
    RedemptionsAdminApiEndpoint: adminApi.url,
  });

  return {
    api,
    adminApi,
  };
}
