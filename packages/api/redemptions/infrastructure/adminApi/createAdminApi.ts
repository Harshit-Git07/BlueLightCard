import { ApiKeySourceType, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { AdminRoute } from '@blc-mono/redemptions/infrastructure/routes/adminRoute';
import { DwhKenisisFirehoseStreams } from '@blc-mono/shared/infra/firehose/DwhKenisisFirehoseStreams';

import { RedemptionsStackConfigResolver } from '../config/config';
import { productionAdminDomainNames, stagingAdminDomainNames } from '../constants/domains';
import { IDatabase } from '../database/adapter';
import { VaultCodesUpload } from '../s3/vaultCodesUpload';

type GlobalConfig = {
  apiGatewayEndpointTypes: EndpointType[];
};

type baseParams = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  database: IDatabase;
  restApi: RestApi;
  stack: Stack;
};

type AdminApiRoutesParams = {
  name: string;
  handler: string;
  environment?: Record<string, string>;
  permissions?: PolicyStatement[];
};

const createRoutesFactory = (baseParams: baseParams) => {
  return ({ name, handler, environment, permissions }: AdminApiRoutesParams) => {
    return AdminRoute.createRoute({
      ...baseParams,
      functionName: `${name}Handler`,
      handler,
      requestValidatorName: `${name}Validator`,
      environment,
      permissions,
    });
  };
};

export function createAdminApi(
  stack: Stack,
  globalConfig: GlobalConfig,
  certificateArn: string | undefined,
  database: IDatabase,
  brand: 'BLC_UK' | 'BLC_AU' | 'DDS_UK',
  vaultCodesUpload: VaultCodesUpload,
  dwhKenisisFirehoseStreams: DwhKenisisFirehoseStreams,
): ApiGatewayV1Api<Record<string, never>> {
  const config = RedemptionsStackConfigResolver.for(stack);
  const adminApi = new ApiGatewayV1Api(stack, 'redemptionsAdmin', {
    cdk: {
      restApi: {
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: isProduction(stack.stage)
                ? productionAdminDomainNames[brand]
                : stagingAdminDomainNames[brand],
              certificate: Certificate.fromCertificateArn(stack, 'AdminDomainCertificate', certificateArn),
            },
          }),
        deployOptions: {
          stageName: 'v1',
          metricsEnabled: true,
        },
        apiKeySourceType: ApiKeySourceType.HEADER,
      },
    },
  });

  const adminApiKey = adminApi.cdk.restApi.addApiKey('redemptions-admin-api-key', {
    apiKeyName: `${stack.stage}-redemptions-admin`,
  });
  const uniqodoApiKey = adminApi.cdk.restApi.addApiKey('redemptions-uniqodo-api-key', {
    apiKeyName: `${stack.stage}-redemptions-uniqodo`,
  });
  const eagleEyeApiKey = adminApi.cdk.restApi.addApiKey('redemptions-eagle-eye-api-key', {
    apiKeyName: `${stack.stage}-redemptions-eagle-eye`,
  });
  const adminApiUsagePlan = adminApi.cdk.restApi.addUsagePlan('redemptions-admin-api-usage-plan', {
    throttle: {
      rateLimit: 100,
      burstLimit: 20,
    },
    apiStages: [
      {
        api: adminApi.cdk.restApi,
        stage: adminApi.cdk.restApi.deploymentStage,
      },
    ],
  });
  adminApiUsagePlan.addApiKey(adminApiKey);

  const restAdminApi = adminApi.cdk.restApi;
  const adminApiGatewayModelGenerator = new ApiGatewayModelGenerator(adminApi.cdk.restApi);

  const baseParams = {
    apiGatewayModelGenerator: adminApiGatewayModelGenerator,
    database,
    restApi: restAdminApi,
    stack,
  };
  const uniqodoApiUsagePlan = adminApi.cdk.restApi.addUsagePlan('redemptions-uniqodo-api-usage-plan', {
    throttle: {
      rateLimit: 100,
      burstLimit: 20,
    },
    apiStages: [
      {
        api: adminApi.cdk.restApi,
        stage: adminApi.cdk.restApi.deploymentStage,
      },
    ],
  });
  uniqodoApiUsagePlan.addApiKey(uniqodoApiKey);

  const eagleEyeApiUsagePlan = adminApi.cdk.restApi.addUsagePlan('redemptions-eagle-eye-api-usage-plan', {
    throttle: {
      rateLimit: 100,
      burstLimit: 20,
    },
    apiStages: [
      {
        api: adminApi.cdk.restApi,
        stage: adminApi.cdk.restApi.deploymentStage,
      },
    ],
  });
  eagleEyeApiUsagePlan.addApiKey(eagleEyeApiKey);

  const firehosePutRecord = new PolicyStatement({
    actions: ['firehose:PutRecord'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });
  const secretsManagerGetSecretValue = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });

  const routeFactory = createRoutesFactory(baseParams);

  adminApi.addRoutes(stack, {
    'GET /batch/{vaultId}': routeFactory({
      name: 'GetVaultBatch',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/getVaultBatchHandler.handler',
    }),
    'POST /batch': routeFactory({
      name: 'CreateVaultBatch',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/createVaultBatchHandler.handler',
      environment: {
        [RedemptionsStackEnvironmentKeys.VAULT_CODES_UPLOAD_BUCKET]: vaultCodesUpload.setUp.getBucketName(),
      },
      permissions: [vaultCodesUpload.setUp.getPutObjectPolicyStatement()],
    }),
    'PATCH /batch': routeFactory({
      name: 'UpdateVaultBatch',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/updateVaultBatchHandler.handler',
    }),
    'DELETE /batch': routeFactory({
      name: 'DeleteVaultBatch',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/deleteVaultBatchHandler.handler',
    }),
    'POST /redemptions': routeFactory({
      name: 'CreateRedemptionConfig',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/redemptionConfig/createRedemptionConfigHandler.handler',
    }),
    'PATCH /redemptions/{offerId}': routeFactory({
      name: 'UpdateRedemptionConfig',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/redemptionConfig/updateRedemptionConfigHandler.handler',
    }),
    'GET /redemptions/{offerId}': routeFactory({
      name: 'GetRedemptionConfig',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/redemptionConfig/getRedemptionConfigHandler.handler',
    }),
    'POST /vault/webhook': AdminRoute.createRoute({
      apiGatewayModelGenerator: adminApiGatewayModelGenerator,
      stack,
      functionName: 'CallbackHandler',
      restApi: restAdminApi,
      database,
      handler: './packages/api/redemptions/application/handlers/adminApiGateway/callback/postCallbackHandler.handler',
      requestValidatorName: 'CallbackValidator',
      environment: {
        [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME]:
          dwhKenisisFirehoseStreams.callbackVaultRedemptionStream.getStreamName(),
        [RedemptionsStackEnvironmentKeys.SECRETS_MANAGER_NAME]: config.secretsManagerConfig.secretsManagerName,
      },
      permissions: [firehosePutRecord, secretsManagerGetSecretValue],
    }),
  });

  return adminApi;
}
