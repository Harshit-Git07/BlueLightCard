import { ApiKeySourceType } from 'aws-cdk-lib/aws-apigateway';
import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { AdminRoute } from '@blc-mono/redemptions/infrastructure/routes/adminRoute';

import { productionAdminDomainNames, stagingAdminDomainNames } from '../constants/domains';
import { IDatabase } from '../database/adapter';
import { VaultCodesUpload } from '../s3/vaultCodesUpload';

type GlobalConfig = {
  apiGatewayEndpointTypes: EndpointType[];
};

export function createAdminApi(
  stack: Stack,
  globalConfig: GlobalConfig,
  certificateArn: string | undefined,
  database: IDatabase,
  brand: 'BLC_UK' | 'BLC_AU' | 'DDS_UK',
  vaultCodesUpload: VaultCodesUpload,
): ApiGatewayV1Api<Record<string, never>> {
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

  adminApi.addRoutes(stack, {
    'GET /batch/{vaultId}': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'GetVaultBatchHandler',
      handler: 'packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/getVaultBatchHandler.handler',
      requestValidatorName: 'GetVaultBatchValidator',
    }),
    'POST /batch': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'CreateVaultBatchHandler',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/createVaultBatchHandler.handler',
      requestValidatorName: 'CreateVaultBatchValidator',
      environment: {
        [RedemptionsStackEnvironmentKeys.VAULT_CODES_UPLOAD_BUCKET]: vaultCodesUpload.setUp.getBucketName(),
      },
      permissions: [vaultCodesUpload.setUp.getPutObjectPolicyStatement()],
    }),
    'PATCH /batch': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'UpdateVaultBatchHandler',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/updateVaultBatchHandler.handler',
      requestValidatorName: 'UpdateVaultBatchValidator',
    }),
    'DELETE /batch': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'DeleteVaultBatchHandler',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/deleteVaultBatchHandler.handler',
      requestValidatorName: 'DeleteVaultBatchValidator',
    }),
    'POST /redemptions/{offerId}': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'CreateRedemptionConfigHandler',
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/redemptionConfig/createRedemptionConfigHandler.handler',
      requestValidatorName: 'CreateRedemptionConfigValidator',
    }),
    'GET /redemptions/{offerId}': AdminRoute.createRoute({
      ...baseParams,
      functionName: 'GetRedemptionsConfigHandler',
      restApi: restAdminApi,
      handler:
        'packages/api/redemptions/application/handlers/adminApiGateway/redemptionConfig/getRedemptionConfigHandler.handler',
      requestValidatorName: 'GetRedemptionsConfigValidator',
    }),
  });

  return adminApi;
}
