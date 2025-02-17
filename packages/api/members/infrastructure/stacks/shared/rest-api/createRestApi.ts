import { ApiGatewayV1Api, ApiGatewayV1ApiAuthorizer, App, Stack, use } from 'sst/constructs';
import { ApiGatewayAuthorizer } from '@blc-mono/core/identity/authorizer';
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { RequestValidator, ResponseType } from 'aws-cdk-lib/aws-apigateway';
import { Shared } from '../../../../../../../stacks/stack';
import { Identity } from '@blc-mono/identity/stack';
import { isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import {
  MemberStackConfig,
  memberStackConfiguration,
} from '@blc-mono/members/infrastructure/stacks/shared/config/config';

interface RestApi {
  api: ApiGatewayV1Api<{ memberAuthorizer: ApiGatewayV1ApiAuthorizer }>;
  requestValidator: RequestValidator;
  config: MemberStackConfig;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
}

export function createRestApi(app: App, stack: Stack, name: string): RestApi {
  const { certificateArn } = use(Shared);
  const { authorizer } = use(Identity);

  const authorizers =
    authorizer !== undefined
      ? { memberAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer) }
      : undefined;
  const config = memberStackConfiguration(stack);
  const globalConfig = GlobalConfigResolver.for(stack.stage);

  const api = new ApiGatewayV1Api(stack, name, {
    authorizers,
    defaults: {
      authorizer: authorizer !== undefined ? 'memberAuthorizer' : 'none',
    },
    cdk: {
      restApi: {
        ...((isProduction(stack.stage) || isStaging(stack.stage)) &&
          certificateArn && {
            domainName: {
              domainName: getDomainName(stack.stage, app.region, name),
              certificate: Certificate.fromCertificateArn(
                stack,
                'DomainCertificate',
                certificateArn,
              ),
            },
          }),
        deployOptions: {
          stageName: 'v1',
        },
        endpointTypes: globalConfig.apiGatewayEndpointTypes,
        defaultCorsPreflightOptions: {
          allowOrigins: config.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });

  const requestValidator = api.cdk.restApi.addRequestValidator('RequestValidator', {
    validateRequestBody: true,
    validateRequestParameters: true,
  });

  api.cdk.restApi.addGatewayResponse('BadRequestParametersResponse', {
    type: ResponseType.BAD_REQUEST_PARAMETERS,
    statusCode: '400',
    templates: {
      'application/json': JSON.stringify({
        error: '$context.error.validationErrorString',
      }),
    },
  });

  api.cdk.restApi.addGatewayResponse('BadRequestBodyResponse', {
    type: ResponseType.BAD_REQUEST_BODY,
    statusCode: '400',
    templates: {
      'application/json': JSON.stringify({
        error: '$context.error.validationErrorString',
      }),
    },
  });

  const apiKey = api.cdk.restApi.addApiKey('members-api-key', {
    apiKeyName: getApiKeyName(stack.stage, name),
  });

  const usagePlan = api.cdk.restApi.addUsagePlan('members-api-usage-plan', {
    name: getApiUsagePlanName(stack.stage, name),
    apiStages: [
      {
        api: api.cdk.restApi,
        stage: api.cdk.restApi.deploymentStage,
      },
    ],
  });
  usagePlan.addApiKey(apiKey);

  return {
    api,
    requestValidator,
    config,
    apiGatewayModelGenerator: new ApiGatewayModelGenerator(api.cdk.restApi),
  };
}

function getDomainName(stage: string, region: string, name: string): string {
  return region === 'ap-southeast-2'
    ? getAustraliaDomainName(stage, name)
    : getUkDomainName(stage, name);
}

function getAustraliaDomainName(stage: string, name: string): string {
  return isProduction(stage) ? `${name}-au.blcshine.io` : `${stage}-${name}-au.blcshine.io`;
}

function getUkDomainName(stage: string, name: string): string {
  if (isProduction(stage)) {
    return isDdsUkBrand() ? `${name}-dds-uk.blcshine.io` : `${name}.blcshine.io`;
  }

  return isDdsUkBrand() ? `${stage}-${name}-dds-uk.blcshine.io` : `${stage}-${name}.blcshine.io`;
}

function getApiKeyName(stage: string, name: string): string {
  return isProduction(stage) ? `${name}-key` : `${stage}-${name}-key`;
}

function getApiUsagePlanName(stage: string, name: string): string {
  return isProduction(stage) ? `${name}-usage-plan` : `${stage}-${name}-usage-plan`;
}
