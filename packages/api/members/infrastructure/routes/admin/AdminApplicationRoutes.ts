import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Bucket, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';

export function adminApplicationRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  memberProfilesTable: Table,
  memberOrganisationsTable: Table,
  documentUploadBucket: Bucket,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [memberProfilesTable, memberOrganisationsTable, documentUploadBucket],
  };

  return {
    'POST /admin/members/applications': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/createApplication.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CreateApplicationModel),
    }),
    'PUT /admin/members/applications': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/updateApplication.handler',
      requestModel: apiGatewayModelGenerator.generateModel(UpdateApplicationModel),
    }),
    'GET /admin/members/applications': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetAllApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getAllApplications.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApplicationModel),
    }),
    'GET /admin/members/applications/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplications.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApplicationModel),
    }),
    'GET /admin/members/applications/{memberId}/{applicationId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplication.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApplicationModel),
    }),
    'POST /admin/members/applications/{memberId}/{applicationId}/uploadDocument': Route.createRoute(
      {
        ...defaultRouteParams,
        name: 'AdminUploadDocument',
        handler:
          'packages/api/members/application/handlers/admin/applications/uploadDocument.handler',
        responseModel: apiGatewayModelGenerator.generateModel(DocumentUploadLocation),
      },
    ),
  };
}
