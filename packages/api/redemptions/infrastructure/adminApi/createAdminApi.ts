import { ApiKeySourceType } from 'aws-cdk-lib/aws-apigateway';
import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { AdminRoute } from '@blc-mono/redemptions/infrastructure/routes/adminRoute';

import { productionDomainNames, stagingDomainNames } from '../constants/domains';
import { IDatabase } from '../database/adapter';

type GlobalConfig = {
  apiGatewayEndpointTypes: EndpointType[];
};

export function createAdminApi(
  stack: Stack,
  globalConfig: GlobalConfig,
  certificateArn: string | undefined,
  database: IDatabase,
  brand: 'BLC_UK' | 'BLC_AU' | 'DDS_UK',
): ApiGatewayV1Api<Record<string, never>> {
  const adminApi = new ApiGatewayV1Api(stack, 'redemptionsAdmin', {
    cdk: {
      restApi: {
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: isProduction(stack.stage) ? productionDomainNames[brand] : stagingDomainNames[brand],
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
      rateLimit: 1,
      burstLimit: 2,
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

  adminApi.addRoutes(stack, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'GET /batch/{vaultId}': AdminRoute.createRoute({
      apiGatewayModelGenerator: adminApiGatewayModelGenerator,
      stack,
      functionName: 'GetVaultBatchHandler',
      restApi: restAdminApi,
      database,
      handler: 'packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/getVaultBatchHandler.handler',
      requestValidatorName: 'GetVaultBatchValidator',
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'POST /batch': AdminRoute.createRoute({
      apiGatewayModelGenerator: adminApiGatewayModelGenerator,
      stack,
      functionName: 'CreateVaultBatchHandler',
      restApi: restAdminApi,
      database,
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/createVaultBatchHandler.handler',
      requestValidatorName: 'CreateVaultBatchValidator',
    }),
    'PATCH /batch': AdminRoute.createRoute({
      apiGatewayModelGenerator: adminApiGatewayModelGenerator,
      stack,
      functionName: 'UpdateVaultBatchHandler',
      restApi: restAdminApi,
      database,
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/updateVaultBatchHandler.handler',
      requestValidatorName: 'UpdateVaultBatchValidator',
    }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    'DELETE /batch': AdminRoute.createRoute({
      apiGatewayModelGenerator: adminApiGatewayModelGenerator,
      stack,
      functionName: 'DeleteVaultBatchHandler',
      restApi: restAdminApi,
      database,
      handler:
        './packages/api/redemptions/application/handlers/adminApiGateway/vaultBatch/deleteVaultBatchHandler.handler',
      requestValidatorName: 'DeleteVaultBatchValidator',
    }),
  });

  return adminApi;
}
