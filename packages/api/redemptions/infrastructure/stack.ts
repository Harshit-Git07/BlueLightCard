import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, Config, StackContext, use } from 'sst/constructs';

import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { isDev, isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { getEnvOrDefault, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { createRedemptionTransactionalEmailRule } from '@blc-mono/redemptions/infrastructure/eventBridge/rules/redemptionTransactionalEmail';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';
import { Shared } from '@blc-mono/shared/stack';

import { Identity } from '../../identity/stack';
import { DatabaseConnectionType, SecretsManagerDatabaseCredentials } from '../libs/database/connection';

import { createAdminApi } from './adminApi/createAdminApi';
import { RedemptionsStackConfigResolver } from './config/config';
import { productionDomainNames, stagingDomainNames } from './constants/domains';
import { RedemptionsStackEnvironmentKeys } from './constants/environment';
import { checkBallotsCron } from './cron/checkBallots';
import { vaultStockDwhCron } from './cron/logVaultStockDwh';
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
import { runBallotRule } from './eventBridge/rules/redemptionRunBallotRule';
import { runSuccessfulBallotRule } from './eventBridge/rules/redemptionSuccessfulBallotRule';
import { runUnsuccessfulBallotRule } from './eventBridge/rules/redemptionUnsuccessfulBallotRule';
import { createVaultBatchCreatedRule } from './eventBridge/rules/vaultBatchCreatedRule';
import { createVaultCodesUploadRule } from './eventBridge/rules/vaultCodesUploadRule';
import { createVaultCreatedRule } from './eventBridge/rules/VaultCreatedRule';
import { createVaultThresholdEmailRule } from './eventBridge/rules/VaultThresholdEmailRule';
import { buildLambdaScriptsEnvs } from './helpers/buildLambdaScriptsEnvs';
import { Route } from './routes/route';
import { VaultCodesUpload } from './s3/vaultCodesUpload';

async function RedemptionsStack({ app, stack }: StackContext) {
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
              domainName: isProduction(stack.stage) ? productionDomainNames[brand] : stagingDomainNames[brand],
              certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
            },
          }),
        deployOptions: {
          stageName: 'v1',
          metricsEnabled: true,
        },
        // IMPORTANT: If you need to update these settings, remember to also
        //            update them in APIGatewayController
        defaultCorsPreflightOptions: {
          allowOrigins: config.networkConfig.apiDefaultAllowedOrigins,
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
  const vaultCodesUpload = new VaultCodesUpload(stack, config);

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
      runBallotRule: runBallotRule(stack, database, bus.eventBusName, config),
      runSuccessfulBallotRule: runSuccessfulBallotRule(stack, database, config),
      runUnsuccessfulBallotRule: runUnsuccessfulBallotRule(stack, database, config),
    },
    {
      vaultCodesUploadRule: createVaultCodesUploadRule(stack, database, vaultCodesUpload, bus.eventBusName),
    },
  );

  // Create cron jobs for checking ballots
  checkBallotsCron(stack, database, bus.eventBusName, config);

  // Create cron jobs for vault stock DWH
  vaultStockDwhCron(stack, database, dwhKenisisFirehoseStreams);

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
      defaultAllowedOrigins: config.networkConfig.apiDefaultAllowedOrigins,
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
      handler: 'packages/api/redemptions/application/handlers/apiGateway/redeem/postRedeemHandler.handler',
      requestValidatorName: 'PostRedeemValidator',
      environment: {
        // Lambda Script Integration
        ...buildLambdaScriptsEnvs(config),
        [RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME]: config.secretsManagerConfig.secretsManagerName,
        // Event Bus
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME]: bus.eventBusName,
        [RedemptionsStackEnvironmentKeys.IDENTITY_API_URL]: isDev(stack.stage)
          ? identityApi.url
          : config.networkConfig.identityApiUrl,
        [RedemptionsStackEnvironmentKeys.ENABLE_STANDARD_VAULT]: config.featureFlagsConfig.enableStandardVault,
        [RedemptionsStackEnvironmentKeys.UNIQODO_CLAIM_URL]: config.uniqodoConfig.uniqodoClaimUrl,
        [RedemptionsStackEnvironmentKeys.EAGLE_EYE_API_URL]: config.eagleEyeConfig.eagleEyeApiUrl,
        [RedemptionsStackEnvironmentKeys.UNIQODO_SECRETS_MANAGER_NAME]:
          config.secretsManagerConfig.uniqodoSecretsManagerName,
      },
      defaultAllowedOrigins: config.networkConfig.apiDefaultAllowedOrigins,
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
      defaultAllowedOrigins: config.networkConfig.apiDefaultAllowedOrigins,
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
        [RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME]: config.secretsManagerConfig.secretsManagerName,
        ...buildLambdaScriptsEnvs(config),
      },
      defaultAllowedOrigins: config.networkConfig.apiDefaultAllowedOrigins,
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
  await createDomainEmailIdentity(config.sesConfig.redemptionsEmailDomain, stack.region);

  const adminApi = createAdminApi(
    stack,
    config,
    globalConfig,
    certificateArn,
    database,
    brand,
    vaultCodesUpload,
    dwhKenisisFirehoseStreams,
  );

  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
    RedemptionsAdminApiEndpoint: adminApi.url,
  });

  return {
    api,
    adminApi,
  };
}

export const Redemptions =
  getEnvRaw(RedemptionsStackEnvironmentKeys.SKIP_REDEMPTIONS_STACK) !== 'true'
    ? RedemptionsStack
    : () => Promise.resolve();
